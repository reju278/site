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
  /* **La consigne de la page, en notification**, dictée par Rémy en
     remplacement de la bande de la page source, « Regardez attentivement cette
     vidéo pour préparer au mieux votre rendez-vous. », puis d'un « Très
     important » qu'il a écarté. Voir `ConsigneVideo`. */
  consigne: {
    /* Dicté par Rémy. */
    titre: "⚠️ Préparer votre rendez-vous",
    texte:
      "Il est important de bien visionner cette vidéo avant votre rendez-vous pour que vous ayez toutes les informations et que notre échange soit pertinent. N'hésitez pas à la regarder en accéléré pour gagner du temps.",
    /* **Les passages surlignés, choisis par l'agent** sur demande de Rémy, qui
       n'a pas dit lesquels : à lui de trancher. Chacun est une sous-chaîne
       exacte de `texte`, enveloppée sans être réécrite ; un passage qui ne s'y
       retrouve pas laisse le texte intact. */
    surligne: [
      "bien visionner cette vidéo avant votre rendez-vous",
      "toutes les informations",
      "en accéléré",
    ],
  },
  /* **Le titre et le sous-titre sont coupés là où Rémy l'a dicté.** Sans
     l'astérisque de la page source ni sa surbrillance, ni la note qui
     l'expliquait, « La même stratégie que nous appliquons et enseignons aux
     membres de Funnels Club », retirés par Rémy. */
  titre: [{ texte: "Présentation du parfait tunnel de vente" }],
  /* Dicté par Rémy : « la prestation de service » remplace « le consulting »
     de la page source. */
  sousTitre:
    "Pour vendre une formation en ligne, du coaching ou de la prestation de service",
  video: {
    id: "775nifg0kr",
    /* Le titre de l'iframe décrit la vidéo et non le lecteur. */
    titre: "Présentation du parfait tunnel de vente",
    /* 1 842 secondes, relevées sur l'oEmbed de Wistia. */
    secondes: 1842,
  },
} as const;
