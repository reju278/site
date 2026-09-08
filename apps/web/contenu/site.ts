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

  // Repris de funnels.club, au mot près : c'est leur propre titre.
  promesse: "Vivez de votre expertise en ligne.",
  resume:
    "Nous vous accompagnons à travers toutes les étapes de votre business de formation, du lancement jusqu'à 6 ou 7 chiffres par an.",
} as const;

/**
 * La balise de provenance, lue par Hyros.
 *
 * Tout lien qui quitte ce site vers une propriété de Rémy la porte : c'est ce
 * qui permet de savoir qu'une vente vient d'ici et non d'un email ou d'une
 * publicité. Elle s'ajoute par cette fonction et jamais à la main, parce qu'une
 * balise oubliée ne se voit pas : le lien marche, la vente est attribuée
 * ailleurs, et personne ne s'en aperçoit avant de lire les chiffres.
 */
export function avecTag(url: string): string {
  const separateur = url.includes("?") ? "&" : "?";
  return url.includes("el=site") ? url : `${url}${separateur}el=site`;
}

export const liens = {
  decouvrir: avecTag("https://funnels.club"),
  funnelsClub: avecTag("https://www.funnels.club/direct"),
  appel: avecTag("https://funnels.club/appel"),
  consulting: avecTag(
    "https://calendly.com/funnels-club/appel-decouverte-clone-2"
  ),
  lettre: avecTag("https://lettre.funnels.club"),
  espaceMembre: avecTag("https://groupe.funnels.club"),
  livre: avecTag("https://www.digital-selfmade.com"),

  // Sans balise : YouTube n'est pas une propriété qu'Hyros suit, et un
  // paramètre inconnu dans une URL de chaîne n'apporte rien.
  youtube: "https://www.youtube.com/channel/UCzGq4I0pXnDJizd0fitt10w",
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

/**
 * Les entrées plates de l'en-tête, sans menu déroulant.
 *
 * Vide : tout est passé sous « Programmes » et « Ressources ». Une entrée
 * seule à côté de deux menus se lit comme un oubli.
 */
export const navigation: readonly EntreeNavigation[] = [];

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
        libelle: "Accompagnement Funnels Club",
        href: liens.appel,
        texte: "Jusqu'à plus de 6 chiffres par an avec une offre digitale",
        externe: true,
      },
      {
        libelle: "Consulting privé avec Rémy",
        href: liens.consulting,
        texte: "L'accompagnement le plus personnalisé que Rémy propose",
        externe: true,
      },
    ],
  },
  {
    libelle: "Ressources",
    entrees: [
      {
        libelle: "Résultats",
        href: "/resultats",
        texte: "Ce que les membres ont obtenu",
      },
      {
        libelle: "Digital Selfmade",
        href: "/articles",
        texte: "La lettre, tous les articles",
      },
      {
        libelle: "Profit, liberté, no stress",
        href: "/podcast",
        texte: "Le podcast, tous les épisodes",
      },
      { libelle: "YouTube", href: liens.youtube, externe: true },
      { libelle: "Livre", href: liens.livre, externe: true },
    ],
  },
];

/**
 * Les deux offres, reprises de funnels.club au mot près.
 *
 * Le site en présente trois : Funnels Club, le Mentium Mastermind et le
 * consulting privé. Seules deux sont montrées ici, sur décision de Rémy, et le
 * mastermind n'y est pas.
 *
 * Une phrase par offre, choisie dans leur page et non résumée. Résumer, c'est
 * réécrire, et réécrire une promesse commerciale n'appartient pas à l'agent.
 */
export const offres = [
  {
    id: "funnels-club",
    nom: "Accompagnement Funnels Club",
    texte:
      "Nous accompagnons exclusivement des business de formation, de coaching et de prestation de service à atteindre plus de 6 chiffres par an avec une offre digitale.",
    action: "Réservez votre appel découverte",
    href: liens.appel,
  },
  {
    id: "consulting",
    nom: "Consulting privé avec Rémy",
    texte:
      "C'est l'accompagnement le plus personnalisé que Rémy propose, où vous avez accès à lui en direct dès que vous en avez besoin et où vous pouvez réserver des visioconférences en illimité du lundi au samedi.",
    action: "Postuler pour le consulting privé",
    href: liens.consulting,
  },
] as const;

/**
 * La chaîne YouTube.
 *
 * L'identifiant est celui de l'URL de la chaîne. Le flux Atom de YouTube est
 * public et sans quota, contrairement à l'API Data v3 qui demande une clé.
 */
export const chaine = {
  nom: "Rémy Jupille",
  flux: "https://www.youtube.com/feeds/videos.xml?channel_id=UCzGq4I0pXnDJizd0fitt10w",
} as const;

/**
 * La vidéo de présentation, hébergée chez Wistia.
 *
 * `secondes` et `titre` viennent du média lui-même
 * (`fast.wistia.net/embed/medias/<id>.json`). L'affiche est téléchargée depuis
 * Wistia puis servie par nous : voir `LecteurVideo` pour la raison.
 */
export const video = {
  id: "di3bzcmi50",
  titre: "Vidéo de présentation",
  secondes: 981,
} as const;

/**
 * Le podcast.
 *
 * Le flux lu est celui d'Ausha, l'hébergeur : c'est lui qui alimente Apple
 * Podcasts, Spotify et les autres. Lire la source plutôt qu'une vitrine évite
 * d'interroger trois plateformes qui disent la même chose autrement.
 */
export const podcast = {
  nom: "Profit, liberté, no stress",
  flux: "https://feed.ausha.co/ypjV8sr07j2B",
  plateformes: [
    { nom: "Apple Podcasts", href: "https://podcasts.apple.com/fr/podcast/profit-libert%C3%A9-no-stress/id1479057423" },
    { nom: "Spotify", href: "https://open.spotify.com/show/4tehcIhRigecka2QMPHKZO" },
    { nom: "YouTube", href: "https://www.youtube.com/@profitlibertenostress" },
  ],
} as const;

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
