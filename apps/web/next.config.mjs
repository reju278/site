import { config } from "dotenv";

// Le `.env.local` de `@repo/backend` est la source de vérité unique de l'URL
// Convex. Aucune app n'a son propre `.env` : deux fichiers finiraient par
// diverger, et le build se ferait avec l'URL d'un autre déploiement.
config({ path: "../../packages/backend/.env.local" });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Les routes HTTP de Convex (donc l'auth) vivent sur `.convex.site`, pas
// `.convex.cloud`.
const convexSiteUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
  convexUrl?.replace(/\.convex\.cloud$/, ".convex.site");

/** @type {import("next").NextConfig} */
export default {
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/backend"],
  env: {
    NEXT_PUBLIC_CONVEX_URL: convexUrl,
    NEXT_PUBLIC_CONVEX_SITE_URL: convexSiteUrl,
  },
};
