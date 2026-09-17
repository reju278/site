import { LecteurVideo } from "@/components/lecteur-video";
import { insecables } from "@/lib/typographie";
import { DotPattern } from "@repo/ui/components/dot-pattern";
import { Safari } from "@repo/ui/components/safari";
import { cn } from "@repo/ui/lib/utils";

/**
 * **La géométrie de l'écran de la fenêtre Safari, recopiée de son fichier.**
 *
 * Le composant de registre garde ses constantes pour lui et n'accepte qu'une
 * image ou une vidéo en propriété : il n'y a aucun moyen de lui passer notre
 * lecteur. On pose donc le lecteur nous-mêmes, au même endroit, et ces quatre
 * pourcentages sont ceux qu'il calcule, à la ligne près.
 *
 * Son châssis est en `z-10`, d'où le `z-20` du lecteur : posé sans plan, il
 * passait dessous et on ne voyait que l'écran gris de la fenêtre.
 *
 * **C'est une copie, et elle se surveille.** Le jour où la fenêtre change de
 * dessin, ces valeurs deviennent fausses sans que rien ne le signale : le
 * lecteur se décalera dans le cadre. C'était le prix à payer pour ne pas
 * retoucher un fichier de registre, ce que le dépôt interdit.
 */
const ECRAN = {
  left: `${(1 / 1203) * 100}%`,
  top: `${(52 / 753) * 100}%`,
  width: `${(1200 / 1203) * 100}%`,
  height: `${(700 / 753) * 100}%`,
};

/**
 * L'extrait de coaching, dans une fenêtre Safari.
 *
 * Sur demande de Rémy, qui a fourni les deux composants de registre : la fenêtre
 * `Safari` et le semis de points derrière elle.
 *
 * **Il n'y en a plus qu'un, celui de Sébastien.** Ils étaient deux côte à côte,
 * puis deux qu'on feuilletait avec des flèches ; Rémy a retiré celui de Pascal.
 * Les flèches, l'état qui les accompagnait et le `"use client"` tombent avec
 * lui : sans choix à faire, il n'y a plus rien à tenir en mémoire, et le
 * composant redevient un composant serveur.
 *
 * **Le lecteur remplit l'écran de la fenêtre et perd son rapport 16/9.**
 * L'écran de Safari est en 12/7 ; un cadre en 16/9 y laisserait deux bandes.
 * C'est le cadre qui décide, et le lecteur s'y conforme, `aspect-auto`.
 *
 * **Le semis de points prend l'encre du thème.** Le composant arrive en
 * `text-neutral-400/80`, une couleur en dur que le dépôt interdit : il passe en
 * `text-border`, qui vaut des deux côtés. Son masque est celui de leur
 * démonstration, au pixel près, Rémy l'ayant redonné tel quel.
 */
export function ExtraitsCoaching({
  extrait,
}: {
  extrait: { id: string; titre: string; secondes: number };
}) {
  return (
    <div className="relative mt-10">
      {/* Le semis, derrière la fenêtre. `-z-10` et non un simple ordre de
          document : la fenêtre porte une ombre, et une couche posée dessous
          sans plan la traverserait. */}
      <DotPattern
        className={cn(
          "-z-10 text-border",
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="relative mx-auto max-w-5xl px-1">
        <Safari url="funnels.club" mode="simple" />

        <div className="absolute z-20 overflow-hidden" style={ECRAN}>
          <LecteurVideo
            id={extrait.id}
            titre={extrait.titre}
            secondes={extrait.secondes}
            affiche={`/temoignages/${extrait.id}.jpg`}
            /* Le lecteur de Wistia, servi d'emblée : plus aucune affiche
               cliquable sur cette page. */
            natif
            className="aspect-auto size-full rounded-none"
          />
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-pretty text-muted-foreground">
        {insecables(extrait.titre)}
      </p>
    </div>
  );
}
