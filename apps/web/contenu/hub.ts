import type { ContenuMessage } from "@/components/message-remy";
import { messageRemy } from "@/contenu/site";

/**
 * Le texte propre au hub de retargeting.
 *
 * **Tout ce fichier est à valider par Rémy.** Les conventions du projet disent
 * que le texte du site est écrit par Rémy et jamais par l'agent ; l'exception
 * est ici explicite et vient de lui : « analyse les règles de Meta et assure-toi
 * que tout ce que tu vas écrire en titre, en texte, respecte les règles de
 * Meta ». Ce qui suit est donc écrit par l'agent, et doit être relu comme tel.
 *
 * **Ce qui a été fait, et pourquoi.** Dix-huit des vingt-deux articles portent un
 * montant dans leur `h1`. « 160 000 € en quatre mois » est la forme même de ce
 * que les règles publicitaires de Meta refusent, et l'examen porte sur la page
 * d'arrivée autant que sur l'annonce. Le refus ne vient pas du témoignage : il
 * vient du témoignage centré sur l'argent gagné plutôt que sur le problème
 * résolu. Chaque en-tête a donc été retourné vers ce que la personne a **changé
 * dans son activité**, qui est de toute façon le sujet de l'entretien.
 *
 * **Aucun fait n'est inventé.** Chaque formulation reprend un élément déjà
 * présent dans l'article d'origine : le métier, le blocage, la décision. Rien
 * n'est ajouté, rien n'est promis. Ce qui disparaît disparaît, ce qui reste est
 * déjà écrit ailleurs dans le dépôt.
 *
 * Les corps d'articles, eux, ne sont pas réécrits : les paragraphes, citations
 * et tours de parole qui portent un montant sont **retirés** par `lib/hub.ts`.
 * Ce sont les mots de vraies personnes, et les reformuler pour les rendre
 * publiables serait une faute d'un autre ordre qu'une page refusée.
 */

/** Les en-têtes d'un avis, dans leur version hub. */
export type EnTetesHub = {
  /** Le `h1`. */
  titre: string;
  /** Le titre d'onglet, plus court. Voir la règle des deux titres. */
  titrePage: string;
  /** La méta-description, entre 120 et 160 caractères. */
  description: string;
  /** Le chapô, sous le titre. */
  chapo: string;
  /** La ligne sous le nom, sur la carte du sommaire. */
  carte: string;
};

/**
 * Un en-tête par avis, et **aucun avis sans le sien**.
 *
 * `avisHub` renvoie `null` quand l'entrée manque, donc un avis ajouté dans
 * `avis.ts` sans passer ici rend un 404 sur le hub au lieu d'y arriver avec son
 * titre d'origine et son montant dessus. C'est le défaut bruyant qu'on préfère
 * au défaut silencieux.
 */
