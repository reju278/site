import { GrilleArticles, PAR_PAGE } from "@/components/grille-articles";
import { lettre } from "@/contenu/site";
import { lireArticles } from "@/lib/flux";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/articles" },
  title: lettre.titreBlog,
  /* L'ancienne description était la baseline, soit vingt-six caractères : la
     règle du projet en demande entre 120 et 160, et une description trop courte
     laisse Google en inventer une à partir de la page. */
  description: lettre.description,
};

/**
 * La première page du blog.
 *
 * Elle vit à `/articles` et non à `/articles/page/1` : deux adresses pour la
 * même liste feraient un doublon aux yeux de Google, et c'est exactement ce que
 * la règle des canoniques du projet cherche à éviter.
 *
 * `TOUT` borne la lecture du flux. Substack n'en renvoie de toute façon qu'une
 * cinquantaine, mais un nombre écrit ici évite qu'une évolution de leur côté
 * fasse silencieusement gonfler le build.
 */
export const TOUT = 120;

export default async function Articles() {
  const articles = await lireArticles(TOUT);
  const total = Math.max(1, Math.ceil(articles.length / PAR_PAGE));

  return (
    <GrilleArticles
      articles={articles.slice(0, PAR_PAGE)}
      page={1}
      total={total}
    />
  );
}
