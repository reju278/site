import { messageRemyHub } from "@/contenu/hub";
import { messageRemy } from "@/contenu/site";
/**
 * Le VSL Funnel, sous go.funnels.club : l'opt-in de la formation gratuite
 * (`/course`), la vidéo et la prise d'appel (`/video-vsl`), puis la
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

/**
 * La clé sous laquelle l'opt-in garde prénom et e-mail, pour les titres du
 * tunnel et pour pré-remplir Calendly.
 *
 * **Dans le `localStorage` et non le `sessionStorage`**, depuis que `/appel`
 * s'ouvre dans un nouvel onglet, sur demande de Rémy : un lien
 * `rel="noreferrer"` ne recopie pas le `sessionStorage` dans l'onglet qu'il
 * ouvre, et Calendly arrivait vide. Le contact porte sa date (`t`) et n'est
 * plus lu après `DUREE_CONTACT_VSL` : de quoi revenir d'un e-mail de la
 * séquence, sans garder indéfiniment un e-mail dans le navigateur. Jamais
 * dans l'adresse, où GTM le lirait.
 */
export const CLE_CONTACT_VSL = "vsl-contact";

/** La clé des réponses au questionnaire de `/video-vsl`, rangées à côté du
 * contact et avec la même durée de vie. Recopiée dans `FormulaireCalendly`. */
export const CLE_REPONSES_VSL = "vsl-reponses";

/** Sept jours, en millisecondes. Recopié dans `FormulaireCalendly`. */
export const DUREE_CONTACT_VSL = 7 * 24 * 60 * 60 * 1000;

/* **Le tunnel tutoie**, sur décision de Rémy : titres, listes, boutons et
   fenêtre d'inscription. Les citations des témoignages restent telles
   qu'elles ont été dites. */
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
    { texte: " et vendre ta " },
    { texte: "formation", accent: true },
    { texte: " ou ton " },
    { texte: "coaching", accent: true },
    { texte: " (même si ton offre n’existe\u00a0pas\u00a0encore)" },
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
      { gras: "Valider ta niche" },
      ", définir ton positionnement et identifier parfaitement ",
      { gras: "ton client de rêve" },
    ],
    [
      { gras: "Créer une offre digitale" },
      " de A à Z ou à améliorer celle que tu as déjà afin d'",
      { gras: "augmenter tes prix" },
      " jusqu'à plusieurs milliers d'euros, même si tu démarres de zéro",
    ],
    [
      { gras: "Vendre ton offre digitale" },
      " grâce au ",
      { gras: "parfait tunnel de vente" },
    ],
  ],
  bouton: "Accéder à la vidéo GRATUITE",
  fenetre: {
    titre: "Entre tes informations pour découvrir la stratégie :",
    consentement:
      "J'accepte de recevoir les emails de Funnels Club (désabonnement possible à tout moment) et je valide la ",
    lienConfidentialite: "Politique de confidentialité",
    bouton: "Voir la formation GRATUITE",
  },
} as const;

