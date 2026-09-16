/**
 * Le texte de la page d'immersion.
 *
 * **Tout ce qui suit est écrit par Rémy**, relevé mot pour mot sur
 * `www.funnels.club/inside-formateurs`, la page ClickFunnels que celle-ci
 * remplace. Rien n'y est reformulé : ni un titre, ni une accroche, ni une
 * citation de client. La règle du dépôt vaut ici comme ailleurs, et elle vaut
 * d'autant plus que la moitié de ces phrases sont la parole de vraies
 * personnes.
 *
 * Ce qui n'a pas été repris, et pourquoi :
 *
 * - **Les quatorze entretiens ne sont pas décrits ici.** Ils vivent déjà dans
 *   `temoignages` (`site.ts`) et dans `avis.ts`, avec leur affiche, leur durée
 *   et leur accroche, toutes relues. Les redécrire reviendrait à créer une
 *   seconde source qui divergerait à la première correction. La page les lit
 *   là où ils sont : `entretiensImmersion` ne fait que nommer lesquels, dans
 *   quel ordre.
 * - **Les deux liens légaux du pied de page** viennent du pied de page du
 *   site, qui est déjà posé par le gabarit racine.
 */

import { avecTag } from "./site";

/** L'identité de la page, pour l'onglet et le partage. */
export const identiteImmersion = {
  /* Le titre d'onglet est court : les résultats de recherche coupent autour de
     soixante caractères, et le gabarit y ajoute encore « · Rémy Jupille ». La
     page est interdite d'index, mais le titre s'affiche aussi dans l'onglet du
     navigateur et dans l'aperçu d'un lien collé dans une conversation. */
  titrePage: "Page d'immersion Funnels Club",
  description:
    "La plateforme, le modèle, les coachings hebdomadaires et les entretiens des membres que nous avons accompagnés à développer leur offre digitale.",
} as const;

/**
 * Les quatre ancres du haut.
 *
 * Ce sont des liens internes vers des sections de la même page, donc de vrais
 * `a href="#…"` : ce qui navigue est un lien.
 *
 * **Chaque entrée désigne une section qui existe.** C'est la seule contrainte
 * qu'on s'impose sur ce menu : une ancre vers une section absente est une cible
 * qui ne mène nulle part, que le clavier atteint quand même. « Stratégie »
 * désigne donc le modèle, et « Équipe » s'ajoute au menu de la page source,
 * dont la section d'équipe était masquée et que Rémy remet.
 */
export const ancresImmersion = [
  { id: "programme", libelle: "Programme" },
  { id: "strategie", libelle: "Stratégie" },
  { id: "coaching", libelle: "Coaching" },
  { id: "avis", libelle: "Avis" },
  { id: "equipe", libelle: "Équipe" },
] as const;

/** « Présentation de la plateforme de formation », et ses trois points. */
export const plateformeImmersion = {
  titre: "Présentation de la plateforme de formation",
  points: ["Votre espace privé", "Fiche de cours", "Groupe d'entraide"],
  video: {
    id: "xs24rsgnuy",
    /* Le titre de l'iframe décrit la vidéo et non le lecteur. */
    titre: "Présentation de la plateforme de formation Funnels Club",
    secondes: 1581,
  },
} as const;

/**
 * Les trois témoignages courts, juste sous la vidéo.
 *
 * **Le nom, le métier et la citation sont relevés sur la page source.** La
 * ligne du bas, elle, n'est pas recopiée : c'est l'accroche déjà écrite dans
 * `temoignages`, retrouvée par l'identifiant Wistia. Elle est donc déjà relue,
 * et chaque chiffre qu'elle porte est prononcé dans l'entretien.
 *
 * **`chiffre` et `legende` ne sont pas écrits, ils sont coupés.** La carte
 * relevée chez TrendTrack finit par un résultat en gros et sa légende en
 * petit ; nos accroches sont des phrases. Les deux champs sont donc la même
 * accroche que porte `temoignages`, coupée en deux aux mots près : « 109 778 € »
 * et « en six mois » sortent de « 109 778 € en six mois en formant les
 * entreprises du bâtiment ». Aucun mot n'est ajouté, aucun chiffre recalculé.
 * Si Rémy veut couper ailleurs, c'est ici que ça se décide.
 *
 * **Pas de champ qui désigne une page de `/resultats`.** La carte renvoie au
 * lecteur de la personne, plus bas sur cette page, par `ancreEntretien` et son
 * identifiant Wistia : c'est la règle du tunnel, on n'en sort pas. Une seconde
 * écriture de la destination aurait fini par pointer ailleurs que l'ancre.
 */
