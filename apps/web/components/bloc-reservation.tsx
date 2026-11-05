import { ReservationAppel } from "@/components/reservation-appel";

/**
 * Le formulaire de réservation dans son bloc, le même sur `/appel` et sur
 * `/appel-relance-newsletter`, sur demande de Rémy.
 */
export function BlocReservation({
  niveauTitre,
}: {
  /** `h2` quand la page porte déjà son propre `h1`. */
  niveauTitre?: "h1" | "h2";
}) {
  return (
    <section
      aria-label="Réservation de l'appel"
      className="-mx-2 rounded-md border border-border bg-card px-4 py-8 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.25)] sm:mx-auto sm:max-w-2xl sm:px-10 sm:py-10"
    >
      <ReservationAppel niveauTitre={niveauTitre} />
    </section>
  );
}
