import { cn } from "@repo/ui/lib/utils";

/**
 * La flèche qui désigne le formulaire de l'optin, sur demande de Rémy :
 * elle part de la fin du sous-titre et plonge vers le haut du formulaire.
 *
 * **Une flèche faite à la main, en noir**, à sa demande, et pas son croquis
 * recopié : un trait de feutre d'épaisseur constante, une petite boucle au
 * milieu du trajet, des courbes un peu irrégulières, et une pointe en deux
 * traits inégaux, comme on la tracerait d'un geste. Une première version au
 * pinceau, fine au départ et pleine à la pointe, a été refusée : trop
 * mécanique.
 *
 * **Deux tracés et non un tracé étiré.** Sur ordinateur, le formulaire est
 * en face du sous-titre, de l'autre côté de la maquette : la flèche part à
 * hauteur de la dernière ligne du sous-titre et pique dans la marge haute du
 * formulaire, sans toucher la question. Mesuré à 1 200 px de large. Sur
 * téléphone, tout s'empile et la maquette s'intercale ; une flèche qui
 * partirait du sous-titre la traverserait. Elle se loge donc dans l'écart
 * entre la maquette et le formulaire, plus courte, sans boucle faute de
 * place, et pique vers le formulaire depuis la droite. Étirer un seul tracé
 * aurait déformé son épaisseur et sa pointe.
 *
 * Décorative (`aria-hidden`) : le formulaire se trouve sans elle.
 */
export function FlecheGenesis({ className }: { className?: string }) {
  const trait = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <>
      {/* Ordinateur : du sous-titre au formulaire, avec sa boucle. */}
      <svg
        aria-hidden
        viewBox="0 0 80 110"
        className={cn(
          "pointer-events-none absolute hidden text-[var(--genesis-encre)] md:block",
          "-top-[92px] right-[5%] h-[110px] w-[80px]",
          className,
        )}
      >
        <path
          {...trait}
          d="M6 16C19 9 38 6.5 51.5 13.5 64 21 66.5 39 55 45.5 43.5 52 35.5 41 45.5 34.5 57.5 27.5 66.5 43 62.5 61.5 59.5 75.5 52.5 88 44 98"
        />
        <path {...trait} d="M54.5 93.6Q49.2 96.4 44 98Q44.5 93.2 45.9 88.3" />
      </svg>
      {/* Téléphone : dans l'écart au-dessus du formulaire. */}
      <svg
        aria-hidden
        viewBox="0 0 64 56"
        className="pointer-events-none absolute -top-[50px] right-6 h-[56px] w-[64px] text-[var(--genesis-encre)] md:hidden"
      >
        <path {...trait} d="M58 6.5C46.5 3.5 31 8 25 19.5 20.5 28 20.5 38.5 22 48" />
        <path {...trait} d="M16.7 42Q19.6 45.2 22 48Q23.4 44 24.9 40.2" />
      </svg>
    </>
  );
}
