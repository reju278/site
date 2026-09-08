import { SITE } from "@/contenu/site";
import type { MetadataRoute } from "next";

/**
 * Le plan du site.
 *
 * Les pages légales n'y figurent pas : elles portent `robots: { index: false }`
 * et n'ont jamais amené personne. Les inscrire reviendrait à demander leur
 * indexation tout en la refusant ailleurs.
 *
 * Toute page publique nouvelle s'ajoute ici. C'est une liste écrite à la main
 * et non une lecture du dossier `app` : un fichier oublié se remarque, une
 * page indexée par erreur beaucoup moins.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const modifie = new Date();

  return [
    { url: SITE, lastModified: modifie, priority: 1 },
    { url: `${SITE}/resultats`, lastModified: modifie, priority: 0.8 },
    { url: `${SITE}/articles`, lastModified: modifie, priority: 0.7 },
    { url: `${SITE}/podcast`, lastModified: modifie, priority: 0.7 },
  ];
}
