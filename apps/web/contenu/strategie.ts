/**
 * Le texte de la page de stratégie, `go.funnels.club/strategie`.
 *
 * On y arrive par l'e-mail S25 de la séquence ClickFunnels, « Présentation de
 * la stratégie de Funnels Club », qui menait à `remy-jupille.com/stratégie`,
 * une page disparue. Rémy a demandé une page neuve : la vidéo, dans le dessin
 * d'`/immersion`, et un seul bouton dessous pour réserver un appel.
 *
 * **Le titre, le sous-titre et l'identité sont écrits par l'agent**, d'après
 * l'e-mail qui y mène (« une nouvelle vidéo de 15 min qui présente en détail la
 * stratégie que j'applique dans mon business, et celui de mes clients »). À
 * valider par Rémy.
 */

/** L'identité de la page, pour l'onglet et le partage. */
export const identiteStrategie = {
  titrePage: "La stratégie de Funnels Club",
  description:
    "En quinze minutes, la stratégie que Rémy Jupille applique dans son business et celui de ses clients pour vendre une formation en ligne à plus de 6 chiffres par an.",
} as const;

export const presentationStrategie = {
  titre: [{ texte: "La stratégie de Funnels Club" }],
  sousTitre:
    "Les étapes du parfait tunnel de vente, et comment les reproduire dans ton business, même si tu démarres de zéro",
  video: {
    id: "jbpgn1xi42",
    /* Le titre de l'iframe décrit la vidéo et non le lecteur. Celui de Wistia. */
    titre: "Stratégie de Funnels Club",
    /* 921 secondes, relevées sur l'oEmbed de Wistia. */
    secondes: 921,
  },
  appel: {
    libelle: "Réserver mon appel découverte",
    note: "Gratuit, sans engagement : on regarde ensemble comment appliquer cette stratégie à ton projet.",
  },
} as const;
