"use client";

import { Particles } from "@repo/ui/components/particles";
import { useEffect, useState } from "react";

/**
 * Les particules du hero.
 *
 * Le composant de MagicUI anime un canvas en `requestAnimationFrame`. La règle
 * `prefers-reduced-motion` de `globals.css` neutralise les transitions et les
 * animations CSS, mais elle n'a aucune prise sur une boucle JavaScript : il
 * faut donc décider ici de ne rien rendre du tout. C'est bien ce que demande la
 * préférence, et non un mouvement plus lent.
 *
 * Le rendu est aussi retardé au montage. Les particules sont décoratives, elles
 * n'ont aucune raison de disputer le premier rendu au titre et à la vidéo, qui
 * sont ce qu'on vient lire.
 */
export function ParticulesHero() {
  const [anime, setAnime] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const appliquer = () => setAnime(!preference.matches);

    appliquer();
    preference.addEventListener("change", appliquer);
    return () => preference.removeEventListener("change", appliquer);
  }, []);

  if (!anime) return null;

  return (
    <Particles
      // L'opacité globale plutôt que la couleur : le composant tire une
      // transparence au hasard par particule, et la fixer supprimerait le
      // fourmillement qui fait tout l'intérêt de l'effet.
      className="absolute inset-0 opacity-50"
      // Sur un fond photographique déjà chargé, une centaine de points fait du
      // bruit. Le geste doit se deviner, pas se remarquer : trente-huit points
      // de quatre dixièmes de pixel, à cinquante pour cent d'opacité.
      quantity={38}
      // Plus haut que le défaut : les points suivent la souris de plus loin et
      // plus mollement, ce qui donne une dérive plutôt qu'un essaim qui colle
      // au curseur.
      staticity={70}
      ease={60}
      size={0.4}
      // Une lente montée, comme des braises. À zéro, les points ne bougent que
      // sous la souris, et la zone paraît morte pour qui n'a pas de souris.
      vy={-0.06}
      color="#ffffff"
    />
  );
}
