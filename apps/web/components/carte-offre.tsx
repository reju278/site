"use client";

import { TexteRoulant } from "@/components/texte-roulant";
import { cn } from "@repo/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";

/**
 * Une carte d'offre du pied de page, qui s'incline sous la souris.
 *
 * Il y en a trois, empilées dans la dernière colonne : Funnels Club, le
 * consulting et le livre. Elles partagent tout, le fond, le relief et la
 * réponse au geste ; **seule la teinte de leurs halos change**, bleue pour le
 * site, dorée pour le consulting, rouge pour le livre, sur décision de Rémy.
 * Une carte par couleur aurait donné trois fichiers qui divergent au premier
 * réglage.
 *
 * **Le fond est celui du deck**, `fond-resultats` et `grain-resultats`, la même
 * couche que les en-têtes de pages et le pied de page lui-même. Ce n'est pas
 * une redite : posée **dans** le pied de page, qui porte déjà ce fond en très
 * dilué, la carte en reprend la version pleine, halos compris. C'est ce qui la
 * détache sans lui donner une couleur à elle.
 *
 * **L'inclinaison est en CSS, pas en JavaScript animé.** Le pointeur écrit deux
 * variables sur l'élément, `--bascule-x` et `--bascule-y`, et c'est une
 * transition qui fait le reste. Rien ne se recalcule à chaque image, rien ne
 * re-rend React : on écrit deux nombres sur un style, le compositeur fait le
 * travail. Une boucle d'animation pour suivre une souris est une dépense
 * permanente pour un effet qui ne dure que le survol.
 *
 * **L'aller et le retour n'ont pas la même durée, et c'est tout l'effet.** Sous
 * le pointeur, la transition est courte, 120 ms : plus longue, la carte traîne
 * derrière la souris et donne l'impression de coller. À la sortie, elle passe à
 * 600 ms avec une courbe qui décélère : la carte se repose au lieu de retomber.
 * C'est la même idée que le départ, où elle s'incline depuis le plat en 600 ms
 * plutôt que de sauter à l'angle du pointeur. Une seule durée pour les deux ne
 * peut pas être bonne : ce qui suit un geste doit être immédiat, ce qui le
 * conclut doit être lent.
 *
 * **Le contenu est en avant du fond**, `translateZ`, et c'est ce qui fait le
 * relief. Une carte qui pivote sans profondeur intérieure est une image qu'on
 * tourne ; avec un demi-centimètre entre le texte et son fond, c'est un objet.
 *
 * **Rien de tout cela sur un téléphone, ni sous mouvement réduit.** Il n'y a
 * pas de survol au doigt : la carte y reste à plat, et elle est dessinée pour
 * être belle à plat d'abord. `globals.css` neutralise déjà les transitions sous
 * `prefers-reduced-motion`, mais ça ne suffirait pas ici : sans transition, les
 * variables sauteraient d'un angle à l'autre, ce qui est pire que de ne pas
 * bouger. Le geste est donc coupé à la source.
 */

/** L'angle maximal, en degrés, à chaque bord de la carte. */
const ANGLE = 7;

/**
 * Les trois teintes de halo, une par carte.
 *
 * Le fond est le même pour les trois, `fond-resultats` ; seuls ses trois foyers
 * changent, et ils changent en **redéfinissant les variables que l'utilitaire
 * lit**. C'est ce qui évite trois utilitaires presque identiques dans
 * `globals.css`, et ce qui fait qu'une correction du fond vaut pour les trois.
 *
 * Les valeurs vivent là-bas, avec leurs deux versions de thème : une teinte à
 * dix pour cent ne se voit pas sur un fond presque noir.
 */
const TEINTES = {
  bleu: {},
  or: {
    "--halo-a": "var(--halo-or-a)",
    "--halo-b": "var(--halo-or-b)",
    "--halo-c": "var(--halo-or-c)",
  },
  rouge: {
    "--halo-a": "var(--halo-rouge-a)",
    "--halo-b": "var(--halo-rouge-b)",
    "--halo-c": "var(--halo-rouge-c)",
  },
} as const;

/**
 * Le fond du bouton, une couleur par teinte.
 *
 * Il est écrit à part et non dans `TEINTES` parce que ce n'est pas la même
 * chose : les halos sont un fond dilué à quelques pour cent, le bouton est un
 * aplat qui porte du texte. Le premier ne se mesure pas, le second doit tenir
 * ses 4,5:1 sous son libellé, et c'est pour ça que les trois valeurs ne sont pas
 * les teintes des halos mais leurs versions sombres.
 */
const FONDS_BOUTON = {
  bleu: "var(--primary)",
  or: "var(--or)",
  rouge: "var(--livre)",
} as const;

/**
 * L'encre du bouton, et elle ne suit pas le thème.
 *
 * Deux des trois fonds sont sombres et portent du blanc ; l'or est clair et
 * porte une encre sombre. Ce qui décide n'est pas la couleur mais l'écart : un
 * blanc sur l'or ne tiendrait que 2,3:1, une encre sombre y tient 7,5:1.
 */
const ENCRES_BOUTON = {
  bleu: "#ffffff",
  or: "var(--or-encre)",
  rouge: "#ffffff",
} as const;

