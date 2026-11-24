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
   * consentement, le téléphone. Ses libellés, exemples, consentement et
   * erreurs sont ceux de Genesis, écrits une seule fois ; seul le bouton est
   * à elle. La question de chaque temps est le titre de la fenêtre (il
   * remplace « Entrez vos informations pour découvrir la stratégie : »).
   */
  fenetre: {
    ...optinGenesis.formulaire,
    /* Le même bouton aux trois temps, sur demande de Rémy : « Voir la vidéo
       GRATUITE », jamais « Continuer ». */
    etapes: {
      nom: { question: optinGenesis.formulaire.etapes.nom.question, bouton: "Voir la vidéo GRATUITE" },
      email: { question: optinGenesis.formulaire.etapes.email.question, bouton: "Voir la vidéo GRATUITE" },
      telephone: { question: optinGenesis.formulaire.etapes.telephone.question, bouton: "Voir la vidéo GRATUITE" },
    },
    fermer: "Fermer",
  },
};

/**
 * La vidéo, `/course-modele/video` : la page de `funnels.club/vsl-2025-fb`,
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
  },
  titrePage: "Vidéo de formation gratuite",
  /* De Rémy, au tutoiement, suivi du prénom de l'opt-in : « Ta formation
     offerte Rémy ». La page ClickFunnels disait « Votre formation offerte ». */
  titre: "Ta formation offerte",
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
};
