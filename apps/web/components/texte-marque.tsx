import { insecables } from "@/lib/typographie";
import { Fragment } from "react";

/**
 * Rend un texte qui porte les marques de la page Notion de Rémy : `<b>`,
 * `<i>`, et trois surlignages, `<mb>` bleu, `<mj>` jaune, `<my>` jaune
 * souligné. Voir `contenu/niveaux-business.ts`.
 *
 * **Un analyseur et non `dangerouslySetInnerHTML`** : le texte ne peut
 * produire que ces cinq éléments, quoi qu'il contienne. Une balise inconnue
 * reste du texte, visible, ce qui se remarque à la relecture au lieu de
 * disparaître.
 *
 * Les surlignages prennent les jetons du tunnel Genesis : le bleu pâle du
 * sous-titre de l'optin, le jaune de son étiquette.
 */
const BALISES = ["b", "i", "mb", "mj", "my"] as const;
type Balise = (typeof BALISES)[number];

const CLASSES: Record<Balise, string> = {
  b: "font-bold",
  i: "italic",
  mb: "bg-[var(--genesis-surligne)] box-decoration-clone",
  mj: "bg-[var(--genesis-jaune)] box-decoration-clone",
  my: "bg-[var(--genesis-jaune)] box-decoration-clone border-b-2 border-[#e4cf8f]",
};

type Noeud = string | { balise: Balise; enfants: Noeud[] };

function analyser(texte: string): Noeud[] {
  const racine: Noeud[] = [];
  const pile: { balise: Balise | null; enfants: Noeud[] }[] = [
    { balise: null, enfants: racine },
  ];
  for (const morceau of texte.split(/(<\/?(?:b|i|mb|mj|my)>)/)) {
    if (!morceau) continue;
    const m = /^<(\/?)(b|i|mb|mj|my)>$/.exec(morceau);
    const sommet = pile[pile.length - 1]!;
    if (!m) {
      sommet.enfants.push(morceau);
    } else if (!m[1]) {
      const noeud = { balise: m[2] as Balise, enfants: [] as Noeud[] };
      sommet.enfants.push(noeud);
      pile.push(noeud);
    } else if (pile.length > 1 && sommet.balise === m[2]) {
      pile.pop();
    } else {
      sommet.enfants.push(morceau);
    }
  }
  return racine;
}

function rendre(noeuds: Noeud[]): React.ReactNode {
  return noeuds.map((n, i) =>
    typeof n === "string" ? (
      <Fragment key={i}>{insecables(n)}</Fragment>
    ) : n.balise === "b" ? (
      <strong key={i}>{rendre(n.enfants)}</strong>
    ) : n.balise === "i" ? (
      <em key={i}>{rendre(n.enfants)}</em>
    ) : (
      <mark key={i} className={`text-inherit ${CLASSES[n.balise]}`}>
        {rendre(n.enfants)}
      </mark>
    ),
  );
}

export function TexteMarque({ texte }: { texte: string }) {
  return <>{rendre(analyser(texte))}</>;
}

/** Le texte nu, sans ses marques : pour un `title` ou un `aria-label`. */
export const texteNu = (texte: string) => texte.replace(/<[^>]+>/g, "");
