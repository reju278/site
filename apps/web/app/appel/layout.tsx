import { PoliceTunnel } from "@/components/police-tunnel";
import { SdkClickFunnels } from "@/components/sdk-clickfunnels";
import type { Metadata } from "next";

/**
 * Le cadre de la page de réservation d'appel.
 *
 * **C'est celui de `/preparation`**, et donc d'`/immersion` : un tunnel,
 * retiré de l'en-tête et du pied de page du site par `lib/tunnels.ts`,
 * interdit d'index ici, absent de `sitemap.ts`. Plus d'en-tête du tout, sur
 * demande de Rémy : la marque est partie avec le titre, comme sur
 * `/video-vsl`. La page est forcée au clair par `FournisseurTheme`.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/appel" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
  /* Le jeton de page externe de ClickFunnels : l'étape « Appel » du tunnel
     « 2026 : Direct VSL (Claude) ». Le SDK chargé plus bas le lit dans le
     `head`. Dans le gabarit et non dans la page, comme sur `/thanks` : la
     route n'a pas de sous-pages qui fausseraient le compte des visites. */
  other: { "cf-page-token": "cfp_iQFkFSWVIfD3rZi0CRyQrLrw" },
};

export default function LayoutAppel({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-police-tunnel
      /* **72 rem et non 64**, parce qu'une fois le jour choisi Calendly
         ajoute la colonne des horaires et que sa carte demande alors près de
         1 100 px. À 1 024, il gardait trois colonnes en les tassant : la date
         passait sur deux lignes et les horaires étaient coupés à droite,
         ce que Rémy a pris pour un bug. Mesuré : à 1 152 px, la colonne
         tient entière. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 72rem)",
        } as React.CSSProperties
      }
    >
      <PoliceTunnel />
      {children}
      {/* **Plus de pied de page**, sur demande de Rémy : ni avertissement,
          ni mention des cookies, ni liens légaux. Seulement de l'air sous
          le formulaire. */}
      <div aria-hidden className="h-16 sm:h-24" />
      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme sur les autres étapes. */}
      <SdkClickFunnels />
    </div>
  );
}
