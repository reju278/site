import { pastilleHero } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";

/**
 * Les gélules en verre du hero d'immersion.
 *
 * **Le verre est celui des capsules de l'en-tête**, et il est ici pour la même
 * raison qu'elles : ces gélules flottent sur la photographie, sombre dans les
 * deux thèmes, donc le blanc translucide y est chez lui et un jeton de thème
 * n'aurait rien à suivre. C'est la première exception du projet à « le flou va
 * derrière, jamais devant », déjà écrite dans `AGENTS.md`.
 *
 * Les valeurs sont reprises de la pastille de preuve de l'accueil, au
 * caractère près : `border-white/10`, `bg-white/6`, `backdrop-blur-md`,
 * `rounded-full`. Elles ne sont pas approchées.
 *
 * **`rounded-full` est légitime ici** : la règle des 5 px parle d'angles
 * arrondis, et une gélule n'a pas d'angle. C'est la forme relevée chez
 * TrendTrack, `main_hero__label`, et l'accueil la porte déjà.
 */

/* Le verre, écrit une fois pour les deux gélules. Repris de la pastille de
   preuve de l'accueil. */
const VERRE =
  "flex items-center rounded-full border border-white/10 bg-white/6 backdrop-blur-md";

/**
 * La pastille de preuve : les portraits, puis la phrase.
 *
 * **Le texte et le chiffre sont ceux de Rémy**, lus dans `pastilleHero` et non
 * réécrits : « Plus de 1 000 entrepreneurs accompagnés » est une allégation
 * commerciale, elle a été dictée par lui, et c'est la seule façon dont un
 * chiffre entre sur ce site. La reprendre ici plutôt que d'en écrire une
 * variante est ce qui garantit qu'il n'en existe pas deux versions.
 *
 * Les portraits sont `aria-hidden` et la phrase se lit seule : quatre images
 * sans nom n'apportent rien à l'oreille, et les annoncer une par une
 * découperait la phrase en morceaux.
 */
export function PastillePreuve() {
  return (
    <div className="flex justify-center">
      <div className={cn(VERRE, "gap-2.5 py-1.5 pr-4 pl-1.5")}>
        <span aria-hidden className="flex">
          {pastilleHero.portraits.map((portrait, i) => (
            /* Le rond est le conteneur, l'image est dedans et **agrandie**.
               Les affiches portent les bandes noires de l'enregistrement, treize
               pour cent de la hauteur en haut comme en bas : un `object-cover`
               dans un carré cale la hauteur de l'image sur celle du cadre, donc
               les bandes tomberaient pile dans le rond. Un facteur de 1,5 ne
               laisse voir que les deux tiers du milieu.

               Le cadrage est relevé image par image : ce sont des appels à
               deux, et le client n'est pas toujours du même côté. */
            <span
              key={portrait.fichier}
              className={cn(
                "block size-7 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15",
                /* Le chevauchement se fait par une marge négative et non par un
                   décalage : une marge retire de la place, donc la file se
                   resserre vraiment au lieu de laisser un trou à la fin. */
                i > 0 && "-ml-2.5",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/temoignages/${portrait.fichier}.jpg`}
                alt=""
                width={1280}
                height={720}
                /* Dans le hero, donc visible d'emblée : pas de `lazy`. */
                fetchPriority="high"
                className="size-full scale-150 object-cover"
                style={{ objectPosition: portrait.cadrage }}
              />
            </span>
          ))}
        </span>

        <span className="text-xs font-medium text-white sm:text-sm">
          {pastilleHero.texte}
        </span>
      </div>
    </div>
  );
}

/**
 * Les trois arguments, en gélules à point vert.
 *
 * **Le point est vert, et le vert est celui du site.** `--icone-resultats`, la
 * teinte de la courbe qui monte, définie pour les deux thèmes dans
 * `globals.css`. Ce n'est pas une couleur de plus dans la palette : c'est celle
 * qui signifie déjà « ça marche » ailleurs sur le site.
 *
 * **L'animation est une onde qui s'échappe du point**, pas un clignotement. Un
 * point qui clignote demande qu'on le regarde ; un point qui pulse dit qu'il est
 * vivant et se laisse oublier. Le disque du dessous grandit et s'efface, le
 * point reste net : c'est ce qui fait qu'on lit le libellé et non l'animation.
 *
 * **Les trois ondes sont décalées.** Trois points qui pulsent ensemble battent
 * comme un avertissement ; décalés d'un tiers de cycle, ils respirent.
 *
 * `prefers-reduced-motion` est traité globalement dans `globals.css`, qui
 * neutralise les animations : quelqu'un qui demande moins de mouvement obtient
 * trois points verts fixes, ce qui est exactement ce qu'il faut, le point
 * n'ayant jamais porté d'information à lui seul.
 */
export function PilulesArguments({ points }: { points: readonly string[] }) {
  return (
    /* `flex-wrap` et non `nowrap` : trois gélules en une ligne tiennent en
       large et débordent à 375 px, et un débordement horizontal du document est
       exactement ce que la règle du dépôt interdit. */
    <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {points.map((point, i) => (
        <li key={point} className={cn(VERRE, "gap-2 py-1.5 pr-4 pl-3")}>
          <span aria-hidden className="relative flex size-2 shrink-0">
            {/* L'onde : un disque qui grandit et s'efface sous le point.
                `animate-ping` est l'animation de Tailwind, donc déjà
                neutralisée par la règle de mouvement réduit du projet. */}
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
              style={{
                backgroundColor: "var(--icone-resultats)",
                /* Le décalage d'un tiers de cycle. `animate-ping` dure une
                   seconde chez Tailwind. */
                animationDelay: `${i * 0.33}s`,
              }}
            />
            {/* Le point net, par-dessus l'onde. */}
            <span
              className="relative inline-flex size-full rounded-full"
              style={{ backgroundColor: "var(--icone-resultats)" }}
            />
          </span>

          <span className="text-xs font-medium text-white sm:text-sm">
            {point}
          </span>
        </li>
      ))}
    </ul>
  );
}
