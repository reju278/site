"use client";

import { LecteurVideo } from "@/components/lecteur-video";
import { insecables } from "@/lib/typographie";
import { DotPattern } from "@repo/ui/components/dot-pattern";
import { Safari } from "@repo/ui/components/safari";
import { cn } from "@repo/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

/**
 * **La géométrie de l'écran de la fenêtre Safari, recopiée de son fichier.**
 *
 * Le composant de registre garde ses constantes pour lui et n'accepte qu'une
 * image ou une vidéo en propriété : il n'y a aucun moyen de lui passer notre
 * lecteur. On pose donc le lecteur nous-mêmes, au même endroit, et ces quatre
 * pourcentages sont ceux qu'il calcule, à la ligne près.
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
 * Les extraits de coaching, dans une fenêtre Safari qu'on feuillette.
 *
 * Sur demande de Rémy, qui a fourni les deux composants de registre : la fenêtre
 * `Safari` et le semis de points derrière elle.
 *
 * **Un seul extrait à la fois, et deux flèches.** Les deux étaient côte à côte,
 * donc deux lecteurs montés d'avance. Ici un seul existe, et la `key` sur le
 * lecteur le fait remonter quand on change : l'iframe précédente est démontée,
 * ce qui coupe le son au passage. C'est le même mécanisme que la fenêtre des
 * entretiens.
 *
 * **Le lecteur remplit l'écran de la fenêtre et perd son rapport 16/9.**
 * L'écran de Safari est en 12/7 ; un cadre en 16/9 y laisserait deux bandes.
 * C'est le cadre qui décide, et le lecteur s'y conforme, `aspect-auto`.
 *
 * **Le semis de points prend l'encre du thème.** Le composant arrive en
 * `text-neutral-400/80`, une couleur en dur que le dépôt interdit : il passe en
 * `text-border`, qui vaut des deux côtés. Son masque est celui de leur
 * démonstration, un disque au centre, agrandi pour suivre la fenêtre.
 */
export function ExtraitsCoaching({
  extraits,
}: {
  extraits: readonly { id: string; titre: string; secondes: number }[];
}) {
  const [rang, setRang] = useState(0);
  const extrait = extraits[rang];
  if (!extrait) return null;

  const aller = (pas: number) =>
    setRang((r) => (r + pas + extraits.length) % extraits.length);

  /* Le même dessin que les flèches du carrousel d'accueil : rondes, et c'est la
     seconde famille que le dépôt autorise pour `rounded-full`. */
  const fleche =
    "flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-9";

  return (
    <div className="relative mt-10">
      {/* Le semis, derrière la fenêtre. `-z-10` et non un simple ordre de
          document : la fenêtre porte une ombre, et une couche posée dessous
          sans plan la traverserait. */}
      <DotPattern
        className={cn(
          "-z-10 text-border",
          "[mask-image:radial-gradient(420px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="mx-auto flex max-w-5xl items-center gap-3 px-1 sm:gap-5">
        <button
          type="button"
          onClick={() => aller(-1)}
          aria-label="Extrait précédent"
          aria-controls="extrait-coaching"
          className={fleche}
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>

        <div id="extrait-coaching" className="relative min-w-0 flex-1">
          <Safari url="funnels.club" mode="simple" />

          <div className="absolute overflow-hidden" style={ECRAN}>
            <LecteurVideo
              key={extrait.id}
              id={extrait.id}
              titre={extrait.titre}
              secondes={extrait.secondes}
              affiche={`/temoignages/${extrait.id}.jpg`}
              /* Le lecteur de Wistia, servi d'emblée : plus aucune affiche
                 cliquable sur cette page. Un seul extrait est monté à la fois,
                 donc une seule iframe. */
              natif
              className="aspect-auto size-full rounded-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => aller(1)}
          aria-label="Extrait suivant"
          aria-controls="extrait-coaching"
          className={fleche}
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      {/* Le titre de l'extrait courant. `aria-live` : la flèche change le
          contenu de la fenêtre sans déplacer le focus, donc rien ne serait
          annoncé à qui ne voit pas l'écran. */}
      <p
        aria-live="polite"
        className="mx-auto mt-4 max-w-2xl text-center text-sm text-pretty text-muted-foreground"
      >
        {insecables(extrait.titre)}
      </p>
    </div>
  );
}
