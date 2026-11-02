import { Caveat } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";

/**
 * Une note écrite à la main, au feutre, avec sa flèche : ce qu'on griffonne
 * dans la marge pour montrer où cliquer. Demandée par Rémy au-dessus de la
 * vidéo de `/form-funnel-thanks`, et à sa gauche sur ordinateur.
 *
 * La police est Caveat en gras, la plus proche d'un feutre qui reste lisible
 * en petit. Elle n'est chargée que sur les pages qui montent ce composant.
 */
const feutre = Caveat({ subsets: ["latin"], weight: "700", display: "swap" });

/** La flèche qui descend vers la vidéo (téléphone). */
const FlecheBas = () => (
  <svg
    viewBox="0 0 60 70"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="h-14 w-12"
  >
    <path d="M14 4c18 6 30 22 26 52" />
    <path d="M28 46l12 12 9-15" />
  </svg>
);

/** La flèche qui part vers la droite, vers la vidéo (ordinateur). */
const FlecheDroite = () => (
  <svg
    viewBox="0 0 110 60"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="h-14 w-28"
  >
    <path d="M4 10c26 34 62 38 96 30" />
    <path d="M86 26l15 14-17 10" />
  </svg>
);

export function NoteManuscrite({
  children,
  legende,
  className,
}: {
  children: React.ReactNode;
  /** Une seconde ligne, plus petite : « Vidéo 1/2 ». */
  legende?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        feutre.className,
        "flex items-center text-primary max-lg:flex-col lg:flex-row lg:items-end",
        className,
      )}
    >
      <p className="-rotate-3 text-center text-[1.65rem] leading-[1.05] text-balance lg:text-right lg:text-[1.9rem]">
        {children}
        {legende ? (
          <span className="mt-1 block text-xl text-primary/70 lg:text-2xl">
            {legende}
          </span>
        ) : null}
      </p>
      <span className="max-lg:mt-1 max-lg:translate-x-8 lg:hidden">
        <FlecheBas />
      </span>
      <span className="hidden shrink-0 lg:-mb-2 lg:ml-1 lg:block">
        <FlecheDroite />
      </span>
    </div>
  );
}
