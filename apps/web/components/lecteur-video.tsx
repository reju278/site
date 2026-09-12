"use client";

import { cn } from "@repo/ui/lib/utils";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Un lecteur vidéo Wistia, habillé par nous.
 *
 * L'iframe est servie depuis `fast.wistia.net`, donc d'une autre origine :
 * aucune de nos feuilles de style n'atteint son intérieur, et le lecteur
 * employé (E-v1) n'expose ni `::part` ni variable CSS. La seule chose qu'on
 * choisit à l'intérieur est `playerColor`, réglée sur le bleu de la marque.
 *
 * On habille donc **l'état que les gens regardent réellement**. Une vidéo passe
 * l'essentiel de sa vie à l'arrêt : ce qu'on voit, c'est une affiche et un
 * bouton, et ceux-là sont à nous. Le lecteur de Wistia n'apparaît qu'une fois
 * la lecture demandée.
 *
 * Deux effets de bord, tous deux souhaitables :
 *
 * - **Le poids.** Une iframe Wistia charge environ 505 Ko de JavaScript même si
 *   personne ne joue. Sur une page qui en affiche seize, cela déciderait du
 *   sort de la page. Ici, rien ne part avant le clic.
 * - **La vie privée.** Aucun contact avec un serveur tiers, aucune écriture
 *   dans le stockage local, tant que la personne n'a rien demandé.
 *
 * Le suivi d'audience de Wistia n'est pas désactivé : il alimente les
 * statistiques de Rémy, et le couper est une décision commerciale.
 */

/** Les options passées au lecteur, écrites ici et non laissées au compte. */
const OPTIONS = new URLSearchParams({
  // Répétée explicitement : elle est déjà enregistrée côté Wistia, mais un
  // réglage de compte qui change ne doit pas repeindre le site en silence.
  playerColor: "045ee6",
  // La lecture démarre parce qu'on vient de la demander, jamais toute seule.
  autoPlay: "true",
  // Rend transparent le fond que le lecteur peint lui-même dans l'iframe. Sans
  // cela il dessine un liseré clair tout autour de l'image, qu'aucune de nos
  // feuilles ne peut atteindre. Va nécessairement avec le fond noir du cadre.
  wmode: "transparent",
  // Sur téléphone, rester dans la page plutôt que de basculer en plein écran.
  playsinline: "true",
  // Retire la surcouche « copier le lien », qui ajoute un bouton dans un coin.
  copyLinkAndThumbnailEnabled: "false",
  // À la fin, revenir à l'affiche plutôt que de figer la dernière image.
  endVideoBehavior: "reset",

  /* Les commandes du lecteur, demandées **explicitement**.
   *
   * Elles sont réglées côté compte Wistia, donc elles peuvent y être coupées
   * sans que ce dépôt en sache rien : la vidéo se lançait alors sans barre de
   * lecture, sans son réglable et sans plein écran, et rien dans le code ne
   * l'expliquait. Les écrire ici, c'est refuser qu'un réglage distant décide
   * de ce que le site propose.
   *
   * C'est la même raison que `playerColor` juste au-dessus, et le même risque :
   * un réglage de compte qui change ne doit pas modifier le site en silence. */
  controlsVisibleOnLoad: "true",
  playbar: "true",
  volumeControl: "true",
  fullscreenButton: "true",
  settingsControl: "true",
  smallPlayButton: "true",
});

