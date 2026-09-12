import { LogoFunnels } from "@/components/logo-funnels";
import { TexteRoulant } from "@/components/texte-roulant";
import { offres } from "@/contenu/site";
import { ArrowRight } from "lucide-react";

/**
 * Les deux offres en fin d'article, sous un avis.
 *
 * **Ce sont les cartes de l'accueil, en plus court.** Celles de l'accueil
 * portent une courbe animée et une conversation qui se joue : elles ouvrent la
 * page et ont le temps de se montrer. Ici, elles ferment un article de quinze
 * paragraphes, et quelqu'un qui arrive au bout a déjà tout lu. Ce qu'il lui faut
 * à cet endroit, c'est le nom, une phrase et un bouton.
 *
 * Le texte est celui de `site.ts`, au mot près, et il n'y en a pas d'autre : une
 * accroche écrite pour cette place serait un texte de plus à relire, et il
 * n'appartient pas à l'agent d'en écrire.
 *
 * **Les deux sont là et non pas une seule**, sur décision de Rémy. Quelqu'un qui
 * vient de lire un avis ne sait pas encore lequel des deux chemins est le sien,
 * et choisir à sa place reviendrait à envoyer tout le monde au même endroit.
 */
export function AppelOffres() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 lg:grid-cols-2">
          {offres.map((offre) => (
            <article
              key={offre.id}
              /* `h-full` sur la carte et `mt-auto` sur l'action : c'est ce
                 couple qui aligne les deux boutons entre eux. Sans lui, chaque
                 bouton suit son propre texte, et deux descriptions de longueur
                 différente les décalent de dix pixels. */
              className="relief-verre flex h-full flex-col rounded-md border border-border bg-card p-6 sm:p-8"
            >
              {/* `h3` et non `h2`, et ce n'est pas un détail de balise. Ces
                  deux cartes ferment un article dont les chapitres sont des
                  `h2` : au même rang, « Funnels Club » et « Consulting privé »
                  se retrouvaient dans le plan de la page au même niveau que les
                  chapitres, et une page qui annonce neuf `h2` dont deux hors
                  sujet dilue ce dont elle parle. */}
              <h3 className="titre flex items-center text-2xl text-card-foreground sm:text-3xl">
                <LogoFunnels
                  lettre={offre.id === "funnels-club" ? "F" : "C"}
                  className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]"
                />
                {offre.nom}
              </h3>

              <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
                {offre.texte}
              </p>

              <div className="mt-auto pt-6">
                <a
                  href={offre.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/roule inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <TexteRoulant>{offre.action}</TexteRoulant>
                  <ArrowRight aria-hidden className="size-4 shrink-0" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
