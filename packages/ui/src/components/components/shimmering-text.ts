/**
 * Un relais, pour que l'import du registre trouve ce qu'il cherche.
 *
 * `chart-loading-label.tsx`, venu du registre Bklit, importe
 * `../components/shimmering-text`. Depuis `src/components/charts/`, ce chemin
 * vise `src/components/components/shimmering-text`, qui n'existait pas : leur
 * arborescence suppose `charts/` à côté de `components/`, la nôtre l'a dedans.
 *
 * **On ne corrige pas leur fichier**, la règle du projet l'interdit : il doit
 * rester alignable sur leurs mises à jour. Ce relais est à nous, il ne contient
 * qu'un réexport, et il rend leur chemin valide sans y toucher. Il disparaîtra
 * le jour où le registre corrigera son import, sans rien casser au passage.
 */
export { ShimmeringText } from "../shimmering-text";
