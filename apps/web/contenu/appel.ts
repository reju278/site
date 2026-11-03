import type { ContenuMessage } from "@/components/message-remy";
import { messageRemy } from "@/contenu/site";

/**
 * Le texte de la page de réservation d'appel, `go.funnels.club/appel`.
 *
 * **La page est `/preparation` avec le formulaire de Calendly à la place de la
 * vidéo**, sur demande de Rémy : ni la notification « Préparer votre
 * rendez-vous », ni l'équipe, et un en-tête réduit à la marque et à la bascule
 * de thème. La galerie des entretiens et son titre sont ceux d'`/immersion`,
 * lus dans `avisImmersion`.
 *
 * **Le titre, le sous-titre, le titre d'onglet et la description sont écrits
 * par l'agent et à valider par Rémy** : il ne les a pas dictés.
 */

/** L'identité de la page, pour l'onglet et le partage. À valider par Rémy. */
export const identiteAppel = {
  titrePage: "Réserve ton appel",
  description:
    "Choisis le créneau qui te convient pour un appel de 30 minutes avec l'équipe Funnels Club, et réponds à quelques questions pour le préparer.",
} as const;

export const reservationAppel = {
  /* À valider par Rémy. */
  titre: [{ texte: "Réserve ton appel" }],
  /* Dicté par Rémy. */
  sousTitre:
    "Nous t'accompagnons à travers toutes les étapes de ton business de formation, du lancement jusqu'à 6 ou 7 chiffres par an.",
  /* Le formulaire donné par Rémy, sans sa requête : `hide_gdpr_banner` est
     ajouté par `FormulaireCalendly`. */
  calendly:
    "https://calendly.com/funnels-club/candidature-funnels-club-clone-5",
  /* Le formulaire de la page `/appel` seule, sur demande de Rémy : celui de
     `funnels.club/appel`. Il est distinct de `calendly`, qui reste celui du
     formulaire posé sous la vidéo de `/video-vsl`. Même règle pour la requête :
     `hide_gdpr_banner` est ajouté par `FormulaireCalendly`. */
  calendlyPageAppel:
    "https://calendly.com/funnels-club/appel-decouverte-l-clone",
  /* **La hauteur sous laquelle le formulaire ne descend jamais**, en pixels.
     Calendly annonce 693 px à son premier affichage, et à cette hauteur sa
     colonne de gauche est coupée : la photo rognée en haut, une barre de
     défilement à côté. Elle tient entière à 798 px, mesurés. Le hero règle
     aussi sa jonction sur cette valeur : voir le gabarit d'`/appel`. */
  hauteurMin: 800,
} as const;

/**
 * Le bouton de réservation de la galerie des entretiens, dicté par Rémy : sous
 * la vidéo de chaque entretien ouvert, au milieu de la galerie et en bas. Il
 * remonte au formulaire, dont l'ancre est celle du hero.
 *
 * **Plus aucune page ne le montre** : la galerie a quitté `/appel`, sur
 * décision de Rémy. Il est gardé pour le jour où elle y revient.
 */
export const appelGalerie = {
  ancre: "#reservation",
  libelle: "Réserver mon appel de découverte gratuit",
} as const;

/**
 * Le message de Rémy de l'accueil, **sans la vidéo de formation**, sur sa
 * demande : sur cette page, la lettre ne sert qu'à donner envie de réserver.
 * Seule la conclusion change, et elle garde ses propres mots : la phrase sur
 * la vidéo est retirée, celle sur l'échange reste, ramenée au présent.
 */
export const messageRemyAppel: ContenuMessage = {
  ...messageRemy,
  conclusion: {
    avant: "",
    lienVideo: "",
    milieu: "Si vous souhaitez aller plus loin, vous pouvez ",
    lienAppel: messageRemy.conclusion.lienAppel,
    apres: messageRemy.conclusion.apres,
  },
};

/**
 * La réservation de l'appel chez nous, sur `/appel` : nos créneaux, nos
 * champs, et le rendez-vous envoyé à Calendly par son API (issue #7). Voir
 * `app/appel/actions.ts` et `ReservationAppel`.
 *
 * **L'événement est « Candidature Funnels Club »** (`appel-decouverte-l-clone`,
 * anciennement « Appel découverte (YT) »), en tourniquet sur l'équipe.
 * **Ses questions sont recopiées au caractère près**, relevées par l'API le
 * 3 novembre 2026 après leur refonte par Rémy : c'est sous ces intitulés que
 * Calendly range les réponses, et un intitulé réécrit ici créerait une
 * réponse orpheline. Le jour où elles changent dans Calendly, elles changent
 * ici. L'API de Calendly lit les questions mais ne les modifie pas. Ce que
 * la page affiche est `libelle`, tutoyé ; ce qui part à Calendly est
 * `question`.
 *
 * Le titre est dicté par Rémy ; les libellés d'interface (« Choisis un
 * jour », le bouton…) sont de l'agent, à valider.
 */
