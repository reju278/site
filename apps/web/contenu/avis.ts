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
      "À 22 ans, Christian Joyce dirige une société de nettoyage en Belgique. Il raconte comment il en a tiré une formation en ligne et généré 160 000 € en 4 mois.",
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
          "Ce qu'il cherchait n'était pas un autre métier, mais ==un levier qui n'a pas besoin de bras pour grandir==. Il voulait monétiser ce qu'il savait déjà faire, et il a monté un programme qui aide à lancer une activité de nettoyage et à atteindre trois à cinq mille euros par mois. Il précise la condition, et elle lui tient à cœur : celui qui accepte de se retrousser les manches y arrive. [D'autres membres posent la même condition](/resultats), dans des métiers très différents.",
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
          "Il a aussi remarqué que le programme continue de bouger : au moment de l'entretien, il venait d'y retrouver de nouvelles parties sur l'intelligence artificielle et sur le contenu. C'est aussi ce que remarque [Corentin, qui a vu arriver la mise à jour](/resultats/corentin).",
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
          "Il ajoute que son propre passé d'entrepreneur l'a aidé à passer à l'action, et que quelqu'un qui n'a jamais entrepris a d'autant plus besoin d'être guidé. Si c'est votre cas, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site). [Valérie, partie de zéro à cinquante-six ans](/resultats/valerie), donne à peu près la même réponse.",
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
          "Il le dit lui-même, il était alors à peu près seul dans son domaine à croire à ce qu'il voulait faire. Ce qu'il visait, c'était de faire tomber la barrière géographique : installé en Savoie, il trouvait dommage d'être limité par sa zone et sa capacité de déplacement. [Charlotte se heurte au même mur depuis le Canada](/resultats/charlotte) : une audience lointaine, et rien à lui vendre.",
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
          "Il donne raison à celui qui doute. Qu'il hésite, qu'il fouille, qu'il cherche, qu'il aille au bout de sa peur. Parce qu'au bout, dit-il, il découvrira qu'il n'y a pas de piège. L'appel dont il parle est [l'appel découverte de Funnels Club](https://www.funnels.club/appel?el=site), et il est gratuit. [Jérémy, lui, ne regrette qu'une chose](/resultats/jeremy) : ne pas l'avoir pris plus tôt.",
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
  /* L'entretien d'Augustin n'est pas mené par Rémy : le client s'adresse
     nommément à Geoffrey (« il y a aussi toi, Geoffrey, qui répond à toutes
     les questions ») et parle de Rémy à la troisième personne. Les tours de
     parole sont donc rendus à Geoffrey, et le chapô ne dit pas le contraire.
     Rendre la parole à qui la dit vaut aussi quand ça complique la phrase. */
  {
    id: "2vtsinplyx",
    slug: "augustin-passy",
    titre:
      "Avis Funnels Club : Augustin Passy, 20 000 € de contrats signés en un mois en personal branding",
    titrePage: "Avis Funnels Club : Augustin Passy, 20 000 € en un mois",
    description:
      "Augustin Passy est coach en personal branding. Il raconte comment un tunnel de vente l'a sorti du plafond des 10 000 € par mois, en six mois.",
    afficheAlt:
      "Augustin Passy en entretien vidéo avec l'équipe Funnels Club, chacun depuis son bureau",
    chapo:
      "Augustin Passy accompagne des entrepreneurs sur leur personal branding depuis bientôt trois ans. Il raconte ici comment il est sorti du plafond des dix mille euros par mois, non pas en prenant plus de clients, mais en passant moins de temps avec chacun.",
    sections: [
      {
        titre:
          "Coach en personal branding, bloqué entre 5 000 et 10 000 € par mois",
        paragraphes: [
          "Augustin a d'abord été influenceur, puis il est devenu coach business en personal branding : il accompagne des entrepreneurs à développer leur image en ligne, et avec elle leur activité. Au moment de l'entretien, il fait ça depuis deux ans et demi, trois ans.",
          "Il avait déjà des clients réguliers. Ce qu'il n'avait pas, c'était la marche d'après : ==il restait bloqué entre cinq et dix mille euros par mois==, avec cinq clients au maximum, vendus en high ticket. Le plafond n'était pas commercial, il était horaire. Chaque euro de plus demandait une heure de plus, et il n'en avait plus.",
        ],
        citation: {
          texte:
            "J'étais bloqué entre cinq et dix mille euros par mois, et je ne passais pas cette barre-là.",
          qui: "Augustin",
        },
      },
      {
        titre:
          "Pourquoi un tunnel de vente plutôt qu'un client de plus",
        paragraphes: [
          "Sa conclusion, il la tire lui-même : pour passer la barre, il fallait changer de modèle, pas forcer sur le même. Il voulait automatiser petit à petit son activité, créer de vrais process, monter une plateforme et passer au coaching de groupe.",
          "C'est là que le modèle de Rémy l'a intéressé, parce qu'il montrait exactement cette bascule. Si c'est le passage qui vous intéresse, [la mécanique du tunnel de vente est expliquée en entier dans la formation gratuite](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Il me fallait juste un chemin qui me permette d'y arriver plus facilement, plus rapidement.",
          qui: "Augustin",
        },
      },
      {
        titre: "Ce qui l'a décidé à choisir Funnels Club",
        paragraphes: [
          "Augustin explique qu'il regardait Rémy sur YouTube depuis un moment, et que ce qu'il y voyait était propre et solide. Ce qui l'a convaincu, ce ne sont pas des promesses de résultats : c'est de sentir qu'il y avait des process en place, et depuis longtemps.",
          "Son raisonnement est celui d'un entrepreneur qui a déjà de l'énergie à revendre et qui cherche autre chose : il voulait un système prêt, pour garder la sienne pour le reste. C'est la même chose que disent [les autres membres dans des domaines qui n'ont rien à voir](/resultats).",
        ],
        citation: {
          texte:
            "Ça se voyait qu'il y avait des systèmes précis, et que ce n'était pas juste : on explose les résultats en faisant je ne sais quoi.",
          qui: "Augustin",
        },
      },
      {
        titre: "Ce qui l'a le plus aidé : simplifier, étape par étape",
        paragraphes: [
          "Quand on lui demande ce qui l'a le plus servi, sa réponse tient en deux mots, et il les répète : la simplification, et l'étape par étape. Il savait qu'il finirait par y arriver seul ; ce qu'il ne voulait pas, c'était y passer des mois à chercher quel logiciel prendre et sur quel marché il était vraiment.",
          "Il mentionne aussi l'accompagnement, et pas seulement les vidéos : les questions trouvent une réponse. [Valérie en dit autant des rendez-vous du samedi](/resultats/valerie). C'est ce que décrit également [Roland Buffet, qui forme les entreprises du bâtiment](/resultats/roland-buffet).",
        ],
        citation: {
          texte:
            "Simplification, étape par étape : c'est vraiment ce qui m'a le plus aidé dans le process.",
          qui: "Augustin",
        },
      },
      {
        titre:
          "Ses résultats : 20 000 € de contrats signés, et deux à trois fois moins de temps par client",
        paragraphes: [
          "Six mois après avoir rejoint le programme et tout mis en place, Augustin annonce ==vingt mille euros de contrats signés et dix-sept mille euros encaissés sur le mois précédent==.",
          "Mais ce n'est pas le chiffre qu'il met en avant, et c'est ce qui rend son témoignage différent des autres : ce qui a changé, c'est le temps. Il passe deux à trois fois moins de temps avec les clients qu'il accompagne, alors qu'il génère davantage. Le plafond horaire qui le bloquait n'est plus là, et il dit avoir désormais d'autres problèmes.",
        ],
        citation: {
          texte:
            "Le plus important là-dedans, c'est que je passe moins de temps avec mes clients.",
          qui: "Augustin",
        },
      },
      {
        titre: "Son avis pour ceux qui hésitent encore",
        paragraphes: [
          "Augustin ne promet rien à la place de son interlocuteur, et il pose sa condition avant sa réponse : la volonté, la détermination, la responsabilité d'avancer par soi-même. À quelqu'un qui a ça, il dit que tout le reste est dans le programme.",
          "Il ajoute un détail qui en dit long sur ce qu'il y a trouvé : la plateforme l'a poussé à améliorer son propre produit. Si vous voulez en parler de vive voix, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site) ; sinon, [le podcast de Rémy](/podcast) raconte la même mécanique au long cours.",
        ],
        citation: {
          texte:
            "Si quelqu'un a vraiment la volonté, la détermination, la responsabilité de foncer par lui-même, c'est sûr que dedans, il va avoir tout ce dont il a besoin pour tout mettre en place et réussir.",
          qui: "Augustin",
        },
      },
    ],
    transcription: [
      {
        qui: "Geoffrey",
        texte:
          "Salut Augustin. Déjà, merci d'avoir accepté de faire ce témoignage aujourd'hui pour Funnels Club et aussi pour moi. Donc aujourd'hui, peut-être déjà pour commencer, présente un petit peu qui tu es, ce que tu fais, pourquoi tu nous as rejoints, tout simplement.",
      },
      {
        qui: "Augustin",
        texte:
          "Alors moi, c'est Augustin Passy, et je suis coach business en personal branding. J'accompagne les entrepreneurs à développer leur personal branding en ligne, et du coup leur activité en ligne. Je fais ça depuis maintenant deux ans et demi, trois ans exactement. Avant, j'étais influenceur, puis j'ai transitionné un petit peu là-dedans. Et mon activité, j'avais quand même quelques clients réguliers, mais je ne passais pas, on va dire, une certaine barre. J'étais bloqué entre cinq et dix mille euros par mois, et je ne passais pas cette barre-là. Il fallait que je change un petit peu mon modèle, et pour ça, rien de mieux que de pouvoir implémenter un système, celui de Funnels Club. Je savais que Rémy avait un peu le modèle qui m'inspirait : créer un tunnel de vente, pouvoir petit à petit automatiser son activité, créer de vrais process, créer une plateforme, passer au coaching de groupe. Il y avait quelque chose qui m'inspirait dans la façon dont il fonctionnait, et donc je me suis dit : let's go, c'est la prochaine étape. Je sais à quel point c'est important d'investir sur soi et d'y aller.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Super intéressant. En plus, c'est vrai que tu avais déjà des résultats avant de rejoindre le programme. Est-ce que tu connaissais vraiment tes obstacles, est-ce que tu les avais identifiés précisément avant de nous rejoindre ?",
      },
      {
        qui: "Augustin",
        texte:
          "On va dire que c'était un peu flou. Je savais qu'il y avait des choses qui me manquaient, il me fallait juste un chemin qui me permette d'y arriver plus facilement, plus rapidement. Je savais que je pouvais atteindre les résultats que je voulais, mais je savais aussi le temps que ça allait me prendre si je n'avais pas les choses précises, concises : par exemple quel logiciel utiliser, si je ne clarifiais pas également ce que je faisais, si je ne savais pas exactement dans quel marché j'étais. J'allais prendre du temps à trouver tout ça. C'était vraiment un gain de temps, et en plus de ça un vrai suivi sur ce dont personnellement j'avais besoin.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Je comprends. Et justement, pourquoi nous avoir choisis, entre guillemets, plutôt que quelqu'un d'autre ?",
      },
      {
        qui: "Augustin",
        texte:
          "Je dirais que je voyais que c'était clean. Quand je voyais Rémy déjà sur YouTube, et cetera, pour moi c'était clean, c'était solide, ça faisait longtemps qu'il était là, qu'il faisait ce qu'il faisait, donc ça se voyait qu'il y avait des process en place. J'ai tout de suite eu confiance, en réalité. C'est lui qui m'inspirait le plus confiance. Ça se voyait que c'était clair, qu'il y avait des systèmes précis, et que ce n'était pas juste : on explose les résultats en faisant je ne sais quoi. Tu ressentais qu'il y avait des process à mettre en place, et qu'ensuite je pouvais utiliser mon énergie à moi pour faire décoller le reste. Le système est prêt ; l'énergie qu'il fallait avoir, moi je l'ai déjà. Il fallait juste quelque chose d'étape par étape, un peu clair, le chemin que je n'avais pas forcément à ce moment-là.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Qu'est-ce qui t'a le plus aidé au travers de Funnels Club ? C'est vraiment ce pas à pas, les étapes qui te manquaient ?",
      },
      {
        qui: "Augustin",
        texte:
          "Les étapes qui me manquaient, simplifiées également. Vraiment pouvoir simplifier : ça aussi, ça m'attirait, le fait de pouvoir simplifier. Je dirais que c'est simplification, étape par étape. C'est vraiment ce qui m'a le plus aidé dans le process.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Et aujourd'hui justement, est-ce que tu peux dire où tu en es, ou tu préfères ne pas le faire ?",
      },
      {
        qui: "Augustin",
        texte:
          "Carrément. Du coup, j'étais bloqué entre cinq et dix mille euros par mois, comme je le disais. J'avais peut-être cinq clients maximum par mois, donc c'est du high ticket. Et six mois après être entré dans Funnels Club, après avoir mis tout en place, le mois dernier par exemple, j'ai fait vingt mille euros de contrats signés, dix-sept mille euros d'encaissé. Donc ça avance. Le plus important là-dedans, c'est que je passe moins de temps avec mes clients. C'est ça aussi que je recherchais, et j'avais oublié de le mentionner : je savais que j'étais limité en termes de temps avec le chiffre que je faisais. J'étais vraiment bloqué à dix mille euros par mois parce que je passais trop de temps. S'il y avait un moyen d'aller vraiment au-delà, je me serais cramé. Et aujourd'hui, c'est beaucoup plus simple de générer plus avec deux à trois fois moins de temps avec les clients que j'accompagne. Évidemment, ça me permet d'aller beaucoup plus loin, beaucoup plus rapidement. Maintenant, je sais ce que je dois faire pour aller encore plus loin, et donc j'ai d'autres problèmes, on va dire.",
      },
      {
        qui: "Geoffrey",
        texte: "Des bons problèmes.",
      },
      {
        qui: "Augustin",
        texte: "Exactement.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Génial, déjà félicitations, parce que ce sont de beaux résultats en six mois. Tu as réussi à mettre plein de choses en place, donc c'est top. Est-ce que tu aurais un mot à passer aux personnes qui regardent ce témoignage et qui hésitent encore à rejoindre Funnels Club ?",
      },
      {
        qui: "Augustin",
        texte:
          "Je dirais que si quelqu'un a vraiment la volonté, la détermination, la responsabilité de vraiment foncer par lui-même, c'est sûr que dedans, il va avoir tout ce dont il a besoin pour tout mettre en place et réussir. Tout est fait pour que ce soit clair. Moi, j'étais aussi impressionné en rentrant sur la plateforme : je n'avais clairement jamais vu ça. Ça m'a poussé à améliorer aussi mon produit, clairement. Il y a tout pour réussir. Si tu es motivé, déterminé, que tu veux vraiment avancer, il y a tout : c'est étape par étape, et il y a aussi toi, Geoffrey, qui réponds à toutes les questions. C'est top. Il y a toute la technique, tout l'étape par étape, il y a tout. Il n'y a plus à se prendre la tête sur ce que je dois faire.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci beaucoup pour ton témoignage. C'est super inspirant, parce qu'en effet, ce sont de beaux chiffres. Tu as un beau parcours, tu avais déjà fait pas mal de choses avant, donc je trouve ça vraiment cool. Merci encore pour ton temps, et puis au prochain résultat, alors.",
      },
      {
        qui: "Augustin",
        texte:
          "Avec plaisir. Du coup, je referai un témoignage, parce qu'en fait je n'ai pas encore utilisé tout le potentiel, tu vois. Il y a pas mal de choses que je peux encore mettre en place dans Funnels Club, je n'ai pas encore eu le temps d'aller jusqu'à la fin. Mais ça va aller encore plus loin, c'est évident.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Nickel. Je te souhaite une bonne journée, merci encore, et on se dit à très vite de toute façon.",
      },
      {
        qui: "Augustin",
        texte: "Avec plaisir.",
      },
    ],
  },
  /* Deux réserves sur cet entretien, et elles se disent plutôt qu'elles ne se
     cachent.

     **L'intervieweur n'est pas nommé** : le couple parle de Rémy à la
     troisième personne et s'adresse à quelqu'un d'autre. Les tours de parole
     lui sont donc rendus sous « Funnels Club », faute de prénom prononcé.

     **La reconnaissance vocale décroche par endroits**, surtout sur les
     montants : elle écrit « trois cas », « un p huit », « on a fait
     cent-quatre ». Ces passages ne sont ni retranscrits ni devinés, et aucun
     chiffre qui en vient n'est publié. Le seul résultat annoncé ici est celui
     que Sylvie énonce en toutes lettres, « notre chiffre a triplé », plus le
     prix de la formation, que Yannick donne clairement. À réécouter par Rémy
     s'il veut publier davantage. */
  {
    id: "2xege6bt0u",
    slug: "yannick-et-sylvie",
    titre:
      "Avis Funnels Club : Yannick et Sylvie ont triplé leur chiffre en quittant l'abonnement low cost",
    titrePage: "Avis Funnels Club : Yannick et Sylvie, un chiffre triplé",
    description:
      "Yannick et Sylvie forment à la souplesse en ligne. Ils racontent comment ils ont quitté l'abonnement low cost pour une formation à 3 700 €.",
    afficheAlt:
      "Yannick et Sylvie en entretien vidéo avec Funnels Club, tous les deux depuis leur studio",
    chapo:
      "Sylvie a créé une méthode de souplesse pour adultes, et Yannick, son mari, l'a rejointe. Après quatre ans et demi d'abonnement à bas prix, ils racontent ce qui les empêchait de monter, et pourquoi ce n'était pas leur offre.",
    sections: [
      {
        titre:
          "Une méthode de souplesse en ligne, construite sur quatre ans et demi",
        paragraphes: [
          "Sylvie était professeure de pole dance. Elle s'est passionnée pour la souplesse et en a fait une méthode destinée aux adultes, y compris à ceux qui n'ont aucun passé sportif et qui commencent à trente, quarante ou cinquante ans. Yannick l'a rejointe dans l'aventure : danseur professionnel diplômé, passé par les BPJEPS fitness et musculation, champion de pole dance.",
          "Ensemble, ils ont ouvert un studio en ligne de cours de souplesse, d'abord pour le monde de la pole dance, puis pour des gens venus de la danse et du yoga. Avant d'être accompagnés, l'activité tournait déjà depuis quatre ans et demi : deux ans de cours particuliers en tête-à-tête, puis un abonnement mensuel.",
        ],
        citation: {
          texte:
            "On a commencé par des cours privés, on donnait chacun les cours un à un. Tout était en ligne.",
          qui: "Sylvie",
        },
      },
      {
        titre:
          "La croyance qui les bloquait : « il ne faut pas faire de publicité »",
        paragraphes: [
          "Yannick en rit lui-même : il y avait, tout au long du développement de leur activité, une liste de choses dont ils étaient sûrs à cent pour cent et dont ils ne voulaient pas déroger. ==En tête de cette liste, une seule : il ne faut pas faire de publicité.==",
          "Leur raisonnement se tenait, vu de l'intérieur. Une publication sponsorisée ne donnait pas envie de cliquer : ils y voyaient le signe que celui qui la paie n'a rien de mieux à offrir. C'est exactement le genre de certitude que [Roland Buffet décrit de son côté dans le bâtiment](/resultats/roland-buffet), et que lui aussi a dû défaire.",
        ],
        citation: {
          texte:
            "Le top un, vraiment le number one, c'est : il ne faut pas faire de publicité.",
          qui: "Yannick",
        },
      },
      {
        titre:
          "Le cercle vicieux du low cost : toujours plus de cours, jamais plus de chiffre",
        paragraphes: [
          "Leur abonnement était à vingt-neuf euros quatre-vingt-dix par mois, et ils y mettaient tout : tous les cours, tous les lives, cinq ou six par semaine, qu'ils se sont mis à doubler en anglais. Yannick résume la mécanique sans complaisance : ils donnaient toujours plus, sans jamais communiquer davantage.",
          "Le résultat est contre-intuitif, et c'est ce qui rend leur témoignage utile : ==à force de proposer trop, les gens réalisaient moins la valeur de ce qu'ils recevaient.== Sylvie le raconte à travers un détail qui dit tout : un cours du dimanche à cinq euros l'unité, pour lequel ils prenaient des appels un par un.",
        ],
        citation: {
          texte:
            "On donnait toujours plus de valeur, sans communiquer, sans avoir une stratégie de communication performante.",
          qui: "Yannick",
        },
      },
      {
        titre: "Le déclic : le problème n'était pas l'offre, mais la stratégie",
        paragraphes: [
          "À la rentrée, ils ont tenté ce que tout le monde tente : ajouter. Plus de spécialités, la pole en plus de la souplesse, de quoi donner aux abonnés une raison de rester. Ils ont vite vu que cela ne changeait rien au chiffre, et beaucoup à leur charge de travail.",
          "C'est là qu'ils ont compris que le problème était ailleurs. Sylvie parle d'années de frustration à sentir qu'il y avait quelque chose qui n'allait pas sans savoir le nommer : ils avaient commencé par des programmes privés à mille cinq cents euros, puis tout basculé en bas prix, ==sans jamais construire d'escalier entre les deux==.",
        ],
        citation: {
          texte:
            "Ce n'était pas le problème de l'offre et de ce qu'on proposait.",
          qui: "Sylvie",
        },
      },
      {
        titre: "Pourquoi ils ont choisi Funnels Club",
        paragraphes: [
          "Yannick suivait les vidéos de Rémy depuis six mois et les résumait à Sylvie, qui ne regarde pas YouTube. C'est elle qui a tranché : il fallait se former, parce qu'ils étaient au bout de ce que leur méthode pouvait produire seule. Lui reconnaît que sans elle, il serait passé à l'action bien plus tard.",
          "Sa réticence, il la nomme : la peur de dépenser. Il la range aujourd'hui du côté des fausses économies, et le dit en une phrase qu'il emprunte au bon sens paysan : on est obligé de semer pour récolter. Si vous en êtes là, [la formation gratuite montre la mécanique avant tout engagement](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Tu ne sais pas ce que tu ne sais pas, et ce n'est pas parce que tu es bon dans un domaine que tu es bon sur tous les domaines.",
          qui: "Yannick",
        },
      },
      {
        titre:
          "Leurs résultats : une formation à 3 700 € et un chiffre triplé",
        paragraphes: [
          "Ils ont retouché l'offre d'abonnement, puis lancé ce qu'on leur réclamait depuis cinq ans : une vraie formation, vendue trois mille sept cents euros, et destinée cette fois aux professionnels qui veulent enseigner la souplesse plutôt qu'aux seuls particuliers. Au moment de l'entretien, elle a un peu plus de deux mois. [Charlotte a fait la même bascule dans la formation aux ongles](/resultats/charlotte).",
          "Sylvie résume l'effet en cinq mots : ==leur chiffre a triplé.== Elle attribue le déclencheur à des phrases entendues dans la formation, qu'elle décrit comme des électrochocs. On retrouve la même bascule chez [les autres membres, dans des métiers qui n'ont rien à voir](/resultats).",
        ],
        citation: {
          texte:
            "Il y a des phrases que Rémy a dites dans la formation qui ont été des électrochocs, et c'est ça qui nous a fait mettre en place des choses qui ont fait que notre chiffre a triplé.",
          qui: "Sylvie",
        },
      },
      {
        titre: "Leur avis pour ceux qui hésitent à investir",
        paragraphes: [
          "Leur réponse ne porte pas sur le programme, elle porte sur le calcul que fait celui qui hésite. Sylvie dit qu'attendre une semaine de plus aurait été du temps perdu, et que croire qu'on y arrivera seul en est aussi. Yannick ajoute l'argument qui lui a coûté le plus longtemps à admettre.",
          "Il parle d'humilité, et de la seule dépense qu'on ne voit jamais passer : celle qu'on ne fait pas. Si vous voulez leur poser la question autrement, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [les articles de Rémy](/articles) reviennent régulièrement sur ce calcul-là.",
        ],
        citation: {
          texte:
            "Tout l'argent que tu ne gagnes pas par ton incompétence, c'est très difficile à évaluer.",
          qui: "Yannick",
        },
      },
    ],
    transcription: [
      {
        qui: "Funnels Club",
        texte:
          "Déjà, bonjour à tous les deux. Merci d'avoir accepté aujourd'hui cette interview pour partager votre expérience au sein de Funnels Club. Avant de rentrer dans le vif du sujet, est-ce que vous pourriez vous présenter, parler un petit peu de ce que vous faites, de ce que vous faisiez avant, et de ce que vous continuez à faire avec nous aujourd'hui ?",
      },
      {
        qui: "Sylvie",
        texte:
          "Alors, j'ai créé une méthode de souplesse. J'étais prof de pole dance à la base, je me suis passionnée pour le domaine de la souplesse, et j'ai créé une méthode de souplesse pour les adultes, pour progresser même si on n'a pas de passé sportif, même si on a trente, quarante, cinquante ans. Et donc avec Yannick, mon mari, qui m'a rejointe dans l'aventure, on a créé un studio en ligne de cours de souplesse, qui était initialement destiné aux gens qui font de la pole dance, puisque c'est notre milieu de base, mais où il y a aussi des gens de la danse, du yoga, qui s'adressent à nous. C'était vraiment quelque chose qu'on voulait développer, puisqu'il y avait un potentiel énorme au niveau de la souplesse.",
      },
      {
        qui: "Yannick",
        texte:
          "Ce qui est rigolo, c'est que tout au long du développement de notre business, il y avait plein d'idées préconçues, des choses dont on était sûrs à cent pour cent et dont on ne voulait pas déroger. On pourrait en faire une liste. Je crois que tu as commencé à faire une liste de tout ce qu'on disait qu'on ne voudrait jamais faire. Le top un, vraiment le number one, c'est : il ne faut pas faire de publicité.",
      },
      {
        qui: "Sylvie",
        texte:
          "On vient de loin, on vient vraiment de zéro. On se disait : quand tu vois un post sponsorisé, franchement, ça ne donne pas envie de cliquer dessus. Tu te dis : ils sont tellement nuls qu'ils sont obligés de faire de la pub.",
      },
      {
        qui: "Yannick",
        texte:
          "En tout cas, on est bons en pole dance et en souplesse, et c'est tout, on va dire. D'autres choses quand même, mais rien à voir avec savoir se vendre, savoir le marketing digital. Et puis ce qui nous a desservis à certains moments, c'est quand tu commences à avoir des résultats qui te confortent dans certains trucs. Nous, on se disait : on n'est pas comme les autres, on est bons en communication.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Ce qui est intéressant, juste pour remettre un peu de contexte, c'est qu'en réalité vous aviez déjà une offre, que vous aviez déjà travaillée suite à votre expérience, et vous aviez déjà réussi à atteindre des chiffres qui sont de très beaux chiffres pour beaucoup de personnes. Et justement, vous aviez cette idée préconçue que la publicité n'était pas forcément une bonne chose. Donc ce sont un peu les conditions dans lesquelles vous nous avez rejoints. D'ailleurs, ça faisait combien de temps que vous aviez lancé l'activité avant de nous rejoindre ?",
      },
      {
        qui: "Sylvie",
        texte:
          "Quatre ans, quatre ans et demi. On a commencé par des cours privés, on donnait chacun les cours un à un. Tout était en ligne, lui dans une pièce et moi dans une autre. On a fait ça pendant un an quand même, avec des workshops en ligne. Mais le studio avec l'abonnement, le fait d'avoir des abonnements, ça assurait un confort financier. Il fallait quand même chercher de nouveaux clients, d'autant plus, mais c'était moins insécurisant que le cours.",
      },
      {
        qui: "Yannick",
        texte:
          "Pour placer le contexte, on a fait deux ans de un à un, avec un cours collectif tous les dimanches, low cost. On a toujours été low cost, et ça, ça a été un vrai problème. Ensuite, on a lancé la formule en ligne, et on vous a rejoints un an et demi après ça.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Il y a un point aussi super intéressant : vous aviez un abonnement qui était au prix de vingt-neuf euros, si je ne me trompe pas. Un abonnement qui est correct, puisque c'est à peu près ce qu'on voit ailleurs, mais qui par rapport à ce que vous proposiez était très bas, parce que votre école, vous l'avez depuis un moment, et vous gardez toutes les données, tous les lives.",
      },
      {
        qui: "Yannick",
        texte:
          "Oui, on est allés à l'extrême. Si on n'avait pas eu la formation avec Rémy, on aurait fait notre formation et on l'aurait mise dans l'abonnement pour vingt-neuf quatre-vingt-dix par mois. On aurait été capables de faire un truc comme ça. On donnait toujours plus de valeur, sans communiquer, sans avoir une stratégie de communication performante. On était dans une logique où on donnait plus, et on ne comprenait pas, parce qu'on faisait plus. On a mis tous les cours, tous les lives, on avait peut-être cinq ou six lives par semaine, on s'est mis à les doubler en anglais. Ça a fait quelque chose, mais on n'allait pas être capables de les doubler en espagnol et d'apprendre le chinois pour les doubler en chinois. Et tout ça sans faire de pub.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et quel a été le déclic qui vous a poussés à chercher une solution pour développer un peu plus l'activité ?",
      },
      {
        qui: "Yannick",
        texte:
          "On a touché le bout du bout. À un moment donné, quand tu donnes tellement pour pas cher, tu te rends compte que ça ne change pas. Pendant des mois, tu donnes plus, tu rajoutes un concept, tu rajoutes, et en fait le chiffre, c'est un électrocardiogramme plat.",
      },
      {
        qui: "Sylvie",
        texte:
          "Le déclic, ça a été à la rentrée. On s'est dit : on ne va plus être spécialistes que de la souplesse, on va fusionner avec la pole pour que les gens s'abonnent, ça va être notre argument, on va rajouter. Mais on s'est rendu compte que ce n'était pas ça. Ce n'était pas le problème de l'offre et de ce qu'on proposait.",
      },
      {
        qui: "Yannick",
        texte:
          "Il y avait un genre de cercle vicieux : à beaucoup donner, on faisait partie des murs, alors que dans le domaine on est vraiment des experts. Moi, je viens du monde de la danse, je suis diplômé en danse, je suis danseur professionnel, j'ai passé les BPJEPS en fitness et en musculation, j'ai été champion de pole. Et en fait, à force de donner, donner, donner, les gens ne réalisaient plus la valeur de ce qu'on donnait.",
      },
      {
        qui: "Sylvie",
        texte:
          "Le dimanche, pendant un moment, on avait un cours qui existe toujours, qui est inclus dans la formule maintenant, mais c'était le cours qu'on a lancé pendant le confinement. Il était à cinq euros l'unité, et on a fait des appels un par un pour cinq balles.",
      },
      {
        qui: "Yannick",
        texte:
          "Et notre formation aujourd'hui, c'est trois mille sept. Entre cinq et ça, c'est autre chose.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et puis il y avait aussi quelque chose que vous m'aviez partagé, c'était le temps que vous y passiez au quotidien.",
      },
      {
        qui: "Sylvie",
        texte:
          "Pour la vie personnelle, on récupérait notre fille et une heure après on lui disait : non, on rentre, il y a cours. Et ça, c'était tous les soirs. Au parc, il fait beau : non, on rentre, on a le cours. Il n'y avait qu'un jour dans la semaine où on ne donnait pas.",
      },
      {
        qui: "Yannick",
        texte:
          "Et ça, je pense que ça peut intéresser des personnes quand elles pensent à leur stratégie. À un moment donné, admettons, nous on avait une offre à trente balles et tu as cinquante cours, mais les gens ne peuvent en faire que quatre. Elles vont te dire : moi, je veux quatre cours pour dix balles.",
      },
      {
        qui: "Sylvie",
        texte:
          "À force de proposer trop, les gens disent : de toute façon, moi je ne vais pas faire tout ça.",
      },
      {
        qui: "Yannick",
        texte:
          "C'est comme si, à McDo, ils faisaient une promo et te disaient : je te file dix hamburgers pour le même prix. Mais je ne peux pas manger les dix, je préfère que tu m'en donnes un moins cher. Notre stratégie, ça n'allait pas.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Qu'est-ce qui vous a motivés à venir vers nous, et qu'est-ce qui vous a fait nous choisir plutôt que d'autres ?",
      },
      {
        qui: "Sylvie",
        texte:
          "Alors moi, je sais comment : ça, c'est Yannick, parce que moi je ne regarde pas de vidéos sur YouTube.",
      },
      {
        qui: "Yannick",
        texte:
          "Forcément, je m'intéressais aux stratégies, je suivais des vidéos, j'essayais de chercher des astuces, des renseignements.",
      },
      {
        qui: "Sylvie",
        texte:
          "Tu m'as beaucoup parlé de ces vidéos de Rémy. Ça faisait au moins six mois que tu m'en parlais. Parce que lui, il regarde, il me débriefe, et j'écoute.",
      },
      {
        qui: "Yannick",
        texte:
          "Et le truc, c'est que s'il n'y avait pas eu Sylvie, je pense qu'on serait passés à l'action encore plus tard. Parce que je ne sais pas pourquoi, mais tu as peur d'aller plus loin. Le premier pas, on le dit, il est toujours le plus difficile. Et puis le plus gros truc : là d'où je viens, on est vraiment dans le délire d'essayer de dépenser toujours le moins possible. Et le truc, c'est que ce n'est pas possible. Tu es obligé de semer pour récolter, tu es obligé de semer et de travailler beaucoup pour récolter après. Se dire : je vais regarder quelques tutos sur YouTube, puis je vais trouver des réponses, et je vais faire essai, erreur, essai, erreur.",
      },
      {
        qui: "Sylvie",
        texte:
          "Je pense que beaucoup de personnes se reconnaîtront dans ma façon de faire. J'ai, comme beaucoup de gens, ce problème de se dire qu'il faut casser la tirelire. En fait, c'est impossible : tu es obligé, à un moment donné, de faire une formation, de la payer, d'être accompagné, pour gagner toi à ton tour. Ce n'est pas possible autrement. Tu ne peux pas faire essai, erreur. Comme dit Rémy, tu ne sais pas ce que tu ne sais pas.",
      },
      {
        qui: "Yannick",
        texte:
          "Ce n'est pas parce que tu es bon dans un domaine que tu es bon sur tous les domaines. Et de nos jours, les techniques de communication, tout a évolué tellement vite : tu arrives sur Facebook, tu sais faire un truc, une semaine après c'est déjà obsolète.",
      },
      {
        qui: "Sylvie",
        texte:
          "Quand il me faisait le résumé des vidéos de Rémy, je lui disais : il faut absolument qu'on fasse une formation, parce que là, on est au bout de ce que ça avait fait. Pourtant, à la rentrée, on avait rajouté la pole, on s'est tout de suite rajouté des cours, des efforts, des préparations de cours. Et comme on ne faisait pas de pub, forcément, on a pris quelques abonnés, mais comme l'abonnement est sans engagement, il y a un turnover. J'avais dit, déjà l'an dernier, qu'on ne pouvait pas faire une année de plus comme ça. Et ne pas pouvoir se faire un resto, un théâtre, rien le week-end, parce que les cours, c'était samedi, dimanche.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et aujourd'hui, ça peut être intéressant de partager ce que vous avez mis en place, et ce que ça vous a permis de réaliser ces deux ou trois derniers mois.",
      },
      {
        qui: "Sylvie",
        texte:
          "On a lancé une formation high ticket. On a fait des modifications sur l'offre de l'abonnement, ça a déjà apporté beaucoup de choses, et on a lancé notre formation. On était super légitimes, puisque ça faisait cinq ans qu'on nous demandait une formation.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Juste pour préciser, pour toutes les personnes qui ne connaissent pas le terme high ticket : c'est le fait de vendre une formation au-delà de mille, deux mille, trois mille euros. Ça a été un vrai virage dans l'accompagnement, puisque ce n'est pas ce que vous aviez fait au tout départ. Vous aviez fait quelques modifications sur l'abonnement que vous aviez déjà, par rapport au tarif, par rapport à pas mal de choses. Mais le vrai virage, pour vous, ça a été de faire une formation high ticket, que vous avez lancée il n'y a pas si longtemps.",
      },
      {
        qui: "Sylvie",
        texte: "Deux mois, en fait, un peu plus de deux mois.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Félicitations. Je vous le redis, parce qu'on a déjà eu l'occasion d'échanger dessus. Ça a été vraiment un gros step. Vous aviez déjà votre notoriété, qui a joué, et c'est un point ultra important. Ce que vous avez fait, et c'est important de le partager, c'est que vous aviez déjà mis des choses en place, et on a accentué, on a travaillé sur ces choses-là pour proposer cette nouvelle formation, qui est pour les professionnels aussi, puisque c'est une particularité : on n'est plus seulement pour les particuliers.",
      },
      {
        qui: "Yannick",
        texte:
          "Ce qui faisait rager Sylvie depuis des années, c'est qu'on avait commencé finalement avec du high ticket : elle vendait des programmes privés à mille cinq cents euros. Et ensuite, on est passés sur la formule low cost, et là, on n'avait pas d'escalier.",
      },
      {
        qui: "Sylvie",
        texte:
          "C'est un sentiment que j'avais à la période où on n'avait que l'abonnement. Avant, quand on faisait les privés, on avait quand même une aura, dans le sens où tous les profs de pole et de yoga qui pratiquaient avec nous postaient leurs séances sur Facebook, sur Instagram. Et après, quand ça a été l'abonnement, on sentait quelque chose de beaucoup plus populaire, low cost, et les gens s'en servaient mais s'en vantaient moins. J'avais cette impression qu'on nous prenait pour du low cost, et on ne savait pas comment faire.",
      },
      {
        qui: "Yannick",
        texte:
          "Le gros du problème, qui vient de notre manque de culture marketing et stratégique, c'est que le low cost, au final, ça peut vraiment être très rentable. Mais quand tu as un volume de visibilité qui est en adéquation, c'est-à-dire quand tu touches des centaines de milliers de personnes.",
      },
      {
        qui: "Sylvie",
        texte:
          "Au lieu de tout enlever pour ne faire que du low cost, c'est à ce moment-là déjà qu'on aurait dû être accompagnés, pour mettre quelque chose à différents prix. Comme dirait Rémy, il y a des gens qui vont acheter pas cher, et il y a des gens qui ne voudront pas acheter ça et qui voudront autre chose, à un autre niveau. Et ça, on ne le savait pas. Ça a été beaucoup de frustration de sentir qu'il y avait un problème. Je me disais : est-ce qu'il ne faut pas qu'on mette un cours particulier, maintenant on est à trois cents euros de l'heure, à côté du trente euros ? En même temps, ça faisait bizarre. Et on était tellement occupés par tous ces cours que ça ne nous traversait pas l'esprit de faire une formation. On se disait qu'on la ferait quand on aurait explosé avec l'abonnement, on ne savait pas trop quand.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Est-ce qu'il y aurait un mot, pour les personnes qui hésitent encore à se lancer en regardant cette interview ?",
      },
      {
        qui: "Sylvie",
        texte:
          "Que ça aurait été une perte de temps d'attendre même une semaine de plus, franchement. Il y a des phrases que Rémy a dites dans la formation qui ont été des électrochocs, vraiment, et c'est ça qui nous a fait mettre en place des choses qui ont fait que notre chiffre a triplé. C'est une perte de temps d'attendre et de croire qu'on va y arriver par soi-même. C'est vraiment du temps perdu, et de l'énergie.",
      },
      {
        qui: "Yannick",
        texte:
          "Il ne faut pas sous-estimer la puissance de nos fausses croyances. C'est compliqué : une croyance, elle est fausse, mais c'est une croyance, donc c'est une certitude. Et du coup, tu es en boucle et tu ne t'en sors pas. Je crois qu'il n'y a pas meilleur argument que de dire que tu es obligé d'investir pour gagner plus. Il n'y a pas de secret. Je ne connais aucun procédé où tu es à un point A et où on te dit que sans rien, tu arrives à un point B. Ça n'existe pas. Tu es obligé de payer le prix du temps, le prix de l'enseignement.",
      },
      {
        qui: "Sylvie",
        texte:
          "Puis le savoir, l'expertise que quelqu'un a passé des années à acquérir.",
      },
      {
        qui: "Yannick",
        texte:
          "Et puis il faut avoir de l'humilité. Ce n'est pas parce que tu as un certain niveau quelque part que tu peux tout faire par toi-même. Ce n'est pas cohérent.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Chacun a son expertise. Comme vous avez la vôtre, c'est un nouveau métier, on en avait parlé ensemble : on doit apprendre un nouveau métier, et donc forcément ça nécessite du temps, ça nécessite aussi d'avoir de bonnes pratiques.",
      },
      {
        qui: "Sylvie",
        texte:
          "On a l'impression, sur internet, qu'on peut se former soi-même : tu regardes une vidéo, tu te dis qu'il y a déjà beaucoup de contenu dans cette vidéo. Mais la grosse différence, quand on rentre dans une formation, c'est la mise en application, et on vérifie derrière que tu as bien intégré cette nouvelle information et que tu la mets en pratique.",
      },
      {
        qui: "Yannick",
        texte:
          "Tu peux entendre tous les tutos que tu veux, si tu ne mets pas les choses en pratique correctement, comme dit Sylvie, tu perds du temps, mais dingue. Et il y a un truc auquel, là d'où on vient, on est très sensibles : on a peur de perdre des sous. Mais tout l'argent que tu ne gagnes pas par ton incompétence, c'est très difficile à évaluer.",
      },
      {
        qui: "Sylvie",
        texte: "Le manque à gagner, au final.",
      },
      {
        qui: "Yannick",
        texte:
          "Et il est immense. Ça passe par là : devenir responsable et se dire que parce qu'il me manque des compétences, tout l'argent qu'il y a en abondance autour de nous me passe entre les doigts. Et ce n'est pas la faute de la politique, de Pierre, de Paul ou de Jacques. C'est prendre la responsabilité de te dire que c'est parce que tu n'as pas les compétences.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Merci beaucoup. Je ne peux qu'être d'accord avec vous, parce que ce sont des choses qu'on voit, et des valeurs qu'on essaie de transmettre au maximum. Quoi qu'il arrive, bien sûr, ça demande du travail, vous l'avez très bien dit, c'est une réalité. Mais il y a aussi ce côté où se remettre en question, c'est essentiel, et à chaque étape du processus, même une fois qu'on est expert dans son domaine. Merci de les avoir partagées, et encore une fois, félicitations pour les résultats que vous avez eus.",
      },
      {
        qui: "Sylvie",
        texte: "Comme on l'avait dit en message, on en fera une deuxième, tu verras.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Avec plaisir. En tout cas merci beaucoup, et puis je vous dis à très très vite, et de toute façon on continue à travailler ensemble.",
      },
    ],
  },
  /* Deux notes sur cet entretien.

     **L'intervieweur est Geoffrey** : Olga le nomme au dernier tour de parole.

     **Deux noms de concurrents sont retirés de la transcription.** Olga cite
     nommément deux formateurs chez qui elle avait acheté avant, et dit de l'un
     que ça ne lui a servi à rien. C'est son opinion et elle a le droit de
     l'avoir ; la publier sur une page commerciale qui vend le programme
     concurrent, c'est du dénigrement de personnes nommées, et ce n'est pas à un
     agent d'engager la société là-dessus. Les tours de parole concernés sont
     conservés, sans les noms. Rémy décide s'il les remet. */
  {
    id: "vtfaka0m80",
    slug: "olga",
    titre:
      "Avis Funnels Club : Olga, 10 177 € en treize jours en restructurant son tunnel de vente",
    titrePage: "Avis Funnels Club : Olga, 10 177 € en treize jours",
    description:
      "Olga donne des conférences sur la communication non verbale. Elle raconte comment order bumps et up-sells ont fait passer son mois à 10 177 € dès le 13.",
    afficheAlt:
      "Olga en entretien vidéo avec Geoffrey, de Funnels Club, chacun depuis son bureau",
    chapo:
      "Olga donne des conférences en entreprise sur la communication non verbale, et vend des formations en ligne depuis sept ou huit ans. Elle raconte ici ce qu'elle a changé dans son tunnel de vente sans toucher à son webinaire.",
    sections: [
      {
        titre:
          "Des conférences en entreprise, puis des formations en ligne sur le langage corporel",
        paragraphes: [
          "Olga intervient en entreprise sur la communication non verbale, et ses clients sont de grosses sociétés. Il y a sept ou huit ans, on lui a suggéré de vendre aussi des produits en ligne, et elle s'est lancée. Avant le Covid, cette activité lui rapportait deux à trois mille euros par mois, et ça lui convenait : c'était du beurre dans les épinards.",
          "Puis le confinement est arrivé, et tout était déjà en place pour vendre. ==Elle a fait vingt-sept mille euros sur un mois==, en parlant de ses formations sans rien changer à son organisation. Elle le dit sans détour : elle avait l'impression d'avoir touché le loto.",
        ],
        citation: {
          texte:
            "J'épluchais mes carottes dans la cuisine, je parlais de mes formations, et ça vendait.",
          qui: "Olga",
        },
      },
      {
        titre: "Le plafond de verre : beaucoup d'efforts pour deux cents euros de plus",
        paragraphes: [
          "Après les confinements, le chiffre est redescendu à cinq mille euros par mois, au moment même où son activité de conférences repartait mal. Elle a beaucoup travaillé pour remonter à sept, huit, neuf mille, et là elle a buté.",
          "Son blocage n'est pas celui qu'on décrit d'habitude, et c'est ce qui rend son cas utile. Elle ne manquait pas de trafic : ==doubler la publicité ne doublait pas le chiffre==. Elle changeait le titre du webinaire, les mails, elle faisait des offres, pour un résultat sans rapport avec l'effort. Elle n'avait même pas conscience d'avoir un plafond, elle ne savait simplement plus quoi faire.",
        ],
        citation: {
          texte:
            "C'était beaucoup, beaucoup d'efforts pour gagner deux cents balles de plus à la fin du mois.",
          qui: "Olga",
        },
      },
      {
        titre: "Pourquoi elle a rejoint Funnels Club",
        paragraphes: [
          "Olga aime le benchmarking, regarder ce que font les autres. Une vidéo de Rémy est arrivée au bon moment sur YouTube, et elle s'est inscrite au webinaire pour voir comment il s'y prenait. L'entretien qui a suivi l'a amusée : elle y est allée en connaisseuse, elle en est ressortie convaincue, et admirative de gens qui font bien leur travail.",
          "Deux choses l'ont décidée, et aucune n'est une promesse de gains. D'abord le prix, plus bas que ce qu'elle imaginait. Ensuite l'accès dans la durée, qu'elle pratique elle-même avec ses propres clients. Vous pouvez faire le même repérage qu'elle : [le webinaire est en accès libre](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "J'ai trouvé ça vraiment jouissif de voir des gens qui font bien leur travail, que tout est bien fait.",
          qui: "Olga",
        },
      },
      {
        titre: "Ce qui l'a le plus aidée : une formation rangée, et des pages corrigées",
        paragraphes: [
          "Ce qu'elle retient d'abord, c'est que la formation est rangée : elle ne se perd pas dans un milliard de choses, et elle regarde une vidéo le matin, sur son iPad, parfois plusieurs fois. Elle apprécie aussi les ressources prêtes à reprendre.",
          "Mais ce qu'elle cite comme le plus rassurant, c'est la correction : pouvoir envoyer le lien d'une page qu'elle vient de faire et savoir si elle tient. C'est le même service que mentionne [Augustin Passy, coach en personal branding](/resultats/augustin-passy).",
        ],
        citation: {
          texte:
            "Savoir que je pouvais vous envoyer le lien d'une page que j'avais faite et que vous alliez me dire si c'est ok, c'est hyper rassurant.",
          qui: "Olga",
        },
      },
      {
        titre:
          "Ce qu'elle a changé : order bump, up-sells, fiches gratuites et publicité vidéo",
        paragraphes: [
          "Le détail de ce qu'elle a mis en place est la partie la plus concrète de l'entretien, et elle n'a pas touché à son webinaire, qui fait quatre-vingt-dix pour cent de son chiffre. Elle a ajouté ==un order bump de quarante euros, qui fait passer sa formation de trois cent soixante à quatre cents==, puis un premier up-sell à cent quatre-vingt-dix-neuf euros, puis un second.",
          "En parallèle, elle a créé cinq fiches PDF d'une seule page, gratuites, annoncées dans ses publications, ce qui lui a amené environ six cents contacts de plus en un mois. Elle a remplacé le « merci » de sa page de confirmation par une proposition à sept euros au lieu de vingt-quatre, qu'elle vend tous les jours. Et elle a tourné sa toute première publicité vidéo, après sept ans de publicité en texte. [Cédric a fait le même virage vers la publicité](/resultats/cedric), après des années de rédaction d'articles.",
        ],
        citation: {
          texte:
            "Je ne dis plus jamais merci. Je dis tout le temps félicitations, et je repropose un truc.",
          qui: "Olga",
        },
      },
      {
        titre: "Ses résultats : 10 177 € atteints le 13 du mois",
        paragraphes: [
          "Au moment de l'entretien, Olga a sa plateforme sous les yeux. On est le treize septembre, il est quatorze heures, et mille cent vingt-quatre euros sont rentrés depuis le matin. ==Le mois est à dix mille cent soixante-dix-sept euros et quatre-vingt-treize centimes, et ce n'est pas la fin du mois.== C'est la première fois.",
          "Elle rapporte ce résultat à la formation, et immédiatement après à son propre travail, dans cet ordre et sans qu'on le lui demande. Elle précise aussi avoir couvert la dépense en moins de trois semaines. Les [autres membres racontent la même chose dans des métiers très différents](/resultats).",
        ],
        citation: {
          texte:
            "Je suis à dix mille cent soixante-dix-sept euros au treize du mois. Tout ça, c'est clairement dû à la formation, et à mon travail.",
          qui: "Olga",
        },
      },
      {
        titre: "Son avis pour ceux qui hésitent, et sa mise en garde",
        paragraphes: [
          "Sa réponse est la plus nuancée des quinze, et c'est pour ça qu'elle est ici telle quelle : elle recommande, et dans la même phrase elle prévient. On ne passe pas de rien à dix mille euros le mois suivant, il y a un temps de mise en route, et il faut l'intégrer avant de commencer.",
          "Ce qu'elle décrit comme le vrai gain, c'est de payer pour regarder sérieusement au lieu d'accumuler des vidéos gratuites, et de transposer chez soi ce qui marche ailleurs. Si vous en êtes là, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [les articles de Rémy](/articles) reprennent ces mécaniques une par une.",
        ],
        citation: {
          texte:
            "Tu ne peux pas passer de je n'ai rien du tout à je fais dix mille tout de suite le mois prochain. Il y a un petit temps de mise en route qui est important.",
          qui: "Olga",
        },
      },
    ],
    transcription: [
      {
        qui: "Geoffrey",
        texte:
          "Salut, merci de faire l'interview avec moi aujourd'hui pour pouvoir partager ton parcours, les étapes que tu as suivies au sein de Funnels Club, et inspirer des personnes qui pourraient le voir. Pour commencer, est-ce que tu pourrais nous parler de toi, dans quelles conditions tu nous as rejoints, ce que tu fais, où tu en étais avant ?",
      },
      {
        qui: "Olga",
        texte:
          "Alors moi, à la base, je donne des conférences en entreprise sur la communication non verbale. Donc je parle de body language, et mes clients, ce sont des grosses boîtes. Il y a quelques années, on va dire sept, huit ans à peu près, on m'a suggéré de vendre des produits en ligne en me disant que j'aurais probablement du chiffre à faire, et je me suis lancée. Avant le Covid, je faisais deux ou trois mille euros de chiffre d'affaires par mois, et je trouvais que c'était confortable, parce que pour moi, c'était mettre du beurre dans les épinards. Je trouvais qu'avoir deux ou trois mille balles par mois, c'était bien.",
      },
      {
        qui: "Olga",
        texte:
          "Et puis le Covid est arrivé, et là, ça a explosé. Tout était en place pour vendre, et là, j'ai vendu sans rien faire. J'épluchais mes carottes dans la cuisine, je parlais de mes formations, et ça vendait. Je crois que le premier confinement, j'avais fait vingt-sept mille euros pour un mois. J'étais passée de deux, trois mille à vingt-sept mille. Là, j'avais l'impression de toucher au loto, clairement.",
      },
      {
        qui: "Olga",
        texte:
          "Et puis après les confinements, je suis redescendue. Mon business de la conférence s'était amoindri, je n'avais pas travaillé pendant trois ans, ça ne reprenait pas aussi bien pour tout le monde, ce n'était pas que moi. Et moi, j'avais quand même la chance d'avoir au moins ce business en ligne. C'était vraiment une sécurité, c'est évident. C'est redescendu à cinq mille euros, et je me suis dit : il faut que je réussisse à faire plus. Donc j'ai beaucoup bossé pour atteindre sept, huit, neuf. Mais je ne savais plus quoi faire d'autre pour augmenter mon chiffre d'affaires. Je n'avais pas envie de refaire un autre webinaire, parce que j'en ai un qui me rapporte quand même au moins quatre-vingt-dix pour cent de mon chiffre d'affaires. Donc je ne voyais pas comment changer et comment faire.",
      },
      {
        qui: "Olga",
        texte:
          "Et puis j'ai vu une vidéo de Rémy. Je crois que c'est arrivé au bon moment sur YouTube. Je crois que je l'avais déjà vu, mais je n'avais pas prêté attention : on voit quand même beaucoup de gens. J'avais souscrit à d'autres formations, il y a bien longtemps, avant le Covid. Une qui était une autre énergie, qui n'avait rien à voir avec le business en ligne, ça a duré un an et puis basta ; j'avais bien aimé à l'époque, mais ça ne m'a servi à rien. Et une autre qui donne des informations intéressantes, mais qui donne tellement d'infos qu'à un moment donné, tu te perds.",
      },
      {
        qui: "Olga",
        texte:
          "Et quand j'ai écouté Rémy, j'aime beaucoup faire du benchmarking, regarder ce que font les autres. Il proposait un webinaire, je me suis dit : tiens, je vais regarder comment il fait. Et suite au webinaire, il propose un entretien. J'ai regardé comment il fait. J'ai été bien closée, bien verrouillée par Maxime, qui était adorable, parce que moi, au départ, je disais : je connais la musique. Mais quelle technique. J'ai admiré, j'étais amusée, et j'ai trouvé ça vraiment jouissif de voir des gens qui font bien leur travail, que tout est bien fait. C'est très inspirant. Et la proposition m'a étonnée : je m'attendais à quelque chose de plus cher. Vraiment, parce que pour moi, closer, ça voulait dire dix mille balles. Donc quand il m'a annoncé le montant de la formation, je me suis dit : ok, je pensais que c'était plus cher. Après, c'était illimité en temps, et là pareil, j'ai trouvé ça très intéressant, parce que c'est ce que je fais moi aussi : je donne un accès illimité au temps de ma vie. Et puis j'ai adoré votre système de pouvoir se faire corriger.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Pour revenir sur l'étape d'avant, ce qui est super intéressant, je trouve, c'est que tu avais déjà du chiffre, tu avais déjà un business, et tu as eu ce moment où tu as eu une sorte de plafond de verre. Tu as eu le bon réflexe : tu n'as pas essayé de créer autre chose, tu n'as pas essayé d'aller dans un autre business, tu as voulu partir de ce que tu savais et aller plus loin. Quel a été pour toi l'obstacle principal quand tu as eu ce plafond de verre, avant de nous rejoindre ?",
      },
      {
        qui: "Olga",
        texte:
          "Le plafond de verre, bon, je n'avais pas conscience que j'avais un plafond. C'est juste que je ne savais pas comment faire. Je ne voulais pas recréer un autre webinaire, parce que je ne voyais pas ce que j'allais pouvoir refaire que je n'avais pas déjà. Payer plus de publicité, je l'ai fait, pour faire rentrer plus de gens dans le webinaire, mais si je doublais la pub, je ne doublais pas le chiffre, pas du tout. À un moment donné, tu rechanges le titre du webinaire, tu rechanges les mails du webinaire, je faisais des offres, mais c'était beaucoup, beaucoup d'efforts pour gagner deux cents balles de plus à la fin du mois. Je n'avais pas cette conscience du plafond de verre, mais j'avoue que je n'arrivais pas à dépasser. Déjà, dépasser les sept, huit, ce n'était pas mal, et j'ai conscience que ce n'est pas si mal que ça. Mais je savais que je pouvais faire plus.",
      },
      {
        qui: "Geoffrey",
        texte:
          "C'était ce que tu venais rechercher. Et c'est le côté correction qui t'a vraiment aidée à passer l'étape d'après ?",
      },
      {
        qui: "Olga",
        texte:
          "Pourquoi j'ai adhéré ? Parce que déjà, je pensais que c'était plus cher. Ensuite, parce que la proposition des cours, je trouvais ça intéressant. J'ai aimé cette façon d'être assez accessible, de ne pas trop se la péter. Le côté un peu simple, je n'ai pas besoin de me la raconter, j'aime ça aussi. Il y a eu un truc qui fait que. Et puis je pouvais me payer la formation. Et il y avait aussi, comme dans toutes les formations en ligne, moi je fais pareil, la possibilité de dire non, finalement ça ne me plaît pas, au bout de quelques jours. Bref, tout ça fait que je me suis dit : ouais, j'y vais. Et j'ai vraiment beaucoup apprécié. Je n'ai pas tout regardé, mais vraiment, j'aime bien.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Qu'est-ce qui t'a le plus plu dans ce que tu as pu voir ?",
      },
      {
        qui: "Olga",
        texte:
          "Je trouve que la formation est accessible, c'est-à-dire qu'elle n'est pas compliquée, dans le sens où elle est bien rangée. Je ne me perds pas dans un milliard de trucs. Moi, j'aime bien, avec mon iPad, le matin au petit déjeuner, regarder une vidéo. Le premier mois, j'ai regardé des vidéos, je les ai même regardées plusieurs fois, des fois. J'ai aimé aussi le fait qu'il y ait des ressources, même si je ne maîtrise pas vraiment Notion, que je connaissais de nom. J'ai bien aimé le fait qu'il y ait des ressources, que je pouvais copier-coller des trucs. Je trouve que c'est aidant. Et l'idée de savoir que je pouvais vous envoyer le lien d'une page que j'avais faite et que vous alliez me dire : c'est ok, ce n'est pas ok, ou tu changerais, c'est hyper rassurant et ça fait vraiment plaisir. Et du coup, tu te dis : ok, allez, je fais, et puis je leur montre. Ça fait un côté élève, prof, mais on s'en fout. Moi, j'ai adoré ça, je trouve ça chouette.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci pour ces compliments. Et aujourd'hui, est-ce qu'on peut parler chiffres ensemble, sur ce que tu as pu atteindre et sur ce qui s'est passé depuis que tu as rejoint ?",
      },
      {
        qui: "Olga",
        texte:
          "Je suis sur ma plateforme, j'ai l'écran sous les yeux. Aujourd'hui, depuis ce matin, il est quatorze heures pour être clair, j'ai mille cent vingt-quatre euros qui sont rentrés depuis ce matin. Et on est le treize septembre, donc c'est pour dire que je ne suis pas à la fin du mois. Et là, c'est la première fois : je suis à dix mille cent soixante-dix-sept euros quatre-vingt-treize centimes, au treize du mois. Donc je suis contente. Et tout ça, c'est clairement dû à la formation. À mon travail, à mon interprétation, à l'inspiration, mais à la formation.",
      },
      {
        qui: "Olga",
        texte:
          "Alors moi, je ne voulais pas changer mon webinaire, déjà. Pour l'instant, je ne me sens pas capable de refaire un webinaire, de faire du closing. Si je ne le sens pas, je ne le fais pas. Donc j'ai déjà amélioré la page de capture, mais je n'ai pas encore suffisamment de recul pour savoir si elle est mieux. Vous me l'avez validée, mais je n'ai pas encore de recul. Le webinaire est le même. J'ai fait un entretien avec Rémy, parce que j'y avais droit, et il m'a dit : puisque tu vends ton produit à trois cent soixante euros, on va essayer d'augmenter le panier moyen. Parce qu'il faut dire que mon plus cher produit, c'est trois cents balles.",
      },
      {
        qui: "Olga",
        texte:
          "J'ai commencé par faire un order bump à quarante euros. Donc j'ai un order bump qui fait que de trois cent soixante, on passe à quatre cents. Donc je vends régulièrement à quatre cents. Ensuite, je fais un up-sell à cent quatre-vingt-dix-neuf euros, les fameux up-sells que j'ai regardés vingt fois. Et ensuite, je viens de mettre en place un up-sell numéro deux. C'est tout récent, j'ai fait les vidéos des pages d'up-sell, j'ai mis ça en place début septembre, donc ça fait quelques jours. Je n'ai pas beaucoup de recul par rapport à ça, mais je suis sûre que ça va augmenter le panier moyen, j'en suis certaine.",
      },
      {
        qui: "Olga",
        texte:
          "Par contre, comme j'avais déjà des clients de ma formation à trois cent soixante euros, je leur ai envoyé un mail pour leur dire : vous n'y avez pas eu droit, mais depuis quelques jours, je propose ce pack. Et là, en envoyant les mails, je n'ai pas calculé, mais depuis hier, j'ai une dizaine de ventes. Ça fait plaisir. Tout le monde ne va pas acheter, c'est sûr, mais ça fait plaisir.",
      },
      {
        qui: "Olga",
        texte:
          "Par contre, j'ai mis en place un truc dont l'idée m'a été donnée en regardant Rémy, et je suis super contente de l'avoir fait, parce que c'est hyper simple. J'ai mis en place des fiches à télécharger. Dans une des vidéos, il dit que le produit gratuit n'a pas besoin d'être hyper élaboré, quarante-huit pages, et cetera. Ça peut être juste une page. Alors moi, j'ai fait un PDF, un recto seulement. Bon, j'ai fait cinq PDF. Comme moi je parle du langage corporel, c'est la signification des mains, les zones du visage quand tu te grattes, les postures, et cetera. Je fais un post sur les réseaux sociaux, je dis : je vous ai préparé une fiche récap, elle est gratuite, si vous voulez la télécharger, cliquez là. Pour l'instant j'en ai fait cinq, mais je sais qu'il va falloir que j'en fasse plus. Donc à chaque post, je mets : télécharger la fiche gratuite.",
      },
      {
        qui: "Olga",
        texte:
          "Chose que j'avais faite au départ et qui n'avait pas marché : je ne proposais rien et je disais merci. Et là, je ne dis plus jamais merci. Je dis tout le temps félicitations. Félicitations, la fiche est bien en route sur votre boîte mail. En attendant, et ça j'adore cette phrase, elle me fait trop rire parce qu'elle est gravée là : en attendant, que diriez-vous d'acheter mes livres pour sept euros au lieu de vingt-quatre ? Et j'en vends tous les jours. Je ne peux pas te dire que j'en vends une centaine, ce n'est pas vrai, puisque c'est sur les réseaux sociaux et que je ne fais pas de pub. Mais tous les jours, il y a des gens qui rentrent. Les nouveaux contacts, le mois dernier, c'était la première fois que je mettais ça en place : j'avais eu six cents personnes en plus, je crois, par rapport à d'habitude.",
      },
      {
        qui: "Olga",
        texte:
          "Et suite à cet achat de sept, je ne dis toujours pas merci, je dis félicitations, et je repropose un truc. C'est le deuxième. Je transforme moins, et je n'ai pas encore fait les chiffres parce que tout ça est très récent. Mais des fois, je vois des quarante-neuf passer, et le quarante-neuf, il est dû aux sept. Ça, c'est très jouissif, parce que tous les jours tu vois qu'il y a du mouvement et que les gens rentrent. Évidemment, à chaque fois, je propose mon webinaire en lien : inscris-toi, c'est gratuit. Donc il y a beaucoup plus de monde. Ça, c'est vraiment chouette.",
      },
      {
        qui: "Olga",
        texte:
          "Et là, j'ai tourné, et je suis en train de terminer avec le monteur : j'ai fait pour la première fois une publicité vidéo pour le webinaire. Parce que moi, depuis sept ans au moins, c'est une publicité texte, donc ce qui transforme le moins, et j'arrive à rouler avec ça. Donc là, je me lance dans la publicité vidéo. Ça aussi, c'est dû à Rémy.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Juste pour remettre un peu de contexte pour les personnes qui n'ont pas toutes les infos, parce qu'on a parlé un peu technique. Ce dont tu parlais, c'est la mise en place de ton tunnel : à la base, tu avais un seul produit, et ensuite tu as retravaillé un peu l'offre pour proposer des offres successives, donc les fameux up-sells, les fameux order bumps. C'est super intéressant, parce que tu as restructuré ton offre avec ce que tu avais. Tu as recréé certaines choses, mais tu n'as pas eu besoin de tout remodifier.",
      },
      {
        qui: "Olga",
        texte:
          "Non, je ne voulais pas. J'ai mis les order bumps partout, et petit à petit, je vais tout restructurer. Mais j'avais besoin d'y aller petit à petit, je ne peux pas tout faire en même temps. Au début, ça fout un peu les boules, parce qu'on a l'impression qu'on est pressé, on veut tout faire. Mais en tout cas, je suis contente quand même.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Félicitations, ce sont de super chiffres que tu nous as partagés. Est-ce que tu aurais un mot à dire aux personnes qui regardent cette interview et qui hésiteraient encore à entrer en contact avec l'équipe pour rejoindre Funnels Club ?",
      },
      {
        qui: "Olga",
        texte:
          "Moi, je ne peux que dire que c'est une super idée de vous rejoindre. Je pense que l'argent, il est bien investi. Moi, je l'ai amorti. Moi, j'avais déjà des choses en place. J'espère que les gens ne se font pas d'illusions, dans le sens où vous êtes assez clairs dans votre discours : tu ne peux pas passer de je n'ai rien du tout à je fais dix mille tout de suite le mois prochain. Il faut quand même mettre le temps de la plateforme, tout ça. Il y a un petit temps de mise en route qui est important, que les gens doivent intégrer, c'est évident.",
      },
      {
        qui: "Olga",
        texte:
          "Mais à ceux qui sont comme moi et qui ont déjà quelque chose, franchement, je trouve ça très enrichissant, et plus puissant que de regarder des vidéos gratuites : payer une formation, la regarder sérieusement, et se dire : ok, lui, il fait ça pour le régime, ou pour des trucs de bourse, comment je peux, moi, faire quelque chose qui ressemble ? Tout ça, je connaissais, mais vous avez une façon de montrer l'exemple qui, pour moi, est assez pédagogique et qui me convient bien. Donc moi, je dirais évidemment qu'il ne faut pas hésiter. Je n'ai pas fait le calcul exact, mais je sais qu'au bout de même pas trois semaines, j'avais déjà couvert la dépense de la formation.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Ce sont de très beaux chiffres, c'est aussi du travail, et tu fais bien de le rappeler : même si bien sûr on t'a aidée, le travail est venu de toi. C'est quelque chose sur lequel on va être transparents aussi, c'est important pour nous que les personnes aient conscience de cette partie-là, donc merci de le rappeler. Forcément, ça dépend aussi de là où on en est, pour une personne qui a déjà un business qui tourne ou pas. Merci beaucoup, Olga. Est-ce que tu voulais partager autre chose ?",
      },
      {
        qui: "Olga",
        texte:
          "Écoute, non. Merci beaucoup, ça me fait très plaisir de témoigner, parce que déjà ça me permet de te connaître en vrai, enfin en vrai via un écran, et pas seulement via nos échanges. Et vraiment, je suis très heureuse, c'est chouette, ça me fait plaisir.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci beaucoup pour ce témoignage, et merci pour l'inspiration que tu vas apporter à d'autres personnes. Rien que le fait d'être une femme qui montre qu'elle avait déjà quelque chose, et qui va pouvoir inspirer d'autres femmes : on voit dans la formation qu'on a la chance d'avoir pas mal de profils, vraiment mixtes, et je trouve que c'est une très belle chose, parce qu'aujourd'hui on parle très peu de cette partie-là. Donc merci pour ce témoignage, félicitations encore pour tes résultats, et de toute manière on se retrouve de l'autre côté.",
      },
      {
        qui: "Olga",
        texte: "D'accord, merci Geoffrey.",
      },
    ],
  },
  /* L'intervieweur n'est pas nommé et n'est pas Rémy : Sandrine les remercie
     tous les deux séparément au dernier tour de parole. Les tours lui sont
     rendus sous « Funnels Club ».

     La reconnaissance vocale écrit « Game Design » partout : c'est « cake
     design », Sandrine ayant été cake designer. Corrigé comme un nom propre
     écorché, ce que la règle autorise. */
  {
    id: "fbtr4dqoji",
    slug: "sandrine",
    titre:
      "Avis Funnels Club : Sandrine, 22 000 € en trois mois avec une formation pour cake designers",
    titrePage: "Avis Funnels Club : Sandrine, 22 000 € en trois mois",
    description:
      "Sandrine a monté sept entreprises physiques en Martinique. Elle raconte comment elle a digitalisé son métier de cake designer, et ce qui l'a bloquée un an.",
    afficheAlt:
      "Sandrine en entretien vidéo avec Funnels Club, depuis la Martinique",
    chapo:
      "Sandrine a quarante-trois ans, vit en Martinique et a créé sept entreprises depuis ses vingt et un ans, toutes physiques. Elle raconte son passage au digital, et surtout les six mois de pause qu'il lui a fallu au milieu.",
    sections: [
      {
        titre:
          "Sept entreprises physiques, et l'envie d'un modèle qui ne dépende plus d'un local",
        paragraphes: [
          "Sandrine se décrit comme une serial entrepreneuse : sept entreprises créées depuis ses vingt et un ans, certaines avec un local et des employés, d'autres en indépendante. Elle ne regrette rien, elle dit même que c'est son kif, mais elle décrit précisément ce qui use.",
          "D'un côté ==la charge mentale des fins de mois==, quand il faut payer toutes les charges avant de savoir ce qui reste. De l'autre, en indépendante, courir en permanence après les clients. Elle voulait se poser dans sa vie de famille, voyager, et elle s'était promis de prendre sa retraite à quarante ans.",
        ],
        citation: {
          texte:
            "Là, je me suis sentie un peu fatiguée. J'avais envie de me poser dans la vie de famille que j'ai, de voyager.",
          qui: "Sandrine",
        },
      },
      {
        titre:
          "Ce qu'elle cherchait et qu'une première formation ne lui avait pas donné",
        paragraphes: [
          "Sandrine avait déjà suivi une formation qui enseignait le tunnel de vente. Elle dit y avoir trouvé la méthode, mais pas l'accompagnement : des séances de groupe, et personne pour répondre à une question précise sur son cas à elle.",
          "C'est ce qu'elle nomme comme le vrai plus du programme : poser une question et avoir une réponse le soir ou le lendemain. Elle le compare à avoir un coach à côté de soi, qui dit si ce qu'on fait tient. [Tatiana insiste sur le même point](/resultats/tatiana). Vous pouvez voir la méthode avant de parler à qui que ce soit : [la formation est en accès libre](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "On peut vraiment te poser une question, et le lendemain ou le soir grand maximum, tu y réponds. C'est comme si j'avais un coach à côté de moi.",
          qui: "Sandrine",
        },
      },
      {
        titre: "Deux mois pour tout mettre en place, et un mur au moment du lancement",
        paragraphes: [
          "Elle démarre en avalant la formation, envoie ses travaux par quatre tous les jours, et en moins de deux mois presque tout est prêt. Puis le lancement arrive, et il ne se passe rien, pour une raison qui n'a rien de technique.",
          "Son premier produit portait sur la perte de poids. Elle avait déjà beaucoup maigri, mais pas assez à ses yeux pour être crédible, et ==elle n'arrivait pas à se montrer==. S'y ajoutait la peur des commentaires : elle avait tenu des commerces dans une île de quatre cent mille habitants, et le digital l'exposait au monde entier.",
        ],
        citation: {
          texte:
            "Au moment du lancement, il manquait quelque chose : c'était de pouvoir me montrer.",
          qui: "Sandrine",
        },
      },
      {
        titre: "Les six mois de pause qu'elle assume, et pourquoi ils comptent",
        paragraphes: [
          "C'est la partie de son témoignage qu'elle tenait le plus à raconter. Après une discussion avec Ludivine, la coach mindset du programme, elle comprend que rien ne sert de continuer à construire tant que cette question-là n'est pas réglée. Elle s'arrête six ou sept mois et se fait accompagner, à ses frais, par une spécialiste de l'estime de soi.",
          "Ce qui l'a aidée à tenir pendant cette pause, ce sont les autres membres : elle voyait sur le groupe des gens réussir et se disait qu'ils n'avaient rien de plus qu'elle. C'est exactement ce que raconte [Christian Joyce, qui doutait de sa niche](/resultats/christian-joyce).",
        ],
        citation: {
          texte:
            "Cette personne-là, elle a réussi, elle n'a rien de plus que moi. Donc s'ils ont réussi, c'est qu'il y a un moyen de réussir.",
          qui: "Sandrine",
        },
      },
      {
        titre:
          "Ses résultats : 22 000 € en trois mois pour 600 € de publicité",
        paragraphes: [
          "Elle revient avec un projet qui lui parle vraiment : une formation destinée à ceux qui veulent devenir cake designers professionnels, un métier qu'elle a exercé avec succès pendant trois ou quatre ans. Elle la lance début novembre, en version bêta à sept cent cinquante euros.",
          "Trois mois plus tard, elle est à ==une trentaine de ventes, soit environ vingt-deux mille euros==, pour cinq à six cents euros de publicité. Elle annonce aussi son taux de conclusion, autour de soixante pour cent : une cinquantaine d'appels pour une trentaine d'élèves. Et comme elle a ouvert le paiement en dix fois, elle a environ deux mille euros assurés chaque mois sur l'année.",
        ],
        citation: {
          texte:
            "Six cents euros de publicité pour vingt-deux mille. Quand on voit le ratio, c'est incroyable.",
          qui: "Sandrine",
        },
      },
      {
        titre: "Ce qui a changé pour elle, et qu'elle ne mesure pas en euros",
        paragraphes: [
          "Le passage où elle est le plus émue ne parle pas de chiffre. Une esthéticienne lui a fait remarquer qu'elle avait l'air détendue, ce qui ne lui arrivait pas. Elle a mis un moment à comprendre pourquoi : ==elle n'a plus à trouver des clients avant la fin du mois pour assurer le mois==.",
          "Elle dit se sentir comme si elle avait presque un an de vacances devant elle, tout en lançant déjà un autre projet et en déléguant à un closer et à un assistant. Son objectif suivant est de monter à cinq puis dix mille euros par mois pour vivre la vie de voyage qu'elle visait. Les [autres membres racontent des bascules comparables](/resultats).",
        ],
        citation: {
          texte:
            "Quand on est entrepreneur, c'est à nous de créer notre salaire, et même si je l'ai fait toute ma vie, il y a des moments où c'est épuisant.",
          qui: "Sandrine",
        },
      },
      {
        titre: "Son avis pour ceux qui hésitent à prendre l'appel",
        paragraphes: [
          "Sa réponse est adressée à un profil précis, et elle le dit : quelqu'un qui a l'âme entrepreneuriale, qui veut se lancer ou qui a déjà un business à digitaliser. Elle ajoute une condition sans laquelle rien de ce qu'elle raconte ne tient, et elle la répète deux fois.",
          "Ce qu'elle met en avant en dernier n'est ni la méthode ni le prix, mais le fait de ne pas avoir été lâchée pendant sa pause. Si vous en êtes au même point, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [le podcast de Rémy](/podcast) revient souvent sur ce blocage-là.",
        ],
        citation: {
          texte:
            "Si la personne a fait le job, je suis l'exemple que ça fonctionne.",
          qui: "Sandrine",
        },
      },
    ],
    transcription: [
      {
        qui: "Funnels Club",
        texte:
          "Merci d'avoir accepté aujourd'hui de faire cette interview avec nous pour expliquer un petit peu ton parcours, tout ce que tu as fait à travers Funnels Club, et les résultats que tu as pu avoir. Le but, aujourd'hui, c'est que tu puisses raconter tout ça pour inspirer d'autres personnes qui hésiteraient à se lancer. Pour commencer, est-ce que tu peux expliquer qui tu es et ce que tu fais aujourd'hui comme activité ?",
      },
      {
        qui: "Sandrine",
        texte:
          "Alors moi, je m'appelle Sandrine, je vis en Martinique, j'ai quarante-trois ans, et on va dire que je suis ce qu'on appelle une serial entrepreneuse. J'ai créé plusieurs entreprises, j'en suis à ma septième aujourd'hui, et j'ai toujours eu des business physiques depuis mes vingt et un ans. Et là, j'avais vraiment envie de partir sur un nouveau modèle, un business en ligne. Donc en regardant des vidéos sur YouTube, je tombe sur la publicité de Rémy, qui m'interpelle, puisque je suis dans cette dynamique et que je vois que c'est presque l'avenir, en tout cas pour moi. Et la façon dont il le dit, on a l'impression d'avoir quelqu'un qui sait de quoi il parle. Après l'avoir vu plusieurs fois, je clique et je rentre dans le programme. Et là, j'en ai vraiment pour mon argent, parce que j'en ai bouffé, des formations, je suis un petit peu accro d'ailleurs, à toujours apprendre de nouvelles techniques. Je maîtrise plusieurs métiers aussi.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Qu'est-ce qui t'a poussée, toi qui as toujours connu le business physique depuis assez jeune, à aller vers le digital à ce moment-là ?",
      },
      {
        qui: "Sandrine",
        texte:
          "En fait, j'ai eu deux entreprises avec des locaux, donc un local où on paye, des employés, et les autres où c'était plus en indépendante. Avec les employés, on le sait, il y a une charge mentale, puisqu'à la fin du mois il faut pouvoir payer toutes les charges, et ce qui reste pour nous, c'est bien quand il reste quelque chose. Et tout ce qui était en freelance, pareil : toujours courir après les clients. Là, je me suis sentie un peu fatiguée. Ça a été très intense, sept entreprises, j'ai créé plusieurs produits. Et je ne regrette absolument rien, c'est mon parcours et c'est mon kif, l'entrepreneuriat. Mais là, j'avais envie de me poser dans la vie de famille que j'ai, de voyager, et j'avais toujours dit que j'allais prendre ma retraite à quarante ans. Et là, je me dis que trois ans après, ce n'est toujours pas fait. Pour moi, le digital me permet ça niveau voyage, tout en continuant dans l'entrepreneuriat, et même d'avoir des clients et d'avoir de la valeur dans ce que je propose. Ayant plusieurs produits, plusieurs talents, je me suis dit : on va faire plusieurs petits business digitaux, grâce à Rémy.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et quelle était pour toi la problématique ? Est-ce que tu avais déjà lancé quelque chose à ce moment-là, ou c'était vraiment la première fois que tu voulais lancer quelque chose dans le digital ?",
      },
      {
        qui: "Sandrine",
        texte:
          "Alors, j'avais déjà fait une formation qui proposait ce process de tunnel de vente. Ce n'était pas suffisamment poussé pour moi en termes d'accompagnement : il y avait les coachings communs, mais il n'y avait pas les coachings en privé, comme on a avec toi ou d'autres personnes qui répondent aux questions. Pour moi, le vrai plus de votre programme, c'est vraiment ça. On peut vraiment te poser une question, et le lendemain ou le soir grand maximum, tu y réponds. Et ça, c'est magnifique, parce qu'on se dit : c'est comme si j'avais un coach à côté de moi, qui me pousse, qui me motive, et puis qui me dit si ce que je fais est bien ou pas. Et ce que je n'avais pas trouvé chez lui non plus, c'est beaucoup de petites choses sur la publicité, que j'ai trouvées chez vous. Quand j'ai eu le closing, je l'ai dit à Maxime : je sens qu'avec Rémy, il y aura ce petit truc qui me manque.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Donc si je comprends bien, ce qui t'avait manqué jusque-là, c'était vraiment l'accompagnement, avoir des personnes pour répondre à toutes tes questions. En quoi ça a été quelque chose qui t'a aidée plus que le reste ?",
      },
      {
        qui: "Sandrine",
        texte:
          "Pour moi, c'est le point super important, parce que même si je suis quelqu'un de particulièrement tenace, quand j'ai une idée en tête, je ne lâche pas le morceau, j'aime les défis. Mais il faut quand même être honnête, c'est un défi à relever de se dire : on a une idée, on veut en faire un business digital. Même si c'est un peu la mode, et que tout le monde veut faire ça, il y a vraiment du travail derrière. Quand je suis arrivée, je pense que tu t'en souviens, j'ai bouffé la formation, je vous envoyais des fiches par quatre tous les jours. J'ai vraiment eu cet effet, je me suis dit : mais purée, il y a tout, c'est vraiment très complet, c'est des heures de formation, et c'est très bien à appliquer. Et je me suis dit que si je faisais le job comme il faut, ça allait le faire. Vraiment, deux mois, je me souviens, j'étais à fond, j'ai bien fait le truc. Et au moment du lancement, il manquait quelque chose : c'était de pouvoir me montrer.",
      },
      {
        qui: "Sandrine",
        texte:
          "L'accompagnement m'a permis de vaincre ce blocage-là, que je n'aurais pas pu passer sans l'aide de Ludivine. Ludivine, c'est votre coach mindset, qui aide à débloquer les blocages psychologiques. Donc là, en l'occurrence, de pouvoir me montrer. Faire cette vidéo, c'est un exercice aussi, mais je suis beaucoup plus à l'aise aujourd'hui. Et toi, de pouvoir nous dire si c'est bien ou si ce n'est pas bien, ce qu'on a fait, et toujours avec beaucoup d'humanité. Je te le disais assez souvent : tu prends le temps, tu prends des pincettes. C'est ce plus-là qui a fait que, par rapport à d'autres formations sans l'accompagnement, je ne serais pas passée réellement à l'action. Et donc j'en serais restée au même point, et c'est dommage, parce qu'une fois qu'on a réussi le premier client, je pense qu'après c'est réglé, ce sont des petits rouages. Le plus dur, c'est le premier client, les premiers mille euros.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Je suis totalement d'accord avec toi, et c'est d'ailleurs ce qui est très inspirant dans ton parcours : ce côté tenace, le fait de pouvoir continuer, de pouvoir essayer. Tu es rentrée, tu as fait les choses très vite dans la formation, puisqu'en même pas deux mois tu avais presque tout fait, tu avais lancé, tu avais un produit. Qu'est-ce qui s'est passé après ces deux mois, dès que tu as lancé ?",
      },
      {
        qui: "Sandrine",
        texte:
          "Le premier produit, je précise, parce qu'il y a eu plusieurs produits. Au départ, le contrat avec vous, c'est un produit, un tunnel, deux maximum, et normalement c'est censé le faire. Moi, je suis arrivée, on a pris trois produits si je ne me trompe pas, mais ça, c'est dans ma personnalité. Je fais un parallèle : étant multipotentielle, je pense que je suis une cliente assez compliquée, dans le sens où on commence un projet, on est hyper emballé, et puis on se dit : ah non, évidemment, ça c'est mieux, et ça aussi. Et tu ne m'as pas lâchée. Sur ça, je dis merci, et je veux le dire pour tous les profils qui pourraient se reconnaître en moi. C'est important, parce que vous auriez très bien pu dire : écoute, c'est un seul projet, on ne va pas pouvoir. Et vous ne m'avez pas lâchée.",
      },
      {
        qui: "Sandrine",
        texte:
          "Et ce qui ne s'est pas fait, c'est que le premier produit n'était pas adapté à ce que je voulais vraiment faire. Je te rappelle, c'était sur la perte de poids. C'est un projet qui reste toujours à côté, bientôt peut-être, mais je n'étais pas prête à ce moment-là. J'avais déjà perdu beaucoup de poids, mais je n'en avais pas perdu suffisamment, je pense, pour être crédible, et donc je n'arrivais pas à me montrer. Et puis aussi par rapport à l'estime de moi.",
      },
      {
        qui: "Sandrine",
        texte:
          "Ensuite, j'ai fait une pause, suite à une discussion avec Ludivine, où elle m'a dit : avant de continuer à faire tout ce qu'il y a à faire, le plus important, c'est de gérer ça. Si j'ai des haters, je ne vais pas savoir le gérer. Le cours sur les haters explique pourquoi il y a des haters, qu'il faut l'accepter, il l'explique très bien sur le papier, mais quand on n'est pas prêt, c'est compliqué. Et je me suis dit : je veux aller dans le digital, je vais être vue par plein de gens. Quand je faisais mes petits business en Martinique, les gens, je les connaissais, il y a quatre cent mille habitants, ça va. Mais là, je me suis dit : je vais être vue par le monde entier, et les gens sont méchants.",
      },
      {
        qui: "Sandrine",
        texte:
          "Donc j'ai fait une grosse pause, bien six mois, je crois, six ou sept mois, et j'ai vu quelqu'un qui est spécialisé dans l'estime de soi. J'ai fait un accompagnement en parallèle, qui a un coût aussi, mais qui vaut mille fois le prix, d'ailleurs pareil pour vous, et qui m'a permis de guérir de certaines choses qui étaient très nécessaires. Et puis après, je suis revenue plus belle. Je me suis dit : j'ai un gros projet qui me parle, par rapport à un business que j'avais en tant que cake designer. Je vais apprendre aux personnes qui veulent faire ce métier de cake designer professionnel à se lancer, puisque moi, j'avais très très bien réussi pendant trois, quatre ans. J'ai repris tout ce que j'avais appris avec les deux autres projets qu'on avait faits avant, et là, ça a cartonné très vite, en un mois.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Merci de nous la partager, parce que c'est une partie un peu à côté du business pur, mais on avait aussi échangé longtemps là-dessus : qu'est-ce que tu voulais vraiment faire ? C'était important pour nous d'aller sur quelque chose qui avait du sens par rapport à tes objectifs. C'est pour ça que je trouve ça très inspirant : tu as su te remettre en question, aller en discuter avec quelqu'un d'autre, faire les rendez-vous avec Ludivine, nous partager les éléments sur lesquels tu n'étais pas alignée. Et ensuite, retourner au travail, te remettre sur toutes ces choses que tu avais déjà vues, qu'on a repris, qu'on a remis en place. Au final, tu as su passer au-dessus de tes peurs. Aujourd'hui, est-ce que tu peux nous partager les chiffres que tu as réussi à faire, et depuis combien de temps c'est lancé ?",
      },
      {
        qui: "Sandrine",
        texte:
          "Alors, j'ai lancé Cake Design Business, donc pour les cake designers qui veulent se lancer, débutants ou avancés, début novembre. Donc là, ça va faire à peu près trois mois. J'ai commencé avec une version bêta test à sept cent cinquante euros, que je vais augmenter, et je suis à une trentaine de ventes, donc à peu près vingt-deux mille euros sur deux ou trois mois. Mais ce qui est vraiment incroyable, c'est que je ne suis pas acharnée dessus, j'y vais tranquillement, contrairement au tout début. Là, je suis beaucoup plus posée. J'ai dû mettre peut-être cinq cents ou six cents euros de publicité, donc quand on voit le ratio, c'est incroyable. Et en plus, en termes de closing, je suis à peu près à soixante pour cent : pour ces trente élèves-là, j'ai dû avoir peut-être cinquante appels.",
      },
      {
        qui: "Sandrine",
        texte:
          "Après, j'ai ce côté agence de com, j'aime ça, et puis je parle de mon bébé, donc forcément. Je parle à des mamans qui, pour la plupart, n'ont pas un budget excessif, et malgré ça, elles ont envie, elles me font confiance. Les scripts de closing, ça fonctionne, et moi-même je mets en confiance sur ce que je promets. Donc je me dis : six cents euros de publicité pour vingt-deux mille, avec une plateforme vidéo, parce que moi j'ai une formation en vidéo evergreen, plus un petit accompagnement pendant trois mois où on peut poser des questions en direct. Donc un peu comme ce que vous faites. Et avec trente élèves, puisqu'elles vont payer en dix fois, j'ai permis de payer en plusieurs fois parce que je suis sur une cible qui n'a pas un gros portefeuille, j'ai deux mille euros assurés tous les mois, là, pendant un an, pour trente élèves.",
      },
      {
        qui: "Sandrine",
        texte:
          "Et ça, c'est très nouveau pour moi. Je t'en parle, je suis un peu émue, parce que dernièrement, je vais faire un massage, et on me dit : mais tu as l'air détendue, il y a un truc sur ton visage, c'est bizarre, tu as l'air hyper détendue. Moi qui stresse tout le temps. Et je dis : je ne sais pas, j'ai des revenus qui tombent en automatique, c'est peut-être ça. En fait, je ne suis pas stressée à me dire qu'il faut que je trouve tant de clients à la fin du mois pour assurer mon mois. Parce que quand on est entrepreneur, quelle que soit l'activité, c'est à nous de créer notre salaire, et ça, même si je l'ai fait toute ma vie, il y a des moments où c'est épuisant. Il y a des moments où on n'a pas le droit d'être malade.",
      },
      {
        qui: "Sandrine",
        texte:
          "Donc là, je me sens en détente, comme si j'avais presque un an de vacances. Alors je ne saurais pas le faire, parce que je suis hyper active, mais je suis déjà en train de lancer un autre projet en parallèle, et j'ai pris un closer et un assistant pour déléguer. Ça aussi, c'est très nouveau. Je fais un petit parallèle : j'ai bien compris dans la formation qu'il faut déléguer. Donc je mets tout ça en place, et je suis détendue. Et ce truc-là, il n'a pas de prix. Parce que si, juste avec deux mille euros assurés par mois, mes charges quotidiennes sont assurées, je me dis : mais avec soixante, quatre-vingts élèves, et en plus avec tous les autres projets que je veux mettre en place. Pour moi, c'est ça, la liberté. Je suis déjà dans la liberté. La marche suivante, c'est de pouvoir être à cinq mille, dix mille, pour être dans cette vie de voyage. Mais déjà là, l'objectif est atteint.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Félicitations, c'est super inspirant. On en a déjà parlé beaucoup de fois, parce que pour nous c'est important que tu sois responsable de ta réussite : c'est ce côté où tu as travaillé, tu as mis les efforts, tu es allée te remettre en question. Et en réalité, même si tu as les meilleures techniques du monde, si tu ne fais pas le travail, il ne se serait rien passé. C'est pour ça que je te dis vraiment félicitations, et c'est sincère. Ça fait à peine trois mois que cette activité tourne, et aujourd'hui tu es déjà à vingt-deux mille euros. Ce que tu as créé est aussi quelque chose que tu vas pouvoir faire grandir au fur et à mesure, pour aller chercher les cinq, les dix, puis le dupliquer sur d'autres activités. Est-ce que tu aurais un mot à dire à une personne qui regarde cette vidéo et qui hésite à prendre un appel avec quelqu'un de l'équipe ?",
      },
      {
        qui: "Sandrine",
        texte:
          "Je dirais que si cette personne a l'âme entrepreneuriale, et que soit elle veut se lancer, soit elle a déjà eu des business, c'est l'idéal pour digitaliser. Quelqu'un qui peut digitaliser dans son entreprise, c'est vraiment idéal. Il ne faut pas hésiter, parce qu'il y a tous les outils. Et comme je le disais au début, vous ne lâchez pas, en tout cas ceux et celles qui vont rester, qui vont tenir dans cette persévérance pour y arriver. Ça, je pense que je suis l'exemple que vous ne lâchez personne, parce que franchement, je vous ai un peu baladés sur les projets. Donc humainement parlant, il faut y aller, il n'y a vraiment pas à hésiter. Au niveau de l'investissement de départ, c'est dérisoire par rapport à tout le contenu. Et la liberté, comme je le disais, le fait de me sentir détendue : tous les matins, j'arrive et je vois sur Stripe que c'est tombé. Ça n'a pas de prix.",
      },
      {
        qui: "Sandrine",
        texte:
          "Donc si on cumule le fait que la formation est bien structurée, qu'il y a tous les modules, tout le savoir qu'il faut pour que la machine fonctionne, plus l'accompagnement très humain, personnalisé, c'est très bien fini. Si la personne a fait le job, je suis l'exemple que ça fonctionne. Comme d'autres qui ont voulu en parler, et je le vois sur le groupe, il y en a beaucoup. Ça fonctionne. Et je fais juste un dernier petit mot dessus : quand j'ai eu cette période de six, sept mois où j'étais en pause, où je travaillais sur moi pour pouvoir me montrer, parce que j'ai compris qu'il fallait se montrer pour que les gens aient confiance, c'est un peu normal, les humains. À chaque fois, je me connectais et je voyais tel élève qui avait réussi. Et je me dis : cette personne-là, elle a réussi, elle n'a rien de plus que moi. Donc s'ils ont réussi, c'est qu'il y a un moyen de réussir. Ça fonctionne, en fait. Il ne faut pas douter que ça fonctionne.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Exactement, il faut mettre la main à la pâte, il faut y aller. Merci beaucoup pour ce mot, et merci beaucoup pour ce retour d'expérience. Ce sera un plaisir d'en refaire une deuxième lorsque tu auras atteint les cinq mille, les dix mille, pour voir l'évolution. Merci beaucoup pour ton retour, et je pense sincèrement que ton parcours va parler à beaucoup de personnes. Encore une fois, félicitations pour tes résultats, ce n'est que le début.",
      },
      {
        qui: "Sandrine",
        texte: "Un grand merci à Rémy, et merci à toi, grand merci à toi.",
      },
      {
        qui: "Funnels Club",
        texte: "Avec plaisir. Merci beaucoup. À bientôt.",
      },
    ],
  },
  /* L'intervieweur est Geoffrey : Tatiana le nomme au premier et au dernier
     tour de parole.

     **Le sujet de Tatiana touche à la santé, et l'article ne s'y avance pas.**
     Elle vend un accompagnement bien-être né de trente ans de maladies
     chroniques. Rien ici ne décrit ce qu'elle enseigne, n'en promet d'effet, ni
     n'emploie un vocabulaire de soin : l'article parle de son parcours
     d'entrepreneuse, qui est le sujet de la page. */
  {
    id: "s3npr5izhy",
    slug: "tatiana",
    titre:
      "Avis Funnels Club : Tatiana, près de 5 000 € le premier mois après avoir changé de niche",
    titrePage: "Avis Funnels Club : Tatiana, 5 000 € le premier mois",
    description:
      "Tatiana est en reconversion depuis la fonction publique. Elle raconte comment elle a abandonné sa première niche, et vendu 5 000 € son premier mois.",
    afficheAlt:
      "Tatiana en entretien vidéo avec Geoffrey, de Funnels Club, chacun depuis son bureau",
    chapo:
      "Tatiana a quarante-deux ans, vit en région parisienne et travaille dans la fonction publique. Elle raconte comment elle a abandonné la niche pour laquelle elle était venue, et ce qu'une seule question lui a fait trouver à la place.",
    sections: [
      {
        titre: "Une reconversion cherchée pour une raison précise",
        paragraphes: [
          "Tatiana est officiellement dans la fonction publique, et en pleine reconversion. Sa passion, c'est la musique : elle s'occupait d'artistes, de DJ, et elle avait commencé une formation au management d'artistes.",
          "Ce qu'elle cherchait en montant un projet à elle n'était pas d'abord un revenu. Elle vit avec des pathologies chroniques auto-immunes, qui lui ont coûté cher sur le plan professionnel comme personnel, et elle est mère de deux enfants. ==Ce qu'elle voulait, c'était un équilibre entre sa santé, son travail et sa famille==, et pour ça être indépendante de son temps.",
        ],
        citation: {
          texte:
            "Comment est-ce que je peux être indépendante, autonome, comme ça je peux gérer ma vie de famille, ma passion, et en même temps prendre soin de ma santé ?",
          qui: "Tatiana",
        },
      },
      {
        titre: "Comment elle a découvert les tunnels de vente",
        paragraphes: [
          "Elle tombe sur une publicité de Rémy et ne comprend pas de quoi il parle : elle n'a jamais entendu parler de tunnel de vente, et l'idée qu'il ne faille pas créer de site internet l'intrigue. Elle clique, regarde le webinaire, et découvre une mécanique entière.",
          "Ce qu'elle fait ensuite décrit assez bien sa façon de travailler. Elle réserve l'appel, commande le livre dans la foulée, et se fixe vingt-quatre heures pour le lire avant le rendez-vous du lendemain. Vous pouvez commencer par le même endroit qu'elle : [le webinaire est en accès libre](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "J'ai réservé l'appel, et dans la foulée j'ai commandé son livre. Je me suis fixé vingt-quatre heures pour le lire.",
          qui: "Tatiana",
        },
      },
      {
        titre: "L'étude de marché qui lui fait abandonner sa première niche",
        paragraphes: [
          "Elle entre dans le programme en août 2023 avec son projet musical : automatiser la prospection d'organisateurs d'événements pour placer ses artistes en tournée, en France et à l'international. C'était une prestation de service.",
          "Puis elle fait l'étude de marché que le programme demande, et le verdict est net : ==ce n'était pas un marché opportun à développer à ce moment-là.== Elle se retrouve sans offre, sans rien de lancé, et se remet en question. C'est le même moment de doute que décrit [Sandrine, qui a mis six mois à repartir](/resultats/sandrine).",
        ],
        citation: {
          texte:
            "Je ne savais pas exactement où je voulais aller. J'avais les idées un peu floues, et le comment était vraiment trop loin.",
          qui: "Tatiana",
        },
      },
      {
        titre: "La question de Rémy qui a tout déplacé",
        paragraphes: [
          "C'est le passage qu'elle dit qu'elle n'oubliera pas. Rémy lui demande ce qu'elle aime dans la vie, ce qu'elle fait naturellement. Elle dit que ça a tourné à toute vitesse dans sa tête, puis qu'une réponse s'est imposée, et ce n'était pas celle qu'elle attendait. [François a reçu une remarque aussi brutale en coaching](/resultats/francois).",
          "Sa réponse, ce sont ses maladies : trente ans de pathologies chroniques, dont elle avait tiré quelque chose qu'elle savait transmettre, et sur quoi elle avait déjà monté des projets, dont un projet sportif handi-valide. ==Sa deuxième passion, après la musique, c'était le bien-être et le sport.==",
        ],
        citation: {
          texte:
            "Je l'aurais peut-être trouvé sans Funnels Club, mais pas de cette manière-là.",
          qui: "Tatiana",
        },
      },
      {
        titre: "Ce qui l'a le plus aidée : un chemin tracé, et des réponses en 24 h",
        paragraphes: [
          "Ce qu'elle cite en premier n'est pas la technique mais l'accompagnement, et le fait qu'on la recadre quand il faut. Elle décrit des questions qui lui paraissaient insolubles, posées le jour même, et une réponse dans les vingt-quatre heures qui fait tomber la barrière.",
          "Ce qu'elle cite ensuite, c'est la forme du parcours : une montagne à gravir, des étapes, et l'impossibilité de se perdre. Elle dit n'avoir jamais été perdue, seulement traversée par des doutes. [Olga décrit la même chose autrement](/resultats/olga) : une formation rangée, où l'on ne se noie pas.",
        ],
        citation: {
          texte:
            "Vous nous guidez à chaque étape du processus, et en fait c'est impossible d'être perdu.",
          qui: "Tatiana",
        },
      },
      {
        titre: "Ses résultats : trois ventes et près de 5 000 € pour 160 € de publicité",
        paragraphes: [
          "Elle a mis du temps à faire son webinaire, et elle l'assume comme une question personnelle. La publicité tourne depuis deux mois au moment de l'entretien. Le premier mois, elle a tout lancé en même temps : le tunnel, la publicité, et une chaîne YouTube partie de zéro.",
          "Sur ces trente premiers jours, ==trois ventes pour une valeur de près de cinq mille euros==, dont une venue de l'organique et deux de la publicité, pour environ cent soixante euros dépensés en publicité. Sa chaîne monte doucement, avec des vidéos à mille ou mille deux cents vues.",
        ],
        citation: {
          texte:
            "Le premier mois, j'ai fait trois ventes, pour une valeur de presque cinq mille euros.",
          qui: "Tatiana",
        },
      },
      {
        titre: "Ce dont elle est la plus fière, et son avis pour ceux qui hésitent",
        paragraphes: [
          "Ce qu'elle met en avant à la fin n'est pas le chiffre, c'est d'avoir créé de toutes pièces un programme d'accompagnement et son espace membre, en partant de zéro. Elle dit n'avoir jamais autant travaillé de sa vie, et avoir surtout appris sur elle-même et sur ce qu'elle était capable de faire.",
          "Elle ne cache pas les moments où elle a voulu lâcher, et dit que l'entrepreneuriat n'est pas que des étoiles dans les yeux. Sa réponse à ceux qui hésitent tient en une phrase qu'elle aime. Si c'est votre cas, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [les autres membres racontent leurs propres détours](/resultats).",
        ],
        citation: {
          texte:
            "Quand il y a un doute, il n'y a pas de doute.",
          qui: "Tatiana",
        },
      },
    ],
    transcription: [
      {
        qui: "Geoffrey",
        texte: "Salut Tatiana.",
      },
      {
        qui: "Tatiana",
        texte: "Salut Geoffrey.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci d'avoir accepté aujourd'hui cette interview pour raconter ton histoire, ton passage dans Funnels Club. Est-ce que tu peux commencer par te présenter, dire qui tu es, ce que tu fais, et dans quelles conditions tu nous as rejoints ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Déjà, merci à toi pour cette invitation, je suis vraiment ravie de faire cette petite vidéo. Alors moi, c'est Tatiana, je vis en région parisienne, j'ai quarante-deux ans cette année. Initialement, avant de rejoindre Funnels Club, j'étais plutôt dans la musique, en passion, mais j'avais un boulot dans la fonction publique. Donc là, je suis en pleine reconversion professionnelle. Officiellement, je suis dans la fonction publique, mais je cherchais à développer un projet d'entrepreneuriat. J'ai des pathologies chroniques, des pathologies auto-immunes, qui m'ont valu beaucoup de gros problèmes d'un point de vue professionnel et d'un point de vue personnel. Et suite à ça, mon but, c'était vraiment de trouver un certain équilibre entre ma santé, ma vie professionnelle, ma vie de famille aussi, puisque je suis maman, j'ai deux enfants.",
      },
      {
        qui: "Tatiana",
        texte:
          "Ce que je cherchais à faire, c'était développer quelque chose dans la musique, parce que c'est vraiment ma passion. Je me suis dit : comment est-ce que je peux être indépendante, autonome, comme ça je peux gérer ma vie de famille, ma passion, et en même temps prendre soin de ma santé, prendre soin de moi ? À ce moment-là, j'avais commencé à prendre une formation dans le management d'artiste. Aujourd'hui, c'est toujours ma passion, c'est ce que je fais un petit peu en parallèle. Et puis ensuite, je suis tombée sur la publicité de Rémy, et je me suis dit : qu'est-ce que c'est, ça, les tunnels de vente ? Comment ça, il ne faut pas que je crée de site internet ? Parce que moi, à la base, je m'occupais d'artistes, de DJ, et mon but, c'était de faire des tournées, du booking, des dates en France, à l'international.",
      },
      {
        qui: "Tatiana",
        texte:
          "J'ai été intriguée par la publicité en elle-même. Donc j'ai cliqué, et là je suis tombée sur le webinaire, et j'ai appris énormément de choses, parce que je ne connaissais pas du tout les tunnels de vente. On était en août deux mille vingt-trois, et je décide de prendre un appel, parce qu'honnêtement, je me suis dit : c'est exactement ça qu'il me fallait. Suite à ça, je suis rentrée dans Funnels Club, vraiment tout excitée, un peu comme une enfant : c'est la rentrée, on est en plein été, mais c'est la rentrée quand même, et je vais découvrir plein de choses. J'ai commencé à appliquer tout ce qu'on apprend. Et en faisant mon étude de marché, ma niche, je me suis rendu compte que ce n'était pas vraiment un marché opportun à développer, en tout cas à cet instant-là. Donc là, je me suis pas mal remise en question, et en gros, je n'avais pas d'offre, je n'étais lancée dans quoi que ce soit réellement.",
      },
      {
        qui: "Tatiana",
        texte:
          "Et donc, ce qui m'a beaucoup séduite dans Funnels Club, c'est vraiment l'accompagnement, qu'on a fait ensemble et qu'on fait encore ensemble, pour nous aiguiller. Je me rappellerai toujours d'une question que Rémy m'avait posée : qu'est-ce que tu aimes dans la vie ? Qu'est-ce que tu fais naturellement ? Parce que visiblement, la niche dans laquelle je voulais me lancer, dans la musique, ce n'était pas ça.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Juste pour préciser pour tout le monde : au tout début, ce que tu voulais faire, c'était utiliser le système pour promouvoir les personnes avec qui tu pouvais travailler, sur le côté DJ, c'est ça ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Exactement, tout à fait. Je voulais faire une sorte d'automatisation, faire de la publicité pour attirer des organisateurs d'événements et booker mes artistes. À l'issue, c'était plutôt une prestation de service.",
      },
      {
        qui: "Tatiana",
        texte:
          "Et du coup, quand Rémy m'a posé cette question, ça a retourné à toute balle dans ma tête, et je me suis dit : ok, qu'est-ce que j'aime, quel est le truc, dans ma vie, qui fait que j'en suis là aujourd'hui ? Et là, je me suis rappelé que c'est mes maladies. J'ai vécu trente ans de maladies chroniques, j'ai eu pas mal de gros soucis, et puis j'ai frôlé plusieurs fois la mort. Bon, ça, c'est un détail. Mais en tout cas, j'avais développé quelque chose que je savais transmettre aux autres : tout ce que j'avais appliqué sur moi pour être mieux, je savais comment il fallait faire. Et je me suis dit : c'est ça. Parce que j'avais déjà monté des projets un peu dans le passé en rapport avec ça, en rapport avec la situation de handicap. J'avais monté un projet handi-valide, un projet sportif. Donc pour moi, ma deuxième passion après la musique, c'était le bien-être plus globalement, et le sport, ça se rejoint.",
      },
      {
        qui: "Tatiana",
        texte:
          "J'ai commencé à revoir ma niche, mon marché, et là, j'avais trouvé le truc. C'est quelque chose que, honnêtement, je l'aurais peut-être trouvé sans Funnels Club, mais pas de cette manière-là. C'est vraiment ça que j'ai pu développer, et que j'ai vraiment appris aussi sur moi. Ça me touche énormément. Voilà comment j'ai atterri dans Funnels Club.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Et au final, le problème que tu avais avant de nous rejoindre, si on simplifie, c'était lequel pour toi ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Je pense que je ne savais pas exactement où je voulais aller. Je savais que je voulais être indépendante, autonome, je voulais développer quelque chose de fort, qui avait vraiment de l'importance pour moi, mais c'était très flou. Je ne savais pas comment faire, je ne savais pas quoi faire exactement et comment le mettre en place. J'avais les idées un peu floues, mais le comment était trop loin, vraiment trop loin.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Tu avais déjà plein de compétences dans différents domaines, mais tu ne savais pas forcément laquelle tu allais pouvoir monétiser, laquelle tu allais pouvoir promouvoir.",
      },
      {
        qui: "Tatiana",
        texte:
          "Et surtout, le faire avec vraiment beaucoup de joie et beaucoup de détermination.",
      },
      {
        qui: "Geoffrey",
        texte:
          "C'est vraiment ce côté passion : tu avais plusieurs passions, et c'était laquelle est-ce qu'on choisit pour avancer, pour aider les gens. Qu'est-ce qui t'a fait choisir Funnels Club à cette époque ? Tu avais déjà vu quelques vidéos de Rémy, c'est ça ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Alors honnêtement, je suis tombée d'abord sur la publicité. Après, une fois que j'ai vu la publicité, forcément j'en ai vu d'autres jusqu'à ce que je clique, mais j'ai rapidement cliqué. Et juste après ça, j'ai regardé ses vidéos YouTube, je voulais savoir un peu plus ce qui faisait qui il était. Il paraissait jeune aussi, donc forcément j'ai eu ce côté un peu méfiant, mais qui est très vite passé, parce que je crois que j'ai réservé l'appel et, dans la foulée, j'ai commandé son livre. Je me suis fixé vingt-quatre heures pour le lire. Je crois que je n'avais quasiment pas dormi, et j'ai lu son livre en vingt-quatre heures, parce que j'avais l'appel qui était programmé le lendemain. Et j'ai regardé plusieurs de ses vidéos. Là, je me suis dit : ok, c'est exactement ça.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Si on passe à l'étape dans Funnels Club, puisqu'on a surtout parlé de l'avant, qu'est-ce qui t'a le plus marquée ? Qu'est-ce qui t'a vraiment permis de recentrer tout ce dont on a parlé avant ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Clairement, c'est l'accompagnement. C'est les coachings, l'équipe. Dès le premier contact, alors moi c'était avec Maxime, j'ai été hyper touchée par la sympathie, mais en même temps le professionnalisme. Et puis ensuite, j'avais eu Ludivine au téléphone, et pareil, vraiment ce côté humain. Je suis quelqu'un d'assez sensible à ça, et en général je sens plutôt les gens, et là j'ai vraiment eu un bon feeling. Et clairement, tout au long de l'aventure Funnels Club, c'est vraiment ce côté humain, ce côté soutien, ce côté pilier. Et en même temps, il y a aussi ce côté où on n'est pas trop là pour être tout le temps doux, et où des fois c'est recadré, mais toujours avec bienveillance. Et vraiment, on a des réponses qui sont concrètes. Il y a des questions que je me posais, je me disais : ce n'est pas possible, c'est trop compliqué, je ne comprends pas. Et en fait, je pose la question, et dans les vingt-quatre heures qui suivent, j'ai la réponse, tout devient plus clair, et toutes les barrières se lèvent. Moi, c'est vraiment ça, ce côté coaching, accompagnement pur et dur.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Quel a été pour toi le point qui t'a permis d'être efficace dans l'avancée de ton projet ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Pour moi, c'est le chemin qui est tout tracé. Quand on arrive dans Funnels Club, et c'est ça qui m'a assez émerveillée, je suis arrivée sur la plateforme, déjà l'accueil se fait super, et de voir qu'il y a des étapes. De toute façon, il le montre très bien : on est en bas de la montagne, il y a cette montagne à gravir, et à chaque fois il y a des étapes. Ce que j'ai beaucoup aimé, c'est cette pédagogie où on suit ce chemin, et puis petit à petit on avance. On ne se rend pas compte au départ qu'on fait ces petits bouts de chemin, mais si je regarde tout ce chemin derrière, je me dis que c'est incroyable. J'ai aussi pris le temps, mais vous nous guidez vraiment à chaque étape du processus, et en fait c'est impossible d'être perdu. Moi, je n'ai jamais été perdue, j'ai peut-être eu quelques petits questionnements, des doutes, mais très vite on revient sur le chemin et on avance. Honnêtement, tout ce que j'ai fait, je ne pensais pas que j'aurais pu le faire, en tout cas sans Funnels Club, ça c'est une certitude. Je suis hyper contente, hyper touchée de tout ça.",
      },
      {
        qui: "Geoffrey",
        texte:
          "C'est super intéressant, ce côté où tu regardes en arrière et tu vois tout ce que tu as fait, tout ce que tu as pu créer. C'est vraiment intéressant de voir que tu n'as pas lâché. Il y a le guide, la formation, les étapes, mais le travail, je voulais le souligner, il venait de toi. Tu as eu aussi des moments où tu avais essayé une autre niche, et après tu es revenue sur celle d'aujourd'hui, ce qui explique un certain temps dans le parcours. Tu as mis les efforts en face, tu as aidé la communauté, tu nous as partagé toutes tes questions.",
      },
      {
        qui: "Tatiana",
        texte:
          "Comme je le dis souvent quand je parle avec mon entourage : je n'ai jamais autant travaillé de toute ma vie. Il a fallu que j'attende quarante ans pour travailler autant. Et ce n'est même pas seulement travailler sur mon projet, parce que je pense vraiment que l'état d'esprit, c'est la base, c'est le pilier. Au-delà d'avoir appris des techniques, de mettre en place un tunnel de vente, de faire de la publicité, de créer du contenu sur les réseaux sociaux, j'ai surtout beaucoup appris sur moi et sur ce que j'étais capable de faire. Quand on est guidé, on se rend compte qu'on est capable de développer des compétences qui sont incroyables, et je ne pensais pas que j'aurais pu développer ces compétences-là.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Est-ce que tu peux partager aujourd'hui les résultats que tu as réussi à atteindre ? Pour rappel, ça fait combien de temps que tu as lancé la publicité ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Alors, je suis rentrée dans Funnels Club en deux mille vingt-trois. Je me suis trompée de niche, non, je ne me suis pas trompée de niche, pour moi ce n'est pas une erreur, parce que justement j'ai appris. J'ai dû changer pas mal de choses. Mon webinaire, j'ai pris pas mal de temps aussi pour le faire, ça c'est une question personnelle, c'est moi-même. Donc j'ai lancé la publicité, ça fait deux mois. Le premier mois, j'ai fait un test sur trente jours : j'ai lancé mon tunnel de vente avec de la publicité, plus du contenu organique, j'ai tout lancé en même temps. J'ai ouvert ma chaîne YouTube à ce moment-là, plus la publicité. Et le premier mois, j'ai fait trois ventes, pour une valeur de presque cinq mille euros.",
      },
      {
        qui: "Geoffrey",
        texte: "Félicitations.",
      },
      {
        qui: "Tatiana",
        texte:
          "Merci beaucoup. Donc trois ventes, dont une qui venait de l'organique et deux de la publicité.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Félicitations pour tes résultats, ce sont de beaux résultats. Après, il y a bien sûr la dépense publicitaire, même si ça reste très rentable sur ce qu'on avait pu voir ensemble. Tu as réussi à tout lancer à ce moment-là, et avec la publicité en plus, tu as réussi à faire grandir ton audience.",
      },
      {
        qui: "Tatiana",
        texte:
          "C'est ça. Ma chaîne YouTube, elle part de zéro totalement. Elle monte tout doucement, petit à petit, mais j'ai des vidéos qui arrivent à atteindre mille, mille deux cents vues par vidéo. Donc je me dis : petit à petit, je fais mon bout de chemin progressivement. Et en termes de publicité, le premier mois j'avais mis des petits budgets, le but c'était de commencer petit et de voir comment ça prenait, de tester. On continue encore de tester. En moyenne, le premier mois, sur trente jours, j'avais dépensé cent soixante euros à peu près en publicité, surtout sur une campagne notamment. Et donc voilà, ça m'a généré deux ventes via la publicité.",
      },
      {
        qui: "Tatiana",
        texte:
          "Je suis très contente de ce chiffre, et au-delà de ça, je suis très contente de pouvoir accueillir des membres sur l'espace membre, que j'ai pris du temps à créer. Ça aussi, c'est quelque chose qu'on n'a pas dit : étant donné que je partais de zéro, j'ai dû aussi apprendre à créer un programme d'accompagnement. C'était un sacré défi pour moi, et vraiment beaucoup de plaisir aussi. Honnêtement, ce programme, je suis super fière de l'avoir créé, et les membres sont super ravis, on a de super résultats, donc je suis très contente. Et là, je peux aider les personnes vraiment comme ça me tenait à cœur. À mon tour d'être le Funnels Club, mais à ma façon, sur un autre domaine.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci franchement pour ce partage, je le trouve vraiment inspirant, par ta détermination, par ton travail. Est-ce que tu aurais un mot à dire à une personne qui regarde cette interview et qui hésite peut-être à prendre un rendez-vous avec un membre de l'équipe ?",
      },
      {
        qui: "Tatiana",
        texte:
          "Alors moi, il y a une phrase que j'aime bien : quand il y a un doute, il n'y a pas de doute. Je pense que si déjà on est attiré, si on a un objectif, même s'il est un petit peu flou, il y a déjà quelque chose qui se dessine, et on ressent les choses. Moi, c'est ce qui s'est passé : j'ai eu un feeling, je savais plus ou moins ce que je voulais, ce n'était pas très clair, j'avais un doute, et du coup il n'y a plus de doute. Il y a eu beaucoup de moments où j'en ai eu marre, où j'ai eu envie de lâcher, forcément. L'entrepreneuriat, ce n'est pas que des étoiles dans les yeux. Mais aujourd'hui, je ne regrette rien, parce que tous ces longs mois de dur labeur, c'est tellement gratifiant. Donc s'il y a un doute, il n'y a pas de doute : on y va, parce que c'est important pour soi. Je pense qu'il faut réaliser vraiment les choses qui sont importantes pour soi-même.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Totalement d'accord. Merci beaucoup Tatiana pour cet entretien. Je pense sincèrement que ça va aider beaucoup de personnes à voir ce qui est possible de faire, à voir qu'on peut se tromper une fois, qu'on peut réussir à avancer une seconde fois, et que tout est dans le travail, dans le fait d'avancer dans la bonne direction. Félicitations encore pour tes résultats, et quoi qu'il arrive, on se retrouve de l'autre côté pour continuer à travailler sur ce projet.",
      },
      {
        qui: "Tatiana",
        texte: "Merci Geoffrey, merci beaucoup.",
      },
      {
        qui: "Geoffrey",
        texte: "Je t'en prie, avec plaisir, à très bientôt.",
      },
    ],
  },
  /* L'intervieweur n'est pas nommé de façon lisible : la reconnaissance vocale
     écrit « Getty » au premier tour de parole, ce qui ne se reconstitue pas
     sans deviner. Les tours lui sont rendus sous « Funnels Club ». */
  {
    id: "tvy3jbhml9",
    slug: "charlotte",
    titre:
      "Avis Funnels Club : Charlotte, 6 335 € sur sa première session de formation en ligne",
    titrePage: "Avis Funnels Club : Charlotte, 6 335 € en une session",
    description:
      "Charlotte forme à la prothésie ongulaire au Canada. Elle raconte son passage du présentiel à la formation en ligne, et 1 500 € encaissés pour 40 € de publicité.",
    afficheAlt:
      "Charlotte en entretien vidéo avec Funnels Club, depuis son salon au Canada",
    chapo:
      "Charlotte forme au métier des ongles, en présentiel, et publiait depuis un an sur Instagram sans savoir ce qui marchait. Elle raconte comment elle a transformé une formation manuelle en formation en ligne, et ce que ça lui a pris de temps.",
    sections: [
      {
        titre:
          "Un an de contenu sur Instagram, et des clientes perdues en route",
        paragraphes: [
          "Charlotte est très présente sur Instagram, où elle publie depuis environ un an. Son problème n'est pas l'audience, c'est l'absence de repères : des vidéos font des vues, d'autres non, et rien ne lui dit ce qui marche. Elle décrit ça comme frustrant, fatigant, et très long.",
          "Le second problème est plus coûteux. Des femmes la contactaient pour ses formations, et ==elle les perdait en cours de route==, parce que les échanges par message s'étalaient sur plusieurs jours. Son site ne comblait pas le trou : il présentait un catalogue, personne n'y expliquait la valeur. [Olga décrit un blocage voisin](/resultats/olga) : beaucoup d'audience, et un plafond qu'aucun effort ne franchissait.",
        ],
        citation: {
          texte:
            "Je me disais : je perds les filles quelque part. Il manquait quelque chose, je n'arrivais pas à faire valoir ma valeur, je pense aussi.",
          qui: "Charlotte",
        },
      },
      {
        titre: "Une communauté en ligne, et rien à lui vendre à distance",
        paragraphes: [
          "Le constat qu'elle formule ensuite est celui qui l'a décidée, et il vaut pour beaucoup de métiers manuels. Elle avait bâti une communauté en ligne, mais ne vendait que du présentiel, dans sa ville. Toutes celles qui la suivaient de loin, du Canada ou de France, n'avaient rien à acheter.",
          "Elle résume l'absurdité en une phrase : mettre toute son énergie dans Instagram précisément pour toucher des gens lointains, et n'avoir rien à leur proposer. C'est le même raisonnement que fait [Roland Buffet, qui comptait ses kilomètres](/resultats/roland-buffet).",
        ],
        citation: {
          texte:
            "La puissance des réseaux, c'est de toucher des personnes loin. Et pourquoi je n'ai rien à vendre pour le loin ?",
          qui: "Charlotte",
        },
      },
      {
        titre: "Pourquoi elle a choisi Funnels Club",
        paragraphes: [
          "Ce qu'elle cherchait était précis : un tunnel de vente, pour que sa cliente ne se perde plus entre le premier message et l'achat. Elle est tombée sur les vidéos de Rémy en se renseignant, et ce qui l'a décidée, ce n'est pas une promesse.",
          "Elle cite trois choses : la confiance qu'il a dans ce qu'il dit, la garantie satisfait ou remboursé, et surtout le fait qu'il n'en fasse pas des tonnes sur sa personne ni sur ses revenus. Elle a ensuite vérifié sur YouTube et Instagram avant de réserver l'appel. [La formation est en accès libre](https://www.funnels.club/course-2025?el=site) si vous voulez faire pareil.",
        ],
        citation: {
          texte:
            "Je suis face à quelqu'un qui sait de quoi il parle, et qui n'en fait pas plus que ça sur sa personne ou sur ses revenus.",
          qui: "Charlotte",
        },
      },
      {
        titre: "Transformer un métier manuel en formation vidéo",
        paragraphes: [
          "Elle est honnête sur le temps que ça lui a pris, et sur pourquoi. Le métier des ongles, c'est de la pratique : il fallait retranscrire en vidéo tout ce qui se montrait à la main. Elle visait un niveau de finition élevé, pour se démarquer des autres formatrices de son marché, et elle a dû revoir son propre calendrier à la baisse.",
          "Ce qu'elle cite comme le plus utile n'est pas la technique de vente, mais une leçon sur la façon d'introduire une vidéo. Dans son métier, où les élèves regardent souvent avec des enfants autour, ==accrocher dans les premières secondes fait la différence==, et ses bêta-testeuses le lui ont dit.",
        ],
        citation: {
          texte:
            "Il explique comment introduire une vidéo, et c'est d'une puissance incroyable, parce que ça peut être très vite ennuyant, quelqu'un qui parle tout le temps.",
          qui: "Charlotte",
        },
      },
      {
        titre: "Le bêta-test : cinq élèves à 200 €, et une formation corrigée par elles",
        paragraphes: [
          "Quatre à cinq mois après son entrée, elle publie sur ses réseaux et lance un bêta-test : cinq élèves à deux cents euros, soit ==mille euros de premiers revenus en ligne==. Elle leur dit clairement qu'elles sont ses testeuses VIP, et elles jouent le jeu, en lui signalant ce qui manque.",
          "C'est le conseil qu'elle tient le plus à donner, et elle l'adresse directement à qui regarde : lancer avant d'être sûr de son produit, parce que c'est le lancement qui le termine. Elle ajoute qu'une formation reste toujours à perfectionner, ce qui est aussi ce que [Christian Joyce dit du programme lui-même](/resultats/christian-joyce). [Les autres membres racontent des lancements aussi imparfaits](/resultats).",
        ],
        citation: {
          texte:
            "Passez à l'action maintenant, même si vous n'êtes pas encore totalement sûr de votre produit.",
          qui: "Charlotte",
        },
      },
      {
        titre:
          "Ses résultats : 1 500 € encaissés pour 40 € de publicité, et 6 335 € sur la session",
        paragraphes: [
          "Pour la deuxième session, elle actionne plusieurs canaux en même temps : un challenge de cinq jours sur Instagram, et de la publicité. Elle avait prévu cent cinquante euros de budget ; ==ses formats n'en ont consommé que quarante, qui ont produit cinq rendez-vous==.",
          "Sur ces cinq, une s'est conclue, pour mille cinq cents euros encaissés. Le lancement, lui, a apporté deux ou trois personnes de plus, plutôt parmi celles qui la connaissaient déjà. Au total, sa première vraie session en ligne représente six mille trois cent trente-cinq euros, avec cinq élèves.",
        ],
        citation: {
          texte:
            "Sur quarante euros de publicité, j'ai eu mille cinq cents euros d'encaissé. Donc j'étais trop contente, je me suis dit : ok, la publicité, ça fonctionne.",
          qui: "Charlotte",
        },
      },
      {
        titre: "Son avis pour celles et ceux qui hésitent encore",
        paragraphes: [
          "Sa réponse commence par le coût de l'hésitation elle-même, puis passe à ce qui l'a rassurée pendant tout le parcours : l'équipe qui répond en vingt-quatre à quarante-huit heures, et les rendez-vous hebdomadaires où l'on peut poser une question précise en direct.",
          "Elle avait eu, elle aussi, le doute de savoir si un tunnel de vente lui servirait vraiment. Sa conclusion est qu'on ne passera pas à côté, parce que c'est ce qui permet d'expliquer sa valeur au lieu d'afficher un catalogue. Si vous en êtes là, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site).",
        ],
        citation: {
          texte:
            "C'est vraiment du temps de perdu, le temps qu'on est en train de réfléchir.",
          qui: "Charlotte",
        },
      },
    ],
    transcription: [
      {
        qui: "Charlotte",
        texte:
          "Merci de m'accueillir, et je suis très contente de témoigner de tout mon parcours dans votre formation. Pourquoi j'ai choisi Funnels Club ? Parce que clairement, je cherchais à faire un tunnel de vente. Moi, je suis beaucoup sur les réseaux sociaux, notamment Instagram, et du coup je publiais beaucoup de contenus. Ça faisait un an, plus ou moins, que je publiais du contenu, mais la problématique que je rencontrais, c'est que je ne savais pas ce qui marchait vraiment et ce qui ne marchait pas. Des fois les vidéos font des vues, des fois elles n'en font pas. Il n'y a pas de stats sur lesquelles se reposer pour se dire : ok, ça marche, ça ne marche pas. Donc c'était très frustrant, très fatigant, et il fallait beaucoup de patience. Je me suis dit : à un moment donné, ce n'est pas possible, je vois bien des gens qui font beaucoup plus d'argent et plus rapidement, ce n'est pas forcément à l'organique.",
      },
      {
        qui: "Charlotte",
        texte:
          "Je me suis dit qu'il y avait un truc à chercher, et là je suis tombée sur les vidéos de tunnel de vente. J'ai commencé à me renseigner, et là j'ai trouvé Rémy, et je me suis dit : yes, c'est ça que je cherche. Parce qu'effectivement, j'avais des filles qui me contactaient pour les formations, mais je les perdais en cours de route. Par exemple, on échangeait par message, et l'échange durait sur plusieurs jours, et en fait les filles ne t'écrivent plus. Je me disais : je perds les filles quelque part, ce n'est peut-être pas assez rapide, je ne sais pas, mais il manquait quelque chose, je n'arrivais pas à faire valoir ma valeur, je pense aussi.",
      },
      {
        qui: "Charlotte",
        texte:
          "Quand j'ai vu que Rémy parlait de tunnel, et que ça permettait à notre cliente de le suivre de A à Z et de ne pas se perdre elle-même. Parce que sur un site internet, c'est pareil, j'en ai un, mais les filles le regardent plus ou moins comme un catalogue, et elles ne comprennent pas vraiment la valeur. Il n'y a pas quelqu'un qui leur parle. Ça manque énormément : elles ne peuvent pas apprendre juste en lisant qu'au programme il y a ça, ça et ça. Finalement, je sentais que ça me manquait.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Juste pour remettre du contexte, parce que c'est super intéressant ce que tu dis : en fait, tu avais déjà quelque chose en place dans le domaine de la formation, et tu cherchais quelque chose de plus directif, qui puisse vraiment t'amener les personnes qui allaient déjà sur ton site, qui voyaient déjà le contenu que tu créais. C'était quelle plateforme ?",
      },
      {
        qui: "Charlotte",
        texte: "Instagram.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et aussi pour remettre du contexte : quand tu parlais, c'était beaucoup des formations en présentiel. Ce n'était même pas de la formation en ligne.",
      },
      {
        qui: "Charlotte",
        texte:
          "C'est ça. Je me suis dit : j'ai créé une communauté, j'ai créé quelque chose en ligne, mais comment ça se fait que je n'ai pas quelque chose que je vends en ligne aussi ? Parce qu'il y a des filles qui me demandent, mais qui sont loin. La puissance des réseaux, c'est de toucher des personnes loin. Et pourquoi je n'ai rien à vendre pour le loin ? Il y a des filles qui ne vont pas faire un déplacement en plus de payer leur formation, ça reste hyper normal. Donc j'étais là : ok, je mets de l'énergie dans Instagram pour toucher du monde, mais je n'ai rien à leur vendre si elle habite au Canada ou si elle habite à Paris. Ce n'était pas du tout efficace. Donc j'étais sur des formations en présentiel, et je voulais créer ma formation en ligne pour répondre à cette demande.",
      },
      {
        qui: "Charlotte",
        texte:
          "J'ai pris la formation par rapport au tunnel, parce qu'on ne perdait pas la cliente, et parce que j'allais effectivement être obligée. En fait, c'est maintenant, tu vas créer ta formation en ligne. Je ne l'avais même pas en tête, et je me suis dit : ouais, ça va être dur. Mais quand tu t'inscris, quand tu payes la formation, tu te dis : attends, là je suis en train de payer, ok, let's go. J'appelle mes copines, on se filme, tout s'est mis en place. Je suis passée à l'action. Moi, je suis dans le domaine des ongles : ce n'est pas une compétence comme l'informatique, où on peut faire des formations plus courtes ou sur des supports. Moi, c'est quand même beaucoup de pratique. Donc il fallait retranscrire en vidéo tout ce qui était manuel, et du coup ça a pris plus de temps. Je suis consciente que ça a pris plus de temps parce que je suis professionnelle, je voulais vraiment apporter une grosse valeur à mes élèves, faire la différence par rapport aux autres formatrices, par rapport à ce qu'elles peuvent proposer aujourd'hui sur le marché. Mais je suis contente parce que je l'ai fait, je suis passée à l'action, et aujourd'hui ma formation est prête. J'ai fait mon bêta-test. J'ai trouvé cinq filles, et les filles me disent : c'est incroyable, tu as trop bien fait ta formation.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Je te coupe juste rapidement, c'était pour expliquer aussi ce qu'était le bêta-testing. C'est le fait de lancer sa formation avant qu'elle soit totalement finalisée. Tu avais créé les tunnels de vente, tu avais créé une première partie de ta formation, et tu avais lancé la communication. C'est là que tu as commencé à avoir tes premières clientes, et tu as co-créé, si on veut, la formation avec ces cinq personnes dont tu parles.",
      },
      {
        qui: "Charlotte",
        texte:
          "Ouais. Et ce que j'ai bien aimé, ce qui m'a aidée dans la formation de Rémy, c'est le passage à l'action, le fait de réorganiser toutes mes idées. Tout ce qu'il a préparé, le cahier de texte que j'utilise tous les jours : dès que j'ai besoin, je vais dedans, je sais que mes infos sont répertoriées, ça c'est super. Et à un moment donné, il explique comment introduire une vidéo, et c'est fou. Je me dis que c'est d'une puissance incroyable, parce que ça peut être très vite ennuyant, quelqu'un qui parle tout le temps. Moi, je suis avec des femmes, donc l'émotion, c'est hyper important, il faut pouvoir créer de l'émotion, il faut pouvoir attirer. Les filles vont regarder des vidéos, elles peuvent avoir des enfants, elles peuvent avoir un contexte familial qui fait qu'elles ne me regardent pas forcément. Mais tu lances la vidéo, et clac, on accroche, parce qu'on a une introduction qui fait que tout de suite ça parle à l'élève. Et du coup elle est dedans, elle écoute à fond sa vidéo, les connaissances à apprendre. Ça, j'ai trouvé ça hyper puissant pour faire la différence. Les filles m'ont fait ce retour, elles m'ont dit que les vidéos c'était super.",
      },
      {
        qui: "Charlotte",
        texte:
          "Et forcément, tout ce que Rémy met comme outil : il me dit, vous utilisez cette plateforme, vous répertoriez sur cette plateforme, ensuite vous allez avoir votre formation là. En vrai, je me suis rendu compte aussi que c'est pas mal d'informatique, et c'est des choses que je n'aurais jamais trouvées toute seule, mais jamais.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Parce que tu n'es pas à l'aise avec l'informatique, ou au contraire tu l'es quand même assez, et c'est juste qu'il y avait des choses bien particulières qui te manquaient et que tu n'avais pas vues avant ?",
      },
      {
        qui: "Charlotte",
        texte:
          "Plutôt la deuxième option, parce que c'est vrai que ça va, je vais m'en sortir, mais clairement je ne suis pas du domaine. Et ce qui était trop bien, c'est que j'avais fait un commentaire là-dessus, j'ai dit à Rémy : merci d'avoir autant simplifié les choses, parce qu'on comprend ce qu'il y a à faire. C'est difficile quand on ne connaît pas, on se dit : waouh, attends, je dois traquer ça, je dois faire ça. Franchement, c'est un truc de fou. Moi qui ne suis pas dans l'informatique, je n'aurais jamais pensé faire les liens. Pour moi, c'est incompréhensible. Mais c'est hyper bien expliqué, et de toute façon le but, c'est ça : vous allez faire comme ça, comme ça, comme ça, et vous allez atteindre le but. Très bien, et c'est ça que je voulais, de toute façon je voulais le but.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'étaient les étapes, au final. Si on reprend tout ce que tu nous as partagé, c'est ce côté où tu avais besoin d'étapes pour passer du physique au digital, avec tout ce que ça impliquait du côté technique et aussi stratégie, avec la manière dont il fallait tourner les formations, la manière dont il fallait monter. Est-ce que c'est quelque chose que tu avais vu avant de nous rejoindre ? Ce qui est intéressant, c'est aussi de comprendre ce qui t'a poussée à rentrer dans Funnels Club à la base.",
      },
      {
        qui: "Charlotte",
        texte:
          "L'élément de déclic, c'est le fait de me dire : ok, là je vais vraiment créer ma formation en ligne, et avoir le tunnel de vente. Moi, c'était ça. Je cherchais un tunnel, par rapport à d'autres personnes. Je pense que chez Rémy, ce qui a été déclencheur aussi, c'est qu'on sent qu'il est confiant dans ce qu'il dit. Je me suis dit : ok, le mec est confiant, il dit que de toute façon, soit vous êtes satisfait, soit vous êtes remboursé. Là, je sens que je suis face à quelqu'un qui sait de quoi il parle, et qui n'en fait pas plus que ça sur sa personne ou sur ses revenus. Il a sa méthode. Et au vu des résultats, après je suis allée voir sur YouTube, le nombre de personnes qui le suivent sur Instagram, je me suis dit : là, on est sur quelqu'un qui impacte positivement beaucoup d'autres personnes, et qui a pu aider beaucoup d'autres personnes. Et puis je me suis dit : je sens que je ne trouverai pas mieux.",
      },
      {
        qui: "Charlotte",
        texte:
          "J'avais eu Maxime, et Maxime m'avait montré un petit peu derrière comment ça pouvait se passer, et j'ai dit : là, il y a un gros truc, c'est super, il a préparé quelque chose de solide. Je n'ai pas trop cherché, enfin j'ai cherché, mais finalement pas tant que ça. À un moment donné, quand on voit un prix de formation, qu'on voit ce qu'il y a derrière, qu'on voit l'appel, qu'on voit le professionnalisme, je me suis dit : de toute façon, je n'ai pas envie de perdre de temps, je n'ai pas envie d'investir des milliers de fois à droite et à gauche. Apparemment, chez Rémy, il y a tout. Ok, je vais voir s'il y a tout. J'ai eu l'appel. Il y a effectivement ce dont j'avais besoin, et bien plus quand on passe de l'autre côté. Donc c'était trop bien.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et du coup, est-ce que tu veux parler des chiffres que tu as réussi à faire ? Où est-ce que tu en es aujourd'hui, après avoir suivi la formation ?",
      },
      {
        qui: "Charlotte",
        texte:
          "Alors, le bêta-test, incroyable. Moi, je pensais aller plus vite, mais on ne s'en rend pas compte tant qu'on n'est pas dans la formation. Je m'étais dit qu'en un mois, ça allait être bon. Ce n'était pas évident, parce que je casse mes propres objectifs en me disant : Charlotte, tu as envie de faire un truc hyper perfectionné, donc à un moment donné ça va prendre un peu plus de temps, donc calme-toi là-dessus. Donc j'ai continué à bosser, j'ai fait ce que j'avais à faire, j'ai bien préparé. Et finalement, je crois que c'était quatre ou cinq mois après, j'ai fait le bêta-test. Je fais une publication sur les réseaux, je trouve cinq filles, à deux cents euros : trop bien, ça fait mes premiers revenus, donc mille euros, ok, super. Je lance le truc, et en plus c'est la première fois, donc c'est super top, tu as des retours, les filles te disent que c'est super. Et en plus, c'était vraiment une dynamique aidante, parce que je leur ai dit : ok les filles, là on est en test, vous êtes mes VIP testeuses. Et les filles étaient partantes, dans le sens : on va t'aider, vas-y, on va te dire s'il y a un truc, si ça manque de ça. Il y a eu une super dynamique, et ça m'a permis de perfectionner cette formation, même si elle est toujours à perfectionner. C'est évident, dans l'évolution, on peut toujours apporter quelque chose de nouveau, et c'est ça aussi qui est important.",
      },
      {
        qui: "Charlotte",
        texte:
          "Il faut quand même passer à l'action avec ce qu'on a. C'est hyper important. S'il y a des personnes qui vont regarder ce témoignage : passez à l'action maintenant, même si vous n'êtes pas encore totalement sûr de votre produit. Il y a le bêta-testing qui peut être fait, et ça permet d'améliorer, et on peut ajouter ce qui a besoin d'être ajouté. Donc ça, c'est top, franchement, c'est une super idée.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'est un très bon point que tu soulèves, parce que c'est vrai qu'on peut parfois douter de son offre. Il y a d'autres moments aussi où, vu qu'on va changer drastiquement la manière dont on va communiquer, ce qui était d'ailleurs ton cas, puisque tu es passée du côté vraiment physique, très manuel dans ton domaine, à quelque chose qui est totalement digital, où tu n'es plus réellement présente physiquement avec tes membres. C'est quelque chose qu'il a fallu modifier, que ce soit dans l'approche, donc c'est intéressant de pouvoir passer par cette étape.",
      },
      {
        qui: "Charlotte",
        texte:
          "Ouais. Et là, du coup, j'ai fait une deuxième session, on s'est dit qu'il fallait que je relance ça. J'ai fait plusieurs choses en même temps, j'ai utilisé plusieurs canaux : mon canal Instagram, donc j'ai fait un challenge sur cinq jours, et j'ai utilisé la publicité. De base, j'avais mis cent cinquante euros dans la publicité, mais suivant mes formats, ça ne m'a pas coûté autant, ça ne m'a coûté que quarante euros, et ça m'a généré cinq rendez-vous. Alors il y avait des filles pour qui, financièrement, ça n'allait pas. Sur les cinq, j'en ai closé une, et du coup, sur quarante euros de publicité, j'ai eu mille cinq cents euros d'encaissé. Donc j'étais trop contente, je me suis dit : ok, la publicité, ça fonctionne. Et au niveau du lancement, pareil, ça a fonctionné, ça m'a apporté deux ou trois personnes. Après, c'est des personnes qui me connaissaient déjà.",
      },
      {
        qui: "Charlotte",
        texte:
          "Donc là, sur ma deuxième session en ligne, et vraiment la première lancée, je suis à six mille trois cent trente-cinq euros, avec cinq élèves.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Génial. C'est top, parce que ce qui était intéressant avec cette interview, c'est vraiment ce parcours : depuis le début, tu as suivi exactement la formation. Tu avais des blocages, notamment sur le fait de passer du physique au digital, ce qui est normal puisque tu ne l'avais jamais fait : tu réapprenais un métier de bout en bout. Et aujourd'hui, cinq mois après, tu lançais ta formation, sachant que tu continuais à travailler à côté, tu continuais tes formations en présentiel. C'est quelque chose à prendre en compte, il y avait du travail autour. Et après, tu as directement lancé ce fameux bêta-testing avec tes premières clientes, tu as fait de la publicité, tu as relancé ton audience, et derrière c'est parti. Est-ce que tu aurais un message pour une personne qui regarde cette interview et qui hésite à se lancer ?",
      },
      {
        qui: "Charlotte",
        texte:
          "Forcément, c'est de ne pas trop hésiter, parce que c'est vraiment du temps de perdu, le temps qu'on est en train de réfléchir. Passer à l'action, en tout cas. Rémy n'est pas seul en plus, il a une équipe, et l'équipe répond tous les jours. Il y a des questions qu'on peut poser n'importe quand, on a la réponse vingt-quatre heures ou quarante-huit heures maximum après. Donc déjà, ça, c'est une grosse puissance, qui rassure. À côté de ça, il y a aussi les zooms que vous faites chaque semaine. Je ne participe pas tout le temps, mais quand j'avais vraiment une question précise, boum, j'arrivais le samedi. Et en plus, on peut parler en direct avec lui. Donc ça, c'est super chouette aussi, je trouve que c'est une bonne valeur rassurante dans l'accompagnement.",
      },
      {
        qui: "Charlotte",
        texte:
          "Et si vous voulez faire des sous, franchement, il faut parfois investir. Parce qu'il y a des fois où je me disais : est-ce que vraiment tout ça va fonctionner ? Et là, waouh, si ça fonctionne, c'est hyper puissant. Il faut l'expérimenter. Il y a des hésitations, en se disant : est-ce que vraiment j'ai besoin d'un tunnel ? Mais là, c'est l'avenir, on ne passera pas à côté. C'est comme ça qu'on réchauffe, j'ai l'impression aussi, le plus rapidement nos clientes. C'est comme ça qu'on peut lui parler de notre offre d'une façon plus approfondie, apporter la vraie valeur, et qu'elle puisse voir sa valeur aussi dans notre offre. Il faut foncer, il faut foncer vraiment. C'est une belle aventure, en plus ça fait trop plaisir. Aujourd'hui, je suis tellement contente. Et si tu veux ressentir ça, let's go.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Merci beaucoup de nous avoir partagé tout ça, et merci d'avoir pris le temps, puisqu'on a pris sur ton temps alors que tu étais avec des clientes juste avant. Le message que tu partages, je le trouve vraiment beau, parce que dans les valeurs que tu transmets, c'est clair que ça ne s'est pas fait tout seul, et je trouve ça important de le dire : ce n'est pas quelque chose qui est arrivé en claquant des doigts. Tu avais le travail, tu avais une expertise derrière, et tu as pris le temps de suivre les étapes une à une, de venir poser tes questions à chaque fois. Donc félicitations, les résultats que tu as aujourd'hui, même si ce n'est que le début, sont largement mérités, et j'ai hâte de voir la suite.",
      },
      {
        qui: "Charlotte",
        texte: "Merci, trop contente, merci beaucoup. À bientôt.",
      },
    ],
  },
  /* L'intervieweur est Geoffrey : François le nomme quatre fois, dont au
     dernier tour de parole. */
  {
    id: "b5taio9plc",
    slug: "francois",
    titre:
      "Avis Funnels Club : François, de 4 000 € à 8 300 € par mois en remplaçant douze produits par un seul",
    titrePage: "Avis Funnels Club : François, 8 300 € en deux mois",
    description:
      "François enseigne la guitare en ligne. Il raconte comment il a doublé son chiffre en deux mois, sans publicité, en supprimant ses douze petites formations.",
    afficheAlt:
      "François en entretien vidéo avec Geoffrey, de Funnels Club, chacun depuis son bureau",
    chapo:
      "François a trente-quatre ans, il est entrepreneur depuis 2012 et enseigne la guitare. Il plafonnait depuis presque un an malgré une audience qui doublait. Il raconte la phrase qui a tout débloqué, et pourquoi elle lui a fait mal.",
    sections: [
      {
        titre: "D'une école de musique de cent élèves à l'enseignement en ligne",
        paragraphes: [
          "François a commencé par donner des cours de guitare à domicile, puis a monté une école de musique en 2016 : plus de cent élèves chaque semaine, une équipe de quatre professeurs. Le Covid a été un coup dur, et il parle d'un avant et d'un après.",
          "C'est ce qui l'a poussé, en 2023, à découvrir l'activité en ligne : créer des programmes et les vendre, toujours dans son domaine. Fin 2023, il fait appel à un coach pour la première fois, et passe de deux ou trois cents euros de chiffre à trois ou quatre mille par mois. ==En 2024, il ferme l'école de musique.==",
        ],
        citation: {
          texte:
            "Il y a eu un avant et un après coach. Je suis passé d'un truc très brouillon à trois, quatre mille euros par mois grâce aux formations.",
          qui: "François",
        },
      },
      {
        titre: "Un an de plafond, malgré une audience qui double",
        paragraphes: [
          "C'est le point qui rend son témoignage différent des autres : tout ce qu'on lui conseillait de faire, il l'a fait. Sur cette année de plafond, il a doublé son audience, doublé ou triplé sa liste d'adresses, segmenté, mis en place de nombreuses stratégies.",
          "Et le chiffre n'a pas bougé. Il insiste sur ce point parce qu'il avait déjà de l'expérience, des formations et un coach : ==ce n'était donc pas un problème d'effort.== C'est aussi ce que constatait [Olga, pour qui doubler la publicité ne doublait pas le chiffre](/resultats/olga).",
        ],
        citation: {
          texte:
            "Malgré tous les conseils, toutes les formations, tout ce que j'ai investi, tout ce que j'ai essayé, je n'ai pas réussi à casser ce plafond de verre.",
          qui: "François",
        },
      },
      {
        titre: "Pourquoi Funnels Club : il était déjà arrivé aux tunnels tout seul",
        paragraphes: [
          "François suivait Rémy depuis un moment et avait lu son livre. Son activité tient sur YouTube et sur une lettre d'information, et il avait compris seul ce qui n'allait pas : il envoyait deux ou trois mails par semaine selon son humeur, donc ==personne ne suivait de parcours défini==.",
          "Il avait commencé à mettre en place des formes de tunnels automatisés, et voulait apprendre auprès de quelqu'un qui fait ça depuis longtemps. Il ajoute une remarque qu'on entend peu : le contenu public n'expose qu'une petite partie de ce qu'il y a à apprendre. [La formation gratuite donne cette partie publique](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Tu essayes, et tu essayes, et tu essayes, mais tu n'as pas les stratégies, tu n'as pas le recul, tu n'as pas l'expérience. Tu n'as rien, tout seul.",
          qui: "François",
        },
      },
      {
        titre: "La remarque de Rémy en coaching : douze produits, un seul aurait suffi",
        paragraphes: [
          "C'est le moment charnière, et François le raconte en riant aujourd'hui. En coaching, devant vingt ou trente personnes, Rémy lui dit que son problème est simple : ==il a trop de produits, il devrait n'en avoir qu'un seul==, et le vendre à un prix sans rapport avec ce qu'il pratique.",
          "Pour mesurer le choc, il faut les chiffres d'avant : une dizaine de formations actives entre quatre-vingts et cent vingt euros, un panier moyen qu'il venait péniblement de faire passer de soixante-dix à quatre-vingt-dix euros. Et on lui parle d'un produit à deux mille cinq cents euros minimum.",
        ],
        citation: {
          texte:
            "Je me suis dit : il m'a mis une grosse baffe. Je rebalaye tout, je dois faire un seul produit, et en plus il faut que je le mette à un prix particulièrement élevé.",
          qui: "François",
        },
      },
      {
        titre: "Ce qu'il a fait de cette remarque",
        paragraphes: [
          "Il l'a appliquée, et il ne cache pas que ça a été difficile. Il a construit une offre groupée, pas un simple assemblage de ce qu'il avait : elle inclut des éléments qu'il dit qu'il n'aurait jamais eu l'idée d'ajouter seul. Et il a mis le prix.",
          "C'est une décision plus lourde qu'elle n'en a l'air : les petites offres qu'il mettait de côté étaient celles qui le faisaient vivre. Il fallait accepter de les arrêter pour repartir d'ailleurs. [Yannick et Sylvie ont fait exactement la même bascule](/resultats/yannick-et-sylvie), en quittant leur abonnement à bas prix.",
        ],
        citation: {
          texte:
            "J'ai mis ce fameux prix. Non sans difficulté, la difficulté était là, bien sûr, mais j'ai mis en place ce nouveau prix.",
          qui: "François",
        },
      },
      {
        titre: "Ses résultats : 8 300 € en mai, sans un euro de publicité",
        paragraphes: [
          "Il rejoint le programme début avril, et l'entretien a lieu le trente mai. En avril, il fait cinq mille quatre cents euros, ce qui dépasse déjà le plafond où il butait depuis un an. ==En mai, il facture huit mille trois cents euros, plus du double de ce qu'il faisait.==",
          "Le détail qui compte : il n'a pas encore lancé de publicité. Tout vient de l'audience qu'il avait déjà, avec laquelle il faisait trois ou quatre mille euros. Ce qui a changé, ce sont l'offre, le prix et le tunnel. [D'autres membres racontent des bascules comparables](/resultats).",
        ],
        citation: {
          texte:
            "En mai, j'ai facturé huit mille trois cents euros. C'est plus du double, c'est énorme, pour moi c'est vraiment énorme.",
          qui: "François",
        },
      },
      {
        titre: "Ce qui a fait la différence, et son avis pour ceux qui hésitent",
        paragraphes: [
          "Quand on lui demande ce qui l'a le plus aidé, il cite deux choses. La compréhension d'abord : savoir comment un business fonctionne et s'optimise, ce qui améliore ensuite dix petites choses sans y penser. Les coachings ensuite, et il explique pourquoi : dix minutes de discussion déverrouillent des croyances qu'on ne savait pas avoir.",
          "Sa réponse à ceux qui hésitent tient en une idée : on ne peut pas mesurer à l'avance ce qu'on ne connaît pas encore. Si vous voulez en parler, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [le podcast de Rémy](/podcast) revient souvent sur la question du prix.",
        ],
        citation: {
          texte:
            "On a nos fausses croyances, on croit qu'on sait, on croit que c'est comme ça qu'il faut faire. Le fait de pouvoir interagir, ça déverrouille plein de choses.",
          qui: "François",
        },
      },
    ],
    transcription: [
      {
        qui: "Geoffrey",
        texte:
          "Salut François, merci d'avoir accepté cette interview avec moi aujourd'hui. Le but, pour tout le monde qui regarderait cette vidéo, c'est que tu nous partages un petit peu ton parcours, comment ça s'est passé au sein de Funnels Club, ton historique, et bien sûr où tu en es aujourd'hui. Est-ce que pour commencer, tu pourrais te présenter et nous dire ce que tu fais ?",
      },
      {
        qui: "François",
        texte:
          "Bien sûr. Alors je vais essayer de la faire courte, mais en gros, je suis entrepreneur depuis deux mille douze, j'ai trente-quatre ans. Quand je suis arrivé dans le monde du travail, j'ai fait un peu d'alternance dans la banque, puis très rapidement je suis devenu entrepreneur, je me suis mis à mon compte. Pour la faire très simple, je suis dans le domaine de l'enseignement de la guitare. J'ai commencé à donner des cours de guitare à domicile, puis très rapidement, en deux mille seize, j'ai monté une école de musique. Bon, deux mille vingt, Covid : il a fallu s'adapter, il a fallu faire pas mal de choses par rapport à ça, et ce qui se passe, c'est que c'était un coup dur. Mine de rien, le Covid a généré pas mal de choses. L'école de musique, c'était quand même à la base plus de cent élèves qui viennent chaque semaine prendre des cours, une équipe de quatre profs. Et il y a eu un avant et un après Covid.",
      },
      {
        qui: "François",
        texte:
          "En deux mille vingt-trois, on s'est un peu éloigné du Covid, et j'ai commencé à voir comment développer son activité en ligne, peut-être commencer à faire des choses un peu plus hybrides, parce qu'avec le Covid j'avais déjà mis un pied dedans. Et en deux mille vingt-trois, j'ai découvert l'activité en ligne, le fait de créer des programmes en ligne et de les vendre, toujours dans mon domaine, l'enseignement de la guitare. Et ce qui s'est passé, c'est qu'en deux mille vingt-trois, j'ai essayé tout seul : impossible de faire décoller le truc. Et pourtant, je suis débrouillard, j'essaye de trouver des solutions, de comprendre. Il y a YouTube, j'ai pris des formations en ligne, j'ai pris plein de choses pour essayer de trouver des solutions : impossible d'y parvenir. Qu'est-ce que j'ai fait ? Fin deux mille vingt-trois, j'ai fait appel à un coach.",
      },
      {
        qui: "François",
        texte:
          "Première fois que je dépense des sous pour faire appel à un coach, et franchement c'était super. Il y a eu un avant et un après coach, il y a beaucoup d'avant et d'après dans la vie. Quand je l'ai pris, je suis passé d'un truc très brouillon où je vendais des formations et où je faisais deux ou trois cents euros de chiffre d'affaires, donc c'est complètement dérisoire, à des chiffres comme trois ou quatre mille euros par mois grâce aux formations. J'ai développé ma chaîne YouTube, il y a tout plein de stratégies, tout plein de trucs qu'on ignore.",
      },
      {
        qui: "François",
        texte:
          "Et j'ai rejoint Funnels Club il n'y a pas longtemps, tout début avril. Pourquoi je l'ai rejoint ? Parce que ça faisait presque un an que je stagnais, que je plafonnais sur mon chiffre d'affaires. Sur ces presque un an, j'ai doublé mon audience, j'ai doublé, triplé la mailing list, j'ai mis en place plein de stratégies, j'ai segmenté, j'ai fait plein de choses, et je n'arrive pas à briser un plafond de verre. Et encore une fois, j'ai de l'expérience dans l'entrepreneuriat, j'ai testé plein de choses, j'ai pris plein de formations, j'avais un coach aussi. Mais à un moment donné, malgré tous les conseils, toutes les formations, tout ce que j'ai investi, tout ce que j'ai essayé, je n'ai pas réussi à casser ce plafond de verre. Funnels Club, je connaissais, j'avais vu Rémy, j'avais lu son bouquin, et je me suis dit : son approche me parle, je suis arrivé vers les tunnels de vente justement. J'essayais tout seul de mettre en place les choses, je ne suis pas plus bête qu'un autre, et tu essayes, et tu essayes, et tu essayes, mais tu n'as pas les stratégies, tu n'as pas le recul, tu n'as pas l'expérience, tu n'as pas les connaissances. Tu n'as rien, tout seul. Et quand j'ai rejoint Funnels Club, il s'est passé un truc. J'ai rejoint pour casser ce plafond de verre, et j'ai explosé ce plafond de verre.",
      },
      {
        qui: "Geoffrey",
        texte:
          "On va pouvoir y revenir. C'est vraiment intéressant, ce que tu m'as partagé : tu as eu le parcours où tu as testé le physique avec l'école de musique, où tu gérais pas mal d'élèves, avec des profs salariés. Ensuite, suite au Covid, tu as voulu digitaliser, tu avais déjà mis un pied dedans, et tu as voulu vivre de ton activité uniquement en ligne.",
      },
      {
        qui: "François",
        texte:
          "C'est ça. En deux mille vingt-trois, j'ai commencé à mettre le pied dedans, mais il y avait encore l'école de musique. Et en deux mille vingt-quatre, j'ai arrêté l'école de musique, quand j'ai vu que fin deux mille vingt-trois tout ça avait explosé. C'était beaucoup plus simple, plus puissant.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Donc en un an, tu avais déjà mis des choses en place, c'est là que tu as commencé à te créer une audience, et c'est un facteur important dont il faut parler : aujourd'hui, tu as une audience qui te suit déjà sur les réseaux, notamment sur YouTube, où tu fais pas mal de vidéos. Et à ce moment-là, tu avais plein de formations. Tu en avais combien à peu près ?",
      },
      {
        qui: "François",
        texte:
          "Des formations actives, donc qui étaient en vente, je devais tourner à dix, douze.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Donc c'est énorme. Tu avais énormément de petits produits, qui étaient autour de combien en tarif ?",
      },
      {
        qui: "François",
        texte:
          "Je tournais autour de quatre-vingts à cent vingt euros, la valeur d'un petit produit. Après, j'avais fait des petits packages pour monter à cinq cents, six cents euros, mais c'était autour de cent euros, le produit.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Tu étais dans ces conditions où tu avais déjà réussi à vivre de ton business en ligne, tu tournais autour de trois, quatre mille euros, tu avais même fait des pointes à un peu plus. Mais tu es venu vers nous sur ce côté plafond, où tu voulais faire plus avec ce que tu avais déjà. Qu'est-ce qui t'a convaincu ? Tu en as parlé, il y avait le livre, mais qu'est-ce qui t'a fait te dire qu'il fallait avancer, aller vers Rémy et son équipe ?",
      },
      {
        qui: "François",
        texte:
          "Je pense que ça s'est fait un peu naturellement, c'est peut-être mon niveau de maturité aussi. Rémy, je le suivais déjà depuis un moment sur YouTube, j'avais d'ailleurs pris son bouquin, Digital Selfmade. Et à un moment donné, ce côté automatisation, ce côté pouvoir traiter une forme de volume et créer des parcours clients optimisés, face au tunnel de vente, j'y suis un peu arrivé par moi-même. Mon activité, c'est YouTube, comme tu l'as dit, et c'est la mailing list. J'envoie des newsletters à mon audience, les gens rejoignent la newsletter depuis YouTube, et après j'envoie deux ou trois mails par semaine, et j'alimente comme ça mon audience. Et en fonction de mon humeur, je vais envoyer des mails un peu différents, je vais parler de choses différentes. Ce qui veut dire que je n'avais pas de parcours client défini. Si toi, Geoffrey, tu rejoins maintenant ma liste mail, derrière tu pouvais recevoir des mails qui parlaient de choses un peu différentes de ce que tu aurais pu imaginer. Il n'y avait pas un truc optimal pour que Geoffrey, qui vient d'arriver, puisse recevoir ce type de mail.",
      },
      {
        qui: "François",
        texte:
          "Donc je suis arrivé au tunnel, j'ai commencé à mettre en place des formes de tunnels automatisés. Et c'est vrai que le pro du tunnel, celui qui fait ça depuis un très long moment maintenant, c'est quand même Rémy. Je commençais à me pencher de plus en plus sur son contenu, et quand je vois les stratégies qu'il expose, et franchement il expose deux pour cent de ce qu'il y a réellement à apprendre, c'est ça qui est ouf aussi. J'ai eu un vrai avant et après. Ce qui m'a donné envie de rejoindre le truc, c'est cette envie de mieux comprendre ce fonctionnement sur les tunnels, l'automatisation, l'optimisation. Je pensais que c'était ça qui allait m'aider à aller plus loin dans mon activité en ligne.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Donc tu avais déjà pris conscience que les tunnels, c'est ce qu'il fallait, tu avais commencé à en mettre en place dans ton business, mais il manquait cette structure, cette ligne directrice. Et en rentrant dans Funnels Club, il s'est passé quelque chose dans un premier temps, est-ce que tu te souviens de ce que c'est ?",
      },
      {
        qui: "François",
        texte:
          "C'est le produit. C'est marrant à raconter, parce qu'aujourd'hui j'en parle avec le sourire. Donc effectivement, moi j'avais plein de petits produits, les gens viennent sur la page, ils prennent ce qu'ils veulent. Et là où je me suis pris une sorte de gentille gifle de la part de Rémy, c'est pendant un coaching. Il y a vingt, vingt-cinq, trente personnes sur le coaching, et à un moment donné il me dit : en fait, François, pour moi le problème est très simple, il y a trop de produits, tu devrais avoir un seul produit. Et après, ce produit, il faudrait que tu le vendes à un prix différent, faire un panier moyen complètement différent. Et il m'avait donné ce prix. Il me disait : il faudrait que tu fasses un produit que tu vendrais à deux mille cinq cents euros minimum, un truc comme ça.",
      },
      {
        qui: "François",
        texte:
          "Et quand il te dit ça, et que toi, dans ta tête, tu venais de passer d'un panier moyen de soixante, soixante-dix euros à quatre-vingt-dix euros de panier moyen sur tes ventes, donc tu as un peu monté le prix de tes petits produits, c'est déjà un effort difficile. Je me suis dit : il m'a mis une grosse baffe. En gros, je rebalaye tout le truc, je dois faire un seul produit, et en plus il faut que je le mette à un prix particulièrement élevé. Bon, comment est-ce qu'on fait ça, en fait ? Mais c'était l'idée qui était mise sur le papier, et ça m'a un peu secoué quand même, de proposer ça au début.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Je me souviens, on en avait aussi discuté, parce que tu avais eu ce coaching-là et on avait parlé de la nouvelle offre. Il y avait toujours ce côté où tu voulais regrouper quelques éléments, dans cette idée de prendre ce que tu avais déjà, mais de l'améliorer. Et au final, cette offre, aujourd'hui elle est créée. Aujourd'hui, on est le trente mai, pour ceux qui pouvaient se demander, et tu étais rentré début avril. Donc ça ne fait pas si longtemps. Est-ce que tu as mis ce fameux prix dont parlait Rémy ?",
      },
      {
        qui: "François",
        texte:
          "J'ai mis ce fameux prix. Non sans difficulté, la difficulté était là, bien sûr, mais j'ai mis en place ce nouveau prix. J'ai optimisé l'offre, parce que l'offre, ce n'est pas juste un bundle, pour reprendre le terme, c'est vraiment une offre groupée, donc ça inclut aussi différentes choses. Des choses que je n'aurais jamais eu l'idée de rajouter tout seul, ça fait partie des trucs que tu ne peux pas imaginer. Et effectivement, j'ai mis en place cette nouvelle offre. Et j'ai mis en place le nouveau prix.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Ça me paraissait important de le souligner, parce que tu t'es remis en question. Ça faisait déjà plusieurs années que tu avais tes petites offres, tu avais aussi suivi un autre coaching, tu continuais à créer du contenu sur les réseaux, et tu continues d'ailleurs aujourd'hui. Et tu as vraiment accepté de remettre en question toute ton offre, celle qui te permettait de vivre. Ces offres-là n'existaient plus, on les mettait sur le côté, entre guillemets, et on partait sur une nouvelle offre. J'ai trouvé ça ultra inspirant, et c'est pour ça que je t'avais proposé de faire cette interview, au-delà des chiffres : c'est vraiment cette remise en question. Est-ce que tu veux nous partager les résultats que tu as eus ? Aujourd'hui, nous sommes le trente mai, et tu étais rentré début avril.",
      },
      {
        qui: "François",
        texte:
          "Carrément. Alors pour rappel, j'ai bloqué à trois, quatre mille euros par mois depuis presque douze mois, depuis presque un an. Et donc en avril, j'ai fait cinq mille quatre cents euros, donc j'ai légèrement dépassé, mais ça ressemblait à quelque chose sur quoi je butais depuis déjà un an. Et en mai, je suis qu'au début, mais en mai j'ai facturé huit mille trois cents euros. C'est plus du double. C'est énorme, pour moi c'est vraiment énorme.",
      },
      {
        qui: "Geoffrey",
        texte:
          "C'était au-delà des chiffres, parce que je me souviens que c'était au-delà de gagner plus d'argent : il y avait vraiment une autre volonté derrière, c'était de pouvoir changer de vie, de pouvoir partager ta passion avec d'autres personnes. Et du coup, l'offre a été un peu refondue, maintenant tu es aussi plus présent pour ces personnes. C'est aussi pour ça que je trouve ça super important : tu as osé, et derrière tu as forcément les résultats qui vont avec, parce que ce que tu proposes est aussi quelque chose de qualité qui aide réellement les personnes que tu as en face de toi. À savoir qu'en plus, aujourd'hui, tu n'as toujours pas commencé la publicité. On est resté sur ton audience, celle avec laquelle tu faisais trois, quatre mille euros par mois, et aujourd'hui, sans rien rajouter, en mettant des modifications à l'intérieur du tunnel uniquement, tu as réussi à atteindre ces chiffres-là. Et en effet, c'est le début : il y a encore plein de choses à mettre en place derrière, dont la publicité, dont aussi le closing. Je tenais à te féliciter pour les résultats, et pour le travail que tu as fourni, parce que tu n'as pas chômé non plus.",
      },
      {
        qui: "François",
        texte:
          "Je me suis donné à fond, mais il y a matière aussi, et c'est génial. Tout est tellement bien structuré que si tu es un peu motivé, tu mets le doigt dans l'écosystème Funnels Club et tu es happé dans tout le parcours. C'est juste génial, tout ce qu'on apprend. C'est ultra captivant, la façon dont c'est structuré, que ce soit les coachings, les points de rendez-vous, les fiches. Vous avez bien pensé votre truc, c'est génial, c'est vraiment génial.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Dans tout ce que tu as vu, parce qu'il y a quand même pas mal de choses, et je sais que tu n'as pas tout vu, typiquement la publicité, que tu n'as pas forcément encore travaillée, s'il y avait un point en particulier qui t'a aidé, ce serait lequel ?",
      },
      {
        qui: "François",
        texte:
          "Franchement, il y a trop de trucs. J'ai envie de te dire tout. Je pense qu'il y a tout l'aspect stratégie, tout l'aspect compréhension de comment fonctionne le business, comment ça s'optimise. Déjà, tout l'aspect compréhension, ça a été énorme pour moi, ça a permis de progresser sur plein de points. Très naturellement, tu vas améliorer plein de petites choses. Et après, un des points qui est pour moi surpuissant, c'est aussi les coachings. Quand tu passes dix minutes à parler avec un coach, et vous êtes plusieurs, pour que les gens sachent : il y a plusieurs coachs, plusieurs rendez-vous à la semaine, c'est excellent. Quand tu parles quelques minutes avec le coach, il y a plein de trucs qui se déverrouillent dans ta tête. Je ne vais pas sortir les grands mots, mindset et compagnie, mais c'est vrai qu'il y a des changements. On a nos fausses croyances, notre façon de croire, on croit qu'on sait, on croit que c'est comme ça qu'il faut faire, on croit plein de choses. Le fait de pouvoir interagir ensemble, et surtout de cheminer ensemble, vous savez poser les bonnes questions, ça déverrouille plein de choses. Donc l'aspect connaissance et l'aspect coaching, ces deux trucs, pour moi, c'est ce qui a fait une grosse partie de la différence.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Je te remercie, et encore une fois félicitations pour tes résultats. On l'a vu, ce n'est que le début, donc à la prochaine interview on pourra encore discuter d'autres chiffres et d'autres paliers. Est-ce que tu aurais un dernier mot pour une personne qui regarde cette interview et qui hésite à prendre un rendez-vous ?",
      },
      {
        qui: "François",
        texte:
          "Si elle a envie d'avancer, si elle a envie d'une vraie transformation, il faut se lancer. Il n'y a pas de secret. Elle ne se doute pas de tout ce que va lui apporter le fait de rejoindre Funnels Club. Elle ne se doute pas : si elle imagine que ça va lui apporter ça, ça va lui apporter bien plus. Toute seule, elle n'avancera pas. Il faut qu'elle rejoigne, parce que ça aide à avancer. C'est vraiment ce truc-là, c'est l'effet que ça m'a fait.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci beaucoup encore une fois. On aura l'occasion de refaire une interview comme celle-ci, comme ça on verra les étapes, les paliers, ça pourra aussi parler à d'autres personnes. Encore une fois, le but, c'était vraiment de pouvoir inspirer à travers ton parcours, montrer aussi le champ des possibles, parce que ce sont des choses qu'on ne voit pas tout le temps. Merci beaucoup pour ton temps et pour ce partage.",
      },
      {
        qui: "François",
        texte: "Merci à toi Geoffrey, merci pour tout, les gars.",
      },
      {
        qui: "Geoffrey",
        texte: "Avec plaisir, à très bientôt.",
      },
    ],
  },
  /* L'intervieweur est Geoffrey : Jérémy le nomme trois fois.

     **Le chiffre est donné avec sa réserve, et elle est conservée.** Jérémy dit
     avoir passé la barre des dix mille euros, puis ajoute aussitôt qu'il
     faudrait qu'il regarde ses statistiques pour donner un chiffre plus exact.
     L'article dit les deux. Retirer la réserve pour ne garder que le montant
     serait en faire une affirmation que la personne n'a pas faite. */
  {
    id: "rtil6qeznq",
    slug: "jeremy",
    titre:
      "Avis Funnels Club : Jérémy, salarié, a passé la barre des 10 000 € avec des cours d'anglais en ligne",
    titrePage: "Avis Funnels Club : Jérémy, 10 000 € en étant salarié",
    description:
      "Jérémy est salarié et donne des cours d'anglais. Il raconte son premier lancement raté, le changement de cible qui a tout débloqué, et ses premiers résultats.",
    afficheAlt:
      "Jérémy en entretien vidéo avec Geoffrey, de Funnels Club, chacun depuis son bureau",
    chapo:
      "Jérémy est encore salarié et cherchait d'abord un complément de revenu. Il raconte comment son premier lancement n'a pas pris du tout, et ce qu'il a changé pour que le second parte, selon ses mots, comme un feu.",
    sections: [
      {
        titre: "Un salarié qui cherche un complément de revenu",
        paragraphes: [
          "Jérémy travaille encore comme salarié. Son point de départ est le plus commun de tous les témoignages de cette page : il cherchait ==un complément de revenu pour contrecarrer l'inflation==, pas un changement de vie.",
          "L'idée a mûri avec les années. Il donnait déjà des cours d'anglais en présentiel, et il a décidé de passer le cap et de les digitaliser. Il précise aussi ce qui l'avait retenu jusque-là : un divorce, après lequel il n'était pas disposé à se lancer dans une aventure de ce genre.",
        ],
        citation: {
          texte:
            "Je cherchais à avoir un complément de revenu pour contrecarrer l'inflation. Et il y a une idée qui a germé au fur et à mesure des années.",
          qui: "Jérémy",
        },
      },
      {
        titre: "Pourquoi Funnels Club, après avoir comparé",
        paragraphes: [
          "Il dit avoir fait un tour complet de ce qui se proposait en ligne avant de choisir. Ce qu'il retient comme critère majeur n'est ni le prix ni le contenu du programme : ce sont les valeurs de Rémy et de son équipe, et le fait qu'il s'est senti en totale confiance.",
          "Cette confiance comptait plus pour lui que pour d'autres, et il explique pourquoi juste après. Si vous en êtes au même point de comparaison, [la formation gratuite permet de juger sur pièces](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Je crois que ce sont les valeurs de Rémy, puis de son équipe. C'est l'un des critères majeurs qui m'a fait choisir Funnels Club.",
          qui: "Jérémy",
        },
      },
      {
        titre: "Son appréhension : partir de rien, sans business existant",
        paragraphes: [
          "Jérémy nomme précisément ce qui le distinguait des autres membres : ceux qui avaient déjà un business ancré pouvaient s'appuyer sur une expérience et une expertise. Lui avait son emploi, et rien d'autre. ==Il avait peur de se planter==, et le dit sans détour.",
          "C'est exactement pour cette raison qu'il a tenu à choisir son accompagnement plutôt que de se lancer seul. C'est l'inverse de la situation de [François, qui plafonnait après des années d'activité](/resultats/francois), et le même programme a servi aux deux.",
        ],
        citation: {
          texte:
            "Moi, c'était tout nouveau. J'avais mon boulot de salarié, mais me lancer dans une aventure comme ça, je trouvais que c'était assez audacieux.",
          qui: "Jérémy",
        },
      },
      {
        titre: "Le premier lancement qui n'a pas pris",
        paragraphes: [
          "C'est la partie la plus utile de son témoignage. Sa première offre visait ==des cours d'anglais pour les enfants==. Tout était construit, l'étude faite, tout était en place. Au moment d'appuyer sur le bouton, il n'y a eu ni les prospects, ni les clients attendus.",
          "Il décrit très bien le moment : avoir tout bien fait et ne pas comprendre pourquoi rien ne se passe. C'est le même mur que celui de [Tatiana, dont la première niche n'a pas tenu l'étude de marché](/resultats/tatiana).",
        ],
        citation: {
          texte:
            "J'avais tout construit, tout bien fait, et je me suis dit : mais qu'est-ce qui se passe ? Pourquoi ?",
          qui: "Jérémy",
        },
      },
      {
        titre: "Le changement de cible qui a tout débloqué",
        paragraphes: [
          "Après en avoir discuté avec l'équipe, il a réorienté son offre ==vers un public adulte==. Et c'est là que les premiers clients sont arrivés.",
          "Le point qu'il tient à faire passer, c'est qu'il n'a pas tout refait depuis zéro. Il a repris une bonne part de ce qui était déjà construit et réadapté la pédagogie à la nouvelle cible. Il cite en passant la phrase de Rémy qui lui a servi de règle : le marché a toujours raison.",
        ],
        citation: {
          texte:
            "Je n'ai pas tout refait. J'ai juste réadapté la pédagogie pour une cible adulte, et là, le truc était parti : c'est comme un feu.",
          qui: "Jérémy",
        },
      },
      {
        titre: "Ses résultats, et ce qu'il en dit lui-même",
        paragraphes: [
          "Au moment de l'entretien, Jérémy annonce ==avoir passé la barre des dix mille euros==, en précisant aussitôt qu'il devrait regarder ses statistiques pour donner un chiffre plus exact. Il ajoute que c'est un montant qu'il ne pouvait pas espérer, et qu'il reste une phase d'optimisation à mener.",
          "Il décrit aussi un changement qu'il n'avait pas prévu : il était venu pour regarder la formation une fois par semaine, et il s'est pris au jeu. Ce qu'il met en avant n'est pas le chiffre mais le fait d'avoir un impact sur la vie de gens. Les [autres membres décrivent souvent cette bascule](/resultats).",
        ],
        citation: {
          texte:
            "J'y suis allé pour un complément de revenu, et on se prend totalement au jeu. On y met tellement de soi que, quand on voit que ça fonctionne, ça fait un effet exponentiel.",
          qui: "Jérémy",
        },
      },
      {
        titre: "Son seul regret, et son avis pour ceux qui hésitent",
        paragraphes: [
          "Ce qu'il cite comme condition de réussite est d'abord une discipline : rien ne tombe tout cuit, tout est à disposition, mais c'est à chacun de faire la différence, avec régularité. Il dit s'être décidé en se demandant pourquoi les autres y arriveraient et pas lui.",
          "Il termine par un regret, un seul, et il le formule sans hésiter. Si vous vous posez la même question que lui il y a quelques années, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [les articles de Rémy](/articles) reviennent sur le choix de la cible.",
        ],
        citation: {
          texte:
            "J'ai peut-être un regret quand même. Juste un regret : c'est celui de ne pas l'avoir fait plus tôt.",
          qui: "Jérémy",
        },
      },
    ],
    transcription: [
      {
        qui: "Geoffrey",
        texte:
          "Salut Jérémy, merci d'avoir accepté aujourd'hui de faire cette interview avec moi. Le but, c'est tout simplement que tu partages un petit peu le parcours que tu as eu au sein de Funnels Club, comment ça s'est passé, et où tu en es aujourd'hui. Est-ce que dans un premier temps, tu pourrais présenter qui tu es et ce que tu fais ?",
      },
      {
        qui: "Jérémy",
        texte:
          "Déjà, en ce qui me concerne, je suis encore salarié, et je cherchais à avoir un complément de revenu pour contrecarrer l'inflation qu'il y a actuellement. Et il y a une idée qui a germé au fur et à mesure du temps, des années. Le business que j'ai développé, ce sont des cours d'anglais, un accompagnement en anglais. Je l'ai fait en présentiel il y a quelques années, et puis j'ai décidé de passer le cap et de le digitaliser. Et je l'ai fait avec Funnels Club.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Et donc cette activité, tu la faisais déjà en physique, il y a quelques années de ça, avant de rejoindre Funnels Club. Tu avais vraiment cette idée d'avoir un complément de revenu dans un premier temps. Quand est-ce que c'est venu, ce côté où tu voulais aussi pouvoir arriver à une activité dont tu vivrais uniquement ? Puisque c'est l'objectif que tu as aujourd'hui avec ce business.",
      },
      {
        qui: "Jérémy",
        texte:
          "C'est exactement ça. C'est un concours de circonstances. Il faut savoir que Rémy, je l'ai connu il y a très, très longtemps, sur sa chaîne, je l'ai suivi. Et puis j'ai connu différentes étapes dans ma vie, notamment mon divorce, qui a fait que je n'étais pas disposé à pouvoir me lancer dans une aventure, notamment digitale. Et puis, chemin faisant, quand cette idée de vouloir proposer un service en ligne a germé, Rémy s'est représenté, est réapparu, et c'est là que je me suis dit : c'est exactement ce qu'il me faut.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Qu'est-ce qui t'a fait rejoindre ce programme plutôt qu'un autre ? Parce que tu en parles, tu as dit : c'est ce qu'il me faut. Qu'est-ce qui t'a fait avoir cette vision ?",
      },
      {
        qui: "Jérémy",
        texte:
          "J'ai fait un petit mercato, quand même, de ce qui se passait en ligne, en toute transparence. Et je crois que ce sont les valeurs de Rémy, puis de son équipe. C'est au-delà du plus, c'est vraiment, je pense, l'un des critères majeurs qui a fait que, moi en tout cas, ça a été la chose qui m'a fait choisir Funnels Club. J'ai été en totale confiance. L'équipe est extra. Rémy, c'est tout bête, on a juste à appliquer ce qu'il nous dit, et ça fonctionne. J'en suis la preuve, vraiment, je ne peux pas mieux témoigner : j'en suis la preuve vivante. Et je peux en parler.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Tu es arrivé avec cette idée d'aider les personnes, mais tu as tout construit au sein de Funnels Club. Est-ce que tu avais des points qui t'ont bloqué avant de nous rejoindre, et que tu as réussi à débloquer au sein de Funnels Club ?",
      },
      {
        qui: "Jérémy",
        texte:
          "Alors, une certaine appréhension. Parce que contrairement à d'autres personnes qui avaient déjà un business ancré, qui pouvaient tabler sur un certain empirisme, une certaine expertise, moi c'était tout nouveau. J'avais mon boulot de salarié, mais me lancer dans une aventure comme ça, je trouvais que c'était assez audacieux, et j'avais un peu peur de me planter. C'est pour ça que je voulais vraiment choisir l'accompagnement qui allait me correspondre et avec qui j'aurais été en totale confiance. Et j'ai trouvé que c'était Funnels Club. Et puis j'ai tout simplement appliqué, étape par étape, tout ce qu'il fallait appliquer. Et ça fonctionne, jusqu'à mes premiers résultats, que je n'attendais pas. C'est génial.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Félicitations encore une fois pour tes résultats, on aura l'occasion d'y revenir puisqu'on va aussi les partager. Le but, c'est de pouvoir inspirer d'autres personnes. Tu as partagé plusieurs fois que c'est l'accompagnement qui t'a vraiment aidé, et les personnes aussi. Aujourd'hui, si tu devais dire les choses qui t'ont permis d'atteindre ton objectif, les premiers résultats que tu as eus, c'est quoi concrètement dans la formation ?",
      },
      {
        qui: "Jérémy",
        texte:
          "Je pense, une certaine rigueur quand même. Parce qu'il ne faut pas négliger : ça ne tombe pas non plus du ciel tout cuit dans le bec. On a tout à disposition dans Funnels Club, mais c'est quand même à nous de faire la différence. À partir du moment où on sait ça, où on est motivé, où on fait les choses avec une certaine régularité, ça fonctionne. Et je me suis dit : si les autres y arrivent, pourquoi pas moi ? Et là, ça m'arrive. Il faut s'accrocher, il faut y croire, et puis bosser, tout simplement. Et ça finit par payer.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Je suis complètement d'accord avec toi, c'est pour ça que je voulais revenir sur ce point-là. Il y a pas mal de choses, d'informations, d'accompagnement. Mais ce qui t'a permis d'être là, c'est le travail que tu as fourni réellement, et tu as appliqué étape par étape. Ça part aussi de toi et de ta volonté de travailler, d'avancer, d'avoir de la rigueur. Tu as vraiment raison de le dire, parce que c'est aussi quelque chose qu'on veut véhiculer : ce n'est pas un bouton sur lequel on appuie et puis ça fonctionne. C'est vraiment créer un business sur le long terme. Aujourd'hui, est-ce que tu peux partager les résultats que tu as réussi à atteindre au sein de Funnels Club ?",
      },
      {
        qui: "Jérémy",
        texte:
          "Juste avant les résultats, il y a quand même la maturation au niveau du projet, tu l'as très bien résumé. C'est vrai que j'ai rejoint Funnels Club juste pour un complément de revenus. J'étais sur quelque chose d'additionnel, que j'allais regarder peut-être une fois par semaine, ou deux, trois fois par mois, et pas plus. Et en fait, on se prend totalement au jeu. C'est quelque chose d'extraordinaire. On y met tellement de soi, tellement d'énergie, et quand on voit que ça fonctionne, ça fait un effet exponentiel, une espèce de boum. C'est tellement gratifiant, valorisant, et c'est tellement plaisant aussi de voir qu'on a un impact sur la vie des gens, et qu'on peut transformer leur vie, tout simplement. À travers les réseaux, à travers notre formation, à travers l'accompagnement, c'est vraiment top. Comme Rémy et toi, vous avez pu avoir un impact sur ma vie également. C'est génial de transmettre ça.",
      },
      {
        qui: "Jérémy",
        texte:
          "Et au niveau des résultats, je pense que j'ai passé la barrière des dix mille. Il faudrait que je regarde sur mes statistiques pour te donner un chiffre un peu plus exact, mais en tout cas, c'est un chiffre que je ne pouvais pas espérer. Et c'est que le début. Maintenant, il y a encore cette phase d'optimisation à faire, mais je pense que je suis sur la bonne voie, j'en suis même sûr.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Félicitations, parce qu'on n'avait même pas rééchangé sur ces derniers résultats. Félicitations pour ce palier. Quoi qu'il arrive, on va aller chercher l'autre palier, mais ça peut être intéressant de parler de comment ça s'est passé. Est-ce que tu veux partager ce moment où tu avais lancé, et où après il y a eu des changements qui ont dû être opérés ? Ça peut être intéressant de montrer cette adaptabilité que tu as eue.",
      },
      {
        qui: "Jérémy",
        texte:
          "Je pense qu'il faut savoir être flexible, comme le dit Rémy : le marché a toujours raison. Et je te remercie encore, Geoffrey, d'avoir été là pour moi aussi, parce que tu es vraiment quelqu'un de super, avec des conseils et des recommandations qui payent. Au préalable, ce que je voulais proposer, c'étaient des cours d'anglais pour les enfants. J'avais tout câblé là-dessus, j'avais fait mon étude, tout était bien. Et au moment de lancer, d'appuyer sur le bouton, je n'avais pas le retour escompté au niveau des prospects, au niveau des clients. Ça ne fonctionnait pas, ça ne prenait pas. Donc on en a échangé. Il y a eu cette première phase où j'avais tout construit, tout bien fait, et je me suis dit : mais qu'est-ce qui se passe ? Pourquoi ?",
      },
      {
        qui: "Jérémy",
        texte:
          "Et donc, après en avoir discuté avec toi, on a revu la copie, et on a pu orienter ça sur l'aspect adulte. Et puis là, des chakras se sont ouverts : les premiers clients, les premières choses. Et j'ai pu capitaliser sur tout ce qui avait été fait préalablement pour le réinjecter. Quand on le fait une deuxième fois, je n'ai pas tout refait from scratch, j'ai quand même repris un bon nombre de choses. J'ai juste réadapté la pédagogie pour une cible adulte, et puis là, ça y est, le truc était parti : c'est comme un feu, ça prend de façon exponentielle. Et forcément, il faut savoir se remettre en question, il faut savoir se poser les bonnes questions, il faut savoir écouter aussi, écouter le marché, écouter les recommandations comme celles que tu as pu me donner, il faut savoir être alerte. Et puis ne pas avoir peur non plus de remonter les manches et d'essayer des choses, pour essayer de trouver la formule qui fonctionne.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci de ton partage, ça me semblait vraiment important de revenir dessus, parce que je pense que c'est aussi ce qui fait qu'aujourd'hui tu as réussi : tu as osé poser les questions, tu as osé te remettre en question, et tu as osé reprendre des choses sur lesquelles tu avais travaillé, ce qui a pris du temps. Même si tu n'étais pas reparti de zéro, ça reprenait du temps de refaire les choses. Je trouvais ça vraiment important et inspirant, parce qu'on a souvent la vision que toutes les personnes qui réussissent ont toujours eu la bonne idée au bon moment. Alors qu'au final, tu as eu une idée, et l'idée que tu te faisais du business à ce moment-là, ce n'était pas ce qui fonctionnait. Tu as retravaillé dessus pour aller vers cette nouvelle version qui, aujourd'hui, fonctionne.",
      },
      {
        qui: "Jérémy",
        texte:
          "Je voudrais quand même ajouter une chose, si vraiment j'avais quelque chose à dire : j'ai peut-être un regret quand même. Juste un regret : c'est celui de ne pas l'avoir fait plus tôt. Vraiment, vraiment. Parce que c'est une aventure humaine, on apprend sur soi-même, il y a des rencontres, des échanges comme celui-là avec toi, avec Rémy, qui n'ont pas de prix. C'est super, et on se voit évoluer, on se voit grandir, on se découvre encore après la quarantaine passée. Donc c'est génial, et je ne vous remercierai jamais assez.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Je te remercie, mais tu peux aussi être fier de toi, comme on l'a dit : ça part aussi de toi, de ce que tu as voulu faire. Donc félicitations à toi aussi. Est-ce que peut-être un dernier mot pour finir cette interview, qui serait adressé aux personnes qui regardent cette vidéo et qui hésitent à prendre un appel avec nous ?",
      },
      {
        qui: "Jérémy",
        texte:
          "Comme j'ai pu te le dire, c'est vraiment quelque chose à faire. Je suis le meilleur exemple de la réussite : je suis parti de rien du tout, vraiment pas grand-chose, et j'ai réussi à construire quelque chose de viable, quelque chose qui génère des revenus. Donc si vraiment vous cherchez une aventure qui soit à la fois excitante et enrichissante, sautez le pas, vraiment, passez à l'action. Passez à l'action, vous n'allez pas le regretter. Moi, en tout cas, je salue encore le fait d'avoir croisé Rémy et son équipe, et d'être arrivé là où j'en suis. Et c'est que le début.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci beaucoup encore une fois, félicitations à nouveau pour tes résultats, et quoi qu'il arrive, on se retrouve de l'autre côté, comme toujours.",
      },
      {
        qui: "Jérémy",
        texte: "Avec grand plaisir, merci encore Geoffrey.",
      },
    ],
  },
  /* L'intervieweur n'est pas nommé de façon lisible : la reconnaissance vocale
     pose un « Jean-Pierre » au deuxième segment, au milieu d'une phrase de
     l'intervieweur, ce qui ne se reconstitue pas. Les tours lui sont rendus
     sous « Funnels Club ».

     **Cédric est psychologue, et l'article ne dit rien de ce qu'il soigne.**
     Aucune description de sa thérapie, aucune promesse d'effet, aucun
     vocabulaire clinique : la page parle de la façon dont il a organisé et
     tarifé son activité, et de rien d'autre. */
  {
    id: "ive07co9xm",
    slug: "cedric",
    titre:
      "Avis Funnels Club : Cédric, psychologue, a fait passer son programme en ligne de 250 € à 600 €",
    titrePage: "Avis Funnels Club : Cédric, de 250 € à 600 € le programme",
    description:
      "Cédric est psychologue en Corse, avec six mois d'attente. Il raconte comment il a ouvert son activité en ligne et plus que doublé le prix de son programme.",
    afficheAlt:
      "Cédric en entretien vidéo avec Funnels Club, depuis son cabinet en Corse",
    chapo:
      "Cédric dirige des centres thérapeutiques en Corse, avec une vingtaine de personnes autour de lui et cinq à six mois d'attente. Il raconte ce qui l'a fait renoncer à son site d'articles, et ce que ça lui a rapporté.",
    sections: [
      {
        titre: "Une activité saturée, et une limite qui n'est pas commerciale",
        paragraphes: [
          "Cédric est psychologue. Il a plusieurs centres thérapeutiques et plus d'une vingtaine de personnes qui travaillent avec lui. Son problème n'a jamais été de trouver des patients : il en avait trop, et sur sa spécialité il est le seul sur son territoire.",
          "La limite est ailleurs, et il la pose en heures : huit, dix, douze heures de consultations par jour, et ça s'arrête là. ==Le délai pour un premier rendez-vous atteignait cinq à six mois==, ce qu'il juge inacceptable. C'est ce qui l'a poussé à construire un programme en ligne, en vidéo, avec des exercices.",
        ],
        citation: {
          texte:
            "J'avais cinq à six mois d'attente pour que les gens aient leur premier rendez-vous. Ça, ce n'était pas acceptable.",
          qui: "Cédric",
        },
      },
      {
        titre: "Ce qui le bloquait : la technique, et le fait d'être seul",
        paragraphes: [
          "Il énumère ses obstacles sans ordre de priorité : la connaissance, la technique, le marketing, la communication en général. Mais celui qu'il nomme en premier est d'être seul, et son raisonnement mérite d'être cité tel quel.",
          "Il est favorable au fait de se planter, il le dit clairement. Ce qu'il reproche à la solitude, c'est ==le nombre de façons différentes de se planter==. Avoir un guide et entendre d'autres membres dire ce qui n'a pas marché chez eux vaut, pour lui, un raccourci. On retrouve ce constat chez [François, qui avait pourtant déjà un coach](/resultats/francois).",
        ],
        citation: {
          texte:
            "C'est important de se planter, mais on peut se planter de tellement de manières. Et il y a des gens qui sont passés avant nous.",
          qui: "Cédric",
        },
      },
      {
        titre: "L'erreur qu'il a mis du temps à lâcher : son site et ses articles",
        paragraphes: [
          "C'est le passage le plus honnête de l'entretien, et il porte sur lui-même. Ses premiers patients venaient de son site, qu'il alimentait en articles rédigés entièrement à la main. Comme ça avait marché, il s'y accrochait.",
          "Il raconte s'être entendu dire quoi faire et avoir répondu, en substance, qu'il avait sûrement raison mais qu'il préférait sa méthode. ==Elle marchait un peu.== Quand il a basculé sur la publicité, déléguée à quelqu'un, il a gagné un nombre d'heures qu'il ne sait pas compter, et obtenu plus de contacts, et mieux qualifiés.",
        ],
        citation: {
          texte:
            "Mon erreur, ça a été de me dire : il a sûrement raison, mais moi j'aime bien faire comme ça. Et en fait ça marchait un peu comme ça, mais quand j'ai switché, ça a fait un peu plus, puis un peu plus.",
          qui: "Cédric",
        },
      },
      {
        titre: "Les prix : de 250 à 600 € le programme, et de 60 à 150 € la consultation",
        paragraphes: [
          "Son programme en ligne était à deux cent cinquante euros. Il dit que c'est là que le programme l'a le plus aidé, et que ça a été compliqué : il a entendu tous les sons de cloche, on lui a suggéré de tester beaucoup plus haut, il a essayé plusieurs choses. ==Il est aujourd'hui à six cents euros.==",
          "Il a fait la même chose sur son activité de cabinet, en passant ses consultations de soixante à cent cinquante euros. Et il insiste sur son motif, qui n'est pas celui qu'on attend : il ne cherchait pas à gagner plus, mais à libérer du temps pour l'employer ailleurs. C'est le même calcul que fait [Augustin Passy en personal branding](/resultats/augustin-passy).",
        ],
        citation: {
          texte:
            "Ce n'est pas tant mon objectif de gagner plus, c'était de retirer du temps pour l'exploiter sur autre chose.",
          qui: "Cédric",
        },
      },
      {
        titre: "Ses résultats : un plancher à 2 500 € par mois, et un lancement à neuf ventes",
        paragraphes: [
          "Avant, il vendait deux programmes par mois et en était content : c'était un projet secondaire. Aujourd'hui, il annonce ==un minimum de deux mille cinq cents euros par mois==, en précisant qu'en ce moment il ne fait presque rien dessus.",
          "Le mois d'août est son exemple : il a travaillé sa liste de contacts, communiqué, proposé une offre datée, et fait huit ou neuf ventes. Il raconte surtout ce qui l'a surpris, et qui est le contraire de ce qu'il croyait.",
        ],
        citation: {
          texte:
            "Je disais à mon épouse : ça ne marche pas, j'ai encore flopé. Et en fait, vingt-quatre heures avant la fin, ça a commencé à poper, et les dernières heures du dernier jour, c'est monté.",
          qui: "Cédric",
        },
      },
      {
        titre: "Ce que ça a changé : des patients sur une bonne partie du globe",
        paragraphes: [
          "Il dit ne pas pouvoir chiffrer précisément cette partie-là, mais il en décrit l'effet : il suit désormais des personnes de Nouvelle-Zélande, de Kinshasa, de Belgique, du Canada. Sur l'espace francophone, il a ouvert une bonne partie du globe.",
          "Il présente ça comme sa première satisfaction, avant le revenu, parce que les parcours qu'il rencontre l'intéressent. [Roland Buffet décrit la même ouverture géographique depuis la Savoie](/resultats/roland-buffet). Son objectif suivant est de se retirer davantage du cabinet pour développer autre chose, et il considère désormais le palier des dix mille euros comme atteignable, alors qu'il le trouvait ubuesque.",
        ],
        citation: {
          texte:
            "L'objectif des dix mille, avant ça paraissait ubuesque de l'imaginer pour moi. Maintenant, je me dis : mais ouais, carrément.",
          qui: "Cédric",
        },
      },
      {
        titre: "Sa critique, et son avis pour ceux qui hésitent",
        paragraphes: [
          "Cédric formule la seule critique de ces quinze entretiens, et elle est nuancée : il y a trop d'informations pour lui. Il compare ça à un téléphone dont on utilise dix pour cent des fonctions, et dit avoir perdu du temps à vouloir tout regarder avant d'agir. [Charlotte, qui n'est pas du métier de l'informatique, y voit au contraire un guide](/resultats/charlotte).",
          "Son conseil final tient en deux choses : ne pas avoir peur de réinvestir à mesure que ça monte, et savoir que le programme ne fait rien à votre place. Si vous voulez en parler, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site) ; sinon, [la formation gratuite montre la méthode](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Avec des heures et des heures de boulot, ne pas avoir de résultats avec le programme, ça m'étonnerait vraiment. Même si à un moment j'ai eu le doute, moi aussi.",
          qui: "Cédric",
        },
      },
    ],
    transcription: [
      {
        qui: "Funnels Club",
        texte:
          "Déjà bonjour Cédric, merci d'avoir accepté aujourd'hui de faire cette interview pour pouvoir expliquer ton parcours, ton passage dans Funnels Club, les résultats que tu as pu atteindre, comprendre un petit peu toutes ces choses-là, et potentiellement inspirer d'autres personnes. Peut-être pour commencer, est-ce que tu pourrais te présenter, dire dans quelles conditions tu étais avant Funnels Club ?",
      },
      {
        qui: "Cédric",
        texte:
          "Très simplement, moi je suis psychologue. J'ai plusieurs activités, j'ai des centres thérapeutiques avec plusieurs personnes qui travaillent avec moi, on est plus d'une vingtaine. Ça fait longtemps que j'ai beaucoup de monde, cette chance-là en termes de patients, et malheureusement pour les patients, beaucoup d'attente. Il m'est venu au fur et à mesure de développer à la fois les équipes, et aussi d'autres choses sur internet, puisque j'avais des gens qui venaient au-delà de ma région. Là où les gens venaient en physique, il y avait des gens qui nous contactaient pour avoir une aide à distance. Et j'ai développé petit à petit une thérapie en ligne avec des vidéos, comme une formation finalement, mais sous forme de thérapie, avec des exercices. Et je suis arrivé à beaucoup de difficultés techniques, de marketing, de communication en général. Je suivais déjà Rémy depuis un moment, et d'autres bien entendu, pour essayer de trouver d'autres solutions et d'aller plus vite, parce que seul, ce n'est jamais évident.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Pour toi, c'était quoi le principal obstacle que tu as eu avant de nous rencontrer et de rentrer dans Funnels Club ?",
      },
      {
        qui: "Cédric",
        texte:
          "Plein. L'obstacle de la connaissance, l'obstacle d'être tout seul, de pouvoir tout faire et en même temps de ne pas savoir dans quelle direction aller et ce qui va marcher. Donc parfois de tester des choses. C'est important, moi je pense vraiment, de se planter, mais quand même : on peut se planter de tellement de manières. Et il y a des gens qui sont passés avant nous, notamment Rémy avec le programme, mais il y en a plein d'autres. Du coup, d'avoir un guide, ça a été hyper important, ça permet d'avoir un boost. Même d'écouter d'autres personnes du programme, ça aide beaucoup, parce qu'il y a des gens qui vont dire : moi, ça n'a pas marché, tiens, fais ça, ça va fonctionner beaucoup mieux. C'est très enrichissant d'être avec des gens qui ont le même parcours, soutenus par quelqu'un qui va vraiment nous guider avec sa propre expérience de réussite. Parce que c'est ça dont il faut parler à la base avec Rémy : c'était de suivre quelqu'un qui avait déjà tracé une voie. Et ça, ça a été super.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'est ce que tu recherchais vraiment à ce moment-là, lorsque tu nous as contactés ?",
      },
      {
        qui: "Cédric",
        texte:
          "Il fallait vraiment un guide, de l'info. Même, à la limite, si je peux émettre une critique, c'est que moi, j'ai eu même trop d'infos dans le programme. Tellement de trucs que je n'ai pas tout exploité. Mais à la limite, je pense, peut-être comme un téléphone : on utilise dix pour cent des fonctionnalités, mais on sait qu'on peut faire beaucoup plus. Donc je n'ai pas eu trop dans le sens où ce n'est pas bien : il y en a eu plein, et c'était limite frustrant de ne pas avoir à tout utiliser. Parfois, j'ai perdu du temps à essayer de tout emmagasiner, d'écouter toutes les vidéos, alors qu'en fait, parfois il faut aussi y aller, tout en ayant ce fil conducteur de base. Mais il y a beaucoup d'infos, c'est top, c'est de la qualité. C'est un retour positif que je fais.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'est important, ce que tu dis, parce qu'en effet il y a des choses que tu n'as pas eu besoin d'utiliser dans ce que tu proposes aujourd'hui. Est-ce que tu peux dire ce que tu as mis en place, par rapport à ce que tu avais avant ?",
      },
      {
        qui: "Cédric",
        texte:
          "Le plus gros changement, celui qui m'a fait switcher, c'est que je perdais beaucoup de temps à faire des trucs qui ne servaient à rien. Notamment, Rémy le répète tout le temps : faire un site, l'alimenter en articles, tout ça. Moi, je m'accrochais à ça, parce que j'étais parti de là, et c'est ce qui m'avait au début commencé à m'amener mes premiers patients, mes premiers clients, et je continuais à m'accrocher là-dessus. Alors que pas du tout. Et quand j'ai basculé sur la publicité, avec quelqu'un maintenant qui s'en charge pour moi, j'ai gagné je ne sais pas combien d'heures par semaine, parce qu'avant je rédigeais tout, je faisais tout bien, et je ne voulais pas non plus utiliser d'outils pour rédiger des textes. Et au final, il y avait même plus de prospects, plus de gens qualifiés, donc des gens que je pouvais aider, en ayant recours à la publicité. Et c'est souvent ce que disait Rémy : écoutez-moi, faites ci, faites ça, et vous allez voir. Mon erreur, ça a été de me dire : il a sûrement raison, mais moi j'aime bien faire comme ça, ça a marché un peu comme ça. Et en fait, ça marchait un peu comme ça, mais quand j'ai switché, ça a fait un peu plus, et puis un peu plus, et là je suis encore en train de monter. Donc j'aurais dû l'écouter dès le début. Mais si je n'avais pas rejoint le programme, je serais peut-être encore deux ans en arrière. Donc c'est quand même positif, évidemment.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'est super intéressant, parce que dans l'optique dans laquelle tu nous as rejoints, on a échangé juste avant, tu m'expliquais qu'il y avait cette notion de pouvoir aider un maximum de personnes. Tu avais ce sentiment d'être bloqué à ta région, puisque tu es en Corse. Aujourd'hui, ça t'a permis de rayonner grâce à la publicité. Est-ce que tu peux partager avec nous les chiffres que tu as réussi à faire avec Funnels Club ?",
      },
      {
        qui: "Cédric",
        texte:
          "Alors déjà, je vais partir de mon niveau local et physique. Effectivement, j'étais bloqué à un nombre d'heures par jour : si je prends huit heures de patients, je prends huit heures de patients, dix heures de patients, j'ai déjà fait douze ou plus, mais à un moment donné, de toute façon, ça a une limite. En termes d'attente aussi, pour les patients : j'avais cinq à six mois d'attente pour que les gens aient leur premier rendez-vous. Ça, ce n'était pas acceptable. Localement, on n'est pas hyper nombreux, ce qui explique aussi que j'ai du monde, et dans la spécificité de ma niche, je suis le seul, donc forcément j'avais tout le monde ici. En ouvrant internet, j'ai eu des gens. Là, au niveau des chiffres, je ne peux pas vraiment dire, mais en tout cas ça me fait rayonner, puisque je suis des patients de Nouvelle-Zélande, de Kinshasa, de Belgique, du Canada. Au niveau francophone, j'ai ouvert une bonne partie du globe, et c'est hyper enrichissant, parce qu'il y a des parcours de vie de fou, donc en tant que psy, c'est extraordinaire.",
      },
      {
        qui: "Cédric",
        texte:
          "Au tout début, avant de rejoindre le programme, ma thérapie en ligne était à deux cent cinquante euros. Et ça aussi, le programme m'a beaucoup aidé à switcher sur un prix. Ça a été compliqué, puisqu'à un moment on me disait que je devrais tester de le mettre à mille cinq cents. J'ai entendu tous les sons de cloche, j'ai testé plein de trucs. Mais là où j'ai vraiment gagné quelque chose, c'est quand je l'ai passé, et mes consultations pour ce programme-là, je les ai passées de soixante à cent cinquante. En termes de temps gagné, et vraiment j'insiste, ce n'est pas tant mon objectif de gagner plus, c'était de retirer du temps pour l'exploiter sur autre chose. Et c'est vraiment ça. Je ne prends pas énormément de patients à cent cinquante, mais ils sont vraiment sélectionnés, donc ils sont tous qualifiés à fond.",
      },
      {
        qui: "Cédric",
        texte:
          "Et au niveau des thérapies en ligne, elle était à deux cent cinquante, et quand j'en vendais deux par mois, j'étais content, puisque c'était un petit projet à côté, et c'était sympa. Maintenant, c'est six cents. Maintenant, j'ai fait des publicités, et on va dire que je le fais minimum deux mille cinq cents par mois, et en ce moment surtout, je ne fais rien. Et si je prends le mois d'août qui vient de passer, avec vraiment un travail sur ma liste de prospects, j'ai communiqué, j'ai fait une offre pour la prochaine thérapie que je vais sortir, j'ai fait huit ou neuf. Et ça, c'était la première fois. Un truc de fou auquel je n'ai pas cru, c'est la deadline de cette offre : je disais à mon épouse que ça ne marchait pas, que j'avais encore flopé comme plein d'autres fois, et que c'était normal. Et en fait, la veille, vingt-quatre heures avant la fin, ça a commencé à poper un peu, et les dernières heures du dernier jour, là, c'est monté. Ce n'était pas non plus des centaines de ventes, mais à six cents euros, ça va assez vite. Je n'avais jamais vécu ça, ça fait très bizarre.",
      },
      {
        qui: "Cédric",
        texte:
          "Du coup, aujourd'hui, je suis encore plus motivé pour travailler sur ma deuxième thérapie, que je suis en train de tourner. Et l'objectif des dix mille dont on parlait avec Rémy, maintenant, il est pour moi carrément atteignable. Avant, ça paraissait ubuesque de l'imaginer pour moi, pour d'autres oui, mais maintenant je me dis : mais ouais, carrément. Par contre, il faut travailler énormément. Et il ne faut pas avoir peur, si j'ai un conseil à donner : ne pas avoir peur d'investir et de réinvestir de plus en plus, c'est exponentiel. Là, je dépense plus en publicité, je paye quelqu'un. Au début, ça m'aurait paru fou de faire ça, parce que j'aurais eu l'impression d'être à perte. Aujourd'hui, c'est totalement logique. Et là, je cherche un monteur, par exemple, pour ne plus m'occuper des vidéos. Donc je suis dans des étapes qu'on entend beaucoup avec Rémy et dans toutes les vidéos : c'est un cheminement normal.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Excellent, déjà félicitations, parce que ce sont de très beaux chiffres. C'est important de te le rappeler : tu es allé chercher cet objectif-là. Tu as eu le guide, tu as eu tout ce qu'il fallait derrière, mais tu es allé le chercher, donc félicitations pour tout ça.",
      },
      {
        qui: "Cédric",
        texte:
          "Merci. Et c'est le début. Il y a plein d'idées, même de mettre des gens avec moi, des équipes, pour développer d'autres trucs. Qui sait, dans six mois on en reparle, on verra peut-être encore mieux que dix. Mais le but n'est pas essentiellement là : c'est vraiment se créer du temps, et si je peux me retirer encore plus de mon cabinet pour développer d'autres choses. L'objectif, c'est vraiment de toucher plein de gens, ça c'est la première satisfaction. Après, on ne va pas se mentir, augmenter ses revenus, c'est très sympa aussi, mais de base je ne suis pas à plaindre, donc ce n'était pas mon objectif premier. Là, c'est vraiment un super bonus.",
      },
      {
        qui: "Cédric",
        texte:
          "Et sur le programme, franchement, j'ai mis du temps à passer le cap, et ce n'est pas du tout quelque chose que j'ai regretté, à aucun moment, parce que c'est hyper riche en termes de contenu. Les coachings du samedi, c'est top, et il faut y aller, il faut poser des questions. Et c'est hyper motivant de voir certaines personnes. Il y avait Sébastien, en tout cas quelqu'un dans la musique, qui pour moi, à chaque fois qu'il parlait, avait des chiffres de malade. Et c'est hyper motivant, parce que quand on était tout seul à le faire et qu'on en parle à ses potes ou à ses proches, tout le monde nous prend pour un fou. C'est : ah oui, tu es un youtubeur, tu peux faire ton truc, mais il n'y a pas de chiffres qui suivent. Donc il faut tenir, et avec les témoignages des autres personnes, ça booste de fou.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Merci pour ton partage, je suis persuadé que ça va inspirer des personnes. C'est très inspirant, la manière dont tu le racontes : il y a le travail qui joue, forcément, puis le côté où tu as su te remettre en question, reprendre certaines étapes, repartir sur des points que tu avais déjà pensé valider à l'époque. Bravo encore pour ça. Est-ce que tu aurais un dernier mot pour une personne qui regarde cette vidéo et qui hésiterait aujourd'hui à prendre cet appel avec nous ?",
      },
      {
        qui: "Cédric",
        texte:
          "Prendre l'appel, franchement, il faut y aller tout de suite, parce que si on veut le prendre, ou qu'on n'est pas loin de le prendre, c'est qu'on n'est pas loin de basculer. Après, pour parler d'investissement, c'est encore une fois un investissement qui est vraiment utile, mais il faut bosser derrière, il faut vraiment bosser, il faut exploiter le programme. Le programme ne va pas faire les choses à la place du mec ou de la nana qui va le faire. Il faut avoir une idée, peut-être qu'elle va se remettre en question pendant le programme, mais derrière, c'est des heures et des heures de boulot. Honnêtement, avec des heures et des heures de boulot, ne pas avoir de résultats avec le programme, ça m'étonnerait vraiment. Même si à un moment j'ai eu le doute, moi aussi, comme plein de gens, avant de basculer. Je n'ai plus le doute : si on bosse, même si peut-être on va abandonner la première niche ou la première idée, le programme vous permet à un moment donné de retomber sur quelque chose qui peut marcher. Après, que tout le monde réussisse, je n'en sais rien, mais je pense que le plus gros facteur, c'est le boulot, le boulot et la passion. Faire avec passion et ne pas compter ses heures. Et à un moment donné, il y a un retour sur investissement. Moi, je me suis remboursé pas mal de fois actuellement, donc je n'ai pas de souci avec ça.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Merci beaucoup, encore félicitations à nouveau, et quoi qu'il arrive, on se retrouve de l'autre côté.",
      },
      {
        qui: "Cédric",
        texte: "Ça marche, merci à toi, à bientôt.",
      },
    ],
  },
  /* L'intervieweur n'est pas nommé de façon lisible : la reconnaissance vocale
     écrit « Jean-Fré » au premier segment. Les tours lui sont rendus sous
     « Funnels Club ». */
  {
    id: "iy3jgcijgu",
    slug: "corentin",
    titre:
      "Avis Funnels Club : Corentin, 25 ans, 9 000 € par mois avec une offre de conseil à 4 500 €",
    titrePage: "Avis Funnels Club : Corentin, 9 000 € par mois à 25 ans",
    description:
      "Corentin conseille les installateurs de poêles à bois. Il raconte son premier client dès le premier mois, sa phase de stagnation, et ce qui l'en a sorti.",
    afficheAlt:
      "Corentin en entretien vidéo avec Funnels Club, chacun depuis son bureau",
    chapo:
      "Corentin a vingt-cinq ans et six ans d'entrepreneuriat derrière lui, dans le bâtiment. Il raconte comment il a lancé une activité de conseil sans rien avoir de prêt, et pourquoi il tient à replacer ses résultats dans leur contexte.",
    sections: [
      {
        titre:
          "Du bâtiment au conseil : une niche très étroite, choisie exprès",
        paragraphes: [
          "Pendant quatre ans, Corentin a dirigé des sociétés dans le bâtiment, en activité physique. En 2024, il décide de pivoter vers le digital, pour deux raisons qu'il donne sans détour : une conjoncture qui lui plaisait moins, et l'envie de pouvoir se déplacer plus facilement.",
          "Il monte alors une activité de conseil pour accompagner la transformation digitale des entreprises du bâtiment, et ==il la restreint volontairement aux sociétés de poêles à bois et à granulés==. Il ne s'occupe que de ce type d'entreprise, et il n'a rien de prêt au moment de commencer. [Roland Buffet vise le même secteur par un autre bout](/resultats/roland-buffet).",
        ],
        citation: {
          texte:
            "Je m'occupe exclusivement de cette typologie de société.",
          qui: "Corentin",
        },
      },
      {
        titre: "Pourquoi il s'est fait accompagner avant même de lancer",
        paragraphes: [
          "Sa méthode est une habitude, pas une décision de circonstance : chaque fois qu'il a un projet d'entreprise, il cherche la personne qui est au niveau où il veut arriver, et se fait accompagner par elle. Sa raison tient en une phrase : il n'aime pas perdre de temps.",
          "Il y avait, cette fois, une raison plus pressante. Pour se mettre la pression, ==il avait coupé le salaire que lui versait sa société du bâtiment==. Il n'avait donc plus de revenus, et pas les six mois ou l'année qu'il aurait fallu pour tester au hasard. [La formation gratuite est le point d'entrée](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Il y a des personnes qui ont le savoir dont j'ai besoin, donc autant me prendre un raccourci.",
          qui: "Corentin",
        },
      },
      {
        titre: "Ce qu'il a trouvé : de la structure, et surtout peu de choses",
        paragraphes: [
          "Ce qu'il cite en premier est l'inverse de ce qu'on met d'habitude en avant. Il explique que ce type de programme a tendance à entasser de l'information pour justifier son prix, et que ce qu'il a apprécié ici, c'est ==qu'on ne lui parle que de l'essentiel==.",
          "Il ajoute avoir vu la mise à jour du programme aller encore plus loin dans ce sens. Sa remarque est intéressante à côté de celle de [Cédric, qui trouve au contraire qu'il y a trop d'informations](/resultats/cedric) : les deux avis figurent sur ce site, et ils ne disent pas la même chose.",
        ],
        citation: {
          texte:
            "Vous ne parlez pas de tout et de rien pour dire qu'il y a beaucoup de contenu. Vous parlez seulement de l'essentiel, de ce qui est nécessaire.",
          qui: "Corentin",
        },
      },
      {
        titre: "Ses résultats : un premier client dès le premier mois, puis 9 000 € par mois",
        paragraphes: [
          "Il commence en novembre et prend deux ou trois semaines pour construire son programme, parce qu'il voulait le finir avant de vendre. ==En décembre, il signe son premier client, à quatre mille cinq cents euros, le prix de son offre.== Puis neuf mille euros en janvier, neuf mille en février, neuf mille en mars.",
          "Il tient à préciser lui-même ce qui pèse dans ces chiffres, et c'est la partie de son témoignage qu'on ne lui a pas demandée : six ans d'entrepreneuriat derrière lui, et ce n'est pas sa première société. Il note que ce passé manque souvent dans les témoignages qu'on met en avant.",
        ],
        citation: {
          texte:
            "Il est important de noter que ça fait six ans que je suis entrepreneur, que je monte des sociétés. Ce n'est pas ma première société.",
          qui: "Corentin",
        },
      },
      {
        titre: "Sa phase de stagnation, et d'où elle venait",
        paragraphes: [
          "Après mars, la croissance s'arrête. Il en donne la cause sans chercher d'excuse : c'était de sa faute. En cherchant à grandir, ==il a voulu complexifier==, sortir du cadre qu'il suivait, et voir si l'herbe était plus verte ailleurs.",
          "Sa conclusion, au moment de l'entretien en juillet, est qu'il revient à ce qu'il faisait avant, y compris pour viser les paliers bien plus hauts qu'il s'est fixés pour l'année. [François a fait le chemin inverse](/resultats/francois), en simplifiant une offre qui s'était éparpillée.",
        ],
        citation: {
          texte:
            "J'ai voulu sortir un peu de cette trame. Et en fait, on se rend compte que la trame fonctionne quelle que soit l'échelle.",
          qui: "Corentin",
        },
      },
      {
        titre: "La semaine qui a relancé la croissance",
        paragraphes: [
          "Deux semaines avant l'entretien, Corentin écrit à Rémy pour dire qu'il traverse une mauvaise période : il a des clients, mais pas la croissance qu'il veut. Il rejoint le mastermind, et les publicités repartent le vendredi suivant.",
          "Le résultat tient sur sept jours : ==dix appels dans la semaine, alors que dix appels, c'était son mois entier en décembre et en février==, et quinze mille euros conclus. Il insiste sur le fait que les modifications apportées étaient minimes, et qu'ils n'ont rien revu de son business en entier.",
        ],
        citation: {
          texte:
            "Cette croissance, elle est repartie, et pas avec des choses miraculeuses. C'est juste en faisant des choses simples, du bon sens.",
          qui: "Corentin",
        },
      },
      {
        titre: "Son avis pour ceux qui hésitent, et la réserve qu'il y met",
        paragraphes: [
          "Il commence par le plus concret : l'appel ne coûte rien, et il a trouvé la personne en face agréable et là pour aider. Puis il pose ce qu'il considère comme le vrai frein, et il ne parle pas d'argent : selon lui, on a du mal à accepter de se faire prendre par la main.",
          "Il termine par la réserve qu'il répète trois fois, et qui est le contraire d'un argument de vente : rien de tout ça n'est arrivé sans travail. Il travaille six jours sur sept, avec très peu de vacances. Si vous voulez en parler, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [d'autres membres racontent leur propre rythme](/resultats).",
        ],
        citation: {
          texte:
            "En dehors de l'accompagnement, c'est beaucoup, beaucoup de travail, et ça, il ne faut pas l'enlever.",
          qui: "Corentin",
        },
      },
    ],
    transcription: [
      {
        qui: "Funnels Club",
        texte:
          "Salut Corentin, merci d'avoir accepté ce rendez-vous pour parler de ton passage dans Funnels Club, de comment ça s'est passé, de comment tu nous as rencontrés. Le but aujourd'hui, c'est que tu nous expliques ce qui s'est passé dans ton activité, avant de nous rejoindre, puis après nous avoir rejoints, et peut-être d'expliquer comment tu te sens et où tu en es aujourd'hui. Est-ce que tu peux commencer par te présenter, dire qui tu es, ce que tu fais, et dans quelles conditions tu nous as rejoints ?",
      },
      {
        qui: "Corentin",
        texte:
          "Très bien. Moi, j'ai vingt-cinq ans. Ces quatre dernières années, j'avais des sociétés plutôt standards dans le bâtiment, où on faisait du business physique, tout simplement. Depuis l'an dernier, deux mille vingt-quatre, j'ai voulu pivoter un petit peu et me remettre sur du digital, parce que la conjoncture économique me plaisait un peu moins. J'avais également l'envie de pouvoir être un peu plus mobile, de pouvoir me déplacer un peu plus facilement à travers le monde. Ça fait que j'ai voulu faire ma boîte de conseil pour accompagner les entreprises du bâtiment à effectuer leur transformation digitale. Essentiellement les sociétés de poêles à bois et poêles à granulés : je m'occupe exclusivement de cette typologie de société. Et j'ai commencé avec vous en novembre, il me semble. Il y a eu quand même deux, trois semaines de latence, le temps que je crée le programme, même s'il y a des solutions pour pouvoir lancer avant que le programme soit complètement fini. Moi, j'aimais bien que ce soit tout bien ficelé, tout bien terminé, et après on a fait le lancement.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Tu m'avais dit que tu avais commencé cette activité quand tu nous avais rejoints, elle n'était pas encore lancée, si je comprends bien, c'est ça ?",
      },
      {
        qui: "Corentin",
        texte:
          "Oui, tout à fait. J'ai vraiment l'habitude de me faire accompagner dès que j'ai un projet de boîte. Je cherche la personne qui est au niveau où je veux être, et je me fais accompagner par cette personne-là, parce que je n'aime pas perdre du temps. Il y a des personnes qui ont le savoir dont j'ai besoin, donc autant me prendre un raccourci et me faire accompagner.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Donc tu nous as rejoints directement quand tu as voulu lancer ton activité, tu n'avais rien du tout de prêt, ni la formation à créer, ni la stratégie d'accompagnement. Est-ce que tu avais déjà un problème identifié avant de nous rejoindre, ou tu voulais tout de suite démarrer dans les meilleures conditions ?",
      },
      {
        qui: "Corentin",
        texte:
          "Alors sur le papier, je n'avais pas tellement de problèmes. Je voulais juste faire les bonnes actions immédiatement et ne pas perdre de temps. Parce qu'au moment où j'ai arrêté ma société, enfin je ne l'ai pas arrêtée, elle est toujours en opération, je suis toujours dedans, mais je ne suis plus opérationnel à l'intérieur. Pour me mettre un coup de pied aux fesses, j'ai coupé mon salaire de cette société. Donc il n'y avait plus de revenus, et ça fait que je voulais directement avoir les bonnes informations et ne pas perdre de temps à tester des choses pendant six mois, un an, avant de trouver ce qui fonctionnait vraiment. C'est pour ça que je tenais vraiment à me faire accompagner, afin d'accélérer ce processus, d'avoir directement la bonne information, et de ne pas me perdre à essayer quinze mille choses à la fois.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Et qu'est-ce que tu as trouvé dans Funnels Club quand tu es rentré, dans un premier temps ?",
      },
      {
        qui: "Corentin",
        texte:
          "Écoute, c'est essentiellement la structure, et la simplicité. En fait, le problème dans ce type d'accompagnement, c'est qu'en général on veut mettre énormément d'informations pour dire qu'il y a beaucoup de choses, et donc que ça vaut son prix, alors qu'on se rend compte que ce sont les choses les plus simples qui marchent. Et justement, vous ne parlez pas de tout et de rien pour dire qu'il y a beaucoup de contenu : vous parlez seulement de l'essentiel, de ce qui est nécessaire. Et en plus, là, vous avez mis à jour récemment, et vous êtes encore plus allés dans cette direction-là, de parler de l'essentiel. C'est pour ça que je n'ai aucun doute sur le fait que les personnes qui vont revenir avec la mise à jour vont encore mieux réussir, parce que c'est encore plus simplifié. Vous n'allez pas dans dix mille directions, vous avez votre trame qui fonctionne, et vous ne parlez que de cette trame-là. Et aussi le fait qu'il y ait des retours : quand j'ai un problème, que je puisse l'exposer, et à chaque fois tu me faisais des retours personnalisés par rapport à mon problème, ce qui faisait qu'il n'y avait pas de perte de temps inutile.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Dans le programme, il y avait vraiment cette partie formation, donc c'est ce qui t'a permis de suivre la trame, parce que tu as été assez autonome au départ. J'ai trouvé que tu avais bien avancé assez rapidement. Et ensuite, tu as eu ce moment où tu avais les choses en place, et c'est là que les questions sont arrivées un peu plus sur la stratégie globale, sur comment faire monter les choses. Toi, qu'est-ce qui t'a le plus aidé ? Est-ce qu'il y a un palier en particulier dont tu te souviens ?",
      },
      {
        qui: "Corentin",
        texte:
          "Le souci, c'est que quand on lance notre activité, et je pense que c'est dans tout type de société, on est à l'image de ce qu'on pense que les gens veulent, et pas de ce qu'ils veulent vraiment. Et ce qui est bien, c'est quand on a un œil extérieur qui est complètement détaché émotionnellement de ce qu'on est en train de faire. Surtout que vous avez l'expérience dans tout ce qui est entreprise en ligne, vous avez une vraie expertise dans ce sujet-là, et donc un vrai œil extérieur sur ce qui fonctionne plus ou moins. Après, pareil, vous n'avez pas une boule de cristal, vous ne savez pas prédire ce qui va fonctionner, mais vous avez tellement une vision globale du marché que, lorsqu'on vous donne nos éléments, comment on va présenter notre offre, ce qu'on va mettre dedans, vous savez nous dire relativement précisément ce qu'il faudrait plutôt faire, ou plutôt ne pas faire, pour maximiser les chances que ça réussisse le plus rapidement possible. Et je mets bien des guillemets à rapidement, parce qu'il faut prendre des pincettes avec ça.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Exactement, et puis ça demande du travail. Tu peux en témoigner, ce ne sont pas des résultats arrivés tout seuls. En parlant de résultats, est-ce que tu veux partager aujourd'hui ceux que tu as pu atteindre en rentrant dans Funnels Club ?",
      },
      {
        qui: "Corentin",
        texte:
          "Alors, j'ai commencé en novembre. Pour les personnes qui écoutent, il est également important de noter que ça fait six ans que je suis entrepreneur, que je monte des sociétés. Ce n'est pas ma première société, donc il peut y avoir ce vecteur-là qui rentre en considération. C'est souvent le cas dans les témoignages qui sont mis en avant : on voit des réussites qui sont parfois exponentielles, mais parfois il y a aussi tout le côté du passé qui rentre en considération. Donc là, en décembre, je fais quatre mille cinq cents euros de chiffre d'affaires, parce que mon offre était à quatre mille cinq cents euros : j'ai fait mon premier client dès le premier mois, en décembre, ce qui était fantastique. Après, neuf mille euros en janvier, neuf mille euros en février, neuf mille euros en mars.",
      },
      {
        qui: "Corentin",
        texte:
          "Et après, j'ai juste une petite phase de stagnation, qui était de ma faute, parce que je cherchais de la croissance. Justement, dans cette idée de garder les choses simples, j'ai voulu complexifier, j'ai voulu sortir un petit peu de cette trame que vous avez créée, et aller voir si l'herbe était plus verte ailleurs. Et en fait, on se rend compte que la trame fonctionne quelle que soit l'échelle, et que le plus important, c'est de garder les choses simples comme vous les présentez. C'est ce qui fonctionne le mieux, en fin de compte. Et je m'en rends compte encore plus aujourd'hui, on est en juillet, sept, huit mois après, où j'ai essayé de faire d'autres choses un peu plus farfelues : je reviens un peu à la maison, en me disant qu'il faut suivre ce qu'ils disent, et qu'ils ont raison. Même pour développer à cinquante, soixante mille, cent mille euros par mois, parce que c'est l'objectif de l'année, il faut garder ces bases-là. Elles sont bonnes pour des échelles qui sont quand même sympas.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Il y a même pas une semaine, deux semaines, il y a eu un événement. Est-ce que tu veux le partager aussi ?",
      },
      {
        qui: "Corentin",
        texte:
          "Il y a deux semaines, j'ai décidé d'envoyer un message à Rémy, qui m'a gentiment répondu, en lui disant que je passais vraiment une sale période, parce que sur les deux derniers mois j'avais eu des clients, mais ce n'était pas la croissance que je voulais. Je lui demandais s'il pouvait me donner un petit coup de main. Et donc j'ai rejoint le mastermind de Rémy vendredi dernier, ça fait une semaine pile. On a relancé les publicités dès vendredi dernier, et là, j'ai eu dix appels durant cette semaine-là. Ce qu'il faut savoir, c'est qu'avant, dix appels, c'est ce que j'avais dans le mois, en décembre et en février. Et là, je les ai eus en une semaine, avec des coûts exceptionnels. Ça fait que cette semaine, j'ai déjà closé quinze mille euros. La croissance est repartie, et ça, c'est vraiment chouette. Et toujours pareil : cette croissance, elle est repartie, et pas avec des choses miraculeuses. C'est juste en faisant des choses simples, du bon sens, en faisant en sorte d'apporter un maximum de valeur à sa cible, et en leur parlant de la bonne manière.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'était le fait de se recentrer, surtout. Tu t'es éparpillé un petit peu, tu as testé plein de choses, puis au final, en revenant à ce qui fonctionnait, tu as juste fait plus de ce qui fonctionne. Félicitations, et merci pour ce partage, parce que c'est inspirant de voir aussi que tu avais déjà beaucoup travaillé avant. Est-ce que tu aurais un mot pour une personne qui regarde cette interview et qui hésite à prendre l'appel avec nous ?",
      },
      {
        qui: "Corentin",
        texte:
          "Alors, déjà, le premier point sur l'appel : ce qui est bien, c'est que c'est gratuit, donc il ne faut pas hésiter. L'appel en plus se passe très bien, moi en l'occurrence c'était avec Mathis. Ce sont des personnes très gentilles, très agréables, et qui sont là juste pour nous aider dans notre projet. Ça, déjà, c'est le premier point sur lequel il ne faut pas hésiter. Et le second point : en France, on a parfois beaucoup de mal avec le fait de se faire accompagner, parce qu'on est un peuple qui a énormément d'ego, et on a beaucoup de mal à se faire prendre par la main et à dire qu'au final, peut-être qu'on ne sait pas faire tout seul. Et parfois aussi, on peut se dire, et je l'ai aussi dans mon propre programme : oui, mais ce n'est que de l'accompagnement, ce ne sont que des vidéos.",
      },
      {
        qui: "Corentin",
        texte:
          "Mais il faut avoir conscience que juste une information, juste le fait qu'on nous donne un conseil, ça peut nous faire gagner tellement d'argent, tellement plus que l'investissement qu'il y a. Il faut plutôt regarder ça : c'est l'expérience qu'on achète, c'est les cinq, six années qu'il y a derrière eux. Et c'est parfois ces petites informations, ces petits détails, qui font toute la différence, et j'en suis la preuve concrète. Vendredi dernier, Rémy m'a fait faire deux, trois modifications, ce n'étaient pas des choses monstrueuses, on n'a pas revu tout le business en entier. Ce sont juste des micro-modifications, et l'investissement est déjà rentabilisé en une semaine. C'est pour ça qu'il n'y a pas tellement d'hésitation à avoir, même si parfois, psychologiquement, ça peut être compliqué. Et bien évidemment, en dehors de l'accompagnement, c'est beaucoup, beaucoup de travail, et ça, il ne faut pas l'enlever. Comme je l'ai dit, j'ai de l'expérience derrière, ça ne s'est pas fait en un mois, et je travaille six jours sur sept, quasiment tous les jours, il y a très peu de vacances. Donc c'est beaucoup de travail pour arriver à ça.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Exactement, et c'est vraiment important de le rappeler : rien n'arrive sans rien faire, ce n'est pas un bouton magique. En tout cas, merci beaucoup Corentin, encore une fois félicitations pour les résultats, et à bientôt de voir la suite, puisque l'aventure continue de l'autre côté avec le mastermind.",
      },
      {
        qui: "Corentin",
        texte: "Top, super, merci beaucoup. À bientôt.",
      },
    ],
  },
  /* L'intervieweur est Geoffrey : Mathieu le nomme au tout dernier segment.

     **Le prénom est corrigé** : `site.ts` portait « Matthieu », relevé sur une
     étiquette Wistia ; il se présente lui-même comme Mathieu Tison.

     **Sa spécialité est nommée et rien de plus.** Mathieu est sexologue et
     détaille en entretien les motifs de consultation de ses clients. L'article
     dit son métier, parce que c'est le sujet de la page, et s'arrête là : ni
     description, ni promesse, ni détail clinique. */
  {
    id: "abj3v8v8ek",
    slug: "matthieu",
    titre:
      "Avis Funnels Club : Mathieu Tison, sexologue, a doublé son chiffre d'affaires en un mois et demi",
    titrePage: "Avis Funnels Club : Mathieu Tison, chiffre doublé",
    description:
      "Mathieu Tison vend des formations en ligne depuis 2020. Il raconte le plafond de verre qui a duré un an et demi, et les deux pistes qui l'en ont sorti.",
    afficheAlt:
      "Mathieu Tison en entretien vidéo avec Geoffrey, de Funnels Club, chacun depuis son bureau",
    chapo:
      "Mathieu Tison a quarante-sept ans, il est sexologue et vend des formations en ligne depuis le confinement de 2020. Il raconte un an et demi de blocage, et ce qu'il a fallu de travail pour en sortir en six semaines.",
    sections: [
      {
        titre: "Une activité en ligne née du confinement, devenue la principale",
        paragraphes: [
          "Mathieu est sexologue. En 2020, confiné comme tout le monde et empêché de travailler, il crée un site pour continuer à transmettre ce qu'il sait. Il s'est pris au jeu, et ==son activité en ligne est devenue son activité principale==, à côté de ses consultations, qu'il n'a pas arrêtées.",
          "Il vend des formations en ligne à des personnes qui rencontrent des difficultés d'ordre sexuel. Au moment de l'entretien, il fait ça depuis quatre ans, avec de la publicité sur Google pour amener ses clients. [Cédric, psychologue, a suivi un chemin très proche](/resultats/cedric).",
        ],
        citation: {
          texte:
            "J'ai créé un site pour continuer à diffuser mon savoir pendant le confinement, et je me suis piqué au jeu.",
          qui: "Mathieu",
        },
      },
      {
        titre: "Un plafond de verre qui a duré un an et demi",
        paragraphes: [
          "Son lancement s'était bien passé, il le dit lui-même : le concept a plu, ça a démarré vite. Puis, au bout de quatre ans, il bloque. ==Il tourne entre dix et vingt mille euros de chiffre d'affaires par mois==, impossible de dépasser, et ça dure un an et demi.",
          "Il apporte une précision que peu de gens donnent, et elle change la lecture du chiffre : il tourne beaucoup avec la publicité, qui coûte très cher, donc le bénéfice n'a rien à voir avec le chiffre affiché. Ça lui permet de vivre, mais il travaille énormément.",
        ],
        citation: {
          texte:
            "J'avais envie de passer à la vitesse supérieure, et impossible de développer mon chiffre d'affaires depuis un an, un an et demi. J'étais bloqué.",
          qui: "Mathieu",
        },
      },
      {
        titre: "Un an et demi à chercher, sans mettre le doigt dessus",
        paragraphes: [
          "Quand on lui demande ce qui le bloquait, sa réponse est nette : il ne savait pas, et c'est précisément ce qu'il cherchait. Il a essayé beaucoup de choses, TikTok, Facebook, Instagram, et il résume ça d'une formule : ==il est parti dans tous les sens==.",
          "Il a même refondu entièrement son marketing, ce qui, comme il le rappelle à ceux qui savent, prend des mois. Le mot qu'il emploie pour décrire son état d'esprit à ce moment-là est celui qu'on lit rarement dans un témoignage client. C'est le même mur que décrit [François après un an de plafond](/resultats/francois).",
        ],
        citation: {
          texte:
            "J'étais vraiment un peu désespéré, je dois le dire, parce que ça faisait un an et demi que je cherchais.",
          qui: "Mathieu",
        },
      },
      {
        titre: "Ce qui l'a décidé : le témoignage de quelqu'un dans son cas",
        paragraphes: [
          "Mathieu suivait Rémy depuis longtemps, comme beaucoup d'entrepreneurs francophones abonnés à ce genre de chaîne. Ce n'est pas ça qui l'a fait bouger.",
          "Ce qui a fait tilt, c'est ==une vidéo de témoignage d'un membre qui était exactement dans son cas== et qui expliquait avoir débloqué sa situation. Il le dit en tournant lui-même le sien. C'est exactement ce que cette page fait, et [les autres avis sont ici](/resultats).",
        ],
        citation: {
          texte:
            "C'est une vidéo de témoignage d'un gars qui était exactement dans le même cas que moi, et qui disait qu'il avait réussi à débloquer la situation.",
          qui: "Mathieu",
        },
      },
      {
        titre: "Deux pistes, et le conseil de ne pas prendre la première",
        paragraphes: [
          "Il s'est mis au travail immédiatement, et son rythme dit quelque chose de son état d'esprit : lever à cinq heures et demie, vidéos jusqu'à dix heures du soir. Deux pistes sont apparues très clairement, et il a commencé à travailler la première.",
          "C'est là qu'on lui a conseillé de prendre plutôt la seconde. Il a suivi, ==et c'est celle-là qui a marché==. Il emploie un mot pour décrire ce moment : la libération. Le même genre de correction a fait basculer [Jérémy, qui visait les enfants et a pivoté vers les adultes](/resultats/jeremy).",
        ],
        citation: {
          texte:
            "Je t'ai fait confiance tout de suite, j'ai dit : ok, je prends la seconde. Et puis là, bingo. C'était la libération.",
          qui: "Mathieu",
        },
      },
      {
        titre: "Ses résultats : chiffre d'affaires doublé six semaines après",
        paragraphes: [
          "Il a refait son marketing en un mois et demi, en cravachant. Puis vient le mois d'août, celui où les gens sont en vacances : ==en quinze jours, il fait son chiffre d'affaires mensuel habituel.==",
          "Autrement dit, il a doublé son chiffre un mois et demi après avoir pris la formation. Et il ajoute un autre repère, plus court encore : il l'a amortie en une semaine. Il conclut sur ce point-là, en disant que tout est dit.",
        ],
        citation: {
          texte:
            "En quinze jours, j'ai fait mon chiffre d'affaires mensuel. J'ai doublé mon chiffre d'affaires un mois et demi après avoir pris la formation.",
          qui: "Mathieu",
        },
      },
      {
        titre: "Ce qu'il dit trouver de plus rare, et son avis pour ceux qui hésitent",
        paragraphes: [
          "Sa remarque finale est celle d'un entrepreneur qui a déjà beaucoup lu. Selon lui, sur le marketing et la fabrication de produits, les ressources abondent ; sur la stratégie d'entreprise, ==il y en a beaucoup moins==, et c'est logique, parce que c'est propre à chaque activité.",
          "Il pose aussi la condition qui a fait tout le reste, et elle n'a rien de séduisant : c'est facile, mais c'est long, et il a cravaché. Si vous voulez en parler de vive voix, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [la formation gratuite montre les grands axes](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "C'est facile, c'est très facile. Par contre, c'est long. J'ai cravaché pour faire ça le plus rapidement possible.",
          qui: "Mathieu",
        },
      },
    ],
    transcription: [
      {
        qui: "Geoffrey",
        texte:
          "Bonjour Mathieu, déjà merci d'avoir accepté cette interview, pour partager un petit peu ce que tu fais aujourd'hui, ton trajet au sein de Funnels Club, et ce que tu as pu réaliser. Le but, c'est de pouvoir inspirer d'autres personnes qui regarderaient cette vidéo. Pour commencer, est-ce que tu pourrais nous parler de toi, nous dire ce que tu fais, et dans quelles conditions tu nous as rejoints ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Je m'appelle Mathieu Tison, je suis sexologue, j'ai quarante-sept ans. J'ai un business en ligne depuis deux mille vingt, parce que j'ai été confiné comme tout le monde en deux mille vingt, je ne pouvais plus travailler, donc j'ai créé un site pour continuer à diffuser mon savoir, à travailler pendant le confinement, et je me suis piqué au jeu. C'est maintenant devenu mon activité principale : je continue à faire des consultations, mais mon activité en ligne est devenue vraiment mon activité principale. Je vends des formations en ligne pour les gens qui ont des difficultés sexuelles, tout simplement. Je fais ça depuis quatre ans maintenant, en ligne, en plus de mon activité au cabinet.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Et dans quelles conditions étais-tu avant de nous rejoindre ? Est-ce que tu avais déjà une activité qui fonctionnait bien, ou au contraire avait-elle des difficultés à se lancer ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Non, j'avais une activité qui me permettait d'arrêter les consultations et de vivre de mon activité en ligne. Je n'ai pas eu vraiment de difficulté à la lancer. Je pense que le concept a plutôt plu, et ça a démarré assez vite. Je faisais de la publicité sur Google, et j'avais mes clients comme ça. Par contre, je suis arrivé à un plafond de verre au bout de quatre ans. Ça faisait un peu plus d'un an où je tournais à un chiffre d'affaires entre dix et vingt mille par mois, et impossible de le dépasser. J'ai tout écumé, j'ai acheté des bouquins sur la stratégie d'entreprise, parce que ce n'est pas mon métier à la base. Je me suis dit : il y a quelque chose que je ne fais pas, ou que je fais mal, je n'arrive plus à développer mon chiffre d'affaires.",
      },
      {
        qui: "Mathieu",
        texte:
          "J'avais quand même une activité qui était sympa, mais je travaille énormément, ça me demande beaucoup de travail, et j'avais envie de passer au palier supérieur, pour profiter un peu plus, avoir un peu plus de temps, et gagner un petit peu plus d'argent. Parce que vingt mille de chiffre d'affaires, ce n'est pas vingt mille de bénéfice : moi qui tourne beaucoup avec la publicité, ça coûte très, très cher. Donc le bénéfice me permet de vivre, mais j'avais envie de passer à la vitesse supérieure, et impossible de développer mon entreprise, de développer le chiffre d'affaires, depuis un an, un an et demi. J'étais bloqué.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Est-ce que tu avais mis le doigt sur ce qui te bloquait à ce moment-là ? Quel était ton obstacle principal ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Clairement non, c'était vraiment ce que je cherchais. J'ai essayé des tas de trucs, je me suis dit : il faut que je me mette sur TikTok, il faut que je me mette sur Facebook, il faut que je me mette sur Instagram. Je suis parti dans tous les sens. J'ai beaucoup travaillé pour pas grand-chose, en fait, parce que ça ne marchait pas. Je me suis dit que c'était le marketing qui n'allait pas, alors j'ai refondu le marketing, et les entrepreneurs me comprendront : refaire tout un processus marketing, c'est long, des processus de vente dans tous les sens. J'ai vraiment essayé, et j'étais vraiment un peu désespéré, je dois le dire, parce que ça faisait un an et demi que je cherchais et que je n'arrivais pas à développer mon activité. Ras-le-bol, quoi. Je me suis dit : ce n'est pas possible, il y a quelque chose que je ne comprends pas, il y a quelque chose que je ne fais pas. J'étais vraiment dans cet état d'esprit-là, jusqu'à il n'y a pas très longtemps.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Et donc on a eu un entretien téléphonique avec l'équipe. Qu'est-ce qui t'a fait aller vers nous à ce moment-là, plutôt que vers quelqu'un d'autre ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Je connaissais Rémy depuis longtemps, parce qu'en tant qu'entrepreneur, je suis abonné à des chaînes qui parlent plus ou moins du sujet, et Rémy est quand même, pas le plus gros, mais quand même un incontournable sur la francophonie, avec quelques autres. Et en fait, il y a une vidéo qui m'a fait tilt : c'est la vidéo que je suis en train de tourner en ce moment. C'était une vidéo de témoignage d'un gars qui était exactement dans le même cas que moi, et qui disait qu'il avait réussi à débloquer la situation. J'ai fait : ah bon, ok. J'allais un peu voir, et donc j'ai réservé un appel. Ça m'a convaincu. J'ai dit : voilà mon histoire, voilà mon truc. Et la personne que j'ai eue en face, Kylian, m'a dit : non, non, c'est ce qu'on fait, on aide les gens qui ont un business qui tourne déjà à passer vraiment à la vitesse supérieure.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Et une fois que tu es rentré, qu'est-ce que tu as trouvé dans Funnels Club ? Qu'est-ce qui t'a le plus aidé à casser ce plafond de verre que tu avais depuis un an, un an et demi ?",
      },
      {
        qui: "Mathieu",
        texte:
          "C'est très simple. Je me suis mis au boulot tout de suite quand j'ai pris la formation. Je me souviens, je regardais les vidéos, je me levais à cinq heures et demie du matin, je les regardais jusqu'à dix heures du soir, en me disant : il faut que j'avance, il faut que j'avance, où est la solution ? Et effectivement, il y a deux pistes qui sont apparues très clairement, et où j'ai fait : ah bon sang, mais c'est bien sûr, je n'y ai pas pensé avant. J'ai commencé à prendre la première piste, à travailler dedans, et tu m'as dit : non, essaye plutôt la seconde, à mon avis. Parce que ça se voit que vous avez de l'expérience, je t'ai fait confiance tout de suite, j'ai dit : ok, je prends la seconde. Et puis là, bingo. C'était la libération.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Ton parcours est super intéressant, et ce que je trouvais très inspirant dedans, c'est le côté travail. Tu as fourni des efforts, il faut le dire, tu as bien travaillé, assez rapidement, avec pas mal d'heures et pas mal de concentration dessus. Est-ce qu'il y avait d'autres choses qui, pour toi, t'ont permis d'aller rapidement vers ton objectif ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Après, c'est vrai que j'avais déjà pas mal de produits, ça faisait quatre ans que je les construisais, j'avais l'habitude de faire un peu de marketing. Le syndrome de l'imposteur, bien connu des infopreneurs, je l'avais dépassé depuis belle lurette, donc je pense que c'est peut-être aussi ça qui m'a aidé. Puis, dans la formation, ce qui m'a aidé à aller rapidement, c'est que Rémy présente très bien les choses. Il nous fait comprendre l'aspect marketing de l'infoprenariat, les grands axes qu'il y a pour se développer. C'est clair. Ensuite, pour reconstruire le marketing qu'il fallait, parce qu'il fallait quand même changer le marketing, les vidéos sont très bien faites, il y a des fiches qui nous disent point par point ce qu'il faut faire. C'est bête et méchant, il suffit de le faire. C'est facile, c'est très facile. Par contre, c'est long. J'ai cravaché pour faire ça le plus rapidement possible, et en un mois et demi, c'était bouclé. Facilité parce que toutes les étapes sont là, et puis tu es là quand on a une question : c'est toi qui as pu me dire, en vingt-quatre heures, que c'était plutôt dans cette direction-là qu'il fallait aller. L'accompagnement et la façon de présenter la formation font que, pour quelqu'un qui est très motivé et qui cravache à mort, tu peux avoir de très bons résultats rapidement.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Félicitations, parce que je trouve que le travail que tu as fourni était super intéressant. Tu avais déjà un bagage, tu as su te remettre en question aussi, puisque tu as laissé de côté certaines choses que tu faisais. C'est ce que tu disais : je me suis éparpillé dans pas mal de choses, et au final, ce qui s'est passé, c'est qu'on a recentré sur un point bien particulier, ce qui t'a permis de casser ce plafond. Est-ce que tu peux dire à peu près où tu en es aujourd'hui ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Disons qu'au mois d'août, alors que c'est un petit mois, que les gens sont en vacances, c'est tout simple : en quinze jours, j'ai fait mon chiffre d'affaires mensuel. J'ai doublé mon chiffre d'affaires un mois et demi après avoir pris la formation. Je pense que tout est dit.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Génial, félicitations. Est-ce que tu aurais un mot à partager à quelqu'un qui, aujourd'hui, comme toi, hésite à prendre cet appel avec l'équipe pour discuter ne serait-ce que de son projet ?",
      },
      {
        qui: "Mathieu",
        texte:
          "Moi, j'ai amorti la formation en une semaine, donc je ne vois pas comment être plus persuasif. L'accompagnement est top : dès qu'on a une question, ça répond en vingt-quatre heures. Les vidéos sont claires, et puis tout est abordé, que ce soit l'acquisition de trafic, l'aspect marketing ou l'aspect stratégie d'entreprise. Sur ce dernier point, je trouve que c'est ce qu'il y a de plus rare : autant sur le marketing et sur la fabrication de produits il y a pas mal de ressources, autant sur la stratégie d'entreprise il y en a beaucoup, beaucoup moins. Et c'est normal, en fait, parce que c'est vraiment spécifique à chaque activité, à chaque entreprise. Vous avez été au rendez-vous, donc pour ceux qui cherchent de la stratégie d'entreprise, je trouve que vous avez été très sérieux, et la preuve, ça a marché.",
      },
      {
        qui: "Geoffrey",
        texte:
          "Merci pour ton témoignage. Je suis sûr que ça va inspirer plein de personnes qui pourront s'identifier à toi, à ton parcours, à là où tu as démarré et à là où tu en es aujourd'hui. Et encore une fois, félicitations pour tes chiffres.",
      },
      {
        qui: "Mathieu",
        texte:
          "De rien, c'est grâce à vous, et on va encore continuer pour que ça se développe encore. C'est que le début.",
      },
      {
        qui: "Geoffrey",
        texte:
          "En effet, c'est que le début. Je te souhaite une très bonne journée, à bientôt.",
      },
    ],
  },
  /* C'est Rémy qui mène cet entretien : Valérie le tutoie tout du long, parle
     de « tes closers » et raconte l'avoir écouté une heure et demie avant de
     réserver. */
  {
    id: "4lkp9f6lm4",
    slug: "valerie",
    titre:
      "Avis Funnels Club : Valérie, 56 ans, de zéro à quinze clients par mois en formant des étudiants infirmiers",
    titrePage: "Avis Funnels Club : Valérie, 15 clients en un mois",
    description:
      "Valérie a été formatrice en soins infirmiers pendant 25 ans. Elle raconte l'année qu'elle s'est donnée avant de lancer, et sa première vente en trois jours.",
    afficheAlt:
      "Valérie en entretien vidéo avec Rémy Jupille, chacun depuis son bureau",
    chapo:
      "Valérie a cinquante-six ans, elle est infirmière de formation et a formé de futurs infirmiers pendant vingt-cinq ans. Elle raconte pourquoi elle s'est donnée presque un an avant de lancer quoi que ce soit, et ce qui s'est passé ensuite.",
    sections: [
      {
        titre: "Vingt-cinq ans de formation en soins infirmiers, et une question",
        paragraphes: [
          "Valérie est infirmière de base et formatrice depuis 1998. Elle a exercé environ vingt-cinq ans comme formatrice et cadre de santé auprès d'étudiants en soins infirmiers.",
          "En 2018, elle sent que ses missions changent, notamment sur l'accompagnement des étudiants, et elle se pose une question simple : est-ce qu'elle continue comme ça pendant dix ans de plus ? ==La réponse est non==, clairement. Elle quitte son travail et s'assoit sur son canapé pour réfléchir à une reconversion qui n'abandonnerait pas ses étudiants.",
        ],
        citation: {
          texte:
            "Je me suis posé la question de savoir si j'allais continuer comme ça pendant dix ans encore. La réponse était non, clairement.",
          qui: "Valérie",
        },
      },
      {
        titre: "Elle ne regarde jamais ce genre de contenu, et elle a cliqué",
        paragraphes: [
          "Le détail qu'elle donne sur sa découverte vaut d'être noté : l'entrepreneuriat n'est pas du tout son univers, et elle ne regarde jamais ce type de vidéo. Une publicité passe dans son fil, elle clique, écoute une heure et demie, et sa décision est prise à la fin.",
          "Elle le dit sans détour : elle est partie de zéro, sans aucune notion de marketing ni de tunnel de vente, après vingt-cinq ans de salariat dans un tout autre domaine. [Le webinaire qu'elle a regardé est en accès libre](https://www.funnels.club/course-2025?el=site).",
        ],
        citation: {
          texte:
            "Je ne regarde jamais tout ce qui est entrepreneuriat, ce n'est pas du tout mon truc. Tu es apparu dans mon fil d'actualité, et j'ai senti que je devais cliquer dessus.",
          qui: "Valérie",
        },
      },
      {
        titre: "Son offre : des étudiants qui n'ont pas d'argent, et un marché saturé",
        paragraphes: [
          "Valérie s'adresse à deux publics : les étudiants infirmiers en difficulté dans leur formation, et les candidats qui cherchent à entrer dans le métier. Elle donne le chiffre qui décrit ce second marché : ==sept cent mille demandes pour trente-huit mille places.==",
          "Elle a monté un organisme de formation, un espace de cours et un accompagnement quotidien. [Jérémy vise lui aussi un public en formation](/resultats/jeremy), avec ses cours d'anglais. Le point délicat est le prix : sa cible n'a pas beaucoup d'argent. Elle a donc travaillé une offre haut de gamme payable en cinq fois, doublée d'un abonnement de soutien scolaire à quarante-sept euros, que beaucoup prennent.",
        ],
        citation: {
          texte:
            "Il fallait que je passe sur un tarif qui puisse correspondre à des étudiants, qui n'ont pas forcément de l'argent.",
          qui: "Valérie",
        },
      },
      {
        titre: "Presque un an avant de lancer, et pourquoi elle l'assume",
        paragraphes: [
          "C'est le point qui distingue son parcours de la plupart des autres sur cette page. Elle s'est donné presque un an de travail avant de se montrer. Les cours, eux, ont été montés facilement : c'est son métier depuis vingt-cinq ans.",
          "Ce qui a pris le temps, c'est tout le reste, qu'elle ne connaissait pas : les tunnels de vente, le fonctionnement de l'outil, la construction d'un webinaire. Elle voulait que ses étudiants arrivent sur un espace de formation qui tienne la route, ==parce que c'est la première chose qu'ils demandent==. Elle précise que c'était son choix, et que d'autres démarrent en trois mois. [Charlotte, elle, a lancé avant d'avoir fini](/resultats/charlotte).",
        ],
        citation: {
          texte:
            "Il me fallait du temps avant de pouvoir me lancer, pour avoir un minimum de crédibilité.",
          qui: "Valérie",
        },
      },
      {
        titre: "Ses résultats : première cliente en trois jours, puis cinq par mois",
        paragraphes: [
          "Elle se met sur les réseaux sociaux le vingt-huit août. ==Le trente et un août, elle a sa première cliente, à mille trois cents euros.== Trois jours.",
          "Puis trois clients en septembre, cinq en octobre, cinq en novembre, un mois de décembre plus calme avant Noël. Et au moment de l'entretien, le six janvier, elle en est déjà à quinze clients pour le mois en cours. Elle refuse de parler d'explosion, mais note qu'elle a presque triplé son nombre de clients.",
        ],
        citation: {
          texte:
            "Je me suis mise sur les réseaux sociaux le vingt-huit août, et le trente et un août, j'avais déjà ma première cliente.",
          qui: "Valérie",
        },
      },
      {
        titre: "Ce qui l'a le plus aidée quand elle ne connaissait rien",
        paragraphes: [
          "Elle cite les rendez-vous du samedi matin, pour les réponses immédiates quand elle bloquait, et la méthode elle-même : on applique, on soumet, on corrige le lendemain si ce n'est pas bon, et on passe à l'étape suivante une fois validé.",
          "Elle mentionne aussi l'assistance technique, qui a une fois pris la main sur son ordinateur quand elle était bloquée. Venant de quelqu'un qui n'avait jamais fait ça, ce détail compte plus qu'une stratégie. [Sandrine décrit le même filet](/resultats/sandrine) quand elle a dû s'arrêter six mois.",
        ],
        citation: {
          texte:
            "On applique, et si ce n'est pas bon, on retravaille le lendemain. Une fois que c'est validé, on peut avancer sur l'étape suivante.",
          qui: "Valérie",
        },
      },
      {
        titre: "Son avis : rester enseignable",
        paragraphes: [
          "Sa réponse à ceux qui hésitent commence par la transparence : elle apprécie qu'on lui dise quand quelque chose n'est pas bon. Mais l'essentiel de son conseil porte sur une condition, et elle la formule mieux que personne.",
          "Elle explique qu'elle venait d'un autre domaine, donc elle prenait tout et appliquait, sans discuter. Elle suppose que quelqu'un qui croit déjà savoir aura tendance à répondre « oui mais non », et que ça ne marche pas. Si vous voulez en parler, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [les autres membres racontent leurs propres débuts](/resultats).",
        ],
        citation: {
          texte:
            "Il n'y a pas de oui mais non. Je pense qu'il faut vraiment rester coachable et enseignable, et franchement, ça paye.",
          qui: "Valérie",
        },
      },
    ],
    transcription: [
      {
        qui: "Rémy",
        texte:
          "Valérie, merci beaucoup d'avoir accepté mon invitation. Je suis super content de pouvoir t'interviewer et te demander comment ça se passe dans ton business, et que tu puisses partager ton retour d'expérience et inspirer éventuellement d'autres femmes, ou même des hommes, qui pourraient regarder cette vidéo. Je sais qu'il y a souvent peu de femmes dans le business qui peuvent partager ce qu'elles font, et on a eu beaucoup de demandes de femmes qui souhaitaient voir des femmes réussir. Est-ce que tu peux te présenter rapidement, dire ce que tu fais ?",
      },
      {
        qui: "Valérie",
        texte:
          "Mon prénom, c'est Valérie, j'ai cinquante-six ans, donc j'ai un âge quand même un petit peu important dans le monde de l'entrepreneuriat. Je suis infirmière de base, formatrice depuis mille neuf cent quatre-vingt-dix-huit, formatrice en soins infirmiers : je forme des futurs infirmiers. J'ai exercé pendant à peu près vingt-cinq ans ce métier de formatrice, cadre de santé, auprès des étudiants. En deux mille dix-huit, j'ai senti que mes missions étaient en train de bien changer par rapport à l'accompagnement des étudiants, et je me suis posé la question de savoir si j'allais continuer comme ça pendant dix ans encore. La réponse était non, clairement. Donc j'ai quitté mon travail, et je me suis posée sur mon canapé pour réfléchir à comment je pouvais me reconvertir, mais sans abandonner ces étudiants.",
      },
      {
        qui: "Valérie",
        texte:
          "Et puis, dans mon fil d'actualité, alors que je ne regarde jamais tout ce qui est entrepreneuriat, ce n'est pas du tout mon truc, tu es apparu. J'ai cliqué dessus, j'ai senti que je devais cliquer dessus, je t'ai écouté pendant une heure et demie, et ma décision était prise à la suite de cette visio. J'ai pris rendez-vous avec un de tes closers, et je suis rentrée dans ton programme de façon à pouvoir vraiment booster ma reconversion professionnelle, en sachant que je partais de zéro, puisque je n'avais aucune notion de marketing, de tunnel, et cetera, ayant été salariée dans un tout autre domaine pendant vingt-cinq ans.",
      },
      {
        qui: "Rémy",
        texte:
          "Quel a été pour toi le plus gros problème que tu avais ? Est-ce que tu avais essayé un petit peu toute seule de ton côté, est-ce qu'il y avait des choses qui n'avaient pas fonctionné, ou directement on a travaillé ensemble ?",
      },
      {
        qui: "Valérie",
        texte:
          "J'ai marché à la confiance en te voyant. J'étais convaincue par ton discours, j'étais convaincue aussi que tu étais une autorité dans ton domaine. Moi, je partais de rien, je ne savais même pas où j'allais : avec toi, c'était un mode « j'ai confiance et je me laisse embarquer dans l'histoire », en sachant par contre que ça allait réussir. Peut-être pas comme une fusée, mais ça allait réussir, parce que tes méthodes, tes stratégies, elles sont concrètes. On a des cas concrets, tu réponds aux questions, on met en place, ce n'est pas bon, on revient. Donc à un moment donné, ça ne peut que marcher, si on se met au travail. Ça a vraiment été un coup de cœur par rapport à cet accompagnement, et je me suis laissé embarquer en toute confiance. Et du coup, ça fonctionne bien aujourd'hui, j'en ai l'impression.",
      },
      {
        qui: "Rémy",
        texte:
          "Est-ce que tu peux partager quelques informations sur tes résultats ? Par exemple, ton premier client. Tu peux d'ailleurs donner quelques détails sur ton offre aussi, à qui ça s'adresse, en quoi ça consiste. Je me souviens que tu nous avais partagé petit à petit : première vente, ensuite tu avais fait un autre post, deuxième vente, ensuite tes vingt premiers clients. Est-ce que tu peux raconter ces différentes étapes ?",
      },
      {
        qui: "Valérie",
        texte:
          "D'accord. Mon offre, lorsque je t'ai rejoint, ma niche, c'étaient des étudiants infirmiers qui étaient en difficulté par rapport à leur formation. En parallèle, il y avait aussi tous ces candidats qui veulent rentrer en tant qu'infirmier et qui doivent passer soit par Parcoursup, soit par un concours. Comme il y a sept cent mille demandes et qu'il n'y a que trente-huit mille places, forcément, c'est très tendu. Je voulais monter un organisme de formation et être vraiment visible sur les réseaux sociaux, de façon à me faire connaître le plus rapidement possible, et démarrer cette aide au quotidien, et faire surtout du soutien scolaire pour des étudiants qui sont à l'heure actuelle en difficulté.",
      },
      {
        qui: "Valérie",
        texte:
          "Quand j'ai intégré ton programme, je me suis quand même laissé presque un an de travail, ne serait-ce qu'au niveau des tunnels, et puis ensuite pour monter mon espace de formation, parce qu'il est aussi sur ClickFunnels, dans le tunnel de vente. Et derrière ça, j'ai décidé de me lancer sur les réseaux sociaux. Ça s'est fait en septembre deux mille vingt-trois, et là on est en janvier deux mille vingt-quatre, donc c'est tout récent. Je me suis mise sur les réseaux sociaux le vingt-huit août, et le trente et un août, j'avais déjà ma première cliente, pour un high ticket à mille trois cents euros. Donc c'était waouh, ça a marché direct. Mais là aussi, avec elle, ça a marché comme avec toi et moi : ça a été la confiance. Je savais de quoi je parlais. Et puis au mois de septembre, j'ai eu trois clients, au mois d'octobre j'en ai eu cinq, au mois de novembre j'en ai eu cinq : j'avais mes cinq réguliers par mois. Le mois de décembre, avant Noël, ça a un petit peu ralenti. Alors qu'au mois de janvier, j'en suis déjà à quinze clients, et on n'est que le six janvier. Donc là, je ne dis pas que c'est l'explosion, mais j'ai presque triplé mon nombre de clients.",
      },
      {
        qui: "Rémy",
        texte:
          "C'est top. Et ton tarif, est-ce que tu l'as fait évoluer avec le temps ? Est-ce qu'il est toujours le même ? Est-ce que tu penses le faire évoluer ?",
      },
      {
        qui: "Valérie",
        texte:
          "Mon tarif, non. On avait beaucoup travaillé ensemble, il fallait que je passe sur un tarif high ticket qui puisse correspondre à des étudiants, qui n'ont pas forcément de l'argent. Ceci étant, je mets des dispositions : on peut payer en cinq fois, donc ça passe. Au niveau de l'abonnement pour le soutien scolaire, c'est quelque chose qui leur convient bien, il est à quarante-sept euros, parce qu'ils ne le voient pas passer. Et du coup, j'ai un nombre incalculable de gens aujourd'hui qui prennent ces quarante-sept euros, donc ça me fait monter mon chiffre d'affaires. C'est un plus à côté. Et à côté de ça, il y a les programmes de préparation au concours, ou les préparations pour pouvoir rentrer, qui demandent beaucoup plus de temps, beaucoup plus de travail pour les étudiants, et qui sont facturés d'une manière plus importante.",
      },
      {
        qui: "Rémy",
        texte:
          "Félicitations pour tes résultats, tu les avais partagés sur le groupe, donc je pense que ça a inspiré beaucoup de monde. Tu as mis un certain temps avant de lancer. Pourquoi aujourd'hui dirais-tu que tu as eu besoin de ce temps-là ? Est-ce que tu penses que tu aurais pu aller plus vite ?",
      },
      {
        qui: "Valérie",
        texte:
          "Je ne me sentais pas de me lancer avant, parce que mon espace de formation était pour moi important : je voulais que les étudiants arrivent avec un espace de formation qui tienne la route un minimum, puisque la première chose qu'ils demandent, c'est justement l'espace dans lequel ils peuvent retrouver des cours, des fiches techniques. Donc il fallait que je prenne le temps de monter tout ça. Comme c'est mon domaine, je n'ai pas de problème au niveau de la pédagogie, je baigne dedans depuis vingt-cinq ans, donc les cours ont été assez facilement montés. Ce qui m'a pris beaucoup plus de temps, c'est évidemment tout ce qui est tunnel de vente : comment fonctionne l'outil, comment monter un webinaire. Il a fallu beaucoup travailler ensemble. C'est plutôt tout ce qui tournait autour du tunnel et du marketing, pour lequel je n'étais absolument pas prête. Il me fallait du temps avant de pouvoir me lancer, pour avoir un minimum de crédibilité.",
      },
      {
        qui: "Rémy",
        texte:
          "Tu ne venais pas du tout de ce monde-là, et du coup tu as tout appris de zéro : comment faire l'offre, la vendre, créer le tunnel. Est-ce qu'il y a quelque chose en particulier qui t'a aidée pendant cette période-là, ou qui t'a particulièrement plu dans Funnels Club ?",
      },
      {
        qui: "Valérie",
        texte:
          "Ce qui était agréable, ce sont les rendez-vous du samedi matin, qui sont toujours présents d'ailleurs, parce qu'on a les réponses immédiates à nos questions quand on bloque sur un thème particulier. Et évidemment aussi toute l'approche des stratégies et des méthodologies qu'il faut appliquer. Comme on a des réponses journalières, si ça ne va pas, on retravaille le lendemain, si ça ne va toujours pas, on retravaille. Donc finalement, il suffit de travailler, d'appliquer, de faire ce que tu nous demandes, et une fois que c'est validé, on peut avancer sur l'étape suivante. Ça, c'était vraiment top. Je n'ai pas forcément de choses qui m'ont déplu dans Funnels Club, je n'ai été arrêtée par quoi que ce soit, même au niveau de la technique quand ça ne fonctionne pas : on a Ludivine qui est là avec son équipe, qui répond facilement, ou qui prend même la main sur l'ordinateur. Ça m'est arrivé une fois, parce que j'étais vraiment bloquée, et ça m'a débloquée. Donc j'ai pris du temps, mais c'était moi qui le voulais ainsi, alors que je pense que d'autres sont beaucoup plus à l'aise pour démarrer un business en trois mois.",
      },
      {
        qui: "Rémy",
        texte:
          "Est-ce que tu aurais un mot à dire à quelqu'un qui hésiterait à travailler avec nous, ou simplement à réserver un appel pour savoir si on peut l'aider ?",
      },
      {
        qui: "Valérie",
        texte:
          "Je dirais qu'il faut faire confiance, et franchement ça paye. Parce que c'est vrai que vous êtes sur le marché depuis un moment, vous savez de quoi vous parlez, vous avez testé, vous testez, vous testez encore, et chaque fois que vous testez quelque chose, vous nous l'apportez. Il y a une grande transparence avec vous, parce que quand quelque chose n'est pas bon, vous savez nous le dire, et donc on ne peut que progresser. Ça ne peut que fonctionner, à condition évidemment de s'engager dans cette démarche : je veux y arriver, mais je dois rester enseignable, je dois rester coachable aussi. Moi, je venais d'un autre domaine, donc je prenais tout et j'appliquais. Mais c'est vrai qu'il y a d'autres personnes qui pourraient déjà savoir des choses et venir te dire : oui mais non. Il n'y a pas de oui mais non. Je pense qu'il faut vraiment rester coachable et enseignable, et franchement, ça paye.",
      },
      {
        qui: "Rémy",
        texte:
          "Merci beaucoup en tout cas d'avoir pris le temps de partager ton retour d'expérience. Je pense vraiment que ça va inspirer beaucoup de personnes, y compris des femmes, qui manquent peut-être un peu d'inspiration et de modèles vis-à-vis du business en ligne et du business de manière générale. Merci beaucoup, et puis on se voit bientôt dans tous les cas.",
      },
      {
        qui: "Valérie",
        texte: "On se voit bientôt, ça marche. Merci.",
      },
    ],
  },
  /* L'intervieweur n'est pas nommé. Les tours lui sont rendus sous
     « Funnels Club ». */
  {
    id: "brvvtbkmfo",
    slug: "joel",
    titre:
      "Avis Funnels Club : Joël, de 1 800 à 2 800 € par client en quatre mois avec un tunnel à webinaire",
    titrePage: "Avis Funnels Club : Joël, 2 800 € par client en 4 mois",
    description:
      "Joël et son associée conseillent des entreprises. Il raconte pourquoi le livre ne lui a pas suffi, et comment leur webinaire couvre aujourd'hui leurs charges.",
    afficheAlt:
      "Joël en entretien vidéo avec Funnels Club, depuis son bureau",
    chapo:
      "Joël dirige avec son associée Edwina une société de conseil aux entreprises, montée après leur démission il y a deux ans. Il raconte pourquoi un livre ne lui a pas suffi, et ce que quatre mois ont donné.",
    sections: [
      {
        titre:
          "Deux salariés devenus consultants, et le temps qui leur manquait",
        paragraphes: [
          "Joël et son associée Edwina ont démissionné il y a environ deux ans, à leur retour dans leur pays, pour monter leur structure de conseil aux entreprises. Ils avaient déjà d'autres structures à côté, mais cette fois ils quittaient le salariat entièrement.",
          "Leurs clients étaient des entreprises, en physique. Et ils avaient d'autres projets, dont un de coaching professionnel, qu'ils n'arrivaient pas à faire avancer, ==faute de pouvoir se dégager du temps==. Leur objectif n'était donc pas de vendre plus, mais de gagner sans être devant le client ou devant l'écran.",
        ],
        citation: {
          texte:
            "Continuer à donner des conseils ou à suivre des personnes, tout en gagnant notre argent sans qu'on soit devant notre PC ou devant le client.",
          qui: "Joël",
        },
      },
      {
        titre: "Pourquoi le livre ne lui a pas suffi",
        paragraphes: [
          "Joël était d'abord passé par le livre de Rémy, et il avait commencé à mettre des choses en place. Sa formule pour dire ce qui manquait est la plus claire qu'on puisse trouver : ==il savait quoi faire, pas comment.==",
          "C'est exactement pour cette raison qu'il a pris la formation. Il décrit l'écart entre les deux comme le jour et la nuit, et il l'attribue à l'accompagnement. [Vous pouvez commencer par la formation gratuite](https://www.funnels.club/course-2025?el=site), comme lui a commencé par le livre.",
        ],
        citation: {
          texte:
            "On sait à peu près quoi faire, mais pas comment. C'est pour ça qu'on a pris la formation : pour avoir le comment.",
          qui: "Joël",
        },
      },
      {
        titre: "Ce qui lui manquait précisément : du cadrage",
        paragraphes: [
          "Quand on lui demande de préciser, il ne parle ni de technique ni de motivation. Il parle de cadrage : il y avait plusieurs choix possibles, et rien pour trancher entre eux.",
          "Ce qu'il a trouvé, c'est le retour de gens qui avaient déjà fait le chemin, ce qui lui a évité plusieurs erreurs. Il emploie le mot phénoménal pour décrire le temps gagné. C'est la même chose que dit [Cédric à propos des façons de se planter](/resultats/cedric).",
        ],
        citation: {
          texte:
            "Ça nous permet d'éviter de faire plusieurs erreurs et de gagner du temps, mais de manière phénoménale.",
          qui: "Joël",
        },
      },
      {
        titre: "Pourquoi Funnels Club plutôt qu'un autre programme",
        paragraphes: [
          "Joël répond sans esquiver, et il donne les deux comparaisons qu'il a faites. Il avait lu un autre livre du même genre, sorti à la même époque, et trouvé celui de Rémy plus concret. Il avait aussi suivi un autre programme, moins cher, qu'il est allé au bout et qui commençait à donner des résultats.",
          "Ce qu'il en retient, c'est que ==le passage à l'action y était différent==. Et ce qui a pesé pour lui, c'est l'ancienneté : ce que la personne a fait et accompli avant. C'est le critère que citent aussi [Christian Joyce](/resultats/christian-joyce) et Augustin Passy.",
        ],
        citation: {
          texte:
            "Le passage à l'action, il est vraiment différent. Et pourquoi j'ai choisi Rémy : par rapport à l'ancienneté de la personne, ce qu'il a pu faire et ce qu'il a pu accomplir.",
          qui: "Joël",
        },
      },
      {
        titre: "La validation étape par étape, et ce qu'il en a pensé au début",
        paragraphes: [
          "Il est honnête sur sa première impression : devoir faire valider chaque fiche, on peut le prendre comme d'être ralenti. Il a d'ailleurs voulu aller plus vite à un moment.",
          "Sa conclusion est l'inverse. Il dit qu'il faut repartir de la base, que c'est là qu'on y gagne vraiment, et que suivre les étapes n'est pas négligeable. [Corentin a fait la même expérience](/resultats/corentin) quand il a voulu sortir du cadre.",
        ],
        citation: {
          texte:
            "On voudrait aller des fois très vite, mais en réalité non. Il faut vraiment suivre les étapes.",
          qui: "Joël",
        },
      },
      {
        titre: "Leurs résultats : un premier client à 1 800 €, les suivants à 2 800 €",
        paragraphes: [
          "Ils prennent la formation fin janvier. Fin février, leur tunnel à webinaire est en place. En mars, quelques premiers signes, mais les ventes commencent vraiment fin avril, début mai.",
          "==Le premier client est à mille huit cents euros, et les trois suivants à deux mille huit cents==, soit mille euros de plus en quelques semaines. Joël précise qu'ils restent encore très en dessous du prix qu'ils peuvent atteindre. Et il donne le repère qui compte le plus pour eux : le webinaire couvre désormais l'ensemble de leurs charges, et ce qui viendra ensuite est du bonus.",
        ],
        citation: {
          texte:
            "Le webinaire nous a permis de nous extirper, d'être à l'équilibre sur l'ensemble de nos charges. Et là, ce qui va arriver, ce sera du bonus.",
          qui: "Joël",
        },
      },
      {
        titre: "Son avis pour ceux qui hésitent, prix compris",
        paragraphes: [
          "Il ne contourne pas la question du prix, il la nomme. Au moment de passer à l'action, on se dit que c'est cher. Sa réponse tient en une phrase, et elle est la même que celle de plusieurs autres membres de cette page.",
          "Il termine par le chiffre qu'il retient de son propre parcours : entre le moment où il a commencé à suivre Rémy de loin et celui où il est passé à l'action, il s'est écoulé du temps. Si vous en êtes là, [l'appel découverte est gratuit](https://www.funnels.club/appel?el=site), et [d'autres membres racontent leur propre déclic](/resultats).",
        ],
        citation: {
          texte:
            "Le passage à l'action, c'est le maître mot.",
          qui: "Joël",
        },
      },
    ],
    transcription: [
      {
        qui: "Funnels Club",
        texte:
          "Déjà merci d'avoir accepté l'interview aujourd'hui, pour pouvoir partager un petit peu ton parcours, ton trajet au sein de Funnels Club, et pouvoir inspirer d'autres personnes. Est-ce que tu peux te présenter assez simplement, nous dire qui tu es, d'où tu viens et ce que tu fais aujourd'hui ?",
      },
      {
        qui: "Joël",
        texte:
          "Alors bonjour à vous. Moi, c'est Joël, j'ai une associée qui s'appelle Edwina. On a une société de conseil aux entreprises. Notre parcours : initialement, on était salariés, il y a peut-être deux ans de cela. On a démissionné, on a monté notre structure quand on est retournés dans notre pays. On avait déjà d'autres structures à côté, mais là, on se lançait totalement dans le concret de l'entrepreneuriat, donc plus de salariat, purement.",
      },
      {
        qui: "Joël",
        texte:
          "Et au final, ce qui s'est passé, c'est qu'à un moment donné, on avait des clients physiques, des entreprises, et de plus en plus on se disait qu'il faudrait quand même aussi qu'on arrive à avancer sur nos autres projets, dont le projet de coaching professionnel. Il fallait qu'on se dégage du temps par rapport à ça. Donc on s'est dit : ce qu'on va faire, on va essayer de dégager ce temps pour pouvoir continuer à donner des conseils ou à suivre des personnes, tout en gagnant notre argent sans qu'on soit devant notre PC ou devant le client, ou en train de travailler pour le client.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Donc vraiment, l'objectif pour vous, c'était de décorréler ce temps de ce que ça vous permettait de gagner. Et est-ce que vous aviez déjà des choses en place par rapport à votre projet, ou pas encore, quand vous nous avez rejoints ?",
      },
      {
        qui: "Joël",
        texte:
          "Quand nous vous avons rejoints, initialement j'étais passé par le livre de Rémy. Et au final, j'ai commencé à mettre des choses en place, mais ce n'était pas ça.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Qu'est-ce qui n'était pas vraiment ça, à ce moment-là, avec le livre que tu avais lu ?",
      },
      {
        qui: "Joël",
        texte:
          "Pourquoi ? Parce qu'il me manquait l'accompagnement qu'il y avait derrière. On sait à peu près quoi faire, mais pas comment. C'est pour ça, finalement, qu'on a pris la formation : pour avoir le comment, comment il faut vraiment le faire. Et c'est le jour et la nuit, parce que l'accompagnement est juste top. Ton accompagnement, celui de l'équipe, c'est vraiment top.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Quel était pour toi le problème principal ? Parce que tu nous as parlé de ce côté où tu n'avais pas forcément le comment, mais dans ce comment, il te manquait un point bien particulier ?",
      },
      {
        qui: "Joël",
        texte:
          "Dans le comment, qu'est-ce qui me manquait ? Il me manquait plutôt du cadrage. Plutôt du cadrage, parce qu'il y avait plusieurs choix possibles, et pour aller vraiment dans ce choix-là particulièrement, et avoir un retour par rapport à ce que les gens ont déjà fait, l'expérience que l'équipe peut avoir. Et là, c'est non négligeable : ça nous permet d'éviter de faire plusieurs erreurs et de gagner du temps, mais de manière phénoménale.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Qu'est-ce qui vous a poussés à travailler avec nous ? Tu avais lu le livre en amont, ça a sûrement un peu joué. Est-ce que tu avais vu aussi d'autres choses ?",
      },
      {
        qui: "Joël",
        texte:
          "C'est une excellente question, et pour ne rien te cacher, au final, j'avais lu le livre Digital Selfmade. J'ai lu un autre livre aussi, du même acabit, qui est sorti en même temps que celui de Rémy, et je t'avoue que celui de Rémy était beaucoup plus concret. Après, je suis allé prendre un challenge, mais pas de Rémy cette fois-ci, c'était un autre challenge, et il était aussi intéressant, il était vraiment intéressant. C'était principalement plus sur Facebook. J'ai fait ce challenge jusqu'au bout, j'ai fait toutes les étapes qu'il y avait, il commençait à y avoir des résultats, mais le passage était quand même un peu particulier. Et, sans rien cacher, il était beaucoup moins cher que celui de Rémy, mais je pense que les résultats auraient été différents aussi. Le passage à l'action, il est vraiment différent, et la façon dont Rémy amène les choses. Et pourquoi j'ai choisi Rémy : par rapport à la notoriété aussi, parce que pour moi c'est non négligeable, par rapport à l'ancienneté de la personne, ce qu'il a pu faire et ce qu'il a pu accomplir. Donc là, c'est vraiment top.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Est-ce qu'au sein de Funnels Club, il y a quelque chose qui t'a aidé tout particulièrement, maintenant que tu as fait un petit peu tout le trajet ?",
      },
      {
        qui: "Joël",
        texte:
          "Ce qui m'a vraiment aidé, c'est vraiment le retour que l'équipe a, vraiment le suivi de l'équipe par rapport à la validation de chaque fiche. C'est vrai qu'initialement, on peut se dire que c'est comme si on se faisait ralentir, mais en réalité c'est vraiment intéressant, parce qu'on y gagne vraiment. On voudrait aller des fois très vite, mais il faut repartir de la base. Et c'est ce qui s'est passé pour nous, pour moi principalement : j'ai voulu aller beaucoup plus vite à un moment donné, mais en réalité non. Il faut vraiment suivre les étapes, et c'est non négligeable.",
      },
      {
        qui: "Funnels Club",
        texte:
          "C'est super intéressant, ce que tu dis. C'est important, on en parle assez souvent, et c'est aussi ce qu'on veut vous transmettre : le côté long terme, travailler vraiment sur ces points-là. Est-ce qu'aujourd'hui tu peux parler un peu des chiffres que tu as eus, de ce que vous avez fait avec Edwina ?",
      },
      {
        qui: "Joël",
        texte:
          "Tout à fait. On a pris la formation fin janvier. On a commencé vraiment fin janvier, février, mars. Fin février, on a eu notre tunnel de vente, un tunnel à webinaire. En mars, on commençait à avoir quelques éléments, mais on a commencé vraiment à closer plutôt fin avril, début mai. On a eu notre premier client début mai, sur une offre à mille huit cents. Sachant que là, on est encore très bas du prix qu'on peut atteindre. Et on est montés assez vite, puisqu'on a eu un seul client à mille huit cents, et les trois autres clients qu'on a eus ces derniers temps étaient à deux mille huit cents. Donc on a fait un bond de mille euros, donc c'est non négligeable.",
      },
      {
        qui: "Joël",
        texte:
          "Le webinaire nous a permis de nous extirper, d'être à l'équilibre sur l'ensemble de nos charges. Et là, ce qui va arriver, ce sera du bonus. Donc là, c'est top, c'est vraiment cool.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Félicitations pour ces chiffres-là. Aujourd'hui, si tu avais un mot à dire à quelqu'un qui hésiterait à travailler avec nous au sein de Funnels Club, qu'est-ce que tu lui dirais ?",
      },
      {
        qui: "Joël",
        texte:
          "Franchement, l'accompagnement, il est vraiment de haut niveau. Au moment de passer à l'action, on se dit : ouais, le prix, c'est quand même. Mais en vrai, non : ça vaut le prix, ça vaut vraiment le prix. Il faut passer à l'action, le passage à l'action, c'est le maître mot. Et au final, pour moi, il n'y a pas photo entre le précédent que j'avais suivi et celui-ci, alors qu'au final j'avais juste suivi le livre de Rémy, je le suivais de très loin. Parce qu'entre le moment où j'ai commencé à suivre Rémy sur YouTube et le moment où je suis passé à l'action, il s'est passé du temps.",
      },
      {
        qui: "Funnels Club",
        texte:
          "Encore une fois félicitations, et merci pour cette interview. J'espère que ça va aider d'autres personnes à prendre confiance sur le trajet, parce que c'est important. Merci beaucoup, et je te dis à très vite.",
      },
      {
        qui: "Joël",
        texte: "À très vite.",
      },
    ],
  },
];

/** L'avis d'un témoignage, s'il en a un. */
export const avisDe = (id: string) => avis.find((a) => a.id === id);
