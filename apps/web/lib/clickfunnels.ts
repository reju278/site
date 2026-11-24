/**
 * L'API de ClickFunnels, pour les inscriptions qui partent du serveur du site
 * (`actions.ts` de Formation Genesis et de Course modèle). **Côté serveur
 * seulement** : le jeton ne quitte jamais le serveur, et ce module n'est
 * importé que par des fichiers `"use server"`.
 *
 * Écrit une fois pour les deux tunnels : la même inscription en deux copies
 * aurait divergé à la première correction, et c'est un piège qui a déjà coûté
 * une soirée (voir `poserTag`).
 *
 * Les trois variables sont celles de `.env.example`, posées sur Vercel. Pour
 * un essai, les valeurs se lisent dans Convex Cloud (dépôt `Funnels-Club`) :
 * c'est le même workspace. Un essai crée un vrai contact.
 */

export type Resultat = { ok: true } | { ok: false; raison: string };

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ApiClickFunnels = {
  base: string;
  espace: string;
  entetes: Record<string, string>;
  /** Le nom du tunnel, en tête des erreurs du journal de Vercel. */
  tunnel: string;
};

/** L'adresse de l'API et ses en-têtes, ou `null` si une variable manque. */
export function apiClickFunnels(tunnel: string): ApiClickFunnels | null {
  const jeton = process.env.CLICKFUNNELS_API_TOKEN;
  const sousDomaine = process.env.CLICKFUNNELS_SUBDOMAIN;
  const espace = process.env.CLICKFUNNELS_WORKSPACE_ID;
  if (!jeton || !sousDomaine || !espace) {
    console.error(`${tunnel} : variables ClickFunnels absentes`);
    return null;
  }
  return {
    base: `https://${sousDomaine}.myclickfunnels.com/api/v2`,
    espace,
    tunnel,
    entetes: {
      Authorization: `Bearer ${jeton}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "site-funnels-club",
    },
  };
}

/** Crée ou complète le contact, retrouvé par son e-mail. Un champ absent de
 *  l'envoi garde sa valeur chez ClickFunnels. Rend l'identifiant du
 *  contact, ou l'échec. */
export async function upsertContact(
  api: ApiClickFunnels,
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
      `${api.tunnel} : contact`,
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

/**
 * Pose un tag sur le contact, **seulement s'il manque**.
 *
 * **Le tag se pose à part de l'`upsert`.** Passé dans l'`upsert`, il
 * remplacerait ceux qu'un contact déjà connu porte ; appliqué seul, il ne
 * touche à rien d'autre. C'est lui qui déclenche la séquence e-mail.
 *
 * **Le corps s'écrit `contacts_applied_tag`, au pluriel.** La première
 * version écrivait `contact_applied_tag` : ClickFunnels répondait 400
 * (« param is missing: contacts_applied_tag ») et **toute inscription
 * échouait** après avoir créé le contact. Relevé le 18 novembre 2026 sur un
 * contact de test ; c'est l'écriture du CRM (`clickfunnels.ts` du dépôt
 * `Funnels-Club`), qui tourne en production.
 *
 * **Lu avant d'être posé**, comme dans le CRM : une personne qui s'inscrit
 * deux fois ne relance pas la séquence, et le reposer ferait répondre 422
 * (« Tag has already been taken »), relevé lui aussi. La lecture est filtrée
 * sur le tag, et non la liste entière : elle est paginée par vingt, et un
 * contact ancien porte plus de vingt tags.
 */
export async function poserTag(
  api: ApiClickFunnels,
  contact: number,
  tag: number,
): Promise<Resultat> {
  const posees = await fetch(
    `${api.base}/contacts/${contact}/applied_tags?filter[tag_id]=${tag}`,
    { headers: api.entetes, cache: "no-store" },
  );
  if (!posees.ok) {
    console.error(
      `${api.tunnel} : tags posés`,
      posees.status,
      await posees.text(),
    );
    return { ok: false, raison: "clickfunnels" };
  }
  const liste = (await posees.json()) as { tag_id?: number }[];
  if (liste.some((t) => t.tag_id === tag)) return { ok: true };

  const pose = await fetch(`${api.base}/contacts/${contact}/applied_tags`, {
    method: "POST",
    headers: api.entetes,
    body: JSON.stringify({ contacts_applied_tag: { tag_id: tag } }),
    cache: "no-store",
  });
  if (!pose.ok) {
    console.error(`${api.tunnel} : tag`, pose.status, await pose.text());
    return { ok: false, raison: "clickfunnels" };
  }
  return { ok: true };
}
