"use client";

import { LecteurVideo } from "@/components/lecteur-video";
import { temoignages } from "@/contenu/site";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

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
 *
 * **Les commandes sont sous le carrousel et non dessus.** Elles flottaient par
 * dessus les cartes, à `left-2` en dessous de `sm` : sur un téléphone, les deux
 * flèches recouvraient l'image de la vidéo, c'est-à-dire exactement ce qu'on
 * demande au visiteur de regarder, et le doigt tombait sur une flèche en
 * voulant lancer la lecture. Descendues, elles ne cachent plus rien et gagnent
 * une barre de progression à leur droite, qui dit où l'on en est dans les
 * seize.
 */
export function CarrouselTemoignages() {
  const [api, setApi] = useState<CarouselApi>();
  const [courant, setCourant] = useState(0);

  useEffect(() => {
    if (!api) return;

    // `selectedScrollSnap` et non `scrollProgress` : le carrousel boucle, et
    // une progression continue repasserait à zéro en plein milieu du geste.
    const suivre = () => setCourant(api.selectedScrollSnap());

    suivre();
    api.on("select", suivre);
    api.on("reInit", suivre);

    return () => {
      api.off("select", suivre);
      api.off("reInit", suivre);
    };
  }, [api]);

  const total = temoignages.length;

  return (
    <Carousel
      setApi={setApi}
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
            {/* Le liseré clair tient lieu de bordure : sur la texture de la
                bande, `--border` n'a rien à voir avec ce qu'il y a dessous.
                L'ombre portée décolle la carte du dégradé, que le blanc pur
                sinon touche sans transition. */}
            <figure className="h-full overflow-hidden rounded-[var(--rayon-jonction)] bg-card ring-1 ring-white/15 shadow-xl shadow-black/20">
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

                {/* Le résultat est une pastille et non une ligne de texte
                    atténué : c'est l'information que la carte existe pour
                    porter, et à côté du nom en gras elle passait au second
                    plan. Les témoignages qui n'en ont pas n'affichent rien,
                    plutôt qu'une pastille vide. */}
                {temoignage.resultat ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-sm font-medium text-accent-foreground">
                    <TrendingUp aria-hidden className="size-4 shrink-0" />
                    {temoignage.resultat}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* La barre de commandes.

          Les flèches ne sont qu'un confort de souris : le glissement au doigt
          et les flèches du clavier marchent sans elles. Elles reprennent leur
          place dans le flux, `static`, parce que le registre les pose en
          `absolute` pour les faire flotter sur les cartes.

          `size-11` sur téléphone : le projet demande 40 px de côté minimum, et
          les boutons d'icône de shadcn en font 36.

          **Les commandes sont opaques, et ce n'est pas un choix d'esthétique.**
          Descendues sous le carrousel, elles se retrouvent à 81 % de la hauteur
          de la bande, c'est-à-dire en pleine zone claire de la texture : en
          thème clair, le fond y vaut `--bande-lavande`, où le blanc ne tient
          que 2,13:1. Un glyphe blanc translucide y était illisible. Sur une
          pastille blanche pleine, le glyphe est en `--bande-nuit` et tient
          14,9:1 en clair, 18,4:1 en sombre : il ne dépend plus du tout de ce
          qu'il y a dessous.

          La barre de progression applique le même principe autrement : son
          remplissage se lit contre **sa propre piste**, teintée en
          `--bande-nuit`, et non contre la bande. Le rapport est donc le même
          aux deux thèmes et à n'importe quelle hauteur. */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex shrink-0 gap-2">
          <CarouselPrevious className="static size-11 translate-y-0 border-transparent bg-white text-[var(--bande-nuit)] hover:bg-white/90 hover:text-[var(--bande-nuit)] sm:size-10" />
          <CarouselNext className="static size-11 translate-y-0 border-transparent bg-white text-[var(--bande-nuit)] hover:bg-white/90 hover:text-[var(--bande-nuit)] sm:size-10" />
        </div>

        {/* La progression.

            `aria-hidden` : elle redit ce qu'Embla annonce déjà par le
            `aria-roledescription` de chaque diapositive, et un lecteur d'écran
            n'a rien à faire d'une barre décorative. La transition est une
            transition CSS ordinaire, donc `globals.css` la neutralise déjà sous
            `prefers-reduced-motion`. */}
        <div
          aria-hidden
          className="h-1 w-full overflow-hidden rounded-md bg-[color-mix(in_oklab,var(--bande-nuit)_35%,transparent)]"
        >
          <div
            className="h-full rounded-md bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${((courant + 1) / total) * 100}%` }}
          />
        </div>
      </div>
    </Carousel>
  );
}
