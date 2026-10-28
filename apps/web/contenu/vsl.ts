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
  /* La pilule de réassurance tout en haut, dictée par Rémy. Le chiffre est
     le sien ; c'est une allégation commerciale, à pouvoir justifier. */
  pilule: {
    avant: "Tunnel de vente mis en place dans ",
    fort: "plus de 1 000 business",
    apres: " de formation ou de coaching",
  },
  /* Dicté par Rémy. Les guillemets sont ceux qu'il a demandés, anglais et non
     français, dans leur forme typographique (“ ”) plutôt que droite. Les deux
     mises en avant en bleu sont celles du titre précédent, reportées sur les
     mêmes mots. */
  /* Dicté par Rémy. Ses guillemets droits sont rendus dans leur forme
     typographique (“ ”). En bleu : « PARFAIT “tunnel de vente” », « attirer
     des clients », « formation » et « coaching ».

     Espaces insécables dans « tunnel de vente », qui se coupait entre ses
     guillemets sur téléphone, et dans « n’existe pas encore) », pour que la
     parenthèse ne finisse jamais sur une ligne trop courte.

     Pas de coupure écrite : elles donnaient un titre étroit. C'est la taille
     fluide du titre, voir `app/course/page.tsx`, qui lui donne sa forme. */
  titre: [
    { texte: "Nous allons mettre en place le " },
    { texte: "PARFAIT “tunnel\u00a0de\u00a0vente”", accent: true },
    { texte: " pour " },
    { texte: "attirer des clients", accent: true },
    { texte: " et vendre votre " },
    { texte: "formation", accent: true },
    { texte: " ou votre " },
    { texte: "coaching", accent: true },
    { texte: " (même si votre offre n’existe\u00a0pas\u00a0encore)" },
  ],
  /* L'aperçu de la vidéo : une image tirée de la vidéo en 4K. */
  apercu: {
    image: "/vsl/apercu-1920.webp",
    imageMobile: "/vsl/apercu-1080.webp",
    alt: "Rémy présente la formation gratuite, face caméra",
  },
  /* La preuve sous le bloc d'inscription : la note Trustpilot de
     Funnels.Club, relevée sur trustpilot.com/review/funnels.club le 28
     octobre 2026 : TrustScore 4,7 sur 5, 230 avis, dont 84 % à 5 étoiles.

     **« Plus de 200 avis » et non « 230 avis »** : un compte exact écrit dans
     une phrase est faux dès l'avis suivant, la règle du dépôt sur les textes
     qui comptent leurs éléments. Le plancher reste vrai tant que les avis
     montent. **La note, elle, peut bouger** : elle se revérifie sur
     Trustpilot, et la remplir change aussi les étoiles, calculées depuis elle.

     Aucun lien vers Trustpilot : c'est un tunnel, on n'en sort que par
     l'appel. Aucun balisage `AggregateRating` non plus, voir `AGENTS.md`.

     Les portraits sont ceux de trois membres déjà publiés sur `/immersion`,
     Christian, Roland et Valérie. Ce ne sont pas des auteurs d'avis
     Trustpilot : ils illustrent la communauté.

     **Libellé écrit par l'agent, à valider par Rémy.** */
  preuve: {
    note: 4.7,
    /* Sans la mention de Trustpilot, sur demande de Rémy. La note reste
       celle de Trustpilot, et c'est là qu'elle se vérifie. */
    texte: "4,7 sur 5 · plus de 200 avis",
    portraits: [
      "/immersion/temoignage-christian-joyce.jpg",
      "/immersion/temoignage-roland-buffet.jpg",
      "/immersion/temoignage-valerie-di-falco.jpg",
    ],
  },
  intro: "Vidéo gratuite qui présente la solution pour :",
  /* Les trois points, en morceaux pour que les mots clés passent en gras,
     sur demande de Rémy. Le texte est le sien, mot pour mot ; seule la
     ponctuation est uniformisée : plus de point final sur le premier, les
     deux autres n'en avaient pas. */
  points: [
    [
      { gras: "Valider votre niche" },
      ", définir votre positionnement et identifier parfaitement ",
      { gras: "votre client de rêve" },
    ],
    [
      { gras: "Créer une offre digitale" },
      " de A à Z ou à améliorer celle que vous avez déjà afin d'",
      { gras: "augmenter vos prix" },
      " jusqu'à plusieurs milliers d'euros, même si vous démarrez de zéro",
    ],
    [
      { gras: "Vendre votre offre digitale" },
      " grâce au ",
      { gras: "parfait tunnel de vente" },
    ],
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

/**
 * « Qui je suis », sous la note des avis de `/course`, dictée par Rémy.
 *
 * **Ses mots, à peine resserrés** : la dictée est mise en phrases, sans rien
 * ajouter ni reformuler. « accompagner d'autres personnes à eux aussi bien
 * vivre » devient « à, elles aussi, bien vivre » pour l'accord. La phrase sur
 * le livre est écrite par l'agent, à partir des chiffres de la fiche Amazon
 * que Rémy a fournie le 28 octobre 2026 : 4,6 sur 5, 267 avis. « Plus de 250 »
 * reste vrai quand les avis montent ; la note, elle, se revérifie.
 *
 * Les chiffres (dix ans, plusieurs millions d'euros, plus de 1 000 personnes)
 * sont les siens : ce sont des allégations commerciales, à pouvoir justifier.
 */
export type MorceauTexte = string | { gras: string };

export const quiJeSuis = {
  /* « Qui suis-je » en titre et « Je m'appelle Rémy Jupille » dessous, sur
     demande de Rémy ; le premier paragraphe ne redit donc plus son nom. */
  titre: "Qui suis-je",
  presentation: "Je m'appelle Rémy Jupille",
  portrait: "/vsl/remy-portrait.webp",
  paragraphes: [
    [
      "Je vends mes propres formations depuis ",
      { gras: "plus de 10 ans" },
      ", et j'ai généré ",
      { gras: "plusieurs millions d'euros de chiffre d'affaires" },
      ".",
    ],
    [
      "Aujourd'hui, je suis passionné par l'idée d'accompagner d'autres personnes à, elles aussi, bien vivre de leur activité de formation ou de coaching.",
    ],
    [
      "C'est pour ça que j'ai créé ",
      { gras: "Funnels Club" },
      ", mon accompagnement, avec lequel j'ai déjà accompagné ",
      { gras: "plus de 1 000 personnes" },
      " à mettre en place le parfait tunnel de vente que j'ai identifié pour réussir : pour attirer des clients qualifiés et les convertir, même pour des offres jusqu'à plusieurs milliers d'euros.",
    ],
    [
      "J'ai aussi écrit le livre ",
      { gras: "Digital Selfmade" },
      ", noté ",
      { gras: "4,6 sur 5" },
      " par plus de 250 lecteurs sur Amazon.",
    ],
  ] satisfies readonly (readonly MorceauTexte[])[],
};
