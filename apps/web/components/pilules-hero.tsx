import { pastilleHero } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";
import { Sparkles } from "lucide-react";

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
export function PilulesArguments({
  points,
}: {
  points: readonly { texte: string; etincelles?: boolean }[];
}) {
  return (
    /* `flex-wrap` et non `nowrap` : quatre gélules en une ligne tiennent en
       large et débordent à 375 px, et un débordement horizontal du document est
       exactement ce que la règle du dépôt interdit. */
    <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {points.map((point, i) => {
        /* La teinte de la gélule : le vert qui dit « ça marche » partout, le
           violet qui dit « IA » sur celle-là. Elle sert au point, à l'étoile
           **et** à la lumière qui tourne sur le bord, donc les trois ne peuvent
           pas se désaccorder. */
        const teinte = point.etincelles
          ? "var(--etincelle)"
          : "var(--icone-resultats)";

        return (
          <li
            key={point.texte}
            style={
              { "--teinte": teinte, "--grossissement": "1.04" } as React.CSSProperties
            }
            /* **La gélule n'a plus son fond : il est passé sur le voile
               intérieur.** C'est ce qui laisse voir un cheveu de la lumière qui
               tourne derrière, tout autour du bord. Posé ici, le fond l'aurait
               entièrement couverte.

               `z-0` et `overflow-hidden` : la lumière est un disque bien plus
               grand que la gélule, il faut un contexte d'empilement pour la
               ranger dessous et un rognage pour n'en montrer que le tour. */
            /* `grossit-au-survol` : la règle est dans `globals.css`, partagée
               avec les cartes d'avis qui suivent, et déjà gardée contre le
               mouvement réduit. Quatre pour cent ici : sur une gélule de cent
               quarante pixels, cela fait six pixels, moins que l'espacement de
               la rangée. */
            className="group/pilule grossit-au-survol relative z-0 flex items-center gap-2 overflow-hidden rounded-full border border-white/10 py-1.5 pr-4 pl-3"
          >
            {
              /* **La lumière qui tourne**, reprise de `ShimmerButton` du
                 registre MagicUI, sur demande de Rémy. La recette est la leur :
                 un dégradé conique qui tourne sur lui-même à l'intérieur d'une
                 boîte qui glisse d'un bord à l'autre. Les deux animations et
                 leurs images-clés existent déjà dans `packages/ui`, puisque le
                 bouton scintillant du site les utilise.

                 Ce n'est pas le composant lui-même : c'est un `button`, et une
                 gélule ne se clique pas. Poser un bouton là aurait annoncé une
                 action qui n'existe pas.

                 **Trois secondes et un flou de deux pixels** : le tour de
                 gélule fait quatre cents pixels, une lumière nette et rapide y
                 serait un gyrophare. Rémy l'a demandée discrète.

                 **Elle n'est pas rendue sous mouvement réduit.** Elle est en
                 CSS, donc la règle globale la neutraliserait ; mais neutralisée,
                 il resterait un quart de dégradé conique figé en travers de la
                 gélule. On la retire donc, comme les étincelles. */
              <span
                aria-hidden
                style={{ "--speed": "3s" } as React.CSSProperties}
                /* **L'anneau porte le même verre que la gélule, et c'est ce
                   qui bouche le creux.**

                   La lumière passe dans un anneau d'un pixel laissé entre le
                   filet et le verre : c'est ce qui la rend visible tout autour
                   du bord. Mais cet anneau était transparent, donc les trois
                   secondes où la lumière est ailleurs, on voyait la
                   photographie au travers et ça se lisait comme une rainure
                   sombre. C'est le défaut que Rémy a signalé.

                   **Il n'y a plus d'anneau du tout**, et c'est la seule
                   réparation qui tienne. Le remplir du même blanc ne suffisait
                   pas : il lui manquait le flou d'arrière-plan du voile, et un
                   blanc à six pour cent posé sur une photographie nette n'a pas
                   la couleur du même blanc posé sur la même photographie
                   floutée. Un pixel suffit à voir la différence, contrairement
                   à ce que j'avais écrit ici.

                   Le voile couvre donc toute la gélule, d'un seul tenant, et la
                   lumière passe **derrière lui**. Le verre étant très
                   translucide, elle le traverse et fait le tour du bord comme
                   avant ; ce qui disparaît, c'est la couture qu'il y avait
                   entre trois traitements différents sur trois pixels.

                   **Ce qui a été essayé et jeté : rogner la lumière au filet
                   par un masque**, à la façon de `BorderBeam`. Le masque était
                   juste, mais `@container-[size]` pose `contain: paint`, qui
                   empêche l'enfant de peindre dans la bande de bordure : le
                   masque ne gardait que cette bande, l'enfant ne pouvait pas y
                   aller, et l'effet disparaissait entièrement. Mesuré, pas
                   supposé. */
                className="lumiere-tournante pointer-events-none absolute inset-0 -z-30 overflow-visible blur-[2px] @container-[size]"
              >
                <span className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh]">
                  <span className="animate-spin-around absolute -inset-full [background:conic-gradient(from_calc(270deg-45deg),transparent_0,var(--teinte)_90deg,transparent_90deg)]" />
                </span>
              </span>
            }

            {
              /* **La ligne nette, posée sur le filet lui-même.**

                 Le calque du dessus ne donne que le reflet diffus qui traverse
                 le verre ; Rémy veut aussi voir passer la ligne. Celle-ci est
                 donc **au-dessus** du verre, et un masque la rogne sur la seule
                 bande d'un pixel du bord.

                 **Le masque est la recette éprouvée, pas celle du registre.**
                 Deux couches opaques, l'une rognée sur la boîte de contenu et
                 l'autre sur la boîte entière, soustraites l'une de l'autre : il
                 ne reste que l'anneau du rembourrage. La variante de
                 `BorderBeam`, avec une première couche transparente et une
                 intersection, ne donne rien du tout ici.

                 **Et le conteneur de mesure est un enfant, pas ce calque-ci.**
                 `@container-[size]` pose `contain: paint`, qui interdit de
                 peindre hors de sa propre boîte. Posé sur l'élément masqué, il
                 empêchait la lumière d'atteindre la bande que le masque garde,
                 et l'effet disparaissait entièrement, sans rien signaler.
                 Mesuré. Il est donc à l'intérieur, sur une boîte qui couvre
                 l'anneau.

                 `-inset-px` : l'anneau se pose sur le filet de la gélule et non
                 un pixel en dedans, sinon on lirait deux lignes. */
              <span
                aria-hidden
                style={{ "--speed": "3s" } as React.CSSProperties}
                className="lumiere-tournante pointer-events-none absolute -inset-px rounded-full p-px [mask-clip:content-box,border-box] [mask-composite:exclude] [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [-webkit-mask-composite:xor]"
              >
                <span className="absolute inset-0 overflow-hidden rounded-full @container-[size]">
                  <span className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh]">
                    <span className="animate-spin-around absolute -inset-full [background:conic-gradient(from_calc(270deg-45deg),transparent_0,var(--teinte)_90deg,transparent_90deg)]" />
                  </span>
                </span>
              </span>
            }

            {/* Le verre, d'un seul tenant sur toute la gélule. Il était
                rentré d'un pixel pour découvrir la lumière ; c'est ce pixel qui
                faisait la rainure. */}
            <span
              aria-hidden
              className="absolute inset-0 -z-20 rounded-full bg-white/6 backdrop-blur-md"
            />

            {point.etincelles ? (
              /* **Une étoile à la place du point**, sur demande de Rémy, et
                 seulement sur celle-ci : le point vert dit « ça marche »,
                 l'étoile dit autre chose.

                 `aria-hidden` : elle ne porte rien à elle seule, exactement
                 comme le point vert des trois autres. */
              <Sparkles
                aria-hidden
                className="size-3.5 shrink-0"
                style={{ color: "var(--teinte)" }}
              />
            ) : (
              <span aria-hidden className="relative flex size-2 shrink-0">
                {/* L'onde : un disque qui grandit et s'efface sous le point.
                    `animate-ping` est l'animation de Tailwind, donc déjà
                    neutralisée par la règle de mouvement réduit du projet. */}
                <span
                  className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
                  style={{
                    backgroundColor: "var(--teinte)",
                    /* Le décalage d'un tiers de cycle. `animate-ping` dure une
                       seconde chez Tailwind. */
                    animationDelay: `${i * 0.33}s`,
                  }}
                />
                {/* Le point net, par-dessus l'onde. */}
                <span
                  className="relative inline-flex size-full rounded-full"
                  style={{ backgroundColor: "var(--teinte)" }}
                />
              </span>
            )}

            <span className="text-xs font-medium text-white sm:text-sm">
              {point.texte}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
