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

/**
 * Un lien quitte-t-il le site ?
 *
 * La question se posait jusqu'ici à la main : chaque entrée de menu portait un
 * drapeau `externe`, et c'est lui qui décidait du `target="_blank"` et du
 * `rel="noreferrer"`. Aucun n'avait été oublié, mais **un oubli ne se verrait
 * pas** : le lien marcherait, il remplacerait simplement la page du site au
 * lieu de s'ouvrir à côté, et personne ne le remarquerait avant de regarder ses
 * statistiques de sortie.
 *
 * C'est exactement le raisonnement d'`avecTag` plus haut, et la même réponse :
 * une fonction plutôt qu'une consigne. Les composants la préfèrent désormais au
 * drapeau, qui ne sert plus qu'à forcer le cas contraire.
 *
 * Une adresse relative reste interne. Une absolue est comparée à `SITE` : un
 * lien vers notre propre domaine écrit en absolu n'est pas un lien sortant, et
 * l'ouvrir dans un onglet serait une petite trahison de plus.
 */
export function estExterne(href: string): boolean {
  if (!/^(https?:)?\/\//i.test(href)) return false;

  try {
    return new URL(href, SITE).origin !== new URL(SITE).origin;
  } catch {
    /* Une adresse illisible n'est pas un lien sortant : c'est un bug, et le
       traiter comme interne le laisse visible au lieu de l'ouvrir ailleurs. */
    return false;
  }
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
  livre: avecTag("https://www.digital-selfmade.com/livre-1"),

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
/**
 * La pastille au-dessus du titre du hero.
 *
 * La forme est celle de trendtrack.io, `main_hero__label`, fournie par Rémy :
 * une gélule en verre, une file de portraits qui se chevauchent, une phrase.
 *
 * **Le texte est de Rémy, et le chiffre est le sien.** « Plus de 1 000
 * entrepreneurs accompagnés » est une allégation commerciale : elle n'a pas été
 * écrite ici, elle a été dictée, et c'est la seule façon dont un chiffre entre
 * sur ce site.
 *
 * **Les quatre portraits sont de vrais clients**, pris dans les affiches de
 * leurs témoignages vidéo, déjà publiques sur `/resultats`. Aucun visage n'est
 * inventé et aucune banque d'images n'est employée : une preuve sociale illustrée
 * par des inconnus est exactement ce qu'il ne faut pas faire.
 *
 * **Le cadrage est relevé image par image**, et il le fallait : ce sont des
 * appels à deux, et le client n'est pas toujours du même côté. Augustin Passy et
 * le couple Yannick et Sylvie sont à gauche, Christian Joyce et Roland Buffet à
 * droite. Une valeur unique aurait cadré Rémy une fois sur deux.
 *
 * À relire par Rémy : ces quatre-là ont été choisis pour la netteté de leur
 * cadrage, pas par lui.
 */
/**
 * Le message de Rémy, sous le graphique.
 *
 * **Le texte est de lui, dicté d'une traite, et il m'a demandé de le relire.**
 * C'est une exception à la règle du dépôt, et elle est de lui : « je te laisse
 * relire ce texte et l'adapter pour qu'il soit fluide, sans forcément modifier
 * le sens de mes phrases ». Ce qui a été fait tient en trois gestes, et aucun
 * n'invente :
 *
 * - **Les fautes de dictée sont corrigées.** « les sites internet sont or »
 *   pour « sont morts », « tunnels de vent » pour « tunnels de vente »,
 *   « rentrer en contact » pour « entrer en contact ».
 * - **Les phrases sont resserrées**, pas réécrites : les reprises de l'oral
 *   sont retirées, les trois voies et les trois erreurs reçoivent le même
 *   patron, une amorce en gras puis son explication. Le vocabulaire est le
 *   sien, mot pour mot, partout où il était déjà net.
 * - **Rien n'a été ajouté.** Aucune promesse, aucun chiffre, aucun exemple qui
 *   ne soit pas dans sa dictée.
 *
 * **Ce qui a été retiré et qu'il faut décider :** la liste des thématiques
 * portait « poils à bois », que la dictée a rendu inintelligible. « Poêle à
 * bois » et « pose de bois » sont tous deux plausibles et ce n'est pas à moi de
 * choisir : un métier inventé dans une liste de clients est une référence
 * fausse. La ligne est donc absente, à remettre par Rémy.
 *
 * **À VALIDER PAR RÉMY**, phrase par phrase. Les deux chiffres qu'il porte,
 * « plus de dix ans » et « plus de 1 000 business », sont des allégations
 * commerciales : elles viennent de lui et n'ont pas été touchées.
 */
export const messageRemy = {
  /* Le titre est la première phrase de la lettre, et le bloc entier est entre
     guillemets, sur décision de Rémy : le guillemet ouvrant est collé au titre,
     le fermant termine le dernier paragraphe. Ce n'est plus une section qui
     annonce un message, c'est le message qui commence.

     La phrase ne se répète donc plus en tête de corps : elle était l'intro, elle
     est devenue le titre.

     Les espaces à l'intérieur des guillemets sont insécables, comme le veut la
     typographie française : une espace ordinaire y autorise un retour à la
     ligne, et le guillemet se retrouve seul en fin de ligne. */
  titre: "«\u00a0Hey, c'est Rémy",
  portrait: "/remy.webp",

  amorceVoies:
    "Si vous voulez très bien vivre de vos connaissances ou de vos compétences en ligne, vous avez aujourd'hui trois façons de le faire.",
  voies: [
    {
      titre: "Créer une formation",
      texte:
        "Vous créez des modules de formation, avec ou sans accompagnement.",
    },
    {
      titre: "Vendre du coaching ou du consulting",
      texte: "Vous vendez votre temps contre de l'argent, à un taux horaire.",
    },
    {
      titre: "Faire de la prestation de service",
      texte: "Vous faites le gros du travail à la place de vos clients.",
    },
  ],

  amorceErreurs:
    "Mais peu importe le type d'offre que vous choisissez, il y a trois erreurs que vous devez absolument éviter.",
  erreurs: [
    {
      titre: "La première : créer un site internet.",
      texte:
        "Aujourd'hui, les sites internet ne fonctionnent plus, sauf si c'est d'une vitrine que vous avez besoin. Si votre objectif est d'obtenir des clients, c'est un tunnel de vente qu'il vous faut à la place.",
    },
    {
      titre: "La deuxième : prospecter.",
      texte:
        "La prospection vous demandera beaucoup de temps et beaucoup d'énergie pour très peu de résultats, et vous risquez de vous épuiser à passer vos journées à vous justifier.",
    },
    {
      titre:
        "La troisième : créer du contenu sur les réseaux sociaux avant d'avoir un tunnel de vente qui fonctionne.",
      texte:
        "Sans le bon tunnel, peu importe les efforts que vous ferez pour amener du trafic vers vos offres : vous n'obtiendrez jamais aucun client.",
    },
  ],

  suite: [
    "La logique est facile à comprendre. Vous avez beau avoir la meilleure offre du monde : si votre système ne transforme pas un inconnu en client rapidement, il ne vous rapportera aucun client.",
    "Ça fait maintenant plus de dix ans que je suis entrepreneur sur internet. Au cours de ces dix années, j'ai peaufiné et ajusté le parfait tunnel de vente pour les créateurs de formation, de coaching, d'accompagnement et de prestation de services.",
    "J'ai fait en sorte qu'il respecte mes valeurs : il doit rester simple, et donner des résultats réguliers et prévisibles. On ne cherche pas à faire un coup. On veut un business qui évolue avec le temps, de façon stable, sur lequel toute une vie peut reposer. Parce que quoi de plus stressant qu'un chiffre d'affaires en montagnes russes ?",
    "Ce tunnel de vente, je l'applique aujourd'hui moi-même dans mon propre business. Et au cours des dernières années, nous l'avons mis en place dans plus de 1 000 business de formation et de coaching, dans des centaines de thématiques : le basket, la formation professionnelle du BTP, le yoga, la batterie, le piano, le violoncelle, le développement personnel, la spiritualité.",
    "Ce qui est sûr, c'est que, peu importe le domaine dans lequel vous souhaitez monétiser votre expertise, ce tunnel de vente pourra s'adapter pour vous apporter des clients qualifiés, capables de payer jusqu'à plusieurs milliers d'euros pour obtenir vos conseils.",
  ],

  /* La conclusion est découpée parce qu'elle porte deux liens, et que le texte
     d'un lien est du texte : il vit ici comme le reste, et pas dans le JSX.

     Le premier renvoie à la vidéo du haut de page plutôt qu'à une page
     extérieure, sur décision de Rémy : la formation gratuite dont il parle est
     celle qui est déjà là, à deux écrans au-dessus. Un lien interne vaut mieux
     qu'un départ. */
  conclusion: {
    avant: "Et j'ai réalisé une ",
    lienVideo: "vidéo de formation totalement gratuite",
    milieu:
      " dans laquelle je vous explique en détail comment fonctionne ce tunnel de vente. Si vous souhaitez aller plus loin après l'avoir visionnée, vous pourrez ",
    lienAppel: "entrer en contact avec nous",
    apres: " pour échanger de vive voix.\u00a0»",
  },

  salutation: "À votre succès,",
  signature: "Rémy Jupille",
} as const;

export const pastilleHero = {
  texte: "Plus de 1 000 entrepreneurs accompagnés",
  portraits: [
    { fichier: "j0vbkt570k", cadrage: "78% 45%" },
    { fichier: "rgio4y4o8f", cadrage: "76% 46%" },
    { fichier: "2vtsinplyx", cadrage: "27% 48%" },
    { fichier: "2xege6bt0u", cadrage: "35% 48%" },
  ],
} as const;

export const menus: readonly {
  libelle: string;
  entrees: readonly {
    libelle: string;
    href: string;
    texte?: string;
    /** La signature sous la description, « Animé par Rémy ». */
    mention?: string;
    externe?: boolean;
  }[];
}[] = [
  {
    libelle: "Programmes",
    entrees: [
      /* Les deux descriptions ont été raccourcies par Rémy pour le menu, et
         chacune porte sa mention. Elles ne disent plus ce que le programme
         rapporte mais ce qu'il est : dans une grille à deux colonnes, une
         description tient sur une ligne, et une promesse tronquée aux points de
         suspension est pire que pas de promesse. Le chiffre reste sur la carte
         de l'accueil, où il a la place de s'écrire en entier. */
      {
        libelle: "Funnels Club",
        href: liens.appel,
        texte: "Accompagnement sur mesure",
        mention: "Animé par Rémy",
        externe: true,
      },
      {
        libelle: "Consulting privé avec Rémy",
        href: liens.consulting,
        texte: "Accompagnement privé",
        mention: "Animé par Rémy",
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
      /* « Blog » et non « Digital Selfmade », sur décision de Rémy : deux
         entrées du même menu portaient le même nom, la lettre et le livre, et
         seul le descriptif les distinguait. Le descriptif est raccourci en
         conséquence : il n'a plus à dire de quoi il s'agit. */
      {
        libelle: "Blog",
        href: "/articles",
        texte: "Tous les articles",
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
 * Une phrase par offre. Celle du consulting est choisie dans leur page et non
 * résumée : résumer, c'est réécrire, et réécrire une promesse commerciale
 * n'appartient pas à l'agent.
 *
 * Celle de Funnels Club fait exception, et il faut savoir laquelle : elle a été
 * **dictée par Rémy**, point par point, et seulement assemblée ici. Voir le
 * commentaire qui la précède.
 */
/**
 * Le titre de la section des résultats.
 *
 * **À VALIDER PAR RÉMY.** C'est une des deux phrases du site que l'agent ait
 * écrites, et elle l'a été sur sa demande explicite : il a fourni « Real people.
 * Real results. », le titre de la section de functionhealth.com dont la nôtre
 * reprend la forme, et demandé un équivalent français.
 *
 * Ce n'est donc pas une invention mais une traduction, et elle se relit comme
 * telle. Deux autres rendus ont été écartés : « Des gens réels. Des résultats
 * réels. », plus littéral mais qui sonne comme une traduction automatique, et
 * « Vraies personnes. Vrais résultats. », plus sec mais qui perd l'article et
 * donc le rythme de l'original.
 *
 * Le titre précédent était « Résultats de nos clients », écrit par Rémy. Si
 * celui-ci ne convient pas, c'est là qu'il faut revenir.
 *
 * La coupure en deux segments n'est pas de la mise en forme : le second porte
 * l'accent, comme dans l'original où il change de couleur et passe en italique.
 */
export const titreResultats = [
  { texte: "De vraies personnes." },
  { texte: "De vrais résultats.", accent: true },
] as const;

/**
 * Le titre de la section des offres, et son sous-titre. Écrits par Rémy, dictés
 * au mot près.
 *
 * **La coupure à la main a disparu, et c'est le nouveau texte qui la rend
 * inutile.** L'ancien titre, « Nos deux accompagnements personnalisés pour vous
 * accompagner », était stocké en deux lignes parce qu'aucune largeur ne
 * produisait la césure voulue : le moteur remplissait la première ligne et
 * laissait tomber le reste, ce qui donnait une ligne longue écrasant deux
 * courtes. Celui-ci est plus court d'un tiers et se coupe proprement tout seul.
 * La forme se mesure quand même, elle ne se suppose pas : voir la règle des
 * blocs de texte dans `AGENTS.md`.
 *
 * Le sous-titre porte ce que le titre ne dit plus : le titre parle de la façon
 * de travailler, le sous-titre annonce qu'il y a deux formules et invite à les
 * regarder. C'est pour ça qu'il en faut un ici alors qu'il n'y en avait pas
 * avant.
 */
export const titreOffres = "Nous croyons en un accompagnement humain";

export const sousTitreOffres =
  "Découvrez nos deux formules d'accompagnement personnalisées.";

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

    /* La courbe de croissance, entre le titre et la description.
     *
     * C'est un drapeau et non des données : la forme vit dans `CourbeMontante`,
     * parce qu'elle ne dit rien de chiffrable. Elle part à plat, longtemps, puis
     * monte. C'est ce plat du début qui porte le sens, et il n'appartient pas au
     * contenu.
     *
     * **Aucun montant n'y est écrit.** Une première version en affichait un ; la
     * carte dit déjà « plus de 6 chiffres par an », et un nombre dans le dessin
     * en ferait une seconde promesse, plus précise que la phrase.
     *
     * Le consulting n'en a pas : il montre autre chose, un échange. */
    courbe: true,
    /* Réécrite sous la dictée de Rémy, et c'est ce qui la distingue du reste
       de ce fichier : les autres phrases sont reprises telles quelles de
       funnels.club, celle-ci a été dictée point par point, « un accompagnement
       sur mesure », « on prend par la main », « créer ou développer », « plus de
       6 chiffres par an ». L'agent n'a fait que l'assembler.

       L'ancienne version disait « nous accompagnons exclusivement des business
       de formation, de coaching et de prestation de service à atteindre plus de
       6 chiffres par an avec une offre digitale ». Elle décrivait qui est
       accepté ; celle-ci décrit ce qu'on fait, et s'ouvre à ceux qui n'ont pas
       encore de business. */
    texte:
      "Un accompagnement sur mesure, où nous prenons par la main les personnes qui souhaitent créer ou développer leur business de formation, de coaching ou de prestation de services, dans l'objectif d'atteindre plus de 6 chiffres par an.",
    action: "Réservez votre appel découverte",
    href: liens.appel,
  },
  {
    id: "consulting",
    nom: "Consulting privé avec Rémy",
    surtitre: { texte: "Animé par Rémy", portrait: "/remy.webp" },

    /* La conversation jouée dans la carte, sur demande de Rémy : un client qui
       écrit, qui envoie, puis Rémy qui écrit et qui répond.
     *
     * **Vide, et il faut que Rémy l'écrive.** Ce sont deux messages qui
     * s'afficheront comme un échange réel entre un client et lui : une question
     * inventée par l'agent, et une réponse inventée par l'agent, sur la carte
     * qui vend l'accès direct à Rémy, seraient un faux échange. C'est la règle
     * la plus stricte du dépôt, et c'est aussi le cas où elle compte le plus.
     *
     * Deux lignes suffisent : la question telle qu'un client la poserait, et ce
     * que Rémy répondrait. Tant qu'elles manquent, la carte s'affiche sans la
     * conversation, comme avant. */
    conversation: {
      question: "Disponible pour un appel en visio ?",
      reponse: "Oui bien-sûr, je t'envoie un lien",
      /* Le pouce du client, qui clôt l'échange. C'est la réponse de Rémy :
         « dernière réponse de la personne après Rémy : 👍 ». Un émoji seul est
         du contenu comme un autre, et il dit ce qu'aucune phrase ne dirait plus
         court, que c'est réglé. */
      fin: "👍",
    },
    /* **À VALIDER PAR RÉMY. Celle-ci est réécrite, pas recoupée.**
       C'est la seconde phrase du site que l'agent ait écrite, après le titre des
       résultats, et elle l'a été sur demande insistante : une première retouche
       n'était qu'une coupe, et Rémy a demandé d'aller plus loin.
       La version d'origine, à laquelle revenir si celle-ci ne va pas :
       « C'est l'accompagnement le plus personnalisé que Rémy propose, où vous
       avez accès à lui en direct dès que vous en avez besoin et où vous pouvez
       réserver des visioconférences en illimité du lundi au samedi. »

       **La règle tenue : aucun fait nouveau.** Tout ce qui est affirmé ici était
       déjà affirmé. L'accompagnement le plus personnalisé qu'il propose, l'accès
       en direct dès qu'on en a besoin, les visioconférences en illimité du lundi
       au samedi. Rien sur un délai de réponse, rien sur un résultat, rien sur un
       nombre de places : ces choses-là seraient des promesses commerciales, et
       elles ne s'inventent pas.

       **Ce qui a changé est l'ordre et la personne.** La phrase d'origine
       décrivait une offre, en commençant par ce qu'elle est. Celle-ci commence
       par ce qu'on obtient, « Rémy en direct », et s'adresse à quelqu'un plutôt
       qu'à personne. C'est de là que vient l'envie, pas d'un adjectif de plus.

       « Vous lui écrivez quand la question se pose » dit la même chose que
       « accès en direct dès que vous en avez besoin », mais en montrant le
       geste. C'est aussi ce que l'échange animé juste au-dessus donne à voir :
       les deux se répondent au lieu de se répéter. */
    texte:
      "Rémy en direct, dès que vous en avez besoin. C'est l'accompagnement le plus personnalisé qu'il propose : vous lui écrivez quand la question se pose, et vous réservez vos visioconférences en illimité, du lundi au samedi.",
    action: "Postuler pour le consulting privé",
    href: liens.consulting,
  },
] as const;

/**
 * La section qui suit les deux offres : le cadrage, le blocage, la solution.
 *
 * **Tout le texte est de Rémy**, dicté par lui, et il reprend le mouvement du
 * deck publicitaire Funnels Club : la slide « sites-morts » pour le titre, la
 * slide « cadrage » pour le sous-titre, qu'il a raccourcie lui-même.
 *
 * **La coupure du titre en segments n'est pas de la mise en forme.** Ce sont
 * deux phrases, et le segment `accent` est celle qu'on veut entendre.
 *
 * **Ce que la section portait et ne porte plus**, sur décision de Rémy : la
 * liste des quatre « vous ne savez pas », reprise de la slide « pour-qui », et
 * le bloc « La solution, c'est de mettre en place un tunnel de vente… qui
 * remplace complètement votre site internet », repris de la slide « tunnel ».
 * Le graphique les remplace : il dit la même chose en la montrant, et les
 * garder faisait dire trois fois la même chose à la même section. Les deux
 * textes ne sont pas perdus, ils sont dans le deck, d'où ils venaient.
 */
export const sectionTunnel = {
  /* Le titre, dicté par Rémy. Il ne vient pas du deck, mais il en reprend la
     slide « sites-morts » : le deck dit « les sites internet sont morts… vous
     n'aurez jamais de client avec ». Ici la phrase est retournée en deux temps,
     le constat puis la relève, et c'est la seconde qui porte l'accent.

     La coupure en deux segments n'est pas de la mise en forme : ce sont deux
     phrases, et la seconde est celle qu'on veut entendre.

     « Le parfait « tunnel de vente » » est venu remplacer « les tunnels de
     vente », sur décision de Rémy. C'est la promesse du deck reprise telle
     quelle, guillemets compris : le singulier dit une méthode arrêtée là où le
     pluriel disait une catégorie d'outils, et les guillemets disent que
     l'expression est de lui. Ils encadrent « tunnel de vente » et non
     « parfait », comme dans le deck. */
  titre: [
    { texte: "Les sites internet sont morts." },
    { texte: "Place au parfait « tunnel de vente ».", accent: true },
  ],

  /* Le sous-titre, dicté par Rémy lui aussi. C'est la slide « cadrage » du
     deck, raccourcie par lui : le deck disait « votre formation, votre coaching
     ou votre accompagnement à plusieurs milliers d'euros », il dit ici « une
     formation, du coaching ou de la prestation de service ». Le prix a disparu
     de cette phrase ; il reste dans les quatre lignes qui suivent. */
  sousTitre:
    "Si vous souhaitez vendre une formation, du coaching ou de la prestation de service.",

  /* Les noms des deux courbes du graphique. Ce sont les deux membres du titre,
     repris tels quels : la comparaison montrée doit porter les mêmes mots que
     la phrase qui l'annonce, sinon le lecteur doit faire la traduction. C'est
     pour cette raison que la courbe verte s'appelle « Parfait tunnel de
     vente » et non « Tunnels de vente », sur correction de Rémy : le titre dit
     « parfait », la légende doit le dire aussi. Les guillemets, eux, restent au
     titre : dans une légende de deux mots, ils encombrent. */
  courbes: {
    sites: "Sites internet",
    tunnels: "Parfait tunnel de vente",
  },
} as const;

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
 * Le livre, tel que sa propre page de vente le présente.
 *
 * **Tout le texte est repris mot pour mot de `digital-selfmade.com/livre-1`.**
 * Rien n'est résumé et rien n'est écrit pour l'occasion : c'est la page de
 * vente de Rémy, donc ses mots, et une accroche de livre réécrite par un agent
 * serait une allégation commerciale inventée.
 *
 * **Deux graphies cohabitent sur sa page**, « Digital Selfmade » et « Digital
 * Self Made ». C'est la première qui est retenue ici, parce que c'est celle du
 * titre, du domaine, et celle que le reste de ce fichier emploie déjà pour la
 * lettre. La citation qui porte l'autre graphie a donc été alignée sur
 * celle-ci : c'est la seule retouche, et elle se relit.
 *
 * Le tiret cadratin de la page d'origine ne passe pas la règle du projet. Les
 * phrases qui en portaient un ne sont pas reprises, plutôt que d'être
 * recoupées : recouper, c'est réécrire.
 */
export const livre = {
  nom: "Digital Selfmade",
  etiquette: "Chapitre #1 OFFERT",
  sousTitre:
    "La méthode simple et prouvée pour vivre d'Internet en vendant ses connaissances",
  paragraphes: [
    "Digital Selfmade n'est comme aucun autre livre de business ou de marketing que vous avez pu lire. Il s'agit d'un guide pratique, qui vous donnera le plan étape par étape vers l'indépendance financière via la création d'un business en ligne extrêmement profitable.",
    "Sa stratégie s'adapte à toutes les niches, pour vendre tout type d'offres (physique, digital ou de service) et à tous les prix.",
  ],
  action: "Obtenez votre copie",
  /* « Chapitre gratuit » et non « Téléchargez le chapitre 1 gratuitement ».
     C'est le libellé court de sa propre page, celui de son menu du haut, et
     c'est donc encore son texte : le raccourci n'a pas été inventé ici. */
  actionSecondaire: "Chapitre gratuit",
  href: liens.livre,

  /* Le rendu 3D vient de la page de vente elle-même, rogné de ses marges
     transparentes et servi par nous en deux largeurs. L'alternative décrit ce
     que l'image montre, sans « image de » : c'est une couverture de livre, et
     le lecteur d'écran annonce déjà qu'il s'agit d'une image. */
  visuel: {
    large: "/livre-digital-selfmade.webp",
    mobile: "/livre-digital-selfmade-mobile.webp",
    alt: "Le livre Digital Selfmade de Rémy Jupille, posé devant ses pages ouvertes",
  },
} as const;

/**
 * Les colonnes du pied de page.
 *
 * Elles reprennent les deux menus de l'en-tête, entrée pour entrée : un pied de
 * page qui expose d'autres destinations que le menu oblige le lecteur à
 * comparer deux listes pour savoir ce que le site contient.
 *
 * Les libellés sont ceux qui existent déjà ailleurs. Les deux entrées ont
 * longtemps porté le même nom, « Digital Selfmade », pour la lettre et pour le
 * livre : dans l'en-tête, un descriptif sous le libellé les distinguait ; ici,
 * il n'y en a pas, et il fallait allonger les deux. Rémy a tranché autrement en
 * renommant la lettre « Blog », ce qui rend le nom au livre seul.
 */
export const colonnesPiedDePage: readonly {
  titre: string;
  entrees: readonly EntreeNavigation[];
}[] = [
  {
    titre: "Programmes",
    entrees: [
      { libelle: "Funnels Club", href: liens.appel, externe: true },
      {
        libelle: "Consulting privé avec Rémy",
        href: liens.consulting,
        externe: true,
      },
      { libelle: "Espace membre", href: liens.espaceMembre, externe: true },
    ],
  },
  {
    titre: "Ressources",
    entrees: [
      { libelle: "Résultats", href: "/resultats" },
      { libelle: "Blog", href: "/articles" },
      { libelle: "Digital Selfmade", href: liens.livre, externe: true },
    ],
  },
  {
    titre: "Podcasts",
    entrees: [
      { libelle: "Profit, liberté, no stress", href: "/podcast" },
      {
        libelle: podcastMaverick.nom,
        href: podcastMaverick.site,
        externe: true,
      },
    ],
  },
];

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
 * Ce qui a été essayé pour afficher les avis clients, et pourquoi il n'en reste
 * rien dans le site.
 *
 * Rien de tout cela n'est en place. C'est noté parce que la question reviendra,
 * et qu'elle mérite mieux que de refaire trois fois le même chemin.
 *
 * **Recopier les avis Trustpilot et Amazon dans ce fichier, sans citer la
 * source.** C'était la demande de départ, et c'est le seul des chemins qui soit
 * fermé pour de bon. L'article L111-7-2 du Code de la consommation impose à un
 * site qui affiche des avis de dire d'où ils viennent et s'ils sont vérifiés :
 * retirer la mention est exactement ce que le texte vise. S'y ajoutent le nom et
 * la photo de ces personnes, dont le consentement ne suit pas d'une plateforme
 * à un site commercial, et les conditions des deux plateformes, qui
 * l'interdisent. C'est aussi ce que dit déjà la règle du dépôt pour
 * `resultats` : un témoignage engage la personne citée, il faut ses mots **et
 * son accord**.
 *
 * **Le widget officiel de Trustpilot.** Il réglait tout : il sert les avis
 * depuis Trustpilot, avec la marque, la note et la mention de vérification. Il
 * a été posé puis retiré, sur décision de Rémy : il apporte un script tiers, sa
 * propre mise en forme et sa marque au milieu de la page. La fiche est
 * revendiquée et l'identifiant de l'unité est `60cc5d274404620001728cbd`, avec
 * le gabarit de carrousel `53aa8912dec7e10d38f59f36`, si la question revient.
 *
 * **Amazon n'a pas d'équivalent.** Aucun widget d'avis pour un site tiers : les
 * seuls modules intégrables sont des liens et bannières d'affiliation, et l'API
 * Product Advertising ne renvoie plus le texte des avis depuis 2020.
 *
 * **Un simple lien vers les deux fiches.** Posé, puis retiré aussi, sur décision
 * de Rémy.
 *
 * Reste donc la voie longue, et c'est la bonne : demander leur accord aux
 * personnes concernées, et écrire leurs mots ici comme le reste du contenu.
 */

/**
 * Les témoignages vidéo, hébergés chez Wistia.
 *
 * Les identifiants viennent de la page `/avis-funnels-club` du site actuel, et
 * les durées du média lui-même. Ils étaient seize ; celui de Rayan Arifa a été
 * retiré sur décision de Rémy, ainsi que son affiche. Il en reste quinze. Les affiches sont téléchargées puis
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
/**
 * Le témoignage montré en premier, sur décision de Rémy.
 *
 * C'est un identifiant et non une position : l'ordre du tableau peut changer
 * sans que celui-ci cesse d'être juste, et on lit tout de suite **de qui** il
 * s'agit, ce qu'un `1` ne dirait pas.
 */
export const temoignageEnAvant = "rgio4y4o8f";

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

/**
 * Les avertissements du pied de page, fournis par Rémy et repris au mot près.
 *
 * Deux paragraphes et non un : le premier porte l'avertissement sur les
 * résultats, qui est ce qui engage réellement une société de formation ; le
 * second porte les cookies et la mention Facebook. Les séparer n'est pas une
 * coquetterie de mise en page, c'est ce qui rend le premier lisible au lieu de
 * le noyer dans un bloc de quatre-vingts mots.
 *
 * **Ils ne se réécrivent pas.** Ce sont des textes qui engagent la société, et
 * les guillemets droits autour de « devenir riche » sont ceux de Rémy : les
 * corriger en guillemets français, c'est modifier un document légal au jugé.
 */
export const avertissements = [
  'Funnels Club est une société de formation en marketing, pas une opportunité de gain garanti. Les résultats présentés sont exceptionnels et ne sont pas typiques ; ils dépendent de votre travail, de vos compétences et du marché. Nous ne garantissons aucun revenu et ne sommes pas un système pour "devenir riche". En progressant, vous acceptez que votre succès reste votre entière responsabilité.',
  "Nous utilisons des cookies pour améliorer, promouvoir et protéger nos services. En continuant à utiliser ce site, vous acceptez notre politique de confidentialité et nos conditions d'utilisation. Ce site ne fait pas partie du site Facebook ou de Facebook, Inc. Ce site n'est PAS approuvé par Facebook de quelque manière que ce soit. FACEBOOK est une marque déposée de FACEBOOK, Inc.",
] as const;
