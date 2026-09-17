"use client";

import { InteractiveGridPattern } from "@repo/ui/components/interactive-grid-pattern";

/**
 * Le quadrillage de cases arrondies posé derrière une section.
 *
 * C'est `InteractiveGridPattern` de MagicUI, demandé par Rémy pour les sections
 * du modèle, des extraits de coaching et des entretiens. Ce fichier existe parce
 * que le composant de registre arrive avec trois choses qu'on ne garde pas, et
 * qu'il vaut mieux les corriger une fois ici que trois fois dans la page.
 *
 * **Ses couleurs sont en dur.** `border-gray-400/30` et `stroke-gray-400/30` ne
 * répondent à aucun thème, et le dépôt l'interdit : le filet passe en
 * `stroke-border`, et le cadre extérieur saute, puisque la section a déjà ses
 * bords.
 *
 * **Ses cases sont carrées.** Rémy les veut arrondies : `rx` est une propriété
 * CSS sur un `rect`, donc elle se pose de l'extérieur sans toucher au fichier de
 * registre. Cinq pixels, comme tout le reste du site.
 *
 * **Son survol peint du gris.** Il passe au bleu du site. La classe de survol
 * est écrite ici plutôt que par-dessus la leur : elles ne visent pas le même
 * état, donc les deux coexistent et c'est la nôtre qui gagne au survol.
 *
 * **Le quadrillage s'efface vers les bords.** Un masque radial l'éteint avant
 * qu'il rencontre le bord de la section : sans lui, il s'arrêterait net et
 * dessinerait un rectangle, c'est-à-dire exactement la couture que ce dépôt
 * traque partout ailleurs.
 *
 * **`preserveAspectRatio` garde les cases carrées.** Le composant dimensionne
 * son SVG en attributs puis le CSS l'étire à la section : sans cette ligne, les
 * cases deviennent des rectangles dès que la section n'a pas les proportions du
 * quadrillage.
 *
 * **Les cases restent les seules choses cliquables de ce calque.** Le conteneur
 * ne prend pas les événements, sinon il couvrirait la section entière et
 * prendrait les clics du texte qui est au-dessus.
 */
export function FondCases() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <InteractiveGridPattern
        width={80}
        height={80}
        squares={[18, 12]}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-auto inset-0 size-full border-0 [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_75%)]"
        squaresClassName="fill-transparent stroke-border [rx:5px] hover:fill-primary/15"
      />
    </div>
  );
}
