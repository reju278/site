# site

Site vitrine, monté sur la stack de départ.

**Ni authentification ni envoi d'emails.** Better Auth et Resend font partie de
la stack de départ mais ne sont pas installés ici : ce site n'a aucun écran à
protéger. Le jour où une partie privée arrive, on les remonte depuis
`MONTER-LA-STACK.md`.

Le règlement du dépôt est dans [`AGENTS.md`](AGENTS.md). Il vaut pour toute
contribution, humaine ou automatique, et se met à jour dans le même commit que
le changement qu'il décrit.

## La pile

| Rôle | Brique |
| --- | --- |
| Monorepo | Turborepo + pnpm workspaces |
| Front | Next.js 16 (App Router, React 19) |
| Backend | Convex (`packages/backend`) |
| Styles | Tailwind v4, CSS-first, thème dans `packages/ui/src/styles/globals.css` |
| Composants | shadcn/ui, puis ReUI, puis Bklit pour les graphiques |
| Icônes | Lucide |
| Notifications | Sonner |
| Thème clair/sombre | next-themes |
| Hébergement | Vercel |

## Le dépôt

```
apps/web                  L'application Next.
packages/backend          Convex : schéma et fonctions.
packages/ui               Tous les composants, le thème, les jetons.
packages/eslint-config    Le lint partagé.
packages/typescript-config Les tsconfig partagés.
```

## Lancer

```bash
pnpm install
pnpm setup     # provisionne le déploiement Convex de dev, une fois
pnpm dev       # l'app sur http://localhost:3000, et convex dev en parallèle
```

## Vérifier

```bash
pnpm turbo run lint check-types
pnpm turbo run build
```

## Les variables d'environnement

Côté Convex, dans les **deux** déploiements (dev et prod) :

```bash
pnpm --filter @repo/backend exec convex env set NOM valeur
```

| Variable | À quoi elle sert |
| --- | --- |
| `SITE_URL` | L'adresse publique du site. |

Côté app, rien à écrire à la main : `apps/web/next.config.js` dérive tout du
`.env.local` de `@repo/backend`, qui est la source de vérité unique de l'URL
Convex.

## Mise en production

Sur Vercel, la commande de build est `pnpm vercel-build` depuis la racine du
dépôt : elle déploie Convex, récupère l'URL de production et la donne au build
Next dans la foulée. La seule variable à poser dans le projet Vercel est
`CONVEX_DEPLOY_KEY`.

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
