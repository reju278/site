import type { EntretienPile } from "@/components/pile-entretiens";
import { entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";

/**
 * Les entretiens de la pile des confirmations, `/form-funnel-thanks` et
 * `/thanks` : Roland en tête avec son titre et sa note au feutre, puis les
 * autres derrière « Découvrir 3 autres histoires ». Écrits une fois pour les
 * deux pages, sur demande de Rémy, qui voulait la même section sur l'une et
 * l'autre : un ordre recopié aurait divergé au premier changement.
 */

/** Les titres dictés par Rémy ; les autres entretiens gardent leur ligne. */
const TITRES_PILE: Record<string, string> = {
  rgio4y4o8f:
    "Découvre l'histoire de Roland, qui est passé de 0 à 109 778 € en 6 mois avec ce système",
};

/** La note au feutre de Roland, à gauche de sa vidéo sur ordinateur. */
const NOTES_PILE: Record<string, string> = {
  rgio4y4o8f: "Notre success story la plus appréciée !",
};

/** L'ordre de tête, dicté par Rémy ; les autres suivent dans l'ordre
 *  d'`/immersion`. Posé ici pour ne pas changer celui d'`/immersion`. */
const TETE_PILE = [
  "rgio4y4o8f", // Roland
  "j0vbkt570k", // Christian
  "b5taio9plc", // François
  "2xege6bt0u", // Yannick et Sylvie
  "vtfaka0m80", // Olga
];
const ordrePile = [
  ...TETE_PILE,
  ...entretiensImmersion.filter((id) => !TETE_PILE.includes(id)),
];

export const entretiensPile: EntretienPile[] = ordrePile.flatMap((id) => {
  const t = temoignages.find((x) => x.id === id);
  if (!t) return [];
  const entretien: EntretienPile = {
    id,
    nom: t.nom,
    description: t.description,
    secondes: t.secondes,
    titre: TITRES_PILE[id],
    note: NOTES_PILE[id],
  };
  return [entretien];
});

