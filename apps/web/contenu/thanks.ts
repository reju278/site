import { reservationYt } from "@/contenu/appel";

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
    "Ton appel avec l'équipe Funnels Club est réservé. Regarde la vidéo de cette page, puis confirme ton rendez-vous sur WhatsApp ou par l'e-mail d'invitation.",
} as const;

export const confirmationThanks = {
  titre: [{ texte: "Félicitations, c'est réservé !" }],

  /* L'alerte sous le titre, découpée pour ses marques : « Important » en
     tête, « 2 vidéos » et « confirme ton rendez-vous » soulignés, comme
     sur la page source.

     **Toute la page est au tutoiement**, sur demande de Rémy : la page
     source vouvoie, les textes relevés sur elle sont donc passés au « tu »,
     sans autre changement. */
  /* L'alerte de `/thanks` depuis qu'il n'y reste qu'une vidéo, dictée par
     Rémy : « Regarde la vidéo ci-dessous et confirme ton rendez-vous ».
     `/form-funnel-thanks`, qui en a deux, garde `alerte`. */
  alerteUneVideo: {
    important: "Important",
    avant: " : regarde ",
    videos: "la vidéo",
    milieu: " ci\u2011dessous et ",
    confirmez: "confirme ton rendez\u2011vous",
    apres: " !",
  },

  /* Dicté par Rémy : le titre du mur de la communauté qui défile. */
  titreMur: "Quelques résultats clients partagés dans notre groupe privé",

  alerte: {
    important: "Important",
    avant: " : regarde les ",
    videos: "2 vidéos",
    /* Traits d'union insécables : sur téléphone, « ci- » puis « rendez- »
       restaient seuls en fin de ligne. */
    milieu: " ci\u2011dessous et ",
    confirmez: "confirme ton rendez\u2011vous",
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

  /* La seconde vidéo de la page, sous la carte de la première, sur demande
     de Rémy. Le titre est dicté par lui. */
  video2: {
    numero: "Vidéo 2/2",
    titre: "Étape par étape, comment j'ai gagné mon premier million",
    /* Reprise de YouTube sur Wistia, pour le lecteur de la vidéo 1/2. */
    id: "h4z4g82lyi",
    secondes: 1653,
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
 * La vidéo de qui démarre de zéro, au-dessus de Roland, sur demande de Rémy.
 * `reponse` est un morceau du choix du quiz, « 🐣 0 €, je souhaite me lancer ».
 */
export const videoDepartZero = {
  id: "vkvffo2189",
  secondes: 2751,
  reponse: "je souhaite me lancer",
  titre: (prenom?: string) =>
    `Voici une vidéo spécialement pour toi${prenom ? ` ${prenom},` : ""} qui`,
  /* Surligné, sur demande de Rémy. */
  surligne: "démarres de zéro",
} as const;

/**
 * Les consignes de la vidéo 1, **au tutoiement**, sur demande de Rémy, et
 * complétées de ce que la réservation transmet : l'e-mail, la date, le
 * téléphone. Elles ont remplacé le récapitulatif et le bouton WhatsApp.
 *
 * C'est le texte de la page source, mot pour mot, passé du « vous » au « tu ».
 * **Chaque ajout est facultatif** : sans e-mail, la phrase s'arrête à « un
 * e-mail » ; sans téléphone, on garde « sur ton numéro de téléphone ». La page
 * ne montre jamais un trou.
 *
 * **Le message s'ouvre sur le prénom**, seul sur sa ligne. `gras` porte les
 * valeurs propres à la personne.
 */
export function consignesRendezVous(r: {
  prenom?: string;
  email?: string;
  telephone?: string;
  date?: string;
}) {
  const paragraphes = [
    ...(r.prenom ? [`${r.prenom},`] : []),
    `Nous t'avons envoyé un e-mail${r.email ? ` à ${r.email}` : ""} confirmant la date et l'heure de ton appel${r.date ? `, le ${r.date}` : ""}. Pense à le confirmer en répondant simplement à cet e-mail. Nous te contacterons via WhatsApp ${r.telephone ? `au ${r.telephone}` : "sur ton numéro de téléphone"} à la date et l'heure sélectionnées.`,
    "Un rappel de la date et de l'heure du rendez-vous se trouve dans l'e-mail que tu viens de recevoir.",
    "Présente-toi à l'heure, dans une pièce calme, sans distractions – nous promettons de faire de même.",
    "Nous avons hâte de te rencontrer et de t'aider\u00a0!",
  ];

  const gras = [r.prenom, r.email, r.date, r.telephone].filter(
    (v): v is string => Boolean(v),
  );

  return { paragraphes, gras, signature: "- Rémy et l'équipe Funnels Club" };
}

/**
 * Les champs que Calendly envoie sous `answer_N`, dans l'ordre des questions
 * de l'événement « Candidature Funnels Club » (`appel-decouverte-l-clone`),
 * celui de `/appel` : `answer_1` est le téléphone, les suivants ses
 * questions. Notre réservation les transmet sous les mêmes noms (voir
 * `ReservationAppel`), et le formulaire de Calendly intégré en repli aussi.
 *
 * **Les libellés sont les vraies questions**, sur demande de Rémy : celles
 * que la personne a lues en répondant, tirées de `reservationYt`, donc
 * tutoyées comme sur `/appel`. Écrites une fois : une question changée chez
 * Calendly se recopie dans `reservationYt`, et le détail suit.
 */
export const questionsReservation: readonly {
  cle: string;
  role: "telephone" | "question";
  libelle: string;
}[] = [
  { cle: "answer_1", role: "telephone", libelle: "Téléphone / WhatsApp" },
  ...reservationYt.questions.map((q) => ({
    cle: `answer_${q.position + 1}`,
    role: "question" as const,
    libelle: q.libelle,
  })),
];

/** Les libellés du récapitulatif. À valider par Rémy. */
/**
 * Le bloc « Tu n'as pas WhatsApp ? », sous le rendez-vous, sur demande de
 * Rémy : confirmer par l'e-mail d'invitation. Repris de son script de vidéo
 * (`labo/confirmer-appel.html`), au nom de l'hôte qui envoie l'invitation.
 */
export const sansWhatsapp = {
  titre: "Tu n'as pas WhatsApp ?",
  /* « Va dans tes e-mails : Geoffrey t'a envoyé une invitation. » */
  etape1: (hote?: string) =>
    hote
      ? `Va dans tes e-mails : ${hote} t'a envoyé une invitation.`
      : "Va dans tes e-mails : tu as reçu une invitation.",
  etape2: {
    avant: "Dans l'",
    invitation: "e-mail d'invitation",
    milieu: ", clique sur « ",
    oui: "Oui",
    apres: " » pour confirmer ton rendez-vous.",
  },
} as const;

export const recapReservation = {
  surtitre: "Ton rendez-vous",
  /* Dicté par Rémy : « Rémy Test avec Geoffrey Bonniot », comme l'intitulé
     d'une vraie réservation. Chaque nom tombe s'il manque. */
  avec: (invite?: string, hote?: string) =>
    invite && hote
      ? `${invite} avec ${hote}`
      : hote
        ? `Ton appel avec ${hote}`
        : invite
          ? `${invite} avec l'équipe Funnels Club`
          : "Ton appel avec l'équipe Funnels Club",
  /* « Sur WhatsApp au +33 6 00 00 00 00 », dicté par Rémy. */
  lieu: "Sur WhatsApp au",
  /* Dicté par Rémy : l'icône de WhatsApp dit déjà où mène le bouton. */
  bouton: "Confirmer mon rendez-vous",
  /* Le volet replié des réponses, demandé par Rémy. */
  detail: "Détail de l'événement",
  /* Les deux blocs du volet, sur demande de Rémy : qui l'on est, puis ce
     qu'on a répondu. À valider par Rémy. */
  coordonnees: "Tes coordonnées",
  prenom: "Prénom",
  nom: "Nom",
  telephone: "Téléphone",
  reponses: "Tes réponses au formulaire",
  email: "E-mail",
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
      /* Donné par Rémy le 3 novembre 2026 : +33 6 81 38 55 89. */
      numero: "33681385589",
      photo: "/immersion/equipe-geoffrey-bonniot.jpg",
    },
  ],
  parDefaut: null,
};

/**
 * Le message préparé dans WhatsApp, dicté par Rémy : « Bonjour Geoffrey, c'est
 * Rémy. Je confirme simplement mon rendez-vous le samedi 7 novembre à
 * 17 h 30. ». Chaque morceau tombe s'il manque.
 */
export function messageWhatsapp(r: {
  prenom?: string;
  hote?: string;
  jour?: string;
  heure?: string;
}) {
  const salut = r.hote ? `Bonjour ${r.hote}` : "Bonjour";
  const qui = r.prenom ? `, c'est ${r.prenom}.` : ",";
  const quand = [r.jour && ` le ${r.jour}`, r.heure && ` à ${r.heure}`]
    .filter(Boolean)
    .join("");
  return `${salut}${qui} ${r.prenom ? "Je" : "je"} confirme simplement mon rendez-vous${quand}.`;
}

