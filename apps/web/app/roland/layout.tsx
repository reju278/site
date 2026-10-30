import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre de la page du témoignage de Roland, `go.funnels.club/roland`.
 *
 * **C'est celui de `/thanks`**, sans le SDK de ClickFunnels : cette page n'est
 * pas une étape de leur tunnel. Un tunnel, retiré de l'en-tête et du pied de
 * page du site par `lib/tunnels.ts`, interdit d'index ici, absent de
 * `sitemap.ts`, et forcé au clair par `FournisseurTheme`.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/roland" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutRoland({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-police-tunnel
      /* Les mesures de la vidéo : 56 rem de large, comme la carte de
         `/thanks`. Sans carte autour, plus de rembourrage à déduire. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 56rem)",
          "--video-h": "calc(var(--largeur-video) * 9 / 16)",
        } as React.CSSProperties
      }
    >
      <PoliceTunnel />
      {/* `absolute` et non `fixed`, sur demande de Rémy : la marque reste en
          haut de la page et ne suit pas le défilement. Plus petite sur
          téléphone, comme sur `/appel`. */}
      <EnTeteImmersion
        ancres={[]}
        bascule={false}
        className="absolute origin-top max-sm:top-1 max-sm:scale-[0.8]"
      />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet />
      </PiedImmersion>
    </div>
  );
}
