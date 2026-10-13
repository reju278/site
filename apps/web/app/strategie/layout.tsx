import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { PiedImmersion } from "@/components/pied-immersion";
import type { Metadata } from "next";

/**
 * Le cadre de la page de stratégie, `go.funnels.club/strategie`.
 *
 * **C'est celui de `/preparation`**, et donc d'`/immersion` : un tunnel,
 * retiré de l'en-tête et du pied de page du site par `lib/tunnels.ts`,
 * interdit d'index ici, absent de `sitemap.ts`. L'en-tête ne garde que la
 * marque et la bascule de thème : la page n'a qu'une section, une capsule
 * d'ancres n'y désignerait rien.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/strategie" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutStrategie({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      /* Les mesures de la vidéo, sous les trois noms que lisent le hero et
         `globals.css`, comme sur `/preparation`. **La largeur est plus étroite
         qu'ailleurs**, 52rem au lieu de 76rem, sur demande de Rémy : la vidéo
         était trop grosse sur ordinateur. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 52rem)",
          "--video-h": "calc(var(--largeur-video) * 9 / 16)",
          "--part-cachee": "calc(var(--video-h) / 6)",
        } as React.CSSProperties
      }
    >
      <EnTeteImmersion ancres={[]} />
      {children}
      <div aria-hidden className="h-11 sm:h-12" />
      <PiedImmersion />
    </div>
  );
}
