import { avis } from "@/contenu/avis";
import { appelDepuis, temoignages } from "@/contenu/site";
import type { CleTemoignage } from "@/lib/pages-temoignage";

/**
 * Les pages de témoignage en tunnel : `go.funnels.club/<clé>`.
 *
 * Une page par entretien du site, au même format, sur demande de Rémy : un
 * titre, la vidéo, un bouton pour réserver un appel. Le dessin vit une fois
 * dans `components/page-temoignage.tsx`, les adresses dans
 * `lib/pages-temoignage.ts`.
 *
 * **Rien n'est réécrit ici.** La vidéo, la durée et l'`alt` de l'affiche
 * viennent de `temoignages` dans `site.ts`, la description de l'article dans
 * `avis.ts` : un entretien est déjà décrit à un endroit, il ne l'est pas une
 * seconde fois. Ce fichier ne porte que le prénom affiché et l'article dont
 * la page vient.
 *
 * **Les titres sont écrits par l'agent**, en s'inspirant de `/thanks`, à
 * valider par Rémy : « Découvre l'histoire de … », et « la suite de
 * l'histoire » pour un second entretien. Aucun montant dans le titre : le
 * chiffre est dit dans la vidéo.
 */

type Source = {
  /** Le slug de l'article dans `avis.ts`. */
  article: string;
  /** Le prénom tel qu'il s'affiche dans le titre. */
  prenom: string;
  /** Un second entretien, un an et demi après le premier. */
  suite?: boolean;
};

const SOURCES = {
  christian: { article: "christian-joyce", prenom: "Christian" },
  roland: { article: "roland-buffet", prenom: "Roland" },
  augustin: { article: "augustin-passy", prenom: "Augustin" },
  "yannick-sylvie": { article: "yannick-et-sylvie", prenom: "Yannick et Sylvie" },
  olga: { article: "olga", prenom: "Olga" },
  sandrine: { article: "sandrine", prenom: "Sandrine" },
  tatiana: { article: "tatiana", prenom: "Tatiana" },
  charlotte: { article: "charlotte", prenom: "Charlotte" },
  francois: { article: "francois", prenom: "François" },
  jeremy: { article: "jeremy", prenom: "Jérémy" },
  cedric: { article: "cedric", prenom: "Cédric" },
  corentin: { article: "corentin", prenom: "Corentin" },
  /* L'article s'écrit `matthieu`, le nom affiché partout est Mathieu. */
  mathieu: { article: "matthieu", prenom: "Mathieu" },
  valerie: { article: "valerie", prenom: "Valérie" },
  joel: { article: "joel", prenom: "Joël" },
  lilian: { article: "lilian", prenom: "Lilian" },
  "corentin-mastermind": {
    article: "corentin-mastermind",
    prenom: "Corentin",
    suite: true,
  },
  sebastien: { article: "sebastien", prenom: "Sébastien" },
  patrick: { article: "patrick-pinot", prenom: "Patrick" },
  guy: { article: "guy-anastaze", prenom: "Guy" },
  "roland-mastermind": {
    article: "roland-buffet-mastermind",
    prenom: "Roland",
    suite: true,
  },
  "francois-mastermind": {
    article: "francois-mastermind",
    prenom: "François",
    suite: true,
  },
} as const satisfies Record<CleTemoignage, Source>;

/** « de Roland », mais « d'Augustin » et « d'Olga » : l'élision devant une voyelle. */
const de = (prenom: string) =>
  /^[aeiouyàâéèêîôûAEIOUYÀÂÉÈÊÎÔÛ]/.test(prenom) ? `d'${prenom}` : `de ${prenom}`;

export type PageTemoignage = {
  titrePage: string;
  description: string;
  titre: readonly { texte: string }[];
  video: { id: string; titre: string; secondes: number; afficheAlt: string };
};

/**
 * La page d'une clé, assemblée depuis l'article et la vidéo. **Jette au
 * build** si l'article ou la vidéo manque : une page de témoignage sans
 * vidéo est une page vide qu'on enverrait sans le savoir.
 */
export function pageTemoignage(cle: CleTemoignage): PageTemoignage {
  const { article, prenom, suite } = SOURCES[cle] as Source;
  const a = avis.find((x) => x.slug === article);
  const t = a && temoignages.find((x) => x.id === a.id);
  if (!a || !t) {
    throw new Error(`Page de témoignage /${cle} : article « ${article} » introuvable.`);
  }
  return {
    titrePage: suite
      ? `La suite du témoignage ${de(prenom)}`
      : `Le témoignage ${de(prenom)}`,
    description: a.description,
    titre: [
      {
        texte: suite
          ? `Découvre la suite de l'histoire ${de(prenom)}`
          : `Découvre l'histoire ${de(prenom)}`,
      },
    ],
    video: {
      id: a.id,
      /* Le titre de l'iframe décrit la vidéo et non le lecteur. */
      titre: `Entretien avec ${t.nom}`,
      secondes: t.secondes,
      afficheAlt: a.afficheAlt,
    },
  };
}

/** Le libellé du bouton, le même sur toutes les pages. */
export const libelleAppelTemoignage = "Réserver mon appel découverte";

/** Le lien d'appel d'une page, balisé à son nom pour Hyros. */
export function appelTemoignage(cle: CleTemoignage): string {
  return appelDepuis(cle);
}
