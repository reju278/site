/**
 * Les tunnels : les racines qui ne sont pas des pages du site.
 *
 * Un tunnel est une page où l'on arrive par un lien qu'on a reçu, publicité ou
 * message, et dont la règle est qu'on n'en sort que par l'appel. Il ne porte
 * donc ni l'en-tête ni le pied de page du site, qui offriraient une trentaine
 * de portes de sortie, menu déroulant compris.
 *
 * **La liste vit ici et non dans le composant qui la lit.** Elle sert à trois
 * endroits qui doivent tomber d'accord : le filtre qui retire l'en-tête et le
 * pied de page, et, le jour où un troisième tunnel arrive, ce qui décidera de
 * son cadre. Une règle écrite à deux endroits finit par n'être corrigée qu'à
 * un seul.
 *
 * Un tunnel n'est jamais dans `sitemap.ts`, jamais dans les menus, jamais dans
 * le pied de page, et porte toujours son `robots: { index: false }` dans son
 * gabarit. Ce fichier ne le vérifie pas : il ne fait que nommer les racines.
 */
export const TUNNELS = ["/hub", "/immersion", "/preparation"] as const;

/** L'adresse est-elle dans un tunnel, racine ou sous-page ? */
export function dansUnTunnel(chemin: string | null): boolean {
  if (!chemin) return false;
  return TUNNELS.some(
    (racine) => chemin === racine || chemin.startsWith(`${racine}/`),
  );
}
