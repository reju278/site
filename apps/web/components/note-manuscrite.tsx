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
    className="h-12 w-10"
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
  cote = "gauche",
  className,
}: {
  children: React.ReactNode;
  /** Une seconde ligne, plus petite : « Vidéo 1/2 ». */
  legende?: React.ReactNode;
  /** Où se pose la note sur ordinateur, par rapport à la vidéo. À droite,
   *  la flèche part vers la gauche. Sur téléphone, toujours au-dessus. */
  cote?: "gauche" | "droite";
  className?: string;
}) {
  const aDroite = cote === "droite";
  return (
    <div
      className={cn(
        feutre.className,
        // Au-dessus de la vidéo : la flèche doit rester visible jusqu'à son bord.
        "relative z-10 flex items-center text-foreground max-lg:flex-col lg:items-end",
        aDroite ? "lg:flex-row-reverse" : "lg:flex-row",
        className,
      )}
    >
      <div className={cn("text-center", aDroite ? "rotate-3 lg:text-left" : "-rotate-3 lg:text-right")}>
        <p className="text-[1.65rem] leading-[1.05] text-balance lg:text-[1.9rem]">
          {children}
        </p>
        {/* Sur téléphone, la flèche part de la droite de « Vidéo 1/2 » et non
            du dessous : la note gagne une ligne et descend vers la vidéo. */}
        <p className="mt-1 flex items-start justify-center gap-1 text-xl text-foreground/70 lg:block lg:text-2xl">
          {legende}
          <span className="text-foreground lg:hidden">
            <FlecheBas />
          </span>
        </p>
      </div>
      <span
        className={cn(
          "hidden shrink-0 lg:-mb-2 lg:block",
          aDroite ? "lg:mr-1 -scale-x-100" : "lg:ml-1",
        )}
      >
        <FlecheDroite />
      </span>
    </div>
  );
}
