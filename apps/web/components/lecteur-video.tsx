"use client";

import { cn } from "@repo/ui/lib/utils";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

/* Les mêmes options, **sans la lecture automatique**.
 *
 * Elles servent au mode `natif`, où le lecteur de Wistia est servi d'emblée au
 * lieu d'attendre un clic : il n'y a plus de clic préalable, donc plus rien qui
 * autorise la lecture. Un lecteur qui démarre tout seul à l'ouverture d'une
 * page est exactement ce que le reste du site évite.
 *
 * Copiées et non réécrites : deux listes à tenir d'accord divergent au premier
 * réglage, et celle-ci existe uniquement pour retirer une ligne de l'autre. */
const OPTIONS_NATIF = (() => {
  const o = new URLSearchParams(OPTIONS);
  o.delete("autoPlay");
  return o;
})();

/**
 * L'événement qui demande à un lecteur `natif` de démarrer, avec l'identifiant
 * Wistia de la vidéo en `detail.id`.
 *
 * **Il existe parce que l'iframe est d'une autre origine** : la page ne peut pas
 * appuyer sur son bouton de lecture. Le lecteur se recharge donc avec la
 * lecture automatique, ce qui ne marche que parce que la demande part d'un clic
 * du visiteur : c'est ce geste qui autorise le son. Sans lui, le navigateur
 * refuserait, ou démarrerait sans le son.
 *
 * Un événement de fenêtre et non une propriété : celui qui demande, la
 * notification de `/preparation`, n'a aucun lien de parenté avec le lecteur.
 */
