/**
 * Le corps d'un article Substack, rendu sûr et réduit à ce que le site sait
 * afficher.
 *
 * **Pourquoi une transformation et pas un `dangerouslySetInnerHTML` direct.**
 * Le flux ne porte pas de l'HTML d'article, il porte de l'HTML de page
 * Substack : sur les vingt articles, on compte 1 040 `div`, 220 `button`,
 * 86 `form`, 86 `input` et 42 `iframe`. Ce sont les encarts d'abonnement, les
 * boutons de partage et les habillages de leur éditeur. Recopiés tels quels,
 * ils injecteraient des formulaires d'inscription à une autre plateforme au
 * milieu de nos pages, et du balisage qui n'a aucun sens hors de chez eux.
 *
 * **C'est une liste blanche qui reconstruit, pas une liste noire qui retire.**
 * La différence n'est pas de style : une expression rationnelle qui efface les
 * `<script>` se contourne, alors qu'une sortie réécrite balise par balise ne
 * peut contenir que ce qu'on a explicitement émis. Tout ce qui n'est pas dans
 * `BALISES` disparaît, ses enfants restent, et **aucun attribut ne survit** sauf
 * ceux listés ici.
 *
 * **Les iframes sont le seul cas où l'on garde un élément actif**, et seulement
 * depuis `youtube-nocookie.com`, la seule origine que le flux contienne. Une
 * vidéo intégrée fait partie de l'article ; la retirer amputerait le contenu.
 */

/** Ce qui a le droit d'exister dans le corps d'un article. */
const BALISES = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "figure",
  "figcaption",
  "strong",
  "em",
  "a",
  "img",
  "hr",
  "br",
  "code",
  "pre",
]);

/** Celles qui ne portent rien et ne se ferment pas. */
const VIDES = new Set(["img", "hr", "br"]);

/** `<b>` et `<i>` disent une graisse, `<strong>` et `<em>` disent un sens. */
const RENOMME: Record<string, string> = { b: "strong", i: "em" };

/**
 * L'origine unique d'où une vidéo intégrée est acceptée.
 *
 * En liste blanche, et comparée sur l'origine entière : un test sur
 * `includes("youtube-nocookie.com")` laisserait passer
 * `https://mechant.example/?x=youtube-nocookie.com`.
 */
const VIDEO_AUTORISEE = "https://www.youtube-nocookie.com/";

/** Les seules adresses qu'un lien a le droit de porter. */
function lienSain(href: string): boolean {
  const v = href.trim().toLowerCase();
  return (
    v.startsWith("https://") ||
    v.startsWith("http://") ||
    v.startsWith("mailto:") ||
    v.startsWith("/") ||
    v.startsWith("#")
  );
}

/** `…_2816x1536.jpeg` : les dimensions que Substack laisse dans le nom. */
function dimensions(url: string): { l: number; h: number } | null {
  const trouve = decodeURIComponent(url).match(/_(\d{2,5})x(\d{2,5})\.[a-z]+/i);
  if (!trouve) return null;
  const l = Number(trouve[1]);
  const h = Number(trouve[2]);
  return l > 0 && h > 0 ? { l, h } : null;
}

