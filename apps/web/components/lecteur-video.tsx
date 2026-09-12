"use client";

import { cn } from "@repo/ui/lib/utils";
import { Play } from "lucide-react";
import { useState } from "react";

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
  libelle = "Voir la vidéo",
  recadre = false,
  className,
}: {
  id: string;
  titre: string;
  secondes: number;
  affiche: string;
  /** Une seconde source, plus légère, pour les écrans étroits. */
  afficheMobile?: string;
  libelle?: string;
  /**
   * Recadre le cadre en 2,4/1 et demande au lecteur d'en faire autant.
   *
   * Réservé aux vidéos dont l'enregistrement porte ses propres bandes noires,
   * les appels à deux des témoignages. Sur une vidéo cadrée plein écran, ça
   * mangerait le haut et le bas de l'image.
   */
  recadre?: boolean;
  className?: string;
}) {
  const [lance, setLance] = useState(false);

  /* `fitStrategy=cover` demande au lecteur de remplir le cadre en rognant,
     plutôt que d'y faire tenir l'image en ajoutant des bandes. Sans lui, une
     vidéo 16/9 posée dans un cadre en 2,4/1 rétrécirait pour tenir en hauteur
     et se retrouverait avec des bandes sur les côtés : on aurait déplacé le
     problème d'un quart de tour.

     C'est la seule façon d'enlever les bandes **à la lecture aussi**. Recadrer
     l'affiche seule ferait sauter le cadre au moment du clic. */
  const options = recadre
    ? new URLSearchParams({ ...Object.fromEntries(OPTIONS), fitStrategy: "cover" })
    : OPTIONS;

  return (
    <div
      className={cn(
        // Fond noir et non `bg-card` : le rapport 16/9 du cadre et celui de la
        // vidéo ne tombent jamais au pixel près, et le cheveu qui reste
        // laisserait voir la couleur du thème tout autour de l'image.
        // Le rayon est celui du reste du site, 5 px : une vidéo est un objet
        // qu'on regarde de près, pas une jonction pleine largeur.
        "relative isolate overflow-hidden rounded-md bg-black",
        // Le rapport du cadre. 2,4/1 pour les enregistrements qui portent
        // leurs bandes noires, 16/9 partout ailleurs.
        recadre ? "aspect-[2.4/1]" : "aspect-16/9",
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
          src={`https://fast.wistia.net/embed/iframe/${id}?${options}`}
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

          <span
            aria-hidden
            className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20"
          />

          {/* Ce n'est pas un vrai bouton : toute l'affiche est cliquable, et
              ceci n'en est que la marque visible. Un bouton dans un bouton
              serait du HTML invalide et donnerait deux cibles au clavier. */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white/20 px-5 text-sm font-semibold text-white ring-1 ring-white/45 ring-inset backdrop-blur-md transition-colors duration-300 group-hover:bg-white/30">
              {libelle}
              <Play className="size-4 fill-current" />
            </span>
          </span>

          <span
            aria-hidden
            className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white tabular-nums"
          >
            {duree(secondes)}
          </span>
        </button>
      )}
    </div>
  );
}
