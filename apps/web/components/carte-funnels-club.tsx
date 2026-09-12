"use client";

import { LogoFunnels } from "@/components/logo-funnels";
import { TexteRoulant } from "@/components/texte-roulant";
import { cn } from "@repo/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";

/**
 * La carte Funnels Club du pied de page, qui s'incline sous la souris.
 *
 * Elle occupe la dernière colonne du pied de page, de haut en bas, et porte ce
 * que cette colonne portait déjà : la marque, la promesse et le bouton. Ce qui
 * change, c'est qu'elle est devenue un objet : un fond, un relief, et une
 * réponse au geste. Demandé par Rémy.
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

export function CarteFunnelsClub({
  promesse,
  href,
  action,
  className,
}: {
  /** La promesse de Funnels Club, mot pour mot. Voir `site.ts`. */
  promesse: string;
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
      className={cn("h-full [perspective:900px]", className)}
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
          "group relative flex h-full flex-col rounded-md p-6 sm:p-7",
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
          <p className="titre flex items-center text-2xl text-foreground">
            <LogoFunnels className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]" />
            Funnels Club
          </p>

          <p className="mt-2 text-sm text-pretty text-muted-foreground">
            {promesse}
          </p>

          {/* `mt-auto` pousse le bouton en bas de la carte : c'est la règle des
              actions alignées du projet, et ici elle a une seconde raison,
              c'est ce qui fait que la carte se remplit de haut en bas au lieu
              de laisser un vide sous son texte. */}
          <div className="mt-auto pt-6">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group/roule inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <TexteRoulant>{action}</TexteRoulant>
              <ArrowRight aria-hidden className="size-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