/** Une question de l'événement Calendly, telle que notre formulaire la pose. */
type QuestionReservation = {
  cle: string;
  /** Sa position chez Calendly : 0 est le téléphone. */
  position: number;
  type: "multi" | "unique" | "texte";
  /** Un champ « Autre » sous les choix. */
  autre: boolean;
  obligatoire: boolean;
  /** L'intitulé exact de Calendly, sous lequel la réponse lui est envoyée. */
  question: string;
  /** L'intitulé affiché, tutoyé comme le reste du tunnel, sur demande de
   *  Rémy. Il peut différer de `question` : Calendly ne le voit jamais. */
  libelle: string;
  choix: readonly string[];
  /** Le choix qui ne réserve pas : la personne est envoyée vers
   *  `/prochaine-etape` au lieu de prendre un créneau, sur décision de Rémy. */
  bloquant?: string;
};

export const reservationYt = {
  evenement:
    "https://api.calendly.com/event_types/78a4af97-8aa8-45e0-866c-fde37f97088f",
  marque: "Funnels.Club",
  titre: "Candidature Funnels Club",
  duree: "30 min",
  /* La même durée, pour écrire le créneau « de 12:00 à 12:30 ». */
  dureeMinutes: 30,
  choisirJour: "Choisis un jour",
  /* « À quelle heure le jeudi 5 novembre ? » */
  choisirHeure: (jour: string) => `À quelle heure le ${jour} ?`,
  modifier: "Modifier",
  /* La consigne sous le créneau, dictée par Rémy et légèrement resserrée à
     sa demande : « objectif » n'y revient plus deux fois. */
  /* « sérieusement » en gras, tutoyée et ouverte sur le prénom de
     l'inscription, sur demande de Rémy : « Rémy, prends le temps… ». Sans
     prénom, elle commence à « Prends ». */
  consigne: {
    avant: (prenom: string) =>
      prenom
        ? `${prenom}, prends le temps de remplir ce formulaire `
        : "Prends le temps de remplir ce formulaire ",
    gras: "sérieusement",
    apres:
      " : il sera lu attentivement par notre équipe avant ton appel, afin de le préparer au mieux pour t'aider à atteindre ton objectif.",
  },
  suivant: "Suivant",
  /* Sous le bouton, quand des champs sont en défaut. */
  aCompleter: (n: number) =>
    n > 1
      ? `${n} champs sont à compléter, encadrés en rouge.`
      : "Un champ est à compléter, encadré en rouge.",
  prenom: "Prénom",
  nom: "Nom",
  email: "Email",
  telephone: "Ton numéro (téléphone ou WhatsApp)",
  pays: "Pays de ton numéro",
  autre: "Autre",
  /* Dicté par Rémy, sans la date, déjà écrite dans le bandeau du haut. */
  bouton: "Réserver mon appel",
  fuseau: "Heures affichées à l'heure de ton appareil",
  indisponible: "Les créneaux ne s'affichent pas pour le moment.",
  reessayer: "Réessayer",
  /* L'intitulé de la question du téléphone, position 0 chez Calendly. */
  questionTelephone: "Téléphone / WhatsApp",
  /* Dans l'ordre de Calendly. `obligatoire` suit sa case « requis » :
     toutes le sont chez lui depuis que Rémy y a rendu obligatoire la
     question des ressources. */
  questions: [
    {
      cle: "offre",
      position: 1,
      type: "multi",
      autre: true,
      obligatoire: true,
      question:
        "Quelle offre digitale voulez-vous développer grâce au tunnel de vente ?",
      libelle: "Quelle offre digitale veux-tu développer grâce au tunnel de vente ?",
      choix: ["Formation en ligne", "Coaching / consulting", "Prestation de service"],
    },
    {
      cle: "objectif",
      position: 2,
      type: "texte",
      autre: false,
      obligatoire: true,
      question: "Quel est votre objectif avec cette activité ? Donnez des détails.",
      libelle: "Quel est ton objectif avec cette activité ? Donne des détails.",
      choix: [],
    },
    {
      cle: "obstacle",
      position: 3,
      type: "texte",
      autre: false,
      obligatoire: true,
      question:
        "Quel est votre principal obstacle à l'atteinte de cet objectif ? Donnez des détails.",
      libelle:
        "Quel est ton principal obstacle à l'atteinte de cet objectif ? Donne des détails.",
      choix: [],
    },
    {
      cle: "produit",
      position: 4,
      type: "texte",
      autre: false,
      obligatoire: true,
      question:
        "Quel produit ou service proposez-vous, et qui sont vos clients idéaux ? (Soyez le plus précis possible)",
      libelle:
        "Quel produit ou service proposes-tu, et qui sont tes clients idéaux ? (Sois le plus précis possible)",
      choix: [],
    },
    {
      cle: "investir",
      position: 5,
      type: "unique",
      autre: false,
      obligatoire: true,
      question:
        "Êtes-vous disposé et apte à investir pour être accompagné et rejoindre Funnels Club ?",
      libelle:
        "Es-tu disposé et apte à investir pour être accompagné et rejoindre Funnels Club ?",
      choix: [
        "OUI, j'ai les ressources financières pour me faire accompagner",
        "J'ai accès aux moyens financiers pour investir dans la croissance de mon activité",
        "NON, je n'ai PAS accès aux ressources financières pour me faire accompagner",
      ],
      bloquant:
        "NON, je n'ai PAS accès aux ressources financières pour me faire accompagner",
    },
    /* Typées une à une plutôt que figées : la page doit savoir traiter tout
       type de question, même celui qu'aucune ne porte aujourd'hui. */
  ] as readonly QuestionReservation[],
} as const;
