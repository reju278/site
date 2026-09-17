"use client";

import { LightRays } from "@repo/ui/components/light-rays";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const appliquer = () => setAnime(!preference.matches);

    appliquer();
    preference.addEventListener("change", appliquer);
    return () => preference.removeEventListener("change", appliquer);
  }, []);

  if (!anime) return null;

  return (
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
  );
}
