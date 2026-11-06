import type { Metadata } from "next";
import LayoutThanks, { metadata as metadonnees } from "../thanks/layout";

export const metadata: Metadata = {
  ...metadonnees,
  alternates: { canonical: "https://go.funnels.club/thanks-quizz" },
};

export default LayoutThanks;
