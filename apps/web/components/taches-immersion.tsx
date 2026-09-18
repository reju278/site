"use client";

import { tachesImmersion } from "@/contenu/immersion";
import { cn } from "@repo/ui/lib/utils";
import { surligner } from "@/lib/surligner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Ring } from "@repo/ui/components/charts/ring";
import { RingChart } from "@repo/ui/components/charts/ring-chart";
import { ArrowRight, Check } from "lucide-react";
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

  /* Le compte se calcule, il ne s'écrit pas : c'est la règle du dépôt sur les
     textes qui comptent leurs éléments. */
  const finies = faites.length;
  const total = tachesImmersion.length;

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
    /* **`sticky` et non `fixed`, et c'est ce qui la fait s'arrêter au-dessus du
       pied de page**, sur demande de Rémy : la marque du bas était recouverte.
       Une barre `fixed` ne connaît que la fenêtre ; une barre `sticky` connaît
       son conteneur, et celui-ci finit là où le pied commence. Elle colle donc
       à seize pixels du bas tant qu'il reste de la page, puis se pose à sa place
       naturelle, juste au-dessus de la marque. Aucun JavaScript, aucun seuil à
       régler, et rien à tenir d'accord le jour où le pied change de hauteur.

       **Le conteneur est de hauteur nulle et la barre se dessine au-dessus de
       lui**, `absolute bottom-0` : sans ça, il pousserait le pied de page de
       cent pixels vers le bas pour loger quelque chose qui flotte.

       Elle vit donc dans le flux, entre le contenu et le pied : voir
       `layout.tsx`. */
    <div
      data-taches
      className="pointer-events-none sticky bottom-4 z-40 h-0 sm:bottom-5"
    >
      <div className="absolute inset-x-0 bottom-0 px-4">
      {/* **Un seul objet et non deux**, sur demande de Rémy : « il ne faut pas
          qu'il y ait deux éléments séparés, c'est ce menu-là qui s'étend ». Le
          déclencheur et la liste vivaient dans deux boîtes de verre posées l'une
          au-dessus de l'autre ; il n'y en a plus qu'une, qui grandit.

          **L'ouverture est celle de l'`Accordion` du dépôt, pas une animation
          écrite ici**, et c'est une correction : la version précédente animait
          la boîte avec `layout` de Motion, qui mesure l'avant et l'après et
          interpole en déformant tout ce qu'elle contient. Rémy l'a trouvée
          « buggée », et il avait raison : pendant la transition, le texte et les
          cases sont mis à l'échelle, donc flous et de travers. `Accordion`
          n'anime que la **hauteur**, depuis une variable que Radix mesure,
          `--radix-accordion-content-height`, et rien à l'intérieur ne bouge.
          C'était déjà dans `packages/ui` ; il n'y avait rien à écrire.

          **`flex-col-reverse` est ce qui la fait s'ouvrir vers le haut.** Un
          accordéon pousse son contenu sous son déclencheur ; ici le cadre est
          posé en bas de l'écran, donc l'ordre visuel est inversé et c'est la
          liste qui monte pendant que le bouton reste où il est. L'ordre du DOM,
          lui, ne change pas : le déclencheur précède ce qu'il commande.

          **Pas de filets, un rembourrage et des pilules dedans**, sur sa demande
          aussi, qui cite les menus d'Apple : chaque tâche est une pilule qui ne
          se montre qu'au survol.

          **Le rayon intérieur se calcule, il ne se choisit pas** : 18 px au
          cadre moins 6 px de rembourrage font 12 px, et c'est à ce prix que les
          deux courbes restent concentriques. Fermé, le cadre est une gélule et
          son contenu aussi. */}
      <Accordion
        type="single"
        collapsible
        value={ouverte ? "taches" : ""}
        onValueChange={(v) => setOuverte(v === "taches")}
        className="pointer-events-auto flex justify-center"
      >
        <AccordionItem
          value="taches"
          className={cn(
            VERRE,
            /* **Un bloc et non un conteneur flex.** L'accordéon anime la
               hauteur de son contenu ; dans un conteneur flex, cette hauteur
               est renégociée par la mise en page à chaque image, et la courbe
               s'en trouve hachée. Le contenu est donc écrit avant le
               déclencheur, dans l'ordre où on les voit, et c'est le flux normal
               qui les empile. */
            "relative w-max max-w-[calc(100vw-2rem)] p-1.5",
            /* **`last:border-b` et non `border-b`**, et c'est une réparation.
               Le fichier de registre pose `last:border-b-0` sur l'item, ce qui
               a du sens dans une pile d'accordéons et aucun sur un panneau
               seul : notre cadre de verre se retrouvait bordé sur trois côtés.
               `cn()` ne voyait pas le conflit, une variante et une classe nue
               étant deux groupes distincts pour lui, donc la classe du registre
               gagnait. C'est le piège que ce dépôt décrit déjà à propos de
               `dark:`, et il se répare de la même façon : on double la classe
               **dans la même variante**. */
            "last:border-b",
            /* **Le rayon ne change pas**, sur demande de Rémy : « arrête de
               toucher aux bordures quand le truc s'ouvre ». Il passait de la
               gélule au panneau pendant l'ouverture, ce qui faisait un second
               mouvement par-dessus celui de la hauteur, et deux gestes
               simultanés sur le même objet se contrarient.

               28 px vaut la moitié des 56 px du bouton fermé : c'est donc
               exactement la gélule qu'il avait à l'état fermé, en valeur fixe,
               et c'est aussi un rayon normal pour un panneau de quatre cent
               soixante pixels. Il ne dépend plus de la hauteur, donc il ne bouge
               plus quand elle s'anime.

               **Et surtout, `rounded-full` ne pouvait pas rester** : il vaut la
               moitié de la hauteur, donc il suivait l'animation image par image
               même sans transition. */
            "rounded-[28px]",
          )}
        >
          {/* **Le gabarit de largeur.**

              Le cadre est en `w-max` : il prend la largeur de son contenu le
              plus large. Fermé, c'est le déclencheur ; ouvert, c'est la plus
              longue tâche ; et une tâche cochée perd son surlignage, donc ses
              douze pixels de rembourrage. La largeur du bloc changeait donc à
              l'ouverture **et** à chaque coche, ce que Rémy a vu comme un
              décalage latéral.

              Ce gabarit rend la liste dans son état le plus large, toutes
              tâches décochées, et il ne quitte jamais le flux : il fixe la
              largeur une fois pour toutes. `h-0` et `overflow-hidden` le
              rendent invisible sans le sortir du calcul, ce qu'un `hidden`
              ferait. `aria-hidden` et `inert` le retirent du clavier et des
              lecteurs d'écran : c'est une copie muette, pas un second menu. */}
          <div
            aria-hidden
            inert
            className="pointer-events-none h-0 overflow-hidden"
          >
            <ul className="flex flex-col gap-0.5">
              {tachesImmersion.map((tache) => (
                <li key={tache.id} className="flex">
                  <Tache
                    texte={tache.texte}
                    surligne={tache.surligne}
                    ancre={tache.ancre}
                    faite={false}
                    onClick={() => {}}
                    onVoir={() => {}}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* **La durée et la courbe sont reprises**, et c'est ce qui restait à
              réparer. Le fichier de registre anime sur 200 ms en `ease-out`,
              une courbe qui atteint la moitié du mouvement en vingt-cinq
              millisecondes : la liste bondit puis traîne, ce que Rémy a décrit
              comme un bug. Mesuré image par image avant de conclure, plutôt que
              regardé.

              **Et la courbe du dépôt ne convenait pas non plus, mesuré image
              par image.** `cubic-bezier(0.32, 0.72, 0, 1)`, celle des entrées
              d'`Apparition`, atteint 85 % du mouvement en 20 % du temps : sur
              une translation de dix pixels, ça se lit comme de la vivacité ; sur
              une hauteur de deux cents, la liste bondit de cent cinq pixels en
              **quatre millisecondes** puis rampe pendant trois cents. C'est
              exactement ce que Rémy voyait, et aucune de mes deux premières
              tentatives ne l'avait corrigé parce que je n'avais relevé qu'une
              image sur trois.

              La courbe est donc `ease-in-out`, `cubic-bezier(0.4, 0, 0.2, 1)`,
              qui est le jeton de Tailwind et non une valeur trouvée au jugé :
              elle passe le quart du mouvement au cinquième du temps et la moitié
              à la moitié. La durée est de 260 ms.

              **En `style` et non en classe** : `animate-accordion-down` pose la
              propriété raccourcie `animation`, qui réinitialise la durée et la
              courbe. Une classe utilitaire jouerait à qui vient en dernier dans
              la feuille ; un style en ligne gagne à tous les coups, et il ne
              touche pas au fichier de registre. */}
          <AccordionContent
            className="pt-0 pb-0.5"
            style={{
              animationDuration: "260ms",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ul className="flex flex-col gap-0.5">
              {tachesImmersion.map((tache) => (
                <li key={tache.id} className="flex">
                  <Tache
                    texte={tache.texte}
                    surligne={tache.surligne}
                    ancre={tache.ancre}
                    faite={faites.includes(tache.id)}
                    onClick={() => basculer(tache.id)}
                    onVoir={() => setOuverte(false)}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </AccordionContent>
          <AccordionTrigger
            className={cn(
              /* **La police des titres**, sur demande de Rémy, avec sa hauteur
                 de ligne rendue : l'utilitaire `titre` pose 1,12, ce qui est
                 juste pour un titre de deux lignes et trop serré pour une ligne
                 de liste.

                 Le `py-4` et le `hover:underline` du fichier de registre sont
                 écrasés ici : c'est ce qu'un `className` a le droit de faire,
                 et c'est la raison pour laquelle on ne retouche pas le
                 fichier. */
              /* Le `gap-4` du fichier de registre est écrasé : sur téléphone,
                 seize pixels entre le libellé et l'avancement sont seize pixels
                 que le libellé n'a plus pour tenir sur une ligne. */
              "titre items-center gap-1.5 py-2 pr-2 pl-2.5 text-[13px] leading-normal text-foreground min-[360px]:whitespace-nowrap transition-colors duration-200 hover:no-underline sm:gap-2.5 sm:py-2 sm:pr-3 sm:pl-4 sm:text-lg",
              "hover:bg-foreground/6",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              /* Concentrique au cadre : 28 px moins les 6 px de rembourrage.
                 Il ne change pas non plus. */
              "rounded-[22px]",
            )}
          >
            {/* Le libellé est de Rémy, à sa troisième formulation : « 1 sur 3 »,
                qui disait où on en est, puis « Liste des tâches à remplir », qui
                nommait l'objet, puis celui-ci, qui dit à quoi ça sert. */}
            À regarder avant votre rendez-vous
            <Avancement finies={finies} total={total} />
          </AccordionTrigger>

        </AccordionItem>
      </Accordion>
      </div>
    </div>
  );
}

/**
 * L'anneau d'avancement, à droite du libellé.
 *
 * **C'est `RingChart` de Bklit**, sur demande de Rémy, qui a lui-même désigné ce
 * registre. C'est le seul des trois que le dépôt autorise pour un graphique, et
 * c'est bien ce dont il s'agit : un arc dont la longueur dit une proportion.
 * Rien n'est dessiné ici, ni le cercle, ni sa progression, ni son animation.
 *
 * **Le prix est réel et il faut le connaître avant d'étendre cet emploi.** Le
 * composant amène `@visx/group`, `@visx/shape`, `@visx/responsive` et Motion
 * dans le paquet client de la page. Pour un anneau de vingt-six pixels, c'est
 * cher ; ce qui le justifie ici, c'est la règle du dépôt, qui interdit de
 * redessiner à la main ce qu'un registre donne. Un second anneau sur le site ne
 * coûtera plus rien, un troisième non plus.
 *
 * **`size` est passé en dur**, sans quoi le composant lit la taille de son
 * parent : dans une ligne de texte, il n'y a pas de parent qui ait une taille à
 * lui.
 *
 * **Le compte est écrit à côté et non au centre.** `RingCenter` existe, mais à
 * vingt-six pixels de diamètre il n'y a de la place pour aucun chiffre lisible.
 * Le texte porte donc l'information, et l'anneau la répète : c'est le bon sens
 * de la règle sur la couleur seule, un indicateur graphique n'est jamais le seul
 * porteur.
 */
function Avancement({ finies, total }: { finies: number; total: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 sm:ml-1 sm:gap-2">
      <span aria-hidden className="grid size-5 place-items-center sm:size-[26px]">
        <RingChart
          data={[
            { label: "Tâches faites", value: finies, maxValue: total },
          ]}
          size={26}
          strokeWidth={4}
          baseInnerRadius={7}
          className="size-full"
          ringGap={0}
        >
          <Ring index={0} color="var(--tache-faite)" />
        </RingChart>
      </span>

      {/* `tabular-nums` : sans lui, le « 1 » est plus étroit que le « 2 » et le
          libellé se décale d'un pixel à chaque coche. */}
      <span className="text-[11px] tabular-nums sm:text-sm">
        {finies} sur {total}
      </span>
    </span>
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
  surligne,
  ancre,
  faite,
  onClick,
  onVoir,
  className,
}: {
  texte: string;
  surligne: readonly string[];
  ancre: string;
  faite: boolean;
  onClick: () => void;
  onVoir: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        /* **22 px et non 12**, et c'est le même calcul que pour le
           déclencheur : le cadre est à 28 px et son rembourrage à 6, donc une
           pilule posée dedans doit valoir 22 pour que les deux courbes soient
           parallèles. À 12, l'angle de la pilule et celui du cadre ne se
           suivaient pas, et c'est exactement ce qu'on voit en premier sur un
           coin. */
        "flex items-center gap-1 rounded-[22px] pr-1.5 transition-colors duration-200 sm:gap-2.5 sm:pr-2.5",
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
          /* **Une seule ligne à toutes les largeurs**, sur demande de Rémy, y
             compris sur téléphone. Elle ne tient que parce que trois choses se
             resserrent en dessous de `sm` : le corps du texte, les rembourrages
             et le bouton de droite, qui n'est plus qu'une flèche. Les mesures
             sont dans `AGENTS.md`, et elles sont serrées : c'est le prix de la
             ligne unique, pas un réglage confortable. */
          /* **Le corps et les rembourrages sont mesurés, pas choisis.** À
             375 px, la place pour le texte est de 245 pixels une fois la case,
             la flèche et les écarts retirés ; le plus long des trois libellés
             en demande 241 à douze pixels, surlignage compris. Il en demandait
             264 à treize, et débordait de neuf pixels sur la flèche. C'est
             serré, et c'est le prix de la ligne unique que Rémy a demandée : le
             libellé suivant qui s'allonge ne tiendra plus.

             **Et la ligne unique a une borne basse, mesurée elle aussi.** À
             320 px, les deux premiers libellés débordent de trente-cinq et
             vingt-trois pixels sur la flèche, et **le document se met à défiler
             latéralement**, ce que ce dépôt interdit. En dessous de 360 px, le
             texte s'enroule donc sur deux lignes. C'est la règle du dépôt sur
             `whitespace-nowrap`, qui ne s'écrit jamais sans borne : ici la borne
             est en bas plutôt qu'en haut, parce que c'est le petit écran qui
             manque de place. */
          "titre flex min-w-0 flex-1 items-center gap-1.5 rounded-[22px] py-3 pr-2 pl-2 text-left text-xs leading-snug [&_mark]:px-1 min-[360px]:whitespace-nowrap sm:gap-3 sm:py-3 sm:pr-3.5 sm:pl-3.5 sm:text-base sm:[&_mark]:px-1.5",
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

        {/* **Le passage important porte le trait de surligneur du site**, sur
            demande de Rémy, et c'est le contenu qui dit lequel. Une tâche faite
            ne le porte plus : sur le vert plein, un jaune à un tiers ne
            surligne plus rien, il salit. */}
        <span>{faite ? texte : surligner(texte, surligne)}</span>
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
        /* Le libellé est écrit en toutes lettres à partir de `sm` ; en dessous,
           c'est une flèche, et c'est ce qui rend la ligne unique possible. Une
           icône seule porte toujours son nom accessible : la règle du dépôt. */
        aria-label={`Voir : ${texte}`}
        className={cn(
          "grid shrink-0 place-items-center rounded-md transition-colors",
          "size-7 sm:size-auto sm:px-3 sm:py-1.5 sm:text-sm sm:font-semibold",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          faite
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-accent text-foreground hover:bg-foreground/10",
        )}
      >
        <ArrowRight aria-hidden className="size-4 sm:hidden" />
        <span aria-hidden className="hidden sm:inline">
          Voir
        </span>
      </a>
    </div>
  );
}
