import { BlocReservation } from "@/components/bloc-reservation";
import { CarrouselTemoignages } from "@/components/carrousel-temoignages";
import { LecteurVideo } from "@/components/lecteur-video";
import { Emplacement } from "@/components/section";
import { appelGenesis } from "@/contenu/formation-genesis";
import type { Metadata } from "next";

/**
 * La réservation de l'appel depuis la Formation Genesis,
 * `go.funnels.club/formation-genesis/appel` (issue #8). On y arrive par la
 * carte d'appel de l'espace membre.
 *
 * **La structure vient d'une page de réservation relevée par Rémy** : la
 * preuve d'abord, puis qui parle et ce qu'on propose, puis le formulaire.
 *
 * - **Les témoignages** sont le carrousel de l'accueil, `temoignages` de
 *   `site.ts` : tirés des entretiens, jamais réécrits, et sans lien sortant.
 * - **La vidéo de Rémy et la description de Funnels Club** attendent leur
 *   contenu, en `<Emplacement>`.
 * - **Le formulaire est celui d'`/appel`**, `BlocReservation` : les mêmes
 *   questions, le même rendez-vous Calendly par l'API, et la même suite,
 *   `/thanks`. Il se préremplit du prénom et de l'e-mail donnés à l'optin.
 *
 * Pas de jeton de page ClickFunnels ni de SDK : cette page n'est l'étape
 * d'aucun tunnel ClickFunnels, et compter ses visites dans « Appel »
 * fausserait celles du VSL.
 */
export const metadata: Metadata = {
  title: { absolute: `${appelGenesis.titrePage} · Funnels Club` },
  alternates: {
    canonical: "https://go.funnels.club/formation-genesis/appel",
  },
};

export default function AppelGenesis() {
  const { titre, video, description } = appelGenesis;

  return (
    <main className="pt-8 sm:pt-12">
      <header className="px-5 text-center">
        <h1 className="titre mx-auto max-w-3xl text-[clamp(1.6rem,7vw,2.25rem)] leading-tight text-balance text-foreground sm:text-5xl">
          {titre ?? "Réserve ton appel"}
        </h1>
        {titre ? null : (
          <Emplacement
            attendu="le titre de la page de réservation"
            className="mx-auto mt-3 min-h-0 max-w-3xl py-3"
          />
        )}
      </header>

      {/* LES TÉMOIGNAGES, en tête. */}
      <section aria-label="Témoignages" className="pt-8 sm:pt-12">
        <CarrouselTemoignages />
      </section>

      {/* LA VIDÉO DE RÉMY ET FUNNELS CLUB, côte à côte en large. */}
      <section
        aria-label="Funnels Club"
        className="mx-auto grid max-w-[var(--largeur-video)] grid-cols-1 items-center gap-6 pt-12 sm:pt-16 lg:grid-cols-[3fr_2fr] lg:gap-10"
      >
        {video ? (
          <LecteurVideo
            id={video.id}
            titre={video.titre}
            secondes={video.secondes}
            affiche={`/temoignages/${video.id}.jpg`}
            afficheAlt={video.titre}
            natif
          />
        ) : (
          <Emplacement
            attendu="la vidéo de Rémy, sur Wistia"
            className="aspect-video min-h-0"
          />
        )}
        {description ? (
          <p className="text-lg text-pretty text-foreground/85">
            {description}
          </p>
        ) : (
          <Emplacement attendu="la description de Funnels Club" />
        )}
      </section>

      {/* LE FORMULAIRE, celui d'`/appel`. Son titre descend en `h2` : la
          page porte déjà le sien. */}
      <div id="reservation" className="scroll-mt-8 px-5 pt-12 sm:pt-16">
        <BlocReservation niveauTitre="h2" />
      </div>
    </main>
  );
}