export const temoignagesImmersion = [
  {
    id: "rgio4y4o8f",
    nom: "Roland Buffet",
    metier: "Formateur dans le bâtiment",
    citation:
      "C'est incroyable comme c'est mathématique [...]. Je suis épaté par leur capacité à accompagner.",
    portrait: "/immersion/temoignage-roland-buffet.jpg",
    chiffre: "109 778 €",
    legende: "en six mois",
  },
  {
    id: "4lkp9f6lm4",
    nom: "Valérie Di Falco",
    metier: "Psychologue clinicienne",
    citation:
      "C'est l'explosion, j'ai presque doublé mon nombre de client.",
    portrait: "/immersion/temoignage-valerie-di-falco.jpg",
    chiffre: "Quinze clients",
    legende: "par mois",
  },
  {
    id: "j0vbkt570k",
    nom: "Christian Joyce",
    metier: "Formateur en société de nettoyage",
    citation:
      "Grâce à Rémy, j'ai pu réaliser plus de 160'000€ en commençant de zéro.",
    portrait: "/immersion/temoignage-christian-joyce.jpg",
    chiffre: "160 000 €",
    legende: "en quatre mois",
  },
] as const;

/**
 * « Extrait de Formation : présentation du modèle de Funnels Club ».
 *
 * **Elle est bien sur la page source, et je l'avais retirée à tort.** Mon
 * relevé de visibilité la donnait affichée ; je l'ai enlevée sur une consigne,
 * puis Rémy a montré sa capture d'écran, où elle est là avec sa vidéo d'une
 * heure vingt-six et ses deux liens. Elle revient telle quelle.
 *
 * `docs.funnels.club` est une propriété de Rémy : le lien porte donc sa balise
 * de provenance, posée par `avecTag` et jamais à la main. Miro n'en est pas une
 * et Hyros ne le suit pas : pas de balise, comme les chaînes YouTube ailleurs
 * sur le site, et l'exception se justifie ici.
 */
export const modeleImmersion = {
  titre: "Extrait de formation : présentation du modèle de Funnels Club",
  video: {
    id: "wgtwixbfof",
    /* Le titre de l'iframe décrit la vidéo et non le lecteur. */
    titre: "Extrait de formation : le modèle de Funnels Club",
    secondes: 5189,
  },
  ressources: [
    {
      libelle: "Fiche modèle de Funnels Club",
      action: "Cliquez ici pour accéder à la fiche",
      href: avecTag("https://docs.funnels.club/modele"),
    },
    {
      libelle: "Le schéma de la vidéo",
      action: "Ouvrir le tableau",
      href: "https://miro.com/app/board/uXjVIXZgwNE=/",
    },
  ],
} as const;

/** « Extraits de Coaching Funnels Club ». */
export const coachingImmersion = {
  titre: "Extraits de coaching Funnels Club",
  texte:
    "Découvrez par vous-même, comment les coachings hebdomadaires répondront à toutes vos questions actuelles et futures pour développer votre business.",
  extraits: [
    {
      id: "zqgsozxa89",
      titre: "Sébastien partage ses résultats dans un coaching de groupe",
      secondes: 456,
    },
    {
      id: "5o8aqluqeg",
      titre: "Pascal et la construction de son offre",
      secondes: 537,
    },
  ],
} as const;

