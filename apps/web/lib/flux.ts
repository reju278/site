import { assainir } from "@/lib/article-substack";
import { chaine, chaines, lettre, podcast } from "@/contenu/site";

/** `https://lettre.funnels.club/p/mon-titre` donne `mon-titre`. */
function slugDepuis(lien: string): string {
  const propre = lien.split("?")[0]?.replace(/\/$/, "") ?? lien;
  return propre.slice(propre.lastIndexOf("/") + 1);
}

/**
 * Un lien de la lettre devient un lien du site.
 *
 * Quand un article en cite un autre, le lien pointe chez Substack. Le réécrire
 * garde le lecteur ici et transforme les renvois que Rémy a déjà écrits en
 * maillage interne, ce qui est le levier que `AGENTS.md` décrit comme le plus
 * fort. Tout ce qui n'est pas une adresse d'article de la lettre est laissé
 * intact : une page d'accueil Substack ou un lien d'abonnement n'a pas
 * d'équivalent chez nous.
 */
function versArticleDuSite(href: string): string | null {
  const trouve = href.match(
    /^https?:\/\/lettre\.funnels\.club\/p\/([a-z0-9-]+)/i,
  );
  return trouve ? `/articles/${trouve[1]}` : null;
}

/** Les articles qui ont un corps : les seuls qui puissent avoir une page. */
export function articlesPublies(articles: readonly Article[]): Article[] {
  return articles.filter((a) => a.contenu.length > 0 && a.slug.length > 0);
}

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
  /** L'adresse de l'article sur Substack, gardée pour la mention de source. */
  lien: string;
  /**
   * Le dernier segment de l'adresse Substack, qui devient `/articles/<slug>`.
   *
   * Il vient de Substack et n'est pas recalculé à partir du titre : un titre
   * peut être corrigé après publication, une adresse non. Recalculer ferait
   * changer notre adresse sous les pieds de Google à chaque retouche.
   */
  slug: string;
  date: string;
  /** L'illustration de couverture, absente sur certains articles. */
  image: string | null;
  /**
   * Les cotes de la couverture, relues dans le nom du fichier.
   *
   * Substack laisse `…_2816x1536.jpeg` dans l'adresse. Sans elles, le
   * navigateur ne réserve pas la place et la page saute au chargement : c'est
   * le décalage de mise en page, et il est mesuré. Voir `AGENTS.md`.
   */
  imageLargeur: number | null;
  imageHauteur: number | null;
  /** L'auteur déclaré par le flux. */
  auteur: string | null;
  /**
   * Le corps de l'article, assaini et réduit aux balises que le site rend.
   *
   * Il est vide quand le flux ne porte pas de `content:encoded`, ce qui arrive
   * sur un article payant dont Substack ne diffuse que l'accroche. Une page
   * sans corps ne se publie pas : voir `articlesPublies`.
   */
  contenu: string;
};

/**
 * La description d'une page d'article, entre 120 et 160 caractères.
 *
 * Le flux donne un sous-titre, mais il fait souvent moins de cent caractères,
 * ce qui laisse la moitié de la place vide dans une page de résultats. **Rien
 * n'est inventé pour combler** : on complète avec les premières phrases de
 * l'article, qui sont de Rémy, et on coupe au mot.
 */
export function resume(article: Article): string {
  const nu = texteNu(article.contenu);
  const base =
    article.chapeau.length >= 120
      ? article.chapeau
      : `${article.chapeau} ${nu}`.trim();
  if (base.length <= 160) return base;
  const coupe = base.slice(0, 157);
  return `${coupe.slice(0, coupe.lastIndexOf(" "))}…`;
}

/**
 * Dix minutes. Au-delà, la page est reconstruite à la prochaine visite.
 *
 * C'était une heure. Rémy veut qu'un article publié apparaisse **dès** que le
 * flux le porte, et une heure est le délai qu'on attend le moins bien : c'est
 * aussi la fenêtre pendant laquelle l'adresse d'un article tout neuf peut
 * encore rendre un 404, faute d'être dans le flux en cache.
 *
 * Dix minutes coûtent six relectures par heure d'un flux de 458 Ko, mis en
 * cache par Next puisqu'il tient sous la limite de deux mégaoctets. Le flux du
 * podcast, lui, la dépasse et n'est pas mis en cache : c'est la différence à
 * garder en tête avant de baisser ce nombre davantage.
 */
