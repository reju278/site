"use client";

import { Apparition } from "@/components/apparition";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { surligner } from "@/lib/surligner";
import { cn } from "@repo/ui/lib/utils";
import { Play, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * La consigne de `/preparation`, en notification en bas de l'écran.
 *
 * Sur demande de Rémy, après deux essais écartés : une bande bleue fixée en haut,
 * puis la gélule du hero posée au-dessus de l'en-tête. **En bas et non en
 * haut** : le haut appartient à l'en-tête, et deux objets fixés l'un sur l'autre
 * se disputaient le même bord.
 *
 * **Tout vient des registres**, sur sa demande : la notification est Sonner,
 * déjà monté par le gabarit racine, qui apporte l'entrée animée, la fermeture au
 * glissé du doigt et l'annonce aux lecteurs d'écran. Le bouton « Fermer » est
 * `BoutonScintillant`, bâti sur `ShimmerButton` de MagicUI, dans l'habillage du
 * bouton « Voir plus » du mur d'`/immersion`. Une lumière `BorderBeam` faisait
 * le tour de la carte ; Rémy l'a fait passer sur le bouton.
 * 21st.dev a été regardé et reste fermé sans clé, voir `AGENTS.md`.
 *
 * **La vignette de la vidéo remplace l'icône**, que Rémy trouvait laide : la
 * carte parle d'une vidéo, elle la montre. Elle mène à la vidéo et referme la
 * notification.
 *
 * **Au centre en large, sur toute la largeur en bas du téléphone**, et plus
 * grande là, sur demande de Rémy : elle doit prendre « une bonne partie de
 * l'écran en bas ». Sonner élargit déjà la pile sous 600 px ; la carte y ajoute
 * une vignette pleine largeur et un bouton à portée du pouce. **En large, elle
 * est élargie** à quarante-huit rem au lieu des 356 px de Sonner, sur sa demande :
 * voir la règle `.consigne-video` de `globals.css`.
 *
 * **Elle revient à chaque ouverture de la page**, parce que c'est ce que Rémy a
 * décrit, « quand on ouvre la page ». Rien n'est rangé dans le navigateur.
 *
 * **Le verre est celui de la carte de cookies**, `card/85`, flou de 12 px, filet
 * en `--border` et rayon de 12 px : c'est l'autre carte qui flotte en bas de
 * l'écran. Son exception au flou par-devant couvre donc celle-ci, et c'est écrit
 * dans `AGENTS.md`.
 */
export function ConsigneVideo({
  titre,
  texte,
  surligne,
  affiche,
}: {
  titre: string;
  texte: string;
  /** Des sous-chaînes exactes de `texte`, à surligner. */
  surligne: readonly string[];
  /** L'affiche de la vidéo du haut de page, servie par nous. */
  affiche: string;
}) {
  const [ouverte, setOuverte] = useState(false);

  useEffect(() => {
    /* Trois secondes, sur demande de Rémy : elle arrive une fois la page
       posée et regardée, plutôt qu'avec le premier affichage, où on ne la
       remarquerait pas. */
    const minuteur = setTimeout(() => {
      jouerCarillon();
      setOuverte(true);
      toast.custom((id) => (
        <Carte
          id={id}
          titre={titre}
          texte={texte}
          surligne={surligne}
          affiche={affiche}
        />
      ), {
        id: ID,
        position: "bottom-center",
        duration: Infinity,
        /* La classe que vise `globals.css` pour élargir la pile de Sonner sur
           ordinateur, et pour elle seule. */
        className: "consigne-video",
        onDismiss: () => setOuverte(false),
      });
    }, 3000);

    return () => {
      clearTimeout(minuteur);
      toast.dismiss(ID);
    };
  }, [titre, texte, surligne, affiche]);

  return (
    /* **Le voile de bas en haut**, sur demande de Rémy : tant que la
       notification est ouverte, la page s'éteint sous elle, du bas de l'écran
       jusqu'à la moitié de la carte à peu près. Il masque un peu ce qui passe
       derrière et donne une progression qui monte vers la carte.

       La couleur de page et non du noir : il fond la page dans elle-même, dans
       les deux thèmes. Plus haut sur téléphone, où la carte l'est aussi.
       `pointer-events-none` : il ne prend aucun clic, la page reste utilisable.
       `z-40`, sous la pile de Sonner. */
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 h-64 bg-gradient-to-t from-background from-20% via-background/70 to-transparent transition-opacity duration-500 sm:h-36",
        ouverte ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

/* Un identifiant fixe : un second montage, en développement ou au retour sur la
   page, remplace la notification au lieu d'en empiler une seconde. */
const ID = "consigne-video";

function Carte({
  id,
  titre,
  texte,
  surligne,
  affiche,
}: {
  id: string | number;
  titre: string;
  texte: string;
  surligne: readonly string[];
  affiche: string;
}) {
  /* Sous mouvement réduit, le saut jusqu'à la vidéo se fait sans défilement
     animé. */
  const reduit = useReducedMotion();


  const allerALaVideo = () => {
    document
      .querySelector("#presentation .scene-video")
      ?.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
    toast.dismiss(id);
  };

  return (
    <div className="relative flex w-full flex-col gap-4 overflow-hidden rounded-[12px] bg-card/85 p-4 text-card-foreground shadow-[0_0_0_1px_var(--border)_inset,0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-[12px] sm:flex-row sm:items-center sm:gap-5 sm:p-3 sm:pr-4">
      {/* La vignette, qui mène à la vidéo. Pleine largeur sur téléphone, là où
          la carte doit occuper le bas de l'écran.

          **En large, elle a la hauteur du texte**, sur demande de Rémy :
          `self-stretch` l'étire à la hauteur de la rangée, que le texte décide.
          Sa largeur est fixe, choisie pour tomber près du 16/9 à cette hauteur,
          et `object-cover` rogne l'écart. Un calcul en JavaScript qui déduisait
          la largeur de la hauteur a été essayé et jeté : la hauteur du texte
          dépend de sa largeur, donc de celle de la vignette, et la boucle
          divergeait jusqu'à une vignette de trois mille pixels.
          Le disque de lecture est celui des affiches du site, noir à 45 % et
          flouté : il tient ses 3:1 sur une image blanche. */}
      <button
        type="button"
        onClick={allerALaVideo}
        aria-label="Aller à la vidéo"
        className="group/vignette relative aspect-video w-full shrink-0 overflow-hidden rounded-md sm:aspect-auto sm:w-64 sm:self-stretch"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={affiche}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          /* **En absolu**, pour que l'image ne pèse pas dans la hauteur de la
             rangée : en flux, son format naturel imposait 135 px à un texte
             qui en fait 109, et c'est elle qui décidait au lieu de lui. */
          className="absolute inset-0 size-full object-cover transition-[scale] duration-500 group-hover/vignette:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm sm:size-8">
            <Play aria-hidden className="size-4 fill-current sm:size-3.5" />
          </span>
        </span>
      </button>

      <div className="sm:flex-1">
        {/* `titre` : la police des titres de la page, sur demande de Rémy. */}
        <p className="titre text-xl sm:text-lg">{titre}</p>
        {/* **Surligné et non en gras**, sur demande de Rémy : le trait jaune du
            message de l'accueil, par la même fonction, **et la même animation**
            : `Apparition` fait monter le paragraphe puis tire les traits de
            gauche à droite, par la règle `[data-apparition]` de `globals.css`.
            Le délai laisse Sonner finir d'amener la carte avant. */}
        <Apparition delai={300}>
          <p className="mt-1 text-base leading-relaxed text-pretty text-muted-foreground sm:text-sm">
            {surligner(texte, surligne)}
          </p>
        </Apparition>
      </div>

      {/* **Le bouton « Voir plus de posts de la communauté » d'`/immersion`**,
          tel quel, sur demande de Rémy : `BoutonScintillant` et son liseré qui
          scintille, le même rayon de 25 px, la même ombre portée et le libellé
          qui roule au survol. **Plus petit sur téléphone**, sur demande de Rémy :
          44 px de haut et centré plutôt que 56 px sur toute la largeur, ce qui
          reste au-dessus des 40 px d'une cible au doigt. À droite du texte en
          large. */}
      <BoutonScintillant
        action={() => toast.dismiss(id)}
        rayon="25px"
        className="min-h-11 shrink-0 self-center px-8 text-sm shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] sm:min-h-14 sm:px-6 sm:text-base"
      >
        <TexteRoulant>Fermer</TexteRoulant>
        <X aria-hidden className="size-4 shrink-0" />
      </BoutonScintillant>

    </div>
  );
}

/**
 * Le « toudoum » de l'arrivée, sur demande de Rémy.
 *
 * **Synthétisé et non joué depuis un fichier** : deux notes de sinus, la
 * seconde plus basse, chacune avec une attaque brève et une chute
 * exponentielle. Aucun fichier à servir, rien à télécharger avant la page.
 *
 * **Il ne sonnera pas toujours, et c'est le navigateur qui décide.** Chrome,
 * Safari et Firefox interdisent le son tant que le visiteur n'a pas interagi
 * avec la page : un clic, une touche, un toucher. Trois secondes après un
 * chargement, la plupart n'ont encore rien fait, et le contexte audio reste
 * suspendu. On le tente, et on se tait s'il est refusé : insister, en rejouant
 * au premier clic par exemple, ferait sonner la page au mauvais moment.
 */
function jouerCarillon() {
  try {
    const Contexte =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Contexte) return;

    const contexte = new Contexte();
    void contexte.resume().then(() => {
      if (contexte.state !== "running") {
        void contexte.close();
        return;
      }

      const note = (frequence: number, debut: number) => {
        const oscillateur = contexte.createOscillator();
        const volume = contexte.createGain();
        const t = contexte.currentTime + debut;

        oscillateur.type = "sine";
        oscillateur.frequency.value = frequence;
        volume.gain.setValueAtTime(0.0001, t);
        volume.gain.exponentialRampToValueAtTime(0.18, t + 0.015);
        volume.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        oscillateur.connect(volume).connect(contexte.destination);
        oscillateur.start(t);
        oscillateur.stop(t + 0.5);
      };

      /* « tou » puis « doum » : un mi, puis le si en dessous. */
      note(659.25, 0);
      note(493.88, 0.16);

      setTimeout(() => void contexte.close(), 1000);
    });
  } catch {
    /* Pas de son : la notification se suffit à elle-même. */
  }
}
