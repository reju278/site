/**
 * Le VSL Funnel, sous go.funnels.club : l'opt-in de la formation gratuite
 * (`/course`), la vidéo et la prise d'appel (`/video`), puis la
 * confirmation (`/thanks`, où Calendly renvoie).
 *
 * Les textes sont repris **au mot près** des pages ClickFunnels de Rémy
 * (`funnels.club/course-2025` et `/vsl-2025`). Le suivi, l'étiquette
 * ClickFunnels « inscription vsl » et les chiffres passent par le CRM
 * Funnels Club (onglet Funnels, « VSL Funnel »).
 */

/** Le serveur du CRM : l'opt-in et le compteur de visites. */
export const API_FUNNELS =
  process.env.NODE_ENV === "production"
    ? "https://lovely-pheasant-821.eu-west-1.convex.site"
    : "https://savory-herring-410.eu-west-1.convex.site";

/** La clé sous laquelle l'opt-in garde prénom et e-mail pour Calendly. */
export const CLE_CONTACT_VSL = "vsl-contact";

export const optinVsl = {
  /* Dicté par Rémy. Ses guillemets droits sont rendus en guillemets français,
     avec leurs espaces insécables, comme partout sur le site. Les deux mises
     en avant en bleu sont celles du titre précédent, reportées sur les mêmes
     mots. */
  titre: [
    { texte: "Nous allons mettre en place le " },
    { texte: "PARFAIT «\u00a0tunnel de vente\u00a0»", accent: true },
    { texte: " pour vendre votre " },
    { texte: "offre digitale*", accent: true },
    { texte: " (même si vous ne l'avez pas encore créée)" },
  ],
  note: "formation en ligne, service ou coaching",
  intro: "Vidéo gratuite qui présente la solution pour :",
  points: [
    "Valider votre niche, définir votre positionnement et identifier parfaitement votre client de rêve.",
    "Créer une offre digitale de A à Z ou à améliorer celle que vous avez déjà afin d'augmenter vos prix jusqu'à plusieurs milliers d'euros, même si vous démarrez de zéro",
    "Vendre votre offre digitale grâce au parfait tunnel de vente",
  ],
  bouton: "Accéder à la vidéo GRATUITE",
  fenetre: {
    titre: "Entrez vos informations pour découvrir la stratégie :",
    consentement:
      "J'accepte de recevoir les emails de Funnels Club (désabonnement possible à tout moment) et je valide la ",
    lienConfidentialite: "Politique de confidentialité",
    bouton: "Voir la formation GRATUITE",
  },
} as const;

export const videoVsl = {
  surtitre: "Vidéo formation comme promis :",
  video: {
    id: "6w8wxhaqzk",
    titre: "La formation gratuite Funnels Club",
    secondes: 976,
    affiche: "/vsl/affiche.jpg",
  },
  appel: [
    { texte: "Postulez maintenant pour un appel gratuit de " },
    { texte: "30 min", gras: true },
    {
      texte:
        " afin de savoir si vous êtes admissible au programme et au coaching ",
    },
    { texte: "“Funnels Club”", gras: true },
  ],
  bouton: "Réservez votre appel gratuit",
} as const;

/** Les mentions du tunnel : celles du site, sous leurs propres adresses. */
export const legalesVsl = [
  { libelle: "CGV", href: "/course/cgv" },
  { libelle: "Confidentialité", href: "/course/confidentialite" },
  { libelle: "Mentions", href: "/course/mentions" },
] as const;