export const titresHub: Record<string, EnTetesHub> = {
  "christian-joyce": {
    titre:
      "Avis Funnels Club : Christian Joyce a tiré une formation en ligne de sa société de nettoyage",
    titrePage: "Avis Funnels Club : Christian Joyce",
    description:
      "À 22 ans, Christian Joyce dirige une société de nettoyage en Belgique. Il raconte comment il en a tiré une formation en ligne, et ce qu'il a fait en premier.",
    chapo:
      "Christian Joyce a 22 ans et une société de nettoyage en Belgique. Dans cet entretien avec Rémy Jupille, il raconte comment il a transformé son métier en formation en ligne, et pourquoi il n'a rien essayé d'autre avant.",
    carte: "Il a tiré une formation en ligne de sa société de nettoyage",
  },

  "roland-buffet": {
    titre:
      "Avis Funnels Club : Roland Buffet a quitté la route pour une formation en ligne dans le BTP",
    titrePage: "Avis Funnels Club : Roland Buffet",
    description:
      "Roland Buffet forme les entreprises du bâtiment. Il raconte comment il est passé de mille kilomètres de voiture par semaine à une formation vendue en ligne.",
    chapo:
      "Roland Buffet forme les entreprises du bâtiment à la gestion depuis plus de treize ans. Dans cet entretien avec Rémy Jupille, il raconte comment il est passé de mille kilomètres de voiture par semaine à une formation en ligne vendue par un tunnel de vente.",
    carte: "Il est passé de mille kilomètres par semaine à une formation en ligne",
  },

  "augustin-passy": {
    titre:
      "Avis Funnels Club : Augustin Passy passe deux à trois fois moins de temps par client",
    titrePage: "Avis Funnels Club : Augustin Passy",
    description:
      "Augustin Passy est coach en personal branding. Il raconte comment il a cessé de vendre son temps, et ce que son tunnel de vente a changé à son organisation.",
    /* Le chapô d'origine nommait le plafond en toutes lettres, « le plafond des
       dix mille euros par mois ». C'est un montant écrit en lettres, donc
       exactement ce que le contrôle refuse. */
    chapo:
      "Augustin Passy accompagne des entrepreneurs sur leur personal branding depuis bientôt trois ans. Il raconte ici comment il est sorti de son plafond, non pas en prenant plus de clients, mais en passant moins de temps avec chacun.",
    carte: "Deux à trois fois moins de temps par client",
  },

  "yannick-et-sylvie": {
    titre:
      "Avis Funnels Club : Yannick et Sylvie ont quitté l'abonnement low cost pour une vraie formation",
    titrePage: "Avis Funnels Club : Yannick et Sylvie",
    description:
      "Yannick et Sylvie forment à la souplesse en ligne. Ils racontent pourquoi l'abonnement à bas prix les bloquait, et ce qu'ils ont décidé de mettre à la place.",
    chapo:
      "Sylvie a créé une méthode de souplesse pour adultes, et Yannick, son mari, l'a rejointe. Après quatre ans et demi d'abonnement à bas prix, ils racontent ce qui les empêchait de monter, et pourquoi ce n'était pas leur offre.",
    carte: "Ils ont quitté l'abonnement à bas prix pour une formation complète",
  },

  olga: {
    titre:
      "Avis Funnels Club : Olga a restructuré son tunnel de vente sans toucher à son webinaire",
    titrePage: "Avis Funnels Club : Olga",
    description:
      "Olga donne des conférences sur la communication non verbale. Elle raconte ce que les order bumps et les up-sells ont changé dans son tunnel de vente.",
    chapo:
      "Olga donne des conférences en entreprise sur la communication non verbale, et vend des formations en ligne depuis sept ou huit ans. Elle raconte ici ce qu'elle a changé dans son tunnel de vente sans toucher à son webinaire.",
    carte: "Elle a restructuré son tunnel sans toucher à son webinaire",
  },

  sandrine: {
    titre:
      "Avis Funnels Club : Sandrine a digitalisé son métier de cake designer depuis la Martinique",
    titrePage: "Avis Funnels Club : Sandrine",
    description:
      "Sandrine a monté sept entreprises physiques en Martinique. Elle raconte son passage au digital, et les six mois de pause qu'il lui a fallu au milieu.",
    chapo:
      "Sandrine a quarante-trois ans, vit en Martinique et a créé sept entreprises depuis ses vingt et un ans, toutes physiques. Elle raconte son passage au digital, et surtout les six mois de pause qu'il lui a fallu au milieu.",
    carte: "Elle a digitalisé son métier de cake designer",
  },

  tatiana: {
    titre:
      "Avis Funnels Club : Tatiana a abandonné la niche pour laquelle elle était venue",
    titrePage: "Avis Funnels Club : Tatiana",
    description:
      "Tatiana est en reconversion depuis la fonction publique. Elle raconte pourquoi elle a abandonné sa première niche, et ce qu'une seule question lui a fait trouver.",
    chapo:
      "Tatiana a quarante-deux ans, vit en région parisienne et travaille dans la fonction publique. Elle raconte comment elle a abandonné la niche pour laquelle elle était venue, et ce qu'une seule question lui a fait trouver à la place.",
    carte: "Elle a abandonné la niche pour laquelle elle était venue",
  },

  charlotte: {
    titre:
      "Avis Funnels Club : Charlotte a fait passer sa formation d'ongles du présentiel au distanciel",
    titrePage: "Avis Funnels Club : Charlotte",
    description:
      "Charlotte forme à la prothésie ongulaire au Canada. Elle raconte son passage du présentiel à la formation en ligne, et le bêta-test qui la lui a corrigée.",
    chapo:
      "Charlotte forme au métier des ongles, en présentiel, et publiait depuis un an sur Instagram sans savoir ce qui marchait. Elle raconte comment elle a transformé une formation manuelle en formation en ligne, et ce que ça lui a pris de temps.",
    carte: "Elle a fait passer sa formation du présentiel au distanciel",
  },

  francois: {
    titre:
      "Avis Funnels Club : François a remplacé ses douze formations de guitare par une seule",
    titrePage: "Avis Funnels Club : François",
    description:
      "François enseigne la guitare en ligne. Il raconte la phrase qui lui a fait supprimer ses douze petites formations, et pourquoi elle lui a fait mal.",
    chapo:
      "François a trente-quatre ans, il est entrepreneur depuis 2012 et enseigne la guitare. Il plafonnait depuis presque un an malgré une audience qui doublait. Il raconte la phrase qui a tout débloqué, et pourquoi elle lui a fait mal.",
    carte: "Il a remplacé douze produits par un seul",
  },

  jeremy: {
    titre:
      "Avis Funnels Club : Jérémy, salarié, vend des cours d'anglais en ligne à côté de son emploi",
    titrePage: "Avis Funnels Club : Jérémy",
    description:
      "Jérémy est salarié et donne des cours d'anglais. Il raconte son premier lancement raté, et le changement de cible qui a débloqué le second.",
    chapo:
      "Jérémy est encore salarié et cherchait d'abord un complément de revenu. Il raconte comment son premier lancement n'a pas pris du tout, et ce qu'il a changé pour que le second parte, selon ses mots, comme un feu.",
    carte: "Salarié, il vend des cours d'anglais en ligne",
  },

  cedric: {
    titre:
      "Avis Funnels Club : Cédric, psychologue, a ouvert son activité en ligne depuis la Corse",
    titrePage: "Avis Funnels Club : Cédric",
    description:
      "Cédric est psychologue en Corse, avec six mois d'attente. Il raconte ce qui l'a fait renoncer à son site d'articles pour un programme en ligne.",
    chapo:
      "Cédric dirige des centres thérapeutiques en Corse, avec une vingtaine de personnes autour de lui et cinq à six mois d'attente. Il raconte ce qui l'a fait renoncer à son site d'articles, et ce qu'il a construit à la place.",
    carte: "Psychologue, il a ouvert son activité en ligne",
  },

  corentin: {
    titre:
      "Avis Funnels Club : Corentin, 25 ans, conseille les installateurs de poêles à bois",
    titrePage: "Avis Funnels Club : Corentin",
    description:
      "Corentin conseille les installateurs de poêles à bois. Il raconte son premier client, sa phase de stagnation, et ce qui l'en a finalement sorti.",
    chapo:
      "Corentin a vingt-cinq ans et six ans d'entrepreneuriat derrière lui, dans le bâtiment. Il raconte comment il a lancé une activité de conseil sans rien avoir de prêt, et pourquoi il tient à replacer son parcours dans son contexte.",
    carte: "À vingt-cinq ans, il conseille les installateurs de poêles à bois",
  },

  matthieu: {
    titre:
      "Avis Funnels Club : Mathieu Tison, sexologue, est sorti d'un plafond d'un an et demi",
    titrePage: "Avis Funnels Club : Mathieu Tison",
    description:
      "Mathieu Tison vend des formations en ligne depuis 2020. Il raconte le plafond de verre qui a duré un an et demi, et les deux pistes qui l'en ont sorti.",
    chapo:
      "Mathieu Tison a quarante-sept ans, il est sexologue et vend des formations en ligne depuis le confinement de 2020. Il raconte un an et demi de blocage, et ce qu'il a fallu de travail pour en sortir en six semaines.",
    carte: "Il est sorti d'un plafond qui durait depuis un an et demi",
  },

  valerie: {
    titre:
      "Avis Funnels Club : Valérie, 56 ans, forme des étudiants infirmiers en ligne",
    titrePage: "Avis Funnels Club : Valérie",
    description:
      "Valérie a été formatrice en soins infirmiers pendant vingt-cinq ans. Elle raconte l'année qu'elle s'est donnée avant de lancer, et sa première vente.",
    chapo:
      "Valérie a cinquante-six ans, elle est infirmière de formation et a formé de futurs infirmiers pendant vingt-cinq ans. Elle raconte pourquoi elle s'est donnée presque un an avant de lancer quoi que ce soit, et ce qui s'est passé ensuite.",
    carte: "À cinquante-six ans, elle forme des étudiants infirmiers en ligne",
  },

  joel: {
    titre:
      "Avis Funnels Club : Joël et son associée ont monté un tunnel à webinaire pour leur cabinet",
    titrePage: "Avis Funnels Club : Joël",
    description:
      "Joël et son associée conseillent des entreprises. Il raconte pourquoi le livre ne lui a pas suffi, et ce que leur webinaire couvre aujourd'hui.",
    chapo:
      "Joël dirige avec son associée Edwina une société de conseil aux entreprises, montée après leur démission il y a deux ans. Il raconte pourquoi un livre ne lui a pas suffi, et ce que quatre mois ont donné.",
    carte: "Un tunnel à webinaire pour leur cabinet de conseil",
  },

  lilian: {
    titre:
      "Avis consulting privé : Lilian, 20 ans, a retravaillé ses appels de vente en un mois",
    titrePage: "Avis consulting : Lilian",
    description:
      "Lilian a vingt ans et une agence de communication pour artisans. Il raconte le mois de consulting privé qui a fait basculer ses appels de vente.",
    chapo:
      "Lilian a vingt ans et dirige depuis deux ans et demi une agence de communication pour les artisans du bâtiment. Après Funnels Club, il a pris un mois d'accompagnement en tête-à-tête. Il raconte ce qu'il croyait venir corriger, et ce qui l'était vraiment.",
    carte: "À vingt ans, il a retravaillé ses appels de vente",
  },

  "corentin-mastermind": {
    titre: "Avis mastermind : Corentin, un an et demi après ses débuts",
    titrePage: "Avis mastermind : Corentin",
    description:
      "Un an et demi après son premier entretien, Corentin revient sur ce que le mastermind a changé, et sur la barrière qu'il n'a toujours pas passée.",
    /* Le chapô d'origine annonçait « entre vingt et trente mille euros par
       mois ». Le rappel du mastermind en pause reste : une page d'avis ne vend
       pas un programme qui n'existe plus, et c'est vrai sur le hub aussi. */
    chapo:
      "Corentin avait raconté son lancement dans un premier entretien ; un an et demi plus tard, il explique pourquoi il n'est pas satisfait de là où il en est. Le mastermind dont il parle est aujourd'hui en pause : c'est le consulting privé en tête-à-tête qui l'a remplacé.",
    carte: "Un an et demi après son premier entretien",
  },

  sebastien: {
    titre:
      "Avis Funnels Club : Sébastien vend sa formation sans publicité, depuis ses vidéos YouTube",
    titrePage: "Avis Funnels Club : Sébastien",
    description:
      "Sébastien vend une formation sans publicité, depuis ses vidéos YouTube. Il annonce son meilleur mois en direct pendant un coaching de groupe.",
    chapo:
      "Cet extrait n'est pas un entretien : Sébastien prend le micro pendant un coaching de groupe pour annoncer son meilleur mois. Ce qui suit est l'échange avec Rémy, et il porte moins sur le résultat que sur ce qu'il ne faut surtout pas faire ensuite.",
    carte: "Son meilleur mois, sans publicité, depuis ses vidéos YouTube",
  },

  "patrick-pinot": {
    titre:
      "Avis Funnels Club : Patrick Pinot a réussi son troisième lancement, après deux ratés",
    titrePage: "Avis Funnels Club : Patrick Pinot",
    description:
      "Patrick Pinot a monté une franchise de cent vingt points de vente. Il raconte ses deux vidéos de vente ratées, et pourquoi il a failli arrêter avant la troisième.",
    chapo:
      "Patrick Pinot a passé dix ans à bâtir une franchise de studios de sport, jusqu'à cent vingt points de vente. Il raconte ce que le passage au digital lui a coûté d'essais, et pourquoi il a failli arrêter avant le troisième.",
    carte: "Un troisième lancement réussi, après deux ratés",
  },

  "guy-anastaze": {
    titre:
      "Avis Funnels Club : Guy Anastaze, 72 ans, est passé du coaching à la formation structurée",
    titrePage: "Avis Funnels Club : Guy Anastaze",
    description:
      "Guy Anastaze est mentor de dirigeants depuis dix ans. Il raconte la remise en question qui l'a fait passer du coaching à la formation structurée.",
    chapo:
      "Guy Anastaze a soixante-douze ans et accompagne des dirigeants depuis plus de dix ans, depuis Genève. Il raconte la remise en question qui l'a fait passer du coaching à la formation, et ce qu'elle a déclenché.",
    carte: "À 72 ans, il est passé du coaching à la formation structurée",
  },

  "roland-buffet-mastermind": {
    titre:
      "Avis mastermind : Roland Buffet travaille aujourd'hui avec sa femme et son fils",
    titrePage: "Avis mastermind : Roland Buffet",
    description:
      "Un an et demi après son premier entretien, Roland Buffet raconte le séminaire où il ne voulait pas aller, et ce qu'il a changé à son retour.",
    chapo:
      "Roland Buffet avait raconté son passage du présentiel au distanciel ; un an et demi plus tard, il travaille avec sa femme et son fils. Le mastermind dont il parle est aujourd'hui en pause : c'est le consulting privé qui l'a remplacé.",
    carte: "Un an et demi après : il travaille avec sa femme et son fils",
  },

  "francois-mastermind": {
    titre: "Avis mastermind : François Daoud a dix fois moins de clients qu'avant",
    titrePage: "Avis mastermind : François Daoud",
    description:
      "Neuf mois après son premier entretien, François Daoud raconte pourquoi il a dix fois moins de clients qu'avant, et ce que son offre unique a changé.",
    /* Le lien du chapô est conservé : il pointe vers un autre avis, donc
       `versHub` le réécrit vers le hub au lieu de le laisser sortir. */
    chapo:
      "François Daoud forme des guitaristes. Neuf mois après [son premier entretien](/resultats/francois), il raconte ce qu'une seule offre a changé, et ce qu'il pense aujourd'hui de ses anciens prix. Le mastermind dont il parle est en pause : c'est le consulting privé qui l'a remplacé.",
    carte: "Neuf mois après : dix fois moins de clients, une seule offre",
  },
};

