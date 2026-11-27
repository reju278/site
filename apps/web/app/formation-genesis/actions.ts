"use server";

import { optinGenesis, TAG_GENESIS } from "@/contenu/formation-genesis";
import {
  apiClickFunnels,
  EMAIL,
  poserTag,
  type Resultat,
  upsertContact,
} from "@/lib/clickfunnels";
import { refusEmail } from "@/lib/filtre-email-serveur";
import { NUMERO_INTERNATIONAL } from "@/lib/telephone";
import { after } from "next/server";

/**
 * L'inscription à la Formation Genesis, dans ClickFunnels, par son API
 * (issue #8). Côté serveur : le jeton ne quitte jamais le serveur. Les appels
 * eux-mêmes sont dans `lib/clickfunnels.ts`, partagés avec Course modèle.
 *
 * **Deux temps, au rythme du formulaire en trois étapes** de l'optin :
 *
 * 1. `inscrireGenesis`, à l'étape de l'e-mail : le contact est créé ou
 *    retrouvé (prénom, nom, e-mail, consentement), puis il reçoit le tag.
 *    **C'est là que la personne devient un contact**, et que la séquence
 *    part : quelqu'un qui s'arrête au téléphone reçoit quand même la
 *    formation par e-mail, ce qui est le but.
 * 2. `completerGenesis`, à l'étape du téléphone : le numéro s'ajoute au même
 *    contact, retrouvé par son e-mail. Rien d'autre n'est touché.
 * 3. `situerGenesis`, au dernier temps : la situation (et le chiffre
 *    d'affaires) en champs personnalisés, après la réponse.
 *
 * Le tag est posé à part et seulement s'il manque (voir `poserTag`) : c'est
 * lui qui déclenche la séquence e-mail.
 *
 * **Le consentement part comme sur `/course`**, en champ personnalisé
 * « consentement » à « oui » : la case est obligatoire dans le formulaire,
 * donc tout contact arrivé par ici l'a cochée.
 */

const TUNNEL = "Formation Genesis";

export async function inscrireGenesis(
  prenom: string,
  nom: string,
  email: string,
): Promise<Resultat> {
  const prenomPropre = prenom.trim().slice(0, 100);
  const nomPropre = nom.trim().slice(0, 100);
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  if (!prenomPropre || !nomPropre || !EMAIL.test(emailPropre))
    return { ok: false, raison: "champs" };
  // Le filtre des faux e-mails, avant ClickFunnels (`filtre-email.ts`).
  if (await refusEmail(emailPropre, TUNNEL)) return { ok: false, raison: "email" };

  const api = apiClickFunnels(TUNNEL);
  if (!api) return { ok: false, raison: "configuration" };

  try {
    const id = await upsertContact(api, {
      email_address: emailPropre,
      first_name: prenomPropre,
      last_name: nomPropre,
      custom_attributes: { consentement: "oui" },
    });
    if (typeof id !== "number") return id;
    return await poserTag(api, id, TAG_GENESIS.id);
  } catch (erreur) {
    console.error(`${TUNNEL} : réseau`, erreur);
    return { ok: false, raison: "reseau" };
  }
}

export async function completerGenesis(
  email: string,
  telephone: string,
): Promise<Resultat> {
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  if (!EMAIL.test(emailPropre) || !NUMERO_INTERNATIONAL.test(telephone))
    return { ok: false, raison: "champs" };

  const api = apiClickFunnels(TUNNEL);
  if (!api) return { ok: false, raison: "configuration" };

  try {
    const id = await upsertContact(api, {
      email_address: emailPropre,
      phone_number: telephone,
    });
    return typeof id === "number" ? { ok: true } : id;
  } catch (erreur) {
    console.error(`${TUNNEL} : réseau`, erreur);
    return { ok: false, raison: "reseau" };
  }
}

/**
 * Ce qui décrit le mieux la personne, après le téléphone (les questions de
 * Direct Webinar (N), sur demande de Rémy le 27 novembre 2026) : le champ
 * personnalisé `genesis_situation`, et pour qui a déjà une activité son
 * chiffre d'affaires, `genesis_ca`, que ClickFunnels crée au premier envoi
 * comme ceux de N (`course_modele_situation`, `course_modele_ca`). Des
 * champs à ce tunnel : une personne passée par les deux garde ses deux
 * réponses. Retrouvé par son adresse, **après la réponse** (`after`) :
 * l'espace s'ouvre sans attendre ClickFunnels. Le contact existe déjà, posé
 * à l'e-mail.
 */
export async function situerGenesis(
  email: string,
  situation: string,
  /** Le chiffre d'affaires, pour qui a déjà une activité. */
  ca?: string,
): Promise<Resultat> {
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  const { situations, chiffresAffaires } = optinGenesis.formulaire;
  const choix = situations.find((s) => s.valeur === situation);
  const niveau = chiffresAffaires.find((c) => c.valeur === ca);
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
            genesis_situation: choix.libelle,
            ...(niveau ? { genesis_ca: niveau.libelle } : {}),
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
