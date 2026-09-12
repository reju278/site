# Conventions du projet

Instructions permanentes pour toute contribution à ce dépôt, humaine ou
automatique. Ce fichier s'appelle `AGENTS.md` et non `CLAUDE.md` parce qu'il
vaut pour **tous** les agents ; le `CLAUDE.md` de la racine ne contient qu'une
ligne, `@AGENTS.md`, pour que la règle ne s'écrive qu'une fois.

> **Ce fichier se met à jour dans le même commit que le changement qu'il
> décrit.** C'est la seule mémoire qui traverse les sessions. Un `AGENTS.md`
> périmé est pire que pas de fichier : l'agent raisonne avec assurance sur un
> projet qui n'existe plus.

---

## Avant d'écrire une ligne

1. **Relire le `README.md`.** Il dit ce qu'est le logiciel et comment on le lance.
2. **Relire l'issue GitHub concernée**, commentaires compris. C'est là que vit
   l'intention, ce qui a déjà été essayé et ce qui a été écarté.
   `gh issue view <numéro> --comments`
3. **Ne rien réinjecter d'inutile.** Le README et l'issue suffisent à démarrer.
   Le reste du dépôt se lit à la demande, fichier par fichier, pas en bloc.
4. **Consigner dans l'issue**, pas dans la discussion : les décisions et les
   impasses doivent survivre à la fermeture de la fenêtre.

Toute fonctionnalité a son issue **avant** d'avoir son code. Une issue dit ce
qu'on veut et pourquoi, pas comment.

---

## La pile ne change pas

Turborepo + pnpm, Next.js (App Router, React 19), Tailwind v4, shadcn/ui,
Vercel.

**Ce projet est un site vitrine : il n'a ni base de données, ni
authentification, ni envoi d'emails.** Convex, Better Auth et Resend font partie
de la stack de départ mais ne sont pas installés ici. Le jour où le site a
vraiment quelque chose à lire ou à écrire, on les remonte depuis
`MONTER-LA-STACK.md` plutôt que d'improviser autre chose.

Vercel sert les pages, et c'était déjà vrai quand Convex était là : Convex ne
servait pas le site, il gardait des données. Un vitrine n'en a pas.

**Ne jamais introduire une brique concurrente** parce qu'elle paraît plus
pratique sur le moment : pas d'autre ORM, pas d'autre bibliothèque de
graphiques, pas d'autre système de styles, pas de `.module.css`. Si une brique
manque vraiment, en discuter dans l'issue avant de l'installer.

---

## Git

**Ne jamais `git push` sans validation explicite.** Committer est libre ;
pousser demande le feu vert, parce que chaque push sur `main` déclenche un
déploiement de production sur Vercel.

---

## Un écran neuf commence par une visite aux registres

**Avant de dessiner quoi que ce soit, aller voir si le composant existe.** Ce
n'est pas une préférence, c'est une étape obligatoire. Tout module d'interface
demandé, un choix de date, un sélecteur, une fenêtre, commence par une commande
`shadcn add`, pas par un fichier vierge. **Si l'on n'a rien installé, c'est
qu'on n'a pas cherché.**

L'ordre compte :

