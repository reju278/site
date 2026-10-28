"use client";

import { CLE_CONTACT_VSL } from "@/contenu/vsl";
import { useEffect, useState } from "react";

/**
 * Le titre de `/video-vsl`, suivi du prénom laissé à l'opt-in de `/course`.
 *
 * **Le prénom est lu dans le navigateur, après le rendu**, là où l'opt-in l'a
 * rangé (`sessionStorage`, jamais dans l'adresse) : le serveur ne le connaît
 * pas. Sans prénom (stockage bloqué, autre onglet, lien ouvert directement),
 * la phrase s'arrête après « comme promis » et reste juste.
 */
export function TitreVideoVsl({ texte }: { texte: string }) {
  const [prenom, setPrenom] = useState("");

  useEffect(() => {
    try {
      const contact = JSON.parse(
        sessionStorage.getItem(CLE_CONTACT_VSL) || "null",
      ) as { prenom?: unknown } | null;
      if (typeof contact?.prenom === "string") setPrenom(contact.prenom.trim());
    } catch {
      /* Stockage bloqué : le titre reste sans prénom. */
    }
  }, []);

  return (
    <h1 className="titre text-2xl text-balance text-foreground sm:text-3xl">
      {texte}
      {prenom ? `, ${prenom}` : null}
    </h1>
  );
}
