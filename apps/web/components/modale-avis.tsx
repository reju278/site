"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * Le nom que la carte et le panneau partagent le temps de la bascule.
 *
 * **Un seul nom pour les vingt-deux cartes, et il le faut.** Deux éléments
 * rendus en même temps ne peuvent pas porter le même nom de transition : le
 * navigateur abandonne l'animation et n'en dit rien. Il n'est donc jamais posé
 * dans le JSX, mais sur le seul élément concerné, juste avant la capture, et
 * retiré aussitôt après. Une fenêtre étant ouverte à la fois, un nom suffit.
 */
const NOM_BASCULE = "carte-entretien";

/**
 * Enveloppe un changement d'état dans une transition de vue.
 *
 * **La transition n'existe que si le navigateur la connaît et si personne n'a
 * demandé moins de mouvement.** Dans les deux cas contraires, l'état change
 * normalement : la fenêtre s'ouvre et se ferme comme avant, sans rien de cassé.
 *
 * `flushSync` n'est pas une précaution : le navigateur capture l'état d'arrivée
 * dès que la fonction rend la main. Une mise à jour React différée, qui est le
 * cas normal, arriverait après la capture, et la transition animerait deux fois
 * la même image.
 */
function basculer(sens: "ouvre" | "ferme", changer: () => void) {
  const racine = document.documentElement;
  const possible =
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!possible) {
    changer();
    return;
  }

  /* Le sens est lu par `globals.css` pour choisir de quel côté la carte pivote.
     Il est posé sur la racine parce que les pseudo-éléments de transition
     n'appartiennent à aucun élément de la page : ils sont les enfants de
     `:root`, et c'est le seul endroit d'où on peut les atteindre. */
  racine.dataset.bascule = sens;
  const transition = document.startViewTransition(() => {
    flushSync(changer);
  });

  /* **La transition peut être refusée, et ce n'est pas un cas d'école.** Un
     navigateur la jette si le document est caché, si une autre est déjà en
     cours, ou si deux éléments portent le même nom. Dans tous ces cas, le
     changement d'état a **déjà eu lieu** : `flushSync` s'est exécuté avant le
     refus, donc la fenêtre s'ouvre normalement et il ne manque que l'animation.

     Le `catch` n'avale donc rien d'utile, il évite seulement une promesse
     rejetée sans preneur dans la console. */
  void transition.finished
    .catch(() => {})
    .finally(() => {
      delete racine.dataset.bascule;
    });
}

/**
 * L'entretien d'un membre, ouvert dans une fenêtre au milieu de la page.
 *
 * **C'est la règle du tunnel appliquée à la galerie**, sur demande de Rémy :
 * sur `/resultats`, la carte d'un entretien mène à sa page ; ici, la même carte
 * ouvre l'entretien sur place. Personne ne quitte `/immersion`.
 *
 * **Le contenu est rendu par le serveur et passé en `children`.** Ce composant
 * ne tient que l'ouverture : il ne connaît ni l'article, ni la vidéo, ni les
 * citations. C'est ce qui garde `avis.ts`, ses cinq cents kilooctets, hors du
 * paquet JavaScript de la page. Écrit autrement, la fenêtre aurait fait voyager
 * quatorze articles dans le script en plus du HTML.
 *
 * **Le contenu est monté avec la fenêtre et démonté avec elle.** `Dialog` de
 * Radix ne rend son contenu que lorsqu'il est ouvert : les quatorze articles
 * sont dans la charge utile de la page, mais un seul est dans le DOM à la fois,
 * et surtout **un seul lecteur Wistia peut exister**. Quatorze lecteurs montés
 * d'avance, c'est le défaut que la page source avait et que le dépôt refuse.
 *
 * **La fermeture démonte la vidéo**, ce qui coupe le son. C'est le même choix
 * que `LecteurVideo` fait avec sa propriété `actif` dans le carrousel : plus
 * radical qu'un appel à l'API de Wistia, et il ne dépend d'aucun script tiers.
 *
 * **Le voile porte le flou de six pixels du projet.** Le composant de registre
 * arrive sans, alors que `sheet.tsx` l'a : c'est exactement ce que `AGENTS.md`
 * annonce, un `shadcn add` qui écrase ce qui est à nous. Rendu dans
 * `packages/ui/src/components/dialog.tsx`.
 *
 * **Le titre et la description sont obligatoires**, même invisibles. Radix
 * avertit en console quand une fenêtre n'a pas de `DialogTitle`, et surtout un
 * lecteur d'écran annoncerait une fenêtre sans dire laquelle. Ils sont donc
 * posés ici, en `sr-only` quand le contenu porte déjà son propre titre à
 * l'écran.
 */
