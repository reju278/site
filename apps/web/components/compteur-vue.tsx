"use client";

import { API_FUNNELS } from "@/contenu/vsl";
import { useEffect } from "react";

/**
 * Compte une visite de la page dans le CRM Funnels Club (onglet Funnels).
 *
 * Un identifiant de visiteur tiré au hasard et gardé dans le navigateur —
 * ni cookie, ni donnée personnelle — pour distinguer les visiteurs des
 * pages vues. `sendBeacon` part sans attendre de réponse et sans
 * pré-vérification CORS. Une ouverture depuis le CRM (`?apercu=1`) ne
 * compte pas.
 */
export function CompteurVue({
  tunnel,
  etape,
}: {
  tunnel: string;
  etape: string;
}) {
  useEffect(() => {
    if (new URLSearchParams(location.search).has("apercu")) return;
    let visiteur = "";
    try {
      visiteur = localStorage.getItem("funnel-visiteur") ?? "";
      if (!/^[a-z0-9]{16,40}$/.test(visiteur)) {
        visiteur = Array.from(crypto.getRandomValues(new Uint8Array(12)), (o) =>
          o.toString(36).padStart(2, "0"),
        )
          .join("")
          .slice(0, 24);
        localStorage.setItem("funnel-visiteur", visiteur);
      }
    } catch {
      return;
    }
    const corps = JSON.stringify({ tunnel, etape, visiteur });
    navigator.sendBeacon?.(
      `${API_FUNNELS}/challenge/vue`,
      new Blob([corps], { type: "text/plain" }),
    );
  }, [tunnel, etape]);
  return null;
}
