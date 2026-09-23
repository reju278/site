import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { PiedImmersion } from "@/components/pied-immersion";
import { ancresPreparation } from "@/contenu/preparation";
import type { Metadata } from "next";

/**
 * Le cadre de la page de préparation. Voir l'issue #4.
 *
 * **C'est celui d'`/immersion`, moins la barre des tâches**, sur demande de
 * Rémy. Tout ce qui y est écrit vaut ici : un tunnel, retiré de l'en-tête et du
 * pied de page du site par `lib/tunnels.ts`, interdit d'index dans le gabarit
 * pour que toute sous-page naisse non indexée, absent de `sitemap.ts`.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : relatif, il se résoudrait contre `metadataBase`,
     donc contre `remy-jupille.com`. Voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/preparation" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutPreparation({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      /* Les mesures de la vidéo, **recopiées** du gabarit d'`/immersion` et non
         partagées : c'est la même recette, et le hero et `globals.css` les
         lisent sous ces trois noms. Le jour où l'une change là-bas, elle change
         ici. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 76rem)",
          "--video-h": "calc(var(--largeur-video) * 9 / 16)",
          "--part-cachee": "calc(var(--video-h) / 6)",
        } as React.CSSProperties
      }
    >
      <EnTeteImmersion ancres={ancresPreparation} />
      {children}
      {/* L'écart entre l'équipe et la signature. Sur `/immersion`, la barre des
          tâches s'y ajoute ; sans elle, il reste celui-ci. */}
      <div aria-hidden className="h-11 sm:h-12" />
      <PiedImmersion />
    </div>
  );
}
