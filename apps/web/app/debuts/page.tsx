import { PageVideo } from "@/components/page-video";
import { videoDebuts } from "@/contenu/pages-video";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

const metadonnees: Metadata = {
  title: videoDebuts.titre,
  description: videoDebuts.description,
  ...partageTunnel({
    titre: `${videoDebuts.titre} · Funnels Club`,
    description: videoDebuts.description,
    image: "debuts",
    alt: videoDebuts.titre,
  }),
};

export default function Debuts() {
  return <PageVideo titre={videoDebuts.titre} video={videoDebuts} />;
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/debuts", metadonnees);
}
