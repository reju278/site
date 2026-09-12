import { Section } from "@/components/section";
import { EnTetePage } from "@/components/en-tete-page";
import { podcast } from "@/contenu/site";
import { formaterDate, lireEpisodes } from "@/lib/flux";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/podcast" },
  title: podcast.nom,
};

export default async function Podcast() {
  const episodes = await lireEpisodes(24);

  return (
    <>
      <EnTetePage>
        <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
          {podcast.nom}
        </h1>

        {/* Les plateformes plutôt qu'un lecteur intégré : un podcast s'écoute
              dans l'application où l'on est déjà abonné, pas dans un onglet de
              navigateur qu'on ferme en changeant de page. */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {podcast.plateformes.map((plateforme) => (
            <a
              key={plateforme.nom}
              href={plateforme.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
            >
              {plateforme.nom}
              <ArrowUpRight className="size-4 opacity-50" />
            </a>
          ))}
        </div>
      </EnTetePage>

      <Section>
        {episodes.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Les épisodes n'ont pas pu être chargés. Ils restent disponibles sur
            les plateformes ci-dessus.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {episodes.map((episode) => (
              <li key={episode.lien}>
                <a
                  href={episode.lien}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-2 py-6 transition-colors hover:bg-accent/40 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  {/* La date et la durée d'abord, en colonne fixe : c'est ce
                      qu'on lit pour décider si on a le temps. */}
                  <p className="shrink-0 text-sm text-muted-foreground tabular-nums sm:w-44">
                    {formaterDate(episode.date)}
                    {episode.duree ? ` · ${episode.duree}` : ""}
                  </p>

                  <div className="min-w-0">
                    <h2 className="text-lg leading-snug font-semibold text-balance text-foreground">
                      {episode.titre}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {episode.chapeau}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
