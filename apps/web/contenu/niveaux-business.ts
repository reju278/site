/**
 * Le bonus de la Formation Genesis : la checklist des niveaux de business,
 * `go.funnels.club/formation-genesis/espace/bonus` (issue #8).
 *
 * **Le texte est celui de Rémy, mot pour mot**, recopié de sa page Notion
 * `docs.funnels.club/niveaux-business` le 18 novembre 2026, fautes comprises :
 * on ne corrige pas un texte publié au jugé (« tu as du remarqué », « le
 * courant doit donc passé », « Si tu es es dans la colonne », « Réserver ton
 * appel »). Rémy décide s'il les reprend.
 *
 * Les marques de la page Notion sont gardées dans le texte, rendues par
 * `TexteMarque` : `<b>` gras, `<i>` italique, `<mb>` surlignage bleu, `<mj>`
 * surlignage jaune, `<my>` surlignage jaune souligné (« Rémy Jupille »,
 * « l'appel stratégique », « niveau #1 »).
 *
 * **Ce qui n'est pas de Rémy**, et reste à valider par lui :
 * - les libellés de `checklistNiveaux`, marqués PROVISOIRES ;
 * - **la répartition des témoignages par niveau**, toujours en nombre pair
 *   (deux par rangée : un nombre impair laisse une case vide, sur demande de
 *   Rémy, et `ChecklistNiveaux` refuse de construire sinon). Joël en est
 *   sorti ; Corentin aussi au niveau 3, son second entretien restant au 4.
 *   Elle est faite par l'agent d'après
 *   la phrase de chaque entretien dans `temoignages` (`site.ts`) : le palier
 *   que raconte l'entretien, ramené à l'année. **Aucun au niveau 5** : aucun
 *   entretien n'annonce plus d'un million par an, et en poser un laisserait
 *   croire que si.
 *
 * Les vidéos YouTube sont celles de la page Notion, dans son ordre (deux
 * colonnes, lues rangée par rangée) ; leurs titres sont relevés sur YouTube.
 */

/** Un bloc de texte, dans l'ordre de la page Notion. */
export type BlocNiveaux =
  | { type: "h2"; texte: string }
  | { type: "p"; texte: string }
  | { type: "liste"; items: string[] }
  | { type: "encadre"; blocs: BlocNiveaux[] }
  /** Le bouton d'appel de Rémy, vers la réservation du tunnel. */
  | { type: "bouton" }
  /** La ligne par niveau du diagnostic, avec le compte des cases. */
  | { type: "synthese" }
  /** Des cases à cocher ; `groupe` les nomme pour la mémoire du navigateur. */
  | { type: "cases"; groupe: string; items: string[] }
  /** Un encadré de réponse : la question (ou rien) et un champ libre. */
  | { type: "reponse"; id: string; question: string | null }
  | { type: "tableau"; lignes: string[][] }
  | { type: "citation"; texte: string };

export type NiveauBusiness = {
  n: number;
  emoji: string;
  titre: string;
  /** Le nom court du niveau, pour la navigation entre onglets. */
  court: string;
  cases: string[];
  recoTitre: string;
  recos: string[];
  videos: { id: string; titre: string }[];
  /** Les identifiants Wistia, pris dans `temoignages` de `site.ts`. */
  temoignages: string[];
};

/** Les libellés de l'interface, PROVISOIRES (agent), sauf ceux marqués de
 *  Rémy. */
export const checklistNiveaux = {
  diagnostic: { cle: "diagnostic", emoji: "🧭", libelle: "Diagnostic" },
  exercice: { cle: "exercice", emoji: "✍️", libelle: "Exercice" },
  niveau: (n: number) => `Niveau ${n}`,
  /** De Rémy, sous chaque liste de cases. */
  verdict: (n: number) => `Si tu coches plus de 3 cases ici, tu es au niveau #${n}`,
  /** Le seuil de la phrase de Rémy : « plus de 3 cases ». */
  seuil: 3,
  /** De Rémy, au-dessus des vidéos. */
  titreVideos: (n: number) => `Quelques vidéos de “niveau #${n}”`,
  /** Sur le modèle du précédent. */
  titreTemoignages: (n: number) => `Quelques témoignages de “niveau #${n}”`,
  badge: "Ton niveau",
  reponse: "Réponse :",
  memoire: "Tes cases et tes réponses restent dans ce navigateur, rien n’est envoyé.",
  effacer: "Tout effacer",
  confirmer: "Décocher toutes les cases et effacer tes réponses ?",
};

