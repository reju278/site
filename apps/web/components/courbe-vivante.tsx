"use client";

import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef } from "react";

/**
 * La courbe vivante, derrière la vidéo des résultats.
 *
 * C'est le « Live Line » du registre Bklit, déjà porté en JavaScript nu dans le
 * deck publicitaire Funnels Club. Ce fichier reprend ce portage, sur demande de
 * Rémy : la courbe monotone, le dégradé vertical du trait, l'aire sous la
 * courbe, le fondu des bords, le pointillé au niveau de la valeur et le point
 * qui bat.
 *
 * **La pastille de prix est là sur décision de Rémy.** Elle avait été écartée
 * d'abord : sur une page publique, à côté de témoignages de clients, un montant
 * en euros qui défile peut se lire comme une promesse de revenus plutôt que
 * comme une décoration, et sur un site de formation c'est une allégation
 * commerciale. Rémy la veut, elle y est, et il en a fixé la fourchette :
 * 8 000 à 70 000 € par mois, arrondis à la centaine.
 *
 * Si la question revient, ce qui se retire est la pastille, pas la courbe : le
 * mouvement ne chiffre rien de lui-même.
 *
 * **Le tracé est dessiné une fois pour toutes, en entier, et c'est un
 * `translateX` qui le fait défiler.** Redessiner le chemin à chaque image sous
 * deux masques faisait saccader la page du deck : le navigateur reprenait tout
 * le rendu soixante fois par seconde. Ici, il ne déplace qu'un calque.
 */

/* Les réglages, repris du deck. Les abscisses sont en pixels CSS et non en
   unités de scène : la page n'est pas une diapositive à taille fixe, donc la
   courbe est dessinée à l'échelle 1 et c'est le conteneur qui la rogne. */
const CB = {
  /** Le pas horizontal entre deux points. */
  pas: 60,
  /** La fenêtre visible, en nombre de points. `window={25}` chez Bklit. */
  fenetre: 25,
  /** Un point toutes les 140 ms. Le deck était à 170 ; la fourchette est
      maintenant huit fois plus large, donc le chiffre a plus de chemin à
      parcourir et il lui faut aller un peu plus vite pour que le mouvement
      reste vivant. */
  tic: 140,
  /** La boucle : environ seize secondes. */
  periode: 96,
  trait: 3,
  point: 6,
} as const;

/* La hauteur de dessin. Le SVG est ensuite étiré en hauteur sur le conteneur
   par `preserveAspectRatio="none"`, ce qui change l'amplitude de la vague mais
   pas son abscisse : le défilement reste donc exact au pixel. Le trait, lui,
   garde son épaisseur grâce à `vector-effect`. */
const H = 620;
const Y0 = H * 0.78;
const Y1 = H * 0.24;

/* La série : quatre sinusoïdes dont les fréquences sont des multiples entiers
   de la période. La série se referme donc exactement sur elle-même, et la
   boucle ne se voit pas. */
const ONDES = [
  { k: 1, a: 0.46 },
  { k: 3, a: 0.25 },
  { k: 5, a: 0.13 },
  { k: 8, a: 0.07 },
];

const valeur = (i: number) => {
  const m = ((i % CB.periode) + CB.periode) % CB.periode;
  const somme = ONDES.reduce(
    (t, o) =>
      t +
      o.a * Math.sin((2 * Math.PI * o.k * (m - (CB.fenetre - 1))) / CB.periode),
    0,
  );
  /* 0,5 est le milieu de la fourchette : la courbe tient la ligne d'horizon et
     n'y va pas. La slide dit « des résultats », pas « une courbe qui monte ». */
  return 0.5 + somme / 2;
};

const hauteur = (v: number) => Y0 - v * (Y0 - Y1);

/* La fourchette affichée par la pastille, celle du deck. La valeur normalisée
   de la série, entre zéro et un, y est ramenée telle quelle. */
const MIN = 8000;
const MAX = 70000;

/* L'unité est écrite, et ce n'est pas cosmétique : « 38 400 € » tout seul ne
   dit pas sur quelle durée, et c'est justement ce que le nombre prétend
   montrer. Un chiffre ambigu sur un site de formation se lit dans le sens le
   plus favorable, ce qui est exactement ce qu'il faut éviter. */
const euros = (v: number) =>
  `${(Math.round((MIN + v * (MAX - MIN)) / 100) * 100).toLocaleString("fr-FR")} €/mois`;

/* La valeur normalisée à une position quelconque, par le même polynôme que la
   hauteur : la pastille dit donc exactement ce que montre le point, et non une
   valeur approchée d'à côté. */
const valeurEntre = (y: number) => (Y0 - y) / (Y0 - Y1);

