"use client";

import { LecteurVideo } from "@/components/lecteur-video";
import { temoignages } from "@/contenu/site";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";

/**
 * Les témoignages vidéo, en cartes qu'on fait défiler.
 *
 * La forme est reprise de la section « Real customers » de calendly.com, sur
 * demande de Rémy : une carte au centre, les voisines qui dépassent de chaque
 * côté pour dire qu'il y en a d'autres, et le défilement à la main.
 *
 * Le carrousel vient du registre shadcn, bâti sur Embla. Embla gère seul le
 * glissement au doigt, la molette horizontale, les flèches du clavier et
 * l'inertie : trois choses qu'on écrirait mal à la main, et une quatrième,
 * l'accessibilité, qu'on oublierait.
 *
 * **Chaque carte porte son lecteur, pas une image.** `LecteurVideo` n'appelle
 * Wistia qu'au clic : seize lecteurs chargés d'avance mettraient la page à
 * genoux, seize affiches servies par nous ne coûtent presque rien.
 *
 * Les largeurs sont en fractions de la zone visible et non en pixels : une
 * carte par écran sur téléphone, deux à partir de `sm`, et un peu moins de
 * trois sur grand écran, ce qui laisse dépasser la troisième et donne
 * l'impression de suite.
 */
export function CarrouselTemoignages() {
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      className="w-full"
      // Le nom vient de la section, pas du composant : un lecteur d'écran qui
      // annonce « carrousel » ne dit pas ce qu'il y a dedans.
      aria-label="Témoignages vidéo des membres"
    >
      <CarouselContent className="-ml-4">
        {temoignages.map((temoignage) => (
          <CarouselItem
            key={temoignage.id}
            className="basis-full pl-4 sm:basis-1/2 lg:basis-[38%]"
          >
            <figure className="overflow-hidden rounded-[var(--rayon-jonction)] bg-card">
              <LecteurVideo
                id={temoignage.id}
                titre={temoignage.nom}
                secondes={temoignage.secondes}
                affiche={`/temoignages/${temoignage.id}.jpg`}
              />

              {/* La légende est sur la carte, donc sur `--card` et non sur la
                  texture : les jetons sémantiques reprennent la main ici, et
                  le blanc de la bande n'a plus cours. */}
              <figcaption className="p-5">
                <p className="font-semibold text-card-foreground">
                  {temoignage.nom}
                </p>
                {temoignage.resultat ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {temoignage.resultat}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Les flèches ne sont qu'un confort de souris : le glissement au doigt
          et les flèches du clavier marchent sans elles. Elles sortent du cadre
          sur grand écran et reviennent dedans en dessous, où il n'y a pas la
          place. */}
      <CarouselPrevious className="left-2 size-10 border-white/30 bg-white/15 text-white hover:bg-white/25 hover:text-white sm:-left-4" />
      <CarouselNext className="right-2 size-10 border-white/30 bg-white/15 text-white hover:bg-white/25 hover:text-white sm:-right-4" />
    </Carousel>
  );
}
