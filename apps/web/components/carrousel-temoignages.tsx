"use client";

import { LecteurVideo } from "@/components/lecteur-video";
import { temoignageEnAvant, temoignages } from "@/contenu/site";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@repo/ui/components/carousel";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";

/**
 * Les témoignages vidéo : une vidéo à la fois, et deux flèches.
 *
 * La carte est celle de « Real people. Real results. » de functionhealth.com,
 * reprise sur demande de Rémy : la vidéo occupe toute la carte, le nom et le
 * résultat sont **en surimpression** sur un voile en bas, et la marque de
 * lecture est un disque au centre. Une seule différence, voulue : leur carte
 * est un portrait, la nôtre reste en paysage, parce que ce sont des appels
 * filmés et non des portraits tournés pour l'occasion.
 *
 * Le module n'a plus rien d'autre. Il a porté tour à tour des cartes voisines
 * tranchées par le bord, une barre de progression, puis un rang de
 * miniatures ; il ne garde que ce qui sert à passer d'une vidéo à la suivante.
 *
 * **`basis-full` est ce qui garantit qu'aucune vidéo n'est coupée.** Une carte
 * occupe toute la zone visible, donc le bord n'a jamais rien à trancher. C'est
 * aussi de la géométrie : dans un carrousel centré, le voisin commence là où
 * finit la carte courante, et le faire tenir entier obligerait à réduire la
 * carte à 36 % de la zone. Voir `AGENTS.md`.
 *
 * **Le cadre est en 16/9, sur décision de Rémy**, et les affiches sont celles
 * de Wistia au fichier près : le média n'en expose qu'une, en 1280 sur 720.
 *
 * Elles portent donc les bandes noires de l'enregistrement, des appels à deux :
 * sur huit d'entre elles, la moitié de la hauteur. Un cadre de 2,4/1 les faisait
 * disparaître sans toucher au fichier, et il a été essayé ; le 16/9 a été
 * préféré. Ce n'est pas un oubli : ces bandes sont **dans les vidéos**, et le
 * seul endroit où elles s'enlèvent pour de bon est le réexport des vidéos, pas
 * ce dépôt.
 *
 * `LecteurVideo` n'appelle Wistia qu'au clic : quinze lecteurs chargés
 * d'avance mettraient la page à genoux, quinze affiches servies par nous ne
 * coûtent presque rien.
 *
 * **Le carrousel ne démarre pas sur le premier témoignage.** Il démarre sur
 * celui que Rémy met en avant, `temoignageEnAvant` dans `site.ts`.
 *
 * **Et la vidéo qu'on quitte s'arrête.** C'est `actif` qui le fait : le lecteur
 * démonte son iframe dès qu'il cesse d'être le témoignage affiché. Sans ça, on
 * passe au suivant et la précédente continue de parler hors champ.
 */
/**
 * L'habillage des deux flèches, écrit une fois.
 *
 * Elles sont les `CarouselPrevious` et `CarouselNext` du registre shadcn, avec
 * leur `variant` passé par leur propre API plutôt que des classes empilées
 * par-dessus. C'est le rond, la taille et l'ombre qui les rendent présentables,
 * pas une réécriture : le fichier de registre n'est pas touché, et il reste
 * alignable sur ses mises à jour.
 *
 * **Elles n'ont plus de fond écrit en dur.** Elles en avaient un, blanc plein,
 * parce qu'elles se posaient sur la bande bleue et que le lavande de son bas ne
 * tenait pas le contraste. Le fond est maintenant celui du deck, une surface
 * claire en clair et sombre en sombre : la variante `outline` du registre, qui
 * suit `--background` et `--border`, fait exactement ce qu'il faut dans les
 * deux thèmes, et c'est une classe de moins à maintenir.
 *
 * Le nom accessible, lui, se réécrit. Le registre pose « Previous slide » et
 * « Next slide » en `sr-only` : sur un site en français, un lecteur d'écran
 * annoncerait deux commandes en anglais au milieu d'une page française.
 * `aria-label` reprend la main et dit de quoi il s'agit, un témoignage et non
 * une diapositive.
 */
const FLECHE = cn(
  // Douze pixels de plus que le rond du registre, qui en fait 32 : c'est sous
  // les 40 px de cible tactile que le projet demande.
  "static size-12 translate-y-0 shadow-md",
  // Le survol passe par l'échelle en plus de la couleur : la variante du
  // registre change déjà de fond, l'échelle ajoute la réponse au geste.
  "transition-transform duration-300 hover:scale-105 active:scale-100",
  // **Elles restent sous la carte à toutes les largeurs.** Elles ont flanqué
  // la carte un temps, dans la marge, et c'était bien : elles ne recouvraient
  // pas la vidéo et le geste était à portée. Mais cette marge ne fait que
  // 172 px sur un écran de 1440, et la tête de la courbe y vit aussi, avec sa
  // pastille. Deux objets n'y tiennent pas : la pastille passait sous les
  // flèches. Ce sont elles qui cèdent, parce qu'un rang centré sous la carte
  // est une place légitime, alors que la tête de courbe n'en a qu'une.
);

