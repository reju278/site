import { PageVideo } from "@/components/page-video";
import { videoStable } from "@/contenu/pages-video";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

const metadonnees: Metadata = {
  title: videoStable.titre,
  description: videoStable.description,
  ...partageTunnel({
    titre: `${videoStable.titre} · Funnels Club`,
    description: videoStable.description,
    image: "stable",
    alt: videoStable.titre,
  }),
};

export default function Stable() {
  return <PageVideo titre={videoStable.titre} video={videoStable} />;
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/stable", metadonnees);
}
