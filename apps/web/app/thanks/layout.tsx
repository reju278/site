import { PoliceTunnel } from "@/components/police-tunnel";
import { SdkClickFunnels } from "@/components/sdk-clickfunnels";
import type { Metadata } from "next";

/**
 * Le cadre de la page de confirmation.
 *
 * **C'est celui d'`/appel`** : un tunnel, retiré de l'en-tête et du pied de
 * page du site par `lib/tunnels.ts`, interdit d'index ici, absent de
 * `sitemap.ts`. Plus d'en-tête du tout, sur demande de Rémy : la page suit
 * le dessin du tunnel, sans marque en haut. Elle est forcée au clair par
 * `FournisseurTheme`.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/thanks" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
  /* Le jeton de page externe de ClickFunnels : il désigne cette page comme
     l'étape de confirmation du tunnel, et le SDK chargé plus bas le lit dans
     le `head`. Il est propre à cette page ; une autre page externe a le sien. */
  other: { "cf-page-token": "cfp_9t5JQnhFsnb3VAQqb2elC3gW" },
};

export default function LayoutThanks({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-police-tunnel
      /* `--largeur-video` est la largeur de la carte de l'étape 1.

         **56 rem**, réduits depuis 64 sur demande de Rémy : deux vidéos se
         suivent, et chacune prenait presque un écran. Il n'y a plus de
         photographie en haut, donc plus de jonction à placer. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 56rem)",
        } as React.CSSProperties
      }
    >
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
      {/* Plus de pied de page dans le tunnel VSL, sur demande de Rémy. */}
      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme GTM : rien ne doit retarder le rendu. */}
      <SdkClickFunnels />
    </div>
  );
}