export function CarteOffre({
  teinte = "bleu",
  marque,
  nom,
  texte,
  href,
  action,
  className,
}: {
  /** Le jeu de halos du fond. Voir `TEINTES`. */
  teinte?: keyof typeof TEINTES;
  /** Ce qui tient la place du logo, à gauche du nom. */
  marque: React.ReactNode;
  nom: string;
  /** La phrase sous le nom, mot pour mot. Voir `site.ts`. */
  texte: string;
  href: string;
  /** Le libellé du bouton. */
  action: string;
  className?: string;
}) {
  const carte = useRef<HTMLDivElement>(null);

  /* Le geste n'existe que là où il veut dire quelque chose : une souris, et
     quelqu'un qui n'a pas demandé moins de mouvement. Les deux se lisent au
     moment du geste et non au montage : un rendu serveur ne connaît ni l'un ni
     l'autre, et une préférence peut changer sans recharger la page. */
  const gesteAdmis = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const suivre = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = carte.current;
    if (!el || !gesteAdmis()) return;

    const cadre = el.getBoundingClientRect();
    /* Deux parts de -0,5 à 0,5, donc zéro au centre. Un repère centré évite
       d'écrire la moitié de la largeur dans les deux formules qui suivent. */
    const px = (e.clientX - cadre.left) / cadre.width - 0.5;
    const py = (e.clientY - cadre.top) / cadre.height - 0.5;

    /* L'axe X est inversé : pousser la souris vers le bas doit enfoncer le bas
       de la carte, donc la faire tourner vers l'arrière. Sans ce signe, la
       carte se penche à l'envers du geste, et on le sent avant de le voir. */
    el.style.setProperty("--bascule-x", `${-py * 2 * ANGLE}deg`);
    el.style.setProperty("--bascule-y", `${px * 2 * ANGLE}deg`);
    el.style.setProperty("--lueur-x", `${e.clientX - cadre.left}px`);
    el.style.setProperty("--lueur-y", `${e.clientY - cadre.top}px`);
  }, []);

  const entrer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = carte.current;
    if (!el || !gesteAdmis()) return;

    /* La lueur est posée à l'endroit du pointeur **avant** d'être allumée :
       sans ça, elle apparaît au centre puis glisse vers la souris, et on voit
       le glissement. */
    const cadre = el.getBoundingClientRect();
    el.style.setProperty("--lueur-x", `${e.clientX - cadre.left}px`);
    el.style.setProperty("--lueur-y", `${e.clientY - cadre.top}px`);
    el.dataset.survol = "";
  }, []);

  const sortir = useCallback(() => {
    const el = carte.current;
    if (!el) return;

    delete el.dataset.survol;
    el.style.setProperty("--bascule-x", "0deg");
    el.style.setProperty("--bascule-y", "0deg");
  }, []);

  return (
    /* La scène.

       La perspective est portée par le parent et non par la carte : sur la
       carte elle-même, le point de fuite suit l'élément qui tourne, et
       l'inclinaison se lit comme une déformation plutôt que comme une rotation.

       900 px est une perspective longue, donc un effet discret. Plus court, la
       carte se déforme comme un objet tenu à dix centimètres de l'œil, ce qui
       est spectaculaire une fois et fatigant les suivantes. */
    <div
      className={cn("[perspective:900px]", className)}
      onPointerMove={suivre}
      onPointerEnter={entrer}
      onPointerLeave={sortir}
    >
      <div
        ref={carte}
        /* Les durées vivent dans deux variables plutôt que dans deux classes :
           la transition doit changer de durée **sans** changer de propriété,
           sinon le navigateur repart de zéro au lieu de continuer le mouvement
           en cours, et la carte a un à-coup au moment précis où l'on sort. */
        style={{
          "--bascule-x": "0deg",
          "--bascule-y": "0deg",
          "--duree": "600ms",
          transform:
            "rotateX(var(--bascule-x)) rotateY(var(--bascule-y)) translateZ(0)",
          transitionProperty: "transform, box-shadow",
          transitionDuration: "var(--duree)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        } as React.CSSProperties}
        className={cn(
          "group relative flex h-full flex-col rounded-md p-5",
          "[transform-style:preserve-3d] [will-change:transform]",
          // Sous le pointeur, la carte suit vite et se soulève : l'ombre
          // grandit avec l'angle, sinon l'objet tourne sans jamais quitter la
          // page.
          "data-[survol]:[--duree:120ms] data-[survol]:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]",
        )}
      >
        {/* Le fond, sur sa propre couche, et c'est une nécessité et non un
            rangement.

            `overflow: hidden` **aplatit** la scène 3D de l'élément qui le
            porte : posé sur la carte, il annulerait le `translateZ` du contenu,
            donc tout le relief. Il ne peut pas non plus disparaître, puisque le
            grain et la lueur débordent du rectangle arrondi. La seule place qui
            reste est une couche à part, qui rogne ce qu'elle contient sans rien
            dire à la carte qui la porte.

            La bordure et le rayon viennent avec le fond, pour la même raison :
            ce qui est rogné doit être rogné par la forme qu'on voit. */}
        <span
          aria-hidden
          style={TEINTES[teinte] as React.CSSProperties}
          className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-md border border-border"
        >
          {/* La lueur : un reflet clair, et rien qu'une clarté.

              **Elle était en `--primary` et c'était une erreur**, corrigée sur
              décision de Rémy. Un halo bleu sous la souris teinte la carte : le
              fond a déjà ses couleurs, les trois halos du deck, et le pointeur
              n'a pas à en ajouter une. Ce qu'on veut de lui, c'est qu'il
              éclaire, pas qu'il colore.

              Le blanc est donc écrit en toutes lettres, et c'est l'un des rares
              endroits où une couleur en dur est juste : ce n'est pas une
              couleur de thème mais un reflet, et un reflet est blanc dans les
              deux thèmes, comme le disque de lecture du site. Le jeton qui
              porterait ça n'existe pas, parce qu'il n'aurait rien à dire de
              différent en clair et en sombre.

              **Il en faut deux fois moins en sombre qu'en clair**, et c'est
              contre l'intuition. Le reflet est le même blanc dans les deux, mais
              l'écart qu'il creuse avec le fond n'est pas le même : sur un fond
              presque noir, un blanc à trente pour cent est déjà une lampe, là où
              sur un fond presque blanc il s'efface. L'intensité est donc réglée
              par thème, dans une variable plutôt que dans deux dégradés écrits
              côte à côte : il n'y a qu'un nombre qui change, et c'est le seul
              endroit où il se règle. Deux valeurs relevées à l'œil de Rémy, la
              première version, unique et à cinquante pour cent, étant trop
              violente en sombre. */}
          <span
            className="absolute inset-0 opacity-0 transition-opacity duration-300 [--reflet:0.3] group-data-[survol]:opacity-100 dark:[--reflet:0.14]"
            style={{
              background:
                "radial-gradient(220px circle at var(--lueur-x, 50%) var(--lueur-y, 50%), rgb(255 255 255 / var(--reflet)), rgb(255 255 255 / 0) 70%)",
            }}
          />
        </span>

        {/* Le contenu, décollé du fond.

            `translateZ` demande `transform-style: preserve-3d` sur le parent,
            qui l'a. C'est ce demi-centimètre qui fait la différence entre une
            image qu'on incline et un objet : le texte et le fond ne se
            déplacent pas de la même quantité quand la carte tourne, et c'est
            exactement ce que l'œil lit comme de la profondeur. */}
        <div className="relative flex h-full flex-col [transform:translateZ(28px)]">
          {/* `text-xl` et non `text-2xl` : les trois cartes sont empilées dans
              une colonne étroite, et deux des trois noms, « Consulting privé »
              et « Digital Selfmade », passaient à la ligne au milieu. Un nom
              d'offre coupé en deux se lit comme deux offres.

              **Ce titre n'est pas un conteneur `flex`, et c'est la réparation
              d'un défaut d'alignement.** Il l'était, et la tuile portait un
              `vertical-align` qui n'avait aucun effet : dans un conteneur
              `flex`, `vertical-align` est simplement ignoré, et l'alignement
              retombait sur `align-items`, qui cale sur le haut de la ligne et
              non sur la hauteur de capitale. La tuile flottait donc d'un ou deux
              pixels au-dessus des lettres.

              En ligne, `vertical-align` reprend son travail : la marque se cale
              sur la ligne de base du nom, exactement comme sur les cartes
              d'offres de l'accueil. L'écart passe par un `mr` en `em` porté par
              la marque elle-même, et non par un `gap`, qui n'existe que dans une
              grille ou un `flex`. Voir la règle dans `AGENTS.md`. */}
          <p className="titre text-xl text-foreground">
            {marque}
            {nom}
          </p>

          <p className="mt-1.5 text-sm leading-snug text-pretty text-muted-foreground">
            {texte}
          </p>

          {/* `mt-auto` pousse le bouton en bas de la carte : c'est la règle des
              actions alignées du projet, et ici elle a une seconde raison,
              c'est ce qui fait que la carte se remplit de haut en bas au lieu
              de laisser un vide sous son texte. */}
          <div className="mt-auto pt-5">
            {/* Le fond du bouton est passé en style et non en classe : les
                trois couleurs viennent de variables, et une classe Tailwind
                composée à la volée ne serait pas générée. Le blanc du texte est
                écrit en dur et c'est juste : les trois fonds sont des aplats
                sombres qui portent leur propre contraste, et un jeton de thème
                y basculerait en encre sombre sur fond sombre.

                L'assombrissement au survol passe par un voile plutôt que par une
                seconde couleur : trois teintes donneraient trois valeurs de
                survol à tenir d'accord. */}
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: FONDS_BOUTON[teinte],
                color: ENCRES_BOUTON[teinte],
              }}
              className="group/roule relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-md px-5 text-sm font-semibold transition-colors before:absolute before:inset-0 before:bg-black/0 before:transition-colors hover:before:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="relative">
                <TexteRoulant>{action}</TexteRoulant>
              </span>
              <ArrowRight aria-hidden className="relative size-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
