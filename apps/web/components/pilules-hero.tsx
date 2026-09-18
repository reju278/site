import { AnimeSiVisible } from "@/components/anime-si-visible";
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
 * Une gélule : le filet, le verre, la lumière qui en fait le tour, la pastille
 * et le libellé.
 *
 * **Elle existe parce que le même objet sert à deux endroits**, les quatre
 * arguments du hero et l'étiquette « Extrait de formation » de la section du
 * modèle. Rémy a été explicite : « exactement le même design, tu m'inventes
 * rien ». Une seconde écriture aurait divergé à la première correction, et il y
 * en a eu six sur cet objet en une seule séance.
 *
 * **Ce qui change d'un endroit à l'autre passe en propriété, et rien d'autre.**
 * La teinte, la pastille, le libellé, la balise. Les cotes, la typographie,
 * l'espacement, le verre et la lumière sont écrits ici une fois.
 *
 * **`sur` dit ce qu'il y a dessous, et c'est la seule adaptation.** Le hero pose
 * ses gélules sur une photographie sombre dans les deux thèmes : elles y portent
 * le blanc en dur de passionfroot, filet, verre et encre. L'étiquette du modèle
 * est posée sur la bande bleutée, **claire en thème clair** : le même blanc y
 * serait du blanc sur blanc, c'est-à-dire illisible. Elle prend donc les jetons
 * de thème, aux mêmes opacités et au même dessin. Rien d'autre ne bouge.
 */
export function Gelule({
  as = "li",
  teinte,
  sur = "image",
  pastille,
  children,
  className,
  ...reste
}: {
  /**
   * `button` sert au bouton « Fermer » de la fenêtre des entretiens, sur demande
   * de Rémy, qui veut exactement cette gélule. Les propriétés en trop sont
   * passées telles quelles, faute de quoi `DialogClose asChild` ne pourrait pas
   * y poser son gestionnaire de fermeture.
   */
  as?: "li" | "p" | "button";
  /** La couleur du point, de l'étoile et de la lumière. Une seule valeur. */
  teinte: string;
  /** Ce sur quoi la gélule est posée, qui décide de son encre. */
  /**
   * Ce sur quoi la gélule est posée, qui décide de son fond et de son encre.
   *
   * - `image` : la photographie du hero, sombre dans les deux thèmes. Blanc en
   *   dur, comme les capsules de l'en-tête.
   * - `page` : une surface de thème. Jetons de thème, fond presque transparent.
   * - `voile` : **le voile d'une fenêtre ouverte.** Il est sombre dans les deux
   *   thèmes, mais l'encre, elle, suit le thème : une gélule `page` y devenait
   *   de l'encre sombre sur du sombre en thème clair, et on ne lisait plus rien.
   *   Elle prend donc le verre du bouton de fermeture d'origine, `bg-card/85` et
   *   son flou, c'est-à-dire une vraie surface sous le texte.
   */
  sur?: "image" | "page" | "voile";
  /** Le point, l'étoile, ce qui précède le libellé. */
  pastille: React.ReactNode;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"button">) {
  /* `ElementType` et non l'union des trois balises : TypeScript refuserait de
     poser sur un `li` des attributs de `button`, alors que c'est justement le
     but, chaque appelant ne passant que ce qui va à sa balise. */
  const Balise = as as React.ElementType;

  return (
    <Balise
      {...reste}
      style={
        { "--teinte": teinte, "--grossissement": "1.04" } as React.CSSProperties
      }
      /* **Le fond n'est pas ici : il est sur le voile intérieur.** C'est ce qui
         laisse passer la lumière, qui est derrière lui.

         `z-0` et `overflow-hidden` : la lumière est un disque bien plus grand
         que la gélule, il faut un contexte d'empilement pour la ranger dessous
         et un rognage pour n'en montrer que le tour. */
      className={cn(
        "grossit-au-survol relative z-0 inline-flex items-center gap-2 overflow-hidden rounded-full border py-1.5 pr-4 pl-3",
        sur === "image" ? "border-white/10" : "border-border",
        className,
      )}
    >
      {
        /* **La lumière qui tourne**, reprise de `ShimmerButton` du registre
           MagicUI, sur demande de Rémy. La recette est la leur : un dégradé
           conique qui tourne sur lui-même dans une boîte qui glisse d'un bord à
           l'autre. Les deux animations et leurs images-clés sont déjà dans
           `packages/ui`, le bouton scintillant du site s'en sert.

           Ce n'est pas le composant lui-même : c'est un `button`, et une gélule
           ne se clique pas.

           **Trois secondes et un flou de deux pixels** : le tour d'une gélule
           fait quatre cents pixels, une lumière nette et rapide y serait un
           gyrophare. Rémy l'a demandée discrète.

           `lumiere-tournante` la retire sous mouvement réduit : neutralisée par
           la règle globale, elle laisserait un quart de dégradé conique figé en
           travers de la gélule. Voir `globals.css`. */
        <span
          aria-hidden
          style={{ "--speed": "3s" } as React.CSSProperties}
          className="lumiere-tournante pointer-events-none absolute inset-0 -z-30 overflow-visible blur-[2px] @container-[size]"
        >
          <span className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh]">
            <span className="animate-spin-around absolute -inset-full [background:conic-gradient(from_calc(270deg-45deg),transparent_0,var(--teinte)_90deg,transparent_90deg)]" />
          </span>
        </span>
      }

      {
        /* **La ligne nette, posée sur le filet lui-même.**

           Le calque du dessus ne donne que le reflet diffus qui traverse le
           verre ; celle-ci est **au-dessus** du verre, et un masque la rogne sur
           la seule bande d'un pixel du bord.

           **Le masque est la recette éprouvée, pas celle du registre.** Deux
           couches opaques, l'une rognée sur la boîte de contenu et l'autre sur
           la boîte entière, soustraites : il ne reste que l'anneau du
           rembourrage. La variante de `BorderBeam`, avec une première couche
           transparente et une intersection, ne donne rien du tout ici.

           **Et le conteneur de mesure est un enfant, pas ce calque-ci.**
           `@container-[size]` pose `contain: paint`, qui interdit de peindre
           hors de sa propre boîte : posé sur l'élément masqué, il empêchait la
           lumière d'atteindre la bande que le masque garde, et l'effet
           disparaissait entièrement, sans rien signaler. Mesuré.

           `-inset-px` : l'anneau se pose sur le filet et non un pixel en dedans,
           sinon on lirait deux lignes. */
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

      {/* Le verre, d'un seul tenant. Il était rentré d'un pixel pour découvrir
          la lumière ; ce pixel se lisait comme une rainure sombre les trois
          secondes où elle était ailleurs. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-20 rounded-full backdrop-blur-md",
          sur === "image" && "bg-white/6",
          sur === "page" && "bg-foreground/5",
          /* Une vraie surface sous le texte : le voile d'une fenêtre est sombre
             dans les deux thèmes, et une gélule presque transparente y laissait
             l'encre claire du thème clair se perdre. C'est le verre du bouton de
             fermeture d'origine, repris tel quel. */
          sur === "voile" && "bg-card/85",
        )}
      />

      {pastille}

      <span
        className={cn(
          "text-xs font-medium sm:text-sm",
          sur === "image" ? "text-white" : "text-foreground",
          sur === "voile" && "font-semibold",
        )}
      >
        {children}
      </span>
    </Balise>
  );
}

