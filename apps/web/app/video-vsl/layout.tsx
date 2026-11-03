import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre de la VSL du VSL Funnel, `go.funnels.club/video-vsl` : on y arrive
 * après l'opt-in de `/course`. Un tunnel, interdit d'index, thème clair
 * forcé. Pas de marque en haut, retirée sur demande de Rémy : le titre
 * monte au plus près du bord, comme sur `/course`, et la marque ne reste
 * qu'en bas, dans le pied.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/video-vsl" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutVideo({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-police-tunnel>
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-20 sm:h-28" />
      {/* Plus de pied de page dans le tunnel VSL, sur demande de Rémy. */}
    </div>
  );
}
