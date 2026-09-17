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

/** Le titre d'accueil de la page, et ses trois points. */
export const plateformeImmersion = {
  /* Dicté par Rémy, en remplacement de « Présentation de la plateforme de
     formation », qui était relevé sur la page source, puis de deux essais plus
     longs qu'il a écartés.

     Un seul segment, donc une seule ligne : « Immersion Funnels Club » tient
     partout, y compris à 375 px, et n'a plus besoin qu'on décide de sa
     coupure. Le tableau reste un tableau pour que le jour où un titre demande
     deux lignes, il suffise d'ajouter un second segment. */
  titre: ["Immersion Funnels Club"],
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
 * **`chiffre` s'écrit en chiffres**, sur demande de Rémy : « 15 clients » et
 * non « Quinze clients ». C'est la seule retouche à la coupe : l'accroche de
 * `temoignages` écrit le nombre en lettres, ce qui se lit bien dans une phrase
 * et mal dans un chiffre affiché en gros.
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
    chiffre: "15 clients",
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
  /* **Le titre de la page source est coupé en deux**, sur demande de Rémy :
     « Extrait de formation » devient une étiquette en pilule, et ce qui suit
     devient le titre. Aucun mot n'est ajouté ni retiré, seul le deux-points
     disparaît avec la coupe. */
  etiquette: "Extrait de formation",
  titre: "Présentation du modèle de Funnels.Club",
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
 * **Les vingt-deux et non les quatorze de la page source**, sur décision de
 * Rémy. Cinq manquaient simplement, sa page ClickFunnels étant en retard ; les
 * trois autres sont des **seconds entretiens**, enregistrés un an et demi après
 * le premier.
 *
 * **Ces trois-là parlent du mastermind de bout en bout**, huit à neuf fois
 * chacun, et le disent dès leur chapô. Le mastermind est en pause, remplacé par
 * le consulting privé : la règle du dépôt veut qu'une page d'avis ne laisse pas
 * croire qu'on peut encore rejoindre un programme arrêté. Le risque a été posé
 * à Rémy, qui a tranché pour les garder ; ce sont aussi les résultats les plus
 * forts de la liste. Le jour où le mastermind rouvre, la question disparaît.
 *
 * **Sébastien fait doublon avec l'extrait de coaching de la page.** Ce sont deux
 * médias Wistia distincts, 438 et 456 secondes, mais c'est le même moment : il
 * prend le micro pendant un coaching de groupe pour annoncer son meilleur mois,
 * et son propre chapô le dit. À trancher par Rémy : garder les deux, ou retirer
 * l'un des deux.
 *
 * **On ne nomme que les identifiants.** Le nom, l'accroche, la durée et
 * l'affiche sont lus dans `temoignages` ; le lien vers l'entretien complet est
 * lu dans `avis`. C'est ce qui garantit qu'une correction faite là-bas se voit
 * ici, et qu'un entretien ne puisse pas porter deux accroches différentes sur
 * deux pages du même site.
 */
export const entretiensImmersion = [
  /* Les quatorze de la page source, dans son ordre, avec les seconds entretiens
     glissés juste après le premier de la même personne. */
  "rgio4y4o8f", // Roland
  "i8j0mw0ddt", // Roland, un an et demi après
  "j0vbkt570k", // Christian
  "f2ie1v99b8", // Patrick
  "gcfo8miafe", // Guy
  "2vtsinplyx", // Augustin
  "4lkp9f6lm4", // Valérie
  "brvvtbkmfo", // Joël
  "vtfaka0m80", // Olga
  "abj3v8v8ek", // Mathieu
  "ive07co9xm", // Cédric
  "tvy3jbhml9", // Charlotte
  "2xege6bt0u", // Yannick et Sylvie
  "s3npr5izhy", // Tatiana
  "b5taio9plc", // François
  "755btwnbr4", // François, neuf mois après

  /* Ceux que la page source ne montrait pas : elle était en retard. */
  "fbtr4dqoji", // Sandrine
  "rtil6qeznq", // Jérémy
  "iy3jgcijgu", // Corentin
  "1db8el08jl", // Corentin, un an et demi après
  "9a6g6hsyzp", // Lilian
  "8de9q4ed4l", // Sébastien
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
 * **Fabri Keutcha a son portrait, pris sur Calendly**, sur indication de Rémy :
 * c'est son avatar de `fabri@funnels.club` dans l'organisation Funnels Club,
 * donc une photo qu'il a lui-même posée, et non un visage trouvé ailleurs.
 *
 * **Son rôle, lui, reste vide, et rien n'est inventé pour le remplir.**
 * Calendly ne porte pas d'intitulé de poste, et la page source ne le montrait
 * pas. Un emplacement visible sous la rangée le dit, comme le veut la règle :
 * une section sans texte dit ce qu'elle attend, elle n'affiche pas une phrase
 * plausible. « Coach », « closer » ou « responsable » seraient tous
 * vraisemblables, et c'est précisément le problème.
 *
 * Les photos sont servies par nous et non par ClickFunnels : une page qui
 * charge ses portraits sur un CDN tiers fait payer à chaque visiteur une
 * résolution DNS et une poignée de main de plus, pour des fichiers qui ne
 * changent jamais. Elles sont carrées, ramenées à 500 px et compressées.
 */
export const equipeImmersion: {
  titre: string;
  /** `photo` et `role` sont nullables **exprès** : c'est ce qui garde vivante
      la carte à initiales de `RangeeEquipe`. Sans cette annotation, `as const`
      fige le type sur les cinq valeurs du jour, la branche « sans portrait »
      devient inatteignable, et la personne suivante qui arrive sans photo
      casserait la compilation au lieu d'afficher son initiale. */
  membres: readonly { nom: string; role: string | null; photo: string | null }[];
  manquant: string;
} = {
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
      nom: "Fabri Keutcha",
      role: null,
      photo: "/immersion/equipe-fabri-keutcha.jpg",
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
    "l'intitulé du poste de Fabri Keutcha. Son portrait vient de Calendly, le reste de la rangée est complet.",
};