/**
 * Les titres de section qui portaient un montant, et leur version de hub.
 *
 * La clé est le titre d'origine **en toutes lettres** plutôt qu'un couple
 * `slug` et rang : un rang se décale au premier remaniement de l'article et
 * renomme silencieusement la mauvaise section. Un titre qui change dans
 * `avis.ts` sans passer ici garde son montant, et c'est le contrôle de
 * `lib/hub.ts` qui l'attrape au build.
 *
 * Presque tous suivent la même coupe : « Ses résultats : <montant> » devient
 * « Ses résultats », éventuellement suivi du repère de temps, qui n'est pas une
 * promesse de gain.
 */
export const sectionsHub: Record<string, string> = {
  "Ses résultats : 160 000 € générés en quatre mois": "Ses résultats",
  "Ses résultats : 109 778 € de chiffre d'affaires en six mois de commercialisation":
    "Ses résultats, six mois après le lancement",
  "Coach en personal branding, bloqué entre 5 000 et 10 000 € par mois":
    "Coach en personal branding, bloqué par son propre temps",
  "Ses résultats : 20 000 € de contrats signés, et deux à trois fois moins de temps par client":
    "Ses résultats : deux à trois fois moins de temps par client",
  "Leurs résultats : une formation à 3 700 € et un chiffre triplé":
    "Leurs résultats, après l'abonnement à bas prix",
  "Ses résultats : 10 177 € atteints le 13 du mois":
    "Ses résultats, treize jours après",
  "Ses résultats : 22 000 € en trois mois pour 600 € de publicité":
    "Ses résultats, trois mois après",
  "Ses résultats : trois ventes et près de 5 000 € pour 160 € de publicité":
    "Ses résultats : ses trois premières ventes",
  "Le bêta-test : cinq élèves à 200 €, et une formation corrigée par elles":
    "Le bêta-test : cinq élèves, et une formation corrigée par elles",
  "Ses résultats : 1 500 € encaissés pour 40 € de publicité, et 6 335 € sur la session":
    "Ses résultats, sur sa première session",
  "Ses résultats : 8 300 € en mai, sans un euro de publicité":
    "Ses résultats, sans publicité",
  "Les prix : de 250 à 600 € le programme, et de 60 à 150 € la consultation":
    "Ce qu'il a changé à ses prix",
  "Ses résultats : un plancher à 2 500 € par mois, et un lancement à neuf ventes":
    "Ses résultats : un plancher, et un lancement à neuf ventes",
  "Ses résultats : un premier client dès le premier mois, puis 9 000 € par mois":
    "Ses résultats : un premier client dès le premier mois",
  "Leurs résultats : un premier client à 1 800 €, les suivants à 2 800 €":
    "Leurs résultats : un premier client, puis les suivants",
  "Ses résultats : 8 100 € contractés en deux semaines":
    "Ses résultats, deux semaines après",
  "Ce que Funnels Club avait produit : 10 000 € dès le deuxième mois":
    "Ce que Funnels Club avait produit, dès le deuxième mois",
  "Son meilleur mois : 17 600 € en août": "Son meilleur mois, au mois d'août",
  "Ce qui l'a décidé : voir passer les 30 000 € dans la poche d'un autre":
    "Ce qui l'a décidé : voir un autre réussir à sa place",
  "Ses résultats : 24 000 € signés en un mois pour moins de 500 € de publicité":
    "Ses résultats, un mois après",
  "Son résultat : un contrat de plus de 120 000 €, et d'où il vient":
    "Son résultat : le contrat qu'il a signé, et d'où il vient",
  "Ses résultats : de 10 000 € à 50 000-70 000 € par mois":
    "Ses résultats, un an et demi après",
  "Ses 20 % d'écarts, et ce qu'ils lui ont appris":
    "Ses écarts, et ce qu'ils lui ont appris",
  "De douze offres à une seule, et de 100 € à 3 500 €":
    "De douze offres à une seule",
  "Ce qu'il croyait impossible : vendre 3 500 € des cours de guitare":
    "Ce qu'il croyait impossible : vendre cher des cours de guitare",
  "Ses résultats sur un an : de 4 000 € à un mois de rentrée à 17 000 €":
    "Ses résultats sur un an",

  /* Ces deux-là ne sont pas des promesses de gain, et c'est précisément
     pourquoi ils étaient passés inaperçus : « deux cents euros de plus »
     décrit un plafond subi, et « qu'elle ne mesure pas en euros » dit le
     contraire d'un résultat chiffré. Le contrôle ne fait pas la différence, et
     il a raison de ne pas la faire : il cherche une unité monétaire, pas une
     intention, et c'est ce qui le rend fiable. Ils se reformulent sans rien
     perdre de leur sens. */
  "Le plafond de verre : beaucoup d'efforts pour un gain minime":
    "Le plafond de verre : beaucoup d'efforts pour un gain minime",
  "Le plafond de verre : beaucoup d'efforts pour deux cents euros de plus":
    "Le plafond de verre : beaucoup d'efforts pour un gain minime",
  "Ce qui a changé pour elle, et qu'elle ne mesure pas en euros":
    "Ce qui a changé pour elle, et qui ne se compte pas",
};

