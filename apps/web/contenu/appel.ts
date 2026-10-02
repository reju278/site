import type { ContenuMessage } from "@/components/message-remy";
import { messageRemy } from "@/contenu/site";

/**
 * Le texte de la page de réservation d'appel, `go.funnels.club/appel`.
 *
 * **La page est `/preparation` avec le formulaire de Calendly à la place de la
 * vidéo**, sur demande de Rémy : ni la notification « Préparer votre
 * rendez-vous », ni l'équipe, et un en-tête réduit à la marque et à la bascule
 * de thème. La galerie des entretiens et son titre sont ceux d'`/immersion`,
 * lus dans `avisImmersion`.
 *
 * **Le titre, le sous-titre, le titre d'onglet et la description sont écrits
 * par l'agent et à valider par Rémy** : il ne les a pas dictés.
 */

/** L'identité de la page, pour l'onglet et le partage. À valider par Rémy. */
export const identiteAppel = {
  titrePage: "Réserver votre appel",
  description:
    "Choisissez le créneau qui vous convient pour échanger avec l'équipe Funnels Club, puis découvrez les histoires des membres que nous avons accompagnés.",
} as const;

export const reservationAppel = {
  /* À valider par Rémy. */
  titre: [{ texte: "Réservez votre appel" }],
  /* Dicté par Rémy. */
  sousTitre:
    "Nous vous accompagnons à travers toutes les étapes de votre business de formation, du lancement jusqu'à 6 ou 7 chiffres par an.",
  /* Le formulaire donné par Rémy, sans sa requête : `hide_gdpr_banner` est
     ajouté par `FormulaireCalendly`. */
  calendly:
    "https://calendly.com/funnels-club/candidature-funnels-club-clone-5",
  /* **La hauteur sous laquelle le formulaire ne descend jamais**, en pixels.
     Calendly annonce 693 px à son premier affichage, et à cette hauteur sa
     colonne de gauche est coupée : la photo rognée en haut, une barre de
     défilement à côté. Elle tient entière à 798 px, mesurés. Le hero règle
     aussi sa jonction sur cette valeur : voir le gabarit d'`/appel`. */
  hauteurMin: 800,
} as const;

/**
 * Le bouton de réservation de la galerie des entretiens, dicté par Rémy : sous
 * la vidéo de chaque entretien ouvert, au milieu de la galerie et en bas. Il
 * remonte au formulaire, dont l'ancre est celle du hero.
 *
 * **Plus aucune page ne le montre** : la galerie a quitté `/appel`, sur
 * décision de Rémy. Il est gardé pour le jour où elle y revient.
 */
export const appelGalerie = {
  ancre: "#reservation",
  libelle: "Réserver mon appel de découverte gratuit",
} as const;

/**
 * Le message de Rémy de l'accueil, **sans la vidéo de formation**, sur sa
 * demande : sur cette page, la lettre ne sert qu'à donner envie de réserver.
 * Seule la conclusion change, et elle garde ses propres mots : la phrase sur
 * la vidéo est retirée, celle sur l'échange reste, ramenée au présent.
 */
export const messageRemyAppel: ContenuMessage = {
  ...messageRemy,
  conclusion: {
    avant: "",
    lienVideo: "",
    milieu: "Si vous souhaitez aller plus loin, vous pouvez ",
    lienAppel: messageRemy.conclusion.lienAppel,
    apres: messageRemy.conclusion.apres,
  },
};
