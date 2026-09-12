import { PageLegale } from "@/components/page-legale";
import { confidentialite } from "@/contenu/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Jupille Group Ltd collecte et traite vos données personnelles : finalités, destinataires, durées de conservation, cookies et droits RGPD.",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      document={confidentialite}
    />
  );
}
