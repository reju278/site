# site

Site vitrine, monté sur la stack de départ.

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
