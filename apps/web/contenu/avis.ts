/**
 * Les avis, un article par témoignage vidéo.
 *
 * **Ce fichier est le seul du dépôt dont le texte n'a pas été écrit par
 * Rémy**, et c'est une décision explicite de sa part : « l'idée, c'est vraiment
 * de faire un grand article de blog [...] basé sur la transcription ». La règle
 * du projet reste la règle partout ailleurs.
 *
 * **Ce qui encadre cette exception, et qui n'est pas négociable :**
 *
 * - **Aucun fait, aucun chiffre, aucune date qui ne soit dans la
 *   transcription.** Chaque phrase de ces articles est traçable à un passage de
 *   l'entretien. Rien n'est déduit, rien n'est arrondi, rien n'est complété par
 *   ce qui « devait sûrement » être le cas.
 * - **Les citations sont au mot près**, prises dans la transcription Wistia. Ce
 *   qui y a été corrigé : la ponctuation, que la reconnaissance vocale pose au
 *   hasard, et les répétitions d'oral (« je je je »). Jamais un mot remplacé.
 * - **Les articles racontent, ils ne vendent pas.** Un superlatif que le client
 *   n'a pas prononcé est une invention comme une autre.
 *
 * **À VALIDER PAR RÉMY, un par un.** Ces pages parlent de personnes réelles et
 * de leurs revenus. Lui seul sait ce que chacune a accepté de rendre public,
 * quels chiffres sont encore exacts, et quels noms de famille peuvent
 * s'afficher.
 *
 * **Les titres portent les mots que les gens tapent.** C'est la seule liberté
 * que ce fichier prend avec le récit : un `h2` littéraire, « Mille kilomètres par
 * semaine », ne se cherche pas ; « Avant le tunnel de vente : mille kilomètres
 * par semaine pour former des artisans » raconte la même chose et existe pour un
 * moteur. Les mots visés sont ceux du sujet, tunnel de vente, formation en
 * ligne, avis Funnels Club, plus le métier de la personne, et ils ne sont jamais
 * empilés : un titre qui ne se lit plus à voix haute est un titre raté, quel que
 * soit son rendement.
 *
 * **Les liens s'écrivent dans le texte**, en `[libellé](adresse)`. C'est là
 * qu'une ancre porte du sens, pour un lecteur comme pour un moteur : un lien
 * posé au milieu d'une phrase dit de quoi parle la page d'arrivée, une liste de
 * liens en bas de page ne dit rien. Les adresses sortantes portent leur balise
 * `?el=site`, sans quoi la vente est attribuée ailleurs ; voir la règle Hyros
 * dans `AGENTS.md`. Le rendu est dans `TexteLie`.
 *
 * Les transcriptions sont celles du dossier « Témoignages » de Wistia, en
 * français, validées et non brouillonnes. Elles restent chez Wistia : ce fichier
 * ne garde que ce qui est publié.
 */

/** Un passage cité, avec qui le dit. */
export type Citation = {
  texte: string;
  /** Le prénom de qui parle. Rémy pose les questions, le client répond. */
  qui: string;
};

export type SectionAvis = {
  titre: string;
  /** Les paragraphes de la section, dans l'ordre. */
  paragraphes: readonly string[];
  /** La citation qui clôt la section, s'il y en a une. */
  citation?: Citation;
};

/** Un tour de parole de la transcription. */
export type TourDeParole = {
  /** Le prénom de qui parle. */
  qui: string;
  texte: string;
};

