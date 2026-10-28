import { PageLegale } from "@/components/page-legale";
import { cgv } from "@/contenu/legal";
import type { Metadata } from "next";

/** Conditions générales de vente du site, sous le VSL Funnel. */
export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

export default function CgvVsl() {
  return <PageLegale titre="Conditions générales de vente" document={cgv} />;
}
