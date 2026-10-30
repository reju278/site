import { appelDepuis } from "@/contenu/site";

/**
 * Les pages de témoignage en tunnel : `go.funnels.club/<prénom>`.
 *
 * Une page par entretien, au même format, sur demande de Rémy : un titre, la
 * vidéo, un bouton pour réserver un appel. Le dessin vit une fois dans
 * `components/page-temoignage.tsx` ; ici, seulement ce qui change d'une page à
 * l'autre.
 *
 * **La clé est le prénom de l'adresse, et c'est aussi la provenance Hyros** :
 * `/roland` envoie `el=roland`. Voir `appelDepuis`. Ajouter une page, c'est
 * ajouter une entrée ici, un dossier `app/<clé>` de deux lignes, et la racine
 * dans `lib/tunnels.ts` et `components/fournisseur-theme.tsx`.
 *
 * **Les titres et les identités sont écrits par l'agent**, en s'inspirant de
 * `/thanks`. À valider par Rémy. Ils ne portent aucun montant : le chiffre est
 * dit dans la vidéo, il n'a pas à être répété en titre d'une page qu'on
 * envoie. Les vidéos, durées et `alt` sont ceux de `site.ts` et `avis.ts`.
 */

type PageTemoignage = {
  /** L'onglet et le partage. */
  titrePage: string;
  description: string;
  /** Le `h1`. */
  titre: readonly { texte: string }[];
  video: {
    id: string;
    /** Le titre de l'iframe décrit la vidéo et non le lecteur. */
    titre: string;
    secondes: number;
    afficheAlt: string;
  };
};

export const pagesTemoignage = {
  /* L'entretien du 30 avril 2024, le premier des deux : celui qui raconte le
     lancement. */
  roland: {
    titrePage: "Le témoignage de Roland",
    description:
      "Roland Buffet forme les entreprises du bâtiment. Dans cet entretien vidéo, il raconte comment il a lancé sa formation en ligne avec un tunnel de vente.",
    titre: [{ texte: "Découvre l'histoire de Roland" }],
    video: {
      id: "rgio4y4o8f",
      titre:
        "Entretien avec Roland Buffet, formateur pour les entreprises du bâtiment",
      secondes: 715,
      afficheAlt:
        "Roland Buffet en entretien vidéo avec Rémy Jupille, chacun depuis son bureau",
    },
  },
  /* L'entretien du 2 juin 2025, le premier des deux : celui du produit
     unique. Mené par Geoffrey, d'où l'`alt`. */
  francois: {
    titrePage: "Le témoignage de François",
    description:
      "François enseigne la guitare en ligne. Dans cet entretien vidéo, il raconte comment il a remplacé ses douze petites formations par un seul produit.",
    titre: [{ texte: "Découvre l'histoire de François" }],
    video: {
      id: "b5taio9plc",
      titre: "Entretien avec François, professeur de guitare en ligne",
      secondes: 1192,
      afficheAlt:
        "François en entretien vidéo avec Geoffrey, de Funnels Club, chacun depuis son bureau",
    },
  },
} as const satisfies Record<string, PageTemoignage>;

export type ClePageTemoignage = keyof typeof pagesTemoignage;

/** Le libellé du bouton, le même sur toutes les pages. */
export const libelleAppelTemoignage = "Réserver mon appel découverte";

/** Le lien d'appel d'une page, balisé à son nom pour Hyros. */
export function appelTemoignage(cle: ClePageTemoignage): string {
  return appelDepuis(cle);
}
