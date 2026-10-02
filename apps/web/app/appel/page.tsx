import { FormulaireCalendly } from "@/components/formulaire-calendly";
import { ParticulesHero } from "@/components/particules-hero";
import { TitreRoulant } from "@/components/titre-roulant";
import { identiteAppel, reservationAppel } from "@/contenu/appel";
import { insecables } from "@/lib/typographie";

import type { Metadata } from "next";
import { preconnect } from "react-dom";

/**
 * La page de réservation d'appel, servie sur `go.funnels.club/appel`.
 *
 * **Il ne reste que le formulaire**, sur décision de Rémy : l'en-tête réduit
 * à la marque, le hero et son formulaire de Calendly. Le pied de page, avec
 * les mentions du site, est dans le gabarit.
 * Le message de Rémy et la galerie des entretiens y ont été, puis sont
 * partis ; ils vivent maintenant sur `/thanks`. Les boutons de réservation de
 * la galerie restent possibles par sa propriété `appel`, que plus personne ne
 * passe, et `appelGalerie` en garde le libellé.
 *
 * Le hero est celui de `/preparation`, le formulaire à la place de la vidéo,
 * **sans la bascule en 3D** : on ne remplit pas un formulaire qui se redresse
 * sous le doigt.
 *
 * **Le hero ne prend pas une hauteur d'écran**, contrairement à celui des
 * deux autres pages : sa hauteur venait de la part de vidéo cachée sous
 * l'écran, que la bascule rattrapait au défilement. Sans bascule, rien n'est
 * à rattraper.
 */

export const metadata: Metadata = {
  title: identiteAppel.titrePage,
  description: identiteAppel.description,
};

export default function Appel() {
  const { titre, sousTitre, calendly, hauteurMin } = reservationAppel;

  /* La poignée de main avec Calendly commence dès l'en-tête du HTML, avant
     même que l'iframe soit lue : `calendly.com` sert sa page, `assets` ses
     scripts et ses styles. */
  preconnect("https://calendly.com");
  preconnect("https://assets.calendly.com", { crossOrigin: "anonymous" });

  return (
    <>
      <div id="haut" />

      {/* LE HERO, celui de `/preparation`, le formulaire à la place de la
          vidéo. */}
      <section
        id="reservation"
        data-hero
        className="relative isolate flex scroll-mt-4 flex-col px-5 pt-20 sm:pt-28"
      >
        {/* **La photo garde sa hauteur quand le formulaire grandit**, sur
            demande de Rémy : la jonction se mesure depuis le bas du hero, et
            le hero s'allonge avec le formulaire. `--surplus-formulaire`, posé
            par `CadreCalendly`, rend ce qui s'est ajouté sous la ligne : la
            croissance tombe dans la page claire, jamais dans l'image. */}
        <div
          data-bande-sombre
          className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px+var(--surplus-formulaire,0px))] -z-10 overflow-hidden bg-[var(--fond-hero)]"
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
          style={{
            bottom:
              "calc(var(--jonction) - 96px + var(--surplus-formulaire, 0px))",
          }}
        />

        <div className="mx-auto flex w-full max-w-[var(--largeur-video)] flex-1 flex-col">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <TitreRoulant
              as="h1"
              segments={titre}
              className="titre text-[2rem] text-balance text-white sm:text-5xl lg:text-6xl"
            />

            <p className="mt-5 text-lg leading-snug text-balance text-white/90 sm:text-2xl">
              {insecables(sousTitre)}
            </p>
          </div>

          {/* **Le formulaire seul, sans cadre**, sur demande de Rémy : la
              carte de Calendly porte déjà sa bordure et ses coins, et un
              second cadre autour d'elle dessinait une bande vide au-dessus.
              L'iframe est transparente, voir `FormulaireCalendly`.

              **Aucune marge au-dessus en grand** : Calendly pose déjà 66 px
              de vide transparent au-dessus de sa carte, et les 40 px de
              `/preparation` s'y ajoutaient. */}
          <FormulaireCalendly
            url={calendly}
            titre="Réserver votre appel avec Funnels Club"
            hauteurMin={hauteurMin}
            className="mt-8 w-full sm:mt-0"
          />

        </div>
      </section>
    </>
  );
}