/**
 * Le sommaire du hub.
 *
 * Il ne compte rien : « les membres racontent », et c'est la grille qui compte,
 * puisqu'elle est calculée. C'est la règle du projet sur les textes qui
 * comptent leurs éléments, et elle vaut ici comme ailleurs.
 */
export const sommaireHub = {
  titre: "Ils racontent ce qu'ils ont changé dans leur activité",
  chapo:
    "Des membres de Funnels Club racontent, en vidéo, ce qu'ils faisaient avant, ce qu'ils ont changé et comment ils s'y sont pris. Chaque entretien a sa page, avec la vidéo et la transcription complète.",
  description:
    "Des membres de Funnels Club racontent en vidéo ce qu'ils ont changé dans leur activité. Chaque entretien a sa page, avec sa transcription complète.",
};

/** Le libellé du bouton d'appel, le seul du hub. */
export const appelHub = {
  libelle: "Réserver mon appel gratuit",
  /* Sur l'encart de milieu d'article, où il y a la place de dire pourquoi. */
  titre: "Parler de votre activité avec l'équipe",
  texte:
    "Un appel gratuit pour faire le point sur votre offre et sur la façon dont vous la vendez aujourd'hui.",
};

/**
 * L'avertissement de bas de page.
 *
 * **Il n'est pas décoratif et il n'est pas en petits caractères.** Les pages
 * dont les mentions sont minuscules ou difficiles à trouver sont elles-mêmes un
 * motif de refus chez Meta, et un avertissement illisible ne protège de rien.
 *
 * Il dit trois choses, et chacune répond à une exigence distincte : ce sont des
 * clients, donc des témoignages sollicités et non des avis indépendants ; leurs
 * parcours leur appartiennent et n'annoncent rien à personne d'autre ; et rien
 * ici n'est une promesse. C'est ce que le droit européen des pratiques
 * commerciales demande, et c'est aussi ce que Meta cherche.
 *
 * **Il ne cite aucun chiffre moyen**, et c'est délibéré : un taux de réussite
 * affiché serait à son tour une allégation à prouver.
 */
