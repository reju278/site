import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  // Le code généré par Convex n'est pas à nous : il n'est ni lu ni corrigé.
  { ignores: ["convex/_generated/**"] },
  ...config,
];
