"use server";

import { TAG_COURSE_MODELE } from "@/contenu/course-modele";
import {
  type ApiClickFunnels,
  apiClickFunnels,
  EMAIL,
  poserTag,
  type Resultat,
  upsertContact,
} from "@/lib/clickfunnels";
import { after } from "next/server";

/**
 * L'inscription de Course modèle dans ClickFunnels, par son API, comme celle
 * de Formation Genesis (`lib/clickfunnels.ts`). Côté serveur : le jeton ne
 * quitte jamais le serveur.
 *
 * **Un seul temps** : la fenêtre ne demande que le prénom, l'e-mail et le
 * consentement. Le contact est créé ou retrouvé, puis il reçoit le tag
 * « course-2025 », posé à part et seulement s'il manque : c'est lui qui
 * déclenche l'automatisation. Le consentement part en champ personnalisé
 * « consentement » à « oui », comme pour `/course` et Genesis.
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
  email: string,
): Promise<Resultat> {
  try {
    const id = await upsertContact(api, {
      email_address: email,
      first_name: prenom,
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
  email: string,
): Promise<Resultat> {
  const prenomPropre = prenom.trim().slice(0, 100);
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  if (!prenomPropre || !EMAIL.test(emailPropre))
    return { ok: false, raison: "champs" };

  const api = apiClickFunnels(TUNNEL);
  if (!api) return { ok: false, raison: "configuration" };

  after(async () => {
    let resultat = await inscrire(api, prenomPropre, emailPropre);
    /* Une adresse que ClickFunnels refuse (422) ne passera pas mieux la
       seconde fois ; une panne passagère, si. */
    if (!resultat.ok && resultat.raison !== "champs") {
      await new Promise((attente) => setTimeout(attente, 2000));
      resultat = await inscrire(api, prenomPropre, emailPropre);
    }
    if (!resultat.ok)
      console.error(`${TUNNEL} : inscription perdue (${resultat.raison})`);
  });
  return { ok: true };
}
