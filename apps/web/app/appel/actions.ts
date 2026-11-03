"use server";

import { reservationYt } from "@/contenu/appel";

/**
 * La réservation de l'appel par l'API de Calendly, côté serveur (issue #7).
 *
 * **Le jeton ne quitte jamais le serveur** : `CALENDLY_API_TOKEN`, sans
 * préfixe `NEXT_PUBLIC_`, lu ici et nulle part ailleurs. La page n'appelle que
 * ces deux fonctions, et Calendly envoie ensuite l'invitation et les rappels
 * comme pour une réservation faite chez lui.
 *
 * C'est la recette du formulaire de réservation du CRM Funnels-Club
 * (`formulairesReservation.ts`), reprise pour l'événement de la VSL : deux
 * semaines de créneaux lues par tranches de sept jours, la limite de l'API,
 * puis `POST /invitees`.
 *
 * Sans jeton, `lireCreneaux` rend `null`, et la page retombe sur le
 * formulaire de Calendly intégré : on ne perd aucune réservation le temps que
 * la variable soit posée dans Vercel.
 */

const jeton = () => process.env.CALENDLY_API_TOKEN || undefined;

const JOURS = 14;
const TRANCHE = 7;

/** Les créneaux libres des deux prochaines semaines, ou `null`. */
export async function lireCreneaux(): Promise<string[] | null> {
  const token = jeton();
  if (!token)
    return process.env.NODE_ENV === "development" ? creneauxFictifs() : null;

  // Calendly refuse un début dans le passé : on part d'une minute plus tard.
  const debut = Date.now() + 60_000;
  const libres: string[] = [];
  for (let jour = 0; jour < JOURS; jour += TRANCHE) {
    const adresse = new URL(
      "https://api.calendly.com/event_type_available_times",
    );
    adresse.searchParams.set("event_type", reservationYt.evenement);
    adresse.searchParams.set(
      "start_time",
      new Date(debut + jour * 86_400_000).toISOString(),
    );
    adresse.searchParams.set(
      "end_time",
      new Date(
        debut + Math.min(jour + TRANCHE, JOURS) * 86_400_000,
      ).toISOString(),
    );
    const reponse = await fetch(adresse, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!reponse.ok) {
      console.error("Créneaux Calendly", reponse.status, await reponse.text());
      return null;
    }
    const corps = (await reponse.json()) as {
      collection?: { status?: string; start_time?: string }[];
    };
    for (const creneau of corps.collection ?? []) {
      if (creneau.status === "available" && creneau.start_time)
        libres.push(creneau.start_time);
    }
  }
  return libres;
}

/**
 * **En développement seulement, et sans jeton** : des créneaux inventés, pour
 * voir l'écran sans la clé Calendly. Quatre jours, de 12 h à 19 h, tous les
 * quarts d'heure. La réservation, elle, échoue sans jeton : rien ne part.
 * En production, l'absence de jeton rend `null` et la page retombe sur le
 * formulaire de Calendly.
 */
function creneauxFictifs(): string[] {
  const creneaux: string[] = [];
  for (let jour = 1; jour <= 4; jour++) {
    for (let minutes = 12 * 60; minutes <= 19 * 60; minutes += 15) {
      const date = new Date();
      date.setDate(date.getDate() + jour);
      date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
      creneaux.push(date.toISOString());
    }
  }
  return creneaux;
}

export type DemandeReservation = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  debut: string;
  fuseau: string;
  /** Une réponse par clé de `reservationYt.questions`. */
  reponses: Record<string, string>;
  utm: Record<string, string>;
};

export type ResultatReservation =
  | { ok: true; hote?: string; fin?: string }
  | { ok: false; erreur: string; pris?: boolean };

const texte = (valeur: unknown, max: number) =>
  typeof valeur === "string" ? valeur.trim().slice(0, max) : "";

/**
 * La réservation. Tout ce qui vient de la page est relu ici : une server
 * action est une adresse publique, n'importe qui peut l'appeler.
 */
export async function reserverAppel(
  demande: DemandeReservation,
): Promise<ResultatReservation> {
  const token = jeton();
  if (!token)
    return { ok: false, erreur: "La réservation est indisponible pour le moment." };

  const prenom = texte(demande.prenom, 60);
  const nom = texte(demande.nom, 80);
  const email = texte(demande.email, 200);
  const telephone = texte(demande.telephone, 20);
  const debut = texte(demande.debut, 40);
  const fuseau = texte(demande.fuseau, 64) || "Europe/Paris";

  if (!prenom) return { ok: false, erreur: "Indique ton prénom." };
  if (!nom) return { ok: false, erreur: "Indique ton nom." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, erreur: "Ton adresse e-mail ne semble pas complète." };
  if (!/^\+\d{8,15}$/.test(telephone))
    return { ok: false, erreur: "Ton numéro de téléphone ne semble pas complet." };
  if (Number.isNaN(Date.parse(debut)) || Date.parse(debut) < Date.now())
    return { ok: false, erreur: "Ce créneau n'est plus disponible.", pris: true };

  const reponses: { question: string; answer: string; position: number }[] = [
    {
      question: reservationYt.questionTelephone,
      answer: telephone,
      position: 0,
    },
  ];
  for (const question of reservationYt.questions) {
    const reponse = texte(demande.reponses?.[question.cle], 2000);
    if (!reponse) {
      if (!question.obligatoire) continue;
      return { ok: false, erreur: "Réponds à toutes les questions." };
    }
    reponses.push({
      question: question.question,
      answer: reponse,
      position: question.position,
    });
  }

  const utm = (cle: string) => texte(demande.utm?.[cle], 100) || null;
  const reponse = await fetch("https://api.calendly.com/invitees", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: reservationYt.evenement,
      start_time: new Date(debut).toISOString(),
      invitee: {
        first_name: prenom,
        last_name: nom,
        email,
        timezone: fuseau,
      },
      // Un événement en tourniquet ne prend pas de lieu : Calendly le pose.
      questions_and_answers: reponses,
      tracking: {
        utm_source: utm("utm_source"),
        utm_medium: utm("utm_medium"),
        utm_campaign: utm("utm_campaign"),
        utm_content: utm("utm_content"),
        utm_term: utm("utm_term"),
        salesforce_uuid: null,
      },
    }),
  });
  if (!reponse.ok) {
    console.error("Réservation Calendly", reponse.status, await reponse.text());
    const pris = reponse.status === 400 || reponse.status === 409;
    return {
      ok: false,
      pris,
      erreur: pris
        ? "Ce créneau vient d'être pris. Choisis-en un autre."
        : "La réservation n'a pas abouti. Réessaie dans un instant.",
    };
  }

  /* L'hôte que le tourniquet a choisi, et la fin du rendez-vous : `/thanks`
     les affiche, comme après une réservation chez Calendly. Facultatifs, une
     relecture qui échoue ne défait pas la réservation. */
  try {
    const invite = (await reponse.json()) as { resource?: { event?: string } };
    const adresse = invite.resource?.event;
    if (!adresse) return { ok: true };
    const evenement = await fetch(adresse, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!evenement.ok) return { ok: true };
    const corps = (await evenement.json()) as {
      resource?: {
        end_time?: string;
        event_memberships?: { user_name?: string }[];
      };
    };
    return {
      ok: true,
      hote: corps.resource?.event_memberships?.[0]?.user_name,
      fin: corps.resource?.end_time,
    };
  } catch {
    return { ok: true };
  }
}
