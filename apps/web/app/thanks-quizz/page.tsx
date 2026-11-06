import type { Metadata } from "next";
import { generateMetadata as metadonneesThanks } from "../thanks/page";
import { avecReglages } from "@/lib/reglages-seo";

/**
 * La confirmation du Quizz Funnel (NL), `go.funnels.club/thanks-quizz` : la
 * même page que `/thanks`, à sa propre adresse pour se suivre à part.
 */
export { default } from "../thanks/page";

export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/thanks-quizz", await metadonneesThanks());
}
