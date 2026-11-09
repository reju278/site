import { PageVideo } from "@/components/page-video";
import { appelConsulting, calendlyConsulting, videoConsulting } from "@/contenu/pages-video";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

/**
 * La vidéo consulting, puis un bouton vers le formulaire Calendly du consulting,
 * sur demande de Rémy : voir `calendlyConsulting`.
 */
const metadonnees: Metadata = {
  title: videoConsulting.titre,
  description: videoConsulting.description,
  ...partageTunnel({
    titre: `${videoConsulting.titre} · Funnels Club`,
    description: videoConsulting.description,
    image: "info-consulting",
    alt: videoConsulting.titre,
  }),
};

export default function InfoConsulting() {
  return (
    <PageVideo
      titre={videoConsulting.titre}
      video={videoConsulting}
      appel={{ href: calendlyConsulting, libelle: appelConsulting.libelle }}
    />
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/info-consulting", metadonnees);
}
