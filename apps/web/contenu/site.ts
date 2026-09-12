/**
 * Tout le contenu du site, en un seul fichier.
 *
 * Il n'y a pas de base de données ici et c'est voulu : ce qui ne change qu'à la
 * mise à jour du site vit dans le dépôt. Modifier une phrase, c'est modifier ce
 * fichier, committer, pousser.
 *
 * **Règle du projet : le texte est écrit par Rémy, pas par l'agent.** Ce
 * fichier ne contient que du texte repris mot pour mot de remy-jupille.com. Ce
 * qui n'a pas encore de texte vaut `null` et s'affiche comme un emplacement
 * vide, visiblement. Une page à trous se remplit ; une page remplie de texte
 * inventé se corrige ligne à ligne, longtemps après que personne ne se
 * souvienne de ce qui était vrai.
 */

/** Un emplacement qui attend le texte de Rémy. */
export type AEcrire = null;

/**
 * L'adresse du site, sans barre oblique finale.
 *
 * Elle sert au plan du site, au fichier robots et à `metadataBase`. Écrite une
 * fois : trois copies finissent toujours par diverger, et une URL canonique
 * fausse se paie en pages dédoublées dans l'index.
 */
export const SITE = "https://remy-jupille.com";

/**
 * Le conteneur Google Tag Manager.
 *
 * Un identifiant de conteneur n'est pas un secret : il part dans le HTML de
 * chaque page, et n'importe qui peut le lire. Il vit donc ici, avec le reste de
 * ce qui décrit le site, plutôt que dans une variable d'environnement qui
 * donnerait l'illusion de le protéger et ferait échouer le build de qui clone
 * le dépôt sans elle.
 *
 * Ce que le conteneur charge ensuite se règle dans l'interface de GTM, pas
 * dans ce dépôt. C'est tout l'intérêt, et c'est aussi le piège : le jour où une
 * balise y dépose un cookie qui n'est pas strictement nécessaire, c'est le
 * bandeau de consentement qui manque au site, pas une ligne de code ici.
 */
export const GTM = "GTM-WHF5LQM";

export const identite = {
  nom: "Rémy Jupille",
  societe: "Jupille Group Ltd",

  // Repris de funnels.club, au mot près : c'est leur propre titre.
  promesse: "Vivez de votre expertise en ligne.",
  resume:
    "Nous vous accompagnons à travers toutes les étapes de votre business de formation, du lancement jusqu'à 6 ou 7 chiffres par an.",
} as const;

/**
 * La balise de provenance, lue par Hyros.
 *
 * Tout lien qui quitte ce site vers une propriété de Rémy la porte : c'est ce
 * qui permet de savoir qu'une vente vient d'ici et non d'un email ou d'une
 * publicité. Elle s'ajoute par cette fonction et jamais à la main, parce qu'une
 * balise oubliée ne se voit pas : le lien marche, la vente est attribuée
 * ailleurs, et personne ne s'en aperçoit avant de lire les chiffres.
 */
export function avecTag(url: string): string {
  const separateur = url.includes("?") ? "&" : "?";
  return url.includes("el=site") ? url : `${url}${separateur}el=site`;
}

