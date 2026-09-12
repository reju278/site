"use client";

import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Un bloc qui monte et se révèle quand il entre dans la vue.
 *
 * Demandé par Rémy pour la lettre : les paragraphes apparaissent au fil du
 * défilement plutôt que d'être tous là d'emblée. C'est le pendant, pour du
 * texte courant, de ce que `TitreRoulant` fait pour les titres, et il vaut
 * mieux deux composants qu'un seul qui ferait les deux : un titre se découpe
 * mot à mot et part de plus bas, un paragraphe se lève d'un bloc et de peu.
 *
 * **Le mouvement est court, dix pixels.** Un paragraphe qui monte de trente
 * pixels attire l'œil vers lui et fait perdre la ligne qu'on était en train de
 * lire ; à dix, on ne voit pas le déplacement, on voit seulement que le texte
 * arrive.
 *
 * **Chaque bloc décale son départ sur le précédent**, `delai`, mais de très
 * peu : c'est ce qui fait une lecture qui se déroule plutôt que six blocs qui
 * clignotent ensemble. Le décalage est borné, sinon le dernier paragraphe d'une
 * longue liste attendrait une seconde entière après être entré dans la vue.
 *
 * **Il ne se rejoue jamais.** Le guetteur se débranche au premier passage : un
 * texte qui se re-révèle sous les yeux de quelqu'un qui remonte le relire est
 * une distraction, et sur une lettre de quinze paragraphes, une nuisance.
 *
 * **Sans JavaScript, tout est visible.** C'est le vrai risque de ce genre
 * d'effet, et il a déjà coûté un titre au projet : le bloc part à `opacity: 0`,
 * et si rien ne vient jamais poser `data-vu`, le texte n'existe plus, ni pour un
 * lecteur ni pour un robot qui rend la page. `layout.tsx` porte donc, dans un
 * `<noscript>`, la contre-règle qui annule l'état de départ. Elle est là-bas et
 * pas ici : React sérialise le contenu d'un `noscript` comme du texte, et la
 * feuille de style se retrouverait dans le texte du paragraphe.
 *
 * Le mouvement réduit est traité par `globals.css`, qui neutralise les
 * transitions : les blocs se posent alors sans monter, ce qui est bien ce qu'on
 * demande quand on demande que rien ne bouge.
 */
export function Apparition({
  children,
  delai = 0,
  className,
}: {
  children: React.ReactNode;
  /** Décalage du départ, en millisecondes. */
  delai?: number;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;

    /* Pas d'`IntersectionObserver` : on montre, et c'est tout. Un texte qui
       resterait caché parce qu'une API manque serait un texte perdu. */
    if (typeof IntersectionObserver === "undefined") {
      setVu(true);
      return;
    }

    const guetteur = new IntersectionObserver(
      (entrees) => {
        if (!entrees[0]?.isIntersecting) return;
        setVu(true);
        guetteur.disconnect();
      },
      /* Le seuil est bas et la marge basse négative : un paragraphe se déclenche
         quand son haut est franchement entré, pas quand son dernier pixel
         affleure. Sur un bloc plus haut que l'écran, un seuil en pourcentage ne
         serait jamais atteint, d'où le `0.01` plutôt qu'une fraction du bloc. */
      { threshold: 0.01, rootMargin: "0px 0px -12% 0px" },
    );

    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, []);

  return (
    <div
      ref={cadre}
      data-apparition
      data-vu={vu ? "" : undefined}
      style={{ transitionDelay: `${delai}ms` }}
      className={cn(
        "translate-y-[10px] opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "data-[vu]:translate-y-0 data-[vu]:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
