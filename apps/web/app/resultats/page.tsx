import { Emplacement, Section } from "@/components/section";
import { chiffres, liens, resultats, sections } from "@/contenu/site";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résultats",
};

export default function Resultats() {
  const vide = chiffres.length === 0 && resultats.length === 0;

  return (
    <>
      <section className="px-5 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-6xl text-center">
          {/* Repris de remy-jupille.com, au mot près. */}
          <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
            Résultats de Funnels Club
          </h1>
        </div>
      </section>

      <Section>
        {vide ? (
          <Emplacement attendu={sections.preuve.attendu} />
        ) : (
          <p className="text-muted-foreground">
            {resultats.length} résultats.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          {/* Repris de remy-jupille.com, au mot près. */}
          <Button asChild size="lg" className="h-11 font-semibold">
            <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
              Appel découverte gratuit
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </Section>
    </>
  );
}
