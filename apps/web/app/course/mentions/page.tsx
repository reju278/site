import { PageLegale } from "@/components/page-legale";
import { mentions } from "@/contenu/legal";
import type { Metadata } from "next";

/** Mentions légales du site, sous le VSL Funnel. */
export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function MentionsVsl() {
  return <PageLegale titre="Mentions légales" document={mentions} />;
}
