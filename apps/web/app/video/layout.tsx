import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { legalesVsl } from "@/contenu/vsl";
import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre de la VSL du VSL Funnel, `go.funnels.club/video` : on y arrive
 * après l'opt-in de `/course`. Un tunnel, interdit d'index, thème clair
 * forcé (Calendly est blanc).
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/video" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutVideo({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-police-tunnel>
      <PoliceTunnel />
      <EnTeteImmersion ancres={[]} bascule={false} />
      {children}
      <div aria-hidden className="h-20 sm:h-28" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet liens={legalesVsl} />
      </PiedImmersion>
    </div>
  );
}
