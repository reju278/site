import { ConsigneVideo } from "@/components/consigne-video";
import { GalerieEntretiens } from "@/components/galerie-entretiens";
import { LecteurVideo } from "@/components/lecteur-video";
import { ParticulesHero } from "@/components/particules-hero";
import { RangeeEquipe } from "@/components/rangee-equipe";
import { SemisPoints } from "@/components/semis-points";
import { TitreRoulant } from "@/components/titre-roulant";
import { avisImmersion, equipeImmersion } from "@/contenu/immersion";
import {
  identitePreparation,
  presentationPreparation,
} from "@/contenu/preparation";
import { insecables } from "@/lib/typographie";

import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";

/**
 * La page de préparation, qu'on reçoit après avoir réservé un appel.
 *
 * Elle reprend `www.funnels.club/parfait-confirmation` dans le dessin
 * d'`/immersion`, sur demande de Rémy : **le hero, la galerie des entretiens et
 * la rangée de l'équipe sont ceux d'`/immersion`**, mêmes composants et mêmes
 * classes, pour que les deux pages suivent les mêmes corrections. Seul le
 * contenu du hero change. Voir l'issue #4.
 *
 * Tout ce qui est écrit dans le code d'`/immersion` sur ces trois blocs vaut
 * ici et n'est pas recopié : `data-hero` et `--jonction`, la lèvre posée hors
 * du conteneur de l'image, la vidéo inclinée qui se redresse au défilement, la
 * fenêtre unique des entretiens.
 *
 * **Le plan de titres est refait**, comme sur `/immersion` : la page source
 * met sa bande et son titre en `h2`, et le titre des entretiens en `h1`. Ici un
 * seul `h1`, le titre de la vidéo, et les sections en `h2`.
 */

export const metadata: Metadata = {
  title: identitePreparation.titrePage,
  description: identitePreparation.description,
};

export default function Preparation() {
  const { consigne, titre, sousTitre, note, video } = presentationPreparation;

  return (
    <>
      <div id="haut" />

      {/* La consigne de la page, en notification en bas de l'écran, sur
          demande de Rémy. */}
      <ConsigneVideo {...consigne} />

      {/* LE HERO, celui d'`/immersion` au caractère près. */}
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
            {/* Le corps du titre d'`/immersion`, depuis que le sous-titre en
                est sorti : il ne reste que quarante caractères. */}
            <TitreRoulant
              as="h1"
              segments={titre}
              className="titre text-[2rem] text-balance text-white sm:text-5xl lg:text-6xl"
            />

            {/* Le sous-titre, sur la ligne suivante et en corps de texte, sur
                demande de Rémy : le titre s'arrête sur le sujet de la vidéo,
                ceci dit à qui elle s'adresse. Du blanc en dur à 90 % sur la
                photographie, comme le titre. */}
            <p className="mt-5 text-lg leading-snug text-balance text-white/90 sm:text-2xl">
              {insecables(sousTitre)}
            </p>

            {/* La note, qui renvoyait à un astérisque du titre. Du blanc en dur sur la photographie,
                sombre dans les deux thèmes grâce à `--fond-hero` et au voile :
                à 70 %, il tient ses 4,5:1 au pire cas, image blanche sous un
                voile à 55 %. */}
            <p className="mt-4 text-sm text-pretty text-white/70 sm:text-base">
              {insecables(note)}
            </p>
          </div>

          <div className="scene-video mt-8 w-full sm:mt-10">
            <LecteurVideo
              id={video.id}
              titre={video.titre}
              secondes={video.secondes}
              affiche={`/temoignages/${video.id}.jpg`}
              afficheAlt="Présentation du parfait tunnel de vente"
              natif
              className="video-bascule shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </section>

      {/* LES ENTRETIENS, la zone d'`/immersion` telle quelle : le semis de
          points derrière, le titre qui roule, la galerie et sa fenêtre. */}
      <div className="relative isolate">
        <SemisPoints
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 text-border",
            "[mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent),linear-gradient(to_bottom,transparent,#000_6%,#000_94%,transparent)]",
            "[mask-composite:intersect] [-webkit-mask-composite:source-in]",
          )}
        />

        {/* Plus d'air au-dessus que le rythme de la page : la vidéo est un
            objet, et à rembourrage égal le titre paraissait collé à elle.
            C'est la même raison que sous la vidéo d'`/immersion`. */}
        <SectionPreparation
          id="avis"
          className="scroll-mt-24 [&>div]:pt-16 sm:[&>div]:pt-20"
        >
          <div className="mx-auto max-w-3xl text-center">
            <TitreRoulant
              as="h2"
              segments={[{ texte: avisImmersion.titre }]}
              className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
            />
            <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
              {insecables(avisImmersion.sousTitre)}
            </p>
          </div>

          <GalerieEntretiens />
        </SectionPreparation>
      </div>

      {/* L'ÉQUIPE, celle d'`/immersion`. */}
      <SectionPreparation id="equipe" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
          <TitreRoulant
            as="h2"
            segments={[{ texte: equipeImmersion.titre }]}
            className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
          />
        </div>

        <RangeeEquipe />
      </SectionPreparation>
    </>
  );
}

/**
 * Une section, au rythme resserré de `SectionImmersion`. Recopiée parce que
 * celle-là est locale à la page d'`/immersion` : le jour où une troisième page
 * en veut, elle sort dans un composant.
 */
function SectionPreparation({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={className} {...props}>
      <div className="mx-auto max-w-6xl px-5 py-9 sm:py-12">{children}</div>
    </section>
  );
}
