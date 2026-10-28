import { BoutonScintillant } from "@/components/bouton-scintillant";
import { CompteurVue } from "@/components/compteur-vue";
import { FormulaireCalendly } from "@/components/formulaire-calendly";
import { LecteurVideo } from "@/components/lecteur-video";
import { TexteRoulant } from "@/components/texte-roulant";
import { reservationAppel } from "@/contenu/appel";
import { videoVsl } from "@/contenu/vsl";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";
import Script from "next/script";
import { preconnect } from "react-dom";

/**
 * La VSL du VSL Funnel : la vidéo de formation promise à l'opt-in, puis la
 * prise d'appel. Reprise de `funnels.club/vsl-2025`, au mot près.
 *
 * **Calendly est posé sous la vidéo**, au lieu d'un bouton vers une autre
 * page : une étape de moins avant la réservation. Il s'ouvre déjà rempli
 * avec le prénom et l'e-mail de l'opt-in (voir `FormulaireCalendly`), et
 * renvoie, une fois l'appel réservé, vers la confirmation (`/thanks`) —
 * réglage fait dans Calendly.
 */
const metadonnees: Metadata = {
  title: { absolute: "Votre vidéo de formation · Funnels Club" },
  description:
    "La vidéo de formation gratuite de Funnels Club, puis votre appel gratuit de 30 minutes avec l'équipe.",
  /* Le jeton de page externe de ClickFunnels : l'étape « VSL » du tunnel
     « 2026 : Direct VSL (Claude) », celle vers laquelle ClickFunnels renvoie
     après l'opt-in de `/course`. Le SDK chargé plus bas le lit dans le
     `head`. */
  other: { "cf-page-token": "cfp_l60xdzWdOgmVukEK736PxYux" },
};

export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/video", metadonnees);
}

export default function Video() {
  const { video } = videoVsl;
  preconnect("https://calendly.com");
  preconnect("https://assets.calendly.com", { crossOrigin: "anonymous" });

  return (
    <main className="px-5 pt-28 sm:pt-36">
      <CompteurVue tunnel="vsl" etape="vsl" />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <p className="titre text-2xl text-foreground sm:text-3xl">
          {videoVsl.surtitre}
        </p>
        <LecteurVideo
          id={video.id}
          titre={video.titre}
          secondes={video.secondes}
          affiche={video.affiche}
          afficheAlt="La formation gratuite Funnels Club"
          natif
          className="w-full shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)]"
        />
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-foreground">
          {videoVsl.appel.map((morceau, rang) =>
            "gras" in morceau ? (
              <strong key={rang}>{morceau.texte}</strong>
            ) : (
              <span key={rang}>{morceau.texte}</span>
            ),
          )}
        </p>
        <BoutonScintillant href="#reservation" externe={false}>
          <TexteRoulant>{videoVsl.bouton}</TexteRoulant>
        </BoutonScintillant>
      </div>

      <section
        id="reservation"
        className="mx-auto mt-14 max-w-5xl scroll-mt-6"
        aria-label="Réserver votre appel gratuit"
      >
        <FormulaireCalendly
          url={reservationAppel.calendly}
          titre="Réserver votre appel gratuit avec Funnels Club"
          hauteurMin={reservationAppel.hauteurMin}
          className="w-full"
        />
      </section>
      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme sur `/course` et `/thanks`. */}
      <Script
        src="https://sdk.myclickfunnels.com/sdk.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
