import { BoutonAppelRelaye } from "@/components/bouton-appel-relaye";
import { LecteurVideo } from "@/components/lecteur-video";
import { LogoFunnels } from "@/components/logo-funnels";
import { PreuvesTunnel } from "@/components/preuves-tunnel";
import { insecables } from "@/lib/typographie";

/**
 * Une page de `go.funnels.club` faite d'une vidéo, sur le modèle de `/thanks`,
 * sur demande de Rémy : le titre tout en haut, la vidéo sans carte blanche,
 * puis la suite de la page telle quelle, de Roland à l'équipe.
 * Sert à `/debuts`, `/stable`, `/lancement` et à leurs versions `-appel`, hors du Quizz Funnel.
 *
 * `appel`, facultatif, pose un bouton sous la vidéo : c'est ce qui distingue
 * la version `-appel` de sa page, sur demande de Rémy. Il s'ouvre dans un nouvel
 * onglet, le défaut de `BoutonScintillant`, pour que la vidéo continue, et
 * relaie le `el` et l'e-mail reçus : voir `BoutonAppelRelaye`.
 */
export function PageVideo({
  titre,
  video,
  appel,
}: {
  titre: string;
  video: { id: string; secondes: number };
  appel?: { href: string; libelle: string };
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
          {appel ? (
            <div className="mt-8 flex justify-center sm:mt-10">
              <BoutonAppelRelaye href={appel.href} libelle={appel.libelle} />
            </div>
          ) : null}
        </div>
      </section>
      <PreuvesTunnel />
    </>
  );
}
