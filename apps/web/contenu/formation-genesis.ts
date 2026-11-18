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

/** Un morceau de phrase : du texte, ou un passage en gras ou souligné. */
export type SegmentGenesis = string | { gras: string } | { souligne: string };

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
   *
   * En segments, pour la mise en forme de Rémy : « 4 modules » en gras,
   * « créer », « lancer » et « développer » soulignés.
   */
  sousTitre: (modules: number): SegmentGenesis[] => [
    "Accédez à ",
    { gras: `${modules}\u00a0modules` },
    " de formation gratuite qui dévoilent la stratégie étape par étape pour ",
    { souligne: "créer" },
    ", ",
    { souligne: "lancer" },
    " et ",
    { souligne: "développer" },
    " un business de formation profitable",
  ],
  /**
   * La maquette du lecteur, à gauche du formulaire : une carte au dessin du
   * lecteur Wistia, et deux derrière elle. **Les trois images sont celles
   * de Rémy**, recadrées en 16/9 et compressées : 1280 × 720 pour celle de
   * devant, 640 × 360 pour celles de derrière, qui s'affichent petites.
   */
  maquette: {
    principale: "/genesis/maquette-principale.jpg",
    gauche: "/genesis/maquette-gauche.jpg",
    droite: "/genesis/maquette-droite.jpg",
    /* PROVISOIRE : le nom donné au clic sur la maquette, qui mène au
       formulaire. */
    action: "Remplir le formulaire pour accéder à la formation",
  },
  /**
   * Le formulaire en trois étapes, à droite du visuel. Les questions et les
   * boutons des deux premières étapes sont de Rémy ; le reste est un libellé
   * d'interface de l'agent, PROVISOIRE, au vouvoiement de Rémy.
   */
  formulaire: {
    etapes: {
      nom: {
        question: "Comment vous appelez-vous ?",
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
    /* Les textes grisés dans les champs, demandés par Rémy : PROVISOIRES.
       Le téléphone prend l'exemple de numéro du pays choisi. */
    exemples: {
      prenom: "Votre prénom",
      nom: "Votre nom",
      email: "Votre adresse email",
    },
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
    /* La phrase rouge sous le bouton. `champs` est celle de la référence
       de Rémy (« Please complete all required fields to continue. »),
       traduite ; les autres sont de l'agent, PROVISOIRES. */
    erreurs: {
      champs: "Veuillez remplir tous les champs obligatoires pour continuer.",
      email: "Veuillez indiquer une adresse email valide.",
      telephone: "Veuillez indiquer un numéro de téléphone complet.",
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
  /** Le rang du module, « Module #1 », de Rémy. Devant le titre dans le
   *  `h1`, et seul dans la liste, où le numéro est déjà dans sa pastille. */
  etiquette: string;
  /** Le titre du module, de Rémy : « Positionnement ». */
  titre: string | null;
  /** Une phrase sous le titre, si Rémy en écrit une. Rien ne s'affiche
   *  tant qu'elle est vide : il a demandé « uniquement le titre ». */
  description: string | null;
  /** La vidéo Wistia : identifiant et durée en secondes. */
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
/*
 * **VIDÉOS D'ESSAI**, sur demande de Rémy, pour voir l'intégration : ce sont
 * des vidéos de Rémy déjà sur le site (`/lancement`, `/stable`, `/debuts`,
 * le consulting), et non les modules. **À remplacer avant la mise en ligne**
 * par les morceaux de la formation, avec leur copie d'affiche dans
 * `public/temoignages/<id>.jpg`.
 */
export const partiesGenesis: PartieGenesis[] = [
  {
    cle: "1",
    etiquette: "Module #1",
    titre: "Positionnement",
    description: null,
    video: { id: "vkvffo2189", secondes: 2739 },
  },
  {
    cle: "2",
    etiquette: "Module #2",
    titre: "Offre idéale",
    description: null,
    video: { id: "04wqsqzo30", secondes: 7238 },
  },
  {
    cle: "3",
    etiquette: "Module #3",
    titre: "Acquisition",
    description: null,
    video: { id: "h4z4g82lyi", secondes: 1653 },
  },
  {
    cle: "4",
    etiquette: "Module #4",
    titre: "Vente",
    description: null,
    video: { id: "8dynngktko", secondes: 1411 },
  },
  /* Les bonus viendront plus tard : une ligne par bonus, `bonus: true`. */
  {
    cle: "bonus",
    etiquette: "Bonus",
    titre: null,
    description: null,
    video: { id: "vkvffo2189", secondes: 2739 },
    bonus: true,
  },
];

/** Les textes de l'espace membre, `/formation-genesis/espace`. */
export const espaceGenesis = {
  titrePage: "Formation Genesis · Espace membre",
  /**
   * Ce que dit la barre du haut sur chaque page de l'espace, à la place de
   * « Formation gratuite » : elle suit l'adresse, sur demande de Rémy, qui a
   * donné « Funnels Club Leçon 1 » en exemple. Le bonus garde son nom.
   */
  barre: (rang: number) => `Leçon ${rang}`,
  /* Libellés d'interface, PROVISOIRES, sur la liste de référence de Rémy. */
  titreListe: "Modules",
  titreBonus: "Bonus",
  suivante: "Module suivant",
  /** La carte d'appel, à droite sur ordinateur, sous la vidéo sur
   *  téléphone. Elle mène à `/formation-genesis/appel`. */
  carte: {
    /* Les trois textes sont de Rémy. « /an » est lié à « chiffres » par
       une espace insécable, pour ne jamais ouvrir une ligne. **Le titre est
       écrit ligne par ligne** : Rémy veut la coupure après « formation »
       (une première version la mettait après « /an »), et la laisser au
       hasard de la largeur la mettait au milieu de « avec l'équipe ». */
    surtitre: "Pour les créateurs de formation ou de coaching" as string | null,
    titre: [
      "Développez votre business de formation",
      "entre 6 et 7 chiffres\u00a0/an avec l'équipe Funnels Club",
    ] as string[] | null,
    texte:
      "Formation, accompagnement, coaching, outils et IA spécialisée." as
        | string
        | null,
    /** Sa photo de profil, fournie par Rémy, en 256 × 256. */
    photo: { src: "/genesis/remy.jpg", alt: "Rémy Jupille" },
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
