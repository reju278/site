import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { reservationAppel } from "@/contenu/appel";
import type { Metadata } from "next";

/**
 * Le cadre de la page de réservation d'appel.
 *
 * **C'est celui de `/preparation`**, et donc d'`/immersion` : un tunnel,
 * retiré de l'en-tête et du pied de page du site par `lib/tunnels.ts`,
 * interdit d'index ici, absent de `sitemap.ts`. L'en-tête ne garde que la
 * marque, sur demande de Rémy : ni ancres, ni bascule de thème, la page étant
 * forcée au clair par `FournisseurTheme`.
 */
export const metadata: Metadata = {
  /* Absolu et non relatif : voir le gabarit d'`/immersion`. */
  alternates: { canonical: "https://go.funnels.club/appel" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutAppel({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      /* Les mêmes noms que les gabarits des deux autres pages, que lisent le
         hero et `[data-hero]` dans `globals.css`. La « vidéo » est ici le
         formulaire de Calendly à sa hauteur minimale, et la jonction tombe
         donc à son milieu ; quand il grandit, `--surplus-formulaire` la
         garde en place. Le formulaire ne bascule pas, donc rien ne dépasse
         sous l'écran et `--part-cachee` n'est pas déclarée. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 64rem)",
          "--video-h": `${reservationAppel.hauteurMin}px`,
        } as React.CSSProperties
      }
    >
      <EnTeteImmersion ancres={[]} bascule={false} />
      {children}
      {/* **Le pied de page, loin sous le formulaire**, sur demande de Rémy :
          la marque, un filet, puis les mentions du pied de page du site.
          L'écart et le filet disent qu'on a quitté la page pour son pied.
          Les liens légaux s'ouvrent dans un nouvel onglet, pour qu'on ne
          quitte pas la réservation. */}
      <div aria-hidden className="h-28 sm:h-40" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet />
      </PiedImmersion>
    </div>
  );
}
