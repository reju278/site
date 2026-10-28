import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { legalesVsl } from "@/contenu/vsl";
import { PoliceTunnel } from "@/components/police-tunnel";
import type { Metadata } from "next";

/**
 * Le cadre de la VSL du VSL Funnel, `go.funnels.club/video-vsl` : on y arrive
 * après l'opt-in de `/course`. Un tunnel, interdit d'index, thème clair
 * forcé. La marque en haut, comme sur `/appel`, sur demande de Rémy.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/video-vsl" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutVideo({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-police-tunnel>
      <PoliceTunnel />
      {/* La marque, comme sur `/appel` : `absolute` et non `fixed`, elle reste
          en haut de la page et ne suit pas le défilement. */}
      <EnTeteImmersion
        ancres={[]}
        bascule={false}
        /* Plus petite sur téléphone, sur demande de Rémy. */
        className="absolute origin-top max-sm:top-1 max-sm:scale-[0.8]"
      />
      {children}
      <div aria-hidden className="h-20 sm:h-28" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet liens={legalesVsl} />
      </PiedImmersion>
    </div>
  );
}