export const avertissementHub =
  "Les personnes qui témoignent sur cette page sont des clients de Funnels Club et ont accepté d'être filmées. Leur parcours leur est propre : il dépend de leur métier, de leur expérience et du travail qu'elles y ont consacré, et ne préjuge en rien de ce qu'une autre personne obtiendrait. Rien sur cette page ne constitue une promesse ni une garantie de résultat.";


/**
 * Les affiches, et ce qu'il a fallu en faire.
 *
 * **C'est le point le plus important de ce fichier, et il ne se voyait pas.**
 * Nettoyer le texte ne suffit pas : treize des vingt-deux affiches de
 * témoignage portent le résultat **incrusté dans l'image**, en blanc et en
 * gros. « De 0€ à 109 778€ en 6 mois », « 15 clients à 1300€ en 6 jours ».
 * Aucun contrôle sur des chaînes de caractères ne pouvait les attraper,
 * puisque ce ne sont pas des chaînes de caractères. Meta lit le texte des
 * images, et c'est même le premier endroit où il le cherche.
 *
 * **Les treize ne sont pas un seul et même problème**, et c'est ce qu'un relevé
 * à l'œil avait manqué. Les affiches sont des appels à deux : l'enregistrement
 * porte ses propres bandes noires, et l'image utile n'occupe que la moitié
 * centrale, lignes 90 à 269 sur 360. La luminance lue ligne par ligne sur les
 * vingt-deux fichiers a séparé deux familles :
 *
 * - **huit** portent leur phrase **dans la bande noire**, au-dessus de l'image.
 *   Elle se retire par recadrage, sans toucher à un pixel de l'image ;
 * - **cinq** sont des captures plein cadre où la phrase est posée **sur les
 *   visages**. Aucun recadrage ne l'enlève.
 *
 * Les huit premières ont donc une affiche à elles dans `public/temoignages-hub`,
 * fabriquée en deux temps : recadrage sur la bande d'image, puis remise aux
 * cotes d'origine sur du noir pur. Le résultat est **l'affiche d'origine dont
 * les bandes ont été repeintes en noir** : mêmes cotes, même cadrage, même
 * rapport 16/9, rien de déformé ni de rogné, et plus une lettre.
 *
 * C'est ce qui permet de servir dix-sept entretiens au lieu de neuf, sur
 * demande de Rémy.
 */

