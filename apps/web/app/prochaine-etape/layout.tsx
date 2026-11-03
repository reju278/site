import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre de `/prochaine-etape`, celui de `/thanks` : un tunnel, sans
 * en-tête, interdit d'index, absent de `sitemap.ts`, forcé au clair par
 * `FournisseurTheme`. Sans le SDK de ClickFunnels : la page n'est une étape
 * d'aucun de ses tunnels.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/prochaine-etape" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutProchaineEtape({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-police-tunnel>
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet />
      </PiedImmersion>
    </div>
  );
}
