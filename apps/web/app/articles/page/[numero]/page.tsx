import { TOUT } from "@/app/articles/page";
import { GrilleArticles, PAR_PAGE } from "@/components/grille-articles";
import { lettre } from "@/contenu/site";
import { lireArticles } from "@/lib/flux";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Les pages suivantes du blog, à partir de la deuxième.
 *
 * La première n'est pas ici : elle vit à `/articles`, et lui donner en plus une
 * adresse `/articles/page/1` ferait deux adresses pour la même liste.
 *
 * **Les pages sont construites au build**, par `generateStaticParams` : elles
 * sont donc servies en statique par le CDN comme le reste du site, et se
 * rafraîchissent avec le flux.
 *
 * **`dynamicParams` est à `true` pour la même raison que sur la page d'un
 * article** : `generateStaticParams` fige la liste au build. Vingt articles et
 * neuf par page font trois pages ; le jour où il y en aurait davantage, une
 * quatrième page rendrait un 404 alors que la pagination y renverrait. À
 * `true`, elle se construit à la demande, et un numéro qui dépasse le compte
 * réel passe quand même par le `notFound()` plus bas.
 */
export const dynamicParams = true;

type Params = { params: Promise<{ numero: string }> };

async function pages(): Promise<number> {
  const articles = await lireArticles(TOUT);
  return Math.max(1, Math.ceil(articles.length / PAR_PAGE));
}

export async function generateStaticParams() {
  const total = await pages();

  /* On commence à deux : la première page est `/articles`. */
  return Array.from({ length: Math.max(0, total - 1) }, (unused, i) => ({
    numero: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { numero } = await params;

  /* Chaque page porte son propre titre et sa propre canonique. Sans eux, les
     pages deux et suivantes seraient toutes des doublons de la première aux
     yeux de Google, ce qui est le cas d'école que la règle du projet vise. */
  return {
    alternates: { canonical: `/articles/page/${numero}` },
    title: `${lettre.titreBlog}, page ${numero}`,
    description: lettre.description,
  };
}

export default async function PageArticles({ params }: Params) {
  const { numero } = await params;
  const page = Number(numero);

  const articles = await lireArticles(TOUT);
  const total = Math.max(1, Math.ceil(articles.length / PAR_PAGE));

  /* Un numéro qui n'est pas un entier, ou hors de portée, rend un 404. Il vaut
     mieux dire que la page n'existe pas que d'en servir une vide : un robot
     indexerait la seconde. */
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();

  const debut = (page - 1) * PAR_PAGE;

  return (
    <GrilleArticles
      articles={articles.slice(debut, debut + PAR_PAGE)}
      page={page}
      total={total}
    />
  );
}
