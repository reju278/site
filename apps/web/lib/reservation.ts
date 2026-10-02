import { questionsReservation } from "@/contenu/thanks";
import { CLE_RESERVATION as CLE } from "@/lib/reservation-capture";
import { useSyncExternalStore } from "react";

/**
 * La réservation que Calendly transmet à `/thanks`, dans l'adresse.
 *
 * Calendly le fait quand l'événement redirige vers une page externe avec la
 * case « Transmettre les détails de l'événement » cochée : `invitee_*`,
 * `event_start_time`, `assigned_to`, `answer_1`, `answer_2`… Rien de tout ça
 * n'est garanti : chaque champ peut manquer, et la page doit alors rester
 * celle d'avant, sans trou ni « undefined ».
 *
 * **Ce sont des données personnelles, et elles arrivent dans l'adresse.** Le
 * site charge Google Tag Manager, qui enregistre l'adresse des pages vues :
 * laissées là, l'e-mail et le téléphone partiraient chez Google. Le script
 * `scriptCapture` les relève donc pendant la lecture du HTML, avant
 * l'hydratation et donc avant GTM, qui part juste après elle, puis les retire
 * de l'adresse. Seules les balises `utm_*` y restent. Ce script vit dans
 * `reservation-capture.ts`, sans React, parce que la page serveur l'importe.
 *
 * Elles sont gardées le temps de l'onglet (`sessionStorage`), pour qu'un
 * rechargement de la page la retrouve telle quelle, et jamais au-delà.
 */

/** Ce que la page sait de la réservation, champ par champ facultatif. */
export type Reservation = {
  prenom?: string;
  nom?: string;
  /** Le nom de l'hôte du rendez-vous, `assigned_to` : « Geoffrey BONNIOT ». */
  hote?: string;
  email?: string;
  telephone?: string;
  /** Le début du rendez-vous, en ISO 8601 avec son décalage. */
  debut?: string;
  /** La fin du rendez-vous, au même format. */
  fin?: string;
  /** Les réponses aux questions du formulaire, dans l'ordre de `questionsReservation`. */
  reponses: { libelle: string; reponse: string }[];
};

/**
 * Une valeur lisible, ou rien : une chaîne vide n'est pas une réponse.
 *
 * **Calendly encode ses valeurs deux fois**, relevé sur une vraie
 * redirection : `event_start_time=2026-10-01T13%253A45…`, `%2540` pour
 * l'arobase. Le navigateur n'en défait qu'une couche ; la seconde se défait
 * ici, et seulement si la valeur en porte une, pour ne pas abîmer une réponse
 * qui contiendrait un vrai « % ». Une séquence mal formée laisse la valeur
 * telle quelle.
 */
function propre(valeur: unknown): string | undefined {
  if (typeof valeur !== "string") return undefined;
  let texte = valeur;
  if (/%[0-9a-f]{2}/i.test(texte)) {
    try {
      texte = decodeURIComponent(texte);
    } catch {
      /* Un « % » ordinaire : la valeur reste comme elle est arrivée. */
    }
  }
  const nette = texte.trim();
  return nette ? nette : undefined;
}

function lire(): Reservation | null {
  const fenetre = window as unknown as Record<string, unknown>;
  let releve = fenetre[CLE] as Record<string, string> | undefined;

  if (!releve) {
    try {
      const garde = sessionStorage.getItem(CLE);
      releve = garde ? (JSON.parse(garde) as Record<string, string>) : undefined;
    } catch {
      releve = undefined;
    }
  }
  if (!releve) return null;

  const plein = propre(releve.invitee_full_name);
  const reponses = questionsReservation.flatMap((question) => {
    const reponse = propre(releve[question.cle]);
    return reponse && question.role === "question"
      ? [{ libelle: question.libelle, reponse }]
      : [];
  });
  const cleTelephone = questionsReservation.find(
    (q) => q.role === "telephone",
  )?.cle;

  return {
    prenom: propre(releve.invitee_first_name) ?? plein?.split(/\s+/)[0],
    nom: propre(releve.invitee_last_name),
    hote: propre(releve.assigned_to),
    email: propre(releve.invitee_email),
    telephone:
      (cleTelephone ? propre(releve[cleTelephone]) : undefined) ??
      propre(releve.text_reminder_number),
    debut: propre(releve.event_start_time),
    fin: propre(releve.event_end_time),
    reponses,
  };
}

/* Lu une fois : le relevé ne change plus après le chargement, et
   `useSyncExternalStore` demande le même objet à chaque lecture. */
let memoire: Reservation | null | undefined;
const lecture = () => (memoire === undefined ? (memoire = lire()) : memoire);
const abonnement = () => () => {};

/**
 * La réservation, côté client. `null` au rendu serveur et à l'hydratation,
 * où la page ne sait rien : le texte générique s'affiche, puis la version
 * personnelle le remplace.
 */
export function useReservation(): Reservation | null {
  return useSyncExternalStore(abonnement, lecture, () => null);
}

/** Une date lisible, ou `undefined` si elle manque ou ne se lit pas. */
function enDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Le jour du rendez-vous, à l'heure du visiteur : « jeudi 1er octobre ».
 *
 * « 1er » et non « 1 » : la typographie française écrit le premier du mois
 * en ordinal, et `Intl` ne le fait pas.
 */
export function jourLisible(iso: string | undefined): string | undefined {
  const date = enDate(iso);
  if (!date) return undefined;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .formatToParts(date)
    .map((m) => (m.type === "day" && m.value === "1" ? "1er" : m.value))
    .join("");
}

/** L'heure, à la française : « 15 h 45 », « 16 h ». */
export function heureLisible(iso: string | undefined): string | undefined {
  const date = enDate(iso);
  if (!date) return undefined;
  const minutes = date.getMinutes();
  return `${date.getHours()}\u00a0h${minutes ? `\u00a0${String(minutes).padStart(2, "0")}` : ""}`;
}

/**
 * La date du rendez-vous, à l'heure du visiteur : « jeudi 1er octobre à
 * 15 h 45 ». `undefined` si Calendly ne l'a pas donnée ou si elle ne se lit
 * pas.
 */
export function dateLisible(iso: string | undefined): string | undefined {
  const jour = jourLisible(iso);
  const heure = heureLisible(iso);
  return jour && heure ? `${jour} à ${heure}` : undefined;
}
