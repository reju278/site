import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { legalesVsl } from "@/contenu/vsl";
import type { Metadata } from "next";

/**
 * Le cadre de l'opt-in du VSL Funnel, `go.funnels.club/course`, et de ses
 * pages légales (`/course/cgv`, `/course/confidentialite`,
 * `/course/mentions` : les textes du site, sous le tunnel).
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
    <div>
      <EnTeteImmersion ancres={[]} bascule={false} />
      {children}
      <div aria-hidden className="h-20 sm:h-28" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet liens={legalesVsl} />
      </PiedImmersion>
    </div>
  );
}

