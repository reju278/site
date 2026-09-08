import { PageLegale } from "@/components/page-legale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

export default function Cgv() {
  return (
    <PageLegale
      titre="Conditions générales de vente"
      attendu="le contenu et le prix de chaque programme, le droit de rétractation applicable, les garanties, la réclamation et la juridiction. À écrire par un juriste, ou à remplacer par un renvoi vers le texte unique qui fait foi sur funnels.club."
    />
  );
}
