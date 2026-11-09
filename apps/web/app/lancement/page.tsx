import { PageVideo } from "@/components/page-video";
import { videoLancement } from "@/contenu/pages-video";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

const metadonnees: Metadata = {
  title: videoLancement.titre,
  description: videoLancement.description,
  ...partageTunnel({
    titre: `${videoLancement.titre} · Funnels Club`,
    description: videoLancement.description,
    image: "lancement",
    alt: videoLancement.titre,
  }),
};

export default function Lancement() {
  return <PageVideo titre={videoLancement.titre} video={videoLancement} />;
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/lancement", metadonnees);
}