export const videoVsl = {
  /* Dicté par Rémy, suivi du prénom de l'opt-in : voir `TitreVideoVsl`. */
  surtitre: "Voici ta vidéo de formation offerte",
  /* Quand l'objectif est connu, sur demande de Rémy. `{objectif}` est le
     montant retenu pour sa tranche (`strategieVsl.montants`). */
  titreObjectif:
    "Découvre comment nous allons t'aider à atteindre {objectif} par mois",
  /* Le bloc sous la vidéo, quand les réponses sont connues : la phrase
     d'origine (`appel`), personnalisée sur demande de Rémy, sans virgule.
     `{prix}` est le prix retenu pour la tranche (`strategieVsl.prix`), le
     même que celui de la stratégie. Sans prénom, la phrase commence à
     « Postule ». */
  appelPersonnalise:
    "{prenom} postule maintenant pour un appel gratuit de {duree} afin de savoir si tu es admissible au programme et au coaching Funnels Club pour atteindre {objectif} par mois avec une offre à {prix}.",
  /* « DIRECT VSL - MOTION GRAPHICS » chez Wistia, sur demande de Rémy, à la
     place de « Direct Webinar Funnels Club » (6w8wxhaqzk). La durée et
     l'affiche sont relevées sur le média. */
  video: {
    id: "di3bzcmi50",
    titre: "La formation gratuite Funnels Club",
    secondes: 981,
    affiche: "/vsl/affiche-motion.jpg",
    afficheMobile: "/vsl/affiche-motion-640.jpg",
  },

  appel: [
    { texte: "Postule maintenant pour un appel gratuit de " },
    { texte: "30 min", gras: true },
    {
      texte: " afin de savoir si tu es admissible au programme et au coaching ",
    },
    { texte: "“Funnels Club”", gras: true },
  ],
  /* « GRATUIT » en capitales, sur demande de Rémy. */
  bouton: "Réserve ton appel GRATUIT",
} as const;

/**
 * Les trois questions de la fenêtre d'inscription de `/course`, sur demande
 * de Rémy : après prénom, e-mail et consentement, « Voir la formation
 * GRATUITE » les fait apparaître une à une à la place des champs, avec une
 * barre de progression.
 *
 * **L'inscription part à la dernière réponse, et pas avant**, sur décision de
 * Rémy : le SDK de ClickFunnels envoie et change de page dans le même geste,
 * il n'y a pas de temps entre les deux pour poser autre chose. Le prix est
 * connu : quelqu'un qui abandonne pendant les questions n'est pas inscrit.
 *
 * **Chaque réponse part dans un champ personnalisé de la fiche ClickFunnels**,
 * `champ`, créé à la première valeur reçue.
 *
 * **Les émojis ne s'affichent qu'à l'écran**, sur demande de Rémy : `emojis`
 * suit `choix` rang pour rang, et ni ClickFunnels ni Calendly ne les
 * reçoivent. La valeur envoyée reste le choix nu.
 *
 * **Les choix sont ceux du Calendly de `/appel`, au caractère près**
 * (« Appel découverte (YT) », relevé par son API) : c'est ce qui permet de
 * pré-remplir ses questions avec ces réponses, `calendly` donnant le numéro
 * de la question dans le formulaire (`a2`, `a3`, `a5`). Un choix réécrit ici
 * ne serait plus reconnu par Calendly. Les intitulés, eux, sont tutoyés et
 * personnalisés : `{prenom}` est remplacé par le prénom de l'opt-in.
 *
 * Les intitulés des questions sont de l'agent, à valider par Rémy.
 */
export const questionnaireVsl = {
  /* Dicté par Rémy : le titre de la fenêtre pendant les questions. */
  intro:
    "Juste une dernière étape avant d'accéder à ta vidéo de formation gratuite :",
  introAvecPrenom:
    "Juste une dernière étape avant d'accéder à ta vidéo de formation gratuite {prenom} :",
  retour: "Retour",
  questions: [
    {
      cle: "activite",
      champ: "activite",
      calendly: "a2",
      titre: "Quelle option correspond le mieux à ton activité ?",
      choix: [
        "Vendeur de formation",
        "Créateur de contenu",
        "Coach / Consultant",
        "Thérapeute / Praticien",
        "Services en ligne (agence, freelance, prestations)",
      ],
      emojis: ["🎓", "🎥", "🧭", "🌿", "💻"],
    },
    {
      cle: "objectif",
      champ: "objectif_revenu",
      calendly: "a3",
      titre:
        "Quel est ton objectif de revenu mensuel dans les 6 prochains mois ?",
      choix: [
        "Moins de 5000€ /mois",
        "Entre 5000€ et 10 000€ /mois",
        "Entre 10 000€ et 50 000€ /mois",
        "Plus de 50 000€ /mois",
      ],
      emojis: ["🌱", "🚀", "🔥", "🏆"],
    },
    {
      cle: "prix",
      champ: "prix_offre",
      calendly: "a5",
      titre: "À quel prix veux-tu vendre ton offre principale ?",
      choix: [
        "Moins de 500€",
        "500€ à 2 000€",
        "2 000€ à 5 000€",
        "Plus de 5 000€",
      ],
      emojis: ["💶", "💰", "💎", "👑"],
    },
  ],
} as const;

