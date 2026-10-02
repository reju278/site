import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import type { Metadata } from "next";

/**
 * Le cadre de la page de confirmation.
 *
 * **C'est celui d'`/appel`** : un tunnel, retiré de l'en-tête et du pied de
 * page du site par `lib/tunnels.ts`, interdit d'index ici, absent de
 * `sitemap.ts`. L'en-tête ne garde que la marque, et la page est forcée au
 * clair par `FournisseurTheme`.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/thanks" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutThanks({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      /* `--largeur-video` est la largeur de la carte de l'étape 1, et
         `--video-h` la hauteur de sa vidéo, rembourrage de la carte déduit
         (1,5 rem de chaque côté en grand ; un demi-rem d'écart sur
         téléphone, qui ne déplace la jonction que de quelques pixels). Le
         hero place sa jonction avec elle.

         **56 rem**, réduits depuis 64 sur demande de Rémy : deux vidéos se
         suivent, et chacune prenait presque un écran. Elles ne basculent
         pas, donc `--part-cachee` n'est pas déclarée. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 56rem)",
          "--video-h": "calc((var(--largeur-video) - 3rem) * 9 / 16)",
        } as React.CSSProperties
      }
    >
      <EnTeteImmersion ancres={[]} bascule={false} />
      {children}
      {/* Le pied de page d'`/appel` : la marque, un filet, les mentions du
          site. La page source les porte aussi. */}
      <div aria-hidden className="h-16 sm:h-24" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet />
      </PiedImmersion>
    </div>
  );
}
