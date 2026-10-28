import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { cn } from "@repo/ui/lib/utils";

/**
 * Un appel à réserver : l'ancre de la page qui porte le formulaire, et son
 * libellé. Sur `/video-vsl`, le formulaire est sur une autre page : `ancre`
 * est alors son adresse, `/appel`, et `nouvelOnglet` l'ouvre à côté, comme le
 * bouton principal de la page, pour que la vidéo reste ouverte. Avec
 * `encart`, l'article ouvert porte aussi un encart d'appel à mi-chemin, à la
 * façon du hub.
 */
export type AppelGalerie = {
  ancre: string;
  libelle: string;
  nouvelOnglet?: boolean;
  encart?: { titre: string; texte: string };
};

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
      <BoutonScintillant href={appel.ancre} externe={!!appel.nouvelOnglet}>
        <TexteRoulant>{appel.libelle}</TexteRoulant>
      </BoutonScintillant>
    </div>
  );
}

/**
 * L'encart d'appel au milieu d'un article ouvert dans la galerie, au dessin de
 * celui du hub (`AppelHubArticle`) : un titre, une phrase, un bouton.
 */
export function EncartAppel({ appel }: { appel: AppelGalerie }) {
  if (!appel.encart) return null;
  return (
    <aside className="relief-verre my-14 rounded-md border border-border bg-card p-6 sm:my-16 sm:p-8">
      <p className="titre text-2xl text-balance text-card-foreground sm:text-3xl">
        {appel.encart.titre}
      </p>
      <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
        {appel.encart.texte}
      </p>
      <div className="mt-6">
        <BoutonScintillant
          href={appel.ancre}
          externe={!!appel.nouvelOnglet}
          className="w-full sm:w-auto"
        >
          <TexteRoulant>{appel.libelle}</TexteRoulant>
        </BoutonScintillant>
      </div>
    </aside>
  );
}
