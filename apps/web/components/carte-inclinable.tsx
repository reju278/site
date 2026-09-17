"use client";

import { cn } from "@repo/ui/lib/utils";
import { useCallback, useRef } from "react";

/** L'angle maximal, en degrés, aux quatre coins. Repris de `CarteOffre`. */
const ANGLE = 7;

/**
 * Une carte qui s'incline sous le pointeur, avec un reflet qui le suit.
 *
 * **Le geste existait déjà dans ce dépôt**, sur les cartes d'offres de
 * l'accueil, et Rémy l'a demandé sur les cartes d'entretien en citant celles-là.
 * Il est donc sorti ici plutôt que recopié : la formule des angles, le signe
 * inversé de l'axe X, les deux durées de transition et la pose de la lueur avant
 * son allumage sont des réglages qui ont été trouvés une fois et qui n'ont
 * aucune raison d'exister en deux exemplaires.
 *
 * **Le geste n'existe que là où il veut dire quelque chose** : une souris, et
 * quelqu'un qui n'a pas demandé moins de mouvement. Les deux se lisent au moment
 * du geste et non au montage : un rendu serveur ne connaît ni l'un ni l'autre,
 * et une préférence peut changer sans recharger la page.
 *
 * **La perspective est portée par la scène et non par la carte.** Sur la carte
 * elle-même, le point de fuite suit l'élément qui tourne, et l'inclinaison se
 * lit comme une déformation plutôt que comme une rotation. 900 px est une
 * perspective longue, donc un effet discret : plus court, la carte se déforme
 * comme un objet tenu à dix centimètres de l'œil, spectaculaire une fois et
 * fatigant les suivantes.
 *
 * **Les deux durées vivent dans une variable et non dans deux classes.** La
 * transition doit changer de durée **sans** changer de propriété, sinon le
 * navigateur repart de zéro au lieu de continuer le mouvement en cours, et la
 * carte a un à-coup au moment précis où l'on sort.
 *
 * **La lueur est rognée par une couche à part**, et c'est une nécessité :
 * `overflow: hidden` **aplatit** la scène 3D de l'élément qui le porte. Posé sur
 * la carte, il annulerait tout relief de son contenu. Il ne peut pas non plus
 * disparaître, la lueur débordant du rectangle arrondi.
 */
export function CarteInclinable({
  children,
  className,
  rayon = "rounded-md",
  teinte = "blanc",
}: {
  children: React.ReactNode;
  /** Posé sur la scène, pas sur la carte : la scène occupe la cellule. */
  className?: string;
  /** Le rayon de la couche qui rogne la lueur. Il doit être celui qu'on voit. */
  rayon?: string;
  /**
   * La couleur du reflet.
   *
   * **`blanc` est le choix par défaut et le plus sûr** : un reflet est blanc, et
   * c'est ce que Rémy avait tranché pour les cartes d'offres, où un halo coloré
   * teintait une carte qui avait déjà ses couleurs.
   *
   * **`bleute` existe sur sa demande pour les cartes d'entretien.** Elles sont
   * posées sur `bg-card`, une surface neutre, et il y veut le bleu du site en
   * thème clair. Les deux choix cohabitent donc, et ils ne se contredisent pas :
   * ce qui teinte une carte déjà colorée éclaire une carte qui ne l'est pas.
   */
  teinte?: "blanc" | "bleute";
}) {
  const carte = useRef<HTMLDivElement>(null);

  const gesteAdmis = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const poserLaLueur = (
    el: HTMLDivElement,
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    const cadre = el.getBoundingClientRect();
    el.style.setProperty("--lueur-x", `${e.clientX - cadre.left}px`);
    el.style.setProperty("--lueur-y", `${e.clientY - cadre.top}px`);
    return cadre;
  };

  const suivre = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = carte.current;
    if (!el || !gesteAdmis()) return;

    const cadre = poserLaLueur(el, e);
    /* Deux parts de -0,5 à 0,5, donc zéro au centre. Un repère centré évite
       d'écrire la moitié de la largeur dans les deux formules. */
    const px = (e.clientX - cadre.left) / cadre.width - 0.5;
    const py = (e.clientY - cadre.top) / cadre.height - 0.5;

    /* L'axe X est inversé : pousser la souris vers le bas doit enfoncer le bas
       de la carte, donc la faire tourner vers l'arrière. Sans ce signe, la carte
       se penche à l'envers du geste, et on le sent avant de le voir. */
    el.style.setProperty("--bascule-x", `${-py * 2 * ANGLE}deg`);
    el.style.setProperty("--bascule-y", `${px * 2 * ANGLE}deg`);
  }, []);

  const entrer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = carte.current;
    if (!el || !gesteAdmis()) return;

    /* La lueur est posée à l'endroit du pointeur **avant** d'être allumée :
       sans ça, elle apparaît au centre puis glisse vers la souris, et on voit
       le glissement. */
    poserLaLueur(el, e);
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
    <div
      className={cn("[perspective:900px]", className)}
      onPointerMove={suivre}
      onPointerEnter={entrer}
      onPointerLeave={sortir}
    >
      <div
        ref={carte}
        style={
          {
            "--bascule-x": "0deg",
            "--bascule-y": "0deg",
            "--duree": "600ms",
            transform:
              "rotateX(var(--bascule-x)) rotateY(var(--bascule-y)) translateZ(0)",
            transitionProperty: "transform, box-shadow",
            transitionDuration: "var(--duree)",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          } as React.CSSProperties
        }
        className={cn(
          "group/incline relative h-full",
          "[transform-style:preserve-3d] [will-change:transform]",
          /* Sous le pointeur, la carte suit vite et se soulève : l'ombre grandit
             avec l'angle, sinon l'objet tourne sans jamais quitter la page. */
          "data-[survol]:[--duree:120ms] data-[survol]:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]",
        )}
      >
        {/* La lueur, sur sa propre couche pour ne pas aplatir la scène.

            **Son intensité se règle par thème, et c'est contre l'intuition.**
            Le reflet creuse un écart avec le fond, et cet écart n'est pas le
            même des deux côtés : sur un fond presque noir, un reflet à trente
            pour cent est déjà une lampe, là où sur un fond presque blanc il
            s'efface. Le réglage tient dans une variable et non dans deux
            dégradés écrits côte à côte.

            **Elle est au-dessus du contenu, et c'est une correction.** Posée
            dessous, elle n'éclairait que les marges : le fond de la carte et
            l'affiche sont opaques et la cachaient entièrement, si bien qu'on ne
            voyait le reflet nulle part où il y a quelque chose à regarder.
            Rémy l'a signalé. Au-dessus, elle glisse sur toute la carte,
            l'affiche comprise, ce qui est exactement ce qu'un reflet fait.

            `pointer-events-none` : elle couvre la carte entière, donc sans cela
            elle prendrait le clic qui ouvre la fenêtre. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-10 overflow-hidden",
            rayon,
          )}
        >
          <span
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[survol]/incline:opacity-100",
              teinte === "blanc"
                ? "[--lueur:255_255_255] [--reflet:0.3] dark:[--reflet:0.14]"
                : "[--lueur:96_150_255] [--reflet:0.22] dark:[--lueur:255_255_255] dark:[--reflet:0.14]",
            )}
            style={{
              background:
                "radial-gradient(220px circle at var(--lueur-x, 50%) var(--lueur-y, 50%), rgb(var(--lueur) / var(--reflet)), rgb(var(--lueur) / 0) 70%)",
            }}
          />
        </span>

        {children}
      </div>
    </div>
  );
}