export const diagnosticNiveaux: BlocNiveaux[] = [
  {
    type: "h2",
    texte: "Avant de commencer : voici le vrai problème"
  },
  {
    type: "p",
    texte: "La plupart des gens qui ont un business en ligne ne stagnent pas parce qu'ils sont paresseux."
  },
  {
    type: "p",
    texte: "Ils stagnent parce qu'ils utilisent les <b>réflexes du Niveau 1</b> dans un business qui est déjà au <b>Niveau 3</b>. Ils continuent de faire ce qui les a amenés là où ils sont aujourd'hui, alors que c'est exactement ça qui les empêche d'aller plus loin."
  },
  {
    type: "p",
    texte: "Chaque niveau demande de <b>laisser mourir</b> une partie de toi : une habitude, une peur, une manière de travailler. Sans ça, tu restes coincé à un palier, peu importe combien tu travailles."
  },
  {
    type: "h2",
    texte: "Comment utiliser ce document pour grandir"
  },
  {
    type: "liste",
    items: [
      "<mb><b>Réponds vite, pas parfaitement</b></mb><b>.</b> Ton premier réflexe est souvent le bon.",
      "<mb><b>Identifie où tu es vraiment</b></mb>, pas où tu <i>crois</i> être ou où tu <i>aimerais</i> être.",
      "<mb><b>Réserve un appel gratuit avec nous</b></mb>, et apporte ce document avec toi."
    ]
  },
  {
    type: "encadre",
    blocs: [
      {
        type: "p",
        texte: "<b>Information sur “</b><my><b>l’appel stratégique Funnels Club</b></my><b>”</b>"
      },
      {
        type: "p",
        texte: "Lors de mes vidéos YouTube, où dans nos ressources gratuite (comme celle-ci), tu as du remarqué que nous te proposions régulièrement de réserver un appel gratuit avec nous."
      },
      {
        type: "p",
        texte: "Sache qu’il ne s’agit <mj><b>PAS</b></mj> d’un appel de vente sous pression : aucune offre ne te sera faite lors de ce rendez-vous. <i>La raison ? </i>Chez Funnels Club, nous ne voulons accompagner des entrepreneurs que sous deux conditions <mj>non négociables</mj> :"
      },
      {
        type: "liste",
        items: [
          "<mj><b>Nous sommes certain de pouvoir te faire réussir</b></mj> : cela implique de comprendre en détail ton projet AVANT de te proposer quoi que ce soit.",
          "<mj><b>Nous voulons prendre PLAISIR à travailler avec nos clients</b></mj> : le “courant” doit donc passé entre nous, et tu dois avoir le bon état d’esprit pour réussir. Nous voulons nous assurer que tu seras prêt à travailler dur pour réussir."
        ]
      },
      {
        type: "p",
        texte: "Si et seulement “si” ces deux critères sont réunis, alors à la fin de notre premier échange au téléphone, nous te proposerons un deuxième rendez-vous de démo en visio pour te présenter toute notre stratégie de A à Z, et pourquoi elle fonctionne si bien."
      },
      {
        type: "bouton"
      }
    ]
  },
  {
    type: "h2",
    texte: "Diagnostic : quel niveau as-tu vraiment aujourd’hui ?"
  },
  {
    type: "p",
    texte: "Pour chaque niveau, coche les phrases qui sont <mb><b>vraies pour toi aujourd'hui</b></mb>."
  },
  {
    type: "synthese"
  }
];

