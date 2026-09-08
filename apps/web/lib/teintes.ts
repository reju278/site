/**
 * Les pastilles de couleur du thème.
 *
 * Ces teintes passent par `style` et non par des classes utilitaires : Tailwind
 * ne génère que les classes qu'il voit écrites dans le source, et une classe
 * construite au vol (`bg-pastille-${teinte}`) n'existe donc jamais dans le CSS
 * final. Les jetons `--pastille-*` sont définis pour `:root` et pour `.dark`
 * dans `packages/ui/src/styles/globals.css`, les deux thèmes sont couverts.
 */

export type Teinte =
  | "neutre"
  | "bleu"
  | "vert"
  | "ambre"
  | "rouge"
  | "violet";

/** Fond et texte d'une tuile colorée. */
export function pastille(teinte: Teinte): React.CSSProperties {
  return {
    backgroundColor: `var(--pastille-${teinte})`,
    color: `var(--pastille-${teinte}-texte)`,
  };
}

/** La couleur seule, pour un accent posé sur un fond déjà donné. */
export function pastilleTexte(teinte: Teinte): React.CSSProperties {
  return { color: `var(--pastille-${teinte}-texte)` };
}
