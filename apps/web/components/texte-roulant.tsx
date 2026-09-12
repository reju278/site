import { cn } from "@repo/ui/lib/utils";

/**
 * Un libellé qui roule au survol : il monte, et sa copie arrive par le bas.
 *
 * C'est l'effet des liens de navigation de la référence fournie par Rémy. Toute
 * la mécanique est dans `globals.css`, sur l'utilitaire `texte-roule` : le
 * composant ne fait qu'écrire le libellé aux deux endroits où il doit l'être,
 * dans le `span` et dans `data-texte`, ce qui garantit qu'ils ne divergent pas.
 *
 * **La copie est un pseudo-élément et non un second `span`.** `aria-hidden` ne
 * retire un nœud que de l'arbre d'accessibilité ; il reste dans le texte de
 * l'élément, et le texte du lien devenait « Funnels ClubFunnels Club », c'est-à
 * dire exactement ce qu'un robot lit pour décrire la page d'arrivée. Voir le
 * commentaire de `globals.css`.
 *
 * **Le parent doit porter `group/roule`.** C'est ce qui fait déclencher le
 * survol du lien entier, bordure et rembourrage compris, et non le seul survol
 * des lettres.
 */
export function TexteRoulant({
  children,
  className,
}: {
  /** Du texte, et rien d'autre : il est recopié tel quel dans `data-texte`. */
  children: string;
  className?: string;
}) {
  return (
    <span data-texte={children} className={cn("texte-roule", className)}>
      <span>{children}</span>
    </span>
  );
}

/**
 * La même chose pour un signe qui n'est pas du texte, une icône de réseau.
 *
 * Elle ne peut pas passer par `data-texte` : `attr()` ne sait recopier qu'une
 * chaîne. Le nœud est donc dupliqué pour de bon, ce qui est sans conséquence
 * ici : une icône n'a pas de contenu textuel, donc rien ne se retrouve en
 * double dans ce que lit un robot, et la copie est `aria-hidden` pour l'arbre
 * d'accessibilité.
 */
export function SigneRoulant({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span className="signe-roule-haut block">{children}</span>
      <span
        aria-hidden
        className="signe-roule-bas absolute inset-0 flex items-center justify-center"
      >
        {children}
      </span>
    </span>
  );
}
