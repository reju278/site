import { CHEMINS_COURSE_MODELE } from "@/contenu/course-modele";
import { permanentRedirect } from "next/navigation";

/**
 * L'ancienne adresse de la vidéo de Course modèle. La page vit sous
 * `/course-modele/vsl` depuis le 24 novembre 2026 (« vsl » doit être dans
 * l'adresse, sur demande de Rémy) : un lien resté sur l'ancienne y mène.
 */
export default function AncienneVideoCourseModele() {
  permanentRedirect(CHEMINS_COURSE_MODELE.video);
}
