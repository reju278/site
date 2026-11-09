/**
 * Les pages `go.funnels.club/debuts`, `/stable` et `/lancement`, sur demande de Rémy : une
 * vidéo Wistia et son titre. La description est à valider par Rémy.
 */
export const videoDebuts = {
  id: "h4z4g82lyi",
  secondes: 1653,
  titre: "Étape par étape, comment j'ai gagné mon premier million",
  description:
    "La vidéo où Rémy Jupille raconte, étape par étape, comment il a gagné son premier million.",
} as const;

export const videoStable = {
  id: "04wqsqzo30",
  secondes: 7238,
  titre: "Comment créer un business en ligne incroyablement stable et profitable",
  description:
    "La vidéo où Rémy Jupille explique comment créer un business en ligne stable et profitable.",
} as const;

/**
 * `go.funnels.club/lancement`. Le titre est le nom de la vidéo dans Wistia,
 * sans son préfixe « Confirmation · » ; la vidéo est aussi celle de qui démarre
 * de zéro sur `/thanks-quizz`. La description est à valider par Rémy.
 */
export const videoLancement = {
  id: "vkvffo2189",
  /* 2 738,73 secondes, relevées sur l'API de Wistia. */
  secondes: 2739,
  titre: "Comment lancer une formation en ligne en 2027",
  description:
    "La vidéo où Rémy Jupille explique comment lancer une formation en ligne en 2027, étape par étape.",
} as const;

/**
 * `go.funnels.club/info-consulting`, sur demande de Rémy : sa vidéo YouTube
 * sur le consulting, importée dans Wistia, puis l'appel. Le titre est celui de
 * la vidéo sur YouTube ; la description est à valider par Rémy.
 *
 * **Le bouton ne mène pas à `/appel` mais au formulaire Calendly du
 * consulting**, sur demande de Rémy. Sans `el=site` : Calendly n'est pas une
 * page qu'Hyros suit. Le bouton y relaie quand même `email` et les `utm_*` du
 * lien reçu, que Calendly sait lire (préremplissage, suivi de campagne).
 */
export const calendlyConsulting = "https://calendly.com/funnels-club/consulting";

export const videoConsulting = {
  id: "8dynngktko",
  /* 1 410,94 secondes, relevées à l'import dans Wistia. */
  secondes: 1411,
  /* Le titre de la vidéo sur YouTube, mot pour mot, sur demande de Rémy. */
  titre: "Je vends mon consulting 6K€ /mois et je suis “Sold Out” (voici pourquoi)",
  description:
    "La vidéo où Rémy Jupille explique pourquoi son consulting à 6 000 € par mois affiche complet, et comment il l'a construit.",
} as const;

/**
 * `go.funnels.club/debuts-appel`, `/stable-appel` et `/lancement-appel` : `/debuts` et `/stable`
 * avec un bouton sous la vidéo vers l'appel, sur demande de Rémy. « Appel de
 * candidature » et non « découverte », sur sa demande : écrit une fois pour
 * les trois pages.
 */
const appelVideo = {
  libelle: "Réserver mon appel de candidature",
} as const;
export const appelDebuts = appelVideo;
export const appelStable = appelVideo;
export const appelLancement = appelVideo;
export const appelConsulting = appelVideo;
