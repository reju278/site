"use client";

import { tachesImmersion } from "@/contenu/immersion";
import { cn } from "@repo/ui/lib/utils";
import { Check, ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Les trois tâches de la page, à cocher, posées en bas de l'écran.
 *
 * Sur demande de Rémy : une pilule fixe en bas de l'écran, qui ouvre la liste
 * d'un seul bloc, et une progression qui survit à la visite.
 *
 * **Ce n'est pas `Gelule`, et c'est une correction.** La première version
 * reprenait les gélules du hero, verre, filet et lumière qui en fait le tour.
 * Rémy a tranché : « pas des trucs qui clignotent, une vraie checklist ». Une
 * lumière qui tourne dit « regarde-moi » ; une liste de tâches dit « il te reste
 * ça à faire », et les deux ne peuvent pas être le même objet. Le verre, lui,
 * est repris au caractère près de `sur="voile"` : `bg-card/85`, son flou, son
 * filet.
 *
 * **C'est la sixième exception à « le flou va derrière, jamais devant »**, et
 * elle se décide plutôt qu'elle ne se constate : Rémy l'a demandée
 * explicitement. Elle se justifie comme les capsules de l'en-tête : un objet qui
 * flotte au-dessus d'un contenu dont on ne sait rien a besoin du verre pour
 * tenir. Elle est écrite dans `AGENTS.md`.
 *
 * **La même mise en page aux deux largeurs**, après deux corrections. Il y a eu
 * un rang de trois pilules sur ordinateur, puis trois cases étroites, avant que
 * Rémy demande le panneau dépliant des deux côtés. Un rang qui traverse un grand
 * écran se lit comme une barre d'outils ; un panneau qu'on ouvre se lit comme
 * une liste, et c'est une liste.
 *
 * **Cochée, la pilule devient verte et la case laisse la place à un V blanc.**
 * Pas de texte barré, sur sa demande : une tâche faite n'est pas une tâche
 * annulée.
 *
 * **Le vert du fond est celui que Rémy a donné**, #11b981, dans
 * `--tache-faite`. Le blanc n'y tient que 2,56:1, sous les seuils du dépôt, et
 * c'est écrit à côté du jeton : il a tranché en connaissant la mesure.
 *
 * **La progression vit dans le navigateur du visiteur**, `localStorage`, parce
 * que le site n'a ni base ni compte. Trois précautions qui n'en sont pas :
 *
 * - **Tout est enveloppé de `try`/`catch`.** En navigation privée, avec les
 *   données de site bloquées ou effacées, l'accès lui-même lève.
 * - **On ne lit rien au premier rendu.** Le serveur ne connaît pas ce stockage :
 *   rendre les cases cochées dès le départ ferait diverger les deux HTML et
 *   casserait l'hydratation. La liste apparaît décochée une image, puis se
 *   remplit.
 * - **Une tâche disparue est ignorée.** On ne garde que les identifiants connus,
 *   pour qu'un vieil enregistrement ne ressuscite pas une tâche retirée.
 *
 * Ce stockage est **fonctionnel et non traçant** : il ne quitte pas l'appareil,
 * ne dit rien de la personne et ne sert qu'à lui rendre son propre écran.
 *
 * **La barre s'efface quand une fenêtre d'entretien est ouverte**, par la règle
 * de `globals.css` qui le faisait déjà pour la barre d'appel : le bouton
 * « Fermer » de la fenêtre est en bas de l'écran, exactement là où ces pilules
 * se posent.
 */

const CLE = "immersion-taches";

/* Le verre, repris de `Gelule` en `sur="voile"`, au caractère près. */
const VERRE = "border border-border bg-card/85 backdrop-blur-md";

export function TachesImmersion() {
  const [faites, setFaites] = useState<readonly string[]>([]);
  const [ouverte, setOuverte] = useState(false);
  const sansMouvement = useReducedMotion();

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE);
      if (!brut) return;
      const lues: unknown = JSON.parse(brut);
      if (!Array.isArray(lues)) return;
      setFaites(
        tachesImmersion
          .map((t) => t.id)
          .filter((id) => (lues as unknown[]).includes(id)),
      );
    } catch {
      /* Pas de stockage : la liste marche, elle ne se souvient pas. */
    }
  }, []);

  const basculer = (id: string) => {
    setFaites((avant) => {
      const apres = avant.includes(id)
        ? avant.filter((x) => x !== id)
        : [...avant, id];
      try {
        window.localStorage.setItem(CLE, JSON.stringify(apres));
      } catch {
        /* Rien à faire : la coche vaut pour cette visite. */
      }
      return apres;
    });
  };

  return (
    <div
      data-taches
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 sm:bottom-5"
    >
      {/* **Un seul objet et non deux**, sur demande de Rémy : « il ne faut pas
          qu'il y ait deux éléments séparés, c'est ce menu-là qui s'étend ». Le
          déclencheur et la liste vivaient dans deux boîtes de verre posées l'une
          au-dessus de l'autre ; il n'y en a plus qu'une, qui grandit.

          **C'est `layout` de Motion qui fait le travail**, et c'est la raison
          d'être de cette propriété : elle relève la boîte avant et après le
          changement et interpole entre les deux, là où aucune transition CSS ne
          sait animer une hauteur qui passe de `auto` à `auto`.

          Le panneau s'étend vers le haut, `justify-end` : il n'y a rien sous une
          barre posée en bas d'écran, et c'est aussi ce qui garde le déclencheur
          immobile pendant que le reste pousse au-dessus de lui.

          **Pas de filets, un rembourrage et des pilules dedans**, sur sa demande
          aussi, qui cite les menus d'Apple : chaque tâche est une pilule qui ne
          se montre qu'au survol.

          **Le rayon intérieur se calcule, il ne se choisit pas** : 18 px au
          cadre moins 6 px de rembourrage font 12 px, et c'est à ce prix que les
          deux courbes restent concentriques. Fermé, le cadre est une gélule et
          son contenu aussi. */}
      <div className="pointer-events-auto flex justify-center">
        <motion.div
          layout={!sansMouvement}
          transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            VERRE,
            "flex w-max max-w-[calc(100vw-2rem)] flex-col gap-0.5 p-1.5",
            "transition-[border-radius] duration-300",
            ouverte ? "rounded-[18px]" : "rounded-full",
          )}
        >
          <AnimatePresence initial={false}>
            {ouverte ? (
              <motion.ul
                key="liste"
                layout={!sansMouvement}
                initial={sansMouvement ? false : { opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: sansMouvement ? 0 : 0.26, delay: 0.04 },
                }}
                exit={{ opacity: 0, transition: { duration: sansMouvement ? 0 : 0.12 } }}
                className="flex flex-col gap-0.5"
              >
                {tachesImmersion.map((tache) => (
                  <li key={tache.id} className="flex">
                    <Tache
                      texte={tache.texte}
                      ancre={tache.ancre}
                      faite={faites.includes(tache.id)}
                      onClick={() => basculer(tache.id)}
                      onVoir={() => setOuverte(false)}
                      className="w-full"
                    />
                  </li>
                ))}
              </motion.ul>
            ) : null}
          </AnimatePresence>

          <motion.button
            layout={!sansMouvement}
            type="button"
            onClick={() => setOuverte((o) => !o)}
            aria-expanded={ouverte}
            className={cn(
              /* **La police des titres**, sur demande de Rémy, avec sa hauteur
                 de ligne rendue : l'utilitaire `titre` pose 1,12, ce qui est
                 juste pour un titre de deux lignes et trop serré pour une ligne
                 de liste. */
              "titre inline-flex items-center justify-center gap-2.5 py-2 pr-4 pl-3 text-base leading-normal text-foreground transition-colors duration-200 sm:text-lg",
              "hover:bg-foreground/6",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              ouverte ? "rounded-[12px]" : "rounded-full",
            )}
          >
            <ChevronUp
              aria-hidden
              className={cn(
                "size-5 shrink-0 transition-transform duration-300",
                ouverte && "rotate-180",
              )}
            />
            {/* Le libellé est de Rémy, à sa troisième formulation : « 1 sur 3 »,
                qui disait où on en est, puis « Liste des tâches à remplir », qui
                nommait l'objet, puis celui-ci, qui dit à quoi ça sert. */}
            À regarder avant votre rendez-vous
          </motion.button>
        </motion.div>
      </div>

    </div>
  );
}

