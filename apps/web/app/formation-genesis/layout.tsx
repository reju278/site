import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { PoliceTunnel } from "@/components/police-tunnel";
import { legalesVsl } from "@/contenu/vsl";
import type { Metadata } from "next";

/**
 * Le cadre du tunnel « Formation Genesis » (issue #8), servi sur
 * `go.funnels.club/formation-genesis` : l'optin, l'espace membre
 * (`/espace/<partie>`) et la réservation (`/appel`).
 *
 * Un tunnel : hors de l'en-tête et du pied du site (`lib/tunnels.ts`),
 * interdit d'index ici pour ses trois pages, absent de `sitemap.ts`, thème
 * clair forcé par `FournisseurTheme`, comme le reste du tunnel VSL dont il
 * reprend le dessin : police des titres, cartes, bouton scintillant.
 *
 * Les mentions légales sont celles de `/course`, ouvertes dans un nouvel
 * onglet : une page commerciale européenne sans elles est moins conforme,
 * et elles restent dans un tunnel.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutFormationGenesis({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-police-tunnel
      /* La largeur des vidéos et des cartes, celle de `/appel`. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 72rem)",
        } as React.CSSProperties
      }
    >
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet liens={legalesVsl} />
      </PiedImmersion>
    </div>
  );
}
