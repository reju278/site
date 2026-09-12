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
import { cn } from "@repo/ui/lib/utils";

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
 * tranchées par le bord, une barre de progression, puis un rang de seize
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
 * sur huit des seize, la moitié de la hauteur. Un cadre de 2,4/1 les faisait
 * disparaître sans toucher au fichier, et il a été essayé ; le 16/9 a été
 * préféré. Ce n'est pas un oubli : ces bandes sont **dans les vidéos**, et le
 * seul endroit où elles s'enlèvent pour de bon est le réexport des vidéos, pas
 * ce dépôt.
 *
 * `LecteurVideo` n'appelle Wistia qu'au clic : seize lecteurs chargés d'avance
 * mettraient la page à genoux, seize affiches servies par nous ne coûtent
 * presque rien.
 */
/**
 * L'habillage des deux flèches, écrit une fois.
 *
 * Elles sont les `CarouselPrevious` et `CarouselNext` du registre shadcn, avec
 * leur `variant` passé par leur propre API plutôt que des classes empilées
 * par-dessus. C'est le rond et l'ombre qui les rendent présentables, pas une
 * réécriture : le fichier de registre n'est pas touché, et il reste alignable
 * sur ses mises à jour.
 *
 * **Le nom accessible est réécrit.** Le registre pose « Previous slide » et
 * « Next slide » en `sr-only`. Sur un site en français, un lecteur d'écran
 * annoncerait deux commandes en anglais au milieu d'une page française ;
 * `aria-label` reprend la main et dit de quoi il s'agit, un témoignage et non
 * une diapositive.
 *
 * **Le fond est blanc plein.** À cette hauteur, la texture de la bande est
 * passée au lavande, où le blanc ne tient que 1,8:1 en thème clair : une
 * commande translucide y serait illisible. Sur blanc opaque, le glyphe en
 * `--bande-nuit` tient 14,9:1 dans les deux thèmes, sans rien devoir à ce qu'il
 * y a dessous.
 *
 * Les variantes `dark:` sont doublées, et il le faut : le bouton du registre
 * pose `dark:bg-input/30`, que `tailwind-merge` ne voit pas comme un conflit
 * avec `bg-white`. Sans elles, le fond retombe à 30 % d'opacité en thème sombre
 * et le glyphe ne vaut plus que 1,14:1. Voir `AGENTS.md`.
 */
const FLECHE = cn(
  // Douze pixels de plus que le rond du registre, qui en fait 32 : c'est sous
  // les 40 px de cible tactile que le projet demande.
  "static size-12 translate-y-0 border-0 shadow-lg shadow-black/25",
  "bg-white text-[var(--bande-nuit)] hover:bg-white hover:text-[var(--bande-nuit)]",
  "dark:border-0 dark:bg-white dark:text-[var(--bande-nuit)] dark:hover:bg-white",
  // Le survol passe par l'échelle et non par la couleur : sur un rond déjà
  // blanc, il n'y a pas de blanc plus clair pour répondre au geste.
  "transition-transform duration-300 hover:scale-105 active:scale-100",
  // À partir de `lg`, la bande laisse plus de cent pixels de marge de chaque
  // côté de la carte : les flèches s'y logent entièrement, hors de l'image.
  "lg:absolute lg:top-1/2 lg:-left-16 lg:-translate-y-1/2",
);

export function CarrouselTemoignages() {
  return (
    <Carousel
      opts={{ loop: true }}
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
          {temoignages.map((temoignage) => (
            <CarouselItem key={temoignage.id} className="basis-full">
              {/* L'ombre est large et douce plutôt que marquée : sur la texture
                  de la bande, une ombre nette dessinerait un contour dur autour
                  de la carte, alors qu'on veut qu'elle ait l'air posée dessus.
                  Le liseré clair fait le reste, `--border` n'ayant rien à voir
                  avec ce qu'il y a sous la bande. */}
              <LecteurVideo
                id={temoignage.id}
                titre={temoignage.nom}
                secondes={temoignage.secondes}
                affiche={`/temoignages/${temoignage.id}.jpg`}
                className="shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Les flèches. Leur habillage est dans `FLECHE`, plus haut.

            **Elles ne recouvrent jamais la vidéo.** Elles l'ont fait, à
            `left-2`, et le doigt tombait sur une flèche en voulant lancer la
            lecture. En dessous de `lg`, la marge n'existe pas et elles
            repassent sous la carte en une rangée centrée.

            `lg:contents` fait disparaître cette rangée de la mise en page sans
            retirer ses enfants, ce qui laisse les flèches se positionner par
            rapport au cadre de la carte. Sans lui, il faudrait deux paires, et
            un lecteur d'écran en annoncerait quatre. */}
        <div className="mt-6 flex justify-center gap-3 lg:contents">
          <CarouselPrevious
            variant="secondary"
            aria-label="Témoignage précédent"
            className={FLECHE}
          />
          <CarouselNext
            variant="secondary"
            aria-label="Témoignage suivant"
            className={cn(FLECHE, "lg:-right-16 lg:left-auto")}
          />
        </div>
      </div>
    </Carousel>
  );
}
