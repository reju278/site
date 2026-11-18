import { GabaritGenesis } from "@/components/gabarit-genesis";
import type { Metadata } from "next";

/**
 * Le cadre du tunnel « Formation Genesis » (issue #8), servi sur
 * `go.funnels.club/formation-genesis` : l'optin et l'espace membre
 * (`/espace/<partie>`). La réservation est à `/reservation`, au même cadre :
 * voir `GabaritGenesis`.
 *
 * Un tunnel : hors de l'en-tête et du pied du site (`lib/tunnels.ts`),
 * interdit d'index ici pour ses trois pages, absent de `sitemap.ts`, thème
 * clair forcé par `FournisseurTheme`.
 *
 * **Le dessin est celui de l'optin ClickFunnels de Rémy**,
 * `funnels.club/course-2027-fb-2`, et non celui du tunnel VSL : PT Serif
 * partout, bouton bleu à angles droits, surlignages bleu pâle et rose,
 * bannière de paysage. `data-genesis` pose les polices et les jetons, voir
 * `globals.css` et `PoliceGenesis`.
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
  return <GabaritGenesis>{children}</GabaritGenesis>;
}
