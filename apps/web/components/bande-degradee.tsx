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
 * **En bas, rien.** Il y avait un voile en dégradé posé par-dessus la bande :
 * il devait rattraper de force l'écart entre le lavande où finissait la
 * texture et le beige de la page, et ça se voyait comme une brume. C'est la
 * texture elle-même qui finit maintenant sur `--background`, donc la jonction
 * n'a plus rien à rattraper. Voir `globals.css`.
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
    <div
      className={cn(
        "texture-bande grain-bande relative isolate text-white",
        className,
      )}
    >
      {/* La lèvre du haut. Elle doit être plus haute que son rayon, sinon les
          deux angles se rejoignent et l'arrondi se coupe au milieu. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 rounded-b-[var(--rayon-jonction)] bg-background"
      />

      {/* Le contenu. Le rembourrage haut dégage la lèvre, le bas dégage le
          fondu : sans eux, le texte passerait dessous. */}
      {/* Le contenu.

          Le rembourrage haut vaut le double de la lèvre, et pas un peu plus :
          la lèvre fait 80 px, donc `pt-40` laisse 80 px de dégagement sous
          elle. Il était à `pt-24`, ce qui n'en laissait que 16 et collait le
          titre au bloc blanc.

          Le rembourrage bas est plus important qu'il n'en a l'air : c'est lui
          qui garde le texte **hors de la zone claire** de la texture, où le
          blanc ne tient plus ses seuils. Le réduire, c'est laisser descendre du
          texte sur du lavande. */}
      <div className="relative pt-40 pb-40 sm:pt-48">{children}</div>
    </div>
  );
}
