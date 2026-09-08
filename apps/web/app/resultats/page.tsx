import { Section, TitreSection } from "@/components/section";
import { TuileResultat, type Resultat } from "@/components/tuile-resultat";
import { chiffres, liens, resultats } from "@/contenu/site";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résultats",
  description:
    "Ce que les membres de Funnels Club et du F.C. Mastermind ont obtenu, avec leurs chiffres et leurs mots.",
};

export default function Resultats() {
  return (
    <>
      <Section className="border-b-0">
        <TitreSection
          etiquette="La preuve"
          titre="Les résultats, et à qui ils appartiennent."
          texte="Chaque chiffre de cette page est celui d'une personne identifiée, citée avec son accord. Aucun n'est une moyenne, aucun n'est une promesse : ce sont des cas, et un cas ne se reproduit pas tout seul."
        />

        <dl className="mt-14 grid gap-10 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {chiffres.map((chiffre) => (
            <div key={chiffre.libelle}>
              <dt className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {chiffre.valeur}
                <span className="text-2xl sm:text-3xl">{chiffre.unite}</span>
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {chiffre.libelle}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* La mosaïque. Chiffres et citations alternent : c'est ce battement qui
          empêche la grille de ressembler à un tableau. */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((resultat, index) => (
            <TuileResultat key={index} {...(resultat as Resultat)} />
          ))}
        </div>
      </Section>

      <Section className="border-b-0">
        <div className="rounded-lg border border-border bg-card px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-card-foreground sm:text-4xl">
            Le prochain cas de cette page.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-muted-foreground">
            Funnels Club installe l'offre, le tunnel et la publicité. Le reste
            dépend de ce que vous y mettez.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
                Découvrir Funnels Club
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
