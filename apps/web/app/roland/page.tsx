import { BoutonScintillant } from "@/components/bouton-scintillant";
import { LecteurVideo } from "@/components/lecteur-video";
import { ParticulesHero } from "@/components/particules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
import { identiteRoland, presentationRoland } from "@/contenu/roland";
import { avecReglages } from "@/lib/reglages-seo";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

/**
 * La page du témoignage de Roland : un titre, la vidéo, un bouton.
 *
 * **Le dessin est celui de `/thanks`**, sur demande de Rémy : le hero
 * photographique et le titre, puis la vidéo posée à cheval sur la
 * photographie, seule : l'alerte rouge et la carte blanche ont été retirées
 * par Rémy. La seule sortie du tunnel est l'appel, juste en dessous.
 *
 * Un seul `h1`, le titre. Le bouton n'a pas de titre : un bloc d'appel n'est
 * jamais un `h2`.
 */

const metadonnees: Metadata = {
  title: identiteRoland.titrePage,
  description: identiteRoland.description,
};

export default function Roland() {
  const { titre, video, appel } = presentationRoland;

  return (
    <>
      <div id="haut" />

      {/* LE HERO, celui de `/thanks` : la section s'arrête à une hauteur
          connue, le haut de la carte plus une demi-vidéo, et la carte en
          ressort par une marge négative. Voir le commentaire de `/thanks`. */}
      <div id="presentation">
        <section
          data-hero
          /* **Sur téléphone, la jonction passe au milieu de la vidéo**, comme
             sur l'accueil : à 88 px, elle tombait sur le haut de la vidéo et
             la photographie n'en gardait qu'une bande. La vidéo remonte de sa
             demi-hauteur plus 0,5 rem, donc son milieu est à 8 px du bas de
             la section.

             `--jonction` passe par le style en ligne, seul à battre la règle
             globale de `[data-hero]` ; la valeur par largeur vit dans
             `--jonction-roland`, que les classes posent. */
          className="relative isolate flex flex-col px-5 pt-20 pb-[calc(var(--video-h)/2+3rem)] [--jonction-roland:8px] sm:pt-28 sm:[--jonction-roland:88px]"
          style={{ "--jonction": "var(--jonction-roland)" } as React.CSSProperties}
        >
          <div
            data-bande-sombre
            className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px)] -z-10 overflow-hidden bg-[var(--fond-hero)]"
          >
            <picture>
              <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fond-hero-mobile.jpg"
                alt=""
                width={1920}
                height={1097}
                fetchPriority="high"
                className="size-full object-cover object-bottom"
              />
            </picture>
            <div aria-hidden className="absolute inset-0 bg-black/55" />
            <ParticulesHero />
          </div>

          <div
            aria-hidden
            /* Sur téléphone, l'arrondi descend à l'échelle du site (5 px),
               sur demande de Rémy : le grand rayon y prenait trop de place. */
            className="absolute inset-x-0 -z-10 h-24 rounded-t-[var(--rayon-jonction)] bg-background max-sm:rounded-t-lg"
            style={{ bottom: "calc(var(--jonction) - 96px)" }}
          />

          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <TitreRoulant
              as="h1"
              segments={titre}
              className="titre text-[2rem] text-balance text-white sm:text-5xl lg:text-6xl"
            />
          </div>
        </section>

        {/* LA VIDÉO, seule, sans la carte blanche de `/thanks`, sur demande
            de Rémy : juste une ombre douce derrière elle. Elle remonte d'une
            demi-hauteur pour se poser à cheval sur la photographie. */}
        <section className="relative px-5 -mt-[calc(var(--video-h)/2+3rem-2.5rem)]">
          <div className="mx-auto max-w-[var(--largeur-video)]">
            <LecteurVideo
              id={video.id}
              titre={video.titre}
              secondes={video.secondes}
              affiche={`/temoignages/${video.id}.jpg`}
              afficheAlt="Roland Buffet en entretien vidéo avec Rémy Jupille, chacun depuis son bureau"
              natif
              className="shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
            />
          </div>
        </section>
      </div>

      {/* L'APPEL, seul sous la vidéo : le bouton de `/strategie`. L'adresse
          porte la provenance de cette page, `el=roland`, et non celle du
          site : voir `appelDepuis`. */}
      <section className="px-5 pt-10 pb-6 sm:pt-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <BoutonScintillant
            href={appel.href}
            className="min-h-16 w-full text-lg sm:w-auto sm:px-12 sm:text-xl"
          >
            <TexteRoulant>{appel.libelle}</TexteRoulant>
            <ArrowRight aria-hidden className="size-5 shrink-0" />
          </BoutonScintillant>
        </div>
      </section>
    </>
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/roland", metadonnees);
}
