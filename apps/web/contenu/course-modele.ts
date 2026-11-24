import { optinGenesis } from "@/contenu/formation-genesis";

/**
 * « Course modèle », servie sur `go.funnels.club/course-modele` : la copie de
 * l'optin ClickFunnels `funnels.club/course-2025-fb`, sur demande de Rémy,
 * **bâtie sur le dessin de Formation Genesis** (bannière, PT Serif, bouton
 * bleu à angles droits, champs d'Arc UI) et non sur celui du tunnel VSL.
 *
 * **Les textes sont recopiés au mot près** de la page ClickFunnels, relevée
 * le 24 novembre 2026 : le titre, le sous-titre, l'accroche, les quatre
 * points et la fenêtre d'inscription. Seuls les libellés d'interface ajoutés
 * pour nous (erreurs, envoi) sont de l'agent, marqués PROVISOIRES.
 */

/** Le cookie qui garde à un visiteur sa version de l'opt-in (test A/B). */
export const COOKIE_VERSION_OPTIN = "cm-version";

/** La racine du tunnel, écrite une fois. */
export const RACINE_COURSE_MODELE = "/course-modele";

/**
 * Le tag ClickFunnels posé sur chaque inscription : **« Inscription (N) »**,
 * jaune, sur demande de Rémy le 24 novembre 2026 (il remplace
 * « course-2025 », 483167, qui reste dans ClickFunnels sans rien
 * déclencher). **C'est lui qui déclenche la séquence e-mail**, « Direct
 * Webinar (N) : séquence email (5 jours) » (workflow `RyKwnB`).
 *
 * Créé par l'API dans le workspace « Funnels Club ». Comme celui de Genesis,
 * ce n'est pas un secret : c'est l'identifiant qui compte, un renommage du
 * tag là-bas ne casse rien.
 */
export const TAG_COURSE_MODELE = { id: 483202, nom: "Inscription (N)" } as const;

/**
 * Le tag posé côté Hyros, par son script (`window.hrs.addLeadTag`), sur
 * l'adresse que la fenêtre lui donne. Le `!` est la marque des tags posés
 * depuis une page, comme le `!clicked` de son script universel.
 */
export const TAG_HYROS_COURSE_MODELE = "!course-2025";

/**
 * Le parcours, de page en page, sur le modèle de ClickFunnels
 * (`course-2025-fb`, `vsl-2025-fb`, `appel-2025-fb`, `thanks`), sur demande
 * de Rémy : l'opt-in, la vidéo, la prise d'appel, la confirmation. Tout sous
 * la racine du tunnel, donc dans son gabarit, hors de l'en-tête du site,
 * interdit d'index et forcé au clair.
 */
export const CHEMINS_COURSE_MODELE = {
  /* **L'adresse qui répartit 50 / 50** entre les deux versions de l'opt-in
     (test A/B, sur demande de Rémy le 24 novembre 2026) : c'est elle que
     portent les publicités et les liens. Voir `course-modele/route.ts`. */
  optin: RACINE_COURSE_MODELE,
  /* Les deux versions, qui ne diffèrent que par un code court tiré au
     hasard : on ne devine pas l'autre depuis l'une. */
  optinA: `${RACINE_COURSE_MODELE}/o5dfv`,
  optinB: `${RACINE_COURSE_MODELE}/zvb5y`,
  /* **« vsl » doit être dans l'adresse de la vidéo**, sur demande de Rémy
     (24 novembre 2026). L'ancienne, `/video`, y redirige. La clé reste
     `video`, comme l'étape du CRM. */
  video: `${RACINE_COURSE_MODELE}/vsl`,
  appel: `${RACINE_COURSE_MODELE}/appel`,
  /* **« thanks » doit être dans l'adresse de la confirmation**, sur demande
     expresse de Rémy : ne pas la renommer. */
  thanks: `${RACINE_COURSE_MODELE}/thanks`,
} as const;

/** Où l'on arrive après l'inscription : la vidéo. */
export const APRES_INSCRIPTION = CHEMINS_COURSE_MODELE.video;

