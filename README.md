# site

Le site de Rémy Jupille. Vitrine, monté sur la stack de départ.

## Les pages

| Chemin | Ce qu'elle fait |
| --- | --- |
| `/` | La promesse, à qui elle s'adresse, les deux programmes, un extrait de preuve, la biographie courte, les questions. |
| `/resultats` | La mosaïque des résultats clients, chiffres et citations. |
| `/a-propos` | Le parcours. |
| `/cgv`, `/confidentialite`, `/mentions` | Les pages légales. |

Les six pages sont rendues au build et servies en statique.

**Le texte du site vit dans `apps/web/contenu/site.ts`**, pas dans les pages.
Ce qui attend encore sa version réelle y est marqué `A_REMPLIR` et s'affiche
comme tel à l'écran. Voir l'issue #1 pour la liste de ce qui manque.

**Ni base de données, ni authentification, ni envoi d'emails.** Convex, Better
Auth et Resend font partie de la stack de départ mais ne sont pas installés
ici : ce site n'a rien à lire ni à écrire, et aucun écran à protéger. Le jour où
ça change, on les remonte depuis `MONTER-LA-STACK.md`.

Le règlement du dépôt est dans [`AGENTS.md`](AGENTS.md). Il vaut pour toute
contribution, humaine ou automatique, et se met à jour dans le même commit que
le changement qu'il décrit.

## La pile

| Rôle | Brique |
| --- | --- |
| Monorepo | Turborepo + pnpm workspaces |
| Front | Next.js 16 (App Router, React 19) |
| Styles | Tailwind v4, CSS-first, thème dans `packages/ui/src/styles/globals.css` |
| Composants | shadcn/ui, puis ReUI, puis Bklit pour les graphiques |
| Icônes | Lucide |
| Notifications | Sonner |
| Thème clair/sombre | next-themes |
| Hébergement | Vercel |

## Le dépôt

```
apps/web                   L'application Next.
packages/ui                Tous les composants, le thème, les jetons.
packages/eslint-config     Le lint partagé.
packages/typescript-config Les tsconfig partagés.
```

## Lancer

```bash
pnpm install
pnpm dev       # http://localhost:3000
```

## Vérifier

```bash
pnpm turbo run lint check-types
pnpm turbo run build
```

## Mise en production

Le projet Vercel est relié au dépôt. Il détecte Turborepo tout seul et lance
`turbo run build` : il n'y a **aucune commande de build à régler à la main**, et
aucune variable d'environnement à poser.

**Chaque push sur `main` déclenche un déploiement de production.** D'où la règle
qui ouvre `AGENTS.md` : committer est libre, pousser demande le feu vert.

## Les issues sont la mémoire du projet

Une fenêtre de discussion se ferme et son contenu est perdu ; une issue se
rouvre depuis n'importe quelle session. Une issue par fonctionnalité, écrite
avant le code, qui dit ce qu'on veut et pourquoi, pas comment.

```bash
gh issue create --title "..." --body "..."
gh issue view 12 --comments
```