/* Le tracé couvre une période entière plus la fenêtre : au bout d'un tour on
   revient au même point, et la translation reprend au début sans raccord. */
const N = CB.periode + CB.fenetre + 2;
const BOUT = CB.periode + CB.fenetre - 1;

const PTS = Array.from({ length: N }, (_, i) => ({
  x: i * CB.pas,
  y: hauteur(valeur(i)),
}));

/* Les tangentes de la courbe monotone de d3, `curveMonotoneX`, celle que le
   composant emploie par défaut : elle passe par les points sans les dépasser,
   donc sans les faux rebonds qu'une spline ordinaire invente entre deux
   valeurs. On les garde : elles servent à poser la tête entre deux points,
   exactement sur le tracé. */
const TAN = (() => {
  const n = PTS.length;
  const dx: number[] = [];
  const m: number[] = [];
  const t: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    dx[i] = PTS[i + 1]!.x - PTS[i]!.x;
    m[i] = (PTS[i + 1]!.y - PTS[i]!.y) / dx[i]!;
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
  let d = `M0 ${PTS[0]!.y.toFixed(1)}`;
  for (let i = 0; i < PTS.length - 1; i++) {
    const h = CB.pas / 3;
    d +=
      ` C${(PTS[i]!.x + h).toFixed(1)} ${(PTS[i]!.y + TAN[i]! * h).toFixed(1)}` +
      ` ${(PTS[i + 1]!.x - h).toFixed(1)} ${(PTS[i + 1]!.y - TAN[i + 1]! * h).toFixed(1)}` +
      ` ${PTS[i + 1]!.x.toFixed(1)} ${PTS[i + 1]!.y.toFixed(1)}`;
  }
  if (fermer) d += ` L${PTS[PTS.length - 1]!.x.toFixed(1)} ${H} L0 ${H} Z`;
  return d;
};

/* La hauteur du tracé entre deux points, par le même polynôme d'Hermite que
   celui écrit dans le chemin : la tête ne flotte donc jamais à côté. */
const hauteurEntre = (pos: number) => {
  const i = Math.min(Math.max(Math.floor(pos), 0), PTS.length - 2);
  const u = pos - i;
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * PTS[i]!.y +
    (u3 - 2 * u2 + u) * CB.pas * TAN[i]! +
    (-2 * u3 + 3 * u2) * PTS[i + 1]!.y +
    (u3 - u2) * CB.pas * TAN[i + 1]!
  );
};

const LARGE = Math.ceil(PTS[PTS.length - 1]!.x) + 40;
const D_AIRE = chemin(true);
const D_TRAIT = chemin(false);

