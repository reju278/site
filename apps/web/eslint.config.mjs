import { nextJsConfig } from "@repo/eslint-config/next-js";
import globals from "globals";

/** @type {import("eslint").Linter.Config} */
export default [
  {
    /* **Le dossier des builds de vérification sort du lint.**

       `AGENTS.md` demande de construire dans `.next-verif` pour ne pas écraser
       le `.next` que sert le serveur de Rémy. Next ignore `.next` d'office mais
       pas celui-là : le lint partait alors analyser le JavaScript compilé et
       rendait des centaines d'avertissements sur du code qui n'est pas le
       nôtre. C'est arrivé trois fois avant d'être écrit ici. */
    ignores: [".next-verif/**"],
  },
  ...nextJsConfig,
  {
    // Les fichiers de configuration tournent dans Node, pas dans le navigateur.
    files: ["*.js", "*.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },
];