/** Les affiches utilisables telles quelles : aucune incrustation. */
export const affichesConformes: readonly string[] = [
  "j0vbkt570k", // christian-joyce
  "2vtsinplyx", // augustin-passy
  "2xege6bt0u", // yannick-et-sylvie
  "s3npr5izhy", // tatiana
  "b5taio9plc", // francois
  "ive07co9xm", // cedric
  "iy3jgcijgu", // corentin
  "9a6g6hsyzp", // lilian
  "8de9q4ed4l", // sebastien
];

/**
 * Les affiches dont la phrase vivait dans la bande noire, et qui ont donc une
 * version nettoyée dans `public/temoignages-hub`.
 *
 * Le commentaire dit ce que portait chacune : c'est ce qui permet de vérifier
 * qu'on a bien retiré ce qu'on croyait retirer, sans rouvrir les fichiers.
 */
export const affichesRecadrees: readonly string[] = [
  "rgio4y4o8f", // roland-buffet · « De 0€ à 109,778€ en 6 mois »
  "vtfaka0m80", // olga · « 10177€ en 13 jours, dont 1124€ en une seule journée »
  "fbtr4dqoji", // sandrine · « 30 ventes à 750€ sur une période de 3 mois »
  "tvy3jbhml9", // charlotte · « …et générer 6335€ dès son premier lancement »
  "rtil6qeznq", // jeremy · « De 0€ à 10 000€ à côté d'un travail »
  "abj3v8v8ek", // matthieu · « Doubler son chiffre d'affaires en 1 mois et demi »
  "4lkp9f6lm4", // valerie · « 15 clients à 1300€ en 6 jours »
  "brvvtbkmfo", // joel · « Vendre une offre digitale à 2800€ »
];

/**
 * L'adresse de l'affiche à servir pour un entretien.
 *
 * **Une seule fonction, et tout passe par elle** : la vignette du sommaire, le
 * lecteur de l'article, les aperçus de partage. Si la carte prenait la version
 * nettoyée et le lecteur l'originale, la phrase réapparaîtrait au moment
 * précis où l'on regarde la page, et personne ne s'en apercevrait avant un
 * refus de Meta.
 */
export const afficheHub = (id: string) =>
  affichesRecadrees.includes(id)
    ? `/temoignages-hub/${id}.jpg`
    : `/temoignages/${id}.jpg`;

/**
 * Les cinq entretiens qui restent écartés, et ce que leur affiche annonce.
 *
 * Ce sont des captures plein cadre : la phrase est posée sur l'image, pas dans
 * une bande noire, donc aucun recadrage ne l'enlève. La réparation est une
 * réexportation de la vidéo sans son carton de titre, et elle n'appartient pas
 * au code. Chaque ligne déplacée vers `affichesConformes` ramène son entretien
 * dans le hub, sans autre changement.
 *
 * Relevé le 16 septembre 2026. **À revérifier si les vidéos sont réexportées.**
 */
