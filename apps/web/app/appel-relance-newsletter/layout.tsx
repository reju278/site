import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre d'`/appel-relance-newsletter`, servie sur `go.funnels.club` : un
 * tunnel, comme `/appel`, interdit d'index et forcé au clair.
 *
 * **Sans jeton de page ni SDK de ClickFunnels** : ceux d'`/appel` comptent la
 * visite dans l'étape « Appel » du tunnel « 2026 : Direct VSL (Claude) », et
 * cette page n'en fait pas partie.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/appel-relance-newsletter" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutAppelRelance({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-police-tunnel>
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
    </div>
  );
}