const FRAICHEUR = 600;

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
    const corps = balise(bloc, "content:encoded") ?? "";

    const cotes = image?.match(/_(\d{2,5})x(\d{2,5})\.[a-z]+/i) ?? null;

    articles.push({
      titre: texteNu(titre),
      chapeau: texteNu(brut),
      lien,
      slug: slugDepuis(lien),
      date: balise(bloc, "pubDate") ?? "",
      image,
      imageLargeur: cotes ? Number(cotes[1]) : null,
      imageHauteur: cotes ? Number(cotes[2]) : null,
      auteur: balise(bloc, "dc:creator"),
      /* Le corps est assaini ici et pas à l'affichage : il ne doit exister
         qu'une seule version du texte dans le site, celle qui est sûre. */
      contenu: assainir(corps, { resoudreLien: versArticleDuSite }),
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

/* ---------------------------------------------------------------------------
   La dernière vidéo de chaque chaîne.

   Trois flux Atom lus en parallèle, une vidéo retenue par flux : c'est ce que
   montre la section « Mes dernières vidéos » de l'accueil.

   **En parallèle et non l'un après l'autre.** Trois attentes qui se suivent
   s'additionnent dans le temps de rendu de la page ; lancées ensemble, elles
   coûtent la plus lente des trois. Et une chaîne qui tombe n'emporte pas les
   deux autres : son entrée disparaît de la grille, les autres restent.
--------------------------------------------------------------------------- */

export type DerniereVideo = Video & {
  /** Le nom de la chaîne, affiché sous le titre. */
  chaine: string;
  /** L'adresse de la chaîne, pour le lien « voir la chaîne ». */
  chaineHref: string;
};

/**
 * La dernière vidéo de chaque chaîne, dans l'ordre de `chaines`.
 *
 * **Les shorts sont écartés.** Ils sont verticaux, donc leur vignette est un
 * portrait recadré de force dans une fiche en 16/9, et ce sont des formats
 * courts qui ne représentent pas la chaîne. On prend la première vidéo qui n'en
 * est pas un.
 *
 * Une chaîne sans vidéo utilisable, ou dont le flux ne répond pas, ne rend rien
 * plutôt que de faire échouer la page : la section s'affiche avec ce qu'elle a,
 * et disparaît si elle n'a rien.
 */
export async function lireDernieresVideos(): Promise<DerniereVideo[]> {
  const lectures = chaines.map(async (ch) => {
    let xml: string;

    try {
      const reponse = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.identifiant}`,
        { next: { revalidate: FRAICHEUR } }
      );
      if (!reponse.ok) return null;
      xml = await reponse.text();
    } catch {
      return null;
    }

    for (const bloc of xml.split("<entry>").slice(1)) {
      const id = balise(bloc, "yt:videoId");
      const titre = balise(bloc, "title");
      if (!id || !titre) continue;

      const lien =
        bloc.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i)?.[1] ??
        `https://www.youtube.com/watch?v=${id}`;

      if (lien.includes("/shorts/")) continue;

      return {
        titre: texteNu(titre),
        lien,
        date: balise(bloc, "published") ?? "",
        // `hqdefault` et non `maxresdefault` : la première existe pour toute
        // vidéo, la seconde manque sur celles qui n'ont jamais été servies en
        // haute définition, et une vignette absente rend une image cassée sans
        // que rien ne le signale. Elle est en 4/3 : c'est la fiche qui la
        // recadre en 16/9, voir le commentaire du composant.
        image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        court: false,
        chaine: ch.nom,
        chaineHref: ch.href,
      } satisfies DerniereVideo;
    }

    return null;
  });

  return (await Promise.all(lectures)).filter((v) => v !== null);
}
