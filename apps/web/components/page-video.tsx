import { LecteurVideo } from "@/components/lecteur-video";
import { LogoFunnels } from "@/components/logo-funnels";
import { PreuvesTunnel } from "@/components/preuves-tunnel";
import { insecables } from "@/lib/typographie";

/**
 * Une page de `go.funnels.club` faite d'une vidéo, sur le modèle de `/thanks`,
 * sur demande de Rémy : le titre tout en haut, la vidéo sans carte blanche,
 * puis la suite de la page telle quelle, de Roland à l'équipe.
 * Sert à `/debuts` et `/stable`, hors du Quizz Funnel.
 */
export function PageVideo({
  titre,
  video,
}: {
  titre: string;
  video: { id: string; secondes: number };
}) {
  return (
    <>
      <section className="px-5 pt-8 sm:pt-12">
        <div className="mx-auto max-w-[var(--largeur-video)]">
          {/* La marque, sur demande de Rémy. Sans lien : un tunnel ne se quitte
              pas par son logo. */}
          <p className="titre mb-6 flex items-center justify-center gap-2 text-xl text-foreground sm:mb-8 sm:text-2xl">
            <LogoFunnels className="size-[1.05em]" />
            Funnels.Club
          </p>
          <h1 className="titre mx-auto max-w-3xl text-center text-[1.625rem] leading-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
            {insecables(titre)}
          </h1>
          <LecteurVideo
            id={video.id}
            titre={titre}
            secondes={video.secondes}
            affiche={`/temoignages/${video.id}.jpg`}
            afficheAlt={titre}
            natif
            prioritaire
            className="mt-6 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55),0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/25 sm:mt-10"
          />
        </div>
      </section>
      <PreuvesTunnel />
    </>
  );
}