export type Avis = {
  /** L'identifiant Wistia, qui relie l'article à sa vidéo et à son affiche. */
  id: string;
  /** Le dernier segment de l'URL : `/resultats/<slug>`. */
  slug: string;
  /** Le `h1` de la page, et le titre de sa carte sur `/resultats`. */
  titre: string;
  /**
   * Le `title` de l'onglet, plus court que le `h1`.
   *
   * Les deux ne font pas le même travail. Le `h1` s'adresse à quelqu'un qui est
   * déjà sur la page et peut courir sur deux lignes ; le `title` s'affiche dans
   * une liste de résultats qui coupe autour de soixante caractères, et le
   * gabarit du site lui ajoute encore « · Rémy Jupille ». Un `h1` de cent dix
   * caractères recopié là devient une phrase tronquée au milieu d'un mot.
   */
  titrePage: string;
  /** La méta-description. Entre 120 et 160 caractères, voir `AGENTS.md`. */
  description: string;
  /**
   * La description de l'affiche de la vidéo.
   *
   * C'est la seule image de la page, et un `alt` vide y serait une occasion
   * perdue : deux personnes en entretien, ça se décrit. Ni « image de » ni
   * « photo de », qui ne disent rien de plus qu'une balise `img`.
   */
  afficheAlt: string;
  /** Le chapô, sous le titre. Deux phrases au plus. */
  chapo: string;
  sections: readonly SectionAvis[];
  /**
   * L'entretien en entier, tour de parole par tour de parole, sous l'article.
   *
   * **Elle est nettoyée, et il le fallait.** La transcription brute de Wistia
   * écrit « Rémi Jupil », coupe les phrases au milieu et répète « je je je ». Un
   * moteur indexe très bien un texte replié, donc mille mots de plus par page
   * sur le bon sujet valent quelque chose ; quinze pages de reconnaissance
   * vocale brute, elles, ont l'air automatiques, et c'est exactement ce que les
   * signaux de contenu utile cherchent. Le gain en mots serait payé en
   * crédibilité, sur les pages qui portent les avis clients.
   *
   * **Ce qui est corrigé, et rien d'autre :** les noms propres que la machine
   * écorche, la ponctuation qu'elle pose au hasard, les répétitions d'oral, et
   * les nombres écrits en lettres. Les tours de parole sont rendus à qui les
   * dit. Aucun mot n'est remplacé, aucune phrase n'est reformulée : ce qui est
   * mal dit reste mal dit, c'est de la parole.
   *
   * C'est aussi ce que les conventions du projet réclament depuis le début pour
   * toute vidéo qui porte le message d'une page. Avant d'être du référencement,
   * c'est de l'accessibilité : c'est le seul texte qu'un lecteur d'écran, ou un
   * robot, peut lire dans une vidéo.
   */
  transcription: readonly TourDeParole[];
};

