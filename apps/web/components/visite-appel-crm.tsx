"use client";

import { API_FUNNELS } from "@/contenu/vsl";
import { lireContactVsl } from "@/lib/prenom-vsl";
import { useEffect } from "react";

/**
 * **Dit au CRM qui arrive sur la page d'appel d'un tunnel**, sur demande de
 * Rémy : la colonne « Page d'appel » de l'onglet Inscription (oui ou non, au
 * dessin des tableaux des closeurs). Course modèle (`/course-modele/appel`)
 * et Formation Genesis (`/reservation`, depuis le 27 novembre 2026), chacun
 * vers son point d'opt-in.
 *
 * L'adresse est celle que le navigateur garde de l'opt-in (la même qui
 * préremplit Calendly), sinon celle d'un lien d'e-mail (`?email=`). Sans
 * adresse, rien ne part : la visite reste comptée sans nom par
 * `CompteurVue`. Le CRM ne note que la première visite, et seulement pour
 * une adresse déjà inscrite (`funnelOptins.visiterAppel`). Une ouverture
 * depuis le CRM (`?apercu=1`) ne compte pas.
 */
export function VisiteAppelCrm({
  tunnel = "course-modele",
}: {
  /** Le point d'opt-in du tunnel dans le CRM : `/<tunnel>/optin`. */
  tunnel?: "course-modele" | "genesis";
}) {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("apercu")) return;
    const contact = lireContactVsl();
    const email =
      (typeof contact?.email === "string" ? contact.email.trim() : "") ||
      params.get("email")?.trim() ||
      "";
    if (!email) return;
    void fetch(`${API_FUNNELS}/${tunnel}/optin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ etape: "appel", email }),
    }).catch(() => {});
  }, [tunnel]);
  return null;
}
