"use server";

import { optinCourseModele, TAG_COURSE_MODELE } from "@/contenu/course-modele";
import {
  type ApiClickFunnels,
  apiClickFunnels,
  EMAIL,
  poserTag,
  type Resultat,
  upsertContact,
} from "@/lib/clickfunnels";
import { refusEmail } from "@/lib/filtre-email-serveur";
import { after } from "next/server";

/**
 * L'inscription de Course modèle dans ClickFunnels, par son API, comme celle
 * de Formation Genesis (`lib/clickfunnels.ts`). Côté serveur : le jeton ne
 * quitte jamais le serveur.
 *
 * **Deux temps, comme Genesis** (la fenêtre en a trois depuis le 24 novembre
 * 2026) : à l'e-mail, `inscrireCourseModele` crée ou retrouve le contact
 * (prénom, nom, e-mail) puis lui pose le tag « course-2025 », à part et
 * seulement s'il manque : c'est lui qui déclenche l'automatisation. Le
 * consentement part en champ personnalisé « consentement » à « oui », comme
 * pour `/course` et Genesis. Au dernier temps, `situerCourseModele` ajoute ce
 * qui décrit la personne au même contact. Les deux passent par l'`upsert` de
 * ClickFunnels,
 * qui retrouve le contact par son adresse : l'ordre où ils aboutissent ne
 * change rien.
 *
 * **L'inscription part après la réponse** (`after`), et la page passe aussitôt
 * à la vidéo. Mesuré le 24 novembre 2026 : 9,7 s pour un contact neuf (la
 * création, la lecture des tags, la pose), 1,5 s pour un contact connu. Une
 * page de publicité ne fait pas attendre dix secondes devant « Envoi… » ;
 * Rémy a demandé la même chose pour Genesis (« instantanément »). Ce qui se
 * vérifie d'avance l'est ici (prénom, adresse, variables) ; ClickFunnels est
 * retenté une fois, et un échec se lit dans le journal de Vercel. Le CRM, lui,
 * reçoit l'opt-in par ailleurs : la personne n'est jamais perdue de vue.
 */

const TUNNEL = "Course modèle";

async function inscrire(
  api: ApiClickFunnels,
  prenom: string,
  nom: string,
  email: string,
): Promise<Resultat> {
  try {
    const id = await upsertContact(api, {
      email_address: email,
      first_name: prenom,
      ...(nom ? { last_name: nom } : {}),
      custom_attributes: { consentement: "oui" },
    });
    if (typeof id !== "number") return id;
    return await poserTag(api, id, TAG_COURSE_MODELE.id);
  } catch (erreur) {
    console.error(`${TUNNEL} : réseau`, erreur);
    return { ok: false, raison: "reseau" };
  }
}

export async function inscrireCourseModele(
  prenom: string,
  nom: string,
  email: string,
): Promise<Resultat> {
  const prenomPropre = prenom.trim().slice(0, 100);
  const nomPropre = nom.trim().slice(0, 100);
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  if (!prenomPropre || !EMAIL.test(emailPropre))
    return { ok: false, raison: "champs" };
  // Le filtre des faux e-mails, avant ClickFunnels (`filtre-email.ts`).
  if (await refusEmail(emailPropre, TUNNEL)) return { ok: false, raison: "email" };

  const api = apiClickFunnels(TUNNEL);
  if (!api) return { ok: false, raison: "configuration" };

  after(async () => {
    let resultat = await inscrire(api, prenomPropre, nomPropre, emailPropre);
    /* Une adresse que ClickFunnels refuse (422) ne passera pas mieux la
       seconde fois ; une panne passagère, si. */
    if (!resultat.ok && resultat.raison !== "champs") {
      await new Promise((attente) => setTimeout(attente, 2000));
      resultat = await inscrire(api, prenomPropre, nomPropre, emailPropre);
    }
    if (!resultat.ok)
      console.error(`${TUNNEL} : inscription perdue (${resultat.raison})`);
  });
  return { ok: true };
}

/**
 * Ce qui décrit le mieux la personne, au dernier temps de la fenêtre : un
 * champ personnalisé du contact, `course_modele_situation`, que ClickFunnels
 * crée au premier envoi (comme les réponses des quiz) ; et, pour qui a déjà
 * une activité, son chiffre d'affaires, `course_modele_ca`. Retrouvé par son
 * adresse, **après la réponse** lui aussi (`after`) : la page passe à la
 * vidéo sans attendre ClickFunnels.
 */
export async function situerCourseModele(
  email: string,
  situation: string,
  /** Le chiffre d'affaires, pour qui a déjà une activité. */
  ca?: string,
): Promise<Resultat> {
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  const choix = optinCourseModele.fenetre.situations.find(
    (s) => s.valeur === situation,
  );
  const niveau = optinCourseModele.fenetre.chiffresAffaires.find(
    (c) => c.valeur === ca,
  );
  if (!EMAIL.test(emailPropre) || !choix)
    return { ok: false, raison: "champs" };

  const api = apiClickFunnels(TUNNEL);
  if (!api) return { ok: false, raison: "configuration" };

  after(async () => {
    const poser = async () => {
      try {
        const id = await upsertContact(api, {
          email_address: emailPropre,
          custom_attributes: {
            course_modele_situation: choix.libelle,
            // Le chiffre d'affaires, champ `course_modele_ca`, créé par
            // ClickFunnels au premier envoi comme la situation.
            ...(niveau ? { course_modele_ca: niveau.libelle } : {}),
          },
        });
        return typeof id === "number";
      } catch (erreur) {
        console.error(`${TUNNEL} : réseau`, erreur);
        return false;
      }
    };
    if (await poser()) return;
    await new Promise((attente) => setTimeout(attente, 2000));
    if (!(await poser())) console.error(`${TUNNEL} : situation perdue`);
  });
  return { ok: true };
}
