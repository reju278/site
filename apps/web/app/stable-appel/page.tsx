import { PageVideo } from "@/components/page-video";
import { appelStable, videoStable } from "@/contenu/pages-video";
import { liens } from "@/contenu/site";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

/**
 * `/stable` avec un bouton d'appel sous la vidéo, sur demande de Rémy. Même
 * vidéo, même titre, même suite ; l'aperçu de partage est celui de `/stable`.
 * L'adresse de l'appel porte sa balise Hyros, déjà posée dans `liens`.
 */
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

export default function StableAppel() {
  return (
    <PageVideo
      titre={videoStable.titre}
      video={videoStable}
      appel={{ href: liens.appel, libelle: appelStable.libelle }}
    />
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/stable-appel", metadonnees);
}
