import { ATrancher, PageLegale } from "@/components/page-legale";
import { identite } from "@/contenu/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité" miseAJour="à compléter">
      <h2>Ce que ce site collecte</h2>
      <p>
        Ce site est un site vitrine. Il ne comporte ni compte, ni formulaire, ni
        base de données : aucune donnée personnelle n'y est saisie ni conservée
        par {identite.societe}.
      </p>
      <p>
        Les liens vers Funnels Club, YouTube et le livre mènent à des sites
        tiers, qui appliquent leurs propres politiques. Ce qui s'y passe ne
        relève plus de la présente politique.
      </p>

      <h2>Cookies et mesure d'audience</h2>
      <p>
        En l'état, ce site ne dépose aucun cookie et n'utilise aucun traceur.
        C'est pour cette raison qu'aucune bannière de consentement n'apparaît :
        une bannière sans traceur à consentir n'a pas d'objet.
      </p>
      <ATrancher>
        si un outil de mesure d'audience ou un pixel publicitaire est ajouté un
        jour, cette section doit être réécrite et une bannière de consentement
        devient obligatoire avant tout dépôt.
      </ATrancher>

      <h2>Hébergement et journaux techniques</h2>
      <p>
        L'hébergeur, Vercel Inc., conserve des journaux techniques nécessaires
        au fonctionnement et à la sécurité du service, notamment les adresses IP
        de connexion. Ce traitement relève de l'intérêt légitime au maintien en
        condition opérationnelle du site.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au règlement général sur la protection des données, vous
        disposez d'un droit d'accès, de rectification, d'effacement, de
        limitation, d'opposition et de portabilité sur les données vous
        concernant.
      </p>
      <ATrancher>
        l'adresse électronique à laquelle ces demandes doivent être adressées,
        ainsi que le délai de réponse annoncé.
      </ATrancher>
      <p>
        Vous pouvez également introduire une réclamation auprès de l'autorité de
        contrôle compétente.
      </p>
    </PageLegale>
  );
}
