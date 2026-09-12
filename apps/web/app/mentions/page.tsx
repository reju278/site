import { PageLegale } from "@/components/page-legale";
import { mentions } from "@/contenu/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "L'éditeur du site : Jupille Group Ltd, son siège, son immatriculation, son hébergeur, le responsable de la publication et le droit applicable.",
  robots: { index: false },
};

export default function Mentions() {
  return <PageLegale titre="Mentions légales" document={mentions} />;
}
