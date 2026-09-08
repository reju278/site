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

### Thème clair et sombre : toujours les deux

Chaque écran doit fonctionner dans les deux. Ce n'est pas une finition de fin de
projet, c'est une contrainte de chaque modification.

- Uniquement des jetons sémantiques : `bg-background`, `text-foreground`,
  `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`.
- **Jamais de couleur en dur** (`bg-white`, `#111`, `text-gray-500`) : illisible
  dans l'autre thème. Si un jeton manque, l'ajouter pour `:root` **et** `.dark`.
- Vérifier l'écran dans les deux thèmes avant de le considérer terminé.

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

### Le flou va derrière, jamais devant

Ce qui passe **sous** une fenêtre se brouille ; la fenêtre elle-même reste opaque.

- `backdrop-blur` de six pixels sur le **voile** de `dialog`, `alert-dialog` et `sheet`.
- Fonds pleins partout ailleurs : `bg-popover` pour les menus, bulles et listes,
  `bg-background` pour les fenêtres et panneaux.
- Le rayon du flou s'écrit **en toutes lettres** : `blur(var(--x))` est
  silencieusement jeté par le compilateur CSS.

**Une exception, et une seule : les deux capsules de l'en-tête.** Elles sont
reprises de passionfroot à l'identique, sur décision de Rémy : rayon de 12 px
et non 5, dégradé blanc translucide, `backdrop-blur-md` et filet intérieur.
Elles flottent au-dessus de l'image du hero, et c'est le flou qui les fait
tenir. L'exception ne couvre **que** les deux capsules : à l'intérieur, les
entrées, le bouton et le panneau déroulant sont à 5 px comme partout.

### L'habillage de l'en-tête suit la page, jamais le défilement

L'en-tête s'habille en blanc translucide **seulement quand une bande sombre
passe réellement dessous**. Le hero marque la sienne d'un `data-bande-sombre`,
et l'en-tête observe cet élément ; une page qui n'en déclare pas démarre et
reste en habillage de page.

La première version comparait `scrollY` à 120 px. Ce seuil décrivait le hero de
l'accueil et rien d'autre : en haut des cinq autres pages, qui n'ont pas de
bande sombre, l'en-tête restait blanc sur beige, soit **1,17:1**. Un nombre nu
qui décrit implicitement une page ne survit pas à la deuxième page.

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