export const liens = {
  // Toujours l'hôte `www`. Le domaine nu redirige en 301 vers
  // `www.funnels.club` **en perdant la requête** : `funnels.club/appel?el=site`
  // arrive sur `www.funnels.club/appel`, sans balise. C'est la panne
  // silencieuse que décrit `avecTag` : le lien marche, la page s'affiche, et la
  // vente est attribuée ailleurs. Sur `www`, la réponse est un 200 direct et la
  // balise survit.
  decouvrir: avecTag("https://www.funnels.club/"),
  funnelsClub: avecTag("https://www.funnels.club/direct"),
  appel: avecTag("https://www.funnels.club/appel"),
  // `appel-decouverte-clone-2` rendait un 404 : l'événement a été supprimé côté
  // Calendly. Celui-ci est « Candidature Consulting », le seul événement actif
  // du compte qui corresponde à l'offre.
  consulting: avecTag("https://calendly.com/funnels-club/consulting"),
  lettre: avecTag("https://lettre.funnels.club"),
  espaceMembre: avecTag("https://groupe.funnels.club"),
  livre: avecTag("https://www.digital-selfmade.com"),

  // Sans balise : les plateformes tierces ne sont pas suivies par Hyros, et un
  // paramètre inconnu dans une URL de profil n'apporte rien.
  //
  // Les deux chaînes YouTube sont distinctes et vérifiées par leur flux Atom.
  // Attention : `@profitlibertenostress` n'est PAS une troisième chaîne, c'est
  // le nom d'usage de la première, `UCzGq4I0pXnDJizd0fitt10w`. Les deux
  // adresses mènent au même endroit.
  youtube: "https://www.youtube.com/@profitlibertenostress",
  youtubeFunnels: "https://www.youtube.com/@remyjupillefunnels",

  instagram: "https://www.instagram.com/remy_jupille/",
  tiktok: "https://www.tiktok.com/@remy_jupille",
  linkedin: "https://www.linkedin.com/in/remy-jupille-934a20160",
  facebook:
    "https://www.facebook.com/p/Funnels-Club-R%C3%A9my-Jupille-61562047537087/",
} as const;

/**
 * Une entrée de menu. `externe` est déclaré partout, y compris absent, sinon
 * `as const` produit une union où la moitié des membres n'a pas la propriété et
 * où `entree.externe` ne compile plus.
 */
export type EntreeNavigation = {
  libelle: string;
  href: string;
  externe?: boolean;
};

/**
 * Les entrées plates de l'en-tête, sans menu déroulant.
 *
 * Vide : tout est passé sous « Programmes » et « Ressources ». Une entrée
 * seule à côté de deux menus se lit comme un oubli.
 */
export const navigation: readonly EntreeNavigation[] = [];

/**
 * Les réseaux, affichés en pied du panneau « Ressources ».
 *
 * `glyphe` nomme l'icône de marque à employer. LinkedIn n'en a pas, et c'est
 * délibéré : LinkedIn a demandé le retrait de sa marque des jeux d'icônes
 * libres, et aller la chercher ailleurs reviendrait à passer outre. Cette
 * entrée s'affiche donc avec son nom écrit, ce qui est la façon correcte de
 * citer une marque quand on ne peut pas en montrer le signe.
 */
export const reseaux: readonly {
  nom: string;
  href: string;
  glyphe: "youtube" | "instagram" | "tiktok" | "facebook" | null;
}[] = [
  { nom: "YouTube", href: liens.youtube, glyphe: "youtube" },
  { nom: "Instagram", href: liens.instagram, glyphe: "instagram" },
  { nom: "TikTok", href: liens.tiktok, glyphe: "tiktok" },
  { nom: "Facebook", href: liens.facebook, glyphe: "facebook" },
  { nom: "LinkedIn", href: liens.linkedin, glyphe: null },
];

/**
 * Le second podcast, coanimé avec Nassim Sheikh Ali.
 *
 * Rémy l'appelle « Esprit Mavric » ; son titre exact, celui qu'affichent les
 * plateformes, est « Esprits Maverick ». C'est ce titre-là qui est repris ici,
 * parce que c'est celui que les gens verront s'ils le cherchent.
 */
export const podcastMaverick = {
  nom: "Esprits Maverick",
  flux: "https://feed.ausha.co/BqnN8S1MnvMr",
  site: "https://podcast.ausha.co/maverick",
} as const;

/**
 * Les menus déroulants de l'en-tête.
 *
 * Les descriptions sont reprises telles quelles du site actuel et du flux de la
 * lettre. Aucune n'est écrite pour l'occasion : une entrée sans texte n'en
 * affiche pas.
 */
