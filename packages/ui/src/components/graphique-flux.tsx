/**
 * Le point d'entrée des graphiques Bklit, pour l'application.
 *
 * Les exports du paquet ne couvrent que `./components/*`, qui se résout sur un
 * fichier : les composants du registre vivent dans des fichiers voisins du
 * dossier `charts/`, et l'application aurait dû les importer un par un en
 * connaissant l'arborescence interne du registre.
 *
 * Ce fichier les réunit. Il est **à nous** et non au registre : il ne contient
 * aucun code repris, seulement des réexports, donc une mise à jour du registre
 * ne le touchera pas et ne le fera pas diverger.
 */
export { AreaChart } from "./charts/area-chart";
export { Area } from "./charts/area";
export { ChartTooltip } from "./charts/tooltip";
export { BarChart } from "./charts/bar-chart";
export { Bar } from "./charts/bar";
export { Grid } from "./charts/grid";
