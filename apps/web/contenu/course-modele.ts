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
 * Où l'on arrive après l'inscription. **PROVISOIRE, à confirmer par Rémy** :
 * sur ClickFunnels, « Voir la vidéo » mène à l'étape suivante du tunnel,
 * qu'on ne voit pas depuis la page. En attendant, la VSL du site, qui est
 * celle de `/course` (la version sans « -fb » de la même page) : elle se
 * préremplit avec le prénom et l'e-mail gardés par l'inscription.
 */
export const APRES_INSCRIPTION = "/video-vsl";

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
