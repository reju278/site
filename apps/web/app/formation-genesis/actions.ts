"use server";

import { TAG_GENESIS } from "@/contenu/formation-genesis";
import { NUMERO_INTERNATIONAL } from "@/lib/telephone";

/**
 * L'inscription à la Formation Genesis, dans ClickFunnels, par son API
 * (issue #8). Côté serveur : le jeton ne quitte jamais le serveur.
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
 *
 * **Le tag se pose à part de l'`upsert`.** Passé dans l'`upsert`, il
 * remplacerait ceux qu'un contact déjà connu porte ; appliqué seul, il ne
 * touche à rien d'autre. C'est lui qui déclenche la séquence e-mail.
 *
 * **Le corps s'écrit `contacts_applied_tag`, au pluriel.** La première
 * version écrivait `contact_applied_tag` : ClickFunnels répondait 400
 * (« param is missing: contacts_applied_tag ») et **toute inscription
 * échouait** après avoir créé le contact. Relevé le 18 novembre 2026 sur un
 * contact de test, avec les valeurs de Convex Cloud ; c'est l'écriture du
 * CRM (`clickfunnels.ts` du dépôt `Funnels-Club`), qui tourne en production.
 *
 * **Le tag n'est posé que s'il manque**, comme dans le CRM : une personne qui
 * s'inscrit deux fois ne relance pas la séquence. Le reposer ferait répondre
 * 422 (« Tag has already been taken »), relevé lui aussi.
 *
 * **Le consentement part comme sur `/course`**, en champ personnalisé
 * « consentement » à « oui » : la case est obligatoire dans le formulaire,
 * donc tout contact arrivé par ici l'a cochée.
 *
 * Les trois variables sont celles de `.env.example`, posées sur Vercel.
 */

type Resultat = { ok: true } | { ok: false; raison: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** L'adresse de l'API et ses en-têtes, ou `null` si une variable manque. */
function clickfunnels() {
  const jeton = process.env.CLICKFUNNELS_API_TOKEN;
  const sousDomaine = process.env.CLICKFUNNELS_SUBDOMAIN;
  const espace = process.env.CLICKFUNNELS_WORKSPACE_ID;
  if (!jeton || !sousDomaine || !espace) {
    console.error("Formation Genesis : variables ClickFunnels absentes");
    return null;
  }
  return {
    base: `https://${sousDomaine}.myclickfunnels.com/api/v2`,
    espace,
    entetes: {
      Authorization: `Bearer ${jeton}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "site-funnels-club",
    },
  };
}

/** Crée ou complète le contact, retrouvé par son e-mail. Un champ absent de
 *  l'envoi garde sa valeur chez ClickFunnels. */
async function upsert(
  api: NonNullable<ReturnType<typeof clickfunnels>>,
  contact: Record<string, unknown>,
): Promise<number | Resultat> {
  const reponse = await fetch(
    `${api.base}/workspaces/${api.espace}/contacts/upsert`,
    {
      method: "POST",
      headers: api.entetes,
      body: JSON.stringify({ contact }),
      cache: "no-store",
    },
  );
  if (!reponse.ok) {
    console.error(
      "Formation Genesis : contact",
      reponse.status,
      await reponse.text(),
    );
    return {
      ok: false,
      raison: reponse.status === 422 ? "champs" : "clickfunnels",
    };
  }
  const { id } = (await reponse.json()) as { id?: number };
  return id ?? { ok: false, raison: "clickfunnels" };
}

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

  const api = clickfunnels();
  if (!api) return { ok: false, raison: "configuration" };

  try {
    const id = await upsert(api, {
      email_address: emailPropre,
      first_name: prenomPropre,
      last_name: nomPropre,
      custom_attributes: { consentement: "oui" },
    });
    if (typeof id !== "number") return id;

    /* Filtré sur le tag, et non la liste entière : elle est paginée par
       vingt, et un contact ancien porte plus de vingt tags. */
    const posees = await fetch(
      `${api.base}/contacts/${id}/applied_tags?filter[tag_id]=${TAG_GENESIS.id}`,
      { headers: api.entetes, cache: "no-store" },
    );
    if (!posees.ok) {
      console.error(
        "Formation Genesis : tags posés",
        posees.status,
        await posees.text(),
      );
      return { ok: false, raison: "clickfunnels" };
    }
    const liste = (await posees.json()) as { tag_id?: number }[];
    if (liste.some((t) => t.tag_id === TAG_GENESIS.id)) return { ok: true };

    const tag = await fetch(`${api.base}/contacts/${id}/applied_tags`, {
      method: "POST",
      headers: api.entetes,
      body: JSON.stringify({
        contacts_applied_tag: { tag_id: TAG_GENESIS.id },
      }),
      cache: "no-store",
    });
    if (!tag.ok) {
      console.error("Formation Genesis : tag", tag.status, await tag.text());
      return { ok: false, raison: "clickfunnels" };
    }
    return { ok: true };
  } catch (erreur) {
    console.error("Formation Genesis : réseau", erreur);
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

  const api = clickfunnels();
  if (!api) return { ok: false, raison: "configuration" };

  try {
    const id = await upsert(api, {
      email_address: emailPropre,
      phone_number: telephone,
    });
    return typeof id === "number" ? { ok: true } : id;
  } catch (erreur) {
    console.error("Formation Genesis : réseau", erreur);
    return { ok: false, raison: "reseau" };
  }
}