/**
 * La stratégie personnalisée de `/video-vsl`, sous le bouton de réservation,
 * à la place du calculateur, sur demande de Rémy. Elle ne se sert que de ce
 * qu'on sait : le prénom et les trois réponses de la fenêtre d'inscription.
 * Sans réponses (lien ouvert directement), elle ne s'affiche pas.
 *
 * **Tout le texte est de l'agent, d'après les consignes de Rémy, à valider.**
 * Les montants aussi : `prix` donne le prix retenu pour chaque tranche et le
 * prix vers lequel on l'amène (500 € vers 1 500 €, rien au-delà de 5 000 €,
 * sur sa consigne) ; `montants` donne le montant mensuel retenu pour chaque
 * tranche d'objectif.
 *
 * `{prenom}`, `{objectif}`, `{prix}`, `{cible}`, `{clients}`,
 * `{clientsCible}`, `{annee}` et `{anneeCible}` sont remplacés à l'affichage.
 */
export const strategieVsl = {
  /* La première phrase est dictée par Rémy ; les deux suivantes sont de
     l'agent, écrites dans le même ton à sa demande. */
  titre: "Ta stratégie personnalisée",
  titreAvecPrenom: "{prenom}, voici ta stratégie personnalisée",
  phraseObjectif:
    "Comme tu vises {objectif} par mois, avec une offre à {prix}, il te faut donc {clients} clients par mois pour y arriver.",
  /* Quand la tranche de prix a une cible. */
  projection:
    "Maintenant, si ton offre valait {cible}, il ne te faudrait plus que {clientsCible} clients par mois pour atteindre le même objectif. Et avec tes {clients} clients, ton année passerait de {annee} à {anneeCible}.",
  /* Au-delà de 5 000 €, pas de prix plus haut à viser. */
  projectionSansCible:
    "Sur une année, ça représente donc {annee}. À ce prix, l'enjeu n'est plus de vendre plus cher, mais d'attirer chaque mois les bons clients.",
  legendeActuel: "Ton prix actuel : {prix}",
  /* L'axe des clients, sous la courbe. */
  axeClients: "Nombre de clients par mois",
  legendeCible: "Offre à {cible}",
  titreActivite: "Comment on va y arriver ensemble",
  /* Les quatre axes de la VSL, repris de sa transcription (Wistia,
     « DIRECT VSL - MOTION GRAPHICS », de 0:30 à 2:15) et tutoyés. Les mots
     sont ceux de Rémy, resserrés pour tenir sur une carte : à valider. */
  /* Dicté par Rémy, en titre comme « Comment on va y arriver ensemble ». */
  /* Le bouton sous les quatre étapes, dicté par Rémy. Ceux des
     témoignages gardent `appel.libelle`. */
  boutonEtapes: "Discuter avec notre équipe",
  introEtapes: "Voici les quatre étapes que nous allons mettre en place",
  etapes: [
    {
      titre: "Ta niche et ton client de rêve",
      texte:
        "Nous validons ta niche, définissons ton positionnement et identifions parfaitement ton client de rêve, pour te distinguer de la concurrence.",
    },
    {
      titre: "Ton offre digitale",
      texte:
        "Ensemble, nous créons de zéro ou améliorons ton offre pour que tu puisses augmenter tes prix jusqu'à plusieurs milliers d'euros, avec de vrais résultats pour tes clients.",
    },
    {
      titre: "Ton tunnel de vente",
      texte:
        "Tu reçois notre modèle de tunnel de vente, et nous l'adaptons à ta niche, à ton client de rêve et à ton offre, au prix que l'on aura déterminé ensemble.",
    },
    {
      titre: "Tes nouveaux clients",
      texte:
        "Nous t'accompagnons sur la publicité et la création de contenu, pour obtenir de nouveaux clients sans te demander quand viendra le prochain.",
    },
  ],
  titreTemoignages: "Ils étaient dans ta situation",
  /* Sous le titre des témoignages, propre à l'activité : ce qui rapproche
     ces trois entretiens de la personne. */
  introTemoignages: {
    "Vendeur de formation":
      "Comme toi, ils vendent une formation. Regarde comment ils l'ont construite et à quel prix ils la vendent aujourd'hui.",
    "Créateur de contenu":
      "Ils partageaient leur savoir, comme toi. Regarde comment ils en ont fait une offre qui se vend.",
    "Coach / Consultant":
      "Ils ont transformé leur savoir-faire en un accompagnement qui se vend bien. Regarde comment ils s'y sont pris.",
    "Thérapeute / Praticien":
      "Ils ont mis leur savoir dans une offre en ligne. Regarde comment ils ont organisé et tarifé leur activité.",
    "Services en ligne (agence, freelance, prestations)":
      "Regarde comment ils ont revu leur offre et leur tarif pour attirer les bons clients.",
  } as Record<string, string>,
  /* Le bouton d'appel des témoignages et de leur fenêtre, au modèle du hub :
     sous la vidéo de l'entretien ouvert, au milieu de son article et sous
     les cartes. Vers `/appel`, dans un nouvel onglet. */
  appel: {
    ancre: "/appel",
    libelle: "Réserve ton appel GRATUIT",
    nouvelOnglet: true,
    encart: {
      titre: "Parlons de ton activité",
      texte:
        "Un appel gratuit de 30 minutes avec l'équipe pour faire le point sur ton offre, ton prix et la façon dont tu la vends aujourd'hui.",
    },
  },
  /* Le paragraphe propre à chaque activité, clé = le choix exact. */
  activites: {
    "Vendeur de formation":
      "Une formation se vend plusieurs milliers d'euros quand elle ne se limite pas à des vidéos : des modules pour apprendre, des coachings en direct pour avancer, un groupe pour ne pas rester seul, et un accompagnement pour aller au bout. C'est cet ensemble qui justifie le prix, et c'est ce qu'on construit avec toi.",
    "Créateur de contenu":
      "Ton audience te fait déjà confiance. L'étape suivante est de transformer ce que tu partages gratuitement en une offre complète : une formation en modules, avec des coachings et un groupe. C'est ce qui te permet de proposer une offre à plusieurs milliers d'euros à ceux qui te suivent.",
    "Coach / Consultant":
      "Vendre ton temps à l'heure plafonne vite ton revenu. L'idée est de transformer ton accompagnement en programme : une méthode en étapes, des séances, un suivi sur plusieurs semaines. Un programme se vend pour ce qu'il permet d'atteindre, pas à l'heure, et c'est ce qui permet de monter ton tarif.",
    "Thérapeute / Praticien":
      "Ton savoir peut servir à bien plus de personnes que celles que tu reçois. Même principe qu'une formation : tu le mets en modules, tu ajoutes des temps d'échange en groupe et un accompagnement. Ton activité ne dépend plus seulement de ton agenda.",
    "Services en ligne (agence, freelance, prestations)":
      "Le piège des prestations, c'est de facturer au temps passé. L'idée est de bien packager et bien facturer tes services : une offre claire, un livrable défini, un prix à la hauteur de ce que tu apportes. Avec le bon tunnel de vente, ce sont les bons clients qui viennent à toi.",
  } as Record<string, string>,
  /* Les entretiens montrés selon l'activité, dictés par Rémy, Roland en tête
     « pour monter le tarif ». Coach / Consultant n'a pas été dicté : choix
     de l'agent, à valider. */
  temoignages: {
    "Vendeur de formation": ["rgio4y4o8f", "b5taio9plc", "2xege6bt0u"],
    "Créateur de contenu": ["rgio4y4o8f", "b5taio9plc", "tvy3jbhml9"],
    "Coach / Consultant": ["rgio4y4o8f", "gcfo8miafe", "iy3jgcijgu"],
    "Thérapeute / Praticien": ["rgio4y4o8f", "abj3v8v8ek", "ive07co9xm"],
    "Services en ligne (agence, freelance, prestations)": [
      "rgio4y4o8f",
      "9a6g6hsyzp",
      "iy3jgcijgu",
    ],
  } as Record<string, readonly string[]>,
  prix: {
    "Moins de 500€": { prix: 500, cible: 1500 },
    "500€ à 2 000€": { prix: 1000, cible: 3000 },
    "2 000€ à 5 000€": { prix: 3000, cible: 6000 },
    "Plus de 5 000€": { prix: 6000, cible: null },
  } as Record<string, { prix: number; cible: number | null }>,
  montants: {
    "Moins de 5000€ /mois": 5000,
    "Entre 5000€ et 10 000€ /mois": 10000,
    "Entre 10 000€ et 50 000€ /mois": 20000,
    "Plus de 50 000€ /mois": 50000,
  } as Record<string, number>,
};

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
 * phrase, « Je m'appelle Rémy, et j'ai un message pour toi... ». Tout le
 * reste est la lettre de l'accueil, mot pour
 * mot.
 */
