import { GabaritGenesis } from "@/components/gabarit-genesis";
import type { Metadata } from "next";

/**
 * Le cadre de la confirmation de la Formation Genesis,
 * `go.funnels.club/reservation-thanks` (issue #8) : celui de l'optin, de
 * l'espace membre et de la réservation, `GabaritGenesis`.
 *
 * Un tunnel : hors de l'en-tête et du pied du site (`lib/tunnels.ts`),
 * interdit d'index, absent de `sitemap.ts`, thème clair forcé par
 * `FournisseurTheme`. **Ni jeton de page ni SDK de ClickFunnels, ni
 * `CompteurVue`**, contrairement à `/thanks` : ils comptent la visite dans les
 * étapes du VSL Funnel, et une réservation Genesis fausserait ses chiffres.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/reservation-thanks" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutReservationThanks({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <GabaritGenesis>{children}</GabaritGenesis>;
}
