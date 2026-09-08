import { PageLegale } from "@/components/page-legale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function Mentions() {
  return (
    <PageLegale
      titre="Mentions légales"
      attendu="l'éditeur (forme juridique, immatriculation, siège, capital, TVA, contact), le directeur de la publication et l'hébergeur. Ces mentions sont obligatoires et leur absence est sanctionnée."
    />
  );
}
