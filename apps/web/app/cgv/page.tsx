import { PageLegale } from "@/components/page-legale";
import { cgv } from "@/contenu/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Les conditions générales de vente de Jupille Group Ltd : commande, tarifs, paiement, rétractation, garantie de satisfaction et règlement des litiges.",
  robots: { index: false },
};

export default function Cgv() {
  return <PageLegale titre="Conditions générales de vente" document={cgv} />;
}
