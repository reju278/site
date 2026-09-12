import { cn } from "@repo/ui/lib/utils";

/**
 * Le fond des résultats et du livre, repris du deck publicitaire Funnels Club.
 *
 * Il remplace la bande bleue en dégradé, sur décision de Rémy. Ce qu'il porte,
 * les trois halos et le grain, vit dans `globals.css` : trente lignes et une
 * URI de données n'ont rien à faire dans du JSX.
 *
 * **Il couvre les deux sections d'un seul tenant**, les résultats et le livre,
 * parce que c'est la seule façon d'avoir une transition et non une frontière :
 * le fond s'éteint progressivement **derrière** la carte du livre, et il n'y a
 * donc aucun endroit où l'on puisse dire qu'il s'arrête.
 *
 * **Le fond est sur une couche à part, et elle se fond par le bas.** C'est la
 * leçon de la bande qu'il remplace : tant qu'un raccord demande à deux couleurs
 * de coïncider, il finit par se voir, quel que soit le soin mis à les calculer.
 * Un masque, lui, retire des pixels : il n'y a plus qu'une seule couleur, celle
 * de la page, et plus rien à faire coïncider. Voir `AGENTS.md`.
 *
 * En haut, au contraire, la coupure est assumée et nette. Ce n'est pas une
 * incohérence : un raccord ne se voit que lorsqu'il essaie de se cacher. Celui
 * du haut ne s'en cache pas, il se dessine.
 *
 * La couche est aussi ce qui permet de flouter : `backdrop-filter`, dans la
 * courbe, ne floute que ce qui est **déjà peint dessous**. Le fond doit donc
 * être derrière le contenu et non porté par lui.
 */
export function FondResultats({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate", className)}>
      {/* Le fond.

          **Les deux bouts ne font pas la même chose, et c'est voulu.**

          En haut, une coupure nette, et c'est **la page qui descend sur la
          section**, pas l'inverse : la lèvre est un bandeau de la couleur de
          page posé sur le haut du bloc, ses deux angles **bas** arrondis. Le
          sens compte, et Rémy l'a tranché : arrondir le haut du bloc coloré
          donnerait un objet posé sur la page, alors qu'on veut que la page
          vienne mordre dedans.

          Le rayon est `--rayon-jonction` et non 5 px : la jonction fait toute
          la largeur de l'écran, et c'est exactement le cas que l'exception
          d'échelle du projet décrit. Le bandeau doit être plus haut que son
          rayon, sinon les deux angles se rejoignent et l'arrondi se coupe au
          milieu ; `h-20` tient les 2,5 rem de `sm` avec de la marge.

          Le filet en `--border` n'est pas décoratif. L'ancienne bande était
          bleu nuit sur du beige : la coupure se lisait toute seule. Ce fond-ci
          est à un cheveu de la couleur de page, `#fbfcff` contre `#fcfbf8`, et
          sans filet l'arrondi ne se verrait tout simplement pas. Le filet est
          ce qui rend la coupure lisible, donc ce qui la rend nette.

          En bas, l'inverse : aucune arête, un fondu qui commence à la moitié et
          ne laisse rien à 92 %. C'est lui la transition avec le fond de page
          derrière la carte du livre. Le masque emporte le filet des côtés en
          même temps que le fond, donc les bords ne finissent pas en pointe.

          Les deux écritures du masque s'écrivent : Safari n'a levé son préfixe
          qu'en 15.4. */}
      <div
        aria-hidden
        className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10 border-x border-border"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 50%, transparent 92%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 50%, transparent 92%)",
        }}
      />

      {/* La lèvre : la page qui descend sur la section.

          Elle est posée par-dessus le fond, pas dessous, donc elle en masque
          le haut et c'est son arrondi qu'on voit. `border-b` suit sa courbe, y
          compris dans les deux angles : c'est ce trait qui rend l'arrondi
          lisible entre deux couleurs presque identiques. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 rounded-b-[var(--rayon-jonction)] border-b border-border bg-background"
      />

      {children}
    </div>
  );
}
