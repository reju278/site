/**
 * Le tunnel « Formation Genesis », servi sur `go.funnels.club/formation-genesis`
 * (issue #8) : l'optin, l'espace membre, puis la réservation de l'appel.
 *
 * **Presque rien n'est écrit ici, et c'est voulu.** Le texte est de Rémy :
 * tout ce qui attend une phrase ou une vidéo de lui est `null` et s'affiche
 * comme un `<Emplacement>`. Ce qui est écrit est un libellé d'interface de
 * l'agent, marqué `PROVISOIRE`, à remplacer par Rémy.
 */

/** La racine du tunnel, écrite une fois pour les liens entre ses pages. */
export const RACINE_GENESIS = "/formation-genesis";

/**
 * Le tag ClickFunnels posé sur chaque optin. **C'est lui qui déclenche la
 * séquence e-mail**, montée dans ClickFunnels : un mail par jour, une partie
 * de la formation par mail.
 *
 * Créé par l'API le 18 novembre 2026 dans le workspace « Funnels Club ». Ce
 * n'est pas un secret, d'où sa place ici et non dans une variable
 * d'environnement. Le nom est gardé à côté de l'identifiant pour qu'on le
 * retrouve dans ClickFunnels : c'est l'identifiant qui compte, un renommage
 * du tag là-bas ne casse rien.
 */
export const TAG_GENESIS = { id: 481456, nom: "formation genesis" } as const;

/** Les textes de l'optin, `/formation-genesis`. */
export const optinGenesis = {
  /* Titre d'onglet et description : PROVISOIRES, de l'agent. Une page de
     tunnel n'est pas indexée, mais l'onglet et l'aperçu de partage se
     voient. */
  titrePage: "Formation Genesis",
  description: null as string | null,
  /** L'étiquette au-dessus du titre, de Rémy. Écrite en minuscules et
   *  rendue en capitales par le CSS : un lecteur d'écran épelle parfois un
   *  mot écrit tout en capitales. */
  etiquette: "Formation gratuite disponible maintenant",
  /**
   * De Rémy, sa seconde version. La première annonçait que Rémy avait
   * « généré des millions » : un montant sur une page d'arrivée de
   * publicité, ce que Meta lit comme une promesse de gain (voir le hub dans
   * `AGENTS.md`). Celle-ci n'en porte aucun. « OFFERT » est devenu
   * « GRATUIT » à sa demande. Une seule retouche : « 100% » s'écrit
   * « 100 % », l'espace rendue insécable à l'affichage.
   */
  titre:
    "Créer sa formation, attirer des clients et vendre en ligne : Stratégie complète. 100 % GRATUIT" as
      | string
      | null,
  /**
   * La phrase sous le titre, surlignée en bleu pâle comme sur la référence.
   * De Rémy, majuscule initiale ajoutée.
   *
   * **Le nombre de modules est calculé**, jamais écrit : c'est celui de
   * `partiesGenesis`, bonus exclus. Rémy a écrit « 4 modules » ; la phrase
   * suit la liste le jour où elle change, comme le veut `AGENTS.md`.
   */
  sousTitre: (modules: number) =>
    `Accédez à ${modules} modules de formation gratuite pour apprendre à créer, lancer et croitre un business de formation en ligne`,
  /**
   * Le formulaire en trois étapes, à droite du visuel. Les questions et les
   * boutons des deux premières étapes sont de Rémy ; le reste est un libellé
   * d'interface de l'agent, PROVISOIRE, au vouvoiement de Rémy.
   */
  formulaire: {
    etapes: {
      nom: {
        question: "Quel est votre prénom ?",
        bouton: "Obtenir la formation gratuite",
      },
      email: {
        question: "À quel email dois-je vous l'envoyer ?",
        bouton: "Continuer",
      },
      telephone: {
        /* PROVISOIRE : Rémy a demandé le numéro sans dicter la question. */
        question: "Quel est votre numéro de téléphone ?",
        bouton: "Continuer",
      },
    },
    /* PROVISOIRES. */
    prenom: "Prénom",
    nom: "Nom",
    email: "Email",
    pays: "Pays",
    telephone: "Numéro de téléphone",
    retour: "Retour",
    envoi: "Envoi…",
    /* La case de `/course`, mot pour mot : c'est le consentement que le
       tunnel VSL demande déjà, vers la même politique. */
    consentement:
      "J'accepte de recevoir les emails de Funnels Club (désabonnement possible à tout moment) et je valide la ",
    lienConfidentialite: "Politique de confidentialité",
    /* Les champs vides et l'e-mail mal formé sont signalés par le
       navigateur (`required`, `type="email"`) ; restent le numéro, qu'il ne
       sait pas lire, et l'échec de l'envoi. */
    erreurs: {
      telephone: "Indiquez votre numéro de téléphone complet.",
      envoi: "L'envoi n'est pas passé. Vérifiez votre email et réessayez.",
    },
  },
};

