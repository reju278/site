import { EnTeteImmersion } from "@/components/en-tete-immersion";
import { PiedImmersion } from "@/components/pied-immersion";
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
  /**
   * **Le canonique se déclare, sinon la page hérite de celui de l'accueil.**
   *
   * `layout.tsx` de la racine pose `alternates: { canonical: "/" }`, et
   * `metadataBase` vaut `remy-jupille.com` : sans cette ligne, `/immersion`
   * servait `<link rel="canonical" href="https://remy-jupille.com">`,
   * c'est-à-dire qu'elle se déclarait être la page d'accueil du site. Relevé
   * sur la page en ligne après déploiement.
   *
   * Sur une page interdite d'index, l'effet pratique est faible : personne ne
   * vient l'indexer. Mais un canonique faux est pire qu'un canonique absent,
   * c'est la règle du dépôt pour les dates et les chiffres, et elle vaut ici.
   *
   * L'adresse est absolue et non relative : relative, elle se résoudrait contre
   * `metadataBase`, donc contre le mauvais domaine. C'est exactement ce qui
   * produit le défaut qu'on répare.
   */
  alternates: { canonical: "https://go.funnels.club/immersion" },
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
    /* Plus de rembourrage bas : il réservait la place de la barre d'appel fixe
       du téléphone, qui est partie avec les liens sortants. Laissé en place, il
       aurait fait quatre-vingt-seize pixels de vide sous le pied de page. */
    <div
      /* **Les mesures de la vidéo vivent ici et non sur le hero.**

         Elles y étaient tant qu'une seule vidéo s'en servait. Rémy en veut deux
         de la même largeur, celle du haut et celle du modèle, et une largeur
         recopiée dans la seconde section aurait divergé de la première au
         premier réglage. C'est la règle du dépôt sur les valeurs partagées, et
         le hero l'appliquait déjà entre le cadre et la jonction.

         `--jonction`, elle, reste déclarée sous `[data-hero]` dans
         `globals.css` : elle ne concerne que le raccord du haut de page, et
         elle lit `--video-h` par héritage. */
      style={
        {
          /* Élargie de 48 à 56 rem, puis à 76 sur demande de Rémy. Le second
             élargissement n'est pas une question de goût : depuis que le hero
             fait une hauteur d'écran, le haut de la vidéo se pose à
             `100svh - 2 × --video-h / 3`, donc **plus la vidéo est grande, plus
             elle remonte** et moins il reste de vide entre elle et le titre. */
          "--largeur-video": "min(100vw - 2.5rem, 76rem)",
          /* La hauteur exacte du cadre en 16/9, d'où part la jonction. Une
             hauteur en dur donnerait un cadre qui n'est plus en 16/9, et Wistia
             y ajouterait des bandes noires sur les côtés. */
          "--video-h": "calc(var(--largeur-video) * 9 / 16)",
          /* Ce qui dépasse sous le bas de la fenêtre au repos. Deux endroits
             s'en servent et doivent dire la même chose : la hauteur du hero et
             la distance de défilement au bout de laquelle la vidéo se redresse,
             dans `globals.css`. */
          "--part-cachee": "calc(var(--video-h) / 6)",
        } as React.CSSProperties
      }
    >
      <EnTeteImmersion />
      {children}
      <PiedImmersion entretiens={entretiens} />
    </div>
  );
}