/** Un morceau de phrase : du texte, ou un passage en gras. */
export type Segment = string | { gras: string };

export const optinCourseModele = {
  /** Le titre d'onglet et la description, ceux de la page ClickFunnels. */
  titrePage: "Stop aux sites, place aux tunnels de vente",
  description:
    "Comment créer un tunnel de vente, pour vendre des offres digitales sur la durée",
  titre: "Stop aux sites, place aux tunnels de vente",
  /** Surligné en bleu pâle, sous le titre. Le texte de
   *  `funnels.club/course-2025`, version « Stop aux sites » (la page est
   *  en test A/B avec « Nous allons mettre en place… »), donné par Rémy le
   *  24 novembre 2026. */
  sousTitre: [
    "Comment créer un ",
    { gras: "tunnel de vente" },
    ", pour vendre des ",
    { gras: "offres digitales*" },
    " sur la durée. Pas de surpromesses, juste du franc-parler, par quelqu’un qui l’a\u00a0fait.",
  ] as Segment[],
  /** La photo de Rémy au micro, celle de la page, recadrée et compressée. */
  photo: {
    src: "/course-modele/remy-micro.jpg",
    largeur: 1120,
    hauteur: 630,
    alt: "Rémy Jupille assis à son bureau, devant un micro",
  },
  /** L'astérisque des « offres digitales* » du sous-titre se retrouve ici,
   *  en gras devant « formation en ligne », comme sur la page. */
  accroche: [
    "Comment développer un business de ",
    { gras: "*formation en ligne" },
    ", ",
    { gras: "coaching" },
    " ou de ",
    { gras: "prestation de service" },
    " qui dégage des bénéfices en toute saison, et sur la\u00a0durée.",
  ] as Segment[],
  /** Les quatre points ; `surligne` est le mot posé sur le rose. Partout,
   *  les deux derniers mots sont liés par une espace insécable : sans elle,
   *  « fait. » ou « faire » finissait seul sur sa ligne à 375 px. */
  points: [
    { surligne: "Sans", suite: "site internet complexe qui ne convertit\u00a0pas" },
    { surligne: "Sans", suite: "vendre son âme dans la création de\u00a0contenu" },
    { suite: "Avec un tunnel de vente qui attire les clients à\u00a0vous" },
    { suite: "Pour ainsi vous concentrer sur ce que vous aimez\u00a0faire" },
  ] as { surligne?: string; suite: string }[],
  /** Écrit en minuscules, rendu en capitales par le bouton. */
  bouton: "Apprendre",
  /**
   * La fenêtre d'inscription, **en trois temps comme l'optin de Genesis**, sur
   * demande de Rémy le 24 novembre 2026 : le prénom et le nom, l'e-mail et le
   * consentement, puis un choix (« ce qui te décrit le mieux ») à la place du
   * téléphone, suivi d'un petit chargement. Ses libellés, exemples, consentement et
   * erreurs sont ceux de Genesis, écrits une seule fois ; le bouton et le
   * premier titre sont à elle. La question de chaque temps est le titre de
   * la fenêtre ; au premier, le titre de la référence.
   */
  fenetre: {
    ...optinGenesis.formulaire,
    /* Le même bouton aux trois temps, sur demande de Rémy : « Voir la vidéo
       GRATUITE », jamais « Continuer ». */
    etapes: {
      /* Le premier titre est celui de la page ClickFunnels, sur deux
         lignes coupées là où elle les coupe, sur demande de Rémy ; les deux
         suivants sont les questions de Genesis. */
      nom: { question: ["Entrez vos informations", "pour découvrir la stratégie :"], bouton: "Voir la vidéo GRATUITE" },
      email: { question: [optinGenesis.formulaire.etapes.email.question], bouton: "Voir la vidéo GRATUITE" },
      /* Le dernier temps, de Rémy : un choix à la place du téléphone,
         tutoyé et au prénom. Pas de bouton : on choisit, et c'est parti. */
      situation: { question: ["Dernière étape, qu'est-ce qui te décrit le mieux, {prenom} ?"], bouton: "Voir la vidéo GRATUITE" },
      /* Pour qui a déjà une activité seulement, de Rémy : son chiffre
         d'affaires, puis le chargement. */
      ca: { question: ["À quel niveau de chiffre d'affaires es-tu actuellement ?"], bouton: "Voir la vidéo GRATUITE" },
    },
    /** Les deux réponses du dernier temps, de Rémy, « PAS » et « DÉJÀ » en
     *  gras à sa demande. `libelle` est ce que
     *  gardent le CRM (colonne « Situation ») et ClickFunnels (champ
     *  personnalisé `course_modele_situation`) ; `suite`, la phrase du
     *  chargement qui suit, de Rémy. */
    situations: [
      {
        valeur: "zero",
        texte: ["Je n'ai ", { gras: "PAS" }, " encore d'offre à vendre, je démarre de zéro"] as Segment[],
        libelle: "Démarre de zéro",
        suite:
          "Cette formation va te présenter la stratégie exacte pour te lancer, regarde-la attentivement si ce projet est important pour toi.",
      },
      {
        valeur: "activite",
        texte: ["J'ai ", { gras: "DÉJÀ" }, " une activité, et je veux la développer"] as Segment[],
        libelle: "Activité à développer",
        suite:
          "Cette formation va te présenter la stratégie exacte pour développer ton activité, regarde-la attentivement pour passer au niveau supérieur avec ton activité.",
      },
    ],
    /** Les réponses de la question du chiffre d'affaires, de Rémy. `valeur`
     *  part au CRM, qui la range en étiquette dans la colonne « Situation »,
     *  et à ClickFunnels (`course_modele_ca`, le `libelle`). */
    chiffresAffaires: [
      { valeur: "moins-5k", libelle: "Moins de 5\u00a0000\u00a0€ / mois" },
      { valeur: "5k-10k", libelle: "Entre 5\u00a0000\u00a0€ et 10\u00a0000\u00a0€ / mois" },
      { valeur: "10k-50k", libelle: "Entre 10\u00a0000\u00a0€ et 50\u00a0000\u00a0€ / mois" },
      { valeur: "plus-50k", libelle: "Plus de 50\u00a0000\u00a0€ / mois" },
    ],
    /** Le chargement après le choix, de Rémy : le titre, la barre, puis la
     *  phrase de la réponse choisie (`suite`). La vidéo de la page suivante
     *  se charge pendant ce temps. */
    chargement: {
      titre: "Chargement de la formation…",
    },
    fermer: "Fermer",
  },
};

