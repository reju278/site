import { messageRemyHub } from "@/contenu/hub";
import { messageRemy } from "@/contenu/site";
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
 * La lettre de Rémy, reprise de l'accueil sous la note des avis de `/course`,
 * sur décision de Rémy, à la place d'une section « Qui suis-je ».
 *
 * **Le début et le titre changent, dictés par Rémy.** La lettre s'ouvre
 * directement sur les trois erreurs : la phrase sur les trois façons de vendre,
 * la liste qui suit et « Mais peu importe… » sont retirées. Le titre est sa
 * phrase, « Je m'appelle Rémy, et j'ai un message pour vous... ». Tout le
 * reste est la lettre de l'accueil, mot pour
 * mot.
 */
export const messageRemyOptin = {
  ...messageRemy,
  titre: "Je m'appelle Rémy, et j'ai un message pour vous...",
  amorceVoies:
    "Si vous souhaitez créer et vendre une formation en ligne, du coaching ou du consulting, ou même de la prestation de services, alors il y a trois erreurs que vous devez absolument éviter.",
  voies: [],
  amorceErreurs: "",
  /* Les passages que Rémy a fait corriger pour les règles publicitaires sur le
     hub, repris tels quels pour Google Ads, sur sa demande : les deux absolus
     des erreurs (« ne suffisent plus », « beaucoup de mal à transformer ce
     trafic en clients ») et les valeurs (« simple et répétable », sans
     « toute une vie peut reposer »). Lus dans `messageRemyHub`, pas recopiés. */
  erreurs: messageRemyHub.erreurs,
  valeurs: messageRemyHub.valeurs,
  /* « plus de 1 000 business » retiré sur décision de Rémy : un chiffre
     qu'il faudrait pouvoir prouver à Google. « de nombreux » est de l'agent,
     à valider. */
  deploiement: {
    ...messageRemy.deploiement,
    avant:
      "Ce tunnel de vente, je l'applique aujourd'hui moi-même dans mon propre business. Et au cours des dernières années, nous l'avons mis en place dans de nombreux ",
    souligne: "business",
  },
};

/** Les types d'offre surlignés en jaune dans la phrase d'ouverture, comme
 * l'étaient les voies, sur demande de Rémy. Sous-chaînes exactes de
 * `amorceVoies`. */
export const surlignesOptin = [
  "une formation en ligne",
  "du coaching ou du consulting",
  "de la prestation de services",
] as const;

/** La fin de la lettre de `/course`, dictée par Rémy. Le libellé du lien
 * ouvre la fenêtre d'inscription ; les trois points qui suivent sont ceux du
 * haut de page, `optinVsl.points`. La lettre ne s'ouvre plus sur un
 * guillemet, elle ne se ferme donc plus sur un. */
export const finOptin = {
  avant: "Et j'ai réalisé cette ",
  lien: "vidéo gratuite",
  apres: " dans laquelle je vous dévoile la solution pour :",
} as const;

/** Sous la signature de la lettre de `/course`, dicté par Rémy. */
export const fonctionRemy = "Fondateur de Funnels Club";

/**
 * Les témoignages sous la lettre de `/course`, sur demande de Rémy : des
 * cartes au dessin de celles du hero d'`/immersion`, l'affiche de l'entretien
 * en tête. Rien ne s'y clique : la preuve se lit sans rien ouvrir, et on ne
 * sort pas du tunnel.
 *
 * **Chaque citation est au mot près**, prise dans les citations de l'article
 * de la personne (`avis.ts`) ; `TemoignagesVsl` refuse de construire si l'une
 * n'y figure plus. **Le choix de la citation est de l'agent, à valider par
 * Rémy** : de préférence une phrase sur la méthode ou l'accompagnement plutôt
 * qu'un montant. **Aucune n'annonce de résultat**, sur décision de Rémy :
 * celle de Yannick et Sylvie, « notre chiffre a triplé », a été remplacée.
 *
 * **Les six premiers sont dans l'ordre dicté par Rémy** : Roland, Yannick et
 * Sylvie, François, Olga, Corentin, Valérie. La suite est libre.
 */
