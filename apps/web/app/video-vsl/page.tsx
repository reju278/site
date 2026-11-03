import { BoutonScintillant } from "@/components/bouton-scintillant";
import { CompteurVue } from "@/components/compteur-vue";
import { LecteurVideo } from "@/components/lecteur-video";
import { TexteRoulant } from "@/components/texte-roulant";
import { AppelVideoVsl, TitreVideoVsl } from "@/components/titre-video-vsl";
import { videoVsl } from "@/contenu/vsl";
import { avecReglages } from "@/lib/reglages-seo";
import { SdkClickFunnels } from "@/components/sdk-clickfunnels";
import type { Metadata } from "next";
import { partageTunnel } from "@/lib/partage";
import { ArrowRight } from "lucide-react";
import { preload } from "react-dom";

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
  ...partageTunnel({
    titre: "Ta vidéo de formation offerte · Funnels Club",
    description:
      "La vidéo de formation gratuite de Funnels Club, puis ton appel gratuit de 30 minutes avec l'équipe.",
    image: "video-vsl",
    alt: "Voici ta vidéo de formation offerte, Funnels Club",
  }),
};

export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/video-vsl", metadonnees);
}

export default function Video() {
  const { video } = videoVsl;
  preload(video.affiche, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: `${video.afficheMobile} 640w, ${video.affiche} 1280w`,
    imageSizes: "(min-width: 896px) 832px, 100vw",
  });

  return (
    <main
      /* Le haut de page ne dégage plus la marque, retirée sur demande de
         Rémy : même marge que `/course`. */
      className="px-5 pt-5 sm:pt-12"
    >
      {/* Les domaines que le lecteur de Wistia contacte, relevés en ouvrant
          son iframe : la page du lecteur, son script, l'affiche et les
          segments de la vidéo. Ouvrir ces connexions pendant la lecture du
          HTML retire une négociation TLS de chacune des premières requêtes.

          **En balises et non par `preconnect()` de `react-dom`** : appelé
          depuis un composant serveur, celui-ci ne finit que dans la charge
          utile RSC, appliquée à l'hydratation, donc trop tard. Mesuré dans le
          HTML servi. */}
      <link rel="preconnect" href="https://fast.wistia.net" />
      <link rel="preconnect" href="https://fast.wistia.com" />
      <link rel="preconnect" href="https://embed-ssl.wistia.com" />
      <link rel="preconnect" href="https://embed-cloudfront.wistia.com" />
      <CompteurVue tunnel="vsl" etape="vsl" />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <TitreVideoVsl texte={videoVsl.surtitre} />
        <LecteurVideo
          id={video.id}
          titre={video.titre}
          secondes={video.secondes}
          affiche={video.affiche}
          afficheMobile={video.afficheMobile}
          afficheAlt="La formation gratuite Funnels Club"
          natif
          prioritaire
          className="w-full shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)]"
        />
        <AppelVideoVsl morceaux={videoVsl.appel} />
        {/* Vers la page d'appel, **dans un nouvel onglet**, sur demande de
            Rémy : la vidéo reste ouverte derrière. Le formulaire de Calendly
            y lit au chargement le prénom et l'e-mail laissés par l'opt-in,
            dans le `localStorage`, que le nouvel onglet partage (voir
            `CLE_CONTACT_VSL`). */}
        {/* Plus grand et suivi d'une flèche, sur demande de Rémy. `externe`
            est le défaut du bouton : `target="_blank"`, `rel="noreferrer"`. */}
        <BoutonScintillant
          href="/appel"
          className="min-h-18 w-full gap-2.5 px-5 text-lg font-bold sm:w-auto sm:min-h-20 sm:gap-3 sm:px-12 sm:text-2xl"
        >
          <TexteRoulant>{videoVsl.bouton}</TexteRoulant>
          <ArrowRight aria-hidden className="size-6 shrink-0 sm:size-7" strokeWidth={2.5} />
        </BoutonScintillant>

      </div>

      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme sur `/course` et `/thanks`. */}
      <SdkClickFunnels />
    </main>
  );
}
