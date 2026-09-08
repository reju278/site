import { ATrancher, PageLegale } from "@/components/page-legale";
import { identite } from "@/contenu/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function Mentions() {
  return (
    <PageLegale titre="Mentions légales" miseAJour="à compléter">
      <h2>Éditeur du site</h2>
      <p>
        Le présent site est édité par {identite.societe}. Directeur de la
        publication : {identite.nom}.
      </p>
      <ATrancher>
        forme juridique exacte, numéro d'immatriculation, adresse du siège,
        capital social, numéro de TVA intracommunautaire, adresse de contact et
        numéro de téléphone. Ces mentions sont obligatoires et leur absence est
        sanctionnée.
      </ATrancher>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina,
        CA 91723, États-Unis.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site, textes, images, vidéos et
        marques, est protégé par le droit de la propriété intellectuelle. Toute
        reproduction ou représentation, totale ou partielle, sans autorisation
        écrite préalable est interdite.
      </p>

      <h2>Résultats présentés</h2>
      <p>
        Les résultats mentionnés sur ce site sont ceux des personnes citées,
        obtenus dans leur propre contexte. Ils ne constituent ni une moyenne, ni
        une garantie, ni une promesse de résultat.
      </p>

      <h2>Relation avec les plateformes tierces</h2>
      <p>
        Ce site n'est ni affilié à Meta Platforms, Inc., ni à Google LLC, et
        n'est approuvé par aucune de ces sociétés. Les marques citées
        appartiennent à leurs détenteurs respectifs.
      </p>
    </PageLegale>
  );
}