/**
 * Une partie de la formation : un morceau de la vidéo de trois heures, que
 * Rémy coupe lui-même et pose sur Wistia.
 */
export type PartieGenesis = {
  /** Le segment d'adresse : `/formation-genesis/espace/<cle>`. Une adresse
   *  distribuée par e-mail ne se renomme plus : choisir la clé une fois. */
  cle: string;
  /** Le libellé court de la liste, PROVISOIRE tant que `titre` est vide. */
  etiquette: string;
  titre: string | null;
  description: string | null;
  /** La vidéo Wistia : identifiant, durée en secondes, titre du lecteur. */
  video: { id: string; secondes: number } | null;
  /** Une partie bonus se range sous les autres, avec une étoile. */
  bonus?: true;
};

/**
 * Les parties, dans l'ordre de la séquence e-mail.
 *
 * **Quatre modules**, d'après le sous-titre de Rémy (« 4 modules »). Il suffit
 * d'ajouter ou de retirer des lignes : la liste, la navigation, les adresses
 * et le nombre du sous-titre suivent. Chaque e-mail de la séquence pointe vers
 * `go.funnels.club/formation-genesis/espace/<cle>`.
 *
 * **La séquence ne suit pas toute seule** : c'est le workflow ClickFunnels
 * « Formation Genesis : séquence » (id 2000255), un e-mail par module de
 * 1 à 4. Changer le nombre de modules oblige à y ajouter ou retirer un
 * e-mail ; le bonus n'a pas d'e-mail.
 */
export const partiesGenesis: PartieGenesis[] = [
  { cle: "1", etiquette: "Module 1", titre: null, description: null, video: null },
  { cle: "2", etiquette: "Module 2", titre: null, description: null, video: null },
  { cle: "3", etiquette: "Module 3", titre: null, description: null, video: null },
  { cle: "4", etiquette: "Module 4", titre: null, description: null, video: null },
  /* Les bonus viendront plus tard : une ligne par bonus, `bonus: true`. */
  {
    cle: "bonus",
    etiquette: "Bonus",
    titre: null,
    description: null,
    video: null,
    bonus: true,
  },
];

/** Les textes de l'espace membre, `/formation-genesis/espace`. */
export const espaceGenesis = {
  titrePage: "Formation Genesis · Espace membre",
  surtitre: null as string | null,
  /* Libellés d'interface, PROVISOIRES. */
  titreListe: "Les modules",
  suivante: "Module suivant",
  /** La carte d'appel, à droite sur ordinateur, sous la vidéo sur
   *  téléphone. Elle mène à `/formation-genesis/appel`. */
  carte: {
    surtitre: null as string | null,
    titre: null as string | null,
    texte: null as string | null,
    /* PROVISOIRE. */
    bouton: "Réserver mon appel",
  },
};

/** Les textes de la réservation, `/formation-genesis/appel`. */
export const appelGenesis = {
  titrePage: "Formation Genesis · Réserver ton appel",
  titre: null as string | null,
  /** La vidéo de Rémy, sous les témoignages. */
  video: null as { id: string; secondes: number; titre: string } | null,
  /** La description de Funnels Club, à côté de la vidéo. */
  description: null as string | null,
};
