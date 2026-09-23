"use client";

import { CirclePlay, X } from "lucide-react";
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
 * **C'est Sonner, déjà monté par le gabarit racine**, et non une carte fixée à
 * la main : il apporte l'entrée animée, la fermeture au glissé du doigt, la pile
 * et l'annonce aux lecteurs d'écran. Seul le contenu est à nous, par
 * `toast.custom`.
 *
 * **Au centre en large, sur toute la largeur en bas du téléphone**, et plus
 * grande là, sur demande de Rémy : elle doit prendre « une bonne partie de
 * l'écran en bas ». Sonner élargit déjà la pile sous 600 px ; la carte y ajoute
 * un corps et un rembourrage plus grands, et un bouton pleine largeur à portée
 * du pouce.
 *
 * **Elle revient à chaque ouverture de la page**, parce que c'est ce que Rémy a
 * décrit, « quand on ouvre la page ». Rien n'est rangé dans le navigateur.
 *
 * **Le verre est celui de la carte de cookies**, `card/85`, flou de 12 px, filet
 * en `--border` et rayon de 12 px : c'est l'autre carte qui flotte en bas de
 * l'écran, et deux dessins pour la même famille d'objets se liraient comme une
 * inattention. Son exception au flou par-devant couvre donc celle-ci, et c'est
 * écrit dans `AGENTS.md`.
 */
export function ConsigneVideo({
  titre,
  texte,
}: {
  titre: string;
  texte: string;
}) {
  useEffect(() => {
    /* Un court délai, pour qu'elle arrive une fois la page posée plutôt que
       d'apparaître avec le premier affichage, où on ne la remarquerait pas. */
    const minuteur = setTimeout(() => {
      toast.custom((id) => <Carte id={id} titre={titre} texte={texte} />, {
        id: ID,
        position: "bottom-center",
        duration: Infinity,
      });
    }, 900);

    return () => {
      clearTimeout(minuteur);
      toast.dismiss(ID);
    };
  }, [titre, texte]);

  return null;
}

/* Un identifiant fixe : un second montage, en développement ou au retour sur la
   page, remplace la notification au lieu d'en empiler une seconde. */
const ID = "consigne-video";

function Carte({
  id,
  titre,
  texte,
}: {
  id: string | number;
  titre: string;
  texte: string;
}) {
  return (
    <div className="relative flex w-full flex-col gap-4 rounded-[12px] bg-card/85 p-5 text-card-foreground shadow-[0_0_0_1px_var(--border)_inset,0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-[12px] sm:w-[var(--width)] sm:flex-row sm:items-center sm:gap-3 sm:p-4 sm:pr-11">
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-10"
      >
        <CirclePlay className="size-6 sm:size-5" />
      </span>

      <div className="min-w-0">
        <p className="text-lg font-semibold sm:text-sm">{titre}</p>
        <p className="mt-1 text-base leading-snug text-pretty text-muted-foreground sm:mt-0.5 sm:text-sm">
          {texte}
        </p>
      </div>

      {/* Le bouton pleine largeur, sur téléphone seulement : c'est là qu'on
          ferme au pouce, et la croix du coin y est trop loin. Libellé
          d'interface, provisoire. */}
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        className="h-11 w-full rounded-md bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:hidden"
      >
        J&apos;ai compris
      </button>

      {/* `size-10 sm:size-8` : 40 px au doigt, la règle du dépôt sur les cibles
          tactiles. Une icône seule porte son `aria-label`. */}
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        aria-label="Fermer le message"
        className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:top-1/2 sm:size-8 sm:-translate-y-1/2"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}
