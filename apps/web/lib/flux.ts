import { chaine, lettre, podcast } from "@/contenu/site";

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
  // `(?:\s[^>]*)?` et non `[^>]*` : sans la frontière, demander
  // `itunes:episode` attrape aussi `<itunes:episodeType>`, et demander `title`
  // attraperait un hypothétique `<titleImage>`. Le bogue est silencieux, il
  // rend juste une valeur d'à côté.
  const trouve = bloc.match(
    new RegExp(`<${nom}(?:\\s[^>]*)?>([\\s\\S]*?)</${nom}>`, "i")
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

/* ---------------------------------------------------------------------------
   Les vidéos YouTube.

   YouTube publie un flux Atom par chaîne, sans clé ni quota :
   `youtube.com/feeds/videos.xml?channel_id=…`. Il donne les quinze dernières
   vidéos, ce qui suffit largement pour une section d'accueil, et évite d'aller
   demander une clé d'API Data v3 et de compter des quotas pour afficher trois
   miniatures.

   Le format est de l'Atom et non du RSS : `<entry>` au lieu de `<item>`,
   `<published>` au lieu de `<pubDate>`, et le lien vit dans un attribut plutôt
   que dans le contenu d'une balise. D'où un lecteur distinct de celui de la
   lettre plutôt qu'un lecteur générique qui tenterait de couvrir les deux mal.
--------------------------------------------------------------------------- */

export type Video = {
  titre: string;
  lien: string;
  date: string;
  /** La miniature, reconstruite depuis l'identifiant. */
  image: string;
  /** Les shorts vivent sous /shorts/ et sont verticaux : à filtrer au besoin. */
  court: boolean;
};

export async function lireVideos(combien = 3): Promise<Video[]> {
  let xml: string;

  try {
    const reponse = await fetch(chaine.flux, { next: { revalidate: FRAICHEUR } });
    if (!reponse.ok) return [];
    xml = await reponse.text();
  } catch {
    return [];
  }

  const videos: Video[] = [];

  for (const bloc of xml.split("<entry>").slice(1)) {
    const id = balise(bloc, "yt:videoId");
    const titre = balise(bloc, "title");
    if (!id || !titre) continue;

    const lien = bloc.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i)?.[1];

    videos.push({
      titre: texteNu(titre),
      lien: lien ?? `https://www.youtube.com/watch?v=${id}`,
      date: balise(bloc, "published") ?? "",
      // `hqdefault` existe pour toute vidéo, y compris les shorts, là où
      // `maxresdefault` renvoie une image manquante sur les plus anciennes.
      image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      court: (lien ?? "").includes("/shorts/"),
    });

    if (videos.length === combien) break;
  }

  return videos;
}

/* ---------------------------------------------------------------------------
   Les épisodes du podcast.

   Le flux est celui d'Ausha, l'hébergeur : c'est lui qui alimente Apple
   Podcasts, Spotify et les autres. On lit donc la source et non l'une des
   vitrines, ce qui évite d'avoir à interroger trois plateformes qui disent la
   même chose avec trois formats différents.

   Le flux fait trois mégaoctets et porte plus de cinq cents épisodes. On
   s'arrête au nombre demandé au lieu de tout analyser : le reste se consulte
   sur les plateformes.
--------------------------------------------------------------------------- */

export type Episode = {
  titre: string;
  chapeau: string;
  lien: string;
  date: string;
  /** « 08:24 » tel que le flux le donne, ou chaîne vide. */
  duree: string;
  numero: string | null;
};

export async function lireEpisodes(combien = 12): Promise<Episode[]> {
  let xml: string;

  try {
    const reponse = await fetch(podcast.flux, { next: { revalidate: FRAICHEUR } });
    if (!reponse.ok) return [];
    xml = await reponse.text();
  } catch {
    return [];
  }

  const episodes: Episode[] = [];

  for (const bloc of xml.split("<item>").slice(1)) {
    const titre = balise(bloc, "title");
    const lien = balise(bloc, "link");
    if (!titre || !lien) continue;

    episodes.push({
      titre: texteNu(titre),
      chapeau: texteNu(balise(bloc, "description") ?? ""),
      lien,
      date: balise(bloc, "pubDate") ?? "",
      duree: balise(bloc, "itunes:duration") ?? "",
      numero: balise(bloc, "itunes:episode"),
    });

    if (episodes.length === combien) break;
  }

  return episodes;
}
