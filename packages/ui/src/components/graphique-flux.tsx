/**
 * Le point d'entrée du graphique en flux, pour l'application.
 *
 * Les exports du paquet ne couvrent que `./components/*`, qui se résout sur un
 * fichier : `LiveLineChart` et `LiveLine` vivent dans deux fichiers voisins du
 * dossier `charts/`, et l'application aurait dû les importer séparément en
 * connaissant l'arborescence interne du registre.
 *
 * Ce fichier les réunit. Il est **à nous** et non au registre : il ne contient
 * aucun code repris, seulement des réexports, donc une mise à jour du registre
 * ne le touchera pas et ne le fera pas diverger.
 */
export { LiveLineChart } from "./charts/live-line-chart";
export type { LiveLinePoint } from "./charts/live-line-chart";
export { LiveLine } from "./charts/live-line";
