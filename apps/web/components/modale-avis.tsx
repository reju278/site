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
import { useState } from "react";

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

  return (
    <Dialog open={ouverte} onOpenChange={setOuverte}>
      {/* `asChild` : le déclencheur est la carte entière, et on ne veut pas
          d'un bouton dans un bouton. Radix pose alors ses attributs sur
          l'élément qu'on lui donne. */}
      <DialogTrigger asChild>{declencheur}</DialogTrigger>

      <DialogContent
        /* **La croix part, un bouton « Retour » la remplace**, sur demande de
           Rémy, et il est **en dehors du panneau** : centré, au-dessus de lui.

           `DialogContent` cesse donc d'être le panneau pour devenir le cadre
           qui porte les deux : le panneau, puis le bouton. Il perd son fond, son
           filet, son ombre et son rembourrage, qui appartiennent maintenant au
           panneau, et il ne rogne rien, sans quoi le bouton posé au-dessus
           serait coupé.

           **La fenêtre prend toute la hauteur**, sur demande de Rémy, et la
           marge qui reste est comptée et non choisie : le bouton « Fermer »
           fait 36 px, son écart au panneau 12, et on laisse 12 px au-dessus et
           en dessous de l'ensemble. Le panneau vaut donc la hauteur de l'écran
           moins 72. Tout ce qui est repris là est de la place rendue à la
           vidéo.

           Les proportions rondes, 82 % puis 90, ne valaient rien ici : ce
           qu'on doit loger sous le panneau est un bouton, et un bouton a une
           hauteur en pixels, pas en pourcentage d'écran. Sur un téléphone,
           9 % faisaient une quarantaine de pixels ; sur un grand écran, une
           centaine, c'est-à-dire soixante de perdus.

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
        <div className="overflow-hidden rounded-[var(--rayon-jonction)] border border-border bg-background shadow-lg">
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
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto"
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
