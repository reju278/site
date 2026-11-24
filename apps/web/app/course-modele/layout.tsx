import { GabaritGenesis } from "@/components/gabarit-genesis";
import type { Metadata } from "next";

/**
 * Le cadre de « Course modèle », servie sur `go.funnels.club/course-modele` :
 * le gabarit de Formation Genesis, tel quel (polices, jetons, mentions
 * légales et avertissements en pied de page), sur demande de Rémy.
 *
 * Un tunnel : hors de l'en-tête et du pied du site (`lib/tunnels.ts`),
 * interdit d'index, absent de `sitemap.ts`, thème clair forcé par
 * `FournisseurTheme`.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutCourseModele({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <GabaritGenesis>{children}</GabaritGenesis>;
}