export const menus: readonly {
  libelle: string;
  entrees: readonly {
    libelle: string;
    href: string;
    texte?: string;
    externe?: boolean;
  }[];
}[] = [
  {
    libelle: "Programmes",
    entrees: [
      {
        libelle: "Funnels Club",
        href: liens.appel,
        texte: "Jusqu'à plus de 6 chiffres par an avec une offre digitale",
        externe: true,
      },
      {
        libelle: "Consulting privé avec Rémy",
        href: liens.consulting,
        texte: "L'accompagnement le plus personnalisé que Rémy propose",
        externe: true,
      },
    ],
  },
  {
    libelle: "Ressources",
    entrees: [
      {
        libelle: "Résultats",
        href: "/resultats",
        texte: "Ce que les membres ont obtenu",
      },
      {
        libelle: "Digital Selfmade",
        href: "/articles",
        texte: "La lettre, tous les articles",
      },
      {
        libelle: "Profit, liberté, no stress",
        href: "/podcast",
        texte: "Le podcast, tous les épisodes",
      },
      {
        libelle: "Esprits Maverick",
        href: podcastMaverick.site,
        texte: "Le podcast coanimé avec Nassim Sheikh Ali",
        externe: true,
      },
      {
        libelle: "Digital Selfmade",
        href: liens.livre,
        texte: "Le livre",
        externe: true,
      },
    ],
  },
];

/**
 * Les deux offres, reprises de funnels.club au mot près.
 *
 * Le site en présente trois : Funnels Club, le Mentium Mastermind et le
 * consulting privé. Seules deux sont montrées ici, sur décision de Rémy, et le
 * mastermind n'y est pas.
 *
 * Une phrase par offre, choisie dans leur page et non résumée. Résumer, c'est
 * réécrire, et réécrire une promesse commerciale n'appartient pas à l'agent.
 */
/**
 * Le titre de la section des offres, écrit par Rémy, **en deux lignes**.
 *
 * La coupure est posée à la main et non laissée au moteur de rendu. Sept
 * largeurs ont été mesurées avec `text-wrap: balance` : aucune ne produit cette
 * césure. Le moteur remplit la première ligne et laisse tomber le reste, ce qui
 * donnait « Nos deux accompagnements / personnalisés pour / vous accompagner »,
 * trois lignes dont la première écrase les deux autres.
 *
 * C'est donc du contenu et pas de la mise en forme : c'est Rémy qui a décidé
 * où la phrase se coupe. Corriger le texte, c'est corriger ces deux lignes.
 */
/** Le titre de la bande des résultats. Écrit par Rémy. */
export const titreResultats = "Résultats de nos clients";

export const titreOffres = [
  "Nos deux accompagnements",
  "personnalisés pour vous accompagner",
] as const;

export const offres = [
  {
    id: "funnels-club",
    nom: "Funnels Club",
    /* Le surtitre, au-dessus du nom. Les mots sont ceux de Rémy.

       Le portrait est l'avatar de sa chaîne YouTube, repris depuis la chaîne
       elle-même et servi par nous : 160 px de côté pour une pastille de 28,
       ce qui reste net jusqu'aux écrans à trois fois la densité, et 2,5 Ko.
       Le servir depuis `yt3.googleusercontent.com` aurait fait dépendre une
       image du site d'un domaine de Google, et prévenu Google à chaque
       visite. */
    surtitre: { texte: "Animé par Rémy", portrait: "/remy.webp" },
    texte:
      "Nous accompagnons exclusivement des business de formation, de coaching et de prestation de service à atteindre plus de 6 chiffres par an avec une offre digitale.",
    action: "Réservez votre appel découverte",
    href: liens.appel,
  },
  {
    id: "consulting",
    nom: "Consulting privé avec Rémy",
    surtitre: { texte: "Animé par Rémy", portrait: "/remy.webp" },
    texte:
      "C'est l'accompagnement le plus personnalisé que Rémy propose, où vous avez accès à lui en direct dès que vous en avez besoin et où vous pouvez réserver des visioconférences en illimité du lundi au samedi.",
    action: "Postuler pour le consulting privé",
    href: liens.consulting,
  },
] as const;

