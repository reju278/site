import { TexteRoulant } from "@/components/texte-roulant";
import { liens } from "@/contenu/site";
import { ArrowRight } from "lucide-react";

/**
 * L'appel à l'action posé au milieu d'un article d'avis.
 *
 * **Au milieu, et c'est le point.** Les deux cartes d'offres ferment déjà
 * l'article ; celui-ci s'adresse à qui vient de lire les résultats de quelqu'un
 * et se demande, à cet instant précis, comment ça marche. Attendre la fin, c'est
 * ne parler qu'à ceux qui ont tout lu.
 *
 * **Deux chemins et pas un**, la formation gratuite et l'appel, parce que ce
 * sont deux moments différents : on regarde d'abord, on parle ensuite. Le
 * premier est en plein, le second en creux, à la même hauteur et au même rayon :
 * c'est la paire de boutons du projet, voir `AGENTS.md`. Le creux a sa bordure
 * en `currentColor`, donc elle ne peut pas diverger de son texte.
 *
 * Les deux adresses portent leur balise de provenance, déjà posée dans `liens`.
 */
export function AppelFormation() {
  return (
    <aside className="relief-verre my-14 rounded-md border border-border bg-card p-6 sm:my-16 sm:p-8">
      <p className="titre text-2xl text-balance text-card-foreground sm:text-3xl">
        Le tunnel de vente dont il parle, expliqué en détail
      </p>

      <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
        Rémy le montre en entier dans une vidéo de formation gratuite : les
        quatre étapes, et comment il s&apos;adapte à une formation, à du coaching
        ou à de la prestation de services.
      </p>

      {/* `flex-col` puis `sm:flex-row` : deux boutons côte à côte sur 375 px
          donnent deux libellés coupés en trois lignes. `w-full` sur étroit et
          `w-auto` ensuite, pour la même raison. */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={liens.formation}
          target="_blank"
          rel="noreferrer"
          className="group/roule inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
        >
          <TexteRoulant>Voir la formation gratuite</TexteRoulant>
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </a>

        <a
          href={liens.appel}
          target="_blank"
          rel="noreferrer"
          className="group/roule inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-current px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
        >
          <TexteRoulant>Réserver un appel découverte</TexteRoulant>
        </a>
      </div>
    </aside>
  );
}
