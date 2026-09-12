"use client";

import { cn } from "@repo/ui/lib/utils";
import { Fragment, useEffect, useRef, useState } from "react";

/**
 * Un titre dont les mots montent de dessous quand il entre dans la vue.
 *
 * C'est l'effet des titres du deck publicitaire Funnels Club, repris sur
 * demande de Rémy. Le principe est exactement le sien : **chaque mot reçoit son
 * propre masque**, un bloc en `overflow: hidden` dans lequel le mot part à
 * `translateY(112%)` et remonte à zéro.
 *
 * Le mot à mot n'est pas un raffinement, c'est ce qui fait que ça marche sur
 * plusieurs lignes. Un titre masqué d'un seul bloc voit sa dernière ligne
 * monter depuis trois hauteurs de ligne plus bas : le mouvement est long,
 * désordonné, et les lignes se croisent. Masqué mot par mot, chaque mot ne
 * franchit que sa propre hauteur, et toutes les lignes arrivent ensemble.
 *
 * **Le masque descend plus bas que la lettre**, `padding-bottom` compensé par
 * une marge négative : sans ça, les jambages des `p`, `g` et `j` sont écrêtés
 * par l'arête du masque. C'est le réglage du deck, repris tel quel.
 *
 * **Aucun décalage entre les mots**, comme dans le deck : ils partent tous
 * ensemble. Un décalage progressif donnerait une vague, qui est un autre effet.
 *
 * Le mouvement réduit est traité par `globals.css`, qui neutralise les
 * transitions : les mots se posent alors sans rouler, ce qui est bien ce qu'on
 * demande quand on demande que rien ne bouge.
 *
 * **Sans JavaScript, le titre s'affiche quand même.** C'était le vrai risque de
 * cet effet : les mots partent cachés sous leur masque, et si rien ne vient
 * jamais poser `data-vu`, le titre reste invisible, pour le lecteur comme pour
 * un robot qui rend la page. Le composant est donc rendu par le serveur avec un
 * état déjà décidé, et `layout.tsx` porte, dans un `<noscript>`, la règle qui
 * annule la translation quand le script ne s'exécute pas.
 *
 * Ce `<noscript>` était d'abord **dans** le titre, et c'était une faute : React
 * sérialise le contenu d'un `noscript` comme du texte, donc la feuille de style
 * se retrouvait dans le `textContent` du `h2`. Invisible à l'écran, mais lue
 * par un robot : le titre de la section devenait « De vraies personnes. De
 * vrais résultats.<style>… ». Une contre-règle globale n'a pas ce problème, et
 * elle n'est écrite qu'une fois.
 */
export type SegmentTitre = { texte: string; accent?: boolean };

export function TitreRoulant({
  segments,
  as: Balise = "h2",
  className,
}: {
  /**
   * Le titre, en segments. Un segment par phrase ou par ligne voulue ; celui
   * qui porte `accent` passe en italique appuyé, comme le mot « expertise » du
   * hero et le second membre du titre de la référence.
   */
  segments: readonly SegmentTitre[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const cadre = useRef<HTMLElement>(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;

    /* Pas d'`IntersectionObserver` : on montre, et c'est tout. Un titre qui
       resterait caché parce qu'une API manque serait un titre perdu, pour le
       lecteur comme pour les robots. */
    if (typeof IntersectionObserver === "undefined") {
      setVu(true);
      return;
    }

    const guetteur = new IntersectionObserver(
      (entrees) => {
        if (!entrees[0]?.isIntersecting) return;
        setVu(true);
        /* Une fois monté, le titre ne redescend jamais. Rejouer l'effet à
           chaque passage ferait bouger la page sous les yeux de quelqu'un qui
           remonte simplement la lire. */
        guetteur.disconnect();
      },
      /* Le titre se déclenche quand il est franchement entré, pas dès que son
         premier pixel affleure : sinon l'effet est fini avant qu'on l'ait vu.
         `rootMargin` négatif en bas décale encore le seuil vers l'intérieur. */
      { threshold: 0.3, rootMargin: "0px 0px -6% 0px" },
    );

    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, []);

  return (
    <Balise
      ref={cadre as React.Ref<HTMLHeadingElement>}
      data-titre-roulant
      data-vu={vu ? "" : undefined}
      className={cn("group/titre", className)}
    >
      {segments.map((segment, s) => {
        const mots = segment.texte.split(" ");

        return mots.map((mot, i) => (
          // L'index fait partie de la clé et il le faut : un titre répète
          // volontiers un mot, et deux clés identiques feraient sauter le
          // second.
          <Fragment key={`${s}-${i}-${mot}`}>
            <span
              className={cn(
                "inline-block -mb-[0.22em] overflow-hidden pb-[0.22em] align-top",
                segment.accent && "titre-fort",
              )}
            >
              <span className="inline-block translate-y-[112%] transition-transform duration-[850ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[vu]/titre:translate-y-0">
                {mot}
              </span>
            </span>

            {/* L'espace est **en dehors** du bloc masqué, et c'est la seule
                place possible. À l'intérieur d'un `inline-block`, un espace en
                fin de contenu est simplement supprimé par le moteur de rendu :
                le titre s'affichait « Devraiespersonnes. Devraisrésultats. »,
                et se copiait comme ça.

                Le dernier mot du dernier segment n'en prend pas, sinon le titre
                traîne une espace qui décale son centrage d'un demi-caractère. */}
            {i < mots.length - 1 || s < segments.length - 1 ? " " : null}
          </Fragment>
        ));
      })}
    </Balise>
  );
}
