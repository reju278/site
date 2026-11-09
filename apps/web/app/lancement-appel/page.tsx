import { PageVideo } from "@/components/page-video";
import { appelLancement, videoLancement } from "@/contenu/pages-video";
import { liens } from "@/contenu/site";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

/**
 * `/lancement` avec un bouton d'appel sous la vidéo, sur demande de Rémy. Même
 * vidéo, même titre, même suite ; l'aperçu de partage est celui de `/lancement`.
 * L'adresse de l'appel porte sa balise Hyros, déjà posée dans `liens`.
 */
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

export default function LancementAppel() {
  return (
    <PageVideo
      titre={videoLancement.titre}
      video={videoLancement}
      appel={{ href: liens.appel, libelle: appelLancement.libelle }}
    />
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/lancement-appel", metadonnees);
}
