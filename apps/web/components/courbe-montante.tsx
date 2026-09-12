"use client";

import {
  Bar,
  BarChart,
  ChartTooltip,
  Grid,
} from "@repo/ui/components/graphique-flux";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * La courbe de croissance, dans la carte de l'offre.
 *
 * C'est le `BarChart` du registre Bklit, installé et non réécrit. Deux versions
 * l'ont précédé et ont été retirées sur décision de Rémy : le `LiveLineChart`,
 * qui défilait en permanence et tirait l'œil hors du texte, puis l'`AreaChart`,
 * une courbe pleine. Les barres disent la même progression en la découpant :
 * on lit une suite de périodes plutôt qu'un trait continu, et chacune se
 * survole.
 *
 * **La forme est le message.** Elle part à plat, longtemps, puis monte
 * franchement. C'est ce plat du début qui fait tout le sens : un graphique qui
 * monterait dès la première barre dirait « ça grimpe », celui-ci dit « il ne se
 * passait rien, et puis ». C'est ce que la carte raconte au-dessus.
 *
 * **Les barres sont d'un seul vert.** Une version les faisait passer du rouge
 * au vert en chemin, pour que le plat du début se lise comme un problème ; le
 * dégradé se résolvant dans le repère de chaque forme, chaque barre se
 * retrouvait moitié rouge moitié verte. Retiré sur décision de Rémy. La
 * progression se lit dans la hauteur des barres, ce qui suffisait.
 *
 * Le dégradé est posé en SVG par nous, et pas par le `LinearGradient` de
 * l'exemple du registre : ce composant n'existe pas dans le lot installé, il
 * vient de `@visx/gradient`, et une dépendance de plus pour quatre lignes de
 * balisage ne se justifie pas.
 *
 * **Le seul chiffre écrit est celui de la carte.** L'indication au bout reprend
 * « plus de 6 chiffres par an », mot pour mot : la courbe n'annonce rien que la
 * phrase ne dise déjà, elle lui donne une forme.
 *
 * **Elle ne se monte qu'à l'approche de la carte.** Le composant joue son
 * apparition au montage : monté tout de suite, il l'aurait jouée pendant que la
 * carte est encore à deux écrans plus bas, et on ne verrait qu'une courbe déjà
 * là.
 */

/* La série. Quatorze points : six à plat, puis la montée.
 *
 * **Les valeurs sont en euros depuis qu'on peut les survoler.** Elles étaient
 * des parts de zéro à un, ce qui suffisait à dessiner une forme ; à partir du
 * moment où l'infobulle les montre, elles doivent vouloir dire quelque chose.
 *
 * Elles décrivent une trajectoire et non des résultats constatés : à plat sous
 * mille cinq cents euros, puis une montée jusqu'à 250 000, qui est dans la
 * fourchette que la carte annonce, « plus de 6 chiffres par an ». La courbe ne
 * chiffre donc rien de plus que la phrase qu'elle accompagne.
 *
 * Les abscisses ne sont que des étiquettes de rang, jamais affichées : les
 * nommer en mois donnerait une durée, qui serait une promesse de plus. */
const EUROS = [
  0, 300, 900, 400, 1500, 1100, 6000, 22000, 48000, 76000, 124000, 168000,
  212000, 250000,
];

/* L'abscisse est une étiquette et non une date : un diagramme à barres range
   des catégories, pas un continuum. Elle n'est jamais affichée, l'axe étant
   absent, mais le registre en a besoin pour distinguer les barres. */
const SERIE = EUROS.map((valeur, i) => ({
  periode: `p${i + 1}`,
  valeur,
}));

/**
 * La hauteur du bloc d'animation, partagée avec l'échange du consulting.
 *
 * Les deux cartes se suivent dans la même grille : si leurs blocs n'ont pas la
 * même hauteur, leurs descriptions ne démarrent pas à la même ligne, et deux
 * paragraphes décalés de trente pixels se voient immédiatement. La valeur est
 * donc écrite une fois, ici, et importée là-bas.
 */
export const HAUTEUR_ANIMATION = "h-40";