/**
 * Les entretiens, dans l'ordre de la page source.
 *
 * **On ne nomme que les identifiants.** Le nom, l'accroche, la durée et
 * l'affiche sont lus dans `temoignages` ; le lien vers l'entretien complet est
 * lu dans `avis`. C'est ce qui garantit qu'une correction faite là-bas se voit
 * ici, et qu'un entretien ne puisse pas porter deux accroches différentes sur
 * deux pages du même site.
 */
export const entretiensImmersion = [
  "rgio4y4o8f",
  "j0vbkt570k",
  "f2ie1v99b8",
  "gcfo8miafe",
  "2vtsinplyx",
  "4lkp9f6lm4",
  "brvvtbkmfo",
  "vtfaka0m80",
  "abj3v8v8ek",
  "ive07co9xm",
  "tvy3jbhml9",
  "2xege6bt0u",
  "s3npr5izhy",
  "b5taio9plc",
] as const;

/**
 * L'ancre du lecteur d'un entretien.
 *
 * Elle s'écrit **une seule fois**, ici, parce qu'elle sert à deux endroits qui
 * doivent tomber d'accord : la page, qui la pose sur chaque lecteur, et le pied
 * de page, qui la vise. Les deux l'ont écrite séparément pendant dix minutes,
 * et c'est exactement ce que la règle du dépôt sur les valeurs partagées
 * annonce. Un identifiant Wistia commence parfois par un chiffre, ce qu'un
 * `id` accepte mais qu'un sélecteur CSS refuse : le préfixe le règle au
 * passage.
 */
export const ancreEntretien = (id: string) => `entretien-${id}`;

export const avisImmersion = {
  titre: "Nous les avons accompagnés à développer leur offre digitale",
  sousTitre:
    "Ils ont répondu à nos questions pour vous partager leurs histoires",
} as const;

/**
 * L'équipe.
 *
 * **Cinq personnes et non les sept de la page source**, sur décision de Rémy :
 * la section y était masquée, et il la remet avec l'équipe d'aujourd'hui.
 * Maxime Legros et Kylian Baude en sortent.
 *
 * **Fabri n'a ni photo ni rôle ici, et rien n'est inventé pour lui.** La page
 * source ne le montrait pas, donc ni son portrait ni l'intitulé de son poste
 * n'existent dans ce dépôt. Sa carte porte donc ses initiales et un emplacement
 * visible sous la rangée, comme le veut la règle : une section sans texte dit
 * ce qu'elle attend, elle n'affiche pas une phrase plausible.
 *
 * Les photos sont servies par nous et non par ClickFunnels : une page qui
 * charge ses portraits sur un CDN tiers fait payer à chaque visiteur une
 * résolution DNS et une poignée de main de plus, pour des fichiers qui ne
 * changent jamais. Elles sont carrées, ramenées à 500 px et compressées.
 */
export const equipeImmersion = {
  titre: "L'équipe Funnels Club",
  membres: [
    {
      nom: "Rémy Jupille",
      role: "Fondateur et gérant",
      photo: "/immersion/equipe-remy-jupille.jpg",
    },
    {
      nom: "Geoffrey Bonniot",
      role: "Responsable coaching",
      photo: "/immersion/equipe-geoffrey-bonniot.jpg",
    },
    {
      nom: "Fabri",
      role: null,
      photo: null,
    },
    {
      nom: "Ludivine Ludovic",
      role: "Responsable client",
      photo: "/immersion/equipe-ludivine-ludovic.jpg",
    },
    {
      nom: "Monica Ludovic",
      role: "Production vidéo",
      photo: "/immersion/equipe-monica-ludovic.jpg",
    },
  ],
  /* Ce que la section attend encore, affiché à l'écran tant que ça manque. */
  manquant:
    "le nom complet de Fabri, l'intitulé de son poste et son portrait, au format carré comme les autres.",
} as const;
