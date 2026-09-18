"use client";

import { LightRays } from "@repo/ui/components/light-rays";
import { useEffect, useRef, useState } from "react";

/**
 * Les rayons de lumière du fond bleu de la section du modèle.
 *
 * C'est `LightRays` de MagicUI, demandé par Rémy sur le fond des résultats. Ce
 * fichier n'existe que pour deux raisons, et elles ne tiennent pas dans une
 * propriété :
 *
 * **Le mouvement réduit.** Les rayons sont animés par Motion, donc en
 * JavaScript : la règle de `globals.css` qui ramène les durées à 0,01 ms n'a
 * aucune prise dessus. Et leur classe de départ est `opacity-0`, donc un rayon
 * non animé est un rayon invisible : il n'y a rien à figer, seulement à ne pas
 * rendre. C'est le même choix que pour le canevas de `ParticulesHero`, et la
 * quatrième fois que ce piège se présente dans ce dépôt.
 *
 * **Le raccord avec le fond qu'ils éclairent.** `FondResultats` s'éteint par le
 * bas sur son dernier tiers ; des rayons qui s'arrêteraient net y dessineraient
 * la ligne que ce fondu existe justement pour supprimer. Ils portent donc le
 * même masque, écrit aux deux syntaxes comme lui, Safari n'ayant levé son
 * préfixe qu'en 15.4.
 *
 * `data-rayons` est lu par `globals.css`, qui leur retire le mélange
 * « screen » en thème clair : voir le commentaire là-bas.
 */
export function RayonsFond() {
  const [anime, setAnime] = useState(false);
  const [visible, setVisible] = useState(false);
  const ancre = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const appliquer = () => setAnime(!preference.matches);

    appliquer();
    preference.addEventListener("change", appliquer);
    return () => preference.removeEventListener("change", appliquer);
  }, []);

  /* **Les rayons ne sont montés que lorsque la section est en vue.**

     Cinq rayons animés par Motion tournent à chaque image, et ils coûtent : la
     section du modèle mesurait 110 images par seconde contre 120 partout
     ailleurs. Hors de l'écran, c'était dix images par seconde payées pour rien.

     On les démonte plutôt que de les mettre en pause : ils entrent en fondu
     depuis `opacity-0`, donc un retour se voit comme une arrivée et non comme
     un sursaut. La marge d'avance les fait revenir avant qu'on les atteigne.

     L'ancre est un bloc vide de la taille du fond, puisque c'est le fond qu'on
     veut observer et qu'il n'existe pas tant qu'on ne le rend pas. */
  useEffect(() => {
    const el = ancre.current;
    if (!el) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) setVisible(e.isIntersecting);
      },
      { rootMargin: "250px" },
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  if (!anime) return <div ref={ancre} aria-hidden className="absolute inset-0 -z-10" />;

  if (!visible)
    return <div ref={ancre} aria-hidden className="absolute inset-0 -z-10" />;

  return (
    <>
    <div ref={ancre} aria-hidden className="absolute inset-0 -z-10" />
    <LightRays
      data-rayons
      /* La teinte vient de la famille des halos du fond, donc elle change avec
         le thème comme eux. Un bleu en dur aurait été trop pâle sur la page
         claire et trop terne sur la sombre. */
      color="var(--halo-rayons)"
      count={5}
      blur={44}
      speed={18}
      length="80%"
      className="-z-10"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 50%, transparent 92%)",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 50%, transparent 92%)",
      }}
    />
    </>
  );
}
