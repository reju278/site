/**
 * Le texte de la page de confirmation, `go.funnels.club/thanks`, celle qu'on
 * reçoit après avoir réservé l'appel.
 *
 * **La page suit `www.funnels.club/thanks-confirmation-2026`**, sur demande de
 * Rémy : un titre, une alerte, l'étape 1 (une vidéo et les consignes du
 * rendez-vous), l'étape 2 (la vidéo de la stratégie), puis les entretiens.
 * **Tout le texte affiché est relevé mot pour mot sur cette page**, sauf ce
 * qui est marqué ci-dessous.
 *
 * **Écrits par l'agent et à valider par Rémy** : le titre d'onglet, la
 * description et les passages surlignés des consignes.
 */

/** L'identité de la page, pour l'onglet et le partage. À valider par Rémy. */
export const identiteThanks = {
  titrePage: "Ton appel est réservé",
  description:
    "Ton appel avec l'équipe Funnels Club est réservé. Regarde les deux vidéos de cette page et confirme ton rendez-vous en répondant à l'e-mail reçu.",
} as const;

export const confirmationThanks = {
  titre: [{ texte: "Félicitations, c'est réservé !" }],

  /* L'alerte sous le titre, découpée pour ses marques : « Important » en
     tête, « 2 vidéos » et « confirme ton rendez-vous » soulignés, comme
     sur la page source.

     **Toute la page est au tutoiement**, sur demande de Rémy : la page
     source vouvoie, les textes relevés sur elle sont donc passés au « tu »,
     sans autre changement. */
  alerte: {
    important: "Important",
    avant: " : regarde les ",
    videos: "2 vidéos",
    milieu: " ci-dessous et ",
    confirmez: "confirme ton rendez-vous",
    apres: " !",
  },

  etape1: {
    /* « Vidéo » et non « Étape », sur demande de Rémy : le numéro dit ce
       qu'il y a à regarder, et répond aux « 2 vidéos » de l'alerte. */
    numero: "Vidéo 1/2",
    titre: "Informations à propos de ton rendez-vous",
    video: {
      id: "mfcr8s506m",
      /* « Page de remerciement 2.0 » sur Wistia : un titre de fichier, pas
         une description. Celui-ci décrit la vidéo pour un lecteur d'écran. */
      titre: "Informations à propos de ton rendez-vous",
      /* 165 secondes, relevées sur l'oEmbed de Wistia. */
      secondes: 165,
    },
    /* **Au tutoiement, et personnelles quand Calendly a transmis de quoi**,
       sur demande de Rémy : voir `consignesRendezVous`. */
  },

  etape2: {
    numero: "Vidéo 2/2",
    titre:
      "Regarde la vidéo ci-dessous pour découvrir la stratégie de Funnels Club, et pourquoi elle fonctionne si bien.",
    /* Celle de `/preparation` : voir `presentationPreparation`. */
    video: {
      id: "775nifg0kr",
      titre: "Présentation du parfait tunnel de vente",
      secondes: 1842,
    },
  },

  /* Le titre et le sous-titre des entretiens, ceux d'`/immersion`
     (`avisImmersion`), le second passé au tutoiement : « pour te partager »
     et non « pour vous partager ». Recopiés parce qu'`/immersion` garde le
     vouvoiement. */
  avis: {
    titre: "Nous les avons accompagnés à développer leur offre digitale",
    sousTitre:
      "Ils ont répondu à nos questions pour te partager leurs histoires",
  },
} as const;

/**
 * Les consignes de la vidéo 1, **au tutoiement**, sur demande de Rémy, et
 * complétées de ce que Calendly transmet : l'e-mail, la date, le téléphone.
 *
 * C'est le texte de la page source, mot pour mot, passé du « vous » au « tu ».
 * **Chaque ajout est facultatif** : sans e-mail, la phrase s'arrête à « un
 * e-mail » ; sans téléphone, on garde « sur ton numéro de téléphone ». La page
 * ne montre jamais un trou.
 *
 * **Le message s'ouvre sur le prénom**, seul sur sa ligne, et « Pense à le
 * confirmer » commence un paragraphe, sur demande de Rémy : c'est le geste à
 * faire, il ne doit pas se perdre au milieu d'une phrase sur l'e-mail.
 *
 * `surligne` porte les gestes à faire, sous-chaînes exactes des paragraphes,
 * choisis par l'agent et à valider par Rémy. `gras` porte les valeurs propres
 * à la personne : **en gras et non surlignées**, sur demande de Rémy, pour
 * que le surlignage reste réservé à ce qu'il faut faire.
 */
/** Le libellé du lien WhatsApp dans les consignes, écrit une fois. */
const LIEN_WHATSAPP = "ce lien";

