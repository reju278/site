import { BarreAppelHub, PiedHub } from "@/components/appel-hub";
import { EnTeteHub } from "@/components/en-tete-hub";
import { titresHub } from "@/contenu/hub";
import { temoignages } from "@/contenu/site";
import { avisServis } from "@/lib/hub";
import type { Metadata } from "next";

/**
 * Le cadre du hub de retargeting.
 *
 * **Le hub n'est pas référencé, et c'est structurel.** `robots` est posé ici,
 * donc il vaut pour le sommaire comme pour chacun des entretiens, y compris
 * ceux qu'on ajoutera : une page de hub oubliée ne peut pas se retrouver dans
 * l'index par distraction. Le hub sert le même contenu que `/resultats` ; sans
 * cette ligne, ce serait vingt-trois pages en double dans l'index, et Google
 * choisirait lui-même laquelle des deux versions montrer.
 *
 * Il n'apparaît pas non plus dans `sitemap.ts`, ni dans le pied de page du
 * site, ni dans les menus : on n'y arrive que par une publicité.
 *
 * **`noindex` n'est pas accompagné d'un `canonical` vers `/resultats`.** Les
 * deux signaux se contrediraient : le premier demande de ne pas indexer, le
 * second demande d'indexer ailleurs. Une page interdite d'index n'a pas besoin
 * de désigner son original.
 *
 * `nocache` et `noimageindex` complètent : ni copie en cache, ni vignettes des
 * affiches d'entretien dans la recherche d'images.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function LayoutHub({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* L'ordre est celui d'`avisServis`, donc celui d'`avis.ts` : le menu liste
     les entretiens dans le même ordre que le sommaire, sans quoi on chercherait
     dans le menu une entrée qu'on vient de voir ailleurs. */
  const entretiens = avisServis.flatMap((article) => {
    const temoignage = temoignages.find((t) => t.id === article.id);
    const entetes = titresHub[article.slug];
    if (!temoignage || !entetes) return [];
    return [
      { slug: article.slug, nom: temoignage.nom, ligne: entetes.carte },
    ];
  });

  return (
    /* Le rembourrage bas ne vaut que sur téléphone, et il est du même ordre que
       la barre fixe : sans lui, elle couvrirait les derniers mots de la page.
       Il n'existe pas au-dessus de `sm`, où la barre n'existe pas non plus. */
    <div className="pb-24 sm:pb-0">
      {/* La liste est calculée ici, dans un composant serveur, et **passée en
          propriété** à l'en-tête, qui est un composant client. Si celui-ci
          allait la chercher lui-même, il importerait `avis.ts`, donc cinq mille
          lignes de transcriptions partiraient dans le paquet JavaScript de
          chaque page du hub. Une page de publicité se charge vite ou ne se
          charge pas. */}
      <EnTeteHub />
      {children}
      <PiedHub entretiens={entretiens} />
      <BarreAppelHub />
    </div>
  );
}