export const affichesEcartees: Record<string, string> = {
  "corentin-mastermind":
    "De 0 à 30 000€/mois en moins de 18 mois (en partant de zéro)",
  "patrick-pinot":
    "De 0€ à 24 000€ en un mois, et pourquoi faire confiance au process change tout",
  "guy-anastaze": "De zéro en ligne à un contrat de 120 000 €",
  "roland-buffet-mastermind":
    "Il faisait 0€ en ligne, aujourd'hui il génère 50 000 à 70 000€/mois",
  "francois-mastermind":
    "De 3 500€ à 17 000€ par mois : 5x plus de chiffres, 10x moins de clients",
};

/**
 * Les paragraphes retirés du hub en plus de ceux qui portent un montant.
 *
 * Le filtre de `lib/hub.ts` cherche le symbole et le mot « euro ». Il laisse
 * donc passer les résultats **relatifs** : « leur chiffre a triplé » est la
 * même promesse de gain que « 22 000 € », simplement sans le nombre.
 *
 * **C'est une liste et non un motif**, et c'est délibéré. Un motif du genre
 * « chiffre » près de « triplé » attrapait aussi « doubler la publicité ne
 * doublait pas le chiffre », qui dit exactement le contraire d'une promesse.
 * Une règle qui retire du texte juste ne se voit pas non plus : la page est
 * simplement plus pauvre, et personne ne sait pourquoi. Chaque retrait est donc
 * écrit, avec sa raison.
 *
 * La clé est un fragment distinctif du paragraphe ; le contrôle vérifie qu'il
 * s'y trouve, une fois et une seule.
 */
export const passagesRetires: readonly {
  slug: string;
  fragment: string;
  raison: string;
}[] = [
  {
    slug: "yannick-et-sylvie",
    fragment: "leur chiffre a triplé",
    raison:
      "Résultat relatif : un chiffre d'affaires multiplié est une promesse de gain au même titre qu'un montant.",
  },
];

/**
 * Les passages surlignés, en plus de ceux qu'`avis.ts` porte déjà.
 *
 * Demandé par Rémy : mettre en avant, comme sur le site, les points qui
 * parlent à quelqu'un qui hésite. Le site surligne déjà, avec la syntaxe
 * `==…==` de `TexteLie`, mais très inégalement une fois les montants retirés :
 * Tatiana et Corentin en gardaient trois ou quatre, Augustin plus aucun.
 *
 * **Ce sont des passages existants, désignés, jamais du texte ajouté.** Le
 * surlignage marque une phrase déjà écrite ; il ne l'écrit pas. C'est la seule
 * façon d'obéir à la règle du dépôt sur un contenu qui est la parole de vraies
 * personnes.
 *
 * **Ce qui est choisi : le problème, pas le résultat.** Un surlignage attire
 * l'œil, donc il décide de ce qu'on retient d'une page. Sur une page de
 * publicité, marquer un résultat reviendrait à remettre en gras exactement ce
 * que le reste du travail a retiré. Ce qui est marqué, ce sont les blocages, les
 * bascules et les phrases où quelqu'un se reconnaît.
 *
 * La clé est le texte exact, tel qu'il figure dans `avis.ts`. Le contrôle jette
 * si un passage ne s'y trouve pas, ou s'y trouve deux fois : sans lui, une
 * retouche du contenu ferait disparaître le surlignage sans rien signaler.
 */
export const surlignagesHub: Record<string, readonly string[]> = {
  "christian-joyce": [
    "Il n'y a pas eu, chez lui, de phase où rien ne marchait.",
    "celui qui hésite n'a pas peur du programme, il a peur de lui-même",
  ],
  "augustin-passy": [
    "pour passer la barre, il fallait changer de modèle, pas forcer sur le même",
    "la simplification, et l'étape par étape",
    "Le plafond horaire qui le bloquait n'est plus là",
  ],
  "yannick-et-sylvie": [
    "cela ne changeait rien au chiffre, et beaucoup à leur charge de travail",
    "la seule dépense qu'on ne voit jamais passer : celle qu'on ne fait pas",
  ],
  cedric: ["le programme ne fait rien à votre place"],
  sebastien: [
    "on ne comprend pas vraiment ce qui y est dit tant qu'on n'est pas passé par l'expérience",
    "il ne laisse plus l'autre mener l'appel",
  ],
};

/**
 * La page de formation gratuite du hub.
 *
 * Elle reprend le hero de l'accueil, dont le titre et le résumé viennent
 * d'`identite` et ne sont pas réécrits : c'est la même promesse, et la
 * reformuler pour le hub reviendrait à en avoir deux.
 *
 * Seuls le titre d'onglet et la description sont propres à cette page, un
 * `title` s'affichant dans une liste de résultats et une `description` devant
 * décrire la page et non le site. Ils sont sans effet sur le référencement,
 * le hub étant interdit d'index, mais ils s'affichent dans l'onglet et dans un
 * aperçu de partage.
 */
