/**
 * Le texte de la page du témoignage de Roland, `go.funnels.club/roland`.
 *
 * Rémy a demandé une page au dessin de `/thanks`, réduite à l'entretien de
 * Roland Buffet et à un bouton pour réserver un appel.
 *
 * **Le titre, l'alerte et l'identité sont écrits par l'agent**, en
 * s'inspirant de `/thanks`. À valider par Rémy. Ils ne portent aucun montant :
 * le chiffre est dit par Roland dans la vidéo, il n'a pas à être répété en
 * titre d'une page qu'on envoie.
 */

/** L'identité de la page, pour l'onglet et le partage. À valider par Rémy. */
export const identiteRoland = {
  titrePage: "Le témoignage de Roland",
  description:
    "Roland Buffet forme les entreprises du bâtiment. Dans cet entretien vidéo, il raconte comment il a lancé sa formation en ligne avec un tunnel de vente.",
} as const;

export const presentationRoland = {
  titre: [{ texte: "Découvre l'histoire de Roland" }],

  /* L'alerte sous le titre, découpée pour ses marques comme celle de
     `/thanks` : « Important » en tête, la consigne soulignée. */
  alerte: {
    important: "Important",
    avant: " : regarde ",
    consigne: "la vidéo jusqu'au bout",
    apres: " avant de réserver ton appel !",
  },

  /* L'entretien du 30 avril 2024, le premier des deux : celui qui raconte le
     lancement. Mêmes valeurs que dans `site.ts`. */
  video: {
    id: "rgio4y4o8f",
    /* Le titre de l'iframe décrit la vidéo et non le lecteur. */
    titre: "Entretien avec Roland Buffet, formateur pour les entreprises du bâtiment",
    /* 715 secondes, relevées sur l'oEmbed de Wistia. */
    secondes: 715,
  },

  appel: {
    libelle: "Réserver mon appel découverte",
    note: "Gratuit, sans engagement : on regarde ensemble comment appliquer cette méthode à ton projet.",
  },
} as const;