/** « 981 » devient « 16:21 ». */
export function duree(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = Math.round(secondes % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LecteurVideo({
  id,
  titre,
  secondes,
  affiche,
  afficheMobile,
  legende,
  actif = true,
  className,
}: {
  id: string;
  titre: string;
  secondes: number;
  affiche: string;
  /** Une seconde source, plus légère, pour les écrans étroits. */
  afficheMobile?: string;
  /**
   * Un bloc posé en bas de l'affiche, sur un voile qui garantit son contraste.
   *
   * Il est rendu **dans** le bouton, donc il ne doit contenir que du contenu
   * de phrase, des `span`, et aucun élément interactif : un bouton dans un
   * bouton est du HTML invalide et donnerait deux cibles au clavier.
   */
  legende?: React.ReactNode;
  /**
   * `false` remet le lecteur à son affiche et **coupe la lecture**.
   *
   * C'est ce qui empêche une vidéo de continuer à parler quand on passe au
   * témoignage suivant. La coupure passe par le démontage de l'iframe et non
   * par l'API de Wistia : c'est plus radical, ça ne dépend d'aucun script
   * tiers, et ça rend au passage la mémoire du lecteur.
   */
  actif?: boolean;
  className?: string;
}) {
  const [lance, setLance] = useState(false);

  useEffect(() => {
    if (!actif) setLance(false);
  }, [actif]);

  return (
    <div
      className={cn(
        // Fond noir et non `bg-card` : le rapport 16/9 du cadre et celui de la
        // vidéo ne tombent jamais au pixel près, et le cheveu qui reste
        // laisserait voir la couleur du thème tout autour de l'image.
        // Le rayon est celui du reste du site, 5 px : une vidéo est un objet
        // qu'on regarde de près, pas une jonction pleine largeur.
        // Le rapport est toujours 16/9, celui dans lequel Wistia sert ses
        // vidéos. Un cadre de 2,4/1 a été essayé pour masquer les bandes
        // noires des enregistrements ; Rémy a tranché pour le 16/9.
        "relative isolate aspect-16/9 overflow-hidden rounded-md bg-black",
        className,
      )}
    >
      {lance ? (
        // L'iframe déborde de trois pixels de chaque côté, et `overflow-hidden`
        // coupe ce qui dépasse.
        //
        // C'est un contournement, assumé comme tel. Trois mesures ont établi
        // d'où vient le liseré clair : le cadre et l'iframe ont exactement les
        // mêmes dimensions, avec zéro écart des quatre côtés ; en colorant le
        // cadre en rouge vif, aucun rouge n'apparaît, donc l'iframe le couvre
        // entièrement ; et en ouvrant l'URL de l'iframe en page principale, où
        // elle cesse d'être d'une autre origine, on voit que le lecteur peint
        // lui-même cette zone. Le faire déborder est la seule prise qui reste.
        //
        // Le prix est un rognage de moins d'un pour cent de l'image.
        <iframe
          src={`https://fast.wistia.net/embed/iframe/${id}?${OPTIONS}`}
          title={titre}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute -inset-[3px] size-[calc(100%+6px)] border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLance(true)}
          // Le libellé porte le titre et la durée : on décide de lancer une
          // vidéo de seize minutes autrement qu'une de trente secondes.
          aria-label={`Lire la vidéo, ${titre}, ${duree(secondes)}`}
          className="group absolute inset-0 cursor-pointer"
        >
          {/* L'image zoome au survol. C'est elle qui bouge, pas le cadre :
              `overflow-hidden` sur le parent la recadre, ce qui donne un
              mouvement contenu au lieu d'un bloc qui pousse ses voisins. */}
          <picture>
            {afficheMobile ? (
              <source media="(min-width: 768px)" srcSet={affiche} />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afficheMobile ?? affiche}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="size-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </picture>

          {/* Le voile global a disparu, sur décision de Rémy : il ternissait
              l'affiche, et c'est elle qu'on est venu regarder.

              Il portait un vrai rôle et il a fallu le remplacer, pas
              seulement le retirer. Il assombrissait toute l'image pour que le
              libellé blanc de la pilule tienne son contraste où qu'il tombe ;
              sans lui, c'est **la pilule qui doit le porter seule**, donc son
              fond passe de blanc translucide à noir à 55 %. Un texte sur une
              photo se mesure au pire cas, image entièrement blanche dessous :
              à 55 %, le blanc tient 4,76:1 ; à 50 %, il tombe à 3,98 et passe
              sous le seuil.

              Il ne reste qu'un voile au survol, comme réponse au geste. */}
          <span
            aria-hidden
            className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/15"
          />

          {/* Ce n'est pas un vrai bouton : toute l'affiche est cliquable, et
              ceci n'en est que la marque visible. Un bouton dans un bouton
              serait du HTML invalide et donnerait deux cibles au clavier. */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Le disque.

                Il est la seule marque de lecture du site : la pilule portant
                « Voir la vidéo » a été retirée, sur décision de Rémy, y compris
                sur la vidéo du hero. Un disque de lecture se comprend sans
                qu'on l'écrive.

                `rounded-full` est une exception à la règle des 5 px, consignée
                dans `AGENTS.md` avec les autres commandes rondes du site.

                **Il est clair et non foncé**, sur décision de Rémy, et c'est ce
                qui décide de la couleur du triangle. Un disque clair ne peut
                pas porter un triangle blanc : c'est l'erreur de la référence,
                invisible dès que l'image est lumineuse. Le triangle est donc en
                `--bande-nuit`, le bleu nuit du site.

                Le blanc est à 60 % et pas moins, et ce nombre est mesuré. Un
                signe posé sur une photo se mesure au pire cas, et ici il y en a
                **deux**, opposés : sur une image entièrement noire le disque
                s'assombrit et le triangle y tient 5,2:1 ; sur une image
                entièrement blanche, 14,9:1. À 50 %, le premier cas tombe à 3,8
                et passe sous le seuil d'un texte.

                **Pas de filet**, et pas de changement d'échelle au survol : les
                deux dessinaient un bord au moment précis où le disque bouge, et
                sur une surface floutée ce bord se voit. La réponse au geste est
                la couleur, qui passe au bleu du site, et rien d'autre.

                Le flou est la troisième exception du projet à « le flou va
                derrière, jamais devant ». Il est ici chez lui : ce qui passe
                dessous est justement l'image. Mais il n'apporte **aucun**
                contraste, un flou ne changeant pas la luminosité moyenne de ce
                qu'il brouille : il s'ajoute à la densité du fond, il ne la
                remplace pas. */}
            <span className="flex size-20 items-center justify-center rounded-full bg-white/60 backdrop-blur-md transition-colors duration-300 group-hover:bg-primary sm:size-24">
              {/* Le triangle est décalé d'un cheveu : son centre optique n'est
                  pas son centre géométrique, et centré au pixel il paraît collé
                  à gauche.

                  Au survol, le disque passe au bleu plein : le triangle passe
                  donc au blanc, qui y tient 5,6:1, là où le bleu nuit sur le
                  bleu du site ne vaudrait que 2,7:1. La couleur du signe suit
                  celle de son fond, sinon le survol rendrait le bouton moins
                  lisible qu'au repos. */}
              <Play className="ml-[4px] size-8 fill-[var(--bande-nuit)] text-[var(--bande-nuit)] transition-colors duration-300 group-hover:fill-white group-hover:text-white sm:size-9" />
            </span>
          </span>

          {/* La légende, sur son voile.

              Le voile n'est pas décoratif : un texte posé sur une photo se
              mesure au pire cas, image entièrement blanche dessous. À 70 % de
              noir, le blanc y tient 8,5:1, et c'est ce qui garantit le seuil,
              pas le hasard du cadrage.

              `aria-hidden` : le nom et la durée sont déjà dans l'`aria-label`
              du bouton, et les répéter ferait tout annoncer deux fois. */}
          {legende ? (
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pt-20 pb-4 text-left sm:px-6 sm:pb-5"
            >
              {legende}
            </span>
          ) : null}

          {/* La durée ne s'affiche que si rien d'autre n'occupe le bas.

              Sur une carte de témoignage, la légende y est déjà et la référence
              n'en porte pas. Sur le hero, le coin est libre et l'information
              vaut d'être lue : on décide de lancer une vidéo de seize minutes
              autrement qu'une de trente secondes. Dans les deux cas elle reste
              annoncée par l'`aria-label` du bouton, donc rien n'est perdu pour
              qui ne voit pas l'écran. */}
          {legende ? null : (
            <span
              aria-hidden
              className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white tabular-nums"
            >
              {duree(secondes)}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
