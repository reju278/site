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

### Le flou va derrière, jamais devant

Ce qui passe **sous** une fenêtre se brouille ; la fenêtre elle-même reste opaque.

- `backdrop-blur` de six pixels sur le **voile** de `dialog`, `alert-dialog` et `sheet`.
- Fonds pleins partout ailleurs : `bg-popover` pour les menus, bulles et listes,
  `bg-background` pour les fenêtres et panneaux.
- Le rayon du flou s'écrit **en toutes lettres** : `blur(var(--x))` est
  silencieusement jeté par le compilateur CSS.

**Une exception, et une seule : l'en-tête.** Les deux capsules flottantes de
`apps/web/components/en-tete.tsx` sont reprises de passionfroot à l'identique,
sur décision de Rémy : rayon de 12 px et non 5, dégradé blanc translucide,
`backdrop-blur-md` et filet intérieur. Elles flottent au-dessus de l'image du
hero, et c'est le flou qui les fait tenir. L'exception s'arrête là : partout
ailleurs, rayon de 5 px et fonds pleins.

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