/**
 * Le point vert et son onde, la pastille des gélules qui ne portent pas
 * d'étoile.
 *
 * L'onde est un disque qui grandit et s'efface sous le point, pas un
 * clignotement : un point qui clignote demande qu'on le regarde, un point qui
 * pulse dit qu'il est vivant et se laisse oublier.
 *
 * `animate-ping` est l'animation de Tailwind, donc déjà neutralisée par la règle
 * de mouvement réduit du projet, et le point reste alors net et fixe, ce qui est
 * exactement ce qu'il faut : il n'a jamais porté d'information à lui seul.
 */
export function PointGelule({ decalage = 0 }: { decalage?: number }) {
  return (
    <span aria-hidden className="relative flex size-2 shrink-0">
      <span
        className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
        style={{
          backgroundColor: "var(--teinte)",
          /* Le décalage d'un tiers de cycle. `animate-ping` dure une seconde
             chez Tailwind. Trois points qui pulsent ensemble battent comme un
             avertissement ; décalés, ils respirent. */
          animationDelay: `${decalage * 0.33}s`,
        }}
      />
      <span
        className="relative inline-flex size-full rounded-full"
        style={{ backgroundColor: "var(--teinte)" }}
      />
    </span>
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
    /* Les quatre gélules portent chacune deux dégradés coniques qui tournent
       sans fin : hors de l'écran, ils tournent pour personne. */
    <AnimeSiVisible>
      {/* `flex-wrap` et non `nowrap` : quatre gélules en une ligne tiennent en
          large et débordent à 375 px, et un débordement horizontal du document
          est exactement ce que la règle du dépôt interdit. */}
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
          <li key={point.texte}>
            <Gelule
              as="p"
              teinte={teinte}
              pastille={
                point.etincelles ? (
                  /* **Une étoile à la place du point**, sur demande de Rémy, et
                     seulement sur celle-ci : le point vert dit « ça marche »,
                     l'étoile dit autre chose. */
                  <Sparkles
                    aria-hidden
                    className="size-3.5 shrink-0"
                    style={{ color: "var(--teinte)" }}
                  />
                ) : (
                  <PointGelule decalage={i} />
                )
              }
            >
              {point.texte}
            </Gelule>
          </li>
        );
      })}
    </ul>
    </AnimeSiVisible>
  );
}