export function consignesRendezVous(r: {
  prenom?: string;
  email?: string;
  telephone?: string;
  date?: string;
  /** Un numéro WhatsApp d'hôte est connu : la phrase du lien peut s'écrire. */
  whatsapp?: boolean;
}) {
  const paragraphes = [
    ...(r.prenom ? [`${r.prenom},`] : []),
    `Nous t'avons envoyé un e-mail${r.email ? ` à ${r.email}` : ""} confirmant la date et l'heure de ton appel${r.date ? `, le ${r.date}` : ""}.`,
    `Pense à le confirmer en répondant simplement à cet e-mail. Nous te contacterons via WhatsApp ${r.telephone ? `au ${r.telephone}` : "sur ton numéro de téléphone"} à la date et l'heure sélectionnées.`,
    /* **À la place du rappel de l'e-mail**, retiré par Rémy, qui a dicté
       celle-ci. Elle n'existe que si le lien mène quelque part : sans numéro
       d'hôte, « ce lien » serait un texte qui ne s'ouvre pas. */
    ...(r.whatsapp
      ? [
          `Si tu es vraiment motivé, tu peux également confirmer ton rendez-vous directement via WhatsApp en passant par ${LIEN_WHATSAPP}.`,
        ]
      : []),
    "Présente-toi à l'heure, dans une pièce calme, sans distractions – nous promettons de faire de même.",
    "Nous avons hâte de te rencontrer et de t'aider\u00a0!",
  ];

  const surligne = [
    "Pense à le confirmer en répondant simplement à cet e-mail.",
    "via WhatsApp",
    "Présente-toi à l'heure",
  ];

  const gras = [r.prenom, r.email, r.date, r.telephone].filter(
    (v): v is string => Boolean(v),
  );

  return { paragraphes, surligne, gras, lien: LIEN_WHATSAPP };
}

/**
 * Les champs que Calendly envoie sous `answer_N`, dans l'ordre des questions
 * du formulaire, **relevés sur une vraie redirection** : `answer_1` est le
 * téléphone, les quatre suivants les questions de qualification.
 *
 * **Les libellés sont écrits par l'agent, à valider par Rémy.** Calendly
 * n'envoie que les réponses ; les questions du formulaire, au « vous » et
 * longues de deux lignes, sont ramenées à un libellé de récapitulatif. Si
 * l'ordre des questions change dans Calendly, il change ici.
 */
export const questionsReservation = [
  { cle: "answer_1", role: "telephone", libelle: "Téléphone / WhatsApp" },
  { cle: "answer_2", role: "question", libelle: "Offre à développer" },
  { cle: "answer_3", role: "question", libelle: "Objectif de revenu à 6 mois" },
  {
    cle: "answer_4",
    role: "question",
    libelle: "Ton produit ou service, et tes clients idéaux",
  },
  { cle: "answer_5", role: "question", libelle: "Capacité à investir" },
] as const;

/** Les libellés du récapitulatif. À valider par Rémy. */
export const recapReservation = {
  surtitre: "Ton rendez-vous",
  /* « Ton appel avec Geoffrey », ou avec l'équipe quand Calendly ne nomme
     pas l'hôte. */
  appelAvec: (hote?: string) =>
    hote ? `Ton appel avec ${hote}` : "Ton appel avec l'équipe Funnels Club",
  /* Dicté par Rémy. */
  statut: "En attente de confirmation",
  coordonnees: "Tes coordonnées",
  nom: "Nom",
  email: "E-mail",
  telephone: "Téléphone / WhatsApp",
  reponses: "Tes réponses",
  bouton: "Confirmer mon rendez-vous sur WhatsApp",
} as const;

/**
 * Les hôtes des rendez-vous, sur demande de Rémy : leur numéro WhatsApp, que
 * le bouton et le lien des consignes ouvrent, et leur portrait, posé à côté de
 * leur nom dans le récapitulatif. Calendly nomme l'hôte dans `assigned_to`.
 *
 * Les portraits sont ceux de l'équipe d'`/immersion`, déjà servis par nous.
 *
 * **Le nom est comparé sans casse ni accents** : Calendly écrit
 * « Geoffrey BONNIOT ». Le numéro est au format international, chiffres
 * seuls, comme le veut `wa.me` : `33612345678`.
 *
 * **À REMPLIR PAR RÉMY.** Tant qu'aucun numéro n'est connu pour l'hôte, ni
 * `parDefaut`, le bouton ne s'affiche pas : un lien `wa.me` sans numéro ouvre
 * WhatsApp sur une conversation vide, ce qui serait pire que pas de bouton.
 */
export const whatsappHotes: {
  hotes: readonly { nom: string; numero: string | null; photo: string | null }[];
  parDefaut: string | null;
} = {
  hotes: [
    {
      nom: "Rémy Jupille",
      numero: null,
      photo: "/immersion/equipe-remy-jupille.jpg",
    },
    {
      nom: "Geoffrey Bonniot",
      numero: null,
      photo: "/immersion/equipe-geoffrey-bonniot.jpg",
    },
  ],
  parDefaut: null,
};

/**
 * Le message préparé dans WhatsApp, dicté par Rémy dans sa forme : « Bonjour,
 * c'est Prénom. Je confirme mon rendez-vous pour… ». Chaque morceau tombe
 * s'il manque.
 */
export function messageWhatsapp(r: {
  prenom?: string;
  hote?: string;
  date?: string;
}) {
  const salut = r.hote ? `Bonjour ${r.hote}` : "Bonjour";
  const qui = r.prenom ? `, c'est ${r.prenom}.` : ",";
  const quand = r.date ? ` du ${r.date}` : "";
  return `${salut}${qui} ${r.prenom ? "Je" : "je"} confirme mon rendez-vous${quand}.`;
}

