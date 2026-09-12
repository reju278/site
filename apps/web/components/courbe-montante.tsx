"use client";

import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Une courbe qui monte, et son montant qui grimpe avec elle.
 *
 * C'est la cousine de `CourbeVivante`, et elle dit l'inverse. Celle des
 * témoignages oscille sans aller nulle part, parce que la section parle de
 * résultats obtenus et non d'une progression. Celle-ci monte, parce qu'elle
 * illustre ce que la carte annonce juste au-dessus.
 *
 * **Elle n'ajoute aucune promesse à celle qui est déjà écrite.** La carte dit
 * « plus de 6 chiffres par an » ; la courbe s'arrête à 250 000 €, qui est dans
 * cette fourchette. Une courbe qui finirait plus haut que la phrase qu'elle
 * accompagne serait une seconde promesse, glissée dans un dessin.
 *
 * **Elle se dessine à l'entrée dans la vue, une fois.** Une animation qui se
 * rejoue à chaque passage fait bouger la page sous les yeux de quelqu'un qui
 * remonte simplement la lire.
 *
 * Sous `prefers-reduced-motion`, tout est posé d'emblée : le tracé entier et le
 * montant final. On ne perd que le mouvement, et il ne portait rien que le
 * dessin ne dise déjà.
 */

/* Le tracé, en unités de dessin. Le cadre est ensuite étiré sur la largeur de
   la carte : l'abscisse n'a donc pas d'importance, seule compte la forme. */
const L = 300;
const H = 84;

/* Neuf points qui montent, avec deux replis. Une droite parfaite ne ressemble à
   aucun business ; deux creux suffisent à faire une courbe qu'on croit, sans
   raconter d'histoire. */
const POINTS = [
  { x: 0, y: 0.08 },
  { x: 38, y: 0.16 },
  { x: 75, y: 0.12 },
  { x: 113, y: 0.3 },
  { x: 150, y: 0.42 },
  { x: 188, y: 0.38 },
  { x: 225, y: 0.62 },
  { x: 263, y: 0.78 },
  { x: L, y: 1 },
] as const;

/* `v` est la part de hauteur, zéro en bas. Une marge en haut et en bas évite
   que le trait ne touche les bords du cadre, où il serait coupé de moitié. */
const y = (v: number) => H - 6 - v * (H - 14);

/* La courbe monotone, celle de `curveMonotoneX` : elle passe par les points
   sans les dépasser, donc sans les faux rebonds qu'une spline ordinaire invente
   entre deux valeurs. C'est la même construction que dans `CourbeVivante`. */
const TAN = (() => {
  const n = POINTS.length;
  const dx: number[] = [];
  const m: number[] = [];
  const t: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    dx[i] = POINTS[i + 1]!.x - POINTS[i]!.x;
    m[i] = (y(POINTS[i + 1]!.y) - y(POINTS[i]!.y)) / dx[i]!;
  }

  t[0] = m[0]!;
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1]! * m[i]! <= 0) {
      t[i] = 0;
      continue;
    }
    const w1 = 2 * dx[i]! + dx[i - 1]!;
    const w2 = dx[i]! + 2 * dx[i - 1]!;
    t[i] = (w1 + w2) / (w1 / m[i - 1]! + w2 / m[i]!);
  }
  t[n - 1] = m[n - 2]!;
  return t;
})();

const chemin = (fermer: boolean) => {
  let d = `M0 ${y(POINTS[0]!.y).toFixed(1)}`;
  for (let i = 0; i < POINTS.length - 1; i++) {
    const h = (POINTS[i + 1]!.x - POINTS[i]!.x) / 3;
    d +=
      ` C${(POINTS[i]!.x + h).toFixed(1)} ${(y(POINTS[i]!.y) + TAN[i]! * h).toFixed(1)}` +
      ` ${(POINTS[i + 1]!.x - h).toFixed(1)} ${(y(POINTS[i + 1]!.y) - TAN[i + 1]! * h).toFixed(1)}` +
      ` ${POINTS[i + 1]!.x.toFixed(1)} ${y(POINTS[i + 1]!.y).toFixed(1)}`;
  }
  if (fermer) d += ` L${L} ${H} L0 ${H} Z`;
  return d;
};