export const niveauxBusiness: NiveauBusiness[] = [
  {
    n: 1,
    emoji: "🌱",
    titre: "Niveau #1 : Le démarrage de 0€ à 10 000€ par an",
    court: "Le démarrage",
    cases: [
      "Je fais tout tout seul : vendre, délivrer, gérer, communiquer, encaisser",
      "Je ne sais pas vraiment quoi vendre, ni à qui le vendre",
      "J'ai déjà testé plusieurs idées et aucune n'a vraiment décollé",
      "J'échange encore mon temps contre de l'argent (sessions, missions, prestations)",
      "Je doute de ma légitimité “<i>qui suis-je pour faire payer pour ça ?”</i>",
      "Je n'ai pas encore eu de clients de manière régulière",
      "Je consomme plus de formations que je ne passe à l'action"
    ],
    recoTitre: "Recommandations pour le <my>niveau #1</my>",
    recos: [
      "<mb><b>Vise 10 clients à 1000€, pas 100 clients à 100€</b></mb><b> : </b>Une offre haut de gamme est plus simple à vendre qu'une offre pas chère. Tu n'as besoin que de 10 personnes pour atteindre 10 000€.",
      "<mb><b>Choisis UN modèle, UNE offre, UN canal</b></mb><b> : </b>La plupart des gens perdent 2 ans à zapper d'une idée à l'autre (prestation, formation, coaching…). Décide une fois, et tiens-toi-y 12 mois.",
      "<mb><b>Tes connaissances ont déjà de la valeur</b></mb><b> : </b>Tu en sais plus que tu ne le crois. Quelqu'un est prêt à te payer 1000€ aujourd'hui pour ce que tu sais déjà faire.",
      "<mb><b>Mets en place le système TFCV dès le premier jour</b></mb><b> : </b>Trafic → Filtre → Conversion → Vente. Ne construis pas un business qui dépend de toi pour aller chercher chaque client à la main.",
      "<mb><b>Décide de ne PAS prospecter</b></mb><b> : </b>Construis dès le départ un système où les clients viennent à toi (publicité ciblée + tunnel + appel). Pas de DM, pas de cold call.",
      "<mb><b>Crée une offre simple à livrer, avec beaucoup de marge</b></mb><b> : </b>Pas un produit complexe avec 47 modules. Une transformation claire, livrée simplement. Format : formation, consulting, ou prestation cadrée.",
      "<mb><b>Arrête de consommer, commence à publier</b></mb><b> : </b>Chaque heure sur une formation que tu n'appliques pas est une heure perdue. Le marché récompense ceux qui agissent, pas ceux qui savent.",
      "<mb><b>Accepte d'être imparfait pour démarrer</b></mb><b> : </b>Le perfectionnisme est exactement ce qui doit mourir à ce niveau. Lance ton offre avant qu'elle ne soit \"prête\"."
    ],
    videos: [
      {
        id: "vZiIhfhX7h8",
        titre: "Comment je gagnerais 10 000€ par mois en 2026 si je devais recommencer"
      },
      {
        id: "XTp3Gs42bWw",
        titre: "Vos premiers 10K€ /mois  : L’art de simplifier"
      },
      {
        id: "DBMnEgZhS1Y",
        titre: "Vendre à 3 000€ est plus FACILE que vendre à 300€ — voici pourquoi"
      },
      {
        id: "RerhPNDtE3o",
        titre: "Si je devais refaire mon business en 2026, je ne vendrais jamais sous 2 000€"
      }
    ],
    temoignages: [
      "s3npr5izhy",
      "tvy3jbhml9",
      "4lkp9f6lm4",
      "9a6g6hsyzp",
      "abj3v8v8ek",
      "rtil6qeznq"
    ]
  },
  {
    n: 2,
    emoji: "🚀",
    titre: "Niveau #2 : Le décollage de 10 000€ à 50 000€ par an",
    court: "Le décollage",
    cases: [
      "J'ai eu mes premiers clients, je sais que ça peut marcher",
      "J'ai un système qui commence à tourner, mais je n'investis pas vraiment dedans",
      "J'ai peur de la publicité, je teste avec des budgets minuscules (5€/jour, 10€/jour)",
      "Je ne crée pas de contenu, ou alors de manière très irrégulière",
      "Je dépends d'une seule source de clients (un seul réseau, un seul canal)",
      "Je sens que je pourrais aller plus vite, mais quelque chose me retient",
      "Je suis encore très impliqué dans la livraison de chaque client"
    ],
    recoTitre: "Recommandations pour le niveau #2",
    recos: [
      "<mb><b>Augmente progressivement ton budget pub</b></mb><b> : </b>Passe de 5€/jour à 50€/jour, puis 100€/jour. Plus de cannes à pêche = plus de poissons.",
      "<mb><b>Mesure ton ROAS, pas seulement ton chiffre d'affaires</b></mb><b> : </b>Si tu mets 1€ et tu sors 5€, scale. Si c'est 1 pour 2, optimise avant de scaler.",
      "<mb><b>Démarre ta création de contenu maintenant</b></mb><b> : </b>Choisis UN format (YouTube long, Instagram court, ou LinkedIn) et publie au moins 1 fois par semaine. Pas avant, pas plus.",
      "<mb><b>Augmente tes prix</b></mb><b> : </b>Au Niveau 2, vendre à 3 000€ est plus simple que vendre à 300€. Tes premiers clients t'ont validé, ton offre vaut plus cher.",
      "<mb><b>Diversifie une source à la fois</b></mb><b> : </b>N'ouvre pas LinkedIn + YouTube + Insta + TikTok en même temps. Maîtrise un canal avant d'en ajouter un autre.",
      "<mb><b>Renforce ton tunnel</b></mb><b> : </b>VSL, page de capture, page de prise de RDV. Un tunnel propre vaut mieux qu'un tunnel beau.",
      "<mb><b>Embauche un closer si tu fais beaucoup d'appels</b></mb><b> : </b>C'est ton premier vrai goulot d'étranglement.",
      "<mb><b>Documente tout ce que tu fais</b></mb><b> : </b>Tu ne pourras pas déléguer plus tard si rien n'est écrit."
    ],
    videos: [
      {
        id: "oR46qCwIxWI",
        titre: "4 choses que vous devez entendre pour atteindre 20K€ par mois"
      },
      {
        id: "9tzUybv10nA",
        titre: "Stratégie complète de création de contenu pour 2026"
      },
      {
        id: "xVe0-5eVtQA",
        titre: "Faire 15K€ rapidement : 3 solutions efficaces"
      },
      {
        id: "50tlspFPx9A",
        titre: "Un simple business model à 100 000€ /an pour 2026"
      }
    ],
    temoignages: [
      "f2ie1v99b8",
      "ive07co9xm",
      "2vtsinplyx",
      "2xege6bt0u"
    ]
  },
  {
    n: 3,
    emoji: "🎯",
    titre: "Niveau #3 : Focus de 50 000€ à 100 000€ par an",
    court: "Le focus",
    cases: [
      "Je suis sous l'eau, je travaille tout le temps, souvent le week-end",
      "Je n'arrive pas à dire non — j'accepte presque tout ce qui se présente",
      "J'ai plusieurs projets en parallèle qui me dispersent",
      "Mon business dépend 100% de moi : si je m'arrête une semaine, tout s'arrête",
      "Je sens un début de burnout, ou j'y suis déjà",
      "Je sais ce que je devrais arrêter, mais je n'arrive pas à lâcher"
    ],
    recoTitre: "Recommandations pour le niveau #3",
    recos: [
      "<mb><b>Tue tout ce qui n'est pas ton offre principale</b></mb><b> : </b>Projets parallèles, side hustles, formations annexes. Une seule chose à 100%.",
      "<mb><b>Apprends à dire non</b></mb><b> : </b>À 50K€/an, tu peux refuser des clients qui ne correspondent pas. Choisis qui tu sers.",
      "<mb><b>Prends UNE décision all-in</b></mb><b> : </b>Si tu as encore un emploi, du freelance, ou une autre activité : décide de tout miser sur ton business. Le focus paie.",
      "<mb><b>Mets en place tes premiers vrais systèmes</b></mb><b> : </b>Intégration client, processus de livraison, suivi. Ce qui était fait à la main au Niveau 2 doit être documenté au Niveau 3.",
      "<mb><b>Embauche ton premier vrai membre d'équipe ou freelance</b></mb><b> : </b>Un assistant, un closer, ou un ops. Pas pour économiser ton temps : pour libérer ton mental.",
      "<mb><b>Surveille ton corps et ta tête</b></mb><b> : </b>Le burn-out arrive ici. Sport, sommeil, coupures du téléphone. Tu ne tiendras pas 1M€ dans cet état.",
      "<mb><b>Coupe le bruit</b></mb><b> : </b>Moins de WhatsApp business, moins de communautés Slack, moins de podcasts. Plus de profondeur, moins de surface.",
      "<mb><b>Réfléchis par toi-même</b></mb><b> : </b>Moins de gourous, moins de lives, moins de contenu consommé. Plus d'analyse de tes propres chiffres."
    ],
    videos: [
      {
        id: "3WOSBCmwFk0",
        titre: "Comment passer de 0€ à 50 000€/mois avec UNE seule méthode (étude de cas)"
      },
      {
        id: "iw9uzOkWx68",
        titre: "Comment j'ai trouvé mon équilibre dans le business (après un burn-out)"
      },
      {
        id: "6YZ85a8ObQM",
        titre: "Pourquoi j’allais mal… et comment j’ai inversé la tendance"
      },
      {
        id: "-V15AxRNAK0",
        titre: "Mes leçons business à 10K€, 50K€ et 100K€ par mois"
      }
    ],
    temoignages: [
      "b5taio9plc",
      "fbtr4dqoji"
    ]
  },
  {
    n: 4,
    emoji: "🏗️",
    titre: "Niveau #4 : La profondeur de 100 000€ à 1 000 000€ par an",
    court: "La profondeur",
    cases: [
      "Mon business tourne, mais je suis encore impliqué dans presque toutes les décisions",
      "Je n'ai qu'une seule offre et j'ai du mal à en imaginer d'autres",
      "Je cours après de nouveaux clients au lieu de mieux servir ceux que j'ai déjà",
      "Je n'arrive pas à déléguer — je pense que personne ne fera aussi bien que moi",
      "Mon équipe est trop petite, ou inexistante",
      "Je ne sais pas quel est le prochain problème de mes clients que je peux résoudre"
    ],
    recoTitre: "Recommandations pour le niveau #4",
    recos: [
      "<mb><b>Arrête de courir après de nouveaux clients</b></mb><b> : </b>Concentre-toi sur ceux que tu as déjà. Ils valent 5x plus que les inconnus.",
      "<mb><b>Identifie le prochain problème de tes clients</b></mb><b> : </b>Quand ils ont fini ton offre, qu'est-ce qu'il leur reste à régler ? C'est ta prochaine offre.",
      "<mb><b>Construis un écosystème de 2-3 offres, pas plus</b></mb><b> : </b>Trop d'offres tue la clarté. Une offre d'entrée, une offre principale, une offre d'élite.",
      "<mb><b>Recrute pour les compétences que tu n'as pas</b></mb><b> : </b>Pas seulement pour décharger. Un vrai responsable marketing, un vrai responsable opérations, pas que des assistants.",
      "<mb><b>Sors progressivement de la “livraison”</b></mb><b> : </b>Délègue d'abord ce où tu es le moins indispensable, puis remonte progressivement vers le cœur.",
      "<mb><b>Investis dans les outils et les systèmes</b></mb><b> : </b>CRM, automatisation marketing, tableaux de bord. Le manuel ne tient pas à 100K€/mois.",
      "<mb><b>Travaille SUR ton business, pas DANS</b></mb><b> : </b>Bloque 1 jour par semaine dédié à la stratégie. Pas de réunion, pas de Slack.",
      "<mb><b>Construis ta marque personnelle sérieusement</b></mb><b> : </b>Au Niveau 4, ton nom devient un actif. C'est ce qui fera la différence pour le Niveau 5."
    ],
    videos: [
      {
        id: "3LalZXTo218",
        titre: "Les entrepreneurs à 100K€/mois font 3 actions précises (que tu ne fais pas)"
      },
      {
        id: "baJcGKBycQc",
        titre: "Étape par étape comment j'ai gagné mon premier million (copiez-moi)"
      },
      {
        id: "UuW31hpVaVQ",
        titre: "Je vends mon consulting 6K€ /mois et je suis “Sold Out” (voici pourquoi)"
      },
      {
        id: "xja-JPNuFSA",
        titre: "Comment créer un business en ligne incroyablement stable et profitable"
      }
    ],
    temoignages: [
      "rgio4y4o8f",
      "j0vbkt570k",
      "vtfaka0m80",
      "gcfo8miafe",
      "8de9q4ed4l",
      "1db8el08jl",
      "755btwnbr4",
      "i8j0mw0ddt"
    ]
  },
  {
    n: 5,
    emoji: "💎",
    titre: "Niveau #5 : La valorisation jusqu’à +1 000 000€ par an",
    court: "La valorisation",
    cases: [
      "Mon business dépend trop de moi pour être vendable un jour",
      "Je n'ai pas construit d'écosystème autour de mon offre principale",
      "Je n'ai jamais vraiment réfléchi à ce que je veux à terme (vendre, transmettre, garder)",
      "Mon audience est une force, mais je ne sais pas comment en faire un actif solide",
      "Je n'ai pas d'équipe vraiment autonome capable de faire tourner le business sans moi"
    ],
    recoTitre: "Recommandations pour le niveau #5",
    recos: [
      "<mb><b>Construis des actifs séparables de toi</b></mb><b> : </b>Un SaaS (logiciel), une marque, une communauté. Pas juste ton expertise personnelle.",
      "<mb><b>Construis une équipe vraiment autonome</b></mb><b> :  </b>Elle doit pouvoir prendre 80% des décisions sans toi. Test : pars 1 mois en vacances et vois ce qui casse. C’est le plus difficile à faire, mais ce qui t’apporte le plus de liberté.",
      "<mb><b>Crée plusieurs lignes de revenus</b></mb><b> : </b>Formation, SaaS, communauté, affiliation. Une seule ligne = un seul actif fragile.",
      "<mb><b>Pense comme un acheteur dès maintenant</b></mb><b> : </b>Qu'est-ce qu'un repreneur achèterait : une audience, une équipe, un produit ? Construis cet actif-là.",
      "<b>Sépare les marques : </b>Ta personne ≠ ton business ≠ ton produit. Trois entités séparées = trois actifs vendables.",
      "<mb><b>Construis ce qu'on peut projeter</b></mb><b> : </b>Un acheteur n'achète pas une performance passée, mais la promesse d'une performance future. Construis cette promesse-là.",
      "<b>Investis ailleurs : </b>Immobilier, actions, autres business. Ton activité ne doit pas être ton seul filet de sécurité."
    ],
    videos: [
      {
        id: "byGmvilJeWg",
        titre: "Pourquoi j’ai déconstruit mon business à 100 000€ par mois"
      },
      {
        id: "gRq_tL-ExJ4",
        titre: "Comment j’ai scalé mon business Infopreneur à 7 chiffres"
      }
    ],
    temoignages: []
  }
];

