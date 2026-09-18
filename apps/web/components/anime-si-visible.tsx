"use client";

import { useEffect, useRef } from "react";

/**
 * Met en pause les animations de son contenu tant qu'il est hors de l'écran.
 *
 * Sur demande de Rémy, qui a demandé de « masquer les animations quand elles ne
 * sont pas à l'écran, puis de les lancer quand elles y arrivent ».
 *
 * **Il ne met rien en pause lui-même** : il pose un attribut, et c'est une règle
 * de `globals.css` qui suspend les animations. Le partage est volontaire : une
 * règle CSS attrape **toutes** les animations du sous-arbre, y compris celles
 * des fichiers de registre qu'on ne retouche pas, là où une prop devrait être
 * passée à chacun.
 *
 * **L'attribut est retiré et non ajouté à l'entrée.** Le rendu du serveur ne
 * porte rien : une page servie sans JavaScript garde donc ses animations, ce qui
 * est le bon repli. C'est seulement quand le navigateur constate que le bloc est
 * sorti qu'il le marque.
 *
 * **La marge est généreuse, deux cents pixels** : une animation reprend avant
 * d'être visible, jamais sous les yeux de quelqu'un.
 *
 * **Ce composant ne sert qu'aux animations sans fin.** Une apparition qui se
 * joue une fois n'a rien à gagner à être suspendue, et `Apparition` attend déjà
 * d'entrer dans la vue pour se déclencher.
 */
export function AnimeSiVisible({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const bloc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bloc.current;
    if (!el) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          el.toggleAttribute("data-hors-ecran", !e.isIntersecting);
        }
      },
      { rootMargin: "200px" },
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  return (
    <div ref={bloc} className={className}>
      {children}
    </div>
  );
}
