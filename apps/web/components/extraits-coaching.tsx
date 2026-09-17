import { LecteurVideo } from "@/components/lecteur-video";
import { Safari } from "@repo/ui/components/safari";

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
 * **Le semis de points n'est plus ici.** Il était derrière cette seule fenêtre ;
 * Rémy l'a étendu à toute la traversée, du coaching au mur de la communauté, et
 * il vit donc maintenant dans `page.tsx`. Deux semis superposés, l'un dans
 * l'autre et à des masques différents, se seraient additionnés en un
 * moirage.
 */
export function ExtraitsCoaching({
  extrait,
}: {
  extrait: { id: string; titre: string; secondes: number };
}) {
  return (
    <div className="relative mt-10">
      <div className="relative mx-auto max-w-5xl px-1">
        <Safari url="funnels.club" mode="simple" />

        {/* **`rounded-b-[11px]` : l'écran suit l'arrondi de la fenêtre.**

            Le châssis a les angles bas arrondis ; un écran rectangulaire y
            dépassait par les deux coins, ce que Rémy a vu. Onze pixels est la
            valeur que leur propre fichier applique à son image, recopiée comme
            les quatre pourcentages ci-dessus.

            `[&>div]:rounded-none` : le cadre du lecteur rogne à 5 px, le rayon
            du site. Ici c'est la fenêtre qui décide de la forme, et deux
            arrondis concentriques de rayons différents se voient. */}
        <div
          className="absolute z-20 overflow-hidden rounded-b-[11px]"
          style={ECRAN}
        >
          <LecteurVideo
            id={extrait.id}
            titre={extrait.titre}
            secondes={extrait.secondes}
            affiche={`/temoignages/${extrait.id}.jpg`}
            /* Le lecteur de Wistia, servi d'emblée : plus aucune affiche
               cliquable sur cette page. */
            natif
            className="aspect-auto size-full rounded-none [&>div]:rounded-none"
          />
        </div>
      </div>

    </div>
  );
}