export const LIRE_VIDEO = "lecteur-video:lire";

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
  natif = false,
  afficheAlt,
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
  /**
   * La description de l'affiche.
   *
   * Vide par défaut, et c'est le bon défaut : dans un carrousel ou une grille,
   * le nom et le résultat sont déjà écrits à côté, et décrire l'image les
   * ferait annoncer deux fois. Sur une page d'avis, où l'affiche est la seule
   * image du document, elle mérite d'être décrite.
   */
  afficheAlt?: string;
  /**
   * Sert le lecteur de Wistia tout de suite, avec son affiche et son bouton à
   * lui, au lieu de notre affiche cliquable.
   *
   * **C'est l'inverse du choix par défaut du site, et il faut le savoir.** Notre
   * affiche existe pour que rien ne parte chez Wistia tant que personne n'a
   * demandé à regarder : une iframe charge environ 505 Ko de JavaScript et
   * prend contact avec un tiers à l'ouverture de la page, qu'on joue ou non.
   *
   * Réservé à la vidéo du haut de `/immersion`, sur demande de Rémy, qui veut
   * l'affiche de Wistia. Une page qui en aligne vingt-deux ne peut pas se le
   * permettre.
   */
  natif?: boolean;
  className?: string;
}) {
  const [lance, setLance] = useState(false);
  const [proche, setProche] = useState(false);
  /* En mode natif, la lecture demandée de l'extérieur par `LIRE_VIDEO`. */
  const [demandee, setDemandee] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!natif) return;
    const ecouter = (evenement: Event) => {
      if ((evenement as CustomEvent<{ id: string }>).detail?.id !== id) return;
      setProche(true);
      setDemandee(true);
    };
    window.addEventListener(LIRE_VIDEO, ecouter);
    return () => window.removeEventListener(LIRE_VIDEO, ecouter);
  }, [natif, id]);

  useEffect(() => {
    if (!actif) setLance(false);
  }, [actif]);

  /* **En mode natif, l'iframe attend d'approcher de l'écran.**

     Mesuré : la page d'immersion en pose trois, et les trois se chargeaient à
     l'ouverture, chacune avec le JavaScript de Wistia et son contact avec un
     tiers, pour deux vidéos que personne ne voit avant d'avoir beaucoup
     défilé. Rien ne change à l'écran : c'est toujours le lecteur de Wistia qui
     est servi, avec son affiche et son bouton, et `rootMargin` le fait arriver
     trois cents pixels avant d'être visible, donc prêt quand on l'atteint.

     Celle du hero est dans la fenêtre dès le départ : l'observateur la
     déclenche à la première image, et l'affiche tient la place entre-temps.

     **Ce n'est pas le repli du reste du site**, qui remplace l'iframe par une
     affiche cliquable tant qu'on n'a rien demandé : ici, le lecteur de Wistia
     apparaît sans clic, comme Rémy l'a demandé. On ne change que le moment où
     l'iframe est créée. */
  useEffect(() => {
    if (!natif) return;
    const el = cadre.current;
    if (!el) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setProche(true);
          observateur.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [natif]);

  return (
    <div
      ref={cadre}
      className={cn(
        // Fond noir et non `bg-card` : le rapport 16/9 du cadre et celui de la
        // vidéo ne tombent jamais au pixel près, et le cheveu qui reste
        // laisserait voir la couleur du thème tout autour de l'image.
        // Le rayon est celui du reste du site, 5 px : une vidéo est un objet
        // qu'on regarde de près, pas une jonction pleine largeur.
        // Le rapport est toujours 16/9, celui dans lequel Wistia sert ses
        // vidéos. Un cadre de 2,4/1 a été essayé pour masquer les bandes
        // noires des enregistrements ; Rémy a tranché pour le 16/9.
        "relative isolate aspect-16/9 rounded-md",
        className,
      )}
    >
      {/* **Le rognage vit dans un enfant, et pas sur le cadre lui-même.**

          C'est la réparation d'un vrai défaut, et il a demandé trois essais.
          Sur la page d'immersion, le cadre porte une rotation 3D : il devient
          alors son propre calque de composition, et **un `overflow: hidden`
          posé là ne rogne plus l'iframe qu'il contient**. Les quatre angles
          carrés du lecteur dépassaient de l'arrondi, puis, une fois l'iframe
          arrondie elle-même, c'est le filet clair qu'elle peint qui suivait la
          courbe.

          Un enfant qui ne porte, lui, aucune transformation rogne normalement.
          Le cadre garde donc la rotation et l'ombre, cet enfant garde le fond,
          le rayon et le rognage, et le débordement de trois pixels de l'iframe
          redevient ce qu'il a toujours été : un filet rentré sous un bord qui
          coupe vraiment.

          Le rayon est écrit aux deux endroits : dehors pour que l'ombre portée
          suive la forme, dedans pour rogner. */}
      <div className="absolute inset-0 overflow-hidden rounded-md bg-black">
      {/* **L'affiche tient la place tant que l'iframe n'est pas là**, en mode
          natif : sans elle, on verrait un rectangle noir le temps que Wistia
          réponde. Elle est déjà servie par nous, donc elle ne coûte rien de
          plus. */}
      {natif && !proche ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={affiche}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}

      {(natif && proche) || lance ? (
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
          /* Une lecture demandée change la clé, donc remonte l'iframe avec
             `autoPlay` : c'est le rechargement qui la fait démarrer. */
          key={demandee ? "lecture" : "repos"}
          src={`https://fast.wistia.net/embed/iframe/${id}?${natif && !demandee ? OPTIONS_NATIF : OPTIONS}`}
          title={titre}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute -inset-[3px] size-[calc(100%+6px)] border-0"
        />
      ) : null}

      {!natif && !lance ? (
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
              alt={afficheAlt ?? ""}
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

                **Le disque est foncé et le triangle blanc**, et c'est la
                réparation d'une panne, pas un changement de goût.

                Le triangle était peint en `var(--bande-nuit)`, un jeton qui
                **n'existe plus** : il est parti avec la bande bleue qu'il
                servait. Une référence `var()` sans valeur de repli ne tombe pas
                en erreur, elle laisse la propriété à sa valeur héritée : le
                remplissage retombait donc sur le noir par défaut et le contour
                sur la couleur de texte courante, claire en thème sombre. Ce que
                Rémy voyait, un triangle noir cerné d'un liseré blanc, n'avait
                jamais été choisi par personne. **Un jeton retiré doit être
                cherché partout où il est écrit**, sinon il laisse derrière lui
                des couleurs que personne n'a décidées et que rien ne signale.

                Le triangle est blanc dans les deux thèmes, sur décision de
                Rémy, et un triangle blanc demande un fond foncé : le disque
                repasse donc à 45 % de noir. Ce nombre est mesuré. Un signe posé
                sur une photo se mesure au pire cas, image entièrement blanche
                dessous : à 45 %, le blanc y tient 3,35:1 ; à 35 %, il tombe à
                2,46 et disparaît sur un visage en pleine lumière.

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
            <span className="flex size-20 items-center justify-center rounded-full bg-black/45 backdrop-blur-md transition-colors duration-300 group-hover:bg-primary sm:size-24">
              {/* Le triangle est décalé d'un cheveu : son centre optique n'est
                  pas son centre géométrique, et centré au pixel il paraît collé
                  à gauche.

                  **Le remplissage et le trait sont blancs tous les deux**, et
                  c'est ce qui retire le liseré : les icônes Lucide sont des
                  tracés, donc un remplissage d'une couleur et un contour d'une
                  autre dessinent un cerne. Une seule couleur donne une forme
                  pleine.

                  Rien ne change au survol : le disque passe au bleu du site, où
                  le blanc tient 5,6:1. La couleur du signe n'a donc pas à
                  suivre celle de son fond, comme c'était le cas quand le
                  triangle était sombre. */}
              <Play className="ml-[4px] size-8 fill-white text-white sm:size-9" />
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
      ) : null}
      </div>
    </div>
  );
}