export const formationHub = {
  titrePage: "La formation gratuite",
  description:
    "La vidéo de formation gratuite de Funnels Club, en entier : la mécanique du tunnel de vente, expliquée étape par étape par Rémy Jupille.",
  /**
   * Le sous-titre, **réécrit pour le hub**.
   *
   * Celui du site, `identite.resume`, annonce « du lancement jusqu'à 6 ou
   * 7 chiffres par an ». C'est une promesse de revenus chiffrée, posée en gros
   * sous le titre d'une page de publicité : exactement ce que les règles de
   * Meta refusent, et le contrôle de `lib/hub.ts` le rejette d'ailleurs au
   * build, le mot « chiffres » étant ici une unité monétaire déguisée.
   *
   * **C'est la phrase d'origine, moins son chiffre**, et rien d'autre. Une
   * première version la remplaçait par une description de ce que la vidéo
   * contient : Rémy l'a trouvée dénaturée, et il a raison. L'originale dit ce
   * que Funnels Club fait pour quelqu'un, « nous vous accompagnons… du
   * lancement jusqu'à… », et c'est cette orientation qui compte. Ce qui n'est
   * pas publiable, c'est la destination chiffrée, pas la promesse
   * d'accompagnement : seule la fin de la phrase change.
   */
  resume:
    "Nous vous accompagnons à travers toutes les étapes de votre business de formation, du lancement jusqu'à son développement.",
  /** L'entrée en tête du menu, mise en avant. */
  libelleMenu: "La formation gratuite",
  ligneMenu: "La vidéo qui explique la mécanique, en entier",
};

/**
 * La lettre de Rémy, dans sa version de hub.
 *
 * **Cinq passages changent, et aucun autre.** Ils ont été relevés en relisant
 * la lettre avec les règles publicitaires en main, puis soumis à Rémy, qui a
 * demandé de les corriger. Le site principal, lui, n'est pas touché : sa lettre
 * reste mot pour mot celle qu'il a écrite.
 *
 * 1. **« des résultats réguliers et prévisibles »** était le passage le plus
 *    exposé de toute la page, plus que les montants qu'on avait retirés : Meta
 *    vise explicitement les offres qui promettent un résultat prévisible ou
 *    garanti. La phrase parle désormais de la méthode et non du résultat.
 * 2. **« sur lequel toute une vie peut reposer »** est une promesse de vie,
 *    invérifiable par construction.
 * 3. **« plus de 1 000 business »** n'est pas une promesse de gain, mais c'est
 *    une allégation chiffrée qu'il faudrait pouvoir prouver, et elle vieillit
 *    au premier client suivant. C'est aussi la règle du dépôt sur les textes
 *    qui comptent leurs éléments.
 * 4. **Deux absolus invérifiables**, « les sites internet ne fonctionnent
 *    plus » et « vous n'obtiendrez jamais aucun client ». Le droit de la
 *    consommation traite une affirmation catégorique comme une allégation à
 *    prouver ; la version adoucie garde la force du propos.
 * 5. **« très bien vivre de vos connaissances »**, en première phrase,
 *    orientait toute la lettre vers le revenu. « vivre » suffit à dire la même
 *    chose.
 *
 * Le montant de `suite` était déjà corrigé avant cette passe : des clients
 * « capables de payer jusqu'à plusieurs milliers d'euros » est une promesse de
 * revenus, et le contrôle de `lib/hub.ts` la rejetait au build.
 *
 * **L'objet est construit par étalement plutôt que recopié.** La lettre a une
 * quinzaine de champs et le site continuera de la retoucher : une copie
 * complète divergerait en silence, alors qu'ici tout ce qui n'est pas nommé
 * suit l'original.
 */
export const messageRemyHub: ContenuMessage = {
  ...messageRemy,

  amorceVoies:
    "Si vous voulez vivre de vos connaissances ou de vos compétences en ligne, vous avez aujourd'hui trois façons de le faire.",

  erreurs: [
    {
      ...messageRemy.erreurs[0]!,
      texte:
        "Aujourd'hui, les sites internet ne suffisent plus (sauf si c'est une vitrine dont vous avez besoin). Si votre objectif est d'obtenir des clients, c'est un tunnel de vente qu'il vous faut à la place.",
    },
    messageRemy.erreurs[1]!,
    {
      ...messageRemy.erreurs[2]!,
      texte:
        "Sans le bon tunnel, peu importe les efforts que vous ferez pour amener du trafic vers vos offres : vous aurez beaucoup de mal à transformer ce trafic en clients.",
    },
  ],

  valeurs: {
    ...messageRemy.valeurs,
    souligneBis: "simple",
    liaison: " et ",
    souligneTer: "répétable",
    apres:
      ". On ne cherche pas à faire un coup. On veut un business qui se construit dans la durée, sur des étapes qu'on peut refaire. Parce que quoi de plus stressant qu'un chiffre d'affaires en montagnes russes ?",
  },

  deploiement: {
    ...messageRemy.deploiement,
    souligne: "des centaines de business",
  },

  suite: [
    "Ce qui est sûr, c'est que, peu importe le domaine dans lequel vous souhaitez monétiser votre expertise, ce tunnel de vente pourra s'adapter pour vous apporter des clients qualifiés, vraiment intéressés par vos conseils.",
  ],
};
