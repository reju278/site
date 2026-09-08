/**
 * Tout le contenu du site, en un seul fichier.
 *
 * Il n'y a pas de base de données ici et c'est voulu : ce qui ne change qu'à la
 * mise à jour du site vit dans le dépôt. Modifier une phrase, c'est modifier ce
 * fichier, committer, pousser.
 *
 * Les entrées marquées `A_REMPLIR` sont des exemples de forme, pas du contenu.
 * Elles décrivent ce qu'il faut fournir. Le site ne part pas en production tant
 * qu'il en reste une : voir l'issue #1.
 */

/** Marqueur des contenus qui attendent leur version réelle. */
export const A_REMPLIR = true as const;

export const identite = {
  nom: "Rémy Jupille",
  societe: "Jupille Group Ltd",
  role: "Formateur et consultant en acquisition",
  promesse: "Vendre ses connaissances ou compétences en ligne",
  resume:
    "J'aide les formateurs, coachs et consultants à convertir de nouveaux clients avec un tunnel de vente qui tient, de la publicité en ligne et une offre qu'on ne refuse pas.",
} as const;

export const liens = {
  youtube: "https://www.youtube.com/channel/UCzGq4I0pXnDJizd0fitt10w",
  livre: "https://www.digital-selfmade.com",
  funnelsClub: "https://www.funnels.club/direct?el=site",
  mastermind: "https://www.funnels.club/mastermind?el=site",
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

export const navigation: readonly EntreeNavigation[] = [
  { libelle: "Résultats", href: "/resultats" },
  { libelle: "À propos", href: "/a-propos" },
  { libelle: "YouTube", href: liens.youtube, externe: true },
  { libelle: "Livre", href: liens.livre, externe: true },
];

/** À qui le site s'adresse. Sert de filtre autant que de promesse. */
export const cibles = [
  {
    titre: "Coachs",
    texte:
      "Vous vendez votre accompagnement en appel, un par un, et votre chiffre s'arrête quand votre agenda est plein.",
  },
  {
    titre: "Formateurs",
    texte:
      "Votre formation existe, elle est bonne, et pourtant elle ne se vend qu'au bouche-à-oreille.",
  },
  {
    titre: "Consultants",
    texte:
      "Vos missions viennent de votre réseau. Le jour où il se tarit, il n'y a rien derrière.",
  },
] as const;

/** Ce que le programme installe, dit en clair. */
export const piliers = [
  "Une offre assez précise pour qu'on comprenne en dix secondes à qui elle s'adresse",
  "Un tunnel de vente qui tient sans vous, de la publicité jusqu'au paiement",
  "De la publicité en ligne pilotée sur des chiffres, pas sur des impressions",
  "Un appel de vente cadré, avec une trame qui se répète",
  "Des relances écrites une fois, envoyées mille fois",
  "Un tableau de bord qui dit où l'argent entre et où il fuit",
] as const;

export const offres = [
  {
    id: "funnels-club",
    nom: "Funnels Club",
    promesse: "Grandir jusqu'à 6 chiffres par an",
    texte:
      "Un programme de formation pour les coachs, consultants et créateurs de formation qui veulent créer et vendre une formation en ligne à plusieurs milliers d'euros, avec un tunnel, de la publicité et du closing.",
    pour: "Vous avez une expertise et pas encore de machine pour la vendre.",
    action: "Découvrir Funnels Club",
    href: liens.funnelsClub,
    teinte: "bleu",
  },
  {
    id: "mastermind",
    nom: "F.C. Mastermind",
    promesse: "Scaler jusqu'à +7 chiffres par an",
    texte:
      "Un groupe restreint de coachs, consultants et créateurs de formation qui visent le million grâce à l'automatisation, la délégation et des stratégies de croissance plus avancées.",
    pour: "Votre offre se vend déjà. C'est vous qui êtes devenu le goulot.",
    action: "Découvrir le Mastermind",
    href: liens.mastermind,
    teinte: "rouge",
  },
] as const;

/**
 * Les chiffres du programme.
 *
 * A_REMPLIR : ce sont des exemples de format. Aucun chiffre ne part en ligne
 * sans être vrai et vérifiable.
 */
export const chiffres = [
  { valeur: "000", unite: "", libelle: "membres accompagnés depuis 2019" },
  { valeur: "0", unite: "M€", libelle: "de chiffre d'affaires généré par les membres" },
  { valeur: "00", unite: "%", libelle: "des membres lancent leur offre en 90 jours" },
  { valeur: "0", unite: "ans", libelle: "à ne faire que ça" },
] as const;

/**
 * Les résultats clients.
 *
 * A_REMPLIR : nom réel, chiffre réel, citation réelle, et l'accord de la
 * personne pour être citée. Deux formes qui alternent, dans l'esprit de la page
 * « customer stories » de Jasper : `chiffre` pour une tuile colorée avec un
 * nombre en très gros, `citation` pour une parole sur fond de carte. Seul le
 * chiffre porte une teinte.
 */
export const resultats = [
  {
    type: "chiffre",
    valeur: "0 000 €",
    libelle: "en trois mois, sans agence",
    personne: "Prénom N.",
    metier: "Coach",
    teinte: "vert",
  },
  {
    type: "citation",
    texte:
      "Remplacer par la phrase exacte de la personne, telle qu'elle l'a écrite. Ce qui convainc, c'est le détail concret qu'on ne peut pas inventer.",
    personne: "Prénom N.",
    metier: "Consultante",
  },
  {
    type: "chiffre",
    valeur: "×0",
    libelle: "sur le taux de prise de rendez-vous",
    personne: "Prénom N.",
    metier: "Formateur",
    teinte: "bleu",
  },
  {
    type: "citation",
    texte:
      "Remplacer par une citation qui raconte l'avant et l'après, pas seulement la satisfaction.",
    personne: "Prénom N.",
    metier: "Coach sportif",
  },
  {
    type: "chiffre",
    valeur: "00 %",
    libelle: "de marge sur la publicité",
    personne: "Prénom N.",
    metier: "Créatrice de formation",
    teinte: "violet",
  },
  {
    type: "citation",
    texte:
      "Remplacer par une citation. Trois lignes suffisent : ce qui bloquait, ce qui a changé, en combien de temps.",
    personne: "Prénom N.",
    metier: "Consultant",
  },
] as const;

/**
 * Le parcours, pour la page « À propos ».
 *
 * A_REMPLIR : les dates et les étapes réelles.
 */
export const parcours = [
  {
    annee: "Année",
    titre: "Le point de départ",
    texte:
      "Remplacer par ce qui vous a amené là. Le métier d'avant, ce qui n'allait pas, la décision.",
  },
  {
    annee: "Année",
    titre: "La première offre",
    texte:
      "Remplacer par le premier produit vendu en ligne, ce qu'il a rapporté, ce qu'il a appris.",
  },
  {
    annee: "Année",
    titre: "Funnels Club",
    texte:
      "Remplacer par la naissance du programme et ce qui l'a rendu nécessaire.",
  },
  {
    annee: "Aujourd'hui",
    titre: "Le Mastermind",
    texte:
      "Remplacer par ce sur quoi vous travaillez maintenant, et pour qui.",
  },
] as const;

export const questions = [
  {
    question: "À qui s'adresse Funnels Club ?",
    reponse:
      "Aux coachs, consultants et formateurs qui ont déjà une expertise et des premiers clients, mais pas encore de moyen répétable de les trouver. Si vous cherchez votre sujet, c'est trop tôt.",
  },
  {
    question: "Combien de temps faut-il y consacrer ?",
    reponse:
      "A_REMPLIR : dire la vérité sur le rythme réel, en heures par semaine, plutôt qu'une promesse confortable.",
  },
  {
    question: "Faut-il un budget publicitaire ?",
    reponse:
      "A_REMPLIR : donner le montant plancher en dessous duquel les campagnes n'apprennent rien, et dire ce qu'on fait avant de l'avoir.",
  },
  {
    question: "Quelle différence entre Funnels Club et le Mastermind ?",
    reponse:
      "Funnels Club construit la machine. Le Mastermind s'adresse à ceux dont la machine tourne déjà et qui butent sur leur propre temps : automatisation, délégation, croissance.",
  },
] as const;

export const legales = [
  { libelle: "CGV", href: "/cgv" },
  { libelle: "Confidentialité", href: "/confidentialite" },
  { libelle: "Mentions légales", href: "/mentions" },
] as const;
