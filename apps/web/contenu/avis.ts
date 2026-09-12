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

export type Avis = {
  /** L'identifiant Wistia, qui relie l'article à sa vidéo et à son affiche. */
  id: string;
  /** Le dernier segment de l'URL : `/resultats/<slug>`. */
  slug: string;
  /** Le `h1` de la page, et le titre de sa carte sur `/resultats`. */
  titre: string;
  /** La méta-description. Entre 120 et 160 caractères, voir `AGENTS.md`. */
  description: string;
  /** Le chapô, sous le titre. Deux phrases au plus. */
  chapo: string;
  sections: readonly SectionAvis[];
};

export const avis: readonly Avis[] = [
  {
    id: "rgio4y4o8f",
    slug: "roland-buffet",
    titre:
      "Roland Buffet : 109 778 € en six mois en digitalisant son expertise du bâtiment",
    description:
      "Ancien charpentier devenu formateur, Roland Buffet raconte comment il est passé de mille kilomètres de voiture par semaine à un tunnel de vente qui travaille sans lui.",
    chapo:
      "Roland Buffet accompagne les entreprises du bâtiment sur leur gestion depuis plus de treize ans. Il raconte à Rémy pourquoi il a arrêté de parcourir la France en voiture, et ce que ça a changé.",
    sections: [
      {
        titre: "Mille kilomètres par semaine",
        paragraphes: [
          "Roland a d'abord été militaire de carrière. Il a ensuite repris l'entreprise de charpente de son père, qui était celle de son grand-père, puis en a créé deux ou trois autres. De ce parcours, il a tiré une expertise qu'il a voulu transmettre à d'autres entreprises du bâtiment : depuis plus de treize ans, il les accompagne sur la partie gestion, et non sur le métier.",
          "Il y a trois ans, il crée sa propre entreprise pour être libre de son temps, de sa stratégie et de ses choix, après une période de salariat dans la formation. C'est là qu'il se heurte au mur : pour être performant auprès de ses clients, il fallait être présent. Et être présent, dans son métier, ça se comptait en kilomètres.",
        ],
        citation: {
          texte:
            "Être présent auprès de mes clients, ça représentait en gros mille kilomètres par semaine en voiture.",
          qui: "Roland",
        },
      },
      {
        titre: "Les fausses croyances du bâtiment",
        paragraphes: [
          "Roland savait qu'il voulait servir plus d'artisans. Il ne savait pas encore que la réponse serait digitale, et deux croyances l'en éloignaient. La première : dans le bâtiment, on ne peut pas travailler en digitalisé, parce que les artisans ne seraient ni équipés ni réceptifs. La seconde : dans la formation, tout passe par les financements d'État, et commercialiser sans eux paraissait impossible.",
          "Il le dit lui-même, il était alors à peu près seul dans son domaine à croire à ce qu'il voulait faire. Ce qu'il visait, c'était de faire tomber la barrière géographique : installé en Savoie, il trouvait dommage d'être limité par sa zone et sa capacité de déplacement.",
        ],
        citation: {
          texte:
            "Aujourd'hui, je le sais que c'était une fausse croyance, mais avant, je ne le savais pas forcément.",
          qui: "Roland",
        },
      },
      {
        titre: "Le podcast écouté en courant",
        paragraphes: [
          "Roland prépare un marathon. Il court, beaucoup, et il écoute des podcasts en s'entraînant. C'est comme ça qu'il tombe sur celui de Rémy, et qu'il commence à se dire qu'il y a peut-être quelque chose du côté des tunnels de vente.",
          "Ce qui suit ressemble à son caractère : il analyse. Les réseaux, les avis, tout ce qu'il pouvait croiser, il l'a croisé, et il a passé beaucoup de temps à observer de loin avant de prendre le fameux appel téléphonique. Sa question n'était pas le prix, qu'il assume dès lors qu'il y a un retour sur investissement, mais de savoir vers qui il allait.",
        ],
        citation: {
          texte:
            "J'ai beaucoup cherché, et j'ai vu en toi quelqu'un de simple, d'accessible et d'honnête. C'était surtout ça.",
          qui: "Roland",
        },
      },
      {
        titre: "Cinq mois à construire, six mois à vendre",
        paragraphes: [
          "Roland n'a pas cherché à aller vite, il a cherché à faire bien. Deux mois de découverte complète, où il se décrit perdu, puis la structuration de la formation et de l'offre. Cinq mois en tout avant de commercialiser quoi que ce soit.",
          "Sa chaîne YouTube démarre le 15 septembre. La commercialisation de son programme, BTP Performance, commence début novembre. Il insiste sur un point : rien n'est magique, le travail reste chez lui, et il faut de la ténacité. Ce qu'il a trouvé, ce n'est pas un raccourci, c'est une méthode à appliquer.",
        ],
        citation: {
          texte:
            "Il suffit d'être rigoureux, il suffit de faire ce que vous dites. C'est con à dire, mais à ce moment-là, on avance.",
          qui: "Roland",
        },
      },
      {
        titre: "109 778 €, tableau sous les yeux",
        paragraphes: [
          "De début novembre au jour de l'entretien, Roland annonce 109 778 € de chiffre d'affaires. Il donne le chiffre au centime, précisant qu'il a le tableau devant lui au moment où il le dit. Son objectif sur l'année est de 250 000 €, et il ne lâche pas l'idée du million.",
          "Ce qui le frappe, c'est le caractère mathématique de la chose : une fois l'équation trouvée pour faire cent mille, puis deux cent cinquante mille, la suite ne peut aller que dans ce sens. Il ajoute une condition, et elle compte : il connaît son métier, il a une vraie expertise. Sans elle, il n'aurait vendu que du vent.",
        ],
        citation: {
          texte:
            "C'est incroyable comme c'est mathématique finalement. Si tu fais ce qu'il faut faire, que tu appliques ce qu'il faut appliquer, et que tu connais ton métier.",
          qui: "Roland",
        },
      },
      {
        titre: "Ce que ça a changé chez lui",
        paragraphes: [
          "Roland travaille désormais de chez lui. Il parle de ses enfants, qu'il n'a pas vraiment vu grandir et avec qui il peut maintenant être, de clients partout en France, et de la sensation d'être utile de partout. Il pose une seule limite à son territoire, la francophonie, faute de parler anglais.",
          "Il y a une suite qu'il n'attendait pas : son fils s'est intéressé au monde numérique en voyant son père s'y lancer, s'est mis au montage vidéo, et ils travaillent à faire peut-être du closing ensemble.",
        ],
        citation: {
          texte:
            "Il y a une synergie familiale en plus qui est en train de se créer, et qui m'éclate.",
          qui: "Roland",
        },
      },
      {
        titre: "Ce qu'il dirait à quelqu'un qui hésite",
        paragraphes: [
          "Rémy lui pose la question franchement : que dire à quelqu'un qui regarde cette vidéo, sceptique, et qui hésite à réserver un appel. La réponse de Roland ne cherche pas à rassurer.",
          "Il donne raison à celui qui doute. Qu'il hésite, qu'il fouille, qu'il cherche, qu'il aille au bout de sa peur. Parce qu'au bout, dit-il, il découvrira qu'il n'y a pas de piège.",
        ],
        citation: {
          texte:
            "Elle a raison de s'inquiéter, parce qu'il y a beaucoup de marlous dans ce domaine. Et quand elle aura fini de s'inquiéter, elle prendra cet appel, et cet appel peut changer véritablement beaucoup de choses dans sa vie.",
          qui: "Roland",
        },
      },
    ],
  },
];

/** L'avis d'un témoignage, s'il en a un. */
export const avisDe = (id: string) => avis.find((a) => a.id === id);