/** Le titre de la section, dicté par Rémy pour cette page. Pas de
 * sous-titre, sur sa demande. Il prend les codes du titre du haut de page :
 * « PARFAIT » en capitales, le tunnel de vente entre guillemets, les mêmes
 * morceaux en bleu.
 *
 * **Il ne parle pas de résultats**, et c'est voulu. « Résultats de nos élèves
 * après avoir mis en place… » a été essayé puis retiré par Rémy : au-dessus de
 * montants, il les présentait comme ce qu'on obtient en suivant la méthode,
 * ce que Google Ads refuse (allégations douteuses, voir son guide de
 * conformité). */
export const titreTemoignagesVsl = [
  { texte: "Ils ont mis en place le " },
  { texte: "PARFAIT “tunnel\u00a0de\u00a0vente”", accent: true },
  { texte: " pour " },
  { texte: "attirer leurs clients", accent: true },
] as const;

/** Le sous-titre de la section, dicté par Rémy. */
export const sousTitreTemoignagesVsl =
  "Chacun des témoignages ci-dessous sera accessible plus tard si vous souhaitez regarder la vidéo en intégralité. Il s'agit de vrais témoignages de vraies personnes que l'on a vraiment interviewées en vidéo.";

export const temoignagesVsl = [
  {
    id: "rgio4y4o8f",
    citation:
      "C'est incroyable comme c'est mathématique finalement. Si tu fais ce qu'il faut faire, que tu appliques ce qu'il faut appliquer, et que tu connais ton métier.",
  },
  {
    id: "2xege6bt0u",
    citation:
      "Tu ne sais pas ce que tu ne sais pas, et ce n'est pas parce que tu es bon dans un domaine que tu es bon sur tous les domaines.",
  },
  {
    id: "b5taio9plc",
    citation:
      "On a nos fausses croyances, on croit qu'on sait, on croit que c'est comme ça qu'il faut faire. Le fait de pouvoir interagir, ça déverrouille plein de choses.",
  },
  {
    id: "vtfaka0m80",
    citation:
      "Savoir que je pouvais vous envoyer le lien d'une page que j'avais faite et que vous alliez me dire si c'est ok, c'est hyper rassurant.",
  },
  {
    id: "iy3jgcijgu",
    citation:
      "Vous ne parlez pas de tout et de rien pour dire qu'il y a beaucoup de contenu. Vous parlez seulement de l'essentiel, de ce qui est nécessaire.",
  },
  {
    id: "4lkp9f6lm4",
    citation:
      "Je me suis mise sur les réseaux sociaux le vingt-huit août, et le trente et un août, j'avais déjà ma première cliente.",
  },
  {
    id: "f2ie1v99b8",
    citation:
      "Ce n'est pas des gens qui sont là pour vendre pour vendre. Si le profil ne correspond pas, on vous le dit clairement.",
  },
  {
    id: "abj3v8v8ek",
    citation:
      "Je t'ai fait confiance tout de suite, j'ai dit : ok, je prends la seconde. Et puis là, bingo. C'était la libération.",
  },
  {
    id: "gcfo8miafe",
    citation:
      "Ce que Funnels Club m'a apporté, c'est deux choses : clarté et structuration.",
  },
  {
    id: "2vtsinplyx",
    citation:
      "Simplification, étape par étape : c'est vraiment ce qui m'a le plus aidé dans le process.",
  },
  {
    id: "brvvtbkmfo",
    citation:
      "Ça nous permet d'éviter de faire plusieurs erreurs et de gagner du temps, mais de manière phénoménale.",
  },
  {
    id: "ive07co9xm",
    citation:
      "C'est important de se planter, mais on peut se planter de tellement de manières. Et il y a des gens qui sont passés avant nous.",
  },
  {
    id: "tvy3jbhml9",
    citation:
      "Je suis face à quelqu'un qui sait de quoi il parle, et qui n'en fait pas plus que ça sur sa personne ou sur ses revenus.",
  },
  {
    id: "s3npr5izhy",
    citation:
      "Vous nous guidez à chaque étape du processus, et en fait c'est impossible d'être perdu.",
  },
] as const;
