/**
 * La pastille sous le bouton d'appel de la VSL de Course modèle : un point
 * vert qui palpite et « 27 personnes ont réservé leur appel au cours des
 * dernières 24 heures », sur demande de Rémy.
 *
 * **Le nombre est vrai** : celui des réservations de candidature des
 * dernières 24 heures, compté par le CRM (`/course-modele/reservations-recentes`)
 * et relu par la page toutes les dix minutes. Rémy demandait un chiffre tiré
 * au hasard entre 24 et 35 ; un chiffre inventé présenté comme réel est une
 * pratique commerciale trompeuse, et le vrai tombe dans cette fourchette (de
 * 700 à 900 réservations par mois). La page ne la montre pas sous
 * `SEUIL_PASTILLE`, ni quand le CRM ne répond pas.
 *
 * `data-rond` : le gabarit du tunnel équerre tout ce qui est arrondi, sauf
 * ce qui le demande.
 */
export function PastilleReservations({ nombre }: { nombre: number }) {
  return (
    <p
      data-rond
      className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white px-4 py-2 font-[family-name:var(--font-genesis-bouton)] text-sm leading-snug text-[var(--genesis-encre)] shadow-[0_1px_8px_-2px_rgba(0,0,0,0.12)]"
    >
      <span aria-hidden className="relative flex size-2.5 shrink-0">
        <span
          data-rond
          className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--genesis-vert)] opacity-75 motion-reduce:animate-none"
        />
        <span
          data-rond
          className="relative inline-flex size-2.5 rounded-full bg-[var(--genesis-vert)]"
        />
      </span>
      <span className="text-left text-pretty">
        <strong>{nombre} personnes</strong> ont réservé leur appel au cours
        des dernières 24&nbsp;heures
      </span>
    </p>
  );
}

/** En dessous, la pastille se tait : quelques réservations ne disent rien. */
export const SEUIL_PASTILLE = 10;
