import { avecTag } from "@/contenu/site";

/**
 * La page de recrutement, `/recrutement`.
 *
 * **Le texte est l'annonce de Rémy**, collée par lui, et elle n'a subi que trois
 * changements, tous dictés :
 *
 * - **« closer » devient « représentant des ventes »**, partout où le mot
 *   désigne le poste ou la personne. « Closing » reste dans « formation exclusive
 *   au closing » : c'est le nom d'une compétence, pas celui du poste.
 * - **Le Mastermind sort de l'annonce.** Il est en pause, remplacé par le
 *   consulting privé, et une annonce qui ferait vendre un programme arrêté
 *   recruterait quelqu'un pour vendre ce qui n'existe plus. Le nom du consulting
 *   est celui des offres de `site.ts`.
 * - **« résultats concrets » mène aux résultats**, dans un nouvel onglet, sur
 *   demande de Rémy : un candidat qui lit l'annonce ne doit pas la perdre.
 *
 * Les surlignages suivent la lettre de l'accueil, et leurs couleurs y disent
 * déjà la même chose : le jaune pour ce que l'équipe offre, le vert pour ce que
 * le candidat cherche, le rouge pour ce qui est exigé. Chaque passage surligné
 * est une sous-chaîne exacte de sa phrase, `surligner` le vérifie en ne posant
 * rien s'il ne la retrouve pas.
 *
 * **Écrit par l'agent, à valider par Rémy** : le `h1`, la description des
 * métadonnées et le titre de la section du témoignage. Tout le reste est à lui.
 */
