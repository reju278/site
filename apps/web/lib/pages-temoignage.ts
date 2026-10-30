/**
 * Les adresses des pages de témoignage en tunnel, `go.funnels.club/<clé>`.
 *
 * **Seulement les clés, et dans un module à part** : `lib/tunnels.ts` et
 * `FournisseurTheme` les lisent côté client, et le contenu de ces pages
 * (`contenu/temoignages-tunnel.ts`) tire `avis.ts`, cinq cents kilooctets
 * qui n'ont rien à faire dans le paquet JavaScript.
 *
 * La clé est aussi la provenance Hyros du bouton d'appel (`el=<clé>`) : voir
 * `appelDepuis`. Un second entretien prend le suffixe `-mastermind`, comme
 * son article sur `/resultats`.
 */
export const CLES_TEMOIGNAGE = [
  "christian",
  "roland",
  "augustin",
  "yannick-sylvie",
  "olga",
  "sandrine",
  "tatiana",
  "charlotte",
  "francois",
  "jeremy",
  "cedric",
  "corentin",
  "mathieu",
  "valerie",
  "joel",
  "lilian",
  "corentin-mastermind",
  "sebastien",
  "patrick",
  "guy",
  "roland-mastermind",
  "francois-mastermind",
] as const;

export type CleTemoignage = (typeof CLES_TEMOIGNAGE)[number];

/** Les chemins, `/roland` et les autres. */
export const CHEMINS_TEMOIGNAGE = CLES_TEMOIGNAGE.map((cle) => `/${cle}`);
