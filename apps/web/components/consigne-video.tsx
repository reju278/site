"use client";

import { BorderBeam } from "@repo/ui/components/border-beam";
import { Gelule } from "@/components/pilules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { Play, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";
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
 * glissé du doigt et l'annonce aux lecteurs d'écran ; la lumière qui fait le
 * tour de la carte est `BorderBeam` de MagicUI. Le bouton « Fermer » est celui
 * de la fenêtre des entretiens d'`/immersion`, la gélule de verre à la lumière
 * rouge, sur demande de Rémy qui voulait le mot écrit et un « joli bouton ».
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
 * est élargie** à quarante rem au lieu des 356 px de Sonner, sur sa demande :
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
  texte,
  affiche,
}: {
  texte: string;
  /** L'affiche de la vidéo du haut de page, servie par nous. */
  affiche: string;
}) {
  useEffect(() => {
    /* Un court délai, pour qu'elle arrive une fois la page posée plutôt que
       d'apparaître avec le premier affichage, où on ne la remarquerait pas. */
    const minuteur = setTimeout(() => {
      toast.custom((id) => <Carte id={id} texte={texte} affiche={affiche} />, {
        id: ID,
        position: "bottom-center",
        duration: Infinity,
        /* La classe que vise `globals.css` pour élargir la pile de Sonner sur
           ordinateur, et pour elle seule. */
        className: "consigne-video",
      });
    }, 900);

    return () => {
      clearTimeout(minuteur);
      toast.dismiss(ID);
    };
  }, [texte, affiche]);

  return null;
}

/* Un identifiant fixe : un second montage, en développement ou au retour sur la
   page, remplace la notification au lieu d'en empiler une seconde. */
const ID = "consigne-video";

function Carte({
  id,
  texte,
  affiche,
}: {
  id: string | number;
  texte: string;
  affiche: string;
}) {
  /* **La lumière n'est pas rendue sous mouvement réduit.** Elle tourne par
     Motion, donc en JavaScript, hors de portée de la règle globale : c'est le
     cas des rayons du fond, et il se règle pareil. */
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
          la carte doit occuper le bas de l'écran ; petite à gauche en large.
          Le disque de lecture est celui des affiches du site, noir à 45 % et
          flouté : il tient ses 3:1 sur une image blanche. */}
      <button
        type="button"
        onClick={allerALaVideo}
        aria-label="Aller à la vidéo"
        className="group/vignette relative aspect-video w-full shrink-0 overflow-hidden rounded-md sm:w-40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={affiche}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          className="size-full object-cover transition-[scale] duration-500 group-hover/vignette:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm sm:size-8">
            <Play aria-hidden className="size-4 fill-current sm:size-3.5" />
          </span>
        </span>
      </button>

      <p className="text-base leading-snug text-pretty sm:flex-1 sm:text-sm">{texte}</p>

      {/* **La gélule « Fermer » de la fenêtre des entretiens**, telle quelle :
          même verre, même croix, même lumière en `--destructive`, même libellé
          qui roule au survol. Pleine largeur sur téléphone, où on la vise au
          pouce ; à droite du texte en large. */}
      <Gelule
        as="button"
        type="button"
        sur="voile"
        teinte="var(--destructive)"
        onClick={() => toast.dismiss(id)}
        className="group/roule min-h-11 w-full shrink-0 justify-center sm:min-h-0 sm:w-auto"
        pastille={<X aria-hidden className="size-4 shrink-0" />}
      >
        <TexteRoulant>Fermer</TexteRoulant>
      </Gelule>

      {/* La lumière du bord, dans le bleu du site. Deux faisceaux opposés,
          comme l'exemple du registre, pour qu'il y en ait toujours un en vue. */}
      {reduit ? null : (
        <>
          <BorderBeam
            duration={7}
            size={120}
            borderWidth={1.5}
            colorFrom="var(--primary)"
            colorTo="transparent"
          />
          <BorderBeam
            duration={7}
            delay={3.5}
            size={120}
            borderWidth={1.5}
            colorFrom="var(--primary)"
            colorTo="transparent"
          />
        </>
      )}
    </div>
  );
}
