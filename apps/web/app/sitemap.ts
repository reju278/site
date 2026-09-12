import { TOUT } from "@/app/articles/page";
import { PAR_PAGE, adressePage } from "@/components/grille-articles";
import { avis } from "@/contenu/avis";
import { SITE } from "@/contenu/site";
import { articlesPublies, lireArticles } from "@/lib/flux";
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
 *
 * **Les pages du blog font exception à cette règle, et il le faut.** Leur
 * nombre dépend du flux Substack : l'écrire à la main condamnerait le plan à
 * être faux dès la publication suivante. Elles sont donc comptées, et la seule
 * chose écrite ici est qu'elles existent.
 *
 * La première page du blog est `/articles`, pas `/articles/page/1` :
 * `adressePage` le sait, et le plan ne peut donc pas inscrire de doublon.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const modifie = new Date();

  const articles = await lireArticles(TOUT);
  const pagesBlog = Math.max(1, Math.ceil(articles.length / PAR_PAGE));

  /* À partir de la deuxième : la première est déjà dans la liste écrite. */
  const suite = Array.from({ length: Math.max(0, pagesBlog - 1) }, (_, i) => ({
    url: `${SITE}${adressePage(i + 2)}`,
    lastModified: modifie,
    priority: 0.5,
  }));

  return [
    { url: SITE, lastModified: modifie, priority: 1 },
    { url: `${SITE}/resultats`, lastModified: modifie, priority: 0.8 },

    /* Les avis, une page par témoignage. Elles sont comptées et non écrites à
       la main, pour la même raison que les pages du blog : leur liste vit dans
       `avis.ts`, et la recopier ici la condamnerait à diverger. Elles pèsent
       moins que leur sommaire, qui reste la porte d'entrée du sujet. */
    ...avis.map((a) => ({
      url: `${SITE}/resultats/${a.slug}`,
      lastModified: modifie,
      priority: 0.6,
    })),
    { url: `${SITE}/articles`, lastModified: modifie, priority: 0.7 },

    /* Chaque article de la lettre a maintenant sa page ici, et sa date de
       publication sert de `lastModified` : c'est la seule date vraie dont on
       dispose, et une date d'aujourd'hui posée sur un texte de l'an dernier
       dirait à Google qu'il a changé alors qu'il n'a pas bougé.

       Ils portent la même priorité que les avis : ce sont les pages de fond du
       site, celles qui répondent à une recherche précise. */
    ...articlesPublies(articles).map((a) => ({
      url: `${SITE}/articles/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : modifie,
      priority: 0.6,
    })),
    { url: `${SITE}/podcast`, lastModified: modifie, priority: 0.7 },
    ...suite,
  ];
}
