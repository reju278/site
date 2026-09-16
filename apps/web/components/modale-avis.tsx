"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
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
        /* **La fenêtre défile, la page derrière ne défile plus.** Radix bloque
           le défilement du corps ; sans `overflow-y-auto` ici, un article de
           trois mille mots serait simplement coupé.

           `max-h-[90dvh]` et non `90vh` : sur un téléphone, `vh` ignore la
           barre d'adresse, et le bas de la fenêtre passait sous elle. `dvh`
           suit la hauteur réellement visible.

           `sm:max-w-3xl` : c'est la mesure d'un texte qui se lit, la même que
           l'article de `/resultats`. Une fenêtre pleine largeur donnerait des
           lignes de cent quarante caractères. */
        className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-3xl"
      >
        {/* Le titre et la description, pour la fenêtre elle-même. Le contenu
            porte son propre titre visible, donc ceux-ci ne sont lus que par les
            lecteurs d'écran : les afficher les dirait deux fois. */}
        <DialogTitle className="sr-only">{titre}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

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
            tout l'article côté client. Un seul écouteur au-dessus règle le cas,
            y compris pour les liens qu'on ajoutera plus tard.

            On ne bloque rien : on ferme, et le navigateur fait le saut. */}
        <div
          onClick={(evenement) => {
            const cible = (evenement.target as HTMLElement).closest("a");
            if (cible?.getAttribute("href")?.startsWith("#")) setOuverte(false);
          }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