export const exerciceNiveaux: BlocNiveaux[] = [
  {
    type: "h2",
    texte: "Exercice : quel est ton niveau ?"
  },
  {
    type: "p",
    texte: "Parmi les niveaux listés ci-dessus, à quel niveau penses-tu appartenir ?"
  },
  {
    type: "reponse",
    id: "ex-niveau",
    question: null
  },
  {
    type: "h2",
    texte: "Ce que tu fais qui ne correspond pas à ton niveau ?"
  },
  {
    type: "p",
    texte: "C'est ici que la plupart des gens se plantent. Ils utilisent des actions qui sont faites pour deux niveaux au-dessus du leur. Réponds honnêtement, en quelques phrases :"
  },
  {
    type: "reponse",
    id: "ex-actions",
    question: "<b>Quelles actions d'un niveau plus haut essaies-tu d'utiliser, alors que tu n'as pas encore les bases de ton niveau actuel ?</b>"
  },
  {
    type: "reponse",
    id: "ex-responsabilites",
    question: "<b>Quelles responsabilités de ton niveau actuel évites-tu de prendre ?</b>"
  },
  {
    type: "reponse",
    id: "ex-copier",
    question: "<b>Qui es-tu en train de copier (t’inspirer) en ce moment, et pourquoi ?</b>"
  },
  {
    type: "h2",
    texte: "Ton blocage principal"
  },
  {
    type: "p",
    texte: "Choisis <b>UN SEUL</b> blocage. Celui qui te parle le plus."
  },
  {
    type: "cases",
    groupe: "blocage",
    items: [
      "<mb><b>La preuve par l'action</b></mb> : j'hésite, je remets, je n'ose pas vraiment me lancer <i>(Niveau 1)</i>",
      "<mb><b>Le passage à l'échelle</b></mb> : j'ai peur d'investir en publicité et de me montrer <i>(Niveau 2)</i>",
      "<mb><b>Le grand tri</b></mb> : je n'arrive pas à dire non, à supprimer, à choisir <i>(Niveau 3)</i>",
      "<mb><b>La délégation</b></mb> : je n'arrive pas à lâcher, à faire confiance à une équipe <i>(Niveau 4)</i>",
      "<mb><b>La construction d'actifs</b></mb> : je ne sais pas quoi construire au-delà de mon offre <i>(Niveau 5)</i>"
    ]
  },
  {
    type: "h2",
    texte: "La vraie peur derrière"
  },
  {
    type: "cases",
    groupe: "peur",
    items: [
      "Peur de ne pas être <mb>légitime</mb>",
      "Peur <mb>d'investir</mb> de l'argent",
      "Peur d'être <mb>visible</mb>",
      "Peur de <mb>perdre le contrôle</mb>",
      "Peur de <mb>casser</mb> ce qui fonctionne déjà"
    ]
  },
  {
    type: "h2",
    texte: "Ce qui te bloque"
  },
  {
    type: "cases",
    groupe: "bloque",
    items: [
      "Je <mb>ne sais pas quoi faire</mb>, ni par où commencer",
      "Je sais quoi faire, mais <mb>je n'arrive pas à prioriser</mb>",
      "Je ne fais <mb>pas vraiment confiance</mb> à mon propre diagnostic",
      "J'ai besoin d'aide pour <mb>ordonner</mb> mes prochaines étapes",
      "J'ai <mb>peur de casser</mb> ce qui fonctionne déjà",
      "Je <mb>repousse une décision importante</mb> depuis trop longtemps"
    ]
  },
  {
    type: "p",
    texte: "Si tu coches <b>2 cases ou plus</b>, c'est probablement le bon moment pour qu'on en parle."
  },
  {
    type: "h2",
    texte: "Deux versions de toi"
  },
  {
    type: "p",
    texte: "Dans laquelle de ces deux colonnes ci-dessous te retrouves-tu le plus ? Si tu es es dans la colonne de l’entrepreneur(e) épuisé : tu as besoin d’aide."
  },
  {
    type: "tableau",
    lignes: [
      [
        "",
        "<b>😓 Entrepreneur(e) épuisé(e)</b>",
        "<b>😎 Entrepreneur(e) libre</b>"
      ],
      [
        "<b>Travail</b>",
        "Tu travailles plus chaque mois pour gagner pareil",
        "Ton business grandit pendant que tu dors"
      ],
      [
        "<b>Dépendance</b>",
        "Le business dépend 100% de toi",
        "Le système tourne sans toi"
      ],
      [
        "<b>Agenda</b>",
        "Plein d'urgences, pas de temps libre",
        "Léger, axé sur les décisions importantes"
      ],
      [
        "<b>Clients</b>",
        "Tu cours après de nouveaux clients",
        "Les clients viennent à toi"
      ],
      [
        "<b>Offres</b>",
        "Confuses ou trop nombreuses",
        "Une seule, claire, premium"
      ],
      [
        "<b>Argent</b>",
        "Tu hésites avant chaque dépense",
        "Tu investis pour gagner plus"
      ],
      [
        "<b>Croissance</b>",
        "Travailler plus dur",
        "Mieux travailler"
      ]
    ]
  },
  {
    type: "h2",
    texte: "Ta prochaine étape : réserve un appel gratuit"
  },
  {
    type: "p",
    texte: "Si tu t'es reconnu dans ce document, tu es exactement le genre de personne que l'on sait aider et avec qui on prend plaisir à travailler. Aujourd'hui, aider des personnes à se lancer dans l'entrepreneuriat en ligne et à développer leur entreprise est ce que l'on sait faire de mieux chez Funnels Club.  Voici ce que je te propose :"
  },
  {
    type: "liste",
    items: [
      "<mb>Identifie le niveau</mb> auquel tu es aujourd’hui à l’aide de ce document.",
      "Identifie ce qui te <mb>bloque</mb> le plus, et les <mb>peurs</mb> qui te retiennent.",
      "Identifie <mb>le type d’entrepreneur(e)</mb> dans lequel tu te reconnais le plus.",
      "Réserver ton appel, et présente nous tous ces éléments."
    ]
  },
  {
    type: "p",
    texte: "Lors de cet appel, nous allons débloquer ce qui t’empêche d’avancer (que l’on décide de travailler ensemble ou pas), l’idée étant que tu repartes avec un maximum de valeur."
  },
  {
    type: "bouton"
  },
  {
    type: "p",
    texte: "Même si cet appel est “offert” nous avons conscience qu’il n’est pas “gratuit” pour toi, car il demande que tu sois disponible et que tu nous accordes ton temps. C’est pourquoi nous prendrons sincèrement le temps de t’aider : tu auras réponses à tes questions, et un plan d’action pour ENFIN avancer, et vivre de ton expertise en ligne."
  },
  {
    type: "p",
    texte: "Ce document te dit où tu en es. Cet appel te dira comment passer au niveau d’après."
  },
  {
    type: "citation",
    texte: "<i>Tu n'as pas un problème de compétences. Tu n'as pas un problème de visibilité. Tu as un problème de système. </i>"
  }
];

/** Le libellé du bouton d’appel, de Rémy, recopié de sa page. */
export const boutonAppelNiveaux = "Clique ici pour réserver ton \"appel stratégique\" (gratuit) (sans pression)";
