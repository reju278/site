import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre de l'opt-in du VSL Funnel, `go.funnels.club/course`, et de ses
 * pages légales (`/course/cgv`, `/course/confidentialite`,
 * `/course/mentions` : les textes du site, sous le tunnel).
 *
 * **Pas de logo en haut de la page d'inscription**, sur demande de Rémy : le
 * titre monte au plus près du bord, et la marque ne reste qu'en bas, dans le
 * pied. Les pages légales, elles, gardent le logo : elles ont leur propre
 * gabarit dans le groupe `(legales)`, qui ne change pas leurs adresses.
 *
 * Un tunnel : hors de l'en-tête et du pied du site (`lib/tunnels.ts`),
 * interdit d'index, absent du plan du site, thème clair forcé.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/course" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutCourse({
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
