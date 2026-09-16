import { BarreAppelHub } from "@/components/appel-hub";
import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { PiedImmersion } from "@/components/pied-immersion";
import { ScrollProgress } from "@repo/ui/components/scroll-progress";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { prenom } from "@/lib/prenom";
import type { Metadata } from "next";

/**
 * Le cadre de la page d'immersion.
 *
 * **C'est un tunnel et non une page du site**, sur décision de Rémy, et c'est
 * ce qui décide de tout ce qui suit. Elle est calquée sur `/hub` : son propre
 * en-tête, son propre pied de page, la barre d'appel fixe sur téléphone, et
 * aucune sortie hormis l'appel et les trois documents légaux.
 *
 * L'en-tête et le pied de page du site, eux, sont retirés par `HorsTunnel`
 * dans `app/layout.tsx`, qui lit la liste des racines de tunnel dans
 * `lib/tunnels.ts`. C'est pour cela que `/immersion` y figure : sans cette
 * ligne, la page porterait le menu du site, donc une trentaine de portes de
 * sortie, et son propre en-tête par-dessus.
 *
 * **Elle n'est pas référencée, et c'est structurel.** `robots` est posé dans le
 * gabarit et non dans la page : le jour où `/immersion` gagne une sous-page,
 * celle-ci naîtra non indexée sans que personne ait à y penser. Un `noindex`
 * écrit page par page est un `noindex` qu'on oublie à la deuxième.
 *
 * Elle n'apparaît pas non plus dans `sitemap.ts`, ni dans les menus, ni dans le
 * pied de page du site : on n'y arrive que par le lien qu'on donne.
 *
 * **Pas de `canonical` vers autre chose.** Les deux signaux se
 * contrediraient : le premier demande de ne pas indexer, le second demande
 * d'indexer ailleurs. Une page interdite d'index n'a pas d'original à désigner.
 *
 * `nocache` et `noimageindex` complètent : ni copie en cache, ni portraits de
 * l'équipe et affiches d'entretien dans la recherche d'images.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutImmersion({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* L'ordre est celui d'`entretiensImmersion`, donc celui de la page : le pied
     de page les liste comme on vient de les voir, sans quoi on y chercherait un
     nom à une place qu'il n'occupe pas plus haut. Le nom vient de
     `temoignages`, jamais réécrit ici. */
  const entretiens = entretiensImmersion.flatMap((id) => {
    const temoignage = temoignages.find((t) => t.id === id);
    return temoignage
      ? [{ ancre: ancreEntretien(id), nom: prenom(temoignage.nom) }]
      : [];
  });

  return (
    /* Le rembourrage bas ne vaut que sur téléphone, et il est du même ordre que
       la barre d'appel fixe : sans lui, elle couvrirait les derniers mots de la
       page. Il n'existe pas au-dessus de `sm`, où la barre n'existe pas non
       plus. Repris du gabarit du hub. */
    <div className="pb-24 sm:pb-0">
      {/* La barre de progression, épinglée tout en haut, sur demande de Rémy.

          **Le bleu remplace le dégradé du registre, et `bg-none` est
          indispensable.** Le composant pose `bg-linear-to-r` avec trois teintes,
          c'est-à-dire une `background-image` ; `bg-primary` pose une
          `background-color`. Ce sont deux propriétés différentes, donc
          `tailwind-merge` ne les voit pas comme un conflit : les deux survivent
          et l'image l'emporte. C'est exactement le piège que `AGENTS.md` décrit
          pour les classes préfixées. `bg-none` retire l'image, et le bleu se
          voit.

          `h-1` et non `h-px` : Rémy la veut plus épaisse. Un filet d'un pixel ne
          se remarque pas sur un écran de portable.

          **Elle mesure le défilement de la page, pas celui d'une fenêtre.**
          Quand une fenêtre d'entretien est ouverte, le corps ne défile plus et
          la barre reste donc immobile ; le voile du dialogue, portalisé après
          elle, la recouvre. */}
      <ScrollProgress className="h-1 bg-none bg-primary" />

      <EnTeteImmersion />
      {children}
      <PiedImmersion entretiens={entretiens} />
      <BarreAppelHub />
    </div>
  );
}
