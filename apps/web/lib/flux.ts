import { lettre } from "@/contenu/site";

/**
 * Les articles de la lettre, lus dans son flux RSS.
 *
 * Le flux est lu au build puis rafraîchi toutes les heures : les pages restent
 * statiques et servies par le CDN, et un article publié apparaît sans qu'on ait
 * à redéployer. C'est la seule donnée du site qui vienne de l'extérieur, et
 * elle ne justifie ni base ni serveur.
 *
 * Substack peut être lent ou indisponible. Dans ce cas la fonction renvoie une
 * liste vide plutôt que de faire échouer le build : une section d'articles
 * absente vaut mieux qu'un site qui ne se déploie pas.
 */

export type Article = {
  titre: string;
  chapeau: string;
  lien: string;
  date: string;
  /** L'illustration de couverture, absente sur certains articles. */
  image: string | null;
};

/** Une heure. Au-delà, la page est reconstruite à la prochaine visite. */
const FRAICHEUR = 3600;

/**
 * Le contenu d'une balise, `<![CDATA[…]]>` retiré.
 *
 * On lit du XML au lieu d'installer un analyseur : le flux Substack tient en
 * six balises par article, et une dépendance de plus pour ça ne se justifie
 * pas. Le `[\s\S]` remplace le point, qui ne franchit pas les retours à la
 * ligne.
 */
function balise(bloc: string, nom: string): string | null {
  const trouve = bloc.match(
    new RegExp(`<${nom}[^>]*>([\\s\\S]*?)</${nom}>`, "i")
  );
  if (!trouve?.[1]) return null;
  return trouve[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
}

/** Le texte nu : balises retirées, entités décodées. */
function texteNu(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function lireArticles(combien = 3): Promise<Article[]> {
  let xml: string;

  try {
    const reponse = await fetch(lettre.flux, {
      next: { revalidate: FRAICHEUR },
    });
    if (!reponse.ok) return [];
    xml = await reponse.text();
  } catch {
    return [];
  }

  const articles: Article[] = [];

  for (const bloc of xml.split("<item>").slice(1)) {
    const titre = balise(bloc, "title");
    const lien = balise(bloc, "link");
    if (!titre || !lien) continue;

    const image = bloc.match(/<enclosure[^>]*url="([^"]+)"/i)?.[1] ?? null;
    const brut = balise(bloc, "description") ?? "";

    articles.push({
      titre: texteNu(titre),
      chapeau: texteNu(brut),
      lien,
      date: balise(bloc, "pubDate") ?? "",
      image,
    });

    if (articles.length === combien) break;
  }

  return articles;
}

/** « 8 septembre 2026 ». Chaîne vide si la date du flux est illisible. */
export function formaterDate(date: string): string {
  const valeur = new Date(date);
  if (Number.isNaN(valeur.getTime())) return "";
  return valeur.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
