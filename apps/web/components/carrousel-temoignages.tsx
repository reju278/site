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
import { cn } from "@repo/ui/lib/utils";
import { TrendingUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Les témoignages vidéo : une grande carte, et le rang des seize en dessous.
 *
 * La forme est celle de « Real customers. Real results. » de calendly.com, sur
 * demande de Rémy. Ce qui en est repris n'est pas le détail mais la
 * composition : **un seul sujet en grand au centre**, le reste du choix visible
 * autour sans jamais lui disputer la place, et le nom de la personne posé en
 * pastille plutôt qu'en légende.
 *
 * **Ce qui a été essayé et qui ne marche pas ici.** Calendly fait dépasser des
 * tuiles de part et d'autre de sa carte. Leurs tuiles sont des portraits
 * étroits ; les nôtres sont des vidéos en 16/9. Avec un carrousel centré, le
 * voisin commence exactement là où finit la carte : pour qu'il tienne entier
 * dans la largeur, la carte ne peut pas dépasser 36 % de la zone, soit 390 px
 * sur un écran de 1440. C'est plus petit que ce qu'on avait, et l'idée était
 * d'avoir plus grand. L'ancienne version prenait l'autre branche du compromis
 * et laissait le bord trancher les voisins en plein milieu, ce qui donnait des
 * demi-visages coupés à la verticale.
 *
 * D'où `basis-full` : **une carte occupe toute la zone visible**, donc rien
 * n'est jamais coupé, et elle peut être grande. Ce que les voisins disaient,
 * qu'il y en a d'autres, c'est le rang de miniatures qui le dit maintenant, et
 * il le dit mieux : on ne devine plus qu'il y en a d'autres, on voit les seize.
 *
 * **Les affiches restent celles de Wistia, au fichier près.** Le média n'en
 * expose qu'une, en 1280 sur 720, et c'est celle-là qu'on sert : rien n'est
 * remplacé ni réencodé.
 *
 * Elles portent les bandes noires de l'enregistrement, des appels à deux : sur
 * huit des seize, la moitié de la hauteur. Le cadre est donc en 2,4/1 et non en
 * 16/9, ce qui les fait disparaître **sans toucher au fichier**, et le lecteur
 * reçoit `fitStrategy=cover` pour recadrer de la même façon à la lecture. Sans
 * cette seconde moitié, le cadre sauterait au clic, ou le lecteur rétrécirait
 * l'image pour la faire tenir et on aurait déplacé les bandes d'un quart de
 * tour.
 *
 * Le cadre est sûr et non deviné : les seize affiches ont été relevées au
 * pixel. Leur contenu finit toutes à la même ligne, et la plus haute commence
 * à 48 sur 360 ; un cadre de 2,4/1 découvre la bande 47 à 313, donc il ne coupe
 * le contenu d'aucune des seize. Ce qui reste de noir sur certaines est dans la
 * vidéo elle-même, et ne s'enlève qu'en la réexportant.
 *
 * `LecteurVideo` n'appelle Wistia qu'au clic : seize lecteurs chargés d'avance
 * mettraient la page à genoux, seize affiches servies par nous ne coûtent
 * presque rien.
 */
export function CarrouselTemoignages() {
  const [api, setApi] = useState<CarouselApi>();
  const [courant, setCourant] = useState(0);

  /** Le rang, pour y faire glisser la miniature courante. */
  const rang = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    const suivre = () => setCourant(api.selectedScrollSnap());

    suivre();
    api.on("select", suivre);
    api.on("reInit", suivre);

    return () => {
      api.off("select", suivre);
      api.off("reInit", suivre);
    };
  }, [api]);

  /* La miniature courante se ramène au centre du rang.
   *
   * Sans ça, le rang ne suit pas les flèches : on avance de témoignage, la
   * miniature en relief est hors champ, et le rang ment sur l'endroit où on se
   * trouve. Sur téléphone, où il n'en montre que cinq sur seize, c'est la
   * moitié du temps.
   *
   * `block: "nearest"` est ce qui empêche le navigateur de faire défiler la
   * **page** en même temps que le rang. Et le glissement doux est demandé à la
   * requête média plutôt qu'écrit en dur : quelqu'un qui demande moins de
   * mouvement demande que rien ne bouge, pas que ça aille vite. */
  useEffect(() => {
    const tuile = rang.current?.querySelector<HTMLElement>(
      `[data-index="${courant}"]`,
    );
    if (!tuile) return;

    const moinsDeMouvement = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    tuile.scrollIntoView({
      behavior: moinsDeMouvement ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [courant]);

  const aller = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className="w-full"
      // Le nom vient de la section, pas du composant : un lecteur d'écran qui
      // annonce « carrousel » ne dit pas ce qu'il y a dedans.
      aria-label="Témoignages vidéo des membres"
    >
      <CarouselContent>
        {temoignages.map((temoignage) => (
          <CarouselItem key={temoignage.id} className="basis-full">
            {/* La carte.

                L'ombre est large et douce plutôt que marquée : sur la texture
                de la bande, une ombre nette dessinerait un contour dur autour
                du blanc, alors qu'on veut que la carte ait l'air posée dessus.
                Le liseré clair fait le reste, `--border` n'ayant rien à voir
                avec ce qu'il y a sous la bande. */}
            <figure className="mx-auto w-full max-w-3xl overflow-hidden rounded-md bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/20">
              <LecteurVideo
                id={temoignage.id}
                titre={temoignage.nom}
                secondes={temoignage.secondes}
                affiche={`/temoignages/${temoignage.id}.jpg`}
                recadre
              />

              {/* La légende.

                  Le nom passe en pastille bordée, comme chez Calendly, plutôt
                  qu'en ligne de texte : posé à même la carte sous une vidéo
                  pleine largeur, il flottait. La pastille lui donne un objet.

                  Le résultat garde la sienne, pleine et non bordée, parce que
                  c'est l'information que la carte existe pour porter : les deux
                  ne doivent pas peser pareil. Les témoignages qui n'en ont pas
                  n'affichent rien plutôt qu'une pastille vide. */}
              <figcaption className="flex flex-wrap items-center gap-2 p-4 sm:gap-3 sm:p-5">
                <p className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-card-foreground">
                  {temoignage.nom}
                </p>

                {temoignage.resultat ? (
                  <p className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                    <TrendingUp aria-hidden className="size-4 shrink-0" />
                    {temoignage.resultat}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Le rang des seize.

          Il remplace la barre de progression, et il fait plus qu'elle : une
          barre dit où l'on en est, le rang montre ce qu'il reste et laisse y
          aller directement. Seize points auraient dit la même chose que la
          barre, en moins lisible.

          `scrollbar-cachee` : la barre de défilement native traverserait le bas
          des miniatures. Le rang reste défilable au doigt, à la molette
          horizontale et au clavier par les boutons eux-mêmes.

          Les miniatures sont les affiches déjà servies aux cartes : aucun
          fichier de plus, et le navigateur les a en cache dès qu'une carte est
          passée.

          Elles sont recadrées en 2,4/1 comme la grande carte, pour la même
          raison et par le même calcul. Sur une tuile de 40 px de haut, les
          bandes noires ne laisseraient que vingt pixels de visage : seize
          rectangles noirs qui ne diraient rien. */}
      <div
        ref={rang}
        // Les deux bords se fondent au lieu de trancher. Un rang qui défile
        // coupe forcément une tuile à chaque bout ; le masque fait de cette
        // coupure une disparition, ce qui dit « ça continue » au lieu de
        // ressembler à un défaut de cadrage. C'est le même geste que sous le
        // paysage du pied de page.
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
        }}
        className="scrollbar-cachee mt-6 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mt-8 sm:gap-2.5"
      >
        {temoignages.map((temoignage, index) => {
          const actif = index === courant;

          return (
            <button
              key={temoignage.id}
              type="button"
              data-index={index}
              onClick={() => aller(index)}
              // `aria-current` dit lequel est montré. Le nom accessible porte
              // la personne, pas « miniature 3 ».
              aria-current={actif ? "true" : undefined}
              aria-label={`Voir le témoignage de ${temoignage.nom}`}
              title={temoignage.nom}
              className={cn(
                // La largeur est calée sur la hauteur et non l'inverse : en
                // 2,4/1, il faut 104 px de large pour tenir les 40 px de côté
                // que le projet demande à une cible tactile. En dessous, le
                // doigt tombe entre deux tuiles.
                "relative aspect-[2.4/1] w-[104px] shrink-0 snap-center overflow-hidden rounded-md bg-black transition duration-300 sm:w-[120px]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                actif
                  ? "opacity-100 ring-2 ring-white"
                  : "opacity-55 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/temoignages/${temoignage.id}.jpg`}
                // `alt=""` assumé : le nom est déjà porté par l'`aria-label` du
                // bouton, et le répéter ferait annoncer la destination deux
                // fois.
                alt=""
                width={640}
                height={360}
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Les flèches.

          Elles restent un confort de souris : le glissement au doigt, les
          flèches du clavier et le rang marchent sans elles.

          Elles sont opaques, et ce n'est pas un choix d'esthétique : à cette
          hauteur, la texture de la bande est passée au lavande, où le blanc ne
          tient que 2,13:1 en thème clair. Sur une pastille blanche pleine, le
          glyphe est en `--bande-nuit` et tient 14,9:1 dans les deux thèmes,
          sans rien devoir à ce qu'il y a dessous.

          **Les variantes `dark:` sont doublées, et il le faut.** La variante
          `outline` du registre pose `dark:bg-input/30` et `dark:border-input`.
          `tailwind-merge` ne les voit pas comme un conflit avec `bg-white` :
          ce sont deux groupes différents à ses yeux, donc les deux survivent
          et la règle préfixée gagne en thème sombre. Le fond retombait à 30 %
          d'opacité et le glyphe en `--bande-nuit` par-dessus ne tenait plus
          que **1,14:1**, c'est-à-dire invisible. Mesuré dans le navigateur,
          pas supposé : à l'œil, la pastille avait l'air simplement un peu
          grise. */}
      <div className="mt-6 flex justify-center gap-3 sm:mt-8">
        <CarouselPrevious className="static size-11 translate-y-0 border-transparent bg-white text-[var(--bande-nuit)] hover:bg-white/90 hover:text-[var(--bande-nuit)] dark:border-transparent dark:bg-white dark:text-[var(--bande-nuit)] dark:hover:bg-white/90" />
        <CarouselNext className="static size-11 translate-y-0 border-transparent bg-white text-[var(--bande-nuit)] hover:bg-white/90 hover:text-[var(--bande-nuit)] dark:border-transparent dark:bg-white dark:text-[var(--bande-nuit)] dark:hover:bg-white/90" />
      </div>
    </Carousel>
  );
}
