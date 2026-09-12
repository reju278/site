import { BoutonScintillant } from "@/components/bouton-scintillant";
import { EnTetePage } from "@/components/en-tete-page";
import { LecteurVideo } from "@/components/lecteur-video";
import { Section } from "@/components/section";
import { liens, temoignages } from "@/contenu/site";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/resultats" },
  title: "Résultats",
  description:
    "Les témoignages vidéo des membres de Funnels Club, en entretien avec Rémy Jupille.",
};

export default function Resultats() {
  return (
    <>
      <EnTetePage>
        {/* Repris de remy-jupille.com, au mot près. */}
        <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
          Résultats de Funnels Club
        </h1>
      </EnTetePage>

      <Section>
        {/* Seize entretiens, et aucune iframe chargée tant qu'on n'a pas
            cliqué. À environ 505 Ko de JavaScript par lecteur, les charger
            d'avance ferait huit mégaoctets et la page ne s'ouvrirait pas. */}
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {temoignages.map((temoignage) => (
            <li key={temoignage.id}>
              <LecteurVideo
                id={temoignage.id}
                titre={temoignage.nom}
                secondes={temoignage.secondes}
                affiche={`/temoignages/${temoignage.id}.jpg`}
              />

              <p className="mt-4 text-base font-semibold text-foreground">
                {temoignage.nom}
              </p>
              {temoignage.resultat ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {temoignage.resultat}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex justify-center">
          {/* Repris de remy-jupille.com, au mot près. */}
          <BoutonScintillant href={liens.appel}>
            Appel découverte gratuit
            <ArrowRight className="size-4" />
          </BoutonScintillant>
        </div>
      </Section>
    </>
  );
}