const D_TRAIT = chemin(false);
const D_AIRE = chemin(true);

/* Assez long pour couvrir le tracé quelle que soit sa longueur réelle : on ne
   la mesure pas, on la majore. Mesurer demanderait `getTotalLength`, donc un
   rendu avant de pouvoir animer, donc un premier affichage sans animation. */
const LONGUEUR = 900;

export function CourbeMontante({
  fin,
  unite,
  className,
}: {
  /** Le montant atteint au bout de la courbe. */
  fin: number;
  /** Ce qui suit le montant, « /an » par exemple. */
  unite: string;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const [vu, setVu] = useState(false);
  const [valeur, setValeur] = useState(0);

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVu(true);
      setValeur(fin);
      return;
    }

    const guetteur = new IntersectionObserver(
      (entrees) => {
        if (!entrees[0]?.isIntersecting) return;
        setVu(true);
        guetteur.disconnect();
      },
      { threshold: 0.4 },
    );

    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, [fin]);

  /* Le montant grimpe avec le trait, et sur la même durée : les deux doivent
     arriver ensemble, sinon le chiffre a l'air de compter tout seul. */
  useEffect(() => {
    if (!vu) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValeur(fin);
      return;
    }

    const DUREE = 1400;
    let image = 0;
    let debut = 0;

    const boucle = (t: number) => {
      if (!debut) debut = t;
      const part = Math.min(1, (t - debut) / DUREE);
      /* Le même amortissement que le tracé, pour que le chiffre ne prenne pas
         d'avance sur la ligne au milieu du mouvement. */
      const doux = 1 - Math.pow(1 - part, 3);
      setValeur(Math.round((fin * doux) / 500) * 500);
      if (part < 1) image = requestAnimationFrame(boucle);
      else setValeur(fin);
    };

    image = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(image);
  }, [vu, fin]);

  return (
    <div
      ref={cadre}
      data-vu={vu ? "" : undefined}
      className={cn("group/courbe relative", className)}
    >
      <svg
        viewBox={`0 0 ${L} ${H}`}
        preserveAspectRatio="none"
        aria-hidden
        className="block h-[84px] w-full"
      >
        <defs>
          <linearGradient id="cm-aire" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--courbe)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--courbe)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* L'aire apparaît en fondu plutôt qu'en se dessinant : une aire qui se
            découpe de gauche à droite donne un rectangle qui grandit, pas une
            courbe qui monte. */}
        <path
          d={D_AIRE}
          fill="url(#cm-aire)"
          className="opacity-0 transition-opacity duration-700 delay-500 group-data-[vu]/courbe:opacity-100"
        />

        {/* Le trait se dessine par son pointillé : `stroke-dasharray` pose un
            tiret aussi long que tout le tracé, et `stroke-dashoffset` le fait
            entrer. C'est la seule façon d'animer un tracé sans le recalculer à
            chaque image.

            `vector-effect` garde au trait son épaisseur malgré l'étirement du
            cadre, sans quoi il s'épaissirait avec la largeur de la carte. */}
        <path
          d={D_TRAIT}
          fill="none"
          stroke="var(--courbe)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={LONGUEUR}
          strokeDashoffset={LONGUEUR}
          className="transition-[stroke-dashoffset] duration-[1400ms] ease-out group-data-[vu]/courbe:[stroke-dashoffset:0]"
        />
      </svg>

      {/* Le montant, au bout de la courbe.

          `tabular-nums` est indispensable : le chiffre change soixante fois par
          seconde, et avec des chiffres de largeur variable le bloc tremblerait.

          Il est posé en bas à droite et non sur le point d'arrivée : la courbe
          est étirée, donc son dernier point n'est pas à une position connue
          d'avance, et le suivre demanderait de mesurer à chaque redimension pour
          un gain nul. */}
      <p className="mt-1 text-right text-sm font-semibold tabular-nums text-foreground">
        {valeur.toLocaleString("fr-FR")}&nbsp;{unite}
      </p>
    </div>
  );
}
