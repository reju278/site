"use client";

import { video } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";
import { Play } from "lucide-react";
import { useState } from "react";

/**
 * Le lecteur vidéo, habillé par nous.
 *
 * L'iframe Wistia est servie depuis `fast.wistia.net`, donc d'une autre
 * origine : aucune de nos feuilles de style n'atteint son intérieur, et le
 * lecteur employé ici (E-v1) n'expose ni `::part` ni variable CSS. La seule
 * chose qu'on choisit à l'intérieur est `playerColor`, déjà réglée sur le bleu
 * de la marque.
 *
 * On personnalise donc **l'état que les gens regardent réellement**. Une vidéo
 * de seize minutes passe l'essentiel de sa vie à l'arrêt : ce qu'on voit, c'est
 * une affiche et un bouton. Ceux-là sont à nous, entièrement, et le lecteur de
 * Wistia n'apparaît qu'une fois la lecture demandée.
 *
 * Deux effets de bord, tous deux souhaitables :
 *
 * - **Le poids.** Une iframe Wistia charge environ 505 Ko de JavaScript même si
 *   personne ne joue. Ici, rien ne part avant le clic.
 * - **La vie privée.** Aucun contact avec un serveur tiers, aucune écriture
 *   dans le stockage local, tant que la personne n'a rien demandé. C'est ce qui
 *   permet à la page de confidentialité de continuer à dire vrai.
 *
 * Le suivi d'audience de Wistia n'est pas désactivé (`doNotTrack`) : il alimente
 * les statistiques de Rémy, et les couper est une décision commerciale, pas une
 * décision de mise en page.
 */

/** Les options passées au lecteur, écrites ici et non laissées au compte. */
const OPTIONS = new URLSearchParams({
  // Répétée explicitement : elle est déjà enregistrée côté Wistia, mais un
  // réglage de compte qui change ne doit pas repeindre le site en silence.
  playerColor: "045ee6",
  // La lecture démarre parce qu'on vient de la demander, jamais toute seule.
  autoPlay: "true",
  // Rend transparent le fond que le lecteur peint lui-même à l'intérieur de
  // l'iframe. Sans cela, il dessine un cadre clair d'un ou deux pixels tout
  // autour de l'image, qu'aucune de nos feuilles ne peut atteindre puisqu'il
  // est peint dans un document d'une autre origine. Va nécessairement avec le
  // fond noir du cadre : la transparence laisse voir ce qu'il y a derrière, et
  // ce qu'il y a derrière doit être noir, pas la couleur du thème.
  wmode: "transparent",
  // Sur téléphone, rester dans la page plutôt que de basculer en plein écran.
  playsinline: "true",
  // Retire la surcouche « copier le lien », qui n'a rien à faire sur un site
  // vitrine et ajoute un bouton de plus dans un coin.
  copyLinkAndThumbnailEnabled: "false",
  // À la fin, revenir à l'affiche plutôt que de figer la dernière image.
  endVideoBehavior: "reset",
});

/** « 981 » devient « 16:21 ». */
function duree(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = Math.round(secondes % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LecteurVideo({ className }: { className?: string }) {
  const [lance, setLance] = useState(false);

  return (
    <div
      className={cn(
        // Fond noir et non `bg-card` : le rapport 16/9 du cadre et celui de la
        // vidéo ne tombent jamais au pixel près, et le cheveu qui reste
        // laissait voir la couleur du thème tout autour de l'image. En noir, il
        // se confond avec la vidéo, dans les deux thèmes.
        "relative isolate aspect-16/9 overflow-hidden rounded-md bg-black",
        className
      )}
    >
      {lance ? (
        // L'iframe déborde de trois pixels de chaque côté, et `overflow-hidden`
        // sur le cadre coupe ce qui dépasse.
        //
        // Ce n'est pas une coquetterie : l'habillage de Wistia peint un liseré
        // clair d'un à deux pixels tout autour de la vidéo, à l'intérieur de
        // l'iframe. Mesuré, le cadre et l'iframe font tous deux 768 sur 432
        // avec zéro écart des quatre côtés : le trait n'est donc pas le nôtre,
        // il est peint dans un document d'une autre origine, où aucune de nos
        // règles n'entre. Le faire déborder est la seule prise qui reste.
        //
        // Le prix est un rognage de moins d'un pour cent de l'image, invisible.
        // L'iframe déborde de trois pixels de chaque côté, et `overflow-hidden`
        // sur le cadre coupe ce qui dépasse.
        //
        // C'est un contournement, et il est assumé comme tel. Trois mesures ont
        // établi d'où vient le liseré clair : le cadre et l'iframe font tous
        // deux 768 sur 432 avec zéro écart des quatre côtés ; en colorant le
        // cadre en rouge vif, aucun rouge n'apparaît, donc l'iframe le couvre
        // entièrement ; et en ouvrant l'URL de l'iframe en page principale, où
        // elle cesse d'être d'une autre origine, on voit que le lecteur peint
        // lui-même cette zone. Elle est donc dans un document que nos feuilles
        // de style n'atteignent pas, faute d'origine commune. Le faire déborder
        // est la seule prise qui reste.
        //
        // Le prix est un rognage de moins d'un pour cent de l'image.
        <iframe
          src={`https://fast.wistia.net/embed/iframe/${video.id}?${OPTIONS}`}
          title={video.titre}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute -inset-[3px] size-[calc(100%+6px)] border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLance(true)}
          // Le libellé porte la durée : on décide de lancer une vidéo de seize
          // minutes autrement qu'une de trente secondes.
          aria-label={`Lire la vidéo, ${duree(video.secondes)} minutes`}
          className="group absolute inset-0 cursor-pointer"
        >
          {/* L'image zoome au survol. C'est elle qui bouge, pas le cadre :
              `overflow-hidden` sur le parent la recadre, ce qui donne un
              mouvement contenu au lieu d'un bloc qui grandit et pousse ses
              voisins. La durée reste plus longue que celle d'un bouton, parce
              qu'une image qui bondit paraît nerveuse. */}
          <picture>
            <source media="(min-width: 768px)" srcSet="/affiche-video.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/affiche-video-mobile.jpg"
              alt=""
              width={1280}
              height={720}
              className="size-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </picture>

          {/* Le voile s'éclaircit au survol. Il sert d'abord à asseoir le
              bouton et la durée sur une image dont on ne maîtrise pas les
              valeurs. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20"
          />

          {/* Le bouton n'est pas un vrai bouton : c'est toute l'affiche qui
              est cliquable, et ceci n'en est que la marque visible. Un bouton
              imbriqué dans un bouton serait du HTML invalide et donnerait deux
              cibles au clavier pour une seule action. */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white/20 px-5 text-sm font-semibold text-white ring-1 ring-white/45 ring-inset backdrop-blur-md transition-colors duration-300 group-hover:bg-white/30">
              Voir la vidéo
              <Play className="size-4 fill-current" />
            </span>
          </span>

          <span
            aria-hidden
            className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white tabular-nums"
          >
            {duree(video.secondes)}
          </span>
        </button>
      )}
    </div>
  );
}
