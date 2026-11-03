import { avecTag } from "@/contenu/site";

/**
 * Le texte de `go.funnels.club/prochaine-etape`, la page où arrive la
 * personne qui a répondu « NON, je n'ai PAS accès aux ressources financières »
 * dans le formulaire d'`/appel`. Elle n'a pas réservé : la page le lui dit, et
 * lui recommande le Funnel Challenge.
 *
 * **L'adresse ne dit rien du refus**, sur demande de Rémy, qui ne voulait pas
 * vexer : « prochaine étape » décrit ce qu'on propose, pas ce qu'on refuse.
 *
 * **Dictés par Rémy** : le titre, le message d'alerte, et la recommandation du
 * challenge (« la première étape pour développer leur business et passer au
 * niveau supérieur », « un tarif imbattable »). **Écrits par l'agent et à
 * valider par Rémy** : le titre d'onglet, la description, le surtitre de la
 * carte, la phrase qui relie ses deux formules, et le libellé du bouton.
 *
 * **Aucun montant**, et pas le prix du challenge : Rémy a dit « imbattable »,
 * pas un chiffre, et un prix écrit ici deviendrait faux au premier changement
 * de sa page de vente.
 */

/** L'identité de la page, pour l'onglet et le partage. À valider par Rémy. */
export const identiteProchaineEtape = {
  titrePage: "Ta prochaine étape",
  description:
    "Ton appel n'a pas été réservé : ce n'est pas encore le bon moment pour rejoindre Funnels Club. Le Funnel Challenge est la première étape que nous recommandons.",
} as const;

export const prochaineEtape = {
  /* Dicté par Rémy : « Ton appel n'a PAS été réservé (prénom) ». Découpé
     pour mettre « PAS » en rouge, comme il l'écrit en capitales. */
  titre: {
    avant: "Ton appel n'a ",
    pas: "PAS",
    apres: " été réservé",
  },
  /* Dicté par Rémy, mot pour mot. */
  alerte:
    "Les réponses à ton formulaire nous montrent que ce n'est pas le bon moment pour toi de rejoindre Funnels Club.",

  challenge: {
    /* À valider par Rémy. */
    surtitre: "Ce que nous te recommandons",
    /* Le nom du produit, tel que sa page l'écrit. */
    nom: "Lancez votre Funnel Challenge",
    /* Les deux formules sont de Rémy ; la phrase qui les porte est de
       l'agent, à valider. */
    texte: {
      avant:
        "C'est ce que nous recommandons aux entrepreneurs dans ta situation : ",
      etape:
        "la première étape pour développer leur business et passer au niveau supérieur",
      milieu: ". ",
      tarif: "Un tarif imbattable",
      apres: ".",
    },
    /* À valider par Rémy. */
    bouton: "Découvrir le Funnel Challenge",
    /* Une propriété de Rémy, suivie par Hyros : la balise de provenance. */
    lien: avecTag("https://challenge.funnels.club"),
    maquette: {
      src: "/challenge/coffret.webp",
      largeur: 720,
      hauteur: 728,
      /* L'image de la page du challenge : le coffret du jour 1, une
         tablette et un téléphone. */
      alt: "Le coffret du Funnel Challenge, jour 1 : faire d'une offre votre arme la plus puissante",
    },
  },
} as const;
