/**
 * Le semis de points, en motif CSS plutôt qu'en SVG.
 *
 * **C'est le remplacement mesuré de `DotPattern` de MagicUI**, et le chiffre
 * justifie à lui seul l'écart à la règle qui interdit de refaire à la main ce
 * qu'un registre donne : leur composant **dessine un `<circle>` par point**.
 * Sur la traversée du coaching aux entretiens, haute de quatre mille pixels et
 * large de treize cents, cela faisait **21 252 nœuds** dans un document qui en
 * comptait 23 550. Quatre-vingt-dix pour cent de la page était ce semis.
 *
 * **Ce n'est pas un problème de poids, c'est un problème de lag**, et c'est ce
 * que Rémy décrivait : chaque ouverture de fenêtre ou de menu oblige le
 * navigateur à recalculer style et disposition sur tout le document. Relevé
 * avant : 292 ms pour ouvrir une fenêtre d'entretien, 201 ms pour le menu des
 * tâches. Un geste est perçu comme instantané en dessous de cent.
 *
 * **Le rendu est identique, et la géométrie est celle de leur fichier** : un
 * point de un pixel de rayon tous les seize pixels, décalé de un en x et en y,
 * ce qui est `width=16 height=16 cx=1 cy=1 cr=1` chez eux. Un dégradé radial
 * répété donne exactement ce dessin pour **zéro nœud**.
 *
 * **`currentColor` fait le reste** : la teinte se pose par `text-*` comme sur
 * leur composant, donc elle suit le thème.
 *
 * Leur fichier reste dans `packages/ui` : il convient parfaitement à une
 * surface de la taille d'une carte, ce pour quoi il est écrit.
 */
export function SemisPoints({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}
