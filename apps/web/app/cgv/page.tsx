import { ATrancher, PageLegale } from "@/components/page-legale";
import { identite } from "@/contenu/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

export default function Cgv() {
  return (
    <PageLegale
      titre="Conditions générales de vente"
      miseAJour="à compléter"
    >
      <h2>Objet</h2>
      <p>
        Les présentes conditions régissent la vente des programmes de formation
        proposés par {identite.societe}.
      </p>
      <p>
        Aucune vente n'est conclue sur ce site : le paiement et la souscription
        se font sur funnels.club. Les conditions applicables à une commande sont
        celles acceptées au moment de cette commande, sur la plateforme où elle
        est passée.
      </p>
      <ATrancher>
        vérifier si ces conditions doivent vivre ici ou uniquement sur
        funnels.club. Deux jeux de conditions qui divergent valent moins que
        pas de page du tout : mieux vaut une page qui renvoie vers le texte
        unique faisant foi.
      </ATrancher>

      <h2>Les programmes</h2>
      <h3>Funnels Club</h3>
      <ATrancher>
        contenu exact livré, durée d'accès, format des sessions, modalités
        d'accompagnement, prix et échéancier.
      </ATrancher>

      <h3>F.C. Mastermind</h3>
      <ATrancher>
        conditions d'admission, durée d'engagement, ce qui est inclus, prix et
        échéancier.
      </ATrancher>

      <h2>Droit de rétractation</h2>
      <ATrancher>
        régime applicable et sa base légale. Le délai de quatorze jours du code
        de la consommation ne s'applique pas de la même façon selon que
        l'acheteur agit à titre professionnel ou non, et selon que l'exécution a
        commencé avec son accord exprès. Cette section doit être écrite par un
        juriste, pas approchée.
      </ATrancher>

      <h2>Garanties et engagements</h2>
      <p>
        Les programmes constituent une obligation de moyens et non de résultat.
        Les résultats obtenus dépendent du travail fourni, du marché visé et des
        moyens engagés par la personne accompagnée.
      </p>

      <h2>Réclamations et litiges</h2>
      <ATrancher>
        adresse de réclamation, médiateur de la consommation compétent, droit
        applicable et juridiction.
      </ATrancher>
    </PageLegale>
  );
}