/**
 * La vidéo, `/course-modele/vsl` : la page de `funnels.club/vsl-2025-fb`,
 * au mot près (vouvoiement compris), sur le dessin de Genesis. La vidéo est
 * « VSL 2027 (N) » chez Wistia (`58ivuyq0at`), donnée par Rémy le 24
 * novembre 2026 à la place de celle de `/video-vsl` (`di3bzcmi50`). Son
 * affiche est la copie de `public/temoignages`, relayée depuis Wistia
 * (`app/affiches`). Le tunnel du CRM suit le visionnage de cette vidéo
 * (`wistia` de l'étape `video`, `funnels.ts`) : les deux changent ensemble.
 */
export const videoCourseModele = {
  video: {
    id: "58ivuyq0at",
    titre: "La formation gratuite Funnels Club",
    secondes: 1963,
    affiche: "/temoignages/58ivuyq0at.jpg",
    /** La couleur du lecteur et de son cadre, sur demande de Rémy : celle
     *  qui est réglée sur la vidéo chez Wistia, le bleu des boutons du
     *  tunnel (`--genesis-bleu`, #438bf7). */
    couleur: "438bf7",
  },
  titrePage: "Vidéo de formation gratuite",
  /* De Rémy, au tutoiement, suivi du prénom de l'opt-in : « Ta formation
     offerte Rémy ». La page ClickFunnels disait « Votre formation offerte ». */
  titre: "Ta formation offerte",
  appel: [
    "Postulez maintenant pour un appel gratuit de 30 min afin de savoir si vous êtes admissible au programme et au coaching ",
    { gras: "“Funnels Club”" },
  ] as Segment[],
  /* Tutoyé, sur demande de Rémy. */
  bouton: "Réserve ton appel gratuit",
};

