import { PageLegale } from "@/components/page-legale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      attendu="ce qui est collecté, les cookies et traceurs éventuels, l'hébergeur et ses journaux, les droits RGPD et l'adresse à laquelle les exercer."
    />
  );
}
