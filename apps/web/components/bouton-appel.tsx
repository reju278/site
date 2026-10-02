import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { cn } from "@repo/ui/lib/utils";

/** Un appel à réserver : l'ancre de la page qui porte le formulaire, et son libellé. */
export type AppelGalerie = { ancre: string; libelle: string };

/**
 * Le bouton d'appel de la galerie, centré, au dessin du bouton principal de
 * l'accueil, sur demande de Rémy.
 */
export function BoutonAppel({
  appel,
  className,
}: {
  appel: AppelGalerie;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)}>
      <BoutonScintillant href={appel.ancre} externe={false}>
        <TexteRoulant>{appel.libelle}</TexteRoulant>
      </BoutonScintillant>
    </div>
  );
}