export function ModaleAvis({
  declencheur,
  titre,
  description,
  children,
}: {
  /** La carte de la galerie, qui ouvre la fenêtre. */
  declencheur: React.ReactNode;
  /** Le nom accessible de la fenêtre. */
  titre: string;
  /** Ce que la fenêtre contient, pour un lecteur d'écran. */
  description: string;
  children: React.ReactNode;
}) {
  const [ouverte, setOuverte] = useState(false);
  const carte = useRef<HTMLDivElement>(null);

  /**
   * **La carte se retourne et devient la fenêtre**, sur demande de Rémy.
   *
   * Le navigateur fait tout le travail : il photographie la carte, laisse React
   * remplacer le DOM, photographie le panneau, puis anime la première image vers
   * la seconde. Comme les deux portent le même nom, il les traite comme un seul
   * objet qui change de place, de taille et de contenu : c'est ce qui donne la
   * carte qui vient au milieu de l'écran. Le demi-tour, lui, est ajouté en CSS.
   *
   * **Rien de tout cela ne pèse sur la page** : aucune bibliothèque, aucune
   * mesure en JavaScript, aucune image calculée. C'est la même mécanique que la
   * bascule de thème du site.
   *
   * **Le nom se pose et se retire dans la même fonction.** À l'ouverture, la
   * carte le porte pour la photo de départ et le rend avant la photo d'arrivée,
   * que le panneau prend. À la fermeture, l'inverse.
   */
  const changer = (veutOuvrir: boolean) => {
    const el = carte.current;
    if (!el) {
      setOuverte(veutOuvrir);
      return;
    }

    if (veutOuvrir) el.style.viewTransitionName = NOM_BASCULE;

    basculer(veutOuvrir ? "ouvre" : "ferme", () => {
      setOuverte(veutOuvrir);
      el.style.viewTransitionName = veutOuvrir ? "" : NOM_BASCULE;
    });

    if (!veutOuvrir) {
      /* La carte reprend son nom le temps de l'arrivée, puis le rend : laissé
         en place, il se heurterait aux vingt et un autres à la bascule
         suivante. */
      void Promise.resolve().then(() => {
        window.setTimeout(() => {
          el.style.viewTransitionName = "";
        }, 700);
      });
    }
  };

  return (
    <Dialog open={ouverte} onOpenChange={changer}>
      {/* `asChild` : le déclencheur est la carte entière, et on ne veut pas
          d'un bouton dans un bouton. Radix pose alors ses attributs sur
          l'élément qu'on lui donne. */}
      {/* Le `div` n'est pas une couche de plus pour rien : c'est lui qui porte
          le nom de transition. Posé sur la carte elle-même, qui est un bouton
          inclinable en 3D, il aurait photographié un objet déjà tourné. */}
      <div ref={carte}>
        <DialogTrigger asChild>{declencheur}</DialogTrigger>
      </div>

      <DialogContent
        /* **La croix part, un bouton « Retour » la remplace**, sur demande de
           Rémy, et il est **en dehors du panneau** : centré, au-dessus de lui.

           `DialogContent` cesse donc d'être le panneau pour devenir le cadre
           qui porte les deux : le panneau, puis le bouton. Il perd son fond, son
           filet, son ombre et son rembourrage, qui appartiennent maintenant au
           panneau, et il ne rogne rien, sans quoi le bouton posé au-dessus
           serait coupé.

           **`max-h-[82dvh]` et non 90.** La fenêtre était centrée sur 90 % de la
           hauteur visible : il ne restait que 5 % en dessous, soit une
           quarantaine de pixels sur un téléphone, pour un bouton qui en fait
           trente-six plus son écart. À 82, il reste 9 %, et le bouton tient.
           `dvh` et non `vh` : sur un téléphone, `vh` ignore la barre d'adresse.

           `sm:max-w-4xl`, élargi sur demande de Rémy. La mesure du texte, elle,
           est bornée plus bas par le bloc de l'article. */
        showCloseButton={false}
        className="max-h-none max-w-[calc(100%-2rem)] gap-3 border-0 bg-transparent p-0 shadow-none sm:max-w-4xl"
      >
        {/* Le titre et la description, pour la fenêtre elle-même. Le contenu
            porte son propre titre visible, donc ceux-ci ne sont lus que par les
            lecteurs d'écran : les afficher les dirait deux fois. */}
        <DialogTitle className="sr-only">{titre}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        {/* Le panneau. C'est lui qui porte le rayon, le fond et le rognage.

            **La fenêtre ne défile plus elle-même.** Sa barre de défilement
            courait sur l'angle arrondi de quarante pixels, qui la coupait en
            haut et en bas : c'est le défaut que Rémy a vu. Le rayon et le
            rognage vivent donc ici, et le défilement sur le bloc intérieur qui,
            lui, n'a pas d'angles.

            **Le rayon est `--rayon-jonction`, celui de l'accueil**, sur décision
            de Rémy. C'est une quatrième famille pour ce jeton, après les deux
            lèvres de l'accueil et la carte du pied de page, et elle est écrite
            dans `AGENTS.md`. Le raisonnement est celui de la carte du pied de
            page : le panneau fait presque toute la largeur de l'écran, et c'est
            l'objet qu'on regarde, pas un bouton qu'on vise. */}
        <div
          style={{ viewTransitionName: NOM_BASCULE }}
          className="overflow-hidden rounded-[var(--rayon-jonction)] border border-border bg-background shadow-lg"
        >
          {/* **Un lien d'ancre ferme la fenêtre avant de sauter.**

              C'est la réparation d'un vrai défaut, trouvé en cliquant : les
              articles se citent entre eux, et `versImmersion` transforme ces
              renvois en ancres vers le lecteur de la personne, plus bas sur la
              page. Sans ce gestionnaire, le navigateur sautait bien à l'ancre,
              mais **derrière la fenêtre restée ouverte** : on ne voyait rien
              bouger, et le seul effet visible était la barre de défilement de la
              page qui se déplaçait sous le voile.

              Le clic est écouté ici, sur le conteneur, et non posé sur chaque
              lien : les liens sont rendus par le serveur, à l'intérieur de
              `TexteLie`, et leur passer un gestionnaire demanderait de rendre
              tout l'article côté client. Un seul écouteur au-dessus règle le
              cas, y compris pour les liens qu'on ajoutera plus tard.

              On ne bloque rien : on ferme, et le navigateur fait le saut. */}
          <div
            className="max-h-[82dvh] overflow-y-auto"
            onClick={(evenement) => {
              const cible = (evenement.target as HTMLElement).closest("a");
              if (cible?.getAttribute("href")?.startsWith("#")) {
                setOuverte(false);
              }
            }}
          >
            {children}
          </div>
        </div>

        {/* Le bouton de fermeture, en pilule de verre, centré **sous** le
            panneau, sur demande de Rémy : il était au-dessus et s'appelait
            « Retour ».

            Sa place est celle où l'on arrive : on ferme une fenêtre quand on a
            fini de lire, et on finit de lire en bas. Au-dessus, il fallait
            remonter tout l'article pour l'atteindre.

            **C'est une cinquième exception au « flou va derrière, jamais
            devant »**, et elle est écrite dans `AGENTS.md`. Elle se justifie
            comme les capsules de l'en-tête : ce bouton flotte au-dessus du
            contenu de la page, flouté par le voile, et c'est le verre qui le
            fait tenir sur un fond dont on ne sait rien.

            `rounded-full` : une pilule n'a pas d'angle, donc la règle des 5 px
            ne la concerne pas. C'est la forme des gélules du hero.

            `min-h-9` et non `h-9` : un libellé qui passerait à deux lignes
            serait rogné par une hauteur fixe. */}
        <DialogClose asChild>
          <button
            type="button"
            className="group/roule mx-auto inline-flex min-h-9 items-center gap-2 rounded-full bg-card/85 px-4 text-sm font-semibold text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.10)] ring-1 ring-border ring-inset backdrop-blur-md transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X aria-hidden className="size-4 shrink-0" />
            Fermer
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
