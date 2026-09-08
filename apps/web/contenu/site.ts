/**
 * Tout le contenu du site, en un seul fichier.
 *
 * Il n'y a pas de base de données ici et c'est voulu : ce qui ne change qu'à la
 * mise à jour du site vit dans le dépôt. Modifier une phrase, c'est modifier ce
 * fichier, committer, pousser.
 *
 * **Règle du projet : le texte est écrit par Rémy, pas par l'agent.** Ce
 * fichier ne contient que du texte repris mot pour mot de remy-jupille.com. Ce
 * qui n'a pas encore de texte vaut `null` et s'affiche comme un emplacement
 * vide, visiblement. Une page à trous se remplit ; une page remplie de texte
 * inventé se corrige ligne à ligne, longtemps après que personne ne se
 * souvienne de ce qui était vrai.
 */

/** Un emplacement qui attend le texte de Rémy. */
export type AEcrire = null;

export const identite = {
  nom: "Rémy Jupille",
  societe: "Jupille Group Ltd",

  // Repris de remy-jupille.com, au mot près.
  promesse: "Vendre ses connaissances ou compétences en ligne",
  resume:
    "Nous aidons les formateurs, coachs et consultants à facilement convertir de nouveaux clients grâce au PARFAIT tunnel de vente, la publicité en ligne et la création d'une offre irrésistible.",

  /** Le mot mis en italique dans le titre. Doit exister dans `promesse`. */
  promesseAccent: "connaissances ou compétences",
} as const;

export const liens = {
  youtube: "https://www.youtube.com/channel/UCzGq4I0pXnDJizd0fitt10w",
  livre: "https://www.digital-selfmade.com",
  funnelsClub: "https://www.funnels.club/direct?el=site",
  mastermind: "https://www.funnels.club/mastermind?el=site",
  lettre: "https://lettre.funnels.club",
} as const;

/**
 * Une entrée de menu. `externe` est déclaré partout, y compris absent, sinon
 * `as const` produit une union où la moitié des membres n'a pas la propriété et
 * où `entree.externe` ne compile plus.
 */
export type EntreeNavigation = {
  libelle: string;
  href: string;
  externe?: boolean;
};

/** Les entrées plates de l'en-tête, sans menu déroulant. */
export const navigation: readonly EntreeNavigation[] = [
  { libelle: "Résultats", href: "/resultats" },
];

/**
 * Les menus déroulants de l'en-tête.
 *
 * Les descriptions sont reprises telles quelles du site actuel et du flux de la
 * lettre. Aucune n'est écrite pour l'occasion : une entrée sans texte n'en
 * affiche pas.
 */
export const menus: readonly {
  libelle: string;
  entrees: readonly {
    libelle: string;
    href: string;
    texte?: string;
    externe?: boolean;
  }[];
}[] = [
  {
    libelle: "Programmes",
    entrees: [
      {
        libelle: "Funnels Club",
        href: liens.funnelsClub,
        texte: "Grandir jusqu'à 6 chiffres par an",
        externe: true,
      },
      {
        libelle: "F.C. Mastermind",
        href: liens.mastermind,
        texte: "Scaler jusqu'à +7 chiffres par an",
        externe: true,
      },
    ],
  },
  {
    libelle: "Contenus",
    entrees: [
      { libelle: "Digital Selfmade", href: "/articles", texte: "Profit, liberté, no stress" },
      { libelle: "YouTube", href: liens.youtube, externe: true },
      { libelle: "Livre", href: liens.livre, externe: true },
    ],
  },
];

/** Repris de remy-jupille.com, au mot près. */
export const offres = [
  {
    id: "funnels-club",
    nom: "Funnels Club",
    promesse: "Grandir jusqu'à 6 chiffres par an",
    texte:
      "Funnels Club est un programme de formation pour les coachs, consultants et créateurs de formations pour créer et vendre une formation en ligne à plusieurs milliers avec un funnel, de la publicité en ligne et du closing.",
    action: "Découvrir Funnels Club",
    href: liens.funnelsClub,
    teinte: "bleu",
  },
  {
    id: "mastermind",
    nom: "F.C. Mastermind",
    promesse: "Scaler jusqu'à +7 chiffres par an",
    texte:
      "Le F.C. Mastermind est un groupe restreint de coachs, consultants et créateurs de formation qui souhaitent croître à +7 chiffres par an grâce à l'automatisation, la délégation et des stratégies évoluées de croissance.",
    action: "Découvrir le Mastermind",
    href: liens.mastermind,
    teinte: "rouge",
  },
] as const;

/** La lettre, telle que son propre flux se décrit. */
export const lettre = {
  nom: "Digital Selfmade",
  baseline: "Profit, liberté, no stress",
  flux: "https://lettre.funnels.club/feed",
} as const;

/**
 * Les sections dont Rémy n'a pas encore écrit le texte.
 *
 * Chaque entrée décrit ce que la section attend. Tant que `titre` vaut `null`,
 * la page affiche un emplacement au lieu d'une phrase. Remplacer `null` par le
 * texte suffit à faire apparaître la section pour de bon.
 */
export const sections = {
  preuve: {
    titre: null as string | null,
    texte: null as string | null,
    attendu: "la section qui montre les résultats des membres",
  },
  aPropos: {
    titre: null as string | null,
    texte: null as string | null,
    attendu: "qui vous êtes et pourquoi vous faites ça",
  },
  appel: {
    titre: null as string | null,
    texte: null as string | null,
    attendu: "la phrase qui clôt la page et l'appel à l'action",
  },
} as const;

/**
 * Les chiffres mis en avant.
 *
 * Vide tant que Rémy n'a pas donné les vrais. Un chiffre inventé sur un site
 * de formation est une allégation commerciale, pas une maquette.
 */
export const chiffres: readonly {
  valeur: string;
  libelle: string;
}[] = [];

/**
 * Les résultats clients.
 *
 * Vide, pour la même raison, et parce qu'un témoignage engage la personne
 * citée. Il faut son nom, son chiffre, ses mots et son accord.
 */
export const resultats: readonly {
  type: "chiffre" | "citation";
  personne: string;
  metier: string;
  valeur?: string;
  libelle?: string;
  texte?: string;
  teinte?: string;
}[] = [];

export const legales = [
  { libelle: "CGV", href: "/cgv" },
  { libelle: "Confidentialité", href: "/confidentialite" },
  { libelle: "Mentions", href: "/mentions" },
] as const;

/** Repris du pied de page de remy-jupille.com, au mot près. */
export const avertissement =
  "Ce site ne fait pas partie du site Facebook ou de Facebook, Inc. Ce site n'est PAS approuvé par Facebook de quelque manière que ce soit. FACEBOOK est une marque déposée de FACEBOOK, Inc.";