1. [ui.shadcn.com](https://ui.shadcn.com) : le socle. Bouton, champ, fenêtre, menu, tableau.
2. [reui.io](https://reui.io) : la couche au-dessus, les compositions qu'on écrirait sinon à la main.
3. [bklit.com](https://bklit.com) : les graphiques, et eux seuls.

**ReUI demande désormais une clé de licence.** Le registre répond
`{"error":"Authentication required"}` sur toutes ses adresses, y compris la
variante `radix-nova`. Les trois composants déjà dans `packages/ui/src/components/reui/`
ont été installés avant ce changement et restent utilisables ; **on ne peut plus
en ajouter** tant que Rémy n'a pas de clé. Ce n'est donc plus la deuxième étape
de la visite aux registres, c'est une porte fermée : il faut le savoir avant
d'aller y chercher quelque chose. La règle ci-dessous vaut pour le jour où la
clé existe.

**ReUI s'installe en variante `radix-nova`, jamais par l'URL courte.**
`https://reui.io/r/<nom>.json` redirige vers une version bâtie sur Base UI, qui
ferait doublon avec `radix-ui`, déjà là. L'adresse à utiliser est
`https://reui.io/r/styles/radix-nova/<nom>.json`, qui s'appuie sur les briques
du projet. Ces fichiers atterrissent dans
`packages/ui/src/components/reui/`, à part, pour qu'on sache d'où ils viennent.

Le build par style de ReUI laisse au passage des fragments de classes tronqués
(`"(1)] (1)] (1.25)]"` dans `frame.tsx`). Ils sont inertes, Tailwind ne les
reconnaît pas, et ils ne se corrigent pas : c'est du code de registre.

On n'écrit à la main que ce qu'aucun des trois ne donne.

- Les composants vivent dans `packages/ui/src/components/`, importés via
  `@repo/ui/components/<nom>`.
- Pour ajouter : `cd packages/ui && pnpm dlx shadcn@latest add <nom>`.
- Le code repris d'un registre reste **tel quel**, pour rester alignable sur
  leurs mises à jour. Il n'est pas passé au linter et ne se corrige pas à la main.
- **Après chaque `add`, lire `git diff`.** Un ajout réécrit sans prévenir
  `dialog.tsx`, `command.tsx`, `dropdown-menu.tsx` et `select.tsx`, et y remet
  un `cursor-default` qui casse la règle de curseur du projet. Rendre ce qui
  est à nous.
- **Vérifier les imports de `cn` après un `add`.** Dans un monorepo, shadcn
  n'arrive pas à résoudre l'alias depuis `packages/ui` lui-même et écrit
  `import { cn } from "cn"`, qui installe un paquet npm sans rapport. La bonne
  ligne est `import { cn } from "@repo/ui/lib/utils"`, et le paquet `cn` n'a
  rien à faire dans les dépendances.

---

## Tout lien sortant porte sa balise de provenance

Rémy suit ses ventes avec Hyros. Un lien qui quitte ce site vers une de ses
propriétés doit porter **`?el=site`**, sinon la vente est attribuée ailleurs.

La balise ne s'écrit **jamais à la main** : `apps/web/contenu/site.ts` expose
`avecTag()`, et tous les liens passent par elle. C'est une fonction et non une
consigne parce qu'une balise oubliée ne se voit pas. Le lien marche, la page
s'affiche, rien n'échoue : on s'en aperçoit des semaines plus tard, en lisant
des chiffres devenus faux.

`avecTag()` choisit `?` ou `&` selon que l'URL a déjà une requête, et ne double
pas la balise si elle est déjà là.

Exception : les plateformes tierces qu'Hyros ne suit pas, YouTube par exemple.
Un paramètre inconnu dans une URL de chaîne n'apporte rien. L'exception se
justifie en commentaire à côté du lien.

---

## Le SEO n'est pas une passe de fin, c'est une contrainte d'écriture

Un site vitrine sert à être trouvé. Ce qui suit n'est pas une liste de bonnes
intentions à repasser avant la mise en ligne : ce sont des conditions pour
qu'une page soit considérée comme terminée, au même titre que les deux thèmes
et les deux tailles d'écran.

### Un texte de page ne compte jamais ses éléments

Le sous-titre de la page des résultats disait « quinze membres racontent ». Ils
ont été quinze, puis dix-huit, puis vingt-deux, **et personne ne pense à corriger
une phrase en ajoutant une vignette**. Un compte écrit en toutes lettres est juste
le jour où on l'écrit et faux au suivant.

Sur décision de Rémy : pas de nombre dans le texte, ni maintenant ni plus tard.
« Les membres racontent », et c'est la grille qui compte, puisqu'elle est
calculée à partir des données.

La règle vaut pour tout ce qui se compte et qui bouge : le nombre d'articles, le
nombre d'épisodes, le nombre d'offres. Si un chiffre doit vraiment apparaître, il
se calcule dans le JSX, il ne s'écrit pas dans une phrase.

**Même prudence avec un nom propre dans une description.** Celle de la page des
résultats annonçait « en entretien avec Rémy Jupille » : c'est faux depuis que
Geoffrey en mène la moitié. Une description qui nomme quelqu'un se vérifie comme
un chiffre.

### Chaque page déclare son identité

- **Un `export const metadata`** par page, avec son `title` et sa
  `description`. Le gabarit du titre est posé dans `layout.tsx` ; une page qui
  n'exporte rien hérite du titre d'accueil et devient un doublon aux yeux de
  Google.
- **La description fait entre 120 et 160 caractères** et décrit la page, pas le
  site. Au-delà, elle est tronquée dans les résultats.
- **Une seule balise `h1` par page**, et c'est le titre visible. Les niveaux
  suivants descendent sans sauter de marche : un `h3` sous un `h1` casse le
  plan que les robots lisent.
- **`alternates.canonical`** sur toute page atteignable par plusieurs adresses.
- **`robots: { index: false }`** sur les pages légales : elles diluent le site
  sans jamais amener personne.

### Le titre d'onglet et le `h1` ne sont pas le même texte

Ils ne s'adressent pas aux mêmes gens. Le `h1` parle à quelqu'un qui est déjà sur
la page et peut courir sur deux lignes ; le `title` s'affiche dans une liste de
résultats qui coupe autour de **soixante caractères**, et le gabarit du site lui
ajoute encore « · Rémy Jupille ». Un `h1` de cent dix caractères recopié dans le
`title` devient une phrase tronquée au milieu d'un mot.

Une page dont le `h1` est long porte donc **deux titres** : le long pour l'écran,
le court pour l'onglet. C'est ce que fait `titrePage` dans `avis.ts`.

### Un bloc d'appel n'est jamais un `h2`

Le plan que les robots lisent doit décrire **le sujet de la page**. Un article de
sept chapitres en `h2` qui finit par deux cartes d'offres en `h2` annonce neuf
sujets, dont deux qui parlent d'autre chose. Les blocs d'appel, les encarts et
les cartes de fin descendent en `h3`, ou n'ont pas de titre du tout.

### Une page enfant déclare son fil d'Ariane

Toute page qui a un parent évident porte un `BreadcrumbList` en données
structurées. C'est lui qui fait afficher « Résultats › Roland Buffet » dans les
résultats de recherche au lieu de l'adresse brute. Deux échelons suffisent quand
le parent est unique : remonter jusqu'à l'accueil n'ajoute qu'une ligne que tout
le monde connaît.

### Les avis : `VideoObject` oui, `Review` jamais

**Les avis qu'une entreprise publie sur elle-même sont exclus des résultats
enrichis de Google depuis 2019.** Poser un balisage `Review` ou
`AggregateRating` sur un témoignage client n'apporte aucune étoile et expose à
une pénalité manuelle. Ce qui est éligible, et réel, c'est le `VideoObject` :
vignette, durée, date de mise en ligne.

**La date de mise en ligne se relève, elle ne s'approche pas.** Une date fausse
déclarée à Google est pire qu'une date absente.

**La transcription se déclare** dans la propriété `transcript` du `VideoObject`
quand la page la publie. La donner évite à Google d'avoir à deviner que le texte
replié sous l'article est la parole de la vidéo.

### La transcription d'une vidéo se publie, nettoyée

Un moteur indexe normalement ce qui est replié dans un `details`, depuis
l'indexation mobile d'abord : c'est donc mille mots de plus par page, sur le bon
sujet et dans les mots de la personne. Et c'est d'abord de l'accessibilité, que
ce fichier réclame déjà pour toute vidéo qui porte le message d'une page.

**Mais jamais brute.** La reconnaissance vocale écorche les noms propres, pose la
ponctuation au hasard et répète les hésitations. Quinze pages de transcription
brute n'ont pas l'air riches, elles ont l'air automatiques, et c'est exactement
ce que les signaux de contenu utile cherchent. Ce qui se corrige : les noms
propres, la ponctuation, les répétitions d'oral, les nombres écrits en lettres,
et les tours de parole rendus à qui les dit. **Aucun mot remplacé, aucune phrase
reformulée** : ce qui est mal dit reste mal dit, c'est de la parole.

`details` et `summary` natifs, jamais un accordéon écrit à la main : le texte est
dans le document dès le premier octet, et un composant React retirerait le
contenu du DOM tant qu'il est fermé, ce qui est l'inverse du but.

### Un entretien se rend à qui l'a mené, même quand c'est moins commode

Les quinze entretiens d'avis ne sont pas tous menés par Rémy : Geoffrey en mène
la moitié, et plusieurs intervieweurs ne se nomment jamais. **Les tours de
parole vont à qui les dit**, donc « Geoffrey » quand le client le nomme et
« Funnels Club » quand personne ne le nomme. On ne devine pas un prénom à
l'oreille d'une reconnaissance vocale : elle écrit « Jean-Fré », « Getty »,
« Jean-Pierre », et un intervieweur mal attribué est une erreur de fait sur une
page qui porte le nom de vraies personnes.

Corollaire : le chapô ne dit « en entretien avec Rémy Jupille » que lorsque
c'est vrai, et l'`alt` de l'affiche non plus.

### Un chiffre qu'on n'entend pas clairement ne se publie pas

La reconnaissance vocale écorche les montants avant tout le reste : elle écrit
« trois cas » pour trois mille, « on a fait cent-quatre » pour une phrase qu'on
ne reconstitue pas. **Ces passages ne se devinent pas, et rien de ce qui en
vient n'est publié.** Sur l'entretien de Yannick et Sylvie, le seul résultat
annoncé est celui que Sylvie énonce en toutes lettres.

Même règle pour une réserve : quand Jérémy dit avoir passé les dix mille euros
puis ajoute qu'il devrait vérifier ses statistiques, **l'article dit les deux**.
Retirer la réserve pour ne garder que le montant, c'est faire dire à quelqu'un
ce qu'il n'a pas dit.

### On ne publie pas un client qui descend un concurrent nommé

Une cliente cite deux formateurs chez qui elle avait acheté avant, et dit de
l'un que ça ne lui a servi à rien. C'est son opinion et elle a le droit de
l'avoir. La publier sur une page commerciale qui vend le programme concurrent,
c'est du dénigrement de personnes nommées, et **ce n'est pas à un agent
d'engager la société là-dessus**. Le tour de parole est conservé, sans les noms,
et le retrait est signalé en commentaire. Rémy décide s'il les remet.

### Une page qui parle de santé parle du business, pas du soin

Trois membres travaillent sur la santé ou le bien-être : un psychologue, un
sexologue, une accompagnante qui part de ses propres maladies chroniques. Leurs
articles disent leur métier, parce que c'est le sujet de la page, et **s'arrêtent
là** : aucune description de ce qu'ils proposent, aucune promesse d'effet, aucun
vocabulaire de soin. Ce qui est raconté, c'est la façon dont ils ont organisé et
tarifé leur activité.

### Deux entretiens d'une même personne font deux pages, reliées structurellement

Trois membres ont témoigné deux fois, à un an d'écart. **Deux pages et non une
seule**, parce qu'elles ne portent pas sur le même sujet : la première raconte le
lancement, la seconde le palier suivant. Les fusionner demanderait un gabarit à
deux vidéos et noierait deux récits distincts dans une page unique.

Mais deux pages sur la même personne ne peuvent pas s'ignorer. Le lien est donc
**structurel et pas seulement écrit dans une phrase** : le champ `autreEntretien`
de `avis.ts` rend un bandeau en haut de l'article, dans les deux sens, et un
contrôle vérifie que la relation est réciproque. Les paragraphes se citent aussi
l'un l'autre, ce qui vaut pour un moteur, mais un lien noyé dans un paragraphe se
rate à la lecture.

Le bandeau est **en haut et non en bas** : le lecteur vient de voir la vidéo et
sait de qui il s'agit, c'est là que « il y en a un second » a du sens. Son
libellé dit **ce qu'on va lire**, jamais « lire aussi ».

### Une page d'avis ne vend pas un programme qui n'existe plus

Le mastermind est en pause, remplacé par le consulting privé en tête-à-tête.
Trois articles racontent des résultats obtenus dedans : ils gardent leur sujet,
parce que c'est là que ces résultats ont eu lieu et qu'une page d'avis raconte ce
qui s'est passé. Mais **elles le disent dès le chapô et y consacrent leur
dernière section**.

Laisser croire qu'on peut encore rejoindre un programme arrêté, c'est vendre ce
qui n'existe plus, et une page d'avis fait vivre cette erreur des années. Le jour
où le mastermind rouvre, ça se corrige dans ces trois fichiers.

### Les pages d'une même famille se citent entre elles

**C'est le levier le plus fort, et il ne se voit pas sur une page seule.** Quinze
articles qui ne se citent pas sont quinze pages isolées ; les mêmes qui se citent
forment un groupe où chacune renforce les autres.

Les voisins se prennent **à la suite dans la liste, en bouclant** : chaque page
en cite trois, et chacune est citée autant de fois. Un tirage au hasard fait des
orphelins ; un tri par date laisse les plus anciennes sans personne pour les
pointer.

### Un lien interne vit dans une phrase

C'est là que l'ancre porte du sens, pour un lecteur comme pour un moteur : un
lien au milieu d'une phrase dit de quoi parle la page d'arrivée, une liste de
liens en bas de page ne dit rien. Un article vise **quatre à cinq liens internes
en contexte**, en plus de ceux du pied de page, qui ne comptent pas.

Le texte du lien s'écrit dans le contenu et non dans le JSX : voir `TexteLie` et
sa syntaxe `[libellé](adresse)`.

### Les images

- **Tout `alt` est décidé, jamais oublié.** Une image qui porte du sens décrit
  ce qu'elle montre, en une phrase courte et sans « image de » ni « photo de ».
  Une image purement décorative prend `alt=""`, ce qui la retire explicitement
  du plan de lecture. Un `alt` absent est un défaut ; un `alt=""` assumé n'en
  est pas un.
- **`width` et `height` toujours déclarés**, même quand la taille finale vient
  du CSS. Sans eux, le navigateur ne réserve pas la place et la page saute au
  chargement : c'est le décalage de mise en page, et il est mesuré.
- **L'image du haut de page prend `fetchPriority="high"` et pas de
  `loading="lazy"`.** C'est elle que Google chronomètre. Toutes les autres
  prennent `loading="lazy"`.
- **Deux fichiers par image de fond**, un par largeur, servis par `<picture>`.
  Envoyer 1920 px à un écran de 375 fait payer six fois le poids pour rien.
- **Compresser avant de committer.** Une image de plus de 300 Ko dans
  `public/` doit être justifiée.

### Les liens et les boutons

- **Ce qui navigue est un lien, ce qui agit est un bouton.** Un `<button>` qui
  change de page n'est pas suivi par les robots, perd le clic du milieu,
  l'ouverture dans un onglet et l'aperçu de la destination.
- **Le texte du lien dit où il mène.** Jamais « cliquez ici », « en savoir
  plus » ni « lire la suite » seuls : c'est ce texte qui décrit la page
  d'arrivée. Si la mise en page impose un libellé court, l'`aria-label` porte
  la version complète.
- **Les liens sortants prennent `rel="noreferrer"`** et leur balise de
  provenance, voir la section Hyros.
- **Une icône seule a toujours un `aria-label`.**

### La vidéo

- **Un `title` sur chaque `iframe`**, décrivant la vidéo et non le lecteur.
- **Des données structurées `VideoObject`** quand la vidéo porte le message de
  la page : sans elles, Google ne sait pas qu'il y a une vidéo et ne peut pas
  l'afficher dans ses résultats. Il lui faut au minimum le nom, la description,
  la vignette, la date de publication et la durée au format ISO 8601.
- **Sous-titres ou transcription.** C'est de l'accessibilité, et c'est aussi le
  seul texte qu'un robot peut lire dans une vidéo.
- **Une affiche, pas un cadre noir.** Elle sert de vignette dans les partages.

### Le socle du site

- **`sitemap.ts` et `robots.ts`** dans `apps/web/app/`. Next les génère ; toute
  page publique nouvelle doit apparaître dans le premier.
- **Le pied de page se met à jour en même temps que les pages.** Il tient la
  carte du site : ses trois colonnes viennent de `colonnesPiedDePage` dans
  `site.ts` et reprennent les menus de l'en-tête entrée pour entrée. Créer une
  page publique, en renommer une, en déplacer une ou en supprimer une **oblige**
  à passer par ce tableau, au même titre que par `sitemap.ts`. Un pied de page
  qui pointe vers une page disparue rend un 404 à Google et à un visiteur qui
  arrivait au bout de la page, et c'est la pire des deux fins.
- **`metadataBase`** est déclaré une fois dans `layout.tsx` pour que les URL
  d'`openGraph` soient absolues. Sans lui, les aperçus de partage sont vides.
- **Une image `openGraph`** de 1200 sur 630. C'est ce qui s'affiche quand
  quelqu'un colle un lien du site dans une conversation.
- **`lang="fr"`** sur `<html>`, déjà posé, à ne pas perdre.
- **Des données structurées `Person`** sur l'accueil, reliant le nom aux
  profils de réseaux sociaux. C'est ce qui permet à Google de rattacher le site
  à la personne.

### Ce qu'on ne fait pas

Pas de texte caché, pas de mots-clés empilés, pas de page bâtie pour un moteur
plutôt que pour un lecteur. Un site de formation qui triche se fait déclasser,
et le mal est bien plus long à réparer que le gain.

---

## Affichage

### Rayon des angles : 5 px, partout

Toute l'échelle (`rounded-sm`, `rounded-md`, `rounded-lg`) vaut 5 px, défini
dans `packages/ui/src/styles/globals.css`. Jamais de rayon en dur
(`rounded-[8px]`, `rounded-xl`). Seule exception : `rounded-full` pour les
photos de profil.

**Une exception d'échelle : les jonctions pleine largeur.** Le hero ne se fond
plus dans la page par un dégradé, il s'arrête sous une lèvre de la couleur de
page aux deux angles hauts arrondis. Un rayon de 5 px sur 1400 px de large ne
se voit pas : 5 px sert à adoucir l'angle d'un objet qu'on regarde de près, un
bouton, un champ, une carte. Le rayon de ces jonctions est donc
`--rayon-jonction`, dans `apps/web/app/globals.css`, écrit une fois pour que
deux jonctions ne divergent jamais. Ce n'est pas une licence pour arrondir plus
ailleurs : à l'intérieur de la page, tout reste à 5 px.

**`--rayon-jonction` ne sert qu'aux deux lèvres**, celle du hero et celle de la
bande. Il a longtemps servi aussi au cadre de la vidéo et aux cartes de
témoignage : c'était une erreur de lecture de l'exception. Une vidéo et une
carte sont des objets qu'on regarde de près, exactement ce que la règle des
5 px décrit ; elles sont revenues à `rounded-md`, sur décision de Rémy. Une
troisième jonction pleine largeur aurait droit au jeton ; rien d'autre.

### Le menu déroulant est relevé sur TrendTrack, cotes comprises

Le panneau des menus de l'en-tête reprend celui de trendtrack.io, sur demande de
Rémy et à sa troisième formulation : « je veux exactement, à la lettre près, la
même chose ». Les valeurs ne sont donc pas approchées à l'œil, elles sont lues
dans leur feuille de style, sur les classes `nav_mega__wrap`, `nav_mega__layout`,
`nav_mega__link` et `nav_menu__icon`.

**Elles sont toutes en `em` chez eux**, donc proportionnelles au corps du texte,
et c'est ce qui rend le relevé transposable : panneau à 1,75 em de rayon, grille
de deux colonnes, entrée à 1 em de rayon, tuile de 2,75 em à 0,875 em de rayon.

**Les rayons, eux, ont été rentrés**, sur correction de Rémy : 16 px pour le
panneau, 12 pour l'entrée, 10 pour la tuile, au lieu des 28, 16 et 14 du relevé.
Les leurs sont justes chez eux, sur un panneau de 864 px ; sur le nôtre,
l'arrondi devenait le premier objet qu'on voyait. À 16, le panneau reste dans la
famille des 12 px des capsules dont il sort, et la tuile tombe pile sur le rayon
du logo Funnels Club, qui est à 22 % de son côté.

**Ce sont donc trois rayons de plus que 5 px**, et ils ne s'étendent à rien
d'autre. La règle des 5 px décrit un objet qu'on regarde de près ; un panneau de
menu est une surface flottante, de la même famille que les capsules. Une
quatrième valeur ne s'ajoute pas sans se décider ici.

**Le relief est leur `--sh-glass`**, trois ombres intérieures : un filet en haut,
un halo très large, un halo court. C'est ce triplé qui fait qu'une tuile a l'air
taillée dans la matière ; une bordure ne le remplace pas, elle cerne au lieu de
creuser. Il vit chez nous dans `--ombre-verre`.

**La seule adaptation est la couleur, et elle était obligatoire.** Leur site n'a
qu'un thème sombre : fond de tuile, filet et reliefs y sont écrits en blanc
translucide. Sur notre thème clair, un blanc à quatre pour cent ne se voit pas.
Tout passe donc par `color-mix(in srgb, currentColor …%, transparent)`, qui donne
du clair sur le sombre et du sombre sur le clair sans qu'on écrive deux valeurs.

**La description de chaque entrée tient sur une ligne**, `line-clamp-1`, comme
leur `u-text-clamp-1`. Ce n'est pas cosmétique : dans une grille à deux colonnes,
une entrée qui déborde sur deux lignes décale sa voisine et le peigne est perdu.

Ce qui ne se relève pas dans une feuille de style : **leurs pictogrammes sont des
dessins**, onze illustrations pleines. Les nôtres sont des tracés Lucide. Le
relief vient de la tuile et non du glyphe, donc l'écart se voit peu, mais le
combler demande des dessins, pas du code.

### Le menu « Ressources » se lit en colonnes, et ses tuiles sont des marques

Rémy l'a dicté colonne par colonne, puis corrigé : **ce qui est chez nous à
gauche**, le livre, les résultats et le blog ; **les trois chaînes YouTube à
droite**. La grille remplit donc **les colonnes avant les lignes**, `grid-flow-col` et un nombre de rangées
calculé, et l'ordre du tableau de `site.ts` est celui qu'on lit à l'écran. Écrire
cet ordre en remplissage par lignes aurait demandé d'entrelacer le tableau,
c'est-à-dire d'y ranger une mise en page.

Deux conséquences mécaniques, toutes deux rencontrées :

- **La rangée des réseaux sort de la liste.** Un `col-span-2` dans une grille qui
  coule en colonnes ne s'ajoute pas sous les entrées, il s'insère au milieu du
  peigne.
- **Le menu « Programmes » ne change pas.** Deux entrées donnent une rangée, donc
  les deux colonnes côte à côte qu'il avait déjà.

**Les tuiles portent des couleurs, et chacune se justifie.** Elles étaient toutes
en `--primary`. Sur demande de Rémy : le rouge de YouTube sur les chaînes, le
vert sur la flèche des résultats, le blog inchangé. Ce ne sont pas des couleurs
de plus dans la palette. `--youtube` est **une marque citée** et ne colore que
son propre glyphe ; `--icone-resultats` est le vert de la courbe vivante, déjà
là, et il signifie la même chose qu'elle, une ligne qui monte. Il **change de
valeur selon le thème**, #059669 en clair et #10b981 en sombre : le vert franc ne
tient que 2,45:1 sur la page claire, en dessous des 3:1 d'un glyphe.

**Les glyphes de marque ne viennent pas de Lucide**, qui a retiré ses icônes de
marque à partir de sa version 1, mais de `simple-icons`, comme la rangée des
réseaux. Un écran de télévision générique ne dit pas « YouTube ».

**Digital Selfmade porte son logo, et pas la couverture du livre.** Quatre
passes ont mené là : un `BookOpen` sur un rose choisi à l'œil, puis « le vrai
icône et la vraie couleur », puis « la petite icône comme dans le footer », puis
« la photo dans le menu pour le livre est cassée ».

**Une image large ne devient pas une icône en la recadrant.** Le fichier du pied
de page est un rendu de 1200 sur 832 montrant trois exemplaires côte à côte :
recadré en carré de 34 px, il n'en restait qu'un fragment du milieu. Rien
n'échouait, l'image se chargeait, elle était simplement rognée jusqu'à ne plus
rien dire. Une icône se dessine carrée, et c'est le logo de la marque qui l'est,
pas la photo de l'objet. Il est servi par nous, donc rien ne part chez
ClickFunnels à l'ouverture d'un menu.

Et il reste **dans la tuile de verre**, sur demande de Rémy : c'est le cadre qui
le fait ressortir au milieu des autres, pas son absence.

**Une entrée dont le logo annonce une plateforme mène à cette plateforme.**
Esprits Maverick affichait Ausha ; depuis qu'il porte le logo YouTube, il mène à
la chaîne. Le pied de page, lui, reste sur Ausha, où sont les épisodes.

### La rangée du bas du menu s'appelle « Autres réseaux » et s'écrit en toutes lettres

Sur demande de Rémy. Deux choses, qui tiennent ensemble : les noms s'écrivent au
lieu de se déchiffrer, donc LinkedIn cesse d'avoir l'air de l'exception qu'il
était faute de glyphe ; et **YouTube sort de la rangée**, parce que les trois
chaînes ont leur entrée juste au-dessus et qu'un sixième lien YouTube renverrait
à la même maison sans dire laquelle.

Le pied de page garde ses pastilles rondes et son YouTube : il n'a pas d'entrées
de chaînes au-dessus, et c'est là que la rangée de signes est à sa place.

### Tous les boutons Funnels Club mènent à la page d'appel

« Découvrir » dans l'en-tête, « Découvrir » dans le pied de page, le bouton du
hero et l'entrée du menu : tous vers `www.funnels.club/appel`, sur décision de
Rémy. Ils visaient avant `/` et `/direct`.

Ils restent **trois noms dans `liens` et non un seul**, `decouvrir`,
`funnelsClub` et `appel`, chacun disant à quel endroit du site il sert : le jour
où l'un doit repartir ailleurs, il suffit de changer sa ligne au lieu de
retrouver lequel des boutons était lequel. La valeur est écrite une fois dans
`APPEL` pour qu'ils ne puissent pas diverger par accident.

### Les commandes rondes du lecteur de témoignages

`rounded-full` est réservé aux photos de profil. Il a maintenant une seconde
famille, décidée par Rémy sur deux références qu'il a fournies, le lecteur de
functionhealth.com et le pied de page du même site :

- le **disque de lecture** au centre d'une affiche de témoignage,
- les **deux flèches** du carrousel, qui sont rondes dans le fichier de registre
  shadcn lui-même et qu'on ne corrige donc pas,
- les **pastilles de réseaux** du pied de page.

Ces trois-là sont des commandes rondes qui forment un même vocabulaire. Rien
d'autre n'a le droit d'être rond, et une quatrième famille se décide et s'écrit
ici.

### Le flou du disque de lecture est la troisième exception

Après les capsules de l'en-tête et la carte de cookies, le disque de lecture
porte un `backdrop-blur`. Décidé par Rémy, qui veut le lecteur de sa référence.

Le flou y est chez lui : ce qui passe dessous est justement l'image, et c'est
elle qu'on brouille. Mais **le flou n'apporte aucun contraste** : il ne change
pas la luminosité moyenne de ce qu'il brouille. C'est le fond du disque qui
porte le seuil, et il est à 45 % de noir, pas moins. Un signe posé sur une photo
se mesure au pire cas, image entièrement blanche dessous : à 45 %, le triangle
blanc tient 3,35:1 ; à 35 %, il tombe à 2,46 et disparaît sur un visage en
pleine lumière. Le disque de la référence est plus clair que le nôtre pour
exactement cette raison.

### Tout ce qui se clique porte le curseur de désignation

Les navigateurs donnent au `<button>` le curseur de flèche, et plusieurs
composants de registre posent `cursor-default` par-dessus. Sur la moitié des
commandes du site, rien ne signalait qu'on pouvait cliquer, et c'est le seul
retour qu'on ait avant d'appuyer.

La règle est écrite **une fois** dans `globals.css`, sur `button`, `[role=button]`,
`a[href]`, `label[for]` et `summary`, et non classe par classe. Deux raisons : une
classe oubliée sur un bouton ne se voit pas, le bouton marche et a juste l'air
inerte ; et un `shadcn add` remet son `cursor-default` à chaque mise à jour,
alors que le code de registre ne se corrige pas à la main. Un sélecteur
d'élément combiné à `:not()` passe devant et survit aux réinstallations.

`:disabled` et `aria-disabled` sont exclus : sur une commande hors service, la
flèche est le bon signe, elle dit que rien ne se passera.

### Thème clair et sombre : toujours les deux

Chaque écran doit fonctionner dans les deux. Ce n'est pas une finition de fin de
projet, c'est une contrainte de chaque modification.

- Uniquement des jetons sémantiques : `bg-background`, `text-foreground`,
  `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`.
- **Jamais de couleur en dur** (`bg-white`, `#111`, `text-gray-500`) : illisible
  dans l'autre thème. Si un jeton manque, l'ajouter pour `:root` **et** `.dark`.
- Vérifier l'écran dans les deux thèmes avant de le considérer terminé.

**Le thème d'arrivée est le sombre**, sur décision de Rémy. `defaultTheme="dark"`
est passé au `ThemeProvider` depuis `layout.tsx`, et non dans `packages/ui` : le
fournisseur partagé reste générique, c'est le site qui dit ce qu'il veut. Il ne
s'applique qu'à quelqu'un qui n'a rien enregistré ; un visiteur qui a basculé
garde son choix.

`enableSystem` reste actif, et ce n'est pas une contradiction : il ne décide plus
de l'accueil, il fait encore vivre la valeur « système » déjà écrite dans le
navigateur des visiteurs précédents. Le retirer les ferait retomber sur un thème
non résolu, donc sur le clair, c'est-à-dire l'inverse de ce qu'on vient de
décider. **Le thème par défaut ne dispense de rien** : les deux restent à
vérifier, écran par écran.

### Le contraste se mesure sur toutes les surfaces, pas sur le fond de page

Un texte atténué reste du texte courant : il lui faut **4,5:1 sur chacune des
surfaces où il peut se poser**, pas seulement sur `--background`. C'est ce que
l'ancien `--muted-foreground` ratait, à 4,47:1 sur le fond et 3,62:1 sur
`--accent`.

- Un indicateur de focus et une bordure de contrôle demandent **3:1**.
- Les composants de registre dessinent `focus-visible:ring-ring/50`. Fondu à
  moitié, le bleu ne vaut que 2,14:1 en clair et 1,67:1 en sombre. On ne
  corrige pas les fichiers de registre : `globals.css` pose par-dessus un
  contour opaque de deux pixels, et c'est **lui** l'indicateur qui compte.
- Un texte posé sur une photo se mesure **au pire cas**, c'est-à-dire en
  supposant l'image entièrement blanche sous le texte. Le voile assombri est ce
  qui garantit le seuil, pas le hasard du cadrage.

### Le fond des résultats vient du deck publicitaire

La bande bleue en dégradé a été remplacée, sur décision de Rémy, par le fond du
deck publicitaire Funnels Club : un fond très clair légèrement bleuté, trois
halos bleus décentrés, un grain très fin. Les valeurs sont relevées dans le
fichier du deck, pas approchées à l'œil.

**Le deck est toujours clair ; le site a deux thèmes.** Les halos sont donc
remontés en opacité pour le sombre : sur un fond presque noir, un bleu à 10 %
ne se voit pas du tout, alors qu'il suffit à donner sa profondeur au blanc.

**Il sert aussi en tête des pages intérieures et sous le pied de page.** Trois
emplacements, une seule couche : `fond-resultats` et `grain-resultats`, écrits
une fois dans `globals.css`. Ce qui change d'un endroit à l'autre, c'est
seulement le sens du fondu, et il se déduit de la position du bloc. Un bloc qui a
du contenu **en dessous** s'éteint par le bas, c'est l'en-tête de page ; un bloc
qui n'a rien en dessous s'allume par le haut et va jusqu'au bord, c'est le pied
de page. La lèvre et son filet n'appartiennent qu'à l'accueil, où la page
**descend** sur la section : ailleurs, il n'y a aucune arête à rendre lisible.

**Le fond couvre les résultats et le livre d'un seul tenant**, et c'est ce qui
fait une transition plutôt qu'une frontière : il s'éteint derrière la carte du
livre, donc il n'y a aucun endroit où l'on puisse dire qu'il s'arrête.

**Ses deux bouts ne font pas la même chose, et c'est voulu.** En haut, une
coupure nette : une lèvre de la couleur de page descend sur le bloc, ses deux
angles bas arrondis. En bas, aucune arête : un masque fond la couche jusqu'à
rien. Ce n'est pas une incohérence — **un raccord ne se voit que lorsqu'il
essaie de se cacher.** Celui du haut ne s'en cache pas, il se dessine ; celui du
bas disparaît vraiment, parce qu'un masque retire des pixels au lieu de faire
coïncider deux couleurs.

Le filet en `--border` de la lèvre n'est pas décoratif. L'ancienne bande était
bleu nuit sur du beige, la coupure se lisait toute seule. Ce fond-ci est à un
cheveu de la couleur de page, `#fbfcff` contre `#fcfbf8` : sans filet, l'arrondi
ne se verrait pas.

### La courbe vivante, et ce qu'elle a le droit de dire

C'est le « Live Line » du registre Bklit, porté du deck. Le tracé est dessiné
une fois pour toutes, en entier, et c'est un `translateX` qui le fait défiler :
redessiner le chemin à chaque image sous deux masques faisait saccader la page
du deck.

Deux contraintes propres au site, qui n'existaient pas dans le deck :

- **Ce qui passe derrière une carte opaque est invisible.** Le deck faisait
  passer sa courbe derrière du texte ; la nôtre passe derrière une carte vidéo.
  La tête de courbe et sa pastille se posent donc dans la **marge mesurée** à
  droite de la carte, et s'effacent en dessous de `lg`, où cette marge n'existe
  plus. Une abscisse en pixels fixes, comme dans le deck, tombait hors champ sur
  tout écran de moins de 1 500 px.
- **La pastille affiche un montant en euros.** Elle avait été écartée pour cette
  raison et Rémy l'a demandée : à côté de témoignages de clients, un montant qui
  défile peut se lire comme une promesse de revenus plutôt que comme une
  décoration, et sur un site de formation c'est une allégation commerciale. Si
  la question revient, ce qui se retire est la pastille, pas la courbe : le
  mouvement ne chiffre rien de lui-même.

Le voile flouté entre la courbe et la vidéo est la **quatrième exception** à
« le flou va derrière, jamais devant », et la plus justifiée : le flou n'y sert
pas d'habillage, il sert à effacer ce qui gênerait la lecture.

### Un effet d'apparition ne doit jamais pouvoir cacher un titre

Les titres de section montent de dessous quand ils entrent dans la vue, mot par
mot, chacun dans son propre masque. C'est l'effet des titres du deck.

Le mot à mot n'est pas un raffinement : c'est ce qui le fait marcher sur
plusieurs lignes. Un titre masqué d'un seul bloc voit sa dernière ligne monter
depuis trois hauteurs de ligne plus bas, et les lignes se croisent.

**Deux pièges, tous deux rencontrés :**

- **L'espace se met en dehors du bloc masqué.** À l'intérieur d'un
  `inline-block`, un espace en fin de contenu est supprimé par le moteur de
  rendu : le titre s'affichait « Devraiespersonnes. Devraisrésultats. » et se
  copiait comme ça.
- **La contre-règle sans JavaScript ne se met pas dans le titre.** React
  sérialise le contenu d'un `noscript` comme du texte : la feuille de style se
  retrouvait dans le `textContent` du `h2`, invisible à l'écran mais lue par un
  robot. Elle vit dans `layout.tsx`, écrite une fois. Sans elle, un titre dont
  le script n'a pas tourné reste sous son masque, et c'est un niveau entier du
  plan que Google ne voit plus.

### L'écart entre un en-tête de page et son contenu s'écrit une seule fois

`EnTetePage` porte un rembourrage bas, `Section` un rembourrage haut, et aucun
des deux ne sait que l'autre existe : ils s'additionnaient à **144 px sur
téléphone et 192 en large** entre un sous-titre et la première rangée de
contenu. Rémy a demandé de resserrer.

La correction avait d'abord été posée page par page, ce qui la condamnait à être
oubliée sur la page suivante. Elle vit donc **dans `globals.css`**, sur le voisin
immédiat de l'en-tête :

```css
[data-entete-page] + section > div { padding-top: 0; }
```

D'où le `data-entete-page` sur le bloc racine d'`EnTetePage`. Le reste de l'écart
est le `pb-10 sm:pb-12` de l'en-tête lui-même. **Total : 40 px et 48 px**, et
c'est vrai sur les résultats, le blog, le podcast et la page d'erreur sans que
personne ait à y penser en créant la page suivante.

Deux garde-fous dans le sélecteur. Il ne vise que la **première** section : les
suivantes gardent le rythme vertical du site, qui n'a aucune raison de changer au
milieu d'une page. Et il ne vise que `section`, donc il épargne les pages
légales, dont le bloc suivant est un `div` sans rembourrage haut.

Le `> div` n'est pas une coquetterie : dans `Section`, le rembourrage vit sur le
bloc intérieur et non sur la balise qui reçoit la classe. Un `className` nu
n'écrase rien.

### Une image rognée perd son fondu, et ça se voit

Les deux paysages du site portent leur propre transparence, qui s'éteint dans
leur tiers haut. Cadrer une telle image par le bas, avec `object-cover
object-bottom`, supprime exactement la partie qui fondait : le bord redevient
une ligne droite en travers d'un paysage, et une ligne droite dans une montagne
se lit comme un défaut d'affichage.

**Le raccord se refait au masque**, `mask-image`, et non par un voile de la
couleur de page posé par-dessus. Le voile ne tient que tant que le fond ne bouge
pas ; le masque retire des pixels, donc il vaut dans les deux thèmes et quoi
qu'on mette derrière. Les deux écritures s'écrivent, `mask-image` et
`-webkit-mask-image` : Safari n'a levé son préfixe qu'en 15.4.

### Le mouvement réduit est un contrat, pas une option

`globals.css` neutralise transitions et animations sous
`prefers-reduced-motion: reduce`. On neutralise, on n'accélère pas : quelqu'un
qui demande moins de mouvement demande que rien ne bouge, pas que tout aille
vite.

### Téléphone et ordinateur : toujours les deux

Même règle, même exigence. Un écran n'est pas terminé parce qu'il est beau en
1440 px de large : la moitié des gens qui arrivent sur ce site le lisent sur un
téléphone tenu à la main.

- **On écrit le téléphone d'abord.** Les classes nues valent pour l'écran
  étroit, `sm:` et `lg:` élargissent ensuite. L'inverse oblige à défaire au
  lieu d'ajouter.
- **Le corps de page ne défile jamais horizontalement.** Ce qui est large par
  nature, un tableau, un bloc de code, un schéma, défile dans son propre
  conteneur en `overflow-x-auto`.
- Une grille se déclare toujours avec son état étroit : `grid-cols-1` puis
  `sm:grid-cols-2`. Une grille qui ne s'effondre pas produit des colonnes de
  quarante pixels.
- Pas de largeur en dur (`w-[720px]`), pas de `whitespace-nowrap` sur du texte
  courant. Les titres prennent `text-balance`, les paragraphes `text-pretty`.
- **Une cible carrée fait au moins 40 px de côté sur téléphone.** Les boutons
  d'icône de shadcn valent 36 px : les repasser à `size-10` sur mobile
  (`className="size-10 sm:size-9"`). Un bouton de texte garde la hauteur du
  système, sa largeur porte déjà la cible.
- Ce qui ne se déclenche qu'au survol doit exister autrement : sur un
  téléphone, il n'y a pas de survol.
- **Vérifier les deux avant de conclure**, à 375 px et en large, dans les deux
  thèmes. Le panneau navigateur émule le téléphone avec `resize_window`, il n'y
  a pas d'excuse à ne pas regarder.

### La forme d'un bloc de texte se décide, elle ne se subit pas

Un titre mal coupé ne produit pas une erreur : il produit une gêne que le
lecteur ne sait pas nommer. Un mot seul sur sa ligne, une ligne du milieu deux
fois plus courte que ses voisines, et l'ensemble a l'air négligé sans qu'on
puisse dire pourquoi.

**Jamais un mot seul sur une ligne**, ni au milieu ni à la fin. Et pas de ligne
qui fasse moins de la moitié de la plus longue.

**`text-balance` ne s'emploie que sur du texte centré**, et il ne suffit pas.
Il équilibre les lignes autour d'un axe ; sur un texte ferré à gauche, le bord
est déjà l'axe et l'équilibrage ne fait que raccourcir la première ligne sans
raison. Même centré, il se relit : le moteur remplit la première ligne avant de
répartir, et produit volontiers une ligne longue suivie de deux courtes.

**Quand la césure compte, elle s'écrit.** Si aucune largeur ne donne la forme
voulue, la coupure devient du contenu : le texte est stocké ligne par ligne
dans `site.ts` et chaque ligne est rendue en `block`. C'est le cas du titre des
offres. Ce n'est pas de la mise en forme déguisée en contenu : c'est Rémy qui
décide où sa phrase se coupe.

**Ça se vérifie en mesurant, pas à l'œil.** On relève les rectangles de chaque
ligne (`Range.getClientRects()`), on compte les lignes, on compare la plus
courte à la plus longue, et on regarde combien de mots porte chaque ligne. Aux
deux largeurs, 375 px et grand écran. Un titre juste en large peut être
catastrophique sur un téléphone.

**Un signe posé dans une ligne de texte s'aligne sur la hauteur de capitale**,
et par `vertical-align`, pas par `translate-y`.

**Et le conteneur ne doit pas être un `flex`.** Dans un conteneur `flex`,
`vertical-align` est simplement ignoré : l'alignement retombe sur `align-items`,
qui cale sur le haut ou le centre de la ligne et non sur la hauteur de capitale,
et la tuile flotte d'un ou deux pixels au-dessus des lettres. Rien ne le
signale, la propriété est là et n'agit pas. Le titre reste donc un bloc de texte
ordinaire, et l'écart se fait au `margin` en `em`, pas au `gap`. Une translation déplace le
dessin sans rien dire à la ligne : le réglage est juste à un seul corps et se
refait à chaque changement de taille. `vertical-align` s'exprime en `em` par
rapport à la ligne de base, donc il tient à toutes les tailles.

### Dans une grille, les actions s'alignent entre elles

Deux cartes côte à côte n'ont jamais des textes de même longueur. Si le bouton
suit son paragraphe, il se retrouve dix pixels plus haut dans une carte que
dans l'autre, et l'œil le voit immédiatement.

La recette tient en deux classes, et elle vaut pour toute grille de cartes,
d'offres ou de tarifs :

- **`h-full` sur la carte**, pour qu'elle occupe toute la hauteur de sa cellule
  au lieu de s'arrêter à son contenu.
- **`mt-auto` sur le bloc d'action**, pour qu'il soit poussé au bas de cette
  hauteur. L'espace au-dessus se règle avec un `pt-*` sur ce bloc, pas avec un
  `mt-*`, qui entrerait en conflit avec le `mt-auto`.

Même principe pour les autres éléments répétés d'une carte à l'autre : un titre
sur deux lignes ne doit pas décaler ce qui le suit dans la carte voisine.

### Une valeur partagée n'habite jamais dans un module `"use client"`

Un composant serveur qui importe une constante d'un fichier marqué
`"use client"` **ne reçoit pas la valeur**. Next remplace chaque export d'un
module client par une **référence client**, c'est-à-dire une fonction qui
désigne l'export à travers la frontière. La constante arrive donc sous forme de
fonction.

C'est arrivé à `HAUTEUR_ENTETE`, qui vivait dans `en-tete.tsx`. La page d'un
avis s'en servait pour caler un élément collant : `top: HAUTEUR_ENTETE + 16`
rendait `style="top:function() {…}"`, que le navigateur jette. L'élément n'avait
donc plus de décalage, et **un élément collant sans décalage ne colle jamais**.

**Rien n'échouait.** Pas d'erreur de type, pas d'avertissement au build, pas de
message dans la console : simplement, l'effet ne se produisait pas, et on le
cherche dans le CSS pendant des heures. Le seul endroit où ça se voyait était le
HTML servi.

La valeur vit donc dans `lib/entete.ts`, un module neutre que les deux côtés
importent. La règle vaut pour toute donnée partagée, pas seulement pour celle-là.

### `tailwind-merge` ne voit pas `dark:` comme un conflit

Une classe passée de l'extérieur à un composant de registre **ne gagne pas
toujours**. `cn()` résout les conflits par groupe de propriété, mais il traite
`bg-white` et `dark:bg-input/30` comme deux groupes distincts : les deux
survivent, et en thème sombre c'est la préfixée qui l'emporte.

C'est arrivé aux flèches du carrousel. La variante `outline` du bouton shadcn
pose `dark:bg-input/30` et `dark:border-input` ; le `bg-white` posé par-dessus
n'a rien écrasé du tout en sombre, le fond est retombé à 30 % d'opacité, et le
glyphe en `--bande-nuit` par-dessus valait **1,14:1**, c'est-à-dire rien. À
l'œil, la pastille avait simplement l'air un peu grise : c'est la mesure qui
l'a trouvé, pas le regard.

**Donc : dès qu'on repeint un composant de registre, on double la classe en
`dark:`.** Et on vérifie la couleur calculée dans les deux thèmes plutôt que de
regarder une capture.

### Un carrousel centré ne peut pas avoir à la fois une grande carte et des voisins entiers

C'est de la géométrie, pas du goût, et ça évite d'y revenir. Dans un carrousel
centré, le voisin commence exactement là où finit la carte courante : son centre
est à une largeur de carte du centre de l'écran. Pour qu'il tienne entier, il
faut `largeur × (1 + échelle ∕ 2) ≤ 50 %`, soit **36 % de la zone au maximum**,
390 px sur un écran de 1440.

On a donc le choix entre une carte étroite et des voisins tranchés par le bord.
Le site a essayé les deux : les voisins coupés donnaient des demi-visages
sectionnés à la verticale. La troisième voie est de renoncer aux voisins,
`basis-full`, et de dire autrement qu'il y en a d'autres. Le rang de miniatures
le dit mieux : on ne devine plus combien il y en a, on les voit.

Calendly, dont la forme est reprise, s'en tire parce que ses tuiles sont des
portraits étroits. Une vidéo en 16/9 n'a pas cette chance.

### Une bande noire dans une vidéo se recadre des deux côtés, ou pas du tout

Les témoignages sont des appels à deux : l'enregistrement porte ses propres
bandes noires, la moitié de la hauteur sur huit d'entre elles. Wistia n'expose
qu'une image, celle-là, donc « prendre une autre miniature » n'existe pas.

Le cadre est en **2,4/1** plutôt qu'en 16/9, ce qui les fait disparaître sans
toucher au fichier. Mais recadrer l'affiche seule ne suffit pas : au clic, le
lecteur reprend la main, sert sa vidéo en 16/9 et soit fait sauter la hauteur du
cadre, soit rétrécit l'image pour la faire tenir, ce qui remet des bandes sur
les côtés. L'iframe reçoit donc `fitStrategy=cover`, qui lui demande de remplir
en rognant. **Affiche et lecteur se recadrent ensemble, ou on a juste déplacé le
problème d'un quart de tour.**

Le rapport n'est pas choisi à l'œil : les affiches ont été relevées au
pixel en lisant leur luminance ligne par ligne. Leur contenu finit toutes à la
même ligne et la plus haute commence à 48 sur 360 ; 2,4/1 découvre la bande 47 à
313, donc ne coupe le contenu d'aucune. Ce qui reste de noir est dans la vidéo
et ne s'enlève qu'en la réexportant.

### Un raccord se juge aussi sur la matière, pas seulement sur la couleur

La bande des résultats se raccorde à la page par le bas sans lèvre ni voile :
c'est la progression elle-même qui finit sur `--background`. Elle ne le faisait
pas. Le commentaire de `globals.css` l'affirmait déjà, mais la progression
s'arrêtait sur `--bande-pale`, un lavande clair, contre le beige de la page :
il restait une couture nette que personne n'avait vérifiée parce que le
commentaire disait le contraire. **Un commentaire n'est pas une vérification.**

Une fois la couleur corrigée, le trait était toujours là, et pour une autre
raison : **le grain**. Il couvrait la bande d'`inset: 0` et s'arrêtait net à son
bord. Sur la dernière ligne de pixels, la couleur était déjà celle de la page
des deux côtés, mais texturée d'un côté et lisse de l'autre, et cette
différence de matière dessinait exactement la ligne que la couleur ne dessinait
plus. Le grain s'éteint donc au masque sur son dernier cinquième.

La leçon vaut pour tout raccord : quand deux surfaces se touchent, il faut que
**tout** se raccorde, la couleur, le grain, l'ombre, le flou. Une seule couche
qui s'arrête franchement suffit à produire une ligne, et on la cherche
longtemps dans la couleur.

### Le flou va derrière, jamais devant

Ce qui passe **sous** une fenêtre se brouille ; la fenêtre elle-même reste opaque.

- `backdrop-blur` de six pixels sur le **voile** de `dialog`, `alert-dialog` et `sheet`.
- Fonds pleins partout ailleurs : `bg-popover` pour les menus, bulles et listes,
  `bg-background` pour les fenêtres et panneaux.
- Le rayon du flou s'écrit **en toutes lettres** : `blur(var(--x))` est
  silencieusement jeté par le compilateur CSS.

**Première exception : les deux capsules de l'en-tête.** Elles sont reprises de
passionfroot à l'identique, sur décision de Rémy : rayon de 12 px et non 5,
dégradé blanc translucide, `backdrop-blur-md` et filet intérieur. Elles flottent
au-dessus de l'image du hero, et c'est le flou qui les fait tenir. L'exception ne
couvre **que** les deux capsules : à l'intérieur, les entrées, le bouton et le
panneau déroulant sont à 5 px comme partout.

**Seconde exception : la carte de cookies**, habillée dans
`apps/web/app/globals.css`. Elle reprend le verre des capsules au pixel, sur
décision de Rémy : même `card/85`, même flou de 12 px, même filet intérieur en
`--border`, même rayon de 12 px et même ombre. Son bouton, lui, est celui de
l'en-tête, donc à 5 px. Elle flotte au-dessus du contenu de la page comme les
capsules au-dessus du hero, et c'est la même raison qui justifie le même
traitement.

**Troisième exception : le panneau des menus déroulants de l'en-tête.** Même
`card/85`, même flou de douze pixels, sur insistance de Rémy. C'est celle des
trois qui se justifie le mieux : ce panneau **sort** d'une capsule en verre, il
lui est accroché, et un panneau opaque accroché à une capsule translucide se lit
comme deux objets étrangers posés l'un sous l'autre.

Ces trois exceptions couvrent tout ce qui a le droit de flouter par-devant. Une
quatrième ne s'ajoute pas parce qu'elle irait bien : elle se décide, et elle
s'écrit ici.

### L'habillage de l'en-tête suit la page, jamais le défilement

L'en-tête s'habille en blanc translucide **seulement quand une bande sombre
passe réellement dessous**. Le hero marque la sienne d'un `data-bande-sombre`,
et l'en-tête observe cet élément ; une page qui n'en déclare pas démarre et
reste en habillage de page.

La première version comparait `scrollY` à 120 px. Ce seuil décrivait le hero de
l'accueil et rien d'autre : en haut des cinq autres pages, qui n'ont pas de
bande sombre, l'en-tête restait blanc sur beige, soit **1,17:1**. Un nombre nu
qui décrit implicitement une page ne survit pas à la deuxième page.

### Une section peut avoir sa couleur, si l'objet qu'elle montre en a une

Le site est bleu, `--primary`. La section du livre est rouge, `--livre`, et
c'est la seule exception : c'est le seul écran qui montre un **objet ayant déjà
sa couleur**. La couverture de `Digital Selfmade` est d'un rouge franc, et
poser un bouton bleu à côté aurait fait cohabiter deux couleurs dont aucune ne
répond à l'autre.

Le rouge n'est pas choisi, il est **relevé dans l'image** : #e40d3a, au
compte-gouttes dans l'aplat de la couverture.

**Deux jetons, pas un.** Un plein et un creux ne demandent pas la même chose au
même rouge.

- `--livre` porte le plein, donc du blanc dessus : 4,75:1, juste au-dessus du
  seuil. Il ne change pas d'un thème à l'autre, parce qu'une couverture de livre
  n'a pas deux couleurs selon l'heure.
- `--livre-texte` porte le creux, donc le rouge sur la carte. En clair il
  descend à #c4092f pour tenir 6,13:1 sur `--card` ; en sombre il **remonte** à
  #ff5c7a, un rouge foncé sur #16161a étant illisible.

Le jour où une autre section montrerait un objet ayant sa couleur, elle se
décide et elle s'écrit ici. Ce n'est pas une permission d'ouvrir une palette.

### Deux actions d'importance comparable font deux boutons, un plein et un creux

C'est la paire de l'en-tête, « Découvrir » plein et « Connexion » creux, et elle
vaut partout. Un lien souligné à côté d'un bouton de 56 px se lit comme une note
de bas de page : il est légitime quand la seconde action est secondaire, il ment
quand elle ne l'est pas. Acheter le livre et en télécharger le chapitre offert
sont deux chemins comparables, et beaucoup prendront le second d'abord.

Le creux a la **même hauteur et le même rayon** que le plein, sinon les deux se
lisent comme deux objets voisins et non comme une paire. Sa bordure est en
`currentColor` : elle ne peut donc pas diverger de son texte, et elle tient
d'office ses 3:1 dès que le texte tient ses 4,5.

`BoutonScintillant` prend sa couleur par la propriété `fond`, une valeur CSS,
jamais une classe : le fond est écrit à deux endroits, le bouton et le masque
qui rentre son liseré de `--cut`, et ces deux-là doivent être la même couleur
au bit près, sinon le liseré change de teinte au lieu de scintiller.

**Un libellé long ne se coupe pas tout seul sans qu'on le vérifie.**
`whitespace-nowrap` sur un bouton posé dans une carte en `overflow-hidden`
produit la pire panne qui soit : le texte sort du bouton, la carte le coupe en
plein mot, et **la page ne déborde pas**, donc rien ne le signale. Un `nowrap`
se borne toujours à la largeur où il tient, `sm:whitespace-nowrap` et pas
davantage, et la hauteur se déclare en `min-h-*` pour que le bouton grandisse au
lieu de rogner son propre texte.

### La page des résultats est un sommaire, pas une page de vente

Trois décisions de Rémy, prises ensemble et qui se tiennent.

**Deux témoignages par ligne**, et la grille est plus étroite que la section qui
la porte, recentrée en `max-w-4xl`. Chaque carte porte désormais une phrase sous
le nom : à trois colonnes, cette phrase tombait sur trois lignes et les cartes
cessaient d'avoir la même hauteur de texte.

**Chaque carte porte sa phrase**, et elle n'est pas facultative : `description`
dans `temoignages`. Elle est **tirée de l'article de la personne**, jamais
inventée, et chaque chiffre qui y figure est prononcé dans l'entretien. Elle
reste courte parce qu'elle sert aussi de légende sur l'affiche du carrousel
d'accueil, où deux lignes de texte blanc sur une image deviennent illisibles.

**Aucun appel à l'action en bas de page.** Quelqu'un qui arrive au bout de ce
sommaire n'a pas encore lu un seul témoignage : lui proposer de réserver un
appel à cet endroit lui demande de décider avant de savoir. L'appel est au bon
endroit dans chaque article, au milieu et à la fin, une fois le parcours
raconté.

### Le pied de page est une carte, et ce qui est légal en sort

La forme vient du pied de page de functionhealth.com, fournie par Rémy : une
grande carte à ombre détachée des bords, le nom en haut à gauche, les colonnes
de liens en dessous, puis une rangée basse avec les réseaux à gauche et les
mentions à droite. Le copyright et les avertissements se posent **sous** la
carte, en petit.

**C'est ce découpage qui fait le travail, pas l'ombre.** Un pied de page
classique met les mentions, les liens et l'avertissement sur le même rang, et
le regard ne sait plus ce qu'il doit lire. Ici la carte contient ce qui sert à
naviguer ; ce qui est dessous n'est plus de la navigation, et la mise en page le
dit avant qu'on ait lu un mot. Les mentions restent **dans** la carte parce que
ce sont des pages du site, donc de la navigation ; l'avertissement est un texte
qu'on ne clique pas.

Il n'y a **pas de filet** entre la carte et les avertissements. La carte a déjà
son bord, son ombre et sa couleur : un trait de plus au même endroit ne sépare
pas mieux, il ajoute une ligne à regarder.

La dernière colonne ne porte **pas de formulaire**, contrairement à la
référence. Le site n'a ni base ni envoi d'emails, et un champ qui ressemble à
une inscription sans en être une est pire que pas de champ. Elle porte l'appel
vers Funnels Club, qui est ce que le pied de page a de plus utile à proposer à
quelqu'un arrivé jusqu'en bas.

Le rayon de la carte est `--rayon-jonction` et non 5 px : elle fait presque
toute la largeur de l'écran, c'est exactement le cas que l'exception d'échelle
décrit.

### Pas de tiret cadratin

Aucun `—` ni `–` dans un texte affiché à l'écran : libellés, messages, titres.
Une incise devient une virgule ou des parenthèses, une rupture un deux-points ou
deux phrases, un séparateur `Nom — Titre` un point médian `Nom · Titre`.

---

## Pas de backend, et c'est un choix

Il n'y a **aucune base de données** dans ce dépôt. Les pages sont rendues au
build et servies en statique par le CDN de Vercel ; ce qui doit s'exécuter à la
demande passe par une server action.

- Un formulaire qui envoie un mail se fait en server action, sans base.
- Du contenu qui ne change qu'à la mise à jour du site vit dans le dépôt.

### Le contenu vit dans `apps/web/contenu/site.ts`

Tout le texte du site tient dans ce fichier. Les pages ne font que le mettre en
forme. Corriger une phrase, c'est modifier ce fichier, rien d'autre.

Une seule exception : `apps/web/contenu/legal.ts`, qui porte les CGV, la
politique de confidentialité et les mentions légales. Ces trois documents pèsent
le double du reste du site, personne ne les édite à la phrase, et ils se
remplacent en bloc le jour où un juriste en produit une version neuve. Les
mélanger au contenu de vitrine noierait ce qui se relit sous ce qui ne se relit
pas.

Ce fichier a été produit par extraction du site en ligne, pas saisi à la main.
**Il est reproduit avec ses défauts**, signalés en commentaire là où ils
tombent : les CGV portent les traces d'un remplacement automatique raté, la
confidentialité a trois variables de gabarit jamais remplies. Réparer une phrase
de CGV au jugé, c'est modifier un document qui engage la société. Cela se
décide, cela ne se devine pas, et cela n'appartient pas à l'agent.

**Le texte est écrit par Rémy, jamais par l'agent.** C'est la règle la plus
stricte du dépôt et elle n'a pas d'exception. Un titre, une accroche, un
témoignage, un chiffre, un paragraphe de CGV : rien de tout cela ne s'invente,
même « en attendant », même « pour voir le rendu ». Un texte inventé qui a l'air
plausible se corrige ligne à ligne, des mois plus tard, quand plus personne ne
sait ce qui était vrai. Et sur un site de formation, un chiffre inventé est une
allégation commerciale.

Ce que l'agent a le droit d'écrire : les libellés d'interface strictement
nécessaires (« Ouvrir le menu »), signalés comme provisoires, et les
descriptions d'emplacement. Rien d'autre.

Une section sans texte n'affiche pas une phrase de remplissage : elle affiche un
`<Emplacement>` qui dit ce qu'elle attend. Il en reste plusieurs, et le site ne
part pas en production tant qu'il en reste un.

### Les articles de la lettre sont hébergés ici, pas seulement liés

Le flux Substack ne porte pas qu'un titre et un lien : il porte **le corps
entier de l'article**, ses images, son auteur et sa date. Le site n'en affichait
que l'accroche avant d'envoyer le lecteur ailleurs, donc tout le référencement de
textes écrits par Rémy allait à Substack. Chaque article a désormais sa page.

**Le HTML du flux est reconstruit, jamais recopié.** Sur vingt articles, Substack
émet 1 040 `div`, 220 `button`, 86 `form`, 86 `input` : ce sont ses encarts
d'abonnement et l'habillage de son éditeur. `lib/article-substack.ts` tient une
**liste blanche qui réécrit balise par balise** ; tout ce qui n'y est pas
disparaît, ses enfants restent, et aucun attribut ne survit sauf ceux listés. La
différence avec une liste noire n'est pas de style : une expression rationnelle
qui efface les `<script>` se contourne, une sortie réécrite ne peut contenir que
ce qu'on a émis. C'est ce qui rend le `dangerouslySetInnerHTML` acceptable.

Seule exception active : les `iframe` de `youtube-nocookie.com`, comparées sur
l'origine entière et non par `includes`. Une vidéo intégrée fait partie de
l'article.

**Le slug vient de Substack**, pas du titre. Un titre se corrige après
publication, une adresse non : le recalculer ferait changer nos adresses sous
les pieds de Google à chaque retouche.

**Les cotes des images se relisent dans le nom du fichier.** Substack laisse
`…_2816x1536.jpeg` dans l'adresse de son redimensionneur ; sans `width` et
`height`, la page saute au chargement.

**Ce que le code ne règle pas, et qui se décide.** Le même texte existe
maintenant à deux adresses, et `lettre.funnels.club` se déclare canonique de
lui-même. Nos pages font de même : les deux revendiquent l'original, et Google
choisit celle qui porte le plus de signaux. **La seule réparation complète est
chez Substack**, en y déclarant notre adresse comme canonique ou en cessant d'y
publier. C'est une décision de Rémy, pas de l'agent, et la mention de source en
bas de chaque article existe pour cette raison.

**Un article publié apparaît tout seul, et `dynamicParams` est ce qui le
permet.** `generateStaticParams` ne s'exécute qu'au build : elle fige la liste
des adresses connues au moment du déploiement. À `false`, un article publié
après coup aurait **une carte sur `/articles`, qui rafraîchit toute seule, et une
page qui rend 404** jusqu'au prochain déploiement. Le défaut est silencieux : le
build passe, la liste se met à jour, et seul un visiteur qui clique le découvre.

Il a été vérifié plutôt que supposé : en limitant `generateStaticParams` à trois
articles puis en construisant, les articles hors liste rendent 200 avec leur
texte entier, et un slug inventé rend toujours 404. La même règle vaut pour les
pages de pagination.

Le délai est de **dix minutes**, dans `FRAICHEUR`. C'est aussi la fenêtre
pendant laquelle l'adresse d'un article tout neuf peut encore rendre un 404,
faute d'être dans le flux en cache.

**Le blog n'affichera jamais que les vingt derniers articles**, parce que c'est
ce que le flux Substack expose. Le vingt et unième publié fait disparaître le
plus ancien, page comprise.

### Le contenu extérieur arrive par flux RSS

La lettre est lue dans le flux Substack de `lettre.funnels.club`, au build puis
toutes les heures (`next: { revalidate }`). Les pages restent statiques et
servies par le CDN ; un article publié apparaît sans redéploiement. Si le flux
tombe, `lireArticles` renvoie une liste vide plutôt que de faire échouer le
build. C'est la seule donnée extérieure du site, et elle ne justifie ni base ni
serveur.
- Le jour où il faut relire ce qu'on a écrit, ou qu'une personne modifie le
  contenu sans passer par le code, alors il faut Convex **et** l'auth qui va
  avec, pas l'un sans l'autre : une fonction Convex est publique par nature, qui
  connaît l'URL du déploiement peut l'appeler.

### Pas de registre des droits non plus

La stack de départ impose qu'aucune page ne se crée sans son droit, avec un
registre `PAGES` et un script qui refuse de construire sans. **Un site vitrine
n'a aucun écran à protéger**, donc ni registre ni script ici. Ce n'est pas un
oubli : c'est à remonter en même temps que l'authentification, le jour où une
première page cesse d'être publique.

---

## Vérifications avant de conclure

```sh
pnpm turbo run lint check-types
pnpm turbo run build
```
