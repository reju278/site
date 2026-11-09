import { PageVideo } from "@/components/page-video";
import { appelDebuts, videoDebuts } from "@/contenu/pages-video";
import { liens } from "@/contenu/site";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";

/**
 * `/debuts` avec un bouton d'appel sous la vidéo, sur demande de Rémy. Même
 * vidéo, même titre, même suite ; l'aperçu de partage est celui de `/debuts`.
 * L'adresse de l'appel porte sa balise Hyros, déjà posée dans `liens`.
 */
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

export default function DebutsAppel() {
  return (
    <PageVideo
      titre={videoDebuts.titre}
      video={videoDebuts}
      appel={{ href: liens.appel, libelle: appelDebuts.libelle }}
    />
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/debuts-appel", metadonnees);
}
