import { cn } from "@repo/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Le choix du jour de la réservation, en bande de semaine, sur demande de
 * Rémy : repris de `BookingSlotCalendar` (21st.dev), dont il a collé le code,
 * mais **dans le dessin du formulaire**, et non comme une carte de plus. La
 * semaine commence le lundi, et seuls les jours qui ont un créneau se cliquent.
 *
 * **La semaine affichée se déduit du jour choisi**, sans état à elle : une
 * flèche choisit le premier jour libre de la semaine voisine, ce qui saute les
 * semaines vides et garde les heures du dessous accordées à ce qu'on voit.
 */

/** Un jour, au fuseau du navigateur : la clé qui groupe les créneaux. */
export const cleDuJour = (date: Date) =>
  new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

/** Une clé rendue en date, à midi pour rester à l'abri des changements d'heure. */
export function dateDuJour(cle: string) {
  const [annee, mois, jour] = cle.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return new Date(annee, mois - 1, jour, 12);
}

const plusJours = (date: Date, jours: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + jours, 12);

const lundiDe = (date: Date) => plusJours(date, -((date.getDay() + 6) % 7));

const mise = (options: Intl.DateTimeFormatOptions, date: Date) =>
  new Intl.DateTimeFormat("fr-FR", options).format(date);

const FLECHE =
  "flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary/10 disabled:text-foreground/30 disabled:hover:bg-transparent sm:size-9";

export function ChoixJour({
  jours,
  actif,
  choisir,
  libelle,
}: {
  /** Les jours qui ont au moins un créneau, dans l'ordre. */
  jours: readonly string[];
  actif: string;
  choisir: (cle: string) => void;
  libelle: string;
}) {
  const semaines = [...new Set(jours.map((j) => cleDuJour(lundiDe(dateDuJour(j)))))];
  const semaine = cleDuJour(lundiDe(dateDuJour(actif)));
  const rang = semaines.indexOf(semaine);
  const lundi = dateDuJour(semaine);
  const septJours = Array.from({ length: 7 }, (_, i) => plusJours(lundi, i));
  const aujourdhui = cleDuJour(new Date());

  const allerA = (autre: string | undefined) => {
    const premier = jours.find(
      (j) => cleDuJour(lundiDe(dateDuJour(j))) === autre,
    );
    if (premier) choisir(premier);
  };

  return (
    <div role="radiogroup" aria-label={libelle} className="flex flex-col gap-2">
      {/* Le mois au centre, entre ses deux flèches, comme chez Calendly. Elles
          restent visibles, éteintes quand il n'y a rien de ce côté. */}
      <div className="flex min-h-10 items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Semaine précédente"
          disabled={rang <= 0}
          onClick={() => allerA(semaines[rang - 1])}
          className={FLECHE}
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        {/* Le mois du jeudi, qui est celui de la plus grande part de la semaine. */}
        <h2 className="text-lg font-bold text-foreground first-letter:uppercase">
          {mise({ month: "long", year: "numeric" }, septJours[3] as Date)}
        </h2>
        <button
          type="button"
          aria-label="Semaine suivante"
          disabled={rang >= semaines.length - 1}
          onClick={() => allerA(semaines[rang + 1])}
          className={FLECHE}
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
      {/* La `key` rejoue l'entrée quand la semaine change. */}
      <div
        key={semaine}
        className="-mx-3 grid grid-cols-7 justify-items-center transition-[opacity,translate] sm:mx-0 duration-300 starting:translate-x-2 starting:opacity-0"
      >
        {septJours.map((date) => {
          const cle = cleDuJour(date);
          const libre = jours.includes(cle);
          const choisi = cle === actif;
          return (
            <button
              key={cle}
              type="button"
              role="radio"
              aria-checked={choisi}
              aria-label={`${cle === aujourdhui ? "Aujourd'hui, " : ""}${mise(
                { weekday: "long", day: "numeric", month: "long" },
                date,
              )}`}
              disabled={!libre}
              onClick={() => choisir(cle)}
              className="group flex w-full flex-col items-center gap-1 px-px"
            >
              <span
                aria-hidden
                className={cn(
                  "text-sm font-semibold",
                  libre ? "text-muted-foreground" : "text-foreground/30",
                )}
              >
                {mise({ weekday: "short" }, date)}
              </span>
              <span
                className={cn(
                  "relative flex aspect-square w-full max-w-12 items-center justify-center rounded-full text-lg tabular-nums transition-colors",
                  choisi && "bg-primary font-bold text-primary-foreground",
                  !choisi &&
                    libre &&
                    "bg-primary/10 font-semibold text-primary group-hover:bg-primary/20",
                  !libre && "text-foreground/30",
                )}
              >
                {date.getDate()}
                {/* Le point d'aujourd'hui, comme chez Calendly. Il prend la
                    couleur du chiffre, donc reste lisible sur le bleu plein. */}
                {cle === aujourdhui ? (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current sm:bottom-1.5"
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