export const avis: readonly Avis[] = [
  {
    id: "rgio4y4o8f",
    slug: "roland-buffet",
    titre:
      "Avis Funnels Club : Roland Buffet, 109 778 € en six mois avec un tunnel de vente dans le BTP",
    titrePage: "Avis Funnels Club : Roland Buffet, 109 778 € en 6 mois",
    description:
      "Roland Buffet forme les entreprises du bâtiment. Il raconte comment il a vendu 109 778 € de formation en ligne en six mois avec un tunnel de vente.",
    afficheAlt:
      "Roland Buffet en entretien vidéo avec Rémy Jupille, chacun depuis son bureau",
    chapo:
      "Roland Buffet forme les entreprises du bâtiment à la gestion depuis plus de treize ans. Dans cet entretien avec Rémy Jupille, il raconte comment il est passé de mille kilomètres de voiture par semaine à une formation en ligne vendue par un tunnel de vente.",
    sections: [
      {
        titre:
          "Avant le tunnel de vente : mille kilomètres par semaine pour former des artisans",
        paragraphes: [
          "Roland a d'abord été militaire de carrière. Il a ensuite repris l'entreprise de charpente de son père, qui était celle de son grand-père, puis en a créé deux ou trois autres. De ce parcours, il a tiré une expertise qu'il a voulu transmettre à d'autres entreprises du bâtiment : depuis plus de treize ans, il les accompagne sur la partie gestion, et non sur le métier.",
          "Il y a trois ans, il crée sa propre entreprise pour être libre de son temps, de sa stratégie et de ses choix, après une période de salariat dans la formation. C'est là qu'il se heurte au mur : pour être performant auprès de ses clients, il fallait être présent. Et être présent, dans son métier, ==ça se comptait en kilomètres==.",
        ],
        citation: {
          texte:
            "Être présent auprès de mes clients, ça représentait en gros mille kilomètres par semaine en voiture.",
          qui: "Roland",
        },
      },
      {
        titre:
          "Les fausses croyances qui empêchent de digitaliser une expertise du bâtiment",
        paragraphes: [
          "Roland savait qu'il voulait servir plus d'artisans. Il ne savait pas encore que la réponse serait digitale, et deux croyances l'en éloignaient. La première : ==dans le bâtiment, on ne peut pas travailler en digitalisé==, parce que les artisans ne seraient ni équipés ni réceptifs. La seconde : dans la formation, tout passe par les financements d'État, et commercialiser sans eux paraissait impossible.",
          "Il le dit lui-même, il était alors à peu près seul dans son domaine à croire à ce qu'il voulait faire. Ce qu'il visait, c'était de faire tomber la barrière géographique : installé en Savoie, il trouvait dommage d'être limité par sa zone et sa capacité de déplacement.",
        ],
        citation: {
          texte:
            "Aujourd'hui, je le sais que c'était une fausse croyance, mais avant, je ne le savais pas forcément.",
          qui: "Roland",
        },
      },
      {
        titre:
          "Comment Roland a découvert Funnels Club et les tunnels de vente",
        paragraphes: [
          "Roland prépare un marathon. Il court, beaucoup, et il écoute des podcasts en s'entraînant. C'est comme ça qu'il tombe sur [le podcast de Rémy](/podcast), et qu'il commence à se dire qu'il y a peut-être quelque chose du côté des tunnels de vente.",
          "Ce qui suit ressemble à son caractère : il analyse. Les réseaux, les avis, tout ce qu'il pouvait croiser, il l'a croisé, et il a passé beaucoup de temps à observer de loin avant de prendre le fameux appel téléphonique. Sa question n'était pas le prix, qu'il assume dès lors qu'il y a un retour sur investissement, mais de savoir vers qui il allait.",
        ],
        citation: {
          texte:
            "J'ai beaucoup cherché, et j'ai vu en toi quelqu'un de simple, d'accessible et d'honnête. C'était surtout ça.",
          qui: "Roland",
        },
      },
      {
        titre:
          "Cinq mois pour structurer sa formation en ligne et son tunnel de vente",
        paragraphes: [
          "Roland n'a pas cherché à aller vite, il a cherché à faire bien. Deux mois de découverte complète, où il se décrit perdu, puis la structuration de la formation et de l'offre. ==Cinq mois en tout avant de commercialiser quoi que ce soit.==",
          "Sa chaîne YouTube démarre le 15 septembre. La commercialisation de son programme, BTP Performance, commence début novembre. Il insiste sur un point : rien n'est magique, le travail reste chez lui, et il faut de la ténacité. Ce qu'il a trouvé, ce n'est pas un raccourci, c'est une méthode à appliquer : celle que Rémy détaille dans [sa formation gratuite sur le tunnel de vente](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Il suffit d'être rigoureux, il suffit de faire ce que vous dites. C'est con à dire, mais à ce moment-là, on avance.",
          qui: "Roland",
        },
      },
      {
        titre:
          "Ses résultats : 109 778 € de chiffre d'affaires en six mois de commercialisation",
        paragraphes: [
          "De début novembre au jour de l'entretien, Roland annonce ==109 778 € de chiffre d'affaires==. Il donne le chiffre au centime, précisant qu'il a le tableau devant lui au moment où il le dit. Son objectif sur l'année est de ==250 000 €==, et il ne lâche pas l'idée du million.",
          "Ce qui le frappe, c'est le caractère mathématique de la chose : une fois l'équation trouvée pour faire cent mille, puis deux cent cinquante mille, la suite ne peut aller que dans ce sens. Il ajoute une condition, et elle compte : ==il connaît son métier, il a une vraie expertise==. Sans elle, il n'aurait vendu que du vent. C'est ce que montrent aussi [les autres témoignages de membres](/resultats), dans des domaines qui n'ont rien à voir avec le bâtiment.",
        ],
        citation: {
          texte:
            "C'est incroyable comme c'est mathématique finalement. Si tu fais ce qu'il faut faire, que tu appliques ce qu'il faut appliquer, et que tu connais ton métier.",
          qui: "Roland",
        },
      },
      {
        titre:
          "Ce que vendre une formation en ligne a changé dans son quotidien",
        paragraphes: [
          "==Roland travaille désormais de chez lui.== Il parle de ses enfants, qu'il n'a pas vraiment vu grandir et avec qui il peut maintenant être, de clients partout en France, et de la sensation d'être utile de partout. Il pose une seule limite à son territoire, la francophonie, faute de parler anglais.",
          "Il y a une suite qu'il n'attendait pas : son fils s'est intéressé au monde numérique en voyant son père s'y lancer, s'est mis au montage vidéo, et ils travaillent à faire peut-être du closing ensemble.",
        ],
        citation: {
          texte:
            "Il y a une synergie familiale en plus qui est en train de se créer, et qui m'éclate.",
          qui: "Roland",
        },
      },
      {
        titre:
          "Son avis sur Funnels Club, pour ceux qui hésitent encore",
        paragraphes: [
          "Rémy lui pose la question franchement : que dire à quelqu'un qui regarde cette vidéo, sceptique, et qui hésite à réserver un appel. La réponse de Roland ne cherche pas à rassurer.",
          "Il donne raison à celui qui doute. Qu'il hésite, qu'il fouille, qu'il cherche, qu'il aille au bout de sa peur. Parce qu'au bout, dit-il, il découvrira qu'il n'y a pas de piège. L'appel dont il parle est [l'appel découverte de Funnels Club](https://www.funnels.club/appel?el=site), et il est gratuit.",
        ],
        citation: {
          texte:
            "Elle a raison de s'inquiéter, parce qu'il y a beaucoup de marlous dans ce domaine. Et quand elle aura fini de s'inquiéter, elle prendra cet appel, et cet appel peut changer véritablement beaucoup de choses dans sa vie.",
          qui: "Roland",
        },
      },
    ],
    transcription: [
      {
        qui: "Rémy",
        texte:
          "Salut Roland, merci beaucoup d'avoir accepté mon invitation. Aujourd'hui, je voudrais parler un petit peu avec toi du parcours que tu as eu, et des résultats que tu as eus avec ton activité. Est-ce que tu pourrais rapidement partager qui tu es, ce que tu fais, dans quel domaine tu es, ce que tu proposes ?",
      },
      {
        qui: "Roland",
        texte:
          "Merci à toi déjà de me proposer de témoigner, parce que je suis content de le faire au vu des résultats que j'ai obtenus et de la qualité de ton programme. Moi, je m'appelle Roland Buffet. J'ai une première vie de militaire de carrière, ensuite j'ai repris l'entreprise de charpente de mon père, qui était celle de mon grand-père aussi. J'ai créé moi-même deux ou trois autres entreprises, j'ai eu des hauts et des bas, et à l'issue de tout ça, j'ai voulu transmettre cette expertise et cette expérience à d'autres entreprises dans le monde du bâtiment. Depuis maintenant plus de treize ans, quatorze ans, j'accompagne les entreprises du bâtiment dans la partie gestion, pas dans la partie métier mais dans la partie gestion d'entreprise.",
      },
      {
        qui: "Rémy",
        texte:
          "Et donc nous, ça fait combien de temps aujourd'hui qu'on travaille ensemble ?",
      },
      {
        qui: "Roland",
        texte:
          "Ça va faire un an à peu près. Un an que j'ai commencé le programme, et on va dire que le tunnel est opérationnel depuis six mois.",
      },
      {
        qui: "Rémy",
        texte:
          "Tu avais démarré cette activité il y a trois ou quatre ans. Qu'est-ce qui a fait que tu as voulu développer les tunnels de vente pour ton activité, qu'est-ce qui t'a attiré dans tout ça ?",
      },
      {
        qui: "Roland",
        texte:
          "Effectivement, il y a trois ans, j'ai créé ma propre entreprise pour pouvoir être totalement libre de mon temps, de ma stratégie et de mes choix, plutôt que d'être salarié, parce que j'ai fait une période en tant que salarié dans ce domaine de la formation. Et en fait, je me suis rendu compte que pour être performant, il fallait être présent auprès de mes clients. Et présent auprès de mes clients, ça représentait en gros mille kilomètres par semaine en voiture. Donc je me suis dit que je pouvais servir plus de monde, être utile à plus d'artisans, à plus de personnes, en digitalisant. C'est-à-dire en gardant le contrôle de mon temps, en enlevant ce temps perdu en voiture, et en digitalisant mon offre pour être plus efficient sur un même créneau.",
      },
      {
        qui: "Rémy",
        texte:
          "Qu'est-ce qui a été pour toi le problème avant que tu nous rejoignes ? C'était quoi, le problème, pour digitaliser ton activité ?",
      },
      {
        qui: "Roland",
        texte:
          "C'est déjà les fausses croyances. Aujourd'hui, je le sais que c'était une fausse croyance, mais avant, je ne le savais pas forcément. La fausse croyance que dans le monde du bâtiment, par exemple, on ne peut pas travailler en digitalisé, puisque les artisans ne sont pas équipés ou ne sont pas réceptifs à ça. Le fait aussi de commercialiser une offre sans financement : dans le monde de la formation, il y a beaucoup de financements d'État, et pouvoir commercialiser sans financement, ça paraissait impossible. Enfin, moi j'étais quasiment le seul dans ce domaine à croire à ce que je voulais faire. L'idée, c'était de faire péter la barrière géographique : je suis en Savoie, je voulais pouvoir servir un maximum d'artisans et je trouvais ça dommage d'être limité par ma zone géographique et ma capacité de déplacement.",
      },
      {
        qui: "Rémy",
        texte:
          "Tu avais déjà essayé des choses sur la partie digitale avant qu'on travaille ensemble, ou vraiment ça démarrait de zéro ?",
      },
      {
        qui: "Roland",
        texte:
          "Non. J'ai passé beaucoup de temps à scanner comment j'allais arriver à faire ce que j'avais pour idée de faire. En fait, je ne savais pas que je voulais faire du digital. Ce que je savais, c'est que je voulais servir plus d'artisans, mais je ne savais pas comment. Et un jour, je suis tombé… je fais pas mal de sport, et donc en courant, je m'entraînais pour faire un marathon, pour être clair. Et je suis tombé sur ton podcast. J'ai commencé à l'écouter au fur et à mesure de mes entraînements, et c'est là qu'en t'écoutant, je me suis dit : tiens, il y a peut-être un truc dans ce domaine-là, en tout cas dans les tunnels de vente.",
      },
      {
        qui: "Rémy",
        texte:
          "Et qu'est-ce qui a fait que tu as voulu travailler avec moi et l'équipe en particulier ? Est-ce que tu avais peut-être d'autres idées, d'autres pistes ?",
      },
      {
        qui: "Roland",
        texte:
          "Je suis quelqu'un de très analytique, et comme tout le monde je crois, on a peur de se faire avoir. Je ne savais pas combien ça coûterait de pouvoir me faire accompagner. Ça, pas de souci, on en reparlera, parce que moi le fait de dépenser ne me dérange pas si derrière j'ai un retour sur investissement. Je m'en fous de dépenser si derrière je gagne plus, aucun problème. Le truc, c'était de savoir vers qui aller, qui aurait mes valeurs, qui aurait ma vision, qui je pourrais modéliser. Je fonctionne beaucoup par modélisation, donc j'ai besoin de me retrouver dans les personnes avec qui je travaille, au-delà de ce qu'elles proposent : c'est un peu qui elles sont. Alors ça paraît peut-être un peu audacieux de dire que je te connais, mais je t'ai analysé, on va dire, comme j'ai pu : avec les réseaux, avec les avis. J'ai croisé, je pense, tout ce qu'on pouvait croiser. J'ai passé beaucoup de temps à t'observer de loin avant de prendre ce fameux appel téléphonique avec Maxime, je crois que c'est ça. J'ai beaucoup cherché, et j'ai vu en toi quelqu'un de simple, d'accessible et d'honnête. C'était surtout ça.",
      },
      {
        qui: "Rémy",
        texte:
          "Est-ce que tu pourrais partager un petit peu les résultats que tu as eus, et aussi la progression, puisque comme tu le disais, tu l'as lancé il y a six mois ? Comment ça s'est passé, comment tu te sens par rapport à ça ?",
      },
      {
        qui: "Roland",
        texte:
          "Une fois, Rémy Jupille a dit qu'on pouvait faire un million d'euros avec un tunnel de vente, et qu'il y avait 0,7 % des gens qui pouvaient le faire. Quand il a dit ça, j'ai trouvé ça délirant, je ne voyais pas du tout comment. Aujourd'hui, c'est mon objectif. Je suis passé à ce niveau-là. On parle beaucoup des dix mille euros, tout le monde en entend parler, tu en parles aussi. Déjà ça, j'avais du mal à y croire. Mais quand tu as passé largement ce palier-là, tu te dis : non, mais en fait, c'est jouable. En faisant partie de la team Jupille, peut-être qu'on peut faire partie des 0,7 %, en état d'esprit.",
      },
      {
        qui: "Roland",
        texte:
          "Je suis déchaîné parce que ce qu'on a fait est structuré, parce que j'aime construire, j'aime bâtir, je suis l'homme du bâtiment. Ce que j'ai appris avec ton équipe et toi, c'est à véritablement bâtir, appliquer une méthode. En fait, il suffit d'être rigoureux, il suffit de faire ce que vous dites, ce que ton équipe conseille, ce que tu conseilles, et à ce moment-là, on avance. Alors ça ne se fait pas tout seul, il ne faut pas mentir : le boulot, il est chez nous, il faut le faire. Il n'y a rien de magique dans ce que tu proposes. Par contre, c'est structuré. J'ai été tellement épaté par votre capacité à structurer votre formation et votre accompagnement, que finalement j'ai modélisé pour moi ce que vous avez fait : ce que tu proposes aujourd'hui, je propose quasiment la même chose à mes artisans, dans mon domaine. Ça, j'ai mis du temps à le bâtir tranquillement, avec toi et grâce à vous.",
      },
      {
        qui: "Roland",
        texte:
          "On n'est jamais seul, on avance, on suit la formation, on est guidé, on construit. Il faut passer du temps à faire son tunnel, il faut passer du temps à comprendre, il faut passer du temps à poser des questions. Il ne faut pas penser que ça va être facile, il faut avoir un peu de ténacité. Après, on va dire deux mois de découverte complète, où là j'étais perdu, puis structurer sa formation, structurer son offre, ainsi de suite. Ça m'a emmené, parce que je ne voulais pas faire vite, je voulais faire bien. Tout ça m'a emmené à peu près cinq mois. En cinq mois, j'avais tout bouclé, et j'ai commencé à commercialiser, donc il y a six mois maintenant.",
      },
      {
        qui: "Roland",
        texte:
          "Aujourd'hui, pour donner une idée : j'ai démarré ma chaîne YouTube le 15 septembre, et la commercialisation de mon programme BTP Performance, c'est début novembre. De début novembre à maintenant, je suis à 110 000 euros de chiffre d'affaires.",
      },
      {
        qui: "Rémy",
        texte: "Ah ouais, c'est beau quand même.",
      },
      {
        qui: "Roland",
        texte:
          "Ouais, c'est beau, mais c'est incroyable comme c'est mathématique finalement. C'est incroyable comme, si tu fais ce qu'il faut faire, que tu appliques ce qu'il faut appliquer, et que tu connais ton métier… C'est sûr que si j'avais essayé de vendre un programme pour voler les gens, parce que je ne connais rien, mais ce n'est pas le cas : j'ai une vraie expertise, bien accompagnée. En fait, ça marche. Je pense que cette année, sur une année, mon objectif, c'est 250 000 euros de chiffre d'affaires. Et je ne lâche rien sur le million : je ne sais pas quand, mais ça va le faire.",
      },
      {
        qui: "Rémy",
        texte:
          "Ça se fait progressivement. Une fois que tu as l'équation pour faire les cent mille, les deux cent cinquante mille, après, comme tu l'as dit, c'est vraiment des maths.",
      },
      {
        qui: "Roland",
        texte:
          "C'est une équation : un plus un égale deux, deux plus deux égale quatre, et donc après, ça ne peut aller que dans ce sens-là. Et ce qui est chouette, c'est que ça remplit beaucoup de choses dans ma vie, tout ça, parce qu'aujourd'hui je travaille à la maison, je suis chez moi. Ça me permet de m'occuper de mes enfants, que je n'ai pas vraiment vu grandir. Alors ils sont grands maintenant, mais ça me permet d'être avec eux. J'ai des revenus, je suis content évidemment d'avoir des revenus, mais aussi je peux aider beaucoup d'artisans. J'ai déjà pas mal de clients, et partout en France. C'est assez magique, parce que vraiment, on se sent utile de partout. Moi je suis à la limite de la francophonie, parce que je ne parle pas un mot d'anglais, il faudra peut-être qu'un jour je m'y mette. Mais voilà, c'est chouette, parce que ça remplit beaucoup de choses que je rêvais d'avoir dans ma vie.",
      },
      {
        qui: "Rémy",
        texte:
          "Et puis en plus, ça renforce ton réseau, tu crées aussi plein de synergies avec des personnes qui sont dans le même domaine que toi.",
      },
      {
        qui: "Roland",
        texte:
          "Et puis, cerise sur le gâteau, aujourd'hui mon fils s'est intéressé au monde numérique aussi, de fait, en voyant son père partir dans un truc de jeune. Il s'est mis dans le montage vidéo, on est en train de travailler pour faire peut-être du closing ensemble. Il y a une synergie familiale en plus qui est en train de se créer, et qui m'éclate.",
      },
      {
        qui: "Rémy",
        texte:
          "C'est top. Est-ce que tu aurais quelque chose à dire, par exemple, à quelqu'un qui regarderait cette vidéo, qui est un peu sceptique, ou qui doute, et qui hésite à réserver un appel ?",
      },
      {
        qui: "Roland",
        texte:
          "Eh bien, qu'elle a raison, qu'il faut qu'elle hésite, qu'il faut qu'elle fouille, qu'il faut qu'elle cherche, qu'il faut qu'elle te scanne, qu'il faut qu'elle aille au bout de sa peur, qu'elle le fasse. Elle va découvrir qu'en fait il n'y a pas de piège, il n'y a rien d'autre que ce que tu es, et qu'un programme qui fonctionne, et qu'un mec qui témoigne. Autour de moi, il n'y a personne qui me braque un flingue sur la tête. Je dis ça parce que c'est vrai. Et les cent mille, j'ai le tableau devant moi : c'est 109 778 euros de chiffre d'affaires faits depuis quelques mois. Elle a raison de s'inquiéter, parce qu'il y a beaucoup de marlous dans ce domaine. Et quand elle aura fini de s'inquiéter, elle prendra cet appel, et cet appel peut changer véritablement beaucoup de choses dans sa vie.",
      },
      {
        qui: "Rémy",
        texte:
          "Merci beaucoup. Je suis sûr que ton histoire va en inspirer beaucoup, peut-être à passer le pas et à concrétiser ça dans leur propre business. Merci beaucoup en tout cas, Roland, pour ton retour d'expérience.",
      },
      {
        qui: "Roland",
        texte: "Avec plaisir, merci à toi Rémy pour ta confiance.",
      },
    ],
  },
];

/** L'avis d'un témoignage, s'il en a un. */
export const avisDe = (id: string) => avis.find((a) => a.id === id);
