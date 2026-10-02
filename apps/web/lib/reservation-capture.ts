/**
 * Le relevé de la réservation transmise par Calendly, à poser en tête de
 * `/thanks`. Voir `reservation.ts` pour le pourquoi.
 *
 * **Ce fichier n'importe pas React**, et c'est la raison de son existence :
 * la page, rendue par le serveur, en lit `scriptCapture`, et un module qui
 * importe un hook ne peut pas entrer dans un composant serveur.
 */

/** La clé du relevé, sur `window` et dans `sessionStorage`. */
export const CLE_RESERVATION = "reservation-calendly";

/**
 * Le relevé, exécuté **dans le HTML** et non par React : voir `scriptCapture`.
 * Il est recopié par `toString()`, donc il ne lit rien hors de ses arguments,
 * de `location`, `history`, `sessionStorage` et `window`.
 */
function capturer(cle: string) {
  try {
    const adresse = new URL(location.href);
    const releve: Record<string, string> = {};
    const garde = new URLSearchParams();
    let trouve = false;

    adresse.searchParams.forEach((valeur, nom) => {
      if (nom.indexOf("utm_") === 0) {
        garde.append(nom, valeur);
        return;
      }
      releve[nom] = valeur;
      trouve = true;
    });
    if (!trouve) return;

    (window as unknown as Record<string, unknown>)[cle] = releve;
    try {
      sessionStorage.setItem(cle, JSON.stringify(releve));
    } catch {
      /* Navigation privée ou stockage refusé : la page garde le relevé en
         mémoire, il ne survivra simplement pas à un rechargement. */
    }

    const reste = garde.toString();
    history.replaceState(
      history.state,
      "",
      adresse.pathname + (reste ? `?${reste}` : "") + adresse.hash,
    );
  } catch {
    /* Un navigateur trop ancien pour `URL` : la page reste générique. */
  }
}

/** Le script à poser en tête de `/thanks`. */
export const scriptCapture = `(${capturer.toString()})(${JSON.stringify(CLE_RESERVATION)});`;
