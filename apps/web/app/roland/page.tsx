import { BoutonScintillant } from "@/components/bouton-scintillant";
import { LecteurVideo } from "@/components/lecteur-video";
import { ParticulesHero } from "@/components/particules-hero";
import { PointGelule } from "@/components/pilules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
import { identiteRoland, presentationRoland } from "@/contenu/roland";
import { liens } from "@/contenu/site";
import { avecReglages } from "@/lib/reglages-seo";
import { insecables } from "@/lib/typographie";
import { ShineBorder } from "@repo/ui/components/shine-border";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

/**
 * La page du témoignage de Roland : un titre, l'alerte, la vidéo, un bouton.
 *
 * **Le dessin est celui de `/thanks`**, sur demande de Rémy : le hero
 * photographique, le titre et l'alerte rouge, puis une carte posée à cheval
 * sur la photographie. La carte ne porte que la vidéo. La seule sortie du
 * tunnel est l'appel, juste en dessous.
 *
 * Un seul `h1`, le titre. Le bouton n'a pas de titre : un bloc d'appel n'est
 * jamais un `h2`.
 */

const metadonnees: Metadata = {
  title: identiteRoland.titrePage,
  description: identiteRoland.description,
};

export default function Roland() {
  const { titre, alerte, video, appel } = presentationRoland;

  return (
    <>
      <div id="haut" />

      {/* LE HERO, celui de `/thanks` : la section s'arrête à une hauteur
          connue, le haut de la carte plus une demi-vidéo, et la carte en
          ressort par une marge négative. Voir le commentaire de `/thanks`. */}
      <div id="presentation">
        <section
          data-hero
          className="relative isolate flex flex-col px-5 pt-20 pb-[calc(var(--video-h)/2+3rem)] sm:pt-28"
          style={{ "--jonction": "88px" } as React.CSSProperties}
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

          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <TitreRoulant
              as="h1"
              segments={titre}
              className="titre text-[2rem] text-balance text-white sm:text-5xl lg:text-6xl"
            />

            {/* L'alerte de `/thanks`, au même dessin : voir son commentaire
                pour les rouges en dur et le `div` plutôt que le `p`. */}
            <div
              role="note"
              style={{ "--teinte": "#ffffff" } as React.CSSProperties}
              className="relative mt-6 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-[1.25rem] bg-[#dc2626] px-5 py-2.5 text-left text-sm leading-snug font-medium text-white shadow-[0_14px_34px_-14px_rgba(220,38,38,0.65)] sm:mt-7 sm:rounded-full sm:px-6 sm:py-3 sm:text-lg"
            >
              <ShineBorder
                borderWidth={2}
                duration={8}
                shineColor={["#7f1d1d", "#450a0a"]}
              />
              <PointGelule />
              <span>
                <strong className="font-bold">{alerte.important}</strong>
                {alerte.avant}
                <strong className="font-bold underline decoration-white/70 decoration-2 underline-offset-4">
                  {alerte.consigne}
                </strong>
                {insecables(alerte.apres)}
              </span>
            </div>
          </div>
        </section>

        {/* LA CARTE, qui ne porte que la vidéo. Le rembourrage est celui que
            soustrait `--video-h` dans le gabarit. */}
        <section className="relative px-5 -mt-[calc(var(--video-h)/2+3rem-2.5rem)]">
          <div className="mx-auto max-w-[var(--largeur-video)] rounded-[var(--rayon-jonction)] border border-border bg-card p-4 text-card-foreground shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:p-6">
            <LecteurVideo
              id={video.id}
              titre={video.titre}
              secondes={video.secondes}
              affiche={`/temoignages/${video.id}.jpg`}
              afficheAlt="Roland Buffet en entretien vidéo avec Rémy Jupille, chacun depuis son bureau"
              natif
            />
          </div>
        </section>
      </div>

      {/* L'APPEL, seul sous la vidéo : le bouton de `/strategie`. L'adresse
          porte sa balise de provenance, déjà posée dans `liens`. */}
      <section className="px-5 pt-10 pb-6 sm:pt-12">
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
  return avecReglages("/roland", metadonnees);
}