function echapperAttribut(valeur: string): string {
  return valeur.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Les attributs d'une balise, lus sans se laisser piéger par les guillemets. */
function attributs(brut: string): Record<string, string> {
  const sortie: Record<string, string> = {};
  for (const t of brut.matchAll(
    /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g,
  )) {
    const cle = t[1];
    if (!cle) continue;
    sortie[cle.toLowerCase()] = t[3] ?? t[4] ?? t[5] ?? "";
  }
  return sortie;
}

export type OptionsAssainissement = {
  /**
   * Réécrit une adresse sortante en adresse du site quand elle y existe.
   *
   * C'est ce qui fait qu'un article qui cite un autre article de la lettre
   * pointe vers notre page et non vers Substack : le maillage interne se
   * construit tout seul, à partir des liens que Rémy a déjà écrits.
   */
  resoudreLien?: (href: string) => string | null;
};

export function assainir(
  html: string,
  { resoudreLien }: OptionsAssainissement = {},
): string {
  const sortie: string[] = [];
  /** Ce qui est ouvert, et si on a émis la balise ouvrante. */
  const pile: { nom: string; garde: boolean }[] = [];

  const jetons = html.matchAll(
    /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>|([^<]+)/g,
  );

  for (const jeton of jetons) {
    const [entier, fermante, nomBrut, brut, texte] = jeton;

    if (texte !== undefined) {
      /* Le texte est repris tel quel : la capture s'arrête au premier `<`,
         donc il ne peut pas porter de balise. Les entités déjà écrites par
         Substack restent valides. */
      sortie.push(texte);
      continue;
    }
    if (entier.startsWith("<!--")) continue;

    const minuscule = (nomBrut ?? "").toLowerCase();
    const nom = RENOMME[minuscule] ?? minuscule;

    if (fermante) {
      /* On dépile jusqu'à la balise correspondante : Substack ferme parfois
         mal, et sans ça une fermeture orpheline viderait la pile. */
      for (let i = pile.length - 1; i >= 0; i--) {
        if (pile[i]!.nom !== nom) continue;
        if (pile[i]!.garde) sortie.push(`</${nom}>`);
        pile.length = i;
        break;
      }
      continue;
    }

    const attr = attributs(brut ?? "");

    if (nom === "iframe") {
      const src = attr.src ?? "";
      if (!src.startsWith(VIDEO_AUTORISEE)) continue;
      const titre = attr.title?.trim() || "Vidéo de l'article";
      sortie.push(
        `<figure class="video"><iframe src="${echapperAttribut(src)}" title="${echapperAttribut(titre)}" loading="lazy" allowfullscreen></iframe></figure>`,
      );
      continue;
    }

    if (!BALISES.has(nom)) {
      if (!VIDES.has(nom)) pile.push({ nom, garde: false });
      continue;
    }

    if (nom === "img") {
      const src = attr.src ?? "";
      if (!lienSain(src)) continue;
      const taille = dimensions(src);
      const l = Number(attr.width) || taille?.l;
      const h = Number(attr.height) || taille?.h;
      /* `width` et `height` toujours déclarés, sinon la page saute au
         chargement : voir la règle des images dans `AGENTS.md`. Quand Substack
         ne les donne pas, on les relit dans le nom du fichier d'origine, qu'il
         laisse dans l'adresse de son propre redimensionneur. */
      const cotes = l && h ? ` width="${l}" height="${h}"` : "";
      sortie.push(
        `<img src="${echapperAttribut(src)}" alt="${echapperAttribut(attr.alt ?? "")}"${cotes} loading="lazy" decoding="async" />`,
      );
      continue;
    }

    if (nom === "a") {
      const href = attr.href ?? "";
      /* Substack enveloppe chaque image d'un lien vers son propre
         redimensionneur. Un lien qui mène à un fichier image n'apporte rien et
         fait sortir du site : on garde l'image, on jette le lien. */
      if (!lienSain(href) || href.startsWith("https://substackcdn.com")) {
        pile.push({ nom, garde: false });
        continue;
      }
      const interne = resoudreLien?.(href) ?? null;
      const cible = interne ?? href;
      const sortant = !interne && /^https?:\/\//i.test(cible);
      sortie.push(
        `<a href="${echapperAttribut(cible)}"${sortant ? ' target="_blank" rel="noreferrer"' : ""}>`,
      );
      pile.push({ nom, garde: true });
      continue;
    }

    if (VIDES.has(nom)) {
      sortie.push(`<${nom} />`);
      continue;
    }

    sortie.push(`<${nom}>`);
    pile.push({ nom, garde: true });
  }

  /* Ce qui reste ouvert se ferme : un article tronqué ne doit pas emporter la
     mise en page du reste de la page avec lui. */
  for (let i = pile.length - 1; i >= 0; i--) {
    if (pile[i]!.garde) sortie.push(`</${pile[i]!.nom}>`);
  }

  return sortie
    .join("")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
