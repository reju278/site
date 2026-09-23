/**
 * Le texte de la page de préparation. Voir l'issue #4.
 *
 * **Tout ce qui s'affiche dans la page est écrit par Rémy**, relevé mot pour mot
 * sur `www.funnels.club/parfait-confirmation`, la page ClickFunnels que
 * celle-ci remplace. Rien n'y est reformulé.
 *
 * **Deux exceptions, écrites par l'agent et à valider par Rémy** : le titre
 * d'onglet et la description, que la page source n'a pas sous une forme
 * utilisable. Son titre d'onglet est la phrase du `h1` entière, cent
 * caractères, qu'un onglet coupe au milieu d'un mot.
 *
 * Ce qui n'est pas ici, et pourquoi :
 *
 * - **Les entretiens.** La page source en montre quatorze ; la galerie est celle
 *   d'`/immersion`, qui en montre vingt-deux, lus dans `entretiensImmersion`.
 *   C'est la même zone, copiée telle quelle sur demande de Rémy, et les
 *   quatorze de la page source y sont tous, vérifiés identifiant par
 *   identifiant, sa page ClickFunnels étant en retard. Une seconde liste
 *   divergerait de la première à la première correction.
 * - **Le titre et le sous-titre des entretiens, et l'équipe.** Ce sont ceux
 *   d'`/immersion` : `avisImmersion`, identique mot pour mot à la page source,
 *   et `equipeImmersion`.
 */

/** L'identité de la page, pour l'onglet et le partage. À valider par Rémy. */
export const identitePreparation = {
  titrePage: "Préparer votre rendez-vous",
  description:
    "Regardez attentivement cette vidéo pour préparer au mieux votre rendez-vous, puis découvrez les histoires des membres que nous avons accompagnés.",
} as const;

/**
 * Les sections que désigne la capsule de l'en-tête. Chaque entrée désigne une
 * section de cette page, et aucune autre.
 */
export const ancresPreparation = [
  { id: "presentation", libelle: "Présentation" },
  { id: "avis", libelle: "Avis" },
  { id: "equipe", libelle: "Équipe" },
] as const;

export const presentationPreparation = {
  /* La bande du haut de la page source, posée en gélule au-dessus du titre. */
  bande:
    "Regardez attentivement cette vidéo pour préparer au mieux votre rendez-vous.",
  /* **Deux segments, donc deux lignes.** La coupe est celle de l'agent, à la
     virgule près : aucun mot n'est touché, seul l'endroit où la phrase passe à
     la ligne est décidé. Rémy tranche s'il la veut ailleurs. */
  titre: [
    "Présentation du parfait tunnel de vente*",
    "pour vendre une formation en ligne, du coaching ou du consulting",
  ],
  note: "*La même stratégie que nous appliquons et enseignons aux membres de Funnels Club",
  video: {
    id: "775nifg0kr",
    /* Le titre de l'iframe décrit la vidéo et non le lecteur. */
    titre: "Présentation du parfait tunnel de vente",
    /* 1 842 secondes, relevées sur l'oEmbed de Wistia. */
    secondes: 1842,
  },
} as const;
