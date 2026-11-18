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
  titre: null as string | null,
  /** La phrase sous le titre, surlignée en bleu pâle comme sur la
   *  référence. */
  sousTitre: null as string | null,
  /** Le paragraphe à droite du visuel, au-dessus de la liste. */
  accroche: null as string | null,
  /**
   * La liste à puces au-dessus du bouton. `surligne`, facultatif, est le
   * début de la ligne surligné en rose, comme les « Sans » de la référence ;
   * `suite` est le reste de la ligne.
   */
  points: [] as { surligne?: string; suite: string }[],
  /** La ligne de réassurance sous le bouton de la fenêtre d'inscription. */
  reassurance: null as string | null,
  formulaire: {
    /* Libellés d'interface, PROVISOIRES. */
    titre: "Entre tes informations pour accéder à la formation :",
    prenom: "Prénom",
    email: "E-mail",
    bouton: "Accéder à la formation",
    envoi: "Inscription…",
    erreur: "L'inscription n'est pas passée. Vérifie ton e-mail et réessaie.",
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
 * **Leur nombre n'est pas décidé** : il dépend de la façon dont Rémy coupe
 * la vidéo. Cinq est une valeur de départ pour voir la page ; il suffit
 * d'ajouter ou de retirer des lignes, la liste, la navigation et les adresses
 * suivent. Chaque e-mail de la séquence pointe vers
 * `go.funnels.club/formation-genesis/espace/<cle>`.
 *
 * **La séquence ne suit pas toute seule** : c'est le workflow ClickFunnels
 * « Formation Genesis : séquence » (id 2000255), un e-mail par partie de
 * 1 à 5. Changer le nombre de parties oblige à y ajouter ou retirer un
 * e-mail ; le bonus n'a pas d'e-mail.
 */
export const partiesGenesis: PartieGenesis[] = [
  { cle: "1", etiquette: "Partie 1", titre: null, description: null, video: null },
  { cle: "2", etiquette: "Partie 2", titre: null, description: null, video: null },
  { cle: "3", etiquette: "Partie 3", titre: null, description: null, video: null },
  { cle: "4", etiquette: "Partie 4", titre: null, description: null, video: null },
  { cle: "5", etiquette: "Partie 5", titre: null, description: null, video: null },
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
  titreListe: "Les parties",
  suivante: "Partie suivante",
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