/**
 * Une tâche.
 *
 * **`aria-pressed` et non `role="checkbox"`** : c'est un bouton qui bascule, et
 * un lecteur d'écran annonce alors « activé » ou « non activé » sans qu'on ait à
 * simuler une case à la main.
 *
 * **La case et le V occupent la même place**, donc la ligne ne change pas de
 * hauteur quand on coche.
 *
 * **La coche n'est pas le seul signe.** Le fond change en même temps, et la case
 * vide devient une coche pleine : quelqu'un qui distingue mal le vert lit quand
 * même la différence.
 *
 * **La ligne n'est pas un bouton, elle en contient un.** La case se coche, le
 * lien « Voir » navigue, et ce sont deux gestes différents : les fondre dans un
 * seul élément cliquable obligerait à deviner lequel on voulait.
 *
 * **Elle est une pilule qui ne se montre qu'au survol**, sur demande de Rémy,
 * qui cite les menus d'Apple. Une tâche faite, elle, porte son fond vert en
 * permanence : c'est un état, pas un survol.
 */
function Tache({
  texte,
  ancre,
  faite,
  onClick,
  onVoir,
  className,
}: {
  texte: string;
  ancre: string;
  faite: boolean;
  onClick: () => void;
  onVoir: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[12px] pr-2.5 transition-colors duration-200",
        /* Le survol révèle la pilule, comme dans un menu d'Apple. **Et le
           clavier aussi** : `has-[:focus-visible]` la montre quand on atteint la
           case ou le lien à la tabulation, sans quoi on se déplacerait dans une
           liste qui ne dit pas où on est.

           `foreground/6` plutôt qu'une couleur : c'est l'encre du thème à six
           pour cent, donc ça marche sur les deux sans qu'on écrive deux
           valeurs. */
        faite
          ? "bg-[var(--tache-faite)] text-white"
          : "text-foreground hover:bg-foreground/6 has-[:focus-visible]:bg-foreground/6",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={faite}
        className={cn(
          /* **Une seule ligne à partir de `sm`**, sur demande de Rémy, et le
             panneau prend alors la largeur de la plus longue. En dessous, le
             texte s'enroule : « Regarder les témoignages dans lesquels vous
             pouvez vous identifier » demande plus de quatre cents pixels dans
             cette police, et un `nowrap` sans borne ferait déborder la page,
             ce que ce dépôt a déjà payé une fois. */
          "titre flex min-w-0 flex-1 items-start gap-3 rounded-[12px] px-3.5 py-3 text-left text-[0.9375rem] leading-snug sm:items-center sm:text-base sm:whitespace-nowrap",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mt-px grid size-5 shrink-0 place-items-center rounded-[5px] sm:mt-0",
            faite ? "bg-white/20" : "border-2 border-foreground/25",
          )}
        >
          {faite ? (
            /* `scale` et non `transform` : Tailwind v4 pose les échelles sur la
               propriété `scale`. La coche arrive donc en grossissant, avec un
               ressort court : c'est une action qu'on vient de faire, et le
               geste doit se sentir. */
            <Check className="size-4 animate-[apparait-coche_320ms_cubic-bezier(0.34,1.56,0.64,1)_both] text-white" />
          ) : null}
        </span>

        <span>{texte}</span>
      </button>

      {/* **Un lien et non un bouton** : ça navigue, donc le clic du milieu,
          l'ouverture dans un onglet et le survol qui montre la destination
          doivent marcher. C'est la règle du dépôt, et c'est aussi ce qui
          interdit de le loger *dans* le bouton de la case : un lien à
          l'intérieur d'un bouton est du HTML invalide, et les deux se
          disputeraient le clic.

          L'ancre désigne une section de cette page : ce n'est pas une sortie de
          tunnel.

          **Le panneau se referme au clic**, sinon il recouvrirait justement ce
          qu'on vient de demander à voir. */}
      <a
        href={`#${ancre}`}
        onClick={onVoir}
        className={cn(
          "shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          faite
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-accent text-foreground hover:bg-foreground/10",
        )}
      >
        Voir
      </a>
    </div>
  );
}