/**
 * Les piliers de chaque offre, pour la section en accordéon de l'accueil.
 *
 * **Tout le texte vient de Rémy.** Les quatre piliers de Funnels Club sont
 * repris de la transcription de sa vidéo de présentation, au mot près : ce sont
 * les quatre points qu'il énumère lui-même quand il répond à « comment on
 * accompagne les business avec qui on travaille ». Les titres sont ses propres
 * mots, pris dans la phrase qu'ils coiffent.
 *
 * **Ce que l'agent a fait, et qu'il faut relire :** couper. La transcription
 * est de la parole, donc sans ponctuation ni phrases nettes. Les passages ont
 * été bornés à des phrases complètes et les répétitions d'oral retirées. Rien
 * n'a été reformulé, aucun mot n'a été ajouté, mais le choix de l'endroit où
 * couper est un choix, et il se relit.
 *
 * Le consulting n'a pas de piliers : Rémy n'a pas encore fourni sa matière. La
 * liste est vide, et la section affiche un emplacement plutôt que d'inventer
 * quatre lignes plausibles.
 */
/**
 * Le texte de la maquette de l'espace membre.
 *
 * **Tout vient des captures de l'espace membre, au mot près :** les entrées de
 * navigation, les noms de modules, les libellés de carte et la phrase de
 * présentation. Rien n'est inventé, et rien ne le sera : une maquette qui
 * montre un produit doit montrer *ce* produit.
 *
 * **Ce qui a été volontairement retiré**, et qu'il ne faut pas réintroduire :
 *
 * - Les noms des membres et le contenu de leurs publications. Les captures en
 *   montrent de vrais, et les afficher sur une page publique exposerait des
 *   personnes qui n'ont rien demandé.
 * - Le nombre d'étudiants par module, « 430 étudiants » dans les captures. Le
 *   chiffre est vrai aujourd'hui et faux le mois prochain, et sur un site de
 *   formation un chiffre affiché est une allégation commerciale. S'il doit
 *   revenir, c'est une décision de Rémy, pas une reprise de capture.
 */
export const maquette = {
  nom: "Funnels Club",
  navigation: ["Communauté", "Formation", "Coachings", "Classement"],
  rubriques: [
    { titre: "Communauté", entrees: ["Groupe", "Histoires"] },
    {
      titre: "Apprentissage",
      entrees: [
        "Modèle",
        "État d'esprit",
        "Funnel Alchimie",
        "Social Architecte",
        "Marketing Genesis",
        "Closing Suprématie",
      ],
    },
    { titre: "Coachings", entrees: ["Rediffusion", "Règles", "Calendrier"] },
  ],
  presentation:
    "Développons un business de formation, coaching ou consulting dont vous serez fier, qui aide vraiment vos clients et vous permet de bien vivre de votre activité.",
  action: "Commencez-ici",
  modules: [
    "Modèle",
    "État d'esprit",
    "Funnel Alchimie",
    "Marketing Genesis",
    "Social Architecte",
    "Closing Suprématie",
  ],
  etiquette: "Espace secret",
  categorie: "Apprentissage",
} as const;

export type Pilier = {
  id: string;
  titre: string;
  texte: string;
  /** Deux fichiers, un par largeur. Absent tant que l'image n'existe pas. */
  visuel?: { large: string; mobile: string; alt: string };
};

