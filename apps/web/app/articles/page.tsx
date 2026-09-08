import { Section } from "@/components/section";
import { lettre, liens } from "@/contenu/site";
import { formaterDate, lireArticles } from "@/lib/flux";
import { Button } from "@repo/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: lettre.nom,
  description: lettre.baseline,
};

export default async function Articles() {
  const articles = await lireArticles(24);

  return (
    <>
      <section className="px-5 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
            {lettre.nom}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            {lettre.baseline}
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="h-11 font-semibold">
              <a href={liens.lettre} target="_blank" rel="noreferrer">
                S'abonner à la lettre
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <a
              key={article.lien}
              href={article.lien}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring"
            >
              {article.image ? (
                // Une image de Substack, servie par leur CDN et de taille
                // inconnue au build : `next/image` n'y gagnerait rien et
                // exigerait de déclarer leur domaine.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="aspect-16/9 w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm text-muted-foreground">
                  {formaterDate(article.date)}
                </p>
                <h2 className="mt-2 text-lg leading-snug font-semibold text-balance text-card-foreground">
                  {article.titre}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {article.chapeau}
                </p>
              </div>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