export function CourbeMontante({ className }: { className?: string }) {
  const cadre = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const guetteur = new IntersectionObserver(
      (entrees) => {
        if (!entrees[0]?.isIntersecting) return;
        setVisible(true);
        /* Une seule fois : l'apparition ne se rejoue pas à chaque passage. Une
           courbe qui se redessine sous les yeux de quelqu'un qui remonte lire
           la carte est une distraction, pas une démonstration. */
        guetteur.disconnect();
      },
      { threshold: 0.35 },
    );

    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, []);

  return (
    /* La hauteur est réservée dès le premier rendu, avant même que le graphique
       n'existe : sans elle, la carte grandirait au moment de l'apparition,
       pousserait son bouton vers le bas et ferait sauter la carte voisine, qui
       partage sa hauteur de grille. C'est le décalage de mise en page, et il
       est mesuré. */
    <div
      ref={cadre}
      className={cn(
        "relative flex w-full flex-col",
        HAUTEUR_ANIMATION,
        className,
      )}
    >
      {/* Le dégradé des barres, dans un SVG sans dimension.

          Une référence `url(#…)` se résout à l'échelle du document, pas de
          l'élément : le dégradé peut donc vivre ici et servir aux barres que le
          registre dessine plus bas, sans qu'on ait à toucher à son code.

          **Il est vertical, et c'est une correction.** Une première version le
          posait à l'horizontale, du rouge au vert, pour que le plat du début
          soit rouge et la montée verte. Ça ne marche pas : un dégradé se résout
          dans le repère de **chaque forme** qu'il remplit, donc chaque barre
          recevait la bascule entière et se retrouvait moitié rouge, moitié
          verte. Quatorze barres bicolores au lieu d'une progression.

          Le faire à l'échelle du graphique demanderait
          `gradientUnits="userSpaceOnUse"` et des coordonnées en pixels, donc de
          connaître la largeur du tracé avant de la dessiner. Les barres sont
          donc d'un seul vert, qui s'éclaircit vers le bas : la progression se
          lit dans leur hauteur, ce qui suffisait depuis le début. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="courbe-bascule" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--courbe)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--courbe)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
      </svg>

      <div className="min-h-0 flex-1">
        {visible ? (
          <BarChart
            data={SERIE}
            xDataKey="periode"
            aspectRatio="auto"
            /* Des marges presque nulles : les barres occupent toute la
               vignette. Celles du registre réservent quarante pixels de chaque
               côté pour des axes, que cette vignette n'a pas. */
            margin={{ top: 8, right: 2, bottom: 2, left: 2 }}
            /* L'apparition, plus lente que le défaut : les barres poussent
               l'une après l'autre, et le plat du début doit se lire avant que la
               montée n'arrive. */
            animationDuration={1500}
            /* `BarChart` n'accepte pas de `style`, contrairement à `AreaChart` :
               la hauteur passe donc par une classe, sur son propre conteneur. */
            className="h-full"
          >
            {/* La grille, horizontale seulement. Les verticales sépareraient des
                périodes qui sont arbitraires. */}
            <Grid horizontal />

            <Bar
              dataKey="valeur"
              fill="url(#courbe-bascule)"
              /* `stroke` ne dessine pas un contour ici : c'est la couleur du
                 point de l'infobulle, que le registre ne sait pas déduire d'un
                 dégradé. */
              stroke="var(--courbe)"
              lineCap={3}
            />

            {/* L'infobulle, sur demande de Rémy : on passe sur une barre et on
                lit le montant.

                Pas d'axe des abscisses ni de pastille de date : les périodes
                sont arbitraires, et les montrer donnerait une durée, donc une
                promesse de plus que celle de la carte.

                Le contenu est écrit ici plutôt que laissé au registre, dont
                l'en-tête affiche l'abscisse, et en anglais. Les couleurs y sont
                écrites en toutes lettres : la boîte du registre pose son propre
                fond sombre dans les deux thèmes, donc un jeton sémantique
                n'aurait rien à suivre. */}
            <ChartTooltip
              showDatePill={false}
              indicatorColor="var(--courbe)"
              content={({ point }) => (
                <div className="px-3 py-2">
                  <p className="text-xs text-white/70">
                    Chiffre d&apos;affaires
                  </p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-white">
                    {Number(point.valeur ?? 0).toLocaleString("fr-FR")} €
                  </p>
                </div>
              )}
            />
          </BarChart>
        ) : null}
      </div>
    </div>
  );
}
