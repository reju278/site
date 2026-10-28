import { PageLegale } from "@/components/page-legale";
import { confidentialite } from "@/contenu/legal";
import type { Metadata } from "next";

/** Politique de confidentialité du site, sous le VSL Funnel. */
export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function ConfidentialiteVsl() {
  return <PageLegale titre="Politique de confidentialité" document={confidentialite} />;
}