export const messageRemyOptin = {
  ...messageRemy,
  titre: "Je m'appelle Rémy, et j'ai un message pour toi...",
  amorceVoies:
    "Si vous souhaitez créer et vendre une formation en ligne, du coaching ou du consulting, ou même de la prestation de services, alors il y a trois erreurs que vous devez absolument éviter.",
  voies: [],
  amorceErreurs: "",
  /* Les passages que Rémy a fait corriger pour les règles publicitaires sur le
     hub, repris tels quels pour Google Ads, sur sa demande : les deux absolus
     des erreurs (« ne suffisent plus », « beaucoup de mal à transformer ce
     trafic en clients ») et les valeurs (« simple et répétable », sans
     « toute une vie peut reposer »). Lus dans `messageRemyHub`, pas recopiés. */
  erreurs: [
    messageRemyHub.erreurs[0]!,
    messageRemyHub.erreurs[1]!,
    {
      ...messageRemyHub.erreurs[2]!,
      /* « AVANT » en capitales, sur demande de Rémy : c'est le mot qui fait
         l'erreur. */
      titre: messageRemyHub.erreurs[2]!.titre.replace("avant", "AVANT"),
    },
  ],
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

/** Le premier paragraphe de la lettre de `/course`, dicté par Rémy et mis en
 * phrase par l'agent : à valider. « Plusieurs millions d'euros » est un
 * résultat de Rémy et non une promesse au lecteur, ce que son guide Google Ads
 * accepte (« parler de ses propres résultats »), à condition d'en garder la
 * preuve. C'est la formule déjà validée pour les slides 4 et 7. */
export const ouvertureOptin =
  "Je suis formateur depuis plus de dix ans, et j'ai réalisé plusieurs millions d'euros de chiffre d'affaires grâce à la stratégie que je m'apprête à vous dévoiler.";

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

/** Le sous-titre de la section, dicté par Rémy. Sa première phrase, qui
 * annonçait les vidéos complètes « plus tard », est retirée à sa demande :
 * aucune page après l'inscription ne les montre. */
export const sousTitreTemoignagesVsl =
  "Il s'agit de vrais témoignages de vraies personnes que l'on a vraiment interviewées en vidéo.";

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
