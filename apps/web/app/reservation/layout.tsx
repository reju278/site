import { GabaritGenesis } from "@/components/gabarit-genesis";
import type { Metadata } from "next";

/**
 * Le cadre de la réservation de la Formation Genesis,
 * `go.funnels.club/reservation` (issue #8) : celui de l'optin et de l'espace
 * membre, `GabaritGenesis`.
 *
 * Un tunnel : hors de l'en-tête et du pied du site (`lib/tunnels.ts`),
 * interdit d'index, absent de `sitemap.ts`, thème clair forcé par
 * `FournisseurTheme`. Le formulaire de Calendly est blanc quoi qu'il arrive.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutReservation({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <GabaritGenesis>{children}</GabaritGenesis>;
}
