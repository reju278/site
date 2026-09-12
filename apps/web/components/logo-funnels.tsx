import { cn } from "@repo/ui/lib/utils";

/**
 * La marque de Funnels Club, et sa déclinaison pour le consulting.
 *
 * **Rien n'est dessiné ici, tout est repris de `labo/logo-funnels.html`**, le
 * banc d'essai du dépôt : le tracé de la lettre, le dégradé de la tuile, celui
 * de la lettre, son ombre portée et le rayon de 22 %.
 *
 * Ce qui n'est **pas** repris, et à dessein : l'inclinaison au survol, l'anneau
 * lumineux qui suit la souris et la tache de lumière. Le commit « Retirer le
 * logo du hero » les a écartés parce qu'ils ne convainquent pas à petite
 * taille, et c'est précisément la taille dont il s'agit ici.
 *
 * La tuile reste sombre dans les deux thèmes, comme dans le banc d'essai :
 * c'est une marque, pas une surface du site, et une marque ne change pas de
 * couleur avec le fond.
 *
 * **La lettre est une propriété depuis que le consulting a la sienne.** Sur
 * décision de Rémy, la carte du consulting porte la même tuile avec un C à la
 * place du F. Le commentaire de `page.tsx` disait jusqu'ici l'inverse, qu'une
 * tuile sur le consulting fabriquerait une identité qui n'existe pas : c'est
 * précisément ce que cette déclinaison assume, les deux offres étant de la même
 * maison et se lisant mieux comme une paire.
 *
 * `aria-hidden` : le nom est écrit juste à côté, le faire annoncer par la
 * marque le répéterait.
 */

/* Les deux lettres, dans le même repère de 1000 et à la même graisse.
 *
 * Le C n'est pas un dessin neuf : il occupe le même rectangle que le F, de 231
 * à 779 en abscisse et de 240 à 760 en ordonnée, et ses traits ont l'épaisseur
 * de ses barres, 164. C'est ce qui fait qu'on lit une déclinaison et non deux
 * logos voisins.
 *
 * **Ses trois traits font la même épaisseur, et c'est une correction.** Une
 * première version lui donnait le montant du F, 193, et ses barres, 164 : un
 * F porte cette différence sans qu'on la voie, parce que sa médiane la rattrape
 * au milieu, alors qu'un C n'a que trois traits et les montre tous les trois.
 * Rémy l'a vu tout de suite, la lettre n'était pas uniforme. À 164 partout, le
 * creux fait 192, un peu plus que le trait : c'est ce qui l'empêche de se
 * refermer en anneau.
 *
 * Le tracé se lit comme un contour continu : on part du coin haut gauche, on
 * suit le bord extérieur puis le bord intérieur, et `Z` referme. */
const LETTRES = {
  F: "M231 240 H779 V404 H424 V458 H731 V629 H424 V760 H231 Z",
  C: "M231 240 H779 V404 H395 V596 H779 V760 H231 Z",
} as const;

export function LogoFunnels({
  lettre = "F",
  className,
}: {
  /** `F` pour Funnels Club, `C` pour le consulting. */
  lettre?: keyof typeof LETTRES;
  className?: string;
}) {
  /* Un identifiant par lettre : les deux marques se croisent dans la même
     page, et deux `<linearGradient>` portant le même `id` sont un document
     invalide dont seul le premier compte. Ici les deux dégradés sont
     identiques, donc rien ne se verrait ; c'est exactement le genre de panne
     qui attend le jour où ils divergeront. */
  const degrade = `logo-funnels-lumiere-${lettre.toLowerCase()}`;

  return (
    <span
      aria-hidden
      className={cn("relative grid shrink-0 place-items-center", className)}
      style={{
        // `--rayon: 22%` et le dégradé de la tuile, repris du banc d'essai.
        //
        // L'ombre portée du banc n'est **pas** reprise, sur décision de Rémy.
        // Elle y sert à décoller un logo de 260 px posé seul au milieu d'une
        // page ; à 29 px dans une ligne de titre, elle ne décolle rien et
        // salit le bord.
        borderRadius: "22%",
        background: "linear-gradient(180deg, #17171a 0%, #08080a 100%)",
      }}
    >
      {/* 100 % de la tuile, comme dans le banc d'essai. Ce n'est pas la
          lettre qui fait 100 % : le tracé va de 231 à 779 dans un repère de
          1000, donc il porte sa propre marge et occupe 55 % de la tuile. La
          rapetisser en plus l'aurait noyée. */}
      <svg viewBox="0 0 1000 1000" className="size-full">
        <defs>
          <linearGradient id={degrade} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f2f2f4" />
            <stop offset="100%" stopColor="#c9c9d2" />
          </linearGradient>
        </defs>
        <path d={LETTRES[lettre]} fill={`url(#${degrade})`} />
      </svg>
    </span>
  );
}
