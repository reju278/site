"use client";

import { CLE_CONTACT_VSL, DUREE_CONTACT_VSL } from "@/contenu/vsl";
import { useEffect, useState } from "react";

/**
 * Le prénom laissé à l'opt-in de `/course`, pour les titres du tunnel VSL.
 *
 * **Lu dans le navigateur, après le rendu**, là où l'opt-in l'a rangé
 * (`localStorage`, sept jours, jamais dans l'adresse) : le serveur ne le connaît pas.
 * Vide quand il n'y en a pas (stockage bloqué, autre onglet, lien ouvert
 * directement), et chaque titre doit rester juste sans lui.
 */
export function usePrenomVsl(): string {
  const [prenom, setPrenom] = useState("");
  useEffect(() => {
    try {
      const contact = JSON.parse(
        localStorage.getItem(CLE_CONTACT_VSL) || "null",
      ) as { prenom?: unknown; t?: number } | null;
      const frais = Date.now() - (contact?.t ?? 0) < DUREE_CONTACT_VSL;
      if (frais && typeof contact?.prenom === "string")
        setPrenom(contact.prenom.trim());
    } catch {
      /* Stockage bloqué : pas de prénom. */
    }
  }, []);
  return prenom;
}