export const recrutement = {
  /* Le titre de l'onglet reste court : le gabarit ajoute « · Rémy Jupille ». */
  titrePage: "Recrutement",
  description:
    "Funnels Club recrute un représentant des ventes : coaching quotidien, formation réservée à l'équipe et rendez-vous entrants de prospects qualifiés.",

  surtitre: "Recrutement",
  titre: "Représentant des ventes",

  /* L'introduction. Le paragraphe de la mission est découpé autour de son lien,
     comme la conclusion de la lettre de l'accueil : l'ancre reste dans sa
     phrase, et `TexteLie` n'ouvre pas de nouvel onglet pour une adresse
     interne, ce que Rémy demande ici. */
  introduction: [
    {
      texte:
        "Actuellement en pleine croissance, nous cherchons à étendre notre équipe et, en tant que représentant des ventes, vous jouerez un rôle essentiel dans la conversion de nos prospects en clients pour nos programmes d'accompagnement : le Funnels Club et le consulting privé avec Rémy. Vous serez le premier point de contact pour nos clients potentiels, assurant la transmission de nos valeurs et contribuant à l'expansion de la marque Funnels.club.",
      surligne: ["représentant des ventes"],
    },
    {
      texte:
        "Chez Jupille Group LTD, nous visons l'excellence dans l'accompagnement et la satisfaction client. L'éthique est notre plus forte valeur, notamment en n'acceptant dans nos programmes que les personnes dont nous sommes certains de pouvoir faire réussir. Nous cherchons à créer une équipe fidèle, soudée où tout le monde peut partager ses idées et s'exprimer.",
      surligne: ["L'éthique est notre plus forte valeur"],
    },
  ],
  mission: {
    avant:
      "Votre mission, en tant que représentant des ventes, sera de guider les prospects dans leur réflexion et leur prise de décision, en mettant en avant comment nos solutions peuvent transformer leur parcours entrepreneurial. Chaque interaction sera une opportunité de montrer notre engagement envers des ",
    lien: "résultats concrets",
    href: "/resultats",
    apres:
      " et d'aider des centaines d'entrepreneurs chaque année à bâtir leur réussite en ligne.",
  },
  invitation:
    "Si vous êtes motivé à faire la différence et à participer à notre croissance, nous avons hâte de voir l'impact que vous apporterez à notre équipe.",

  offre: {
    titre: "Ce que nous offrons",
    points: [
      {
        texte: "Coaching quotidien avec notre responsable des ventes",
        surligne: "Coaching quotidien",
      },
      {
        texte: "Formation exclusive au closing réservée à l'équipe",
        surligne: "Formation exclusive",
      },
      {
        texte: "Un système de commission parmi les plus avantageux du marché",
        surligne: "système de commission",
      },
      {
        texte:
          "Possibilités de prendre de plus grandes responsabilités à l'avenir",
        surligne: "plus grandes responsabilités",
      },
    ],
  },

  profil: {
    titre: "Pour qui est ce poste",
    points: [
      {
        texte:
          "Vous souhaitez gagner votre vie depuis n'importe où dans le monde.",
        surligne: "depuis n'importe où dans le monde",
      },
      {
        texte:
          "Vous souhaitez avoir un impact sur le succès d'entrepreneurs en francophonie.",
        surligne: "avoir un impact",
      },
      {
        texte:
          "Vous souhaitez avoir jusqu'à 6 rendez-vous entrants chaque jour de prospects qualifiés.",
        surligne: "rendez-vous entrants",
      },
      {
        texte:
          "Vous ne souhaitez PAS faire de prospection téléphonique à froid.",
        surligne: "PAS faire de prospection téléphonique à froid",
      },
      {
        texte:
          "Vous souhaitez être fier du programme que vous vendez (résultats, satisfaction, pas de remboursement) et êtes convaincu qu'il s'agit de la meilleure décision de le rejoindre.",
        surligne: "être fier du programme que vous vendez",
      },
      {
        texte:
          "Vous souhaitez faire partie d'une équipe bienveillante, soudée et qui s'encourage.",
        surligne: "équipe bienveillante",
      },
      {
        texte:
          "Vous souhaitez rejoindre une équipe structurée, avec des scripts, processus et une bonne organisation.",
        surligne: "équipe structurée",
      },
      {
        texte:
          "Vous souhaitez être en contact constant avec un représentant des ventes expérimenté pour vous améliorer.",
        surligne: "représentant des ventes expérimenté",
      },
    ],
  },

  /* Les exigences suivent le patron des erreurs de l'accueil : une première
     phrase surlignée en rouge, puis sa suite au corps du texte. */
  exigences: {
    titre: "Exigences",
    points: [
      {
        titre: "Vous devez être une personne positive et loyale.",
        texte:
          "Nous cherchons une collaboration à long terme de minimum 3 à 5 ans dans l'équipe. Si vous ne souhaitez pas une mission à plein temps, ne postulez pas.",
      },
      {
        titre: "Vous devez être un(e) bon(ne) communicant(e) :",
        texte: "aimable, authentique, sympathique.",
      },
      {
        titre: "Vous devez être méthodique.",
        texte: "Si vous n'aimez pas la routine, ce poste n'est PAS pour vous.",
      },
      {
        titre:
          "Vous devez être disponible au minimum 5 jours par semaine à partir de 8h",
        texte:
          "pour prendre des rendez-vous, répondre aux clients et participer aux séances de coaching d'équipe.",
      },
      {
        titre:
          "Vous devez être intègre et savoir dire non si quelqu'un n'est pas un bon candidat.",
        texte: "",
      },
      {
        titre:
          "Vous devez être coachable et savoir vous remettre en question :",
        texte:
          "savoir mettre votre ego de côté, écouter les conseils des autres et appliquer à la lettre les recommandations.",
      },
    ],
  },

  salaire: {
    titre: "Salaire",
    texte:
      "Payé à la commission uniquement. Les détails vous seront expliqués lors de votre entretien.",
  },

  /* Le formulaire de candidature, fourni par Rémy. Il est à lui, donc il porte
     la balise de provenance comme tout autre lien vers ses propriétés. */
  postuler: {
    libelle: "Postuler",
    /* Le libellé visible est court ; cette suite, masquée à l'écran, le
       complète pour dire où le lien mène. Elle commence par une espace. */
    suite: " au poste de représentant des ventes",
    href: avecTag("https://form.funnels.club/recrutement"),
  },

  /* Le témoignage de Geoffrey, de l'équipe.

     **L'identifiant Wistia manque.** Ni les titres ni les transcriptions du
     compte ne le font apparaître : la vidéo n'est peut-être pas transcrite, ou
     porte un nom qu'aucune recherche n'a deviné. Tant qu'il est `null`, la
     section affiche un emplacement, et le jour où il arrive, il faut aussi
     l'affiche et la date de mise en ligne pour le `VideoObject`. */
  temoignage: {
    titre: "Le témoignage de Geoffrey, de l'équipe",
    wistia: null as string | null,
    attendu:
      "l'entretien de Geoffrey sur ses résultats en tant que représentant des ventes (identifiant Wistia à fournir)",
  },
} as const;
