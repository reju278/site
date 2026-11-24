import { GabaritGenesis } from "@/components/gabarit-genesis";
import type { Metadata } from "next";

/**
 * Le cadre de « Course modèle », servie sur `go.funnels.club/course-modele` :
 * le gabarit de Formation Genesis (polices, jetons), sur demande de Rémy.
 * **Le pied de page n'est que sur l'opt-in** (`PiedGenesis`, posé par la
 * page) : la vidéo, la prise d'appel et la confirmation s'en passent, sur
 * demande de Rémy le 24 novembre 2026.
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
  return <GabaritGenesis pied={false}>{children}</GabaritGenesis>;
}
