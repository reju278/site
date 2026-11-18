import { cn } from "@repo/ui/lib/utils";

/**
 * La flèche qui désigne le formulaire de l'optin, sur demande de Rémy :
 * elle part de la fin du sous-titre et pique dans le formulaire.
 *
 * **Une flèche faite à la main, en noir**, à sa demande, et pas son croquis
 * recopié : un trait de feutre d'épaisseur constante, une courbe simple et
 * une pointe en deux traits inégaux, comme d'un seul geste. Deux versions
 * ont été refusées : une au pinceau, trop mécanique, puis une avec une
 * boucle, qui partait au niveau de la première ligne du sous-titre et passait
 * sur son texte.
 *
 * **Elle est placée par la mesure, pas à l'œil.** À partir de 1 065 px de
 * large, l'en-tête et la grille ont atteint leur largeur maximale : la mise
 * en page ne bouge plus, elle se décale seulement d'un bloc. La fin du
 * sous-titre est alors toujours 324 px à droite et 69 px au-dessus du coin
 * du formulaire, la fin de sa première ligne 376 px à droite et 92 px
 * au-dessus, la question du formulaire s'arrête 373 px à droite. La flèche
 * part 12 px après « profitable », à mi-hauteur de la ligne, passe sous la
 * fin de la première ligne et pique à droite de la question. Mesuré à 1 080,
 * 1 200 et 1 440 px.
 *
 * **Entre 768 et 1 065 px, il n'y en a pas** : ces écarts y varient avec la
 * largeur, et une flèche qui part du mauvais endroit est pire que pas de
 * flèche. **Sur téléphone**, tout s'empile et la maquette s'intercale ; une
 * petite flèche se loge au milieu de l'écart au-dessus du formulaire.
 *
 * Décorative (`aria-hidden`) : le formulaire se trouve sans elle.
 */
const trait = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function FlecheGenesis({ className }: { className?: string }) {
  return (
    <>
      {/* Large : de la fin du sous-titre au formulaire. La boîte commence
          330 px à droite et 84 px au-dessus du coin du formulaire. */}
      <svg
        aria-hidden
        viewBox="0 0 90 84"
        className={cn(
          "pointer-events-none absolute -top-[84px] left-[330px] hidden h-[84px] w-[90px] text-[var(--genesis-encre)] min-[1065px]:block",
          className,
        )}
      >
        <path {...trait} d="M6 15C28 4 62 2 77 22C88 37 84 58 74 76" />
        <path {...trait} d="M82.6 70.4Q78 73.6 74 76Q73.6 71.8 74.3 67.4" />
      </svg>
      {/* Téléphone : au milieu de l'écart au-dessus du formulaire. */}
      <svg
        aria-hidden
        viewBox="0 0 40 52"
        className="pointer-events-none absolute -top-[52px] left-1/2 h-[52px] w-[40px] -translate-x-1/2 text-[var(--genesis-encre)] md:hidden"
      >
        <path {...trait} d="M16 4C8 18 10 34 22 46" />
        <path {...trait} d="M19.4 37.2Q20.8 41.8 22 46Q17.8 45 14.3 43.8" />
      </svg>
    </>
  );
}
