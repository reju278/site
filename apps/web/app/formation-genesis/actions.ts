"use server";

import { TAG_GENESIS } from "@/contenu/formation-genesis";

/**
 * L'inscription à la Formation Genesis, dans ClickFunnels, par son API
 * (issue #8). Côté serveur : le jeton ne quitte jamais le serveur.
 *
 * **Deux appels et non un.** Le contact est d'abord créé ou retrouvé par son
 * e-mail (`contacts/upsert`), puis le tag lui est appliqué
 * (`contacts/<id>/applied_tags`). Le tag passé dans l'`upsert` remplacerait
 * ceux qu'un contact déjà connu porte ; l'appliquer à part ne touche à rien
 * d'autre. C'est le tag qui déclenche la séquence e-mail dans ClickFunnels.
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
 * Les trois variables sont celles de `.env.example`, posées sur Vercel.
 */

type Resultat = { ok: true } | { ok: false; raison: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function inscrireGenesis(
  prenom: string,
  email: string,
): Promise<Resultat> {
  const prenomPropre = prenom.trim().slice(0, 100);
  const emailPropre = email.trim().toLowerCase().slice(0, 200);
  if (!prenomPropre || !EMAIL.test(emailPropre))
    return { ok: false, raison: "champs" };

  const jeton = process.env.CLICKFUNNELS_API_TOKEN;
  const sousDomaine = process.env.CLICKFUNNELS_SUBDOMAIN;
  const espace = process.env.CLICKFUNNELS_WORKSPACE_ID;
  if (!jeton || !sousDomaine || !espace) {
    console.error("Formation Genesis : variables ClickFunnels absentes");
    return { ok: false, raison: "configuration" };
  }

  const base = `https://${sousDomaine}.myclickfunnels.com/api/v2`;
  const entetes = {
    Authorization: `Bearer ${jeton}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "site-funnels-club",
  };

  try {
    const contact = await fetch(
      `${base}/workspaces/${espace}/contacts/upsert`,
      {
        method: "POST",
        headers: entetes,
        body: JSON.stringify({
          contact: { email_address: emailPropre, first_name: prenomPropre },
        }),
        cache: "no-store",
      },
    );
    if (!contact.ok) {
      console.error(
        "Formation Genesis : contact",
        contact.status,
        await contact.text(),
      );
      return {
        ok: false,
        raison: contact.status === 422 ? "champs" : "clickfunnels",
      };
    }
    const { id } = (await contact.json()) as { id?: number };
    if (!id) return { ok: false, raison: "clickfunnels" };

    /* Filtré sur le tag, et non la liste entière : elle est paginée par
       vingt, et un contact ancien porte plus de vingt tags. */
    const posees = await fetch(
      `${base}/contacts/${id}/applied_tags?filter[tag_id]=${TAG_GENESIS.id}`,
      { headers: entetes, cache: "no-store" },
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

    const tag = await fetch(`${base}/contacts/${id}/applied_tags`, {
      method: "POST",
      headers: entetes,
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