/**
 * La prise d'appel, `/course-modele/appel` : Calendly intégré, prérempli
 * avec ce que l'opt-in a gardé dans le navigateur (prénom, e-mail ; nom et
 * téléphone quand on les a), comme `/reservation` de Genesis.
 */
export const appelCourseModele = {
  titrePage: "Réservez votre appel",
  /* De Rémy, au tutoiement, suivi du prénom de l'opt-in : « Réserve ton
     appel ci-dessous Rémy ». La page ClickFunnels n'a que le formulaire. */
  titre: "Réserve ton appel ci-dessous",
  titreFormulaire: "Formulaire de réservation de l'appel",
  /**
   * **« Candidature Funnels Club (N) »**, l'événement de ce tunnel, donné par
   * Rémy le 24 novembre 2026. Ses questions sont dans l'ordre de celui du VSL
   * (téléphone, produit, objectif, obstacle, investissement) : la
   * confirmation, qui lit les réponses par leur rang (`answer_1`…), les
   * nomme juste. Chez Calendly, sa page de confirmation se règle sur
   * `go.funnels.club/course-modele/thanks`, détails de l'événement transmis,
   * sans quoi la confirmation ne connaît ni la date ni l'hôte. Le CRM
   * reconnaît l'événement pour poser « Appel réservé » dans ClickFunnels
   * (`EVENEMENTS_APPEL_RESERVE`, dépôt `Funnels-Club`) : changer d'événement
   * oblige à changer les deux.
   */
  calendly: "https://calendly.com/funnels-club/candidature-funnels-club-yt-clone-2",
  /** « Téléphone / WhatsApp », la première question (`a1`), relevée par
   *  l'API de Calendly le 24 novembre 2026. */
  questionTelephone: "a1",
};

