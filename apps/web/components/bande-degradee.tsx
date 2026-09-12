import { cn } from "@repo/ui/lib/utils";

/**
 * Une bande pleine largeur en dégradé, qui interrompt le fil de la page.
 *
 * Les deux jonctions ne font pas la même chose, et c'est voulu.
 *
 * **En haut, une lèvre.** La page descend sur la bande, ses deux angles bas
 * arrondis au rayon des jonctions. C'est le geste du hero, retourné : là-bas la
 * page montait sur l'image, ici elle descend sur la couleur.
 *
 * **En bas, la texture se fond.** Elle a une couche à elle, derrière le
 * contenu, et son dernier dixième passe à la transparence : c'est le fond de
 * page qui apparaît dessous, donc il n'y a plus deux couleurs à faire
 * coïncider.
 *
 * Trois versions ont précédé celle-là, et chacune laissait un trait. Un voile
 * posé par-dessus, qui rattrapait l'écart de force et se voyait comme une
 * brume. Puis la progression finissant sur `--background` : le trait est resté,
 * parce que le grain s'arrêtait net au bord. Puis le grain masqué : le trait
 * est resté encore, parce que la dernière ligne d'un dégradé et l'aplat de la
 * page ne tombent pas au même endroit de l'arrondi des couleurs.
 *
 * La leçon vaut au-delà de cette bande : **tant qu'un raccord demande à deux
 * couleurs de coïncider, il finira par se voir.** Le faire disparaître demande
 * qu'il n'y ait plus qu'une seule couleur, donc un masque et non un calcul.
 *
 * Une seconde lèvre arrondie en bas aurait enfermé la bande dans un cadre, et
 * le regard s'y serait arrêté au lieu de continuer vers la suite.
 *
 * Le fond n'est **pas** un dégradé linéaire mais un dégradé en réseau, cinq
 * foyers de couleur qui se recouvrent, plus un grain. Les deux classes vivent
 * dans `globals.css` : la texture y tient en trente lignes et une URI de
 * données, qui n'ont rien à faire dans du JSX.
 *
 * Le texte y est blanc, comme sur le hero : la bande reste sombre dans les deux
 * thèmes, donc un jeton sémantique n'aurait rien à suivre. Les cinq foyers sont
 * choisis pour que le blanc y tienne 4,5:1, voir `globals.css`.
 */
export function BandeDegradee({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate text-white", className)}>
      {/* La texture, sur sa propre couche, derrière le contenu.

          Elle était posée sur l'élément qui porte aussi le texte. C'était
          l'origine du trait : la progression finit bien sur `--background`, mais
          la dernière ligne de pixels d'un dégradé et l'aplat de la page ne
          tombent pas au même endroit de l'arrondi des couleurs, et ce cheveu
          d'écart se voit sur toute la largeur de l'écran.

          Séparée, la couche se **fond** au lieu de finir sur une couleur : son
          dernier dixième passe à la transparence, et c'est le fond de page lui
          même qui apparaît dessous. Il n'y a donc plus deux couleurs à faire
          coïncider, il n'y en a plus qu'une. C'est le seul raccord dont on
          puisse dire qu'il est juste par construction et non par réglage.

          C'est aussi pourquoi le masque ne pouvait pas être posé avant : sur
          l'élément d'origine, il aurait fait disparaître le texte avec la
          texture. */}
      <div
        aria-hidden
        className="texture-bande grain-bande absolute inset-0 -z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 90%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      />

      {/* La lèvre du haut. Elle doit être plus haute que son rayon, sinon les
          deux angles se rejoignent et l'arrondi se coupe au milieu. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 rounded-b-[var(--rayon-jonction)] bg-background"
      />

      {/* Le contenu.

          Le rembourrage haut vaut le double de la lèvre, et pas un peu plus :
          la lèvre fait 80 px, donc `pt-40` laisse 80 px de dégagement sous
          elle.

          Le rembourrage bas garde le texte **hors de la zone claire** de la
          texture, où le blanc ne tient plus ses seuils. Le réduire, c'est
          laisser descendre du texte sur du lavande. */}
      <div className="relative pt-40 pb-40 sm:pt-48">{children}</div>
    </div>
  );
}
