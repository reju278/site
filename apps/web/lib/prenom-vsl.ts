"use client";

import {
  CLE_CONTACT_VSL,
  CLE_REPONSES_VSL,
  DUREE_CONTACT_VSL,
  questionnaireVsl,
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

/**
 * **L'aperçu, en développement seulement** : `?apercu=1&prenom=Rémy&activite=2
 * &objectif=3&prix=1` affiche la page comme si ces réponses avaient été
 * données (numéros des choix, à partir de 1), sans rien écrire dans le
 * navigateur. Ça permet d'ouvrir chaque combinaison dans son onglet, le
 * `localStorage` étant commun à tous les onglets. En production, ces
 * paramètres sont ignorés.
 */
function lireApercu() {
  if (process.env.NODE_ENV === "production") return null;
  const parametres = new URLSearchParams(window.location.search);
  if (!parametres.has("apercu")) return null;
  const choix = (cle: "activite" | "objectif" | "prix") => {
    const question = questionnaireVsl.questions.find((q) => q.cle === cle);
    const rang = Number(parametres.get(cle)) - 1;
    return question?.choix[rang];
  };
  return {
    contact: { prenom: parametres.get("prenom") ?? "", email: "" },
    reponses: {
      activite: choix("activite"),
      objectif: choix("objectif"),
      prix: choix("prix"),
    } as ReponsesVsl,
  };
}

export function lireContactVsl() {
  const apercu = lireApercu();
  if (apercu) return apercu.contact;
  return lireFrais<{ prenom?: unknown; email?: unknown }>(CLE_CONTACT_VSL);
}

export function lireReponsesVsl() {
  const apercu = lireApercu();
  if (apercu) return apercu.reponses;
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
