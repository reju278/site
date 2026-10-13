import { BoutonScintillant } from "@/components/bouton-scintillant";
import { LecteurVideo } from "@/components/lecteur-video";
import { ParticulesHero } from "@/components/particules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
import { liens } from "@/contenu/site";
import {
  identiteStrategie,
  presentationStrategie,
} from "@/contenu/strategie";
import { avecReglages } from "@/lib/reglages-seo";
import { insecables } from "@/lib/typographie";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

/**
 * La page de stratégie : la vidéo, puis un seul bouton pour réserver un appel.
 *
 * **Le hero est celui de `/preparation`**, et donc d'`/immersion`, mêmes
 * classes : tout ce qui est écrit dans leur code sur `data-hero`, `--jonction`
 * et la vidéo inclinée qui se redresse au défilement vaut ici. Rémy a demandé
 * ce dessin et rien d'autre : ni galerie, ni équipe, ni consigne. La seule
 * sortie du tunnel est l'appel.
 *
 * Un seul `h1`, le titre de la vidéo. Le bouton n'a pas de titre : un bloc
 * d'appel n'est jamais un `h2`.
 */

const metadonnees: Metadata = {
  title: identiteStrategie.titrePage,
  description: identiteStrategie.description,
};

export default function Strategie() {
  const { titre, sousTitre, video, appel } = presentationStrategie;

  return (
    <>
      <div id="haut" />

      {/* LE HERO, celui de `/preparation` au caractère près. */}
      <section
        id="presentation"
        data-hero
        className="relative isolate flex flex-col px-5 pt-20 sm:min-h-[calc(100svh+var(--part-cachee))] sm:pt-24"
      >
        <div
          data-bande-sombre
          className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px)] -z-10 overflow-hidden bg-[var(--fond-hero)]"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fond-hero-mobile.jpg"
              alt=""
              width={1920}
              height={1097}
              fetchPriority="high"
              className="size-full object-cover object-bottom"
            />
          </picture>
          <div aria-hidden className="absolute inset-0 bg-black/55" />
          <ParticulesHero />
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -z-10 h-24 rounded-t-[var(--rayon-jonction)] bg-background"
          style={{ bottom: "calc(var(--jonction) - 96px)" }}
        />

        <div className="mx-auto flex w-full max-w-[var(--largeur-video)] flex-1 flex-col">
          <div className="mx-auto mt-auto flex max-w-4xl flex-col items-center text-center">
            <TitreRoulant
              as="h1"
              segments={titre}
              className="titre text-[2rem] text-balance text-white sm:text-5xl lg:text-6xl"
            />

            {/* Du blanc en dur à 90 % sur la photographie, comme le titre. */}
            <p className="mt-5 text-lg leading-snug text-balance text-white/90 sm:text-2xl">
              {insecables(sousTitre)}
            </p>
          </div>

          {/* Posée droite, sans la bascule d'`/immersion`, sur demande de
              Rémy. */}
          <div className="mt-8 w-full sm:mt-10">
            <LecteurVideo
              id={video.id}
              titre={video.titre}
              secondes={video.secondes}
              affiche={`/temoignages/${video.id}.jpg`}
              afficheAlt="La stratégie de Funnels Club, présentée par Rémy Jupille"
              natif
              className="shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </section>

      {/* L'APPEL, seul sous la vidéo. Le bouton scintillant d'`/immersion`,
          sur demande de Rémy, **en plus grand** : c'est la seule chose à faire
          sur cette page. L'adresse porte sa balise de provenance, déjà posée
          dans `liens`. */}
      <section className="px-5 pt-14 pb-6 sm:pt-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <BoutonScintillant
            href={liens.appel}
            className="min-h-16 w-full text-lg sm:w-auto sm:px-12 sm:text-xl"
          >
            <TexteRoulant>{appel.libelle}</TexteRoulant>
            <ArrowRight aria-hidden className="size-5 shrink-0" />
          </BoutonScintillant>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {insecables(appel.note)}
          </p>
        </div>
      </section>
    </>
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/strategie", metadonnees);
}