export function CourbeVivante({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const tete = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = piste.current;
    const marque = tete.current;
    if (!rail || !marque) return;

    /* La tête se pose aux trois quarts de la **largeur réelle du conteneur**,
       et non à une abscisse fixe de la courbe.

       C'était l'erreur : `(fenetre - 1) × pas × 0,8` vaut 1 152 px, ce qui
       tombait au-delà du bord sur tout écran de moins de 1 500 px. La tête et
       sa pastille étaient simplement hors champ, et rien ne le signalait
       puisque le conteneur rogne ce qui dépasse.

       Trois quarts, et pas plus : le cadre fond ses bords à partir de 86 %, et
       une pastille posée dedans s'effacerait avec eux. */
    let xTete = 0;

    const caler = () => {
      const large = rail.parentElement!.clientWidth;

      /* La tête se pose **dans la marge à droite de la carte vidéo**, et non à
         un pourcentage de la largeur.

         C'est une contrainte d'opacité, pas de goût : la courbe est derrière la
         carte, et la carte est opaque. Tout ce qui tombe dessous est
         simplement invisible. Le deck n'avait pas ce problème, sa courbe passait
         derrière du texte.

         La carte est mesurée plutôt que supposée : sa largeur est bornée par
         une classe, et la lire évite de recopier ici un nombre qui changerait
         là-bas sans prévenir. */
      /* **Le sélecteur a déjà été faux une fois**, et le défaut ne se voyait
         pas : il cherchait un `figure` que la carte n'a plus. Il ne trouvait
         donc rien, la marge tombait à zéro, et la tête se cachait d'elle-même
         par la règle du dessous. Rien n'échouait, rien ne s'affichait.

         D'où le repli sur zéro plutôt que sur la largeur totale : sans carte
         trouvée, la marge vaut toute la place, et la tête se pose au lieu de
         disparaître en silence. Une panne visible se répare ; une panne
         silencieuse se cherche des heures. */
      const carte = cadre.current?.querySelector("[data-carte]");
      const largeCarte = carte?.getBoundingClientRect().width ?? 0;
      const marge = (large - largeCarte) / 2;

      /* La tête se pose juste après le bord droit de la carte, et non au
         milieu de la marge. La marge ne fait que 172 px sur un écran de 1440 ;
         au milieu, la pastille arrivait contre le bord du conteneur et se
         cassait en deux lignes, « 4 230 » puis « € ». Collée à la carte, elle a
         toute la marge devant elle.

         Cette marge n'est à elle que depuis que les flèches sont redescendues
         sous la carte : elles l'occupaient, et la pastille leur passait
         dessus. Deux objets ne peuvent pas tenir dans 172 px.

         Le décalage est de 58 px et non de 22 : la carte porte une ombre large
         et diffuse, qui déborde bien au-delà de son bord. Collée à 22 px, la
         pastille tombait dedans et s'y assourdissait. */
      xTete = (large + largeCarte) / 2 + 58;
      marque.style.left = `${xTete}px`;

      /* Sous `lg`, la carte prend toute la largeur : il n'y a pas de marge, donc
         pas de place pour la tête. Elle s'efface plutôt que de se poser derrière
         la vidéo, où elle ne se verrait pas tout en continuant à être calculée
         soixante fois par seconde. */
      marque.style.display = marge < 110 ? "none" : "";
    };
    caler();

    /* La largeur change quand on redimensionne, et aussi quand la carte vidéo
       change de hauteur au point de rupture. Un `ResizeObserver` suit les deux,
       là où un écouteur sur `resize` raterait le second. */
    const mesure = new ResizeObserver(caler);
    mesure.observe(rail.parentElement!);

    /* Depuis le cadre et non depuis un parent : le pointillé et la tête ne
       vivent plus dans la même couche, voir plus bas. */
    const suiveurs = [
      ...cadre.current!.querySelectorAll<HTMLElement>("[data-suit]"),
    ];
    const montant = marque.querySelector<HTMLElement>("[data-montant]");

    const poser = (pos: number) => {
      rail.style.transform = `translate3d(${xTete - pos * CB.pas}px, 0, 0)`;

      /* La hauteur est en unités de dessin ; elle devient un pourcentage,
         parce que le conteneur n'a pas de hauteur fixe. C'est la même
         conversion que celle qu'opère `preserveAspectRatio="none"` sur le
         tracé, donc le point reste sur la courbe à toutes les hauteurs. */
      const brut = hauteurEntre(pos);
      const y = `${((brut / H) * 100).toFixed(2)}%`;
      suiveurs.forEach((el) => {
        el.style.top = y;
      });

      if (montant) montant.textContent = euros(valeurEntre(brut));
    };

    poser(CB.fenetre - 1);

    /* `prefers-reduced-motion` arrête la boucle, il ne l'accélère pas.
       Quelqu'un qui demande moins de mouvement demande que rien ne bouge. La
       courbe reste dessinée, figée à sa position de départ : on ne perd que le
       défilement, et il ne portait aucune information. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => mesure.disconnect();
    }

    let image = 0;
    let debut = 0;

    const boucle = (t: number) => {
      if (!debut) debut = t;
      let pos = CB.fenetre - 1 + (t - debut) / CB.tic;
      /* Un tour complet : on recule d'une période. Comme la série s'y referme
         exactement, l'image ne bouge pas d'un pixel au moment du saut. */
      while (pos >= BOUT) pos -= CB.periode;
      poser(pos);
      image = requestAnimationFrame(boucle);
    };

    image = requestAnimationFrame(boucle);
    return () => {
      cancelAnimationFrame(image);
      mesure.disconnect();
    };
  }, []);

  return (
    <div ref={cadre} className={cn("relative isolate", className)}>
      {/* La courbe, tout au fond.

          Le masque du bas évite que l'aire se termine sur une arête. Celui des
          côtés est porté par le cadre, plus bas : un pourcentage posé sur la
          piste se calculerait sur ses six mille pixels, et le fondu ne serait
          jamais là où il faut. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 74%, transparent 98%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 74%, transparent 98%)",
        }}
      >
        {/* Le cadre porte le fondu des deux bords. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 7%, #000 86%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 7%, #000 86%, transparent 100%)",
          }}
        >
          <div
            ref={piste}
            className="absolute inset-y-0 left-0 will-change-transform"
          >
            {/* `preserveAspectRatio="none"` étire le dessin en hauteur sur le
                conteneur sans toucher à l'abscisse : le défilement reste exact
                au pixel. `vector-effect` garde au trait son épaisseur malgré
                l'étirement, sans quoi il s'épaissirait avec le cadre. */}
            <svg
              width={LARGE}
              height="100%"
              viewBox={`0 0 ${LARGE} ${H}`}
              preserveAspectRatio="none"
              aria-hidden
              className="block"
            >
              <defs>
                <linearGradient id="cb-trait" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--courbe)" stopOpacity="1" />
                  <stop
                    offset="100%"
                    stopColor="var(--courbe)"
                    stopOpacity="0.6"
                  />
                </linearGradient>
                <linearGradient id="cb-aire" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--courbe)"
                    stopOpacity="0.1"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--courbe)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <path d={D_AIRE} fill="url(#cb-aire)" />
              <path
                d={D_TRAIT}
                fill="none"
                stroke="url(#cb-trait)"
                strokeWidth={CB.trait}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        {/* Le pointillé reste au fond, derrière la carte : il traverse toute la
            largeur, donc il passerait sur la vidéo s'il montait avec la tête. */}
        <div
          className="absolute inset-x-0 border-t-2 border-dashed opacity-25"
          data-suit
          style={{ borderColor: "var(--courbe)", top: "50%" }}
        />
      </div>

      {/* La tête de la courbe : le point qui bat et la pastille du montant.

          **Elle est au-dessus de la carte et non derrière**, contrairement au
          reste de la courbe. C'est une nécessité : la carte porte une ombre
          large et diffuse qui déborde loin de son bord, et la pastille, posée
          dessous, s'y assourdissait au point de ne plus se lire. Au-dessus,
          elle ne dépend plus de rien.

          Ce n'est pas dangereux parce qu'elle ne recouvre jamais la vidéo : elle
          vit dans la marge à droite de la carte, et s'efface là où cette marge
          n'existe pas. Le pointillé, lui, traverse toute la largeur et reste
          donc au fond.

          Elle est en HTML et non dans le SVG : le tracé est étiré en hauteur
          par `preserveAspectRatio`, et un cercle posé dedans serait écrasé dans
          le même rapport. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      >
        <div
          ref={tete}
          data-suit
          className="absolute size-0"
          style={{ top: "50%" }}
        >
          {/* L'onde. `animate-ping` est l'animation du thème, donc
              `globals.css` la neutralise déjà sous `prefers-reduced-motion`. */}
          <span
            className="absolute size-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-40"
            style={{ backgroundColor: "var(--courbe)" }}
          />
          <span
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              backgroundColor: "var(--courbe)",
              // Le liseré reprend la couleur du fond de section : c'est lui qui
              // détache le point du trait quand les deux se superposent.
              boxShadow: "0 0 0 3px var(--fond-resultats)",
            }}
          />

          {/* La pastille du montant.

              `tabular-nums` est indispensable et non cosmétique : le montant
              change soixante fois par seconde, et avec des chiffres de largeur
              variable la pastille tremblerait en permanence. En chasse fixe,
              seule la valeur bouge.

              `whitespace-nowrap` l'est tout autant : sans lui, la pastille se
              casse entre le nombre et l'unité dès qu'elle approche du bord. */}
          <span className="absolute top-0 left-4 -translate-y-1/2 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium whitespace-nowrap tabular-nums text-card-foreground shadow-sm">
            <span data-montant>{euros(0.5)}</span>
          </span>
        </div>
      </div>

      {/* Le voile flouté, posé entre la courbe et la vidéo.

          Le fondu du bas ne suffit pas : un trait net, même pâle, accroche
          encore l'œil sous ce qu'on regarde. `backdrop-filter` floute ce qui est
          déjà peint dessous, donc la courbe et elle seule ; le fond de la
          section est un dégradé, et flouter un dégradé ne se voit pas.

          **C'est la quatrième et dernière exception au « flou va derrière,
          jamais devant »**, et elle est particulière : ici le flou ne sert pas
          d'habillage, il sert à **effacer** ce qui gênerait la lecture. Le
          masque lui donne la forme du bloc, en composant deux dégradés en
          intersection : un rectangle à bords fondus, et non un ovale, qu'il
          faudrait étendre à toute la largeur pour couvrir un bloc large et bas.

          Le lavis par-dessus finit le travail : le flou seul laisse un trait
          vert reconnaissable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[color-mix(in_oklab,var(--fond-resultats)_50%,transparent)] backdrop-blur-[11px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 4%, #000 14%, #000 86%, transparent 96%), linear-gradient(180deg, transparent 6%, #000 16%, #000 84%, transparent 94%)",
          maskImage:
            "linear-gradient(90deg, transparent 4%, #000 14%, #000 86%, transparent 96%), linear-gradient(180deg, transparent 6%, #000 16%, #000 84%, transparent 94%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      />

      {children}
    </div>
  );
}