/* Le rang du témoignage mis en avant.
 *
 * Il est cherché par identifiant et non écrit en dur : l'ordre du tableau peut
 * changer sans que ce départ cesse d'être juste. `-1` devient `0`, donc une
 * suppression du témoignage en avant fait revenir au premier au lieu de
 * casser. */
const DEPART = Math.max(
  0,
  temoignages.findIndex((t) => t.id === temoignageEnAvant),
);

export function CarrouselTemoignages() {
  const [api, setApi] = useState<CarouselApi>();
  const [courant, setCourant] = useState(DEPART);

  /* On suit le témoignage affiché pour une seule raison : **couper la vidéo
     qu'on quitte**. Sans ça, on passe au suivant et la précédente continue de
     parler hors champ, ce qui est la pire façon de découvrir qu'un carrousel
     ne démonte pas ses diapositives. */
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

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, startIndex: DEPART }}
      className="w-full"
      // Le nom vient de la section, pas du composant : un lecteur d'écran qui
      // annonce « carrousel » ne dit pas ce qu'il y a dedans.
      aria-label="Témoignages vidéo des membres"
    >
      {/* Le cadre de positionnement des flèches.

          Il ne contient que la carte, et c'est ce qui permet aux flèches de se
          centrer sur elle. Posées sur la racine du carrousel, elles se
          centreraient sur la carte **plus** la rangée de secours du dessous,
          donc trop bas. */}
      <div className="relative mx-auto w-full max-w-3xl">
        <CarouselContent>
          {temoignages.map((temoignage, index) => (
            <CarouselItem key={temoignage.id} className="basis-full">
              {/* L'ombre est large et douce plutôt que marquée : sur la texture
                  de la bande, une ombre nette dessinerait un contour dur autour
                  de la carte, alors qu'on veut qu'elle ait l'air posée dessus.
                  Le liseré clair fait le reste, `--border` n'ayant rien à voir
                  avec ce qu'il y a sous la bande. */}
              {/* `data-carte` n'est pas décoratif : c'est ce repère que la
                  courbe mesure pour savoir où finit la carte et où commence la
                  marge dans laquelle poser sa tête. Sans lui, elle ne trouve
                  rien, croit que la carte occupe toute la largeur, et se cache.
                  Le repère est sur le conteneur et non sur le lecteur, parce
                  que c'est lui qui porte la largeur. */}
              <div data-carte className="mx-auto w-full max-w-3xl">
                <LecteurVideo
                  id={temoignage.id}
                  titre={temoignage.nom}
                  secondes={temoignage.secondes}
                  affiche={`/temoignages/${temoignage.id}.jpg`}
                  actif={index === courant}
                  className="border border-border shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)]"
                  legende={
                    <>
                      {/* Des `span` en `block` et non des `p` : la légende est
                        rendue dans le bouton de lecture, dont le contenu doit
                        rester du contenu de phrase. */}
                      <span className="block text-base font-semibold text-white sm:text-lg">
                        {temoignage.nom}
                      </span>
                      {temoignage.resultat ? (
                        <span className="mt-1 block text-sm text-white/85 sm:text-base">
                          {temoignage.resultat}
                        </span>
                      ) : null}
                    </>
                  }
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Les flèches. Leur habillage est dans `FLECHE`, plus haut.

            **Elles ne recouvrent jamais la vidéo.** Elles l'ont fait, à
            `left-2`, et le doigt tombait sur une flèche en voulant lancer la
            lecture. En dessous de `lg`, la marge n'existe pas et elles
            repassent sous la carte en une rangée centrée.

            Elles ont flanqué la carte un temps, dans la marge à partir de `lg`.
            C'était bien, et c'est la tête de la courbe qui les a délogées : la
            marge ne fait que 172 px sur un écran de 1440, et sa pastille y vit
            aussi. Deux objets n'y tiennent pas. */}
        <div className="mt-8 flex justify-center gap-3">
          <CarouselPrevious
            variant="outline"
            aria-label="Témoignage précédent"
            className={FLECHE}
          />
          <CarouselNext
            variant="outline"
            aria-label="Témoignage suivant"
            className={FLECHE}
          />
        </div>
      </div>
    </Carousel>
  );
}
