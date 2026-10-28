"use client";

import {
  CLE_CONTACT_VSL,
  CLE_REPONSES_VSL,
  DUREE_CONTACT_VSL,
} from "@/contenu/vsl";
import { useEffect, useState } from "react";

/** L'événement de fenêtre qui annonce que les réponses viennent d'être
 * enregistrées : le calculateur, monté sous le questionnaire, s'y règle. */
export const REPONSES_VSL_ENREGISTREES = "vsl-reponses-enregistrees";

export type ReponsesVsl = Partial<
  Record<"activite" | "objectif" | "prix", string>
>;

/** Un objet du `localStorage` encore frais, ou `null`. */
function lireFrais<T>(cle: string): (T & { t?: number }) | null {
  try {
    const valeur = JSON.parse(localStorage.getItem(cle) || "null") as
      (T & { t?: number }) | null;
    if (!valeur || Date.now() - (valeur.t ?? 0) >= DUREE_CONTACT_VSL)
      return null;
    return valeur;
  } catch {
    return null;
  }
}

export function lireContactVsl() {
  return lireFrais<{ prenom?: unknown; email?: unknown }>(CLE_CONTACT_VSL);
}

export function lireReponsesVsl() {
  return lireFrais<ReponsesVsl>(CLE_REPONSES_VSL);
}

export function enregistrerReponsesVsl(reponses: ReponsesVsl) {
  try {
    localStorage.setItem(
      CLE_REPONSES_VSL,
      JSON.stringify({ ...reponses, t: Date.now() }),
    );
  } catch {
    /* Stockage bloqué : Calendly ne sera pas pré-rempli, rien d'autre. */
  }
  window.dispatchEvent(new Event(REPONSES_VSL_ENREGISTREES));
}

/**
 * Le prénom laissé à l'opt-in de `/course`, pour les titres du tunnel VSL.
 *
 * **Lu dans le navigateur, après le rendu**, là où l'opt-in l'a rangé
 * (`localStorage`, sept jours, jamais dans l'adresse) : le serveur ne le
 * connaît pas. Vide quand il n'y en a pas (stockage bloqué, contact trop
 * ancien, lien ouvert directement), et chaque titre doit rester juste sans
 * lui.
 */
export function usePrenomVsl(): string {
  const [prenom, setPrenom] = useState("");
  useEffect(() => {
    const contact = lireContactVsl();
    if (typeof contact?.prenom === "string") setPrenom(contact.prenom.trim());
  }, []);
  return prenom;
}

/** Les réponses au questionnaire, relues quand il vient d'être rempli. */
export function useReponsesVsl(): ReponsesVsl | null {
  const [reponses, setReponses] = useState<ReponsesVsl | null>(null);
  useEffect(() => {
    const relire = () => setReponses(lireReponsesVsl());
    relire();
    window.addEventListener(REPONSES_VSL_ENREGISTREES, relire);
    return () => window.removeEventListener(REPONSES_VSL_ENREGISTREES, relire);
  }, []);
  return reponses;
}
