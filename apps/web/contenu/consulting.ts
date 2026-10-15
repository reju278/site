import { liens } from "@/contenu/site";

/**
 * La page du consulting privé, `/consulting`.
 *
 * **Le texte est celui de Rémy**, relevé sur la page qu'il a fournie en
 * référence, avec ses marques : les surlignages, l'italique des parenthèses, le
 * gras d'« illimité » et de la durée. Deux retouches seulement, toutes deux
 * typographiques : les guillemets anglais de « one to one » deviennent des
 * guillemets français, comme partout sur le site, et les points de suspension
 * s'écrivent en un seul signe.
 *
 * **La vidéo est l'entretien de Lilian**, le seul témoignage rangé dans la
 * section « Consulting » de Wistia, et celui que le texte cite. Elle est lue
 * dans `avis.ts`, qui porte déjà son titre, sa durée et sa date : les recopier
 * ici ferait deux versions d'un même entretien.
 *
 * Un paragraphe est une suite de segments plutôt qu'une chaîne, parce qu'il
 * porte jusqu'à trois marques différentes : un format à balises demanderait un
 * analyseur, et `TexteLie` refuse exprès le gras et l'italique.
 *
 * **Écrit par l'agent, à valider par Rémy** : le surtitre et la description
 * des métadonnées. Le `h1` est le nom de l'offre, déjà employé partout.
 */

export type Segment =
  | string
  | { texte: string; marque: "surligne" | "gras" | "italique" }
  | { texte: string; href: string };

export const consulting = {
  titrePage: "Consulting privé avec Rémy",
  description:
    "Le consulting privé avec Rémy Jupille : un accompagnement en tête-à-tête sur un ou trois mois, avec accès direct et visioconférences en illimité.",

  surtitre: "Accompagnement privé",
  titre: "Consulting privé avec Rémy",

  /* L'identifiant de l'entretien de Lilian dans `avis.ts`. */
  temoignage: "9a6g6hsyzp",

  paragraphes: [
    [
      "Si comme ",
      /* Le prénom mène à son article : c'est le lien interne qui porte le plus
         de sens ici, et il dit au lecteur où trouver toute son histoire. */
      { texte: "Lilian", href: "/resultats/lilian" },
      ", vous avez envie de travailler en « one to one » avec Rémy, cliquez sur le lien suivant pour prendre rendez-vous avec nous, et savoir si vous êtes éligible à cet accompagnement ultra-personnalisé : ",
      { texte: "Candidature Consulting", href: liens.candidatureConsulting },
    ],
    [
      "Que ce soit pour travailler sur votre ",
      { texte: "système d'acquisition", marque: "surligne" },
      ", votre ",
      { texte: "offre", marque: "surligne" },
      ", la ",
      { texte: "vente", marque: "surligne" },
      ", le ",
      { texte: "recrutement", marque: "surligne" },
      " d'une équipe ou même ",
      { texte: "l'état d'esprit", marque: "surligne" },
      "… Rémy est passé par toutes les étapes qu'il vous faudra franchir pour développer votre business en ligne.",
    ],
    [
      "L'objectif du consulting one-to-one avec Rémy n'est pas de vous donner un plan général, mais que Rémy entre au ",
      { texte: "cœur de votre business", marque: "surligne" },
      ", de votre ",
      { texte: "organisation personnelle", marque: "surligne" },
      ", de vos ",
      { texte: "croyances", marque: "surligne" },
      ", ",
      { texte: "convictions", marque: "surligne" },
      " et ",
      { texte: "valeurs", marque: "surligne" },
      " qui vous sont propres pour définir LES grandes prochaines actions que VOUS devez effectuer pour accélérer.",
    ],
    [
      "C'est l'accompagnement ",
      { texte: "le plus personnalisé que Rémy propose", marque: "surligne" },
      ", où vous avez accès à lui en direct dès que vous en avez besoin ",
      { texte: "(envoi de message, d'audio, de loom, etc.)", marque: "italique" },
      " et où vous pouvez réserver des visioconférences en ",
      { texte: "illimité", marque: "gras" },
      " du lundi au samedi.",
    ],
    [
      "Ce consulting est disponible sur une période ",
      { texte: "d'un mois ou de 3 mois", marque: "gras" },
      " ",
      {
        texte: "(renouvelable si vous le souhaitez, mais sans engagement)",
        marque: "italique",
      },
      ".",
    ],
  ] satisfies readonly (readonly Segment[])[],

  postuler: {
    libelle: "Cliquez ici pour postuler pour un Consulting avec Rémy",
    href: liens.candidatureConsulting,
  },
};
