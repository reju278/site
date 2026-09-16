/**
 * Le mur de la communauté : ce que les membres écrivent dans le groupe Circle.
 *
 * **Rien n'est écrit ici, tout est recopié.** Les `paragraphes` sont le post
 * entier, tel que l'API Circle le rend, découpé en paragraphes et rien de plus.
 * Pas un mot ajouté, pas une phrase reformulée, pas une coquille corrigée :
 * « je n'aurai pas conçu » de Guy est son texte, et c'est comme ça qu'il se
 * publie. C'est la règle des transcriptions d'entretien, et pour la même
 * raison : ce sont les mots de vraies personnes.
 *
 * **Le post entier et non un extrait**, sur demande de Rémy. Un extrait oblige
 * à choisir la phrase qui vend le mieux, ce qui est une façon d'écrire à la
 * place de quelqu'un sans en avoir l'air.
 *
 * **Les douze posts sortent d'un parcours des 3 768 posts de la communauté**,
 * pas d'une sélection à l'œil. Les rediffusions et les posts de l'équipe ont
 * été écartés, les 492 récits de membres notés sur l'engagement, les marqueurs
 * de récit et de gratitude, puis les meilleurs relus un par un.
 *
 * **Aucun ne donne le prix de nos offres.** C'était la consigne de Rémy. Les
 * montants qui restent sont ceux que les membres gagnent, jamais ce qu'ils ont
 * payé.
 *
 * **Pas de lien vers le post d'origine**, sur demande de Rémy : le groupe est
 * privé, donc le lien mènerait un visiteur non membre à une page de connexion
 * Circle, c'est-à-dire hors du tunnel et dans une impasse. C'est vérifié, pas
 * supposé : un clic de test a bien atterri sur `login.circle.so`.
 *
 * **Ni étoiles, ni compte de réactions.** La carte relevée chez TrendTrack
 * porte cinq étoiles ; personne ici n'a noté Funnels Club, ce sont des posts de
 * communauté et pas des avis notés, et en afficher serait faire dire à
 * quelqu'un ce qu'il n'a pas dit. Les réactions du post avaient pris cette
 * place, parce qu'elles étaient vraies ; Rémy les a retirées, un nombre de
 * cœurs n'apprenant rien à qui découvre la page.
 *
 * **Le `titre` est un extrait, pas un résumé.** C'est une phrase du post,
 * recopiée mot pour mot et vérifiée contre la source, choisie pour donner envie
 * de lire le reste. Écrire un titre par-dessus le texte de quelqu'un reviendrait
 * à lui prêter une intention.
 *
 * **La `niche` vient du profil Circle de la personne**, son `headline`, et de
 * nulle part ailleurs. Trois membres n'en ont pas renseigné : leur carte
 * n'affiche rien sous leur nom. Deviner « coach » ou « formateur » à la lecture
 * de leur post serait leur inventer un métier. Un `headline` qui ne fait que
 * recopier le nom de la personne est écarté au passage : il n'apprend rien.
 *
 * **Les portraits sont ceux de Circle**, servis par nous : une page qui charge
 * ses avatars sur `app.circle.so` fait payer à chaque visiteur une résolution
 * DNS de plus, et ces adresses sont des redirections signées qui expirent.
 *
 * **`surligne` ne change pas le texte, il le désigne.** Chaque entrée est une
 * sous-chaîne exacte du post, vérifiée par comparaison contre la source, et le
 * rendu ne fait que l'envelopper dans un `mark`. C'est la seule façon de
 * surligner sans réécrire : un passage « mis en avant » qu'on aurait reformulé
 * pour qu'il tienne sur une ligne serait un passage inventé.
 *
 * **À valider par Rémy, personne par personne.** Ces douze-là n'ont pas donné
 * leur accord pour figurer sur une page publique : ils ont écrit dans un groupe
 * privé. Un post de communauté n'est pas un témoignage cédé.
 */
