import { BoutonScintillant } from "@/components/bouton-scintillant";
import { CompteurVue } from "@/components/compteur-vue";
import { LecteurVideo } from "@/components/lecteur-video";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreVideoVsl } from "@/components/titre-video-vsl";
import { videoVsl } from "@/contenu/vsl";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";
import Script from "next/script";

/**
 * La VSL du VSL Funnel : la vidéo de formation promise à l'opt-in, puis la
 * prise d'appel. Reprise de `funnels.club/vsl-2025`, au mot près.
 *
 * **Plus de formulaire de réservation sous la vidéo**, sur demande de Rémy :
 * le bouton mène à la page d'appel, `/appel`, l'étape suivante du tunnel
 * ClickFunnels. Calendly s'y ouvre déjà rempli avec le prénom et l'e-mail de
 * l'opt-in (voir `FormulaireCalendly`), et renvoie, une fois l'appel réservé,
 * vers la confirmation (`/thanks`), réglage fait dans Calendly.
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
  return avecReglages("/video-vsl", metadonnees);
}

export default function Video() {
  const { video } = videoVsl;

  return (
    <main className="px-5 pt-12 sm:pt-16">
      <CompteurVue tunnel="vsl" etape="vsl" />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <TitreVideoVsl texte={videoVsl.surtitre} />
        <LecteurVideo
          id={video.id}
          titre={video.titre}
          secondes={video.secondes}
          affiche={video.affiche}
          afficheAlt="La formation gratuite Funnels Club"
          natif
          className="w-full shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)]"
        />
        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-pretty text-foreground sm:text-2xl">
          {videoVsl.appel.map((morceau, rang) =>
            "gras" in morceau ? (
              <strong key={rang}>{morceau.texte}</strong>
            ) : (
              <span key={rang}>{morceau.texte}</span>
            ),
          )}
        </p>
        {/* Vers la page d'appel, en navigation complète (un `a`, pas un lien
            client) : le formulaire de Calendly y lit au chargement le prénom
            et l'e-mail laissés par l'opt-in, voir `FormulaireCalendly`. */}
        <BoutonScintillant
          href="/appel"
          externe={false}
          className="min-h-16 w-full px-10 text-lg sm:w-auto sm:text-xl"
        >
          <TexteRoulant>{videoVsl.bouton}</TexteRoulant>
        </BoutonScintillant>
      </div>

      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme sur `/course` et `/thanks`. */}
      <Script
        src="https://sdk.myclickfunnels.com/sdk.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
