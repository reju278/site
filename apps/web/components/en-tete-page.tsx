import { cn } from "@repo/ui/lib/utils";

/**
 * L'en-tête d'une page intérieure, sur le fond des résultats.
 *
 * C'est exactement le fond de la section « De vraies personnes. De vrais
 * résultats. » : le même fond très clair bleuté, les mêmes trois halos, le même
 * grain, et le même fondu par le bas. Tout vit dans `globals.css`, sur
 * `fond-resultats` et `grain-resultats` ; ce composant ne fait que le poser et
 * le fondre.
 *
 * **Deux différences avec l'accueil, et toutes deux sont forcées par la
 * position du bloc.**
 *
 * Pas de courbe : elle appartient aux témoignages, où elle passe derrière une
 * vidéo. Derrière un titre de page, elle n'illustrerait rien.
 *
 * Pas de lèvre non plus. Sur l'accueil, la lèvre est la page qui **descend** sur
 * la section, avec ses angles bas arrondis ; ici le bloc est la première chose
 * de la page, il n'y a rien au-dessus pour descendre dessus. Un bandeau de la
 * couleur de page posé tout en haut ne serait pas une jonction, ce serait une
 * bande beige inexpliquée sous l'en-tête flottant.
 *
 * Le fondu du bas, lui, est identique : il commence à la moitié et ne laisse
 * rien à la fin, donc le contenu de la page démarre sur la couleur de page sans
 * qu'aucune arête ne dise où le fond s'est arrêté. C'est la leçon de la bande
 * qu'il remplace : un masque retire des pixels, là où deux couleurs qu'on tente
 * de faire coïncider finissent toujours par laisser un trait.
 */
export function EnTetePage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-entete-page className={cn("relative isolate", className)}>
      <div
        aria-hidden
        className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10"
        style={{
          // Les deux écritures s'écrivent : Safari n'a levé son préfixe qu'en
          // 15.4.
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 50%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 50%, transparent 100%)",
        }}
      />

      {/* Le rembourrage haut dégage l'en-tête flottant, qui est fixe et
          recouvrirait le titre sans lui. C'est la même valeur que celle que les
          pages portaient avant, reprise telle quelle pour ne rien déplacer.

          **Le rembourrage bas a été rentré, et il vaut pour toutes les pages
          intérieures**, sur décision de Rémy : l'écart entre le sous-titre et
          le contenu était trop grand. Il était de `pb-16 sm:pb-20`.

          Il ne fait que la moitié du travail. L'autre moitié est le haut de la
          `Section` qui suit, et les deux s'additionnaient sans se connaître :
          144 px sur téléphone, 192 en large. La règle qui les réunit est écrite
          **une seule fois**, dans `globals.css`, sur `[data-entete-page] +
          section` : c'est ce qui la rend vraie sur le blog, le podcast et les
          résultats sans que personne ait à y penser en créant la page suivante.
          C'est aussi pourquoi ce bloc porte `data-entete-page`. */}
      <section className="px-5 pt-32 pb-10 sm:pt-40 sm:pb-12">
        <div className="mx-auto max-w-6xl text-center">{children}</div>
      </section>
    </div>
  );
}
