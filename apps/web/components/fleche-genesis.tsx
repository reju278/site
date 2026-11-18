import { cn } from "@repo/ui/lib/utils";

/**
 * La flèche tracée à la main qui désigne le formulaire de l'optin, sur un
 * croquis de Rémy : elle part de la fin du sous-titre, file à droite, puis
 * plonge vers le haut du formulaire.
 *
 * **Deux tracés et non un tracé étiré.** Sur ordinateur, le formulaire est
 * en face du sous-titre, de l'autre côté de la maquette : la flèche part à
 * hauteur de la dernière ligne du sous-titre et pique dans la marge haute du
 * formulaire, sans toucher la question. Mesuré à 1 200 px de large. Sur
 * téléphone, tout s'empile et la maquette s'intercale ; une flèche qui
 * partirait du sous-titre la traverserait. Elle se loge donc
 * dans l'écart entre la maquette et le formulaire, plus courte, et pique
 * vers le formulaire depuis la droite. Étirer un seul tracé aurait déformé
 * son épaisseur et sa pointe.
 *
 * Le trait est en `--genesis-bleu`, celui du bouton vers lequel elle mène.
 * Un trait graphique demande 3:1, et ce bleu en tient 3,35 sur le blanc.
 * Décorative (`aria-hidden`) : le formulaire se trouve sans elle.
 */
export function FlecheGenesis({ className }: { className?: string }) {
  return (
    <>
      {/* Ordinateur : du sous-titre au formulaire. */}
      <svg
        aria-hidden
        viewBox="0 0 60 96"
        fill="none"
        className={cn(
          "pointer-events-none absolute hidden text-[var(--genesis-bleu)] md:block",
          "-top-[79px] right-[6%] h-[96px] w-[60px]",
          className,
        )}
      >
        <path
          d="M4 8c10-5 26-6 36 3 9 9 9 26 5 42-3 14-8 26-16 36"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M17 78l12 11 13-8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Téléphone : dans l'écart au-dessus du formulaire. */}
      <svg
        aria-hidden
        viewBox="0 0 64 56"
        fill="none"
        className="pointer-events-none absolute -top-[50px] right-6 h-[56px] w-[64px] text-[var(--genesis-bleu)] md:hidden"
      >
        <path
          d="M58 4c-9 3-20 6-28 14-8 7-12 17-14 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M7 38l9 12 10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
