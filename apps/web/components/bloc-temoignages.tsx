import { Emplacement } from "@/components/section";
import type { TemoignageEcrit } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";

/**
 * Un bloc de témoignages écrits, en grille de cartes.
 *
 * Il sert deux fois : sous les deux offres, et sous la carte du livre. Un seul
 * composant pour les deux, parce que la forme est la même et que deux copies
 * finissent toujours par diverger.
 *
 * **Tant que la liste est vide, il affiche un emplacement.** C'est la
 * convention du site : une section sans texte dit ce qu'elle attend, au lieu
 * d'afficher une phrase plausible que personne ne penserait à relire. Voir le
 * commentaire de `temoignagesOffres` dans `site.ts` pour ce qui manque et
 * comment le remplir.
 *
 * **La photo est facultative, et c'est délibéré.** Toutes les personnes qui
 * acceptent d'être citées n'acceptent pas d'être montrées, et les deux accords
 * sont distincts. Sans photo, la carte porte l'initiale : la mise en page ne
 * bouge pas, et personne n'est poussé à fournir une image pour que le bloc soit
 * beau.
 */
export function BlocTemoignages({
  temoignages,
  attendu,
  className,
}: {
  temoignages: readonly TemoignageEcrit[];
  /** Ce que la section attend, tant qu'elle n'a rien à montrer. */
  attendu: string;
  className?: string;
}) {
  if (temoignages.length === 0) {
    return <Emplacement attendu={attendu} className={className} />;
  }

  return (
    <ul
      className={cn(
        // `items-stretch` est implicite en grille, mais `h-full` sur la carte
        // ne suffit pas : c'est le `li` qui reçoit la hauteur de la cellule, et
        // la carte doit la lui reprendre. Sans les deux, trois citations de
        // longueurs différentes donnent trois cartes décalées.
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {temoignages.map((temoignage) => (
        <li key={temoignage.nom} className="h-full">
          {/* `figure` et `blockquote` : ce sont des citations attribuées, et le
              balisage le dit. Un lecteur d'écran annonce alors la citation et
              son auteur ensemble, au lieu de lire deux paragraphes voisins. */}
          <figure className="flex h-full flex-col rounded-md border border-border bg-card p-6">
            <blockquote className="text-base leading-relaxed text-pretty text-card-foreground">
              {/* Les guillemets sont français et posés ici, pas dans le texte :
                  ils relèvent de la mise en forme, et les laisser au contenu
                  obligerait à les répéter à chaque saisie, donc à les oublier
                  une fois sur trois. */}
              «&nbsp;{temoignage.texte}&nbsp;»
            </blockquote>

            {/* `mt-auto` pousse l'attribution au bas de la carte : sans lui,
                elle suit sa citation et se retrouve dix pixels plus haut dans
                une carte que dans l'autre. */}
            <figcaption className="mt-auto flex items-center gap-3 pt-6">
              {temoignage.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={temoignage.photo}
                  // `alt=""` assumé : le nom est juste à côté, en toutes
                  // lettres. Le répéter dans l'alternative ferait annoncer la
                  // personne deux fois.
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
                >
                  {temoignage.nom.charAt(0)}
                </span>
              )}

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-card-foreground">
                  {temoignage.nom}
                </span>
                {temoignage.metier ? (
                  <span className="block text-sm text-pretty text-muted-foreground">
                    {temoignage.metier}
                  </span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
