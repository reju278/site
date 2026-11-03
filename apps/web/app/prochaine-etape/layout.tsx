import { PoliceTunnel } from "@/components/police-tunnel";
import { SdkClickFunnels } from "@/components/sdk-clickfunnels";
import type { Metadata } from "next";

/**
 * Le cadre de `/prochaine-etape`, celui de `/thanks` : un tunnel, sans
 * en-tête, interdit d'index, absent de `sitemap.ts`, forcé au clair par
 * `FournisseurTheme`. Avec le SDK de ClickFunnels, qui la compte comme une
 * étape du tunnel, comme `/thanks`.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/prochaine-etape" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
  /* Le jeton de page externe de ClickFunnels, fourni par Rémy : il désigne
     cette page comme l'étape de refus du tunnel. */
  other: { "cf-page-token": "cfp_jTr2TslzDZ5UJtgZGC8gKW9r" },
};

export default function LayoutProchaineEtape({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-police-tunnel>
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
      {/* Plus de pied de page dans le tunnel VSL, sur demande de Rémy. */}
      <SdkClickFunnels />
    </div>
  );
}
