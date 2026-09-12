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
    id: "j0vbkt570k",
    slug: "christian-joyce",
    titre:
      "Avis Funnels Club : Christian Joyce, 160 000 € en quatre mois en vendant sa méthode de nettoyage",
    titrePage: "Avis Funnels Club : Christian Joyce, 160 000 € en 4 mois",
    description:
      "À 22 ans, Christian Joyce dirige une société de nettoyage en Belgique. Il raconte comment il en a tiré une formation en ligne et généré 160 000 € en quatre mois.",
    afficheAlt:
      "Christian Joyce en entretien vidéo avec Rémy Jupille, chacun depuis son bureau",
    chapo:
      "Christian Joyce a 22 ans et une société de nettoyage en Belgique. Dans cet entretien avec Rémy Jupille, il raconte comment il a transformé son métier en formation en ligne, et pourquoi il n'a rien essayé d'autre avant.",
    sections: [
      {
        titre:
          "Une société de nettoyage, et l'envie d'un levier qui se duplique",
        paragraphes: [
          "Christian a d'abord une entreprise de nettoyage en Belgique, avec près d'une dizaine d'employés : voitures, canapés, façades, terrasses, piscines. Un métier de terrain, où il faut des ouvriers, des contrats, et quelqu'un pour régler les problèmes sur place.",
          "Ce qu'il cherchait n'était pas un autre métier, mais ==un levier qui n'a pas besoin de bras pour grandir==. Il voulait monétiser ce qu'il savait déjà faire, et il a monté un programme qui aide à lancer une activité de nettoyage et à atteindre trois à cinq mille euros par mois. Il précise la condition, et elle lui tient à cœur : celui qui accepte de se retrousser les manches y arrive.",
        ],
        citation: {
          texte:
            "Je souhaitais monétiser cette connaissance-là, et aussi avoir ce levier scalable du online.",
          qui: "Christian",
        },
      },
      {
        titre: "Pourquoi il a choisi Funnels Club plutôt qu'un autre programme",
        paragraphes: [
          "Christian n'avait aucun problème avec la technique. Son blocage était ailleurs : il ne voulait pas patauger, tester des choses au hasard et perdre des mois. Il a donc pris le temps de regarder toutes les personnes qui proposent un accompagnement au business en ligne avant de choisir.",
          "Ce qui l'a décidé tient en trois choses qu'il énumère lui-même : l'ancienneté sur le marché, la qualité du webinaire, et celle des vidéos. Il a regardé le webinaire deux ou trois fois avant de réserver son appel, précisément pour vérifier ce qu'il achetait. Si vous hésitez de la même façon, [la vidéo de formation est en accès libre](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "J'avais juste envie de me dire : j'investis dans un programme, j'ai envie que ce soit qualitatif derrière et que ça performe.",
          qui: "Christian",
        },
      },
      {
        titre: "Trois semaines pour tout mettre en place",
        paragraphes: [
          "Il démarre le programme le 31 janvier. Il regarde les vidéos une par une, assimile la partie théorique, puis passe à la mise en pratique. ==En deux à trois semaines, tout est en place.==",
          "Il insiste sur la mécanique du programme, et c'est ce qui explique sa vitesse : chaque vidéo a une raison d'être et des devoirs qui vont avec. On regarde, puis on fait. Il n'y a pas eu, chez lui, de phase où rien ne marchait.",
        ],
        citation: {
          texte:
            "Chaque vidéo est là pour une raison, et a des devoirs entre guillemets qui vont avec. Donc après chaque vidéo, il faut faire quelque chose.",
          qui: "Christian",
        },
      },
      {
        titre: "Ses résultats : 160 000 € générés en quatre mois",
        paragraphes: [
          "De la mi-février à la mi-juin, Christian annonce ==un peu plus de 160 000 euros générés==, encaissés sur Stripe, uniquement sur le programme de formation au nettoyage.",
          "Le déclic a mis une semaine à venir, et pour une raison simple : ça a marché dès le lancement. Il était parti quelques jours à la mer, et les ventes tombaient pendant qu'il ne faisait rien. C'est ce contraste avec son autre métier qui l'a sidéré : d'un côté des ouvriers à recruter et des chantiers à régler, de l'autre des automatisations qui livrent la formation toutes seules.",
        ],
        citation: {
          texte:
            "Dès le premier jour, c'était sept cents euros par jour minimum, et ça s'est enchaîné comme ça. Chaque fin de journée, c'était un truc de fou.",
          qui: "Christian",
        },
      },
      {
        titre:
          "Le doute sur sa niche : est-ce que ça marche dans le nettoyage ?",
        paragraphes: [
          "Rémy lui pose la question que beaucoup se posent : vendre une formation dans un domaine où presque personne ne le fait. Christian reconnaît qu'il avait ce doute, et qu'il l'a gardé pendant qu'il appliquait la formation. Sur YouTube, en français, il est à peu près le seul à parler de business de nettoyage.",
          "Ce qui l'a aidé, ce sont les exemples du programme, pris dans des domaines qui n'ont rien à voir les uns avec les autres. Voir la même mécanique marcher ailleurs est ce qui rend croyable qu'elle marche chez soi. C'est le même constat que font [les autres membres dans leurs propres domaines](/resultats).",
        ],
        citation: {
          texte:
            "Le marché est énorme, et il y aura toujours moyen d'aller chercher un petit pourcentage de clients intéressés par ce que tu proposes.",
          qui: "Christian",
        },
      },
      {
        titre: "Ce qu'il retient de la formation",
        paragraphes: [
          "Quand Rémy lui demande ce qui l'a le plus aidé, Christian refuse de choisir : il a suivi la formation étape par étape, vidéo après vidéo, et c'est l'ensemble qui l'a mené où il voulait. Il la décrit comme intemporelle, et y revient encore aujourd'hui pour améliorer un point ou se remettre dans la tête de ses clients.",
          "Il a aussi remarqué que le programme continue de bouger : au moment de l'entretien, il venait d'y retrouver de nouvelles parties sur l'intelligence artificielle et sur le contenu.",
        ],
        citation: {
          texte:
            "C'est un plan de route, c'est un GPS : tu veux aller à tel endroit, voilà, suis là, tourne à gauche, tourne à droite.",
          qui: "Christian",
        },
      },
      {
        titre: "Son avis pour ceux qui hésitent encore",
        paragraphes: [
          "Christian a hésité lui aussi, et il est direct sur ce qu'il en pense : celui qui hésite n'a pas peur du programme, il a peur de lui-même. Sa réponse ne cherche pas à rassurer, elle déplace la question.",
          "Il ajoute que son propre passé d'entrepreneur l'a aidé à passer à l'action, et que quelqu'un qui n'a jamais entrepris a d'autant plus besoin d'être guidé. Si c'est votre cas, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site).",
        ],
        citation: {
          texte:
            "Si elle hésite, c'est une peur, c'est sa confiance en elle-même. Il faut juste passer à l'action, se faire confiance et faire confiance au programme.",
          qui: "Christian",
        },
      },
    ],
    transcription: [
      {
        qui: "Rémy",
        texte:
          "Salut Christian, ça fait plaisir de t'avoir aujourd'hui, merci d'avoir accepté l'invitation pour l'interview. Est-ce que tu peux te présenter rapidement, dire un peu ce que tu fais, les résultats que tu as eus si ça ne te dérange pas, le parcours que tu as fait, à qui tu t'adresses, quel est ton business ?",
      },
      {
        qui: "Christian",
        texte:
          "Je suis Christian Joyce, vingt-deux ans. Mon business de base, j'ai un business de nettoyage en Belgique, avec une dizaine d'employés, un peu moins d'une dizaine actuellement, qui font du nettoyage : nettoyage de voiture, de canapé, de façade, de terrasse, piscine, tout ça. Et j'ai rajouté un second business en ligne, en passant par Funnels Club, parce qu'en fait je souhaitais monétiser cette connaissance-là et aussi avoir ce levier scalable du online. J'ai mis en place un programme qui aide les personnes à lancer leur activité de nettoyage et à gagner trois mille, cinq mille euros par mois. C'est le target que je leur propose dès le début, parce que c'est une promesse possible et faisable pour toute personne qui est prête à mettre les moyens, et quand je dis les moyens, c'est de se retrousser les manches physiquement. Si elle accepte ça, d'aller faire du nettoyage le mois prochain, elle a fait son argent.",
      },
      {
        qui: "Christian",
        texte:
          "J'ai commencé le trente et un janvier, je démarre le programme, je regarde les vidéos une par une, j'ai terminé en deux semaines, trois semaines, tout mis en place. J'ai assimilé la partie théorie, parce qu'il y a pas mal de choses à connaître : même si j'avais quelques bases, c'était hyper intéressant, j'ai appris beaucoup de choses. Et il y a la partie pratique, où là c'est implémenter, maintenant. Il m'a fallu trois semaines à peu près. Entre la mi-février et aujourd'hui, mi-juin, c'est un peu plus de cent soixante mille euros générés sur Stripe, uniquement sur Stripe, du programme de formation au nettoyage, grâce à ton programme, sur les trois, quatre mois derrière. Donc un très bon retour sur investissement.",
      },
      {
        qui: "Christian",
        texte:
          "Même si je t'avoue, quand j'ai discuté avec Pierre, j'hésitais, je me disais : est-ce que j'y vais, est-ce que je n'y vais pas. Le fait de regarder ton webinaire une deuxième fois m'a permis de voir sa qualité, en me disant : s'il a un webinaire aussi calé, si les vidéos sont bien faites, sur YouTube elles sont propres, et tu sens que tu envoies une bonne énergie, donc je passe à l'action avec toi. Et je suis plutôt content.",
      },
      {
        qui: "Rémy",
        texte:
          "Avant que tu nous rejoignes, tu avais déjà essayé des choses, des stratégies, ou c'était vraiment un projet tout neuf où tu ne savais pas trop dans quelle direction aller ?",
      },
      {
        qui: "Christian",
        texte:
          "C'était un projet tout neuf. J'avais ma boîte de nettoyage, je n'avais pas envie de venir patauger, d'essayer un truc, de tester si ça marche ou pas. Je n'avais aucun problème avec la technique, l'informatique, tout ça, aucun problème. C'était vraiment : je veux me lancer là-dedans, je veux performer, je veux que ça rapporte vraiment, donc autant m'entourer et chercher une bonne formation. Je t'avoue, j'ai pris le temps de regarder toute autre personne qui propose des accompagnements liés au online, et c'est ton produit qui m'a le plus convenu, qui m'a le plus attiré, ta personne qui m'a convenu. Je me disais : je vais me lancer, il faut que je me fasse former et suivre. Donc je n'ai rien essayé avant ça, je suis juste passé par ton programme. C'est juste ça que j'avais à faire de toute manière, ça ne sert à rien de se balader et de chercher des informations pour rien.",
      },
      {
        qui: "Rémy",
        texte:
          "Mais pourquoi Funnels Club en particulier, justement, puisque tu dis que tu as regardé à gauche et à droite ? C'était quoi, le truc qui t'a le plus attiré ?",
      },
      {
        qui: "Christian",
        texte:
          "Premièrement, peut-être le fait que ça fait longtemps que tu es sur le marché, donc confiance en toi : ça fait longtemps que tu es là, tu ne bouges pas, tu as ta position, tu es tranquille, tu fais ton petit chemin au calme. Le webinaire très calé, les vidéos très calées. Et en fait, j'avais juste envie de me dire : j'investis dans un programme, j'ai envie que ce soit qualitatif derrière et que ça performe. En englobant toute la confiance que tu renvoies, l'aura positive, le webinaire très bien fait, je me suis dit : j'ai envie de faire ce qu'il fait, la même chose. Si j'arrive à faire ce qu'il fait sur mon secteur, sur ma niche, je vais performer.",
      },
      {
        qui: "Rémy",
        texte:
          "Par rapport à ta niche justement : beaucoup de personnes doutent, elles voient que ça marche dans un domaine spécifique mais elles ont des doutes sur le leur. Est-ce que toi aussi tu avais ce doute, sachant qu'il n'y a pas beaucoup d'acteurs sur ton marché ?",
      },
      {
        qui: "Christian",
        texte:
          "J'avais un doute, je t'avoue que j'avais un doute, même en suivant la formation. J'appliquais tout, mais j'avais un doute dans ma tête : est-ce que ça marcherait, pourquoi ça marcherait. Mais c'est dans la tête, il faut croire en soi, prendre son produit et se dire que le marché est énorme, et qu'il y aura toujours moyen d'aller chercher un petit pourcentage de clients intéressés par ce que tu proposes. Que ce soit moi dans le secteur du nettoyage : si on cherche, je suis le seul acteur qui va parler de nettoyage. Tu écris business de nettoyage sur YouTube, il y a quelques autres acteurs, mais pas sur le marché français. Je suis le seul pour l'instant. En le faisant, j'avais vraiment peur au fond, mais il faut croire en soi, il faut croire en ce qu'on a envie, et c'est comme ça que j'ai pu y arriver.",
      },
      {
        qui: "Christian",
        texte:
          "Mais c'est surtout parce que ce que tu proposes est duplicable. Quand on regarde le programme au complet, tu prends des exemples par rapport à ton business à toi, par rapport au régime, il y a plein d'exemples différents, donc ça aide à se dire : si ça marchait pour ça, en vrai moi c'est pareil. Quelqu'un qui veut faire autre chose, ça fonctionnera aussi, parce que dans le programme tu abordes d'autres domaines. Avec les replays, ça permet vraiment de regarder et de se dire : en fait ça marche aussi pour lui, lui il fait un truc qui n'a complètement rien à voir, et ça va performer.",
      },
      {
        qui: "Rémy",
        texte:
          "C'est clair que quand tu regardes l'ensemble des membres, il y a vraiment tous les profils.",
      },
      {
        qui: "Christian",
        texte:
          "Il y a toutes les tranches d'âge. Je vois du quarante ans, trente-cinq ans, quarante-cinq, cinquante, soixante, et il a fait son truc et ça performe.",
      },
      {
        qui: "Rémy",
        texte:
          "Et par rapport à la niche, c'est quoi qui t'a permis d'avoir le déclic ? Parce qu'au final, on n'est jamais vraiment sûr tant qu'on n'a pas quelqu'un qui a payé.",
      },
      {
        qui: "Christian",
        texte:
          "Le déclic, il m'a fallu une semaine, parce que dès que j'ai lancé, ça a marché direct. Je n'ai pas eu de moment où ça ne marchait pas. Je pense surtout que j'ai respecté ce que tu as fait dans le programme, étape par étape. Pour la petite histoire : quand j'ai terminé de tout faire, je me suis pris une semaine de pause, je suis parti à la mer en mode je ne fais rien. Le premier jour où je lance, les ventes tombaient, tombaient, tombaient, et ça me choquait. Parce que moi, dans mon business de nettoyage, j'ai besoin d'ouvriers et d'hommes pour aller travailler, de regrouper des personnes, de signer des contrats, il y a des problématiques sur le terrain, il faut les régler. Et là, à l'inverse, les automatisations sont faites, la personne reçoit son mail, elle a la formation, elle applique. Dès le premier jour, c'était sept cents euros par jour minimum, et ça s'est enchaîné comme ça. Il m'a fallu le temps de me dire : mais c'est un truc de fou. Chaque fin de journée, mille euros aujourd'hui, mille quatre aujourd'hui. Il m'a fallu ça, et après j'étais en mode : en fait, le business en ligne, c'est puissant.",
      },
      {
        qui: "Rémy",
        texte:
          "Félicitations pour ça, ce sont de super résultats, et c'est parce que tu as bien appliqué les choses tout de suite. Et par rapport à la formation, est-ce qu'il y a quelque chose en particulier qui t'a plu ou qui t'a aidé spécifiquement ?",
      },
      {
        qui: "Christian",
        texte:
          "En fait, je ne pourrais même pas te dire un truc en particulier, parce que la formation, je l'ai suivie étape par étape, vidéo après vidéo. Chaque vidéo est là pour une raison, et a des devoirs entre guillemets qui vont avec : après chaque vidéo, il faut faire quelque chose, donc tu appliques. Ce n'est pas qu'il y a un truc en particulier qui m'a aidé, c'est toute la formation qui m'a aidé dans le total, et j'ai tout aimé, pour être franc avec toi. Encore maintenant, je regarde des parties en me disant : il faudrait que j'améliore un truc. Je regarde à nouveau pour me remettre à la place de mon client, répondre encore aux questions, je refais les devoirs pour me mettre dans le bon état d'esprit.",
      },
      {
        qui: "Christian",
        texte:
          "Je trouve qu'elle est limite intemporelle, tu peux tout faire avec : tu expliques plusieurs choses, les tunnels de vente, les webinaires à l'intérieur, tout ce qui est high ticket, il y a le tunnel de captation aussi. Donc pour tout type de business, tout type de stratégie, il y a tout ce qu'il faut. Il n'y a pas un truc en particulier qui est bien mieux, c'est tout qui est bon. Il faut juste la respecter, c'est tout.",
      },
      {
        qui: "Rémy",
        texte:
          "Tout à l'heure tu disais que tu as mis pas mal de temps à réserver un appel, que tu as regardé le webinaire plusieurs fois. Qu'est-ce que tu dirais à une personne qui hésite, soit à réserver un appel, soit à aller plus loin ?",
      },
      {
        qui: "Christian",
        texte:
          "Je pense que la meilleure chose que je peux dire à cette personne, c'est que si elle hésite, c'est une peur : c'est elle qui a peur d'elle, c'est sa confiance en elle-même. Parce que la confiance au programme, il faut y aller les yeux fermés. Une personne qui a peur, elle a peur, et elle ne doit pas écouter sa peur, elle doit passer au-delà, parce que de la peur, on en aura toujours. Il faut passer à l'action, se faire confiance et faire confiance au programme, parce qu'il est juste bien fait. Les résultats viennent de là, c'est grâce à ça. C'est un plan de route, c'est un GPS : tu veux aller à tel endroit, voilà, suis là, tourne à gauche, tourne à droite. Il y a tout ce qu'il faut, et ça donne envie de faire soi-même un produit d'aussi bonne qualité pour ses propres clients.",
      },
      {
        qui: "Christian",
        texte:
          "Il ne faut même pas hésiter, de mon point de vue, il faut juste le faire. C'est vrai que moi-même j'ai hésité, et vu que j'avais déjà entrepris dans le passé, ça m'a aidé à passer à l'action. Mais une personne qui n'a jamais entrepris, je lui dirais : totale confiance, vas-y.",
      },
      {
        qui: "Christian",
        texte:
          "Et ça s'améliore. Encore il y a une semaine, je m'étais reconnecté, j'ai vu que tu avais changé le branding, que tu avais rajouté des choses sur l'intelligence artificielle. J'ai regardé et je me suis dit : c'est un truc de fou. Tu as rajouté récemment les contenus, la viralité. C'est tout ce qui me manquait, et les améliorations vont toujours de pair. Ça se voit que la formation est faite pour rester, faite pour durer et faite pour être qualitative.",
      },
      {
        qui: "Rémy",
        texte:
          "On essaie d'écouter le plus possible les demandes, et l'objectif est toujours de vous permettre d'aller un peu plus vite et de faciliter les choses.",
      },
      {
        qui: "Christian",
        texte:
          "Je le construis même de manière à ce que, limite, je le donne à ma mère et elle le fait, sans avoir besoin d'aide technique. Parce que s'il y a une galère technique, tu as le portail d'assistance, tout est référencé : dès une question, tu as le contenu, tu as la vidéo. N'importe qui peut réussir, quel que soit l'âge, technique ou pas.",
      },
      {
        qui: "Rémy",
        texte:
          "Merci beaucoup Christian, ça fait super plaisir. Je suis sûr que rien que ton parcours va être hyper inspirant pour plein de gens, donc merci de l'avoir partagé.",
      },
      {
        qui: "Christian",
        texte:
          "De toute façon, on en refait un dans trois mois si tu veux, et je te dirai que j'ai fait un million. Le target, c'est d'aller chercher du deux cent mille par mois, et c'est possible, il faut juste réinvestir massivement. Cent pour cent possible.",
      },
    ],
  },
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
