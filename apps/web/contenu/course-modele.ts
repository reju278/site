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

/** La racine du tunnel, écrite une fois. */
export const RACINE_COURSE_MODELE = "/course-modele";

/**
 * Le tag ClickFunnels posé sur chaque inscription. **C'est lui qui déclenche
 * l'automatisation**, montée dans ClickFunnels par Rémy.
 *
 * Créé par l'API le 24 novembre 2026 dans le workspace « Funnels Club »,
 * depuis le CRM (`clickfunnels:etiquetteNommee`). Comme celui de Genesis, ce
 * n'est pas un secret : c'est l'identifiant qui compte, un renommage du tag
 * là-bas ne casse rien.
 */
export const TAG_COURSE_MODELE = { id: 483167, nom: "course-2025" } as const;

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
  optin: RACINE_COURSE_MODELE,
  video: `${RACINE_COURSE_MODELE}/video`,
  appel: `${RACINE_COURSE_MODELE}/appel`,
  merci: `${RACINE_COURSE_MODELE}/merci`,
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
  /** Surligné en bleu pâle, sous le titre. */
  sousTitre: [
    "Comment créer un ",
    { gras: "tunnel de vente" },
    ", pour vendre une ",
    { gras: "formation en ligne" },
    " sur la durée. Pas de surpromesses, juste du franc-parler, par quelqu’un qui l’a\u00a0fait.",
  ] as Segment[],
  /** La photo de Rémy au micro, celle de la page, recadrée et compressée. */
  photo: {
    src: "/course-modele/remy-micro.jpg",
    largeur: 1120,
    hauteur: 630,
    alt: "Rémy Jupille assis à son bureau, devant un micro",
  },
  accroche: [
    "Comment développer un business de ",
    { gras: "formation en ligne" },
    " ou de ",
    { gras: "coaching" },
    " à partir de ses connaissances, qui dégage des bénéfices en toute saison, et sur la\u00a0durée.",
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
  fenetre: {
    /** Sur deux lignes, coupées là où la page les coupe. */
    titre: ["Entrez vos informations", "pour découvrir la stratégie :"],
    prenom: "Prénom",
    email: "Email",
    consentement:
      "J'accepte de recevoir les emails de Funnels Club (désabonnement possible à tout moment) et je valide la ",
    lienConfidentialite: "Politique de confidentialité",
    bouton: "Voir la vidéo",
    /* PROVISOIRES, de l'agent, sur ceux de Genesis : les textes grisés
       dans les champs, l'envoi, la croix et les erreurs. */
    exemples: { prenom: "Votre prénom", email: "Votre adresse email" },
    envoi: "Envoi…",
    fermer: "Fermer",
    erreurs: {
      champs: "Veuillez remplir tous les champs obligatoires pour continuer.",
      email: "Veuillez indiquer une adresse email valide.",
      envoi: "L'envoi n'est pas passé. Vérifiez votre email et réessayez.",
    },
  },
};

/**
 * La vidéo, `/course-modele/video` : la page de `funnels.club/vsl-2025-fb`,
 * au mot près (vouvoiement compris), sur le dessin de Genesis. La vidéo est
 * celle de `/video-vsl` (`videoVsl.video`, Wistia `di3bzcmi50`), la même que
 * sur la page ClickFunnels.
 */
export const videoCourseModele = {
  titrePage: "Vidéo de formation gratuite",
  titre: "Votre formation offerte",
  appel: [
    "Postulez maintenant pour un appel gratuit de 30 min afin de savoir si vous êtes admissible au programme et au coaching ",
    { gras: "“Funnels Club”" },
  ] as Segment[],
  bouton: "Réservez votre appel gratuit",
};

/**
 * La prise d'appel, `/course-modele/appel` : Calendly intégré, prérempli
 * avec ce que l'opt-in a gardé dans le navigateur (prénom, e-mail ; nom et
 * téléphone quand on les a), comme `/reservation` de Genesis.
 */
export const appelCourseModele = {
  titrePage: "Réservez votre appel",
  /* PROVISOIRE, de l'agent, sur le titre de Genesis : la page ClickFunnels
     n'a que le formulaire. Suivi du prénom de l'opt-in. */
  titre: "Réservez votre appel ci-dessous",
  titreFormulaire: "Formulaire de réservation de l'appel",
  /**
   * **PROVISOIRE : l'événement de `funnels.club/appel-2025-fb`**,
   * « Candidature Funnels Club (FB) », en attendant celui que Rémy crée pour
   * ce tunnel. Le jour où il change : la nouvelle adresse ici, sa question
   * du téléphone dessous, et chez Calendly sa page de confirmation réglée
   * sur `go.funnels.club/course-modele/merci`, détails de l'événement
   * transmis, sans quoi la confirmation ne connaît ni la date ni l'hôte.
   */
  calendly: "https://calendly.com/funnels-club/appel-decouverte-yt-clone-3",
  /** « Téléphone / WhatsApp », la première question (`a1`), relevée par
   *  l'API de Calendly le 24 novembre 2026. */
  questionTelephone: "a1",
};

/** La confirmation, `/course-modele/merci` : `/thanks`, au dessin du tunnel. */
export const confirmationCourseModele = {
  titrePage: "Votre appel est réservé",
  barre: "Votre appel est réservé",
};