export const murCommunaute: readonly {
  nom: string;
  /** Le métier, lu dans le `headline` du profil Circle. `null` s'il est vide. */
  niche: string | null;
  /** `null` quand Circle ne sert pas de portrait : la carte porte l'initiale. */
  portrait: string | null;
  /** Une phrase du post, mot pour mot, qui sert de titre à la carte. */
  titre: string;
  /** Les passages à surligner dans le corps, sous-chaînes exactes du post. */
  surligne: readonly string[];
  /** Le post entier, paragraphe par paragraphe, mot pour mot. */
  paragraphes: readonly string[];
}[] = [
  {
    nom: "Lilian Céré",
    niche: "Dirigeant d’une agence web spécialisé dans le BTP",
    portrait: "/immersion/communaute/lilian-cere.jpg",
    titre: "Je fais ce post pour ceux qui doutent.",
    surligne: ["j’ai réussi à en signer deux"],
    paragraphes: [
      "Je fais ce post pour ceux qui doutent.",
      "Cette semaine, j’ai closé deux clients. Et si je le partage, ce n’est pas pour me la raconter, mais pour être honnête sur le chemin.",
      "Ça fait longtemps que je travaille le closing. Et clairement, j’y ai pris quelques leçons de vie.",
      "Il y a deux semaines, j’avais un client hyper intéressant. Engagement en visio, échange fluide, tout était validé. Il ne manquait plus qu’une chose : qu’il rentre sa carte.",
      "On a repoussé le paiement à plus tard dans la journée. On n’était plus en visio. Et finalement… il n’a jamais payé.",
      "Sur le moment, j’ai même hésité à poster dans le groupe pour dire que j’avais signé. Et puis je me suis dit : attends qu’il paye. J’ai bien fait. Parce que ce client-là n’a jamais signé.",
      "Et ça m’a rappelé une chose essentielle : le closing, ce n’est pas facile.",
      "Mais quand le travail est fait sérieusement, quand on se fait accompagner, quand on analyse, qu’on corrige et qu’on continue… les choses finissent par s’aligner.",
      "Cette semaine, grâce au travail effectué et à l’accompagnement de Rémy et de toute l’équipe de Funnel Club, j’ai réussi à en signer deux.",
      "Ce que j’en retiens : le closing, ce n’est pas un talent. Ce n’est pas instantané. Et ce n’est clairement pas ce qu’on voit sur les réseaux.",
      "C’est de la progression, de l’entraînement, du volume. Faire des calls. Les réécouter. Analyser ceux qui n’ont pas marché… mais aussi ceux qui ont marché, pour se demander : comment j’aurais pu faire encore mieux ?",
      "C’est juste une question de temps.",
      "Aujourd’hui, je voulais surtout remercier toute l’équipe de Funnel Club ! Parce que je suis encore au début. Et justement… ce n’est que le début. Je compte bien continuer à progresser et tout arracher 🚀",
      "Et pour ceux qui doutent en ce moment, ou qui ont l’impression de stagner : ne perdez pas espoir. Le closing n’est pas une question de chance ni de talent inné. C’est une question de temps, de répétition et d’amélioration continue.",
      "Continuez à faire des calls. Continuez à les analyser. Continuez à progresser.",
      "Le reste finit toujours par suivre.",
    ],
  },
  {
    nom: "Guy Anastaze",
    niche: "Mentor de dirigeants",
    portrait: "/immersion/communaute/guy-anastaze.jpg",
    titre: "un mandat de 125´000 €",
    surligne: ["je n’aurai pas conçu mon offre comme je l’ai faite"],
    paragraphes: [
      "Bonjour à toutes et à tous,",
      "J’ai l’immense plaisir de vous informer qu’un de mes clients a beaucoup aimé le programme de ma formation en ligne que je lui ai présentée, et que je construis grâce à Funnels Club depuis plus d’un an. Il m’a demandé de m’en inspirer pour faire une formation en présentiel pour ses 6 membres du Codir et 6 membres des N—1. (10 jours répartis sur février, mars, avril, juin, septembre 2026).",
      "Résultat : un mandat de 125´000 € avec un acompte de 37’500 € payable maintenant.",
      "Sans Rémy, l’équipe, la communauté et la formation Funnels Club, je n’aurai pas conçu mon offre comme je l’ai faite, et je n’aurais pas eu ce mandat.",
      "Bien que différent de ce que je vise à terme avec ma formation en ligne, cela me montre que des opportunités diverses et fructueuses peuvent surgir grâce à Funnels Club.",
      "Cela me booste pour finir mes modules.",
      "Je suis infiniment reconnaissant à Rémy et à vous tous pour tout ce que vous m’apportez.",
      "Belle journée 🤗",
    ],
  },
  {
    nom: "Corentin Ghisalberti",
    niche: null,
    portrait: "/immersion/communaute/corentin-ghisalberti.jpg",
    titre: "ce n’est pas un sprint, c’est un marathon",
    surligne: ["celle de vivre une vie de liberté"],
    paragraphes: [
      "Salut à tous !",
      "J’espère que vous allez bien 😊",
      "Aujourd’hui, certains de mes clients m’ont remercié pour le travail que je faisais et pour tout ce que j’apportais à leur entreprise au quotidien et ça m’a vraiment fait chaud au cœur.",
      "Je me suis donc dit qu’il fallait aussi que je vous remercie, car je viens tout juste de réserver mon aller simple pour quitter la France. Après 5 ans de travail acharné, c’est un moment très symbolique pour moi.",
      "On a encore beaucoup de chemin à parcourir ensemble pour atteindre nos objectifs, mais j’ai compris une chose essentielle : ce n’est pas un sprint, c’est un marathon.",
      "Derrière nos écrans, on ne mesure pas toujours l’impact que nous avons sur la vie de nos clients, car tout cela reste souvent immatériel. Mais le rêve que je vais pouvoir réaliser cette année, c’est grâce à vous.",
      "J’aurai la chance de passer 4 mois en Asie, entre Bangkok et Kuala Lumpur, avant d’arriver à Abu Dhabi le 13 mars.",
      "Alors merci du fond du cœur à toute l’équipe du Funnel Club @Rémy Jupille @Geoffrey Bonniot et toutes les personnes qui travaillent à vos côtés, car sans vous, tout cela serait sûrement encore loin. Je vais enfin pouvoir honorer la promesse faite à ma femme il y a 5 ans : celle de vivre une vie de liberté.",
      "Merci aussi à @BUFFET Roland, pour ton soutien dans les moments plus difficiles. Je m’en souviendrai, et ma porte sera toujours grande ouverte pour toi — ainsi que pour tous les membres du Mastermind.",
      "(Heureux de vous accueillir si vous passez dans l’un de ces trois pays 🌏)",
      "Je ne suis pas très sentimental, donc je ne vais pas en dire plus, mais sachez que vous avez changé deux vies cette année : la mienne, celle de ma femme… et très bientôt, celles de mes futurs collaborateurs.",
      "🙏 Merci pour tout.",
    ],
  },
  {
    nom: "Mathieu Granchamp",
    niche: null,
    portrait: "/immersion/communaute/mathieu-granchamp.jpg",
    titre: "j’ai officiellement closé ma première cliente",
    surligne: ["cette fameuse “deuxième source de revenus”"],
    paragraphes: [
      "Nous y voilà, hier soir, j’ai officiellement closé ma première cliente ! Quelle joie, quel bonheur !",
      "C’était d’ailleurs un jour symbolique pour plusieurs raisons, et notamment parce que ça faisait exactement 10 mois que j’ai commencé ce projet.",
      "J’ai commencé à bosser dessus dans l’ombre seul et sans stratégie le 9 février 2025 et moins d’un an plus tard, j’ai débloqué cette fameuse “deuxième source de revenus”. A savoir qu’en tant que kiné et ayant déjà beaucoup de charges, je réalise beaucoup de consultations par semaine (45h/semaine), donc tout mon temps libre est allouée à mes objectifs. (Sachant que je forme tous les mois, donc je n’ai même pas fait que FC)",
      "J’ai rejoint FC le 24 août mais j’avais déjà une bonne base (system.io, mon offre pratiquement bouclée, déjà essayé fb ads), cela m’a donné un coup d’accélérateur : 3 mois et demi plus tard, nous y voilà à la première vente.",
      "Un grand merci à tous les coaches et aux membres :",
      "@Rémy Jupille pour FC et la stratégie",
      "@Geoffrey Bonniot pour le dévouement (je me souviens notamment que tu as répondu à la refonte de mon copywriting à 15h un samedi donc si tu étais à Maurice, 19h ?)",
      "@Maxime LEGROS pour les rediff de coaching que j’écoute attentivement",
      "@François DAOUD qui m’a donné envie de commencer à écouter les rediff de closing quand il en avait partagé une ainsi que son témoignage en septembre",
      "@Nicolas Majois ❤️ @Many Soliman ❤️ @Clemence Privé @Olivier CAETANO @Marlyse et Richard de Villeneuve @Laurent et Élisabeth. pour les encouragements et le soutien !",
      "et finalement @Mattys Hamonic !",
      "IMG_4844.mov",
    ],
  },
  {
    nom: "Judith Kamdem Simo",
    niche: null,
    portrait: null,
    titre: "Je ne savais pas encore que je serais la prochaine à écrire le mien.",
    surligne: ["j’ai quitté mon métier et mon gros salaire"],
    paragraphes: [
      "Quand j’ai découvert Funnels Club, je partais vraiment de zéro dans le digital.",
      "J’étais infirmière, je travaillais énormément, toujours des journées de 16 heures, souvent loin de ma famille. Financièrement, je gagnais très bien ma vie — plus de 8 000 $ nets certains mois — mais j’avais l’impression de ne pas avoir de vie. Je voyageais pour travailler, je laissais mes enfants, et au fond de moi je savais que je voulais construire autre chose.",
      "J’étais déjà dans le marketing de réseau, mais je ne savais pas comment vendre mes produits, comment trouver des clients autrement que par la prospection ou le démarchage, ni comment développer réellement mon activité en ligne.",
      "Puis je suis tombée sur une publicité de Rémy.",
      "Je me rappelle encore du déclic. Pendant mon closing, Maxime m’a fait comprendre qu’il était réellement possible de faire venir des clients à soi grâce au digital. Pour moi qui venais du monde traditionnel, ça a complètement changé ma vision.",
      "J’ai payé la formation cash. Je savais que c’était ce que je voulais.",
      "À ce moment-là, je n’avais pourtant pas beaucoup de temps. Quand je travaillais, j’enchaînais mes longues journées. Et pendant mes jours off, je travaillais sur ma formation du matin au soir. Je pouvais m’endormir devant à minuit et me relever à 3 h pour continuer.",
      "Je ratais parfois les coachings en direct, mais je ne ratais pratiquement aucune rediffusion. Je me souviens notamment des heures passées sur la route à écouter les replays de @Maxime LEGROS  sur le closing.",
      "Petit à petit, j’ai commencé à assembler les briques.",
      "J’ai appris à construire mes tunnels.",
      "J’ai appris à lancer mes campagnes publicitaires.",
      "J’ai appris à closer.",
      "J’ai créé mon offre à partir de rien.",
      "Et surtout, j’ai commencé à obtenir mes premiers résultats.",
      "Quand j’ai vu que ça fonctionnait alors que je n’y consacrais encore qu’une partie de mon temps, je me suis posé une question très simple :",
      "“Si ça fonctionne à 30 ou 40 %, qu’est-ce qui peut se passer si je m’y mets à 100 % ?”",
      "C’est là que j’ai pris une décision qui aurait été inimaginable pour moi auparavant : j’ai quitté mon métier et mon gros salaire pour me consacrer entièrement à ce que j’étais en train de construire.",
      "Tout n’a pas été facile. Il y a eu du stress, des périodes de doute, des choses à ajuster. Mais j’avais appris une phrase que je n’ai jamais oubliée :",
      "““Faire plus de ce qui marche et moins de ce qui ne marche pas””.",
      "Mes campagnes fonctionnaient, mais je savais qu’il me manquait encore quelque chose pour passer un cap.",
      "C’est là que @Geoffrey Bonniot  est intervenu.",
      "J’hésitais presque à demander autant d’aide, parce que je savais à quel point son temps était précieux. Mais il a accepté de travailler avec moi.",
      "Et là, les choses ont réellement accéléré.",
      "En seulement quelques mois, je suis passée d’environ 5 000 $ de chiffre à plus de 20 000 $, puis aujourd’hui, en plein mois d’août, je suis proche des 50 000 $.",
      "Et quand je regarde tout ça, ce qui me frappe le plus n’est même pas seulement le chiffre.",
      "C’est de me dire qu’une femme qui ne connaissait rien au digital, qui n’avait jamais construit de business en ligne, qui venait d’un métier totalement traditionnel, arrive aujourd’hui à mettre de la nourriture sur la table de sa famille grâce à ce qu’elle a appris à construire sur Internet.",
      "Je crois que ma plus grande leçon, c’est celle-ci :",
      "j’ai compris que je n’avais plus envie de perdre du temps à essayer de tout comprendre seule.",
      "Je préfère investir pour apprendre auprès de personnes qui ont déjà les résultats que je veux atteindre.",
      "Je paierais cher pour ne pas me tromper.",
      "Funnels Club m’a donné cette structure, cette vision et ces compétences que je n’avais pas.",
      "Alors merci @Rémy Jupille.",
      "Merci @Maxime LEGROS  pour toutes ces heures d’enseignement sur le closing.",
      "Et merci infiniment @Geoffrey Bonniot  pour l’accompagnement qui m’a permis de passer un nouveau cap.",
      "Quand je suis arrivée ici, je lisais les témoignages des autres en me demandant si un jour ce serait mon tour.",
      "Je ne savais pas encore que je serais la prochaine à écrire le mien.",
    ],
  },
  {
    nom: "Laëtitia Miroux",
    niche: "Fondatrice Exportateurs Engagés - Méthode structurée, résultats export concrets",
    portrait: "/immersion/communaute/laetitia-miroux.jpg",
    titre: "Ce n’est plus une idée. Ce n’est plus un projet. C’est concret.",
    surligne: ["1h03 de coaching"],
    paragraphes: [
      "@Rémy Jupille - @Geoffrey Bonniot - @Maxime LEGROS - bonsoir à toutes et tous",
      "Ce matin, j’ai donné mon tout premier coaching de groupe dans ma communauté “Les Exportateurs Engagés”.",
      "On est 4 personnes dont 3 membres ! Donc oui, c’est un petit début. Mais c’est un début réel. Et honnêtement, avant de commencer… j’avais les “boules”.",
      "Peur qu’il n’y ait rien à dire. Peur que ce soit vide. Peur que les membres ne parlent pas. Peur de ne pas savoir comment prendre le coaching en main.",
      "C’était mon premier.",
      "Finalement, j’ai structuré la session en trois temps :",
      "Présentation de chacun : pourquoi ils ont rejoint les Exportateurs Engagés et quelles sont leurs problématiques.",
      "Leurs retours sur leurs premières utilisations de mon espace membre.",
      "Leurs questions concrètes sur leurs problématiques actuelles.",
      "Résultat ? 1h03 de coaching et j’ai dû arrêter pour respecter le cadre d’une heure 😃.",
      "Les échanges étaient riches. Il y a eu beaucoup de questions. Les membres ont contribué aux réflexions des autres. On a même défini de futurs sujets que je vais intégrer dans mon espace membre. Et ça, c’est précieux💎.",
      "Je suis encore en offre bêta. Une partie est construite, mais pas tout. Donc leurs retours vont me permettre d’améliorer la plateforme, d’enrichir les contenus et d’ajuster l’offre au plus proche de leurs besoins réels.",
      "Ce matin, j’ai vraiment ressenti ce que ça veut dire : faire vivre un espace membre (même si ce n’est qu’un début). Ce n’est plus une idée. Ce n’est plus un projet. C’est concret. 😱",
      "Je suis très contente aussi de l’état d’esprit des trois premiers membres. Positifs, impliqués, avec une vraie envie d’avancer et de réussir leur projet d’exportation. Je suis donc RAVIE de la sélection de mes membres! Il y avait une vraie bonne ambiance, presque un mini-salon tellement nous étions peu nombreux.",
      "Et je sais que ma façon d’animer va évoluer avec le temps. Comme tout, ça s’apprend, ça se peaufine, ça se structure.",
      "Mais aujourd’hui, c’est une victoire. Une petite victoire peut-être en chiffres. Mais une grande victoire intérieure.",
      "Je souhaite à tous celles et ceux qui sont en train de construire leur offre de vivre ce moment-là. Et je me souhaite à moi-même de continuer, de recruter de nouveaux membres (intéressants, positifs, motivés et percutants) et de faire grandir cette communauté 😌.",
      "J’avance et ça fait plaisir à vivre.",
      "Merci Funnels Club pour le cadre et la méthode 😍.",
    ],
  },
  {
    nom: "Linn",
    niche: "Styliste et  Conseillère en image",
    portrait: "/immersion/communaute/linn.jpg",
    titre: "l’un des meilleurs espaces de formation dans lequel j’ai été",
    surligne: ["2025 = maturation"],
    paragraphes: [
      "Hello à tous et très bonne année !",
      "Je me réveille un peu tard pour un message collectif (on est déjà mi-janvier 😅) mais je tenais vraiment à vous la souhaiter.",
      "Un petit mot aussi pour remercier les coachs : @Rémy Jupille, @Geoffrey Bonniot, @Maxime LEGROS, @Ludivine et  @Kylian Baude  qui m’a closé il y a déjà un moment, même si de base je n’avais pas prévu de commencer tout de suite ( trop de travail avant de vendre) au final c’était une très bonne décision 😄 merci à toi.",
      "Le Funnel Club a vraiment compté dans mon année 2025, même si je ne suis pas très “communauté” de base 😅 team introverti 🤭",
      "J’ai appris beaucoup de choses  sur le business mais aussi sur moi, sur la manière de construire une offre, de structurer un produit, etc.",
      "Je n’ai pas été très active dans les coachings cette année, parce que j’ai passé beaucoup de temps en construction :",
      "– structuration de mon offre",
      "– création d’un book de plus de 100 pages",
      "– 60+ petites vidéos pour mes clientes et mon espace",
      "– définition de ma cible 🎯",
      "– tunnel, hébergement, et début de ma chaîne YouTube",
      "– relance de mon Instagram",
      "Donc 2025 = maturation",
      "2026 = expansion ✨",
      "Pour 2026, objectif : premiers clients et beaucoup d’organique au premier trimestre, puis pub + closing une fois que la machine tourne avant 2027, je l’espère.",
      "J’ai beaucoup écouté les coachings cette année, j’ai l’impression de connaître @Virak CHHUOR, @Sacha COHEN et @Jérôme et @François DAOUD alors qu’on ne s’est jamais parlé 😂 (et @Tatiana Moreau + @Clemence Privé  aussi !)",
      "Merci pour votre bienveillance et votre guidance.",
      "C’est sincèrement l’un des meilleurs espaces de formation dans lequel j’ai été. I swear 🫶🏻",
      "Je vous souhaite une très belle année 2026, pleine  de réussite pro et perso 😄",
      "Au plaisir de vous retrouver dans d’autres contextes cette année ! pleutre dans 2 ou 3 mois , je ne sais pas",
      "Linn",
    ],
  },
  {
    nom: "Cédric Bizet",
    niche: "J'aide les entrepreneurs à se digitaliser.",
    portrait: "/immersion/communaute/cedric-bizet.jpg",
    titre: "je partais de rien, 0 connaissance",
    surligne: ["maintenant je gagne plusieurs milliers d’euros"],
    paragraphes: [
      "Bonjour à toutes et à tous,",
      "Ravi de découvrir cette nouvelle version après quelques mois d’absence..",
      "Je tiens avant tout à vous remercier vous, la superbe équipe de Rémy, c’est vrai qu’on a tendance à l’oublier et à rester la tête dans notre business, notre projet, égoïstement. Mais il faut le souligné vous êtes comme nos grand frères / nos grandes sœur, toujours là pour nous booster quand on a un coup de mou et surtout là pour nous tirer vers le haut dans les moments compliqués. On peut compter sur vous et tout le monde c’est à quel point c’est important.",
      "J’ai lu ta lettre Rémy, et j’ai directement compris de quoi tu parlais, et j’espère que tout le monde réalise à quel point on est bien tombé ici à Funnels club, vous avez un coeur en or et vous mérité qu’on vous le dise plus souvent, MERCI ! J’espère avec ce message vous effacez un peu de cette frustration qui peut venir par moment.. C’est pas toujours évident même pour vous :)",
      "En tout cas, soyez en sur vous faites de l’excellent boulot, c’est grâce à funnels club que j’ai débuté le business, je partais de rien, 0 connaissance, et maintenant je gagne plusieurs milliers d’euros et vous n’y êtes pas pour rien !",
      "Funnels club évolue et à chaque fois de mieux en mieux, hâte de découvrir ces nouvelles vidéos d’état d’esprit.",
      "Et pour les nouveaux membres sachez que funnels club c’est bien plus qu’une communauté, c’est une famille, certes ça a un coût mais les personnes ici sont toutes prêtes à vous aider et à vous propulser vers la réussite, en tout cas si vous avez des questions ou quoique ce soit je serais ravi de vous aider à mon échelle !",
    ],
  },
  {
    nom: "François Daoud",
    niche: "Professeur de guitare",
    portrait: "/immersion/communaute/francois-daoud.jpg",
    titre: "les choses ont complètement explosé cette semaine",
    surligne: ["Et j’ai bien fait."],
    paragraphes: [
      "Bonjour à tous,",
      "Aujourd’hui j’avais envie de vous partager mes aventures depuis quelques mois.",
      "Après un été assez calme et un petit moment de stress cet été, les choses ont complètement explosé cette semaine … et c’est dingue.",
      "Bref, je vous raconte !",
      "Pour recontextualiser l’histoire :",
      "J’ai rejoint le Funnels Club en Avril,",
      "En mai, je lance mon offre premium,",
      "Mon offre est une formation impro guitare semi-professionnalisante.",
      "Déjà au début quand je suis arrivé, quand Rémy m’a parlé de proposer une offre à 2000€ minimum, j’étais un peu décontenancé. Même dans mon école de musique physique où la prestation était assez étoffée je ne proposais pas un tel tarif (plutôt autour de 900€).",
      "Finalement, je me suis exécuté, et j’ai appliqué les conseils du coach.",
      "Dès ce mois de mai, sur 10~15 appels, j’en signe 4.",
      "J’ai trouvé ça dingue, d’autant plus que je facture 2000~2500€ la prestation…",
      "Serait-ce la chance du débutant ?",
      "Ayant une chaine Youtube active depuis 2 ans, je me disais qu’il s’agissait peut-être que des prospects très chauds… Et que ça va se dégonfler…",
      "Le mois de Juin a été moins convaincant, je n’ai signé que 2 personnes sur 22 appels.",
      "Ca reste toutefois ~4ke. Donc c’est chouette, mais il y avait ce petit goût de “zut ! Ca n’a pas fonctionné comme j’espérais, ça s’essouffle déjà!”",
      "Et là, arrivent les mois de Juillet et Aout.",
      "Ce sont 2 mois assez difficiles.",
      "1 signature en Juillet, 1 autre en Aout… et c’est tout. Pourtant 24 appels.",
      "Vers la mi-août, suite à un événement un peu compliqué émotionnellement, j’ai commencé à stresser…",
      "Et mon taux de closing était assez bas…",
      "J’ai expliqué mon point à Geoffrey et Rémy, avec cette envie de casser mes prix pour closer davantage.",
      "Pourquoi casser les prix ?",
      "Parce que je voyais bien que c’était constamment à cette étape là que ça coinçait lors des closings.",
      "Donc, à ce stade là (~20 août), les chiffres disaient :",
      "13% de closing global,",
      "mais toutefois…  6,7% de closing sur les 8 dernières semaines (je parle des 8 semaines qui précédaient le mois d’Août)",
      "2 signatures entre juillet et ~20 aout",
      "l’envie de casser les prix pour les descendre à 1400€ au lieu de 2000€.",
      "Et alors que j’allais basculer, je me suis quand même dit que j’allais en parler aux coachs. Chose que j’ai faite (quand même …)",
      "Et j’ai bien fait.",
      "Rémy et Geoffrey ont attiré mon attention sur plein de petits points, et m’encourageaient à garder le cap même si c’était dur, de ne pas me laisser happer par les émotions (ces fameuses émotions…).",
      "D’ailleurs, ils ont également attiré mon attention sur la période, et sur la fausseté de mon calcul (je regardais les 8 dernières semaines au lieu de regarder les 3~4 derniers mois).",
      "Bref, j’ai joué le jeu jusqu’au bout en me disant qu’il faut suivre les conseils et stratégies des coachs.",
      "Finalement, moins de 10 jours plus tard, la machine s’emballe !",
      "Les résa d’appels pleuvent, et j’en arrivent à aujourd’hui :",
      "J’ai signé 5 personnes en 7 jours (9100€).",
      "J’ai plein d’appels de programmés,",
      "D’autres R2 arrivent,",
      "Nous ne sommes que le 5 septembre,",
      "Et j’ai l’impression qu’atteindre 12 à 20ke ce mois ne sera qu’une formalité !",
      "Bref, je ne m’emballe pas trop, mais je suis passé de 1 mois de tréso à 4 mois ! Là, comme ça, en 1 semaine … C’est juste dingue 🙏🙏🙏",
      "Ca y est, la machine s'emble s’emballer 🚀",
      "Moralité de l’histoire : Les coachs ont toujours raison + il faut garder le cap parce que quand ça s’emballe, ça s’emballe !",
      "Edit à j+2 : +4000€ ! Ce qui amène ce mois de septembre à 13100€… et nous ne sommes que le 06/09. C’est juste dingue ce qui se passe…",
    ],
  },
  {
    nom: "Sacha Cohen",
    niche: "Nettoyage Boost System",
    portrait: "/immersion/communaute/sacha-cohen.jpg",
    titre: "4h après mon post j’ai ma première vraie vente",
    surligne: ["17 réservations rien que pour la 1ère semaine du mois"],
    paragraphes: [
      "Petit post pour donner quelques chiffres. Depuis début août :",
      "17 réservations rien que pour la 1ère semaine du mois (planning full 😬)",
      "j’ai pour le moment fait 2 stratégies",
      "2 ventes… enfin pas vraiment, des dépôts de 50€ 😅😅",
      "Je suis content et frustré en même temps haha…",
      "Je ne sais pas vraiment si les dépôts vont tenir vers la vente finale ou être remboursés mais ça fait plaisir, c’est encourageant.",
      "Après avoir fait des dizaines et dizaines de call sur tout juillet, je sens que je prends les appels (et les objections) autrement, j’ai la sensation de mieux connaître, affiner ce que j’ai dis (ce qui est normal).",
      "Voilà maintenant je me demande comment ça va se passer pour remplir les 10 places de mes membres fondateurs pour l’offre bêta (sans parler de l’offre finale 🙏🏼) mais en tout cas j’ai l’impression d’avoir débloqué quelque chose de nouveau…",
      "À suivre 🙂",
      "EDIT : 4h après mon post j’ai ma première vraie vente 🥹",
      "Une prospect avec qui j’avais fais 2 RDV en juillet (et qui n’avait à ce moment même pas la possibilité de faire un dépôt de 50€) est revenue vers moi, prête à passer à la suite et qui s’est conclue en première vente avec un paiement en 3 fois 🫣",
    ],
  },
  {
    nom: "Laëtitia Miroux",
    niche: "Fondatrice Exportateurs Engagés - Méthode structurée, résultats export concrets",
    portrait: "/immersion/communaute/laetitia-miroux.jpg",
    titre: "une mission à 15 000 dollars",
    surligne: ["j'ai signé mon premier membre au nouveau tarif"],
    paragraphes: [
      "@Geoffrey Bonniot @Rémy Jupille @Ludivine",
      "J'avais envie de partager une petite victoire avec vous.",
      "J'ai lancé une version non finie des Exportateurs Engagés en janvier. J'ai eu mes premiers membres à partir de fin mars à un tarif imbattable. Ils étaient trois. Ensuite, j'ai volontairement ralenti pour construire les fondations : travailler ma publicité, mon tunnel de vente et appliquer la méthode de Funnels Club étape par étape.",
      "Début juillet, j'ai signé mon premier membre au nouveau tarif grâce au processus de closing (2500 euro - tarif qui évoluera encore).",
      "Et aujourd'hui, une nouvelle étape vient d'être franchie.",
      "J'ai présenté ma méthode à un distributeur de produits canadiens qui souhaite se développer au Brésil. Au départ, je pensais lui vendre le programme. Finalement, il m'a expliqué qu'il ne souhaitait pas former quelqu'un en interne, mais qu'il voulait que j'applique directement ma méthode pour son entreprise.",
      "Résultat : nous sommes partis sur une mission à 15 000 dollars (hors commission) pour mettre en place la méthode Exportateurs Engagés sur le marché brésilien.",
      "Je suis vraiment heureuse, parce que ça confirme plusieurs choses.",
      "D'abord, avoir fait confiance à ma méthode et avoir suivi les conseils de Funnels Club m'a permis de construire une offre qui répond à un vrai besoin.",
      "Ensuite, ce projet va me permettre d'obtenir un cas concret, récent et très solide. Je suis convaincue qu'il deviendra un excellent support de communication pour faire rayonner Exportateurs Engagés.",
      "En parallèle, mon nouveau membre avance bien dans le programme, et grâce à la publicité, je reçois de plus en plus d'appels. Je sens que la machine est en train de se mettre en route.",
      "Les résultats ne sont pas arrivés du jour au lendemain. Ils se sont construits progressivement, avec des confirmations qui sont tombées sur plusieurs semaines. Mais aujourd'hui, je vois que le travail de fond finit par payer.",
      "Merci beaucoup à @Geoffrey Bonniot et à toute la communauté pour les conseils et les échanges. Ça motive à continuer.",
    ],
  },
  {
    nom: "Christophe et Dominique Crapez",
    niche: "High Impact Mindset",
    portrait: "/immersion/communaute/christophe-dominique-crapez.jpg",
    titre: "Rejoindre Funnels Club a été la meilleure décision professionnelle de ma vie !",
    surligne: ["notre projet prend enfin forme"],
    paragraphes: [
      "Coucou l’équipe,",
      "Je découvre la nouvelle version de Funnels Club et je la trouve incroyable ! Je suis ravie de faire partie de cette aventure, car je sais à quel point il est extraordinaire de partager son savoir avec les autres, et vous le faites à merveille. Rejoindre Funnels Club a été la meilleure décision professionnelle de ma vie !",
      "Sachez aussi que je ne me suis pas éclipsée pour abandonner. Après la réalisation de mon webinar, j’ai enchaîné directement sur la création de mon programme et je viens tout juste de terminer les vidéos aujourd’hui. Christophe gère maintenant la logistique, ce qui nous permettra de nous lancer dans le courant de la semaine prochaine. Nous aurons donc le plaisir de vous retrouver très bientôt pour la pub et le closing !",
      "Merci infiniment pour votre bienveillance et votre patience. Même si, au fond, aucun mot ne suffira jamais à vous remercier, Christophe et moi vous sommes profondément reconnaissants. Grâce à vous, notre projet prend enfin forme. MERCI!",
      "Dom et Chris",
    ],
  },
];
