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
 * Un contact qui porte déjà le tag (deuxième inscription) fait répondre 422
 * au second appel : ce n'est pas un échec, la séquence est déjà lancée.
 *
 * Les trois variables sont celles de `.env.example`, déjà posées sur Vercel.
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

    const tag = await fetch(`${base}/contacts/${id}/applied_tags`, {
      method: "POST",
      headers: entetes,
      body: JSON.stringify({ contact_applied_tag: { tag_id: TAG_GENESIS.id } }),
      cache: "no-store",
    });
    if (!tag.ok && tag.status !== 422) {
      console.error("Formation Genesis : tag", tag.status, await tag.text());
      return { ok: false, raison: "clickfunnels" };
    }
    return { ok: true };
  } catch (erreur) {
    console.error("Formation Genesis : réseau", erreur);
    return { ok: false, raison: "reseau" };
  }
}
