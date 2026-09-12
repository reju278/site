"use client";

import {
  LiveLine,
  LiveLineChart,
  type LiveLinePoint,
} from "@repo/ui/components/graphique-flux";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Une courbe vivante qui monte, dans la carte de l'offre.
 *
 * C'est le **Live Line Chart du registre Bklit**, installé et non réécrit :
 * `pnpm dlx shadcn@latest add @bklit/live-line-chart`. Bklit est le registre
 * des graphiques du projet, et celui-ci est fait pour exactement ça, un flux
 * qui défile avec un point qui bat au bout. Le deck publicitaire l'avait porté
 * à la main parce qu'il est un fichier autonome sans React ; ici on n'a pas
 * cette excuse.
 *
 * **Ce qui est à nous, c'est la série**, pas le dessin. Le composant attend un
 * flux de points `{ time, value }` et on le lui fabrique : une montée, puis une
 * vie. C'est cette forme-là qui porte le sens, et c'est la seule chose qu'il
 * fallait écrire.
 *
 * **Elle n'ajoute aucune promesse à celle qui est déjà écrite.** La carte dit
 * « plus de 6 chiffres par an » ; la courbe s'installe autour de 250 000 €, qui
 * est dans cette fourchette, et n'en sort pas. Une courbe qui continuerait de
 * grimper indéfiniment serait une seconde promesse, glissée dans un dessin.
 *
 * **Rien ne tourne tant que la carte n'est pas à l'écran**, et tout s'arrête
 * quand elle en sort. Une boucle d'animation qui continue dans un onglet
 * d'arrière-plan est du courant consommé pour personne.
 */

/** Le pas du flux. Un point par tiers de seconde : assez pour que ça vive. */
const TIC = 330;

/** La fenêtre visible, en secondes. */
const FENETRE = 14;

/** Le nombre de points gardés en mémoire. Au-delà, on oublie. */
const MEMOIRE = 90;

export function CourbeMontante({
  fin,
  unite,
  className,
}: {
  /** Le palier autour duquel la courbe s'installe. */
  fin: number;
  /** Ce qui suit le montant dans la pastille, « €/an » par exemple. */
  unite: string;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [points, setPoints] = useState<LiveLinePoint[]>([]);
  const [valeur, setValeur] = useState(fin);

  /* On ne démarre qu'à l'écran, et on s'arrête en sortant. `IntersectionObserver`
     ne se déconnecte donc pas au premier passage, contrairement aux autres
     animations du site : ici ce n'est pas un effet qui se joue une fois, c'est
     une boucle qui tourne, et la laisser tourner hors champ ne sert personne. */
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const guetteur = new IntersectionObserver(
      (entrees) => setVisible(Boolean(entrees[0]?.isIntersecting)),
      { threshold: 0.2 },
    );

    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    /* Le mouvement réduit reçoit une courbe posée, pas une courbe figée à zéro :
       on remplit la fenêtre d'un seul coup et on n'ajoute plus rien. Le dessin
       dit la même chose, il ne bouge simplement pas. */
    const immobile = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const maintenant = Date.now() / 1000;
    const combien = Math.ceil((FENETRE * 1000) / TIC) + 4;

    /* La fenêtre de départ : une montée de la moitié du palier jusqu'à lui.
       Elle est pré-remplie plutôt que construite point par point, sinon la
       carte s'ouvrirait sur une courbe vide qui se remplit pendant dix
       secondes. */
    const depart: LiveLinePoint[] = Array.from({ length: combien }, (_, i) => {
      const part = i / (combien - 1);
      /* Un amortissement en fin de course : la montée ralentit en approchant du
         palier, au lieu de s'y cogner. */
      const doux = 1 - Math.pow(1 - part, 2.2);
      return {
        time: maintenant - ((combien - 1 - i) * TIC) / 1000,
        value: fin * (0.52 + 0.48 * doux) + bruit(i) * fin * 0.018,
      };
    });

    setPoints(depart);
    setValeur(depart[depart.length - 1]!.value);

    if (immobile) return;

    let pas = combien;

    const battement = setInterval(() => {
      pas += 1;

      /* La suite vit autour du palier sans le quitter : deux sinusoïdes de
         périodes premières entre elles, donc une oscillation qui ne se répète
         pas à l'œil, plus un grain. L'amplitude reste sous deux pour cent : au
         delà, la courbe a l'air de tanguer plutôt que de vivre. */
      const onde =
        Math.sin(pas / 11) * 0.012 + Math.sin(pas / 4.3) * 0.006 + bruit(pas) * 0.004;

      const point = {
        time: Date.now() / 1000,
        value: fin * (1 + onde),
      };

      setPoints((avant) => [...avant.slice(-MEMOIRE), point]);
      setValeur(point.value);
    }, TIC);

    return () => clearInterval(battement);
  }, [visible, fin]);

  return (
    <div ref={cadre} className={cn("h-28 w-full", className)}>
      {points.length > 0 ? (
        <LiveLineChart
          data={points}
          value={valeur}
          window={FENETRE}
          /* Une unité de décalage laisse un peu d'air entre le point qui bat et
             le bord droit : sans elle, la pastille de valeur sort du cadre. */
          nowOffsetUnits={1}
          margin={{ top: 12, right: 92, bottom: 8, left: 4 }}
        >
          {/* Ni axes ni infobulle : c'est une vignette dans une carte, pas un
              tableau de bord. Les axes diraient des dates qui n'existent pas, et
              une infobulle inviterait à interroger des chiffres qui ne sont
              qu'une illustration. */}
          <LiveLine
            dataKey="value"
            stroke="var(--courbe)"
            strokeWidth={2.5}
            formatValue={(v) =>
              `${Math.round(v / 500) * 500} ${unite}`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                " ",
              )
            }
          />
        </LiveLineChart>
      ) : null}
    </div>
  );
}

/**
 * Un grain déterministe entre -1 et 1.
 *
 * `Math.random` ferait diverger le rendu du serveur et celui du navigateur, et
 * React signalerait une erreur d'hydratation à chaque chargement. Une suite
 * calculée à partir de l'indice donne la même chose des deux côtés.
 */
function bruit(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}
