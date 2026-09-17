"use client";

import { InteractiveGridPattern } from "@repo/ui/components/interactive-grid-pattern";
import { cn } from "@repo/ui/lib/utils";

/**
 * Le quadrillage de cases posé derrière les extraits de coaching.
 *
 * **C'est la démonstration de MagicUI, reprise à la lettre**, sur demande de
 * Rémy, qui a fourni son code : les propriétés par défaut du composant, et ces
 * deux lignes de classes et pas d'autres. Le masque est un disque de 400 px au
 * centre, donc le quadrillage n'apparaît qu'au milieu de la section et s'éteint
 * bien avant d'en atteindre les bords ; l'inclinaison et la double hauteur sont
 * ce qui lui donne sa fuite.
 *
 * **Une première version l'avait adapté** : cases arrondies à 5 px, filet en
 * `stroke-border`, survol au bleu du site, cases carrées forcées par
 * `preserveAspectRatio`, et le tout derrière trois sections. Rémy a tranché pour
 * la démonstration telle quelle et pour cette section seule. Ses gris en dur
 * restent donc, et c'est cohérent avec la règle du dépôt sur le code de
 * registre : on ne le retouche pas.
 *
 * **Le conteneur ne prend pas les événements, les cases oui.** Sans cela, le
 * calque couvrirait la section et prendrait les clics du contenu au-dessus.
 */
export function FondCases() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <InteractiveGridPattern
        className={cn(
          "pointer-events-auto",
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
  );
}