export const piliers: Record<string, readonly Pilier[]> = {
  "funnels-club": [
    {
      id: "niche",
      titre: "Valider votre niche et votre positionnement",
      texte:
        "On va valider votre niche et votre positionnement afin de vous distinguer de la concurrence et d'attirer vos clients de rêve à vous comme un aimant. D'expérience, c'est sur ce point-là que la plupart des business qu'on a accompagnés ont les plus grosses difficultés.",
    },
    {
      id: "offre",
      titre: "Créer votre offre digitale",
      texte:
        "Soit vous partez de zéro et vous n'en avez pas, dans ce cas-là on va vous aider à la créer de A à Z, soit vous avez déjà une offre digitale et bien souvent on va vous permettre de l'adapter, de l'améliorer afin de vraiment aider vos clients. Vous n'aurez besoin que de deux à dix clients par mois pour atteindre dix mille euros par mois.",
    },
    {
      id: "tunnel",
      titre: "Mettre en place le parfait tunnel de vente",
      texte:
        "On va vous aider à mettre en place et adapter à votre business, votre niche, vos clients, le parfait tunnel de vente, pour qu'il vous génère des rendez-vous ultra qualifiés dans votre agenda. Et quand je dis qualifiés, c'est des personnes qui sont déjà convaincues qu'elles ont besoin de votre aide.",
    },
    {
      id: "clients",
      titre: "Attirer vos clients de rêve",
      texte:
        "On va attirer l'attention de ces clients de rêve au travers notamment de la publicité en ligne ou de la création de contenu. Et on va le faire de la façon la plus profitable et la plus automatisée qui soit.",
    },
  ],

  // Vide à dessein : la matière n'existe pas encore. Voir le commentaire
  // ci-dessus.
  consulting: [],
};

/**
 * La chaîne YouTube.
 *
 * L'identifiant est celui de l'URL de la chaîne. Le flux Atom de YouTube est
 * public et sans quota, contrairement à l'API Data v3 qui demande une clé.
 */
export const chaine = {
  nom: "Rémy Jupille",
  flux: "https://www.youtube.com/feeds/videos.xml?channel_id=UCzGq4I0pXnDJizd0fitt10w",
} as const;

/**
 * La vidéo de présentation, hébergée chez Wistia.
 *
 * `secondes` et `titre` viennent du média lui-même
 * (`fast.wistia.net/embed/medias/<id>.json`). L'affiche est téléchargée depuis
 * Wistia puis servie par nous : voir `LecteurVideo` pour la raison.
 */
export const video = {
  id: "di3bzcmi50",
  titre: "Vidéo de présentation",
  secondes: 981,
} as const;

/**
 * Le podcast.
 *
 * Le flux lu est celui d'Ausha, l'hébergeur : c'est lui qui alimente Apple
 * Podcasts, Spotify et les autres. Lire la source plutôt qu'une vitrine évite
 * d'interroger trois plateformes qui disent la même chose autrement.
 */
export const podcast = {
  nom: "Profit, liberté, no stress",
  flux: "https://feed.ausha.co/ypjV8sr07j2B",
  plateformes: [
    {
      nom: "Apple Podcasts",
      href: "https://podcasts.apple.com/fr/podcast/profit-libert%C3%A9-no-stress/id1479057423",
    },
    {
      nom: "Spotify",
      href: "https://open.spotify.com/show/4tehcIhRigecka2QMPHKZO",
    },
    { nom: "YouTube", href: "https://www.youtube.com/@profitlibertenostress" },
  ],
} as const;

/** La lettre, telle que son propre flux se décrit. */
export const lettre = {
  nom: "Digital Selfmade",
  baseline: "Profit, liberté, no stress",
  flux: "https://lettre.funnels.club/feed",
} as const;

/**
 * Les sections dont Rémy n'a pas encore écrit le texte.
 *
 * Chaque entrée décrit ce que la section attend. Tant que `titre` vaut `null`,
 * la page affiche un emplacement au lieu d'une phrase. Remplacer `null` par le
 * texte suffit à faire apparaître la section pour de bon.
 */
export const sections = {
  preuve: {
    titre: null as string | null,
    texte: null as string | null,
    attendu: "la section qui montre les résultats des membres",
  },
  aPropos: {
    titre: null as string | null,
    texte: null as string | null,
    attendu: "qui vous êtes et pourquoi vous faites ça",
  },
  appel: {
    titre: null as string | null,
    texte: null as string | null,
    attendu: "la phrase qui clôt la page et l'appel à l'action",
  },
} as const;