/** La confirmation, `/course-modele/thanks` : `/thanks`, au dessin du tunnel. */
export const confirmationCourseModele = {
  titrePage: "Votre appel est réservé",
  barre: "Votre appel est réservé",
  /* La vidéo de l'étape 1, « Page de confirmation : 2027 (N) » chez Wistia,
     donnée par Rémy le 24 novembre 2026 à la place de celle de `/thanks`.
     Le numéro, le titre et les consignes de l'étape restent ceux de
     `/thanks`. */
  video1: {
    id: "2f33p4uyzi",
    titre: "La vidéo de confirmation de ton appel",
    secondes: 452,
  },
  /* **Le mot sous la vidéo de l'étape 1**, en texte suivi, dicté par Rémy le
     24 novembre 2026 à la place des consignes de `/thanks`
     (`RendezVousCloseur`). Le closeur est l'hôte que Calendly transmet
     (`assigned_to`), sa photo celle de l'équipe ; pas de prénom de la
     personne à la fin, retiré par Rémy. Sans réservation lue, la version
     sans nom. */
  rendezVous: {
    avec: "Tu as rendez-vous avec",
    le: "le",
    message: {
      avant: "Il va t'envoyer un message sur",
      whatsapp: "WhatsApp",
      /* « et » en minuscule et sans gras, sur demande de Rémy. */
      apres: "et par e-mail pour confirmer.",
      /* Surligné en vert comme « WhatsApp », sur demande de Rémy. */
      reponds: "Réponds simplement à son message",
      valider: "pour valider.",
    },
    sansHote:
      "Un conseiller de l'équipe va t'envoyer un message sur",
    personne: {
      /* « Sébastien est une VRAIE personne », « ton conseiller » sans nom. */
      qui: (prenomHote?: string) =>
        `Pour information, ${prenomHote ?? "ton conseiller"} est une`,
      vraie: "VRAIE",
      suite:
        "personne (pas un robot ou une IA), il va prendre de son temps personnel pour ce rendez-vous avec toi et répondre à toutes tes questions",
    },
    /* La dernière phrase, dictée par Rémy : « cliquant ici » ouvre WhatsApp
       vers le closeur (`whatsappHotes` de `contenu/thanks.ts`, Calendly ne
       transmet pas son numéro), le message préparé. Sans numéro connu, la
       phrase ne paraît pas. */
    devants: {
      avant:
        "Si tu souhaites prendre les devants, tu peux lui envoyer un message par toi\u2011même en",
      lien: "cliquant ici",
      apres: "pour confirmer.",
    },
    /* « Bonjour Sébastien, c'est Rémy, je confirme simplement mon
       rendez-vous le jeudi 26 novembre à 15 h, merci », dicté par Rémy.
       Chaque morceau tombe s'il manque. */
    messageWhatsapp: (r: {
      hote?: string;
      prenom?: string;
      jour?: string;
      heure?: string;
    }) => {
      const qui = r.prenom ? `, c'est ${r.prenom}` : "";
      const quand = [r.jour && ` le ${r.jour}`, r.heure && ` à ${r.heure}`]
        .filter(Boolean)
        .join("");
      return `Bonjour${r.hote ? ` ${r.hote}` : ""}${qui}, je confirme simplement mon rendez-vous${quand}, merci`;
    },
  },
  /* La seconde vidéo, de Rémy : la VSL elle-même, reprise là où la
     personne s'est arrêtée (`ReprendreVsl`). `{temps}` devient « 2 min 30 ». */
  vsl: {
    arretee: {
      titre: "Tu as arrêté la vidéo de formation à {temps}",
      texte: "Finis-la avant ton rendez-vous : elle reprend là où tu t'es arrêté.",
    },
    finie: {
      titre: "Tu as regardé la vidéo de formation jusqu'au bout",
      texte: "Revois-la si besoin avant ton rendez-vous.",
    },
    aVoir: {
      /* « Finis » et non « Regarde », sur demande de Rémy : on l'a déjà
         commencée, Wistia la reprend même tout seul là où on l'a laissée. */
      titre: "Finis la vidéo de formation avant ton rendez-vous",
      texte: "Elle répond déjà à beaucoup de questions que tu te poses.",
    },
  },
};

/**
 * **La version B de l'opt-in** (test A/B), sur demande de Rémy le 24 novembre
 * 2026 : la structure d'une page qu'il a montrée (le titre centré en haut,
 * l'astérisque dessous, puis une carte : la photo à gauche, la promesse, la
 * liste et le bouton à droite), avec les couleurs, les polices et la photo
 * du tunnel. Le titre s'arrête à « produits digitaux », sur sa demande. La
 * fenêtre d'inscription est la même.
 *
 * La durée : la formation fait 33 minutes (`videoCourseModele.secondes`),
 * d'où « 30 min » et non les « 40 min » de la page d'origine.
 */
export const optinCourseModeleB = {
  /* Le titre de Rémy, le 24 novembre 2026 ; l'astérisque renvoie à la
     note. */
  titre: [
    "Comment créer un ",
    { gras: "tunnel" },
    " pour attirer des ",
    { gras: "clients qualifiés" },
    " et vendre des ",
    { gras: "produits digitaux*" },
  ] as Segment[],
  note: "*formation en ligne, service digital ou coaching",
  promesse: "30 min de formation gratuite pour apprendre à :",
  points: [
    "Créer une offre digitale irrésistible qui vous ressemble sans avoir besoin d'être un expert.",
    "La méthode simple pour créer le meilleur tunnel de vente pour vous, adapté à votre offre, vos clients et votre marché.",
    "Vendre avec de gros profits en fixant des prix justes afin de vivre confortablement de votre activité en ligne.",
  ],
  bouton: "Voir la formation GRATUITE",
};