/**
 * Les chiffres mis en avant.
 *
 * Vide tant que Rémy n'a pas donné les vrais. Un chiffre inventé sur un site
 * de formation est une allégation commerciale, pas une maquette.
 */
export const chiffres: readonly {
  valeur: string;
  libelle: string;
}[] = [];

/**
 * Les résultats clients.
 *
 * Vide, pour la même raison, et parce qu'un témoignage engage la personne
 * citée. Il faut son nom, son chiffre, ses mots et son accord.
 */
export const resultats: readonly {
  type: "chiffre" | "citation";
  personne: string;
  metier: string;
  valeur?: string;
  libelle?: string;
  texte?: string;
  teinte?: string;
}[] = [];

/**
 * Les témoignages vidéo, hébergés chez Wistia.
 *
 * Les seize identifiants viennent de la page `/avis-funnels-club` du site
 * actuel, et les durées du média lui-même. Les affiches sont téléchargées puis
 * servies par nous, dans `public/temoignages/` : rien ne part chez Wistia tant
 * qu'une vidéo n'est pas lancée.
 *
 * **Les noms sont normalisés, pas inventés.** Les titres enregistrés côté
 * Wistia sont des étiquettes de travail (« interview jeremy v2 »,
 * « Interview-Joel ») : on en a tiré le nom de la personne, et le résultat
 * quand le titre le portait déjà. Rien n'a été ajouté. À relire par Rémy, qui
 * seul sait quels prénoms peuvent être affichés et quels chiffres sont encore
 * exacts.
 */
export const temoignages: readonly {
  id: string;
  nom: string;
  resultat?: string;
  secondes: number;
}[] = [
  {
    id: "j0vbkt570k",
    nom: "Christian Joyce",
    resultat: "De 0 € à 160 K€ en 5 mois",
    secondes: 988,
  },
  {
    id: "rgio4y4o8f",
    nom: "Roland Buffet",
    resultat: "De 0 € à 109 778 € en 6 mois",
    secondes: 715,
  },
  {
    id: "2vtsinplyx",
    nom: "Augustin Passy",
    resultat: "Trois fois son chiffre d'affaires",
    secondes: 485,
  },
  { id: "h24icz3l8d", nom: "Rayan Arifa", secondes: 759 },
  { id: "2xege6bt0u", nom: "Yannick et Sylvie", secondes: 1514 },
  { id: "vtfaka0m80", nom: "Olga", secondes: 1365 },
  { id: "fbtr4dqoji", nom: "Sandrine", secondes: 1321 },
  { id: "s3npr5izhy", nom: "Tatiana", secondes: 1248 },
  { id: "tvy3jbhml9", nom: "Charlotte", secondes: 1229 },
  { id: "b5taio9plc", nom: "François", secondes: 1192 },
  { id: "rtil6qeznq", nom: "Jeremy", secondes: 852 },
  { id: "ive07co9xm", nom: "Cédric", secondes: 781 },
  { id: "iy3jgcijgu", nom: "Corentin", secondes: 728 },
  { id: "abj3v8v8ek", nom: "Matthieu", secondes: 718 },
  { id: "4lkp9f6lm4", nom: "Valérie", secondes: 687 },
  { id: "brvvtbkmfo", nom: "Joël", secondes: 527 },
];

export const legales = [
  { libelle: "CGV", href: "/cgv" },
  { libelle: "Confidentialité", href: "/confidentialite" },
  { libelle: "Mentions", href: "/mentions" },
] as const;

/** Repris du pied de page de remy-jupille.com, au mot près. */
export const avertissement =
  "Ce site ne fait pas partie du site Facebook ou de Facebook, Inc. Ce site n'est PAS approuvé par Facebook de quelque manière que ce soit. FACEBOOK est une marque déposée de FACEBOOK, Inc.";
