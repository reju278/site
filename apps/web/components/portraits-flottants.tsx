"use client";

import { cn } from "@repo/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Le titre d'une section, entouré de portraits qui flottent.
 *
 * C'est `AnimatedTestimonialGrid` de 21st.dev, fourni par Rémy. Ce qui en vient
 * tel quel : la construction, des portraits en position absolue autour d'un
 * contenu centré, le principe d'un tableau de positions écrit en dur, et la
 * forme de leurs trois tirages au hasard.
 *
 * **Les positions, elles, ne sont plus les leurs**, et c'est une demande
 * successive de Rémy : rien sous le titre, plus de visages, des tailles variées
 * et une profondeur de champ. Leurs quinze positions en portaient onze sur
 * ordinateur, toutes de taille voisine, quatre d'entre elles sous le titre.
 * Aucune de ces trois demandes ne pouvait se satisfaire en recopiant.
 *
 * **Leur registre est fermé**, comme ReUI : `21st.dev/r/…` rend un 403
 * `authentication_required`, et la commande `shadcn add` qu'ils affichent
 * demande une clé. Ce code-ci vient donc du copier-coller de Rémy et non d'une
 * installation, ce qui veut dire qu'il **ne se réalignera pas tout seul** sur
 * leurs mises à jour. C'est la raison pour laquelle il vit ici, dans nos
 * composants, et non dans `packages/ui` à côté du code de registre.
 *
 * **Ce qui est repris, et ce qui ne l'est pas.** Leur composant rend une
 * section complète : les portraits, une pastille, un `h1`, un chapô et un
 * bouton d'appel. Nous n'en gardons que les portraits, et le reste arrive en
 * `children`. Trois raisons, et aucune n'est une préférence :
 *
 * - **Leur titre est un `h1`.** La page en a déjà un, et deux `h1` cassent le
 *   plan que les robots lisent. Le nôtre est un `h2`, et c'est `TitreRoulant`
 *   qui le rend, avec l'animation mot à mot que ce dépôt demande pour tous ses
 *   titres de section.
 * - **Leur bouton est un lien sortant**, et `/immersion` est un tunnel : il n'y
 *   a aucun lien sortant sur cette page, c'est la règle et elle a été vérifiée
 *   en comptant les liens rendus.
 * - **Leur pastille n'est pas la nôtre.** La section a déjà son étiquette entre
 *   crochets, relevée ailleurs.
 *
 * **Deux adaptations, toutes deux obligatoires.**
 *
 * - **`framer-motion` devient `motion/react`.** C'est le même paquet sous son
 *   nom actuel, et c'est celui que le dépôt a déjà. Installer l'ancien nom à
 *   côté ferait deux copies de la même bibliothèque, ce que ce dépôt interdit.
 * - **Le hasard est tiré après le rendu.** Leur fichier appelle `Math.random()`
 *   dans le corps du composant, donc à chaque rendu et des deux côtés de
 *   l'hydratation : le serveur et le navigateur n'écriraient pas les mêmes
 *   délais. Les valeurs sont tirées une fois dans un `useEffect`, exactement
 *   comme `LightRays` le fait pour ses rayons.
 *
 * **Trois plans, et il n'en reste que deux signes : la taille et l'amplitude
 * du flottement.** Ce qui est loin est petit et se déplace peu, c'est la
 * parallaxe. Les deux autres signes ont été essayés et retirés par Rémy, et les
 * deux retraits disent la même chose : **une photographie de quelqu'un ne
 * s'abîme pas pour faire joli.**
 *
 * - **Le flou**, d'abord. Sur un visage de quarante pixels posé sur une page
 *   claire, trois pixels de flou ne se lisent pas comme de la distance mais
 *   comme une image mal chargée.
 * - **L'opacité** ensuite, et le défaut était plus net : les portraits partent
 *   tous du centre et **se croisent en chemin**, donc pendant une seconde on
 *   voyait au travers les uns des autres. Une photo translucide n'a pas l'air
 *   lointaine, elle a l'air cassée. Ils sont tous pleins, et c'est le `z-index`
 *   qui décide lequel passe devant, par plan : le grand est devant le petit,
 *   comme dans le monde.
 *
 * **Une ombre portée légère les décolle**, sur sa demande. Ce n'est pas le
 * `shadow-xl` du fichier d'origine, qui dessinait une carte blanche sous chaque
 * visage : c'est une ombre basse et très diffuse, du même genre que celles des
 * cartes du site.
 *
 * **Le flottement suit le plan, et c'est le quatrième signe.** Un objet proche
 * se déplace plus qu'un objet lointain, c'est la parallaxe : l'amplitude tirée
 * au hasard est donc multipliée par celle du plan. Sans ça, quinze portraits de
 * trois tailles bougent tous pareil et la profondeur se défait dès que ça bouge.
 *
 * **Rien n'est aligné sur un arc**, sur sa demande aussi. Les places du haut
 * avaient toutes leur `top` dans la même bande étroite, ce qui dessinait une
 * couronne au-dessus du titre ; elles s'échelonnent maintenant sur toute la
 * hauteur de la zone, et leurs abscisses sont réparties plutôt que régulières.
 *
 * **Aucune ne se superpose à une autre**, et ça se mesure, deux à deux, à
 * chaque largeur. Deux portraits qui se recouvrent ne se lisent pas comme de la
 * profondeur mais comme une erreur de placement, ce que Rémy a vu tout de suite.
 *
 * **L'opacité passe par l'animation et non par une classe.** Motion écrit
 * `opacity` en style, donc une classe `opacity-*` est écrasée à la première
 * image : c'est la même famille de panne que `tailwind-merge` et les classes
 * préfixées, une règle qui est là et n'agit pas. Le flou, lui, reste en classe,
 * puisqu'il n'est pas animé.
 *
 * **Les portraits latéraux n'existent qu'à partir de `xl`.** Ce n'est pas un
 * choix de densité, c'est de la géométrie : le bloc de texte fait `max-w-3xl`,
 * donc 768 px, et la section `max-w-7xl`. En dessous de 1280 px, il ne reste
 * plus de couloir de chaque côté, et un portrait posé à gauche se retrouve sur
 * les mots. Ceux du haut, eux, n'ont pas ce problème et descendent jusqu'au
 * téléphone.
 *
 * **Ils sont ronds et sans ombre**, sur demande de Rémy, là où leur fichier
 * pose un carré arrondi et un `shadow-xl`. Les deux changements se tiennent :
 * ce sont des photos de profil, et `rounded-full` leur est réservé par ce
 * dépôt ; quant à l'ombre, elle dessinait une carte blanche sous chaque visage,
 * c'est-à-dire un objet de plus à regarder là où il n'y a qu'un portrait.
 *
 * **Ils s'ouvrent depuis le centre quand la section entre dans la vue**, sur
 * demande de Rémy : « elles partent du centre, elles s'ouvrent, ça fait une
 * petite explosion, mais de façon fluide ». Leur fichier ne fait que les
 * grossir sur place, au chargement ; ici ils partent tous du milieu de la
 * section et rejoignent leur place.
 *
 * **Le point de départ se mesure, il ne se calcule pas.** Chaque portrait est
 * posé en pourcentage de la section, et `x` / `y` chez Motion s'expriment en
 * pourcentage de l'élément lui-même : il n'y a aucune écriture CSS qui dise
 * « d'ici jusqu'au centre du parent ». On rend donc les portraits une première
 * fois inertes et invisibles, on relève leur écart au centre, et on ne les
 * confie à Motion qu'ensuite. Le premier passage ne se voit pas, il est
 * transparent et immédiat.
 *
 * **Le ressort n'est plus le leur, et c'est assumé.** Le leur, 260 de raideur
 * pour 20 d'amortissement, est juste pour un grossissement sur place ; sur une
 * trajectoire de plusieurs centaines de pixels, il claque au lieu de s'ouvrir.
 * Celui-ci est plus souple et plus lourd, donc plus long, ce qui est le mot
 * « fluide » de la demande. Les retards, eux, restent les leurs : tirés au
 * hasard entre zéro et une demi-seconde, ce qui fait que les portraits ne
 * partent pas ensemble.
 *
 * **L'ouverture ne joue qu'une fois**, `once`. Une explosion qui se rejoue à
 * chaque passage devant la section cesse d'être un accueil et devient un tic.
 *
 * **Sous mouvement réduit, les portraits restent, le mouvement part.** Ils sont
 * animés par Motion, donc en JavaScript, hors de portée de la règle globale de
 * `globals.css`. Mais contrairement aux rayons de lumière, qu'on ne rend pas du
 * tout, ce sont ici des personnes : on les affiche en place, sans apparition ni
 * flottement.
 */

/** Leurs quinze positions, recopiées. Onze au-dessus de `md`, quatre en dessous. */
type Plan = 1 | 2 | 3;

/**
 * Ce que chaque plan donne à un portrait : son rang et son amplitude.
 *
 * `rang` sert de `z-index`, et il reste **sous le dix** du bloc de texte : un
 * portrait ne passe jamais devant les mots.
 */
const PLANS: Record<Plan, { rang: number; ampleur: number }> = {
  1: { rang: 3, ampleur: 1 },
  2: { rang: 2, ampleur: 0.6 },
  3: { rang: 1, ampleur: 0.35 },
};

/** L'ombre portée, légère : elle décolle le portrait sans dessiner une carte. */
const OMBRE = "shadow-[0_8px_20px_-10px_rgba(0,0,0,0.35)]";

const POSITIONS: {
  top: string;
  left?: string;
  right?: string;
  plan: Plan;
  className: string;
}[] = [
  /* Au-dessus du titre, et **en pixels et non en pourcentage**. La zone haute
     est le rembourrage de la section, qui vaut 224 px à partir de `sm` : une
     valeur fixe. Les tops écrits en pourcentage suivaient la hauteur totale, qui
     dépend du nombre de lignes du titre et du chapô, donc un portrait
     parfaitement placé à une largeur descendait sur les mots à une autre.

     **Chaque place déclare la largeur à partir de laquelle elle existe**, et
     ce seuil se mesure : deux portraits qui ne se touchent pas à 1280 px
     peuvent se recouvrir à 1024, puisque leurs abscisses sont en pourcentage et
     leurs tailles en pixels. Sept visages à 768 px, onze à 1024, quinze à 1280,
     et zéro croisement aux trois. */
  { top: "18px", left: "10%", plan: 1, className: "hidden md:block w-28 h-28" },
  { top: "100px", right: "12%", plan: 1, className: "hidden lg:block w-24 h-24" },
  { top: "136px", left: "20%", plan: 2, className: "hidden lg:block w-20 h-20" },
  { top: "8px", left: "40%", plan: 2, className: "hidden md:block w-16 h-16" },
  { top: "118px", left: "33%", plan: 3, className: "hidden md:block w-14 h-14" },
  { top: "36px", right: "28%", plan: 2, className: "hidden md:block w-16 h-16" },
  { top: "154px", left: "3%", plan: 3, className: "hidden md:block w-12 h-12" },
  { top: "54px", left: "25%", plan: 3, className: "hidden md:block w-10 h-10" },
  { top: "4px", right: "40%", plan: 3, className: "hidden md:block w-12 h-12" },
  { top: "82px", left: "45%", plan: 3, className: "hidden lg:block w-10 h-10" },
  { top: "172px", right: "30%", plan: 3, className: "hidden lg:block w-10 h-10" },

  /* Sur les côtés, au niveau du texte. Elles demandent un couloir, donc `xl`.

     **Leurs tops sont en pixels eux aussi**, et c'est la correction du même
     défaut : écrits en pourcentage, ils suivaient la hauteur totale, qui dépend
     de la longueur du chapô. Le chapô a justement doublé, et la grande de
     gauche est venue se poser sur la petite du coin. Comptés depuis le haut, ils
     restent au niveau du texte, qui commence lui aussi à une distance fixe.

     **Il y en a deux par côté et non trois.** La troisième ne tenait pas sans
     recouvrir une voisine, et deux portraits qui se recouvrent ne se lisent pas
     comme de la profondeur mais comme une erreur de placement. */
  { top: "236px", left: "1%", plan: 1, className: "hidden xl:block w-32 h-32" },
  { top: "250px", left: "14%", plan: 3, className: "hidden xl:block w-12 h-12" },
  { top: "228px", right: "1%", plan: 1, className: "hidden xl:block w-32 h-32" },
  { top: "262px", right: "15%", plan: 3, className: "hidden xl:block w-12 h-12" },

  /* Sur téléphone, tout tient au-dessus du titre : le bloc de texte y prend
     toute la largeur, il n'y a aucun côté disponible. La zone haute y vaut
     176 px, d'où des tops plus serrés. */
  { top: "8px", left: "3%", plan: 1, className: "block md:hidden w-20 h-20" },
  { top: "4px", right: "5%", plan: 1, className: "block md:hidden w-16 h-16" },
  { top: "100px", left: "30%", plan: 3, className: "block md:hidden w-12 h-12" },
  { top: "96px", right: "26%", plan: 3, className: "block md:hidden w-10 h-10" },
];

/** Le nombre de places posées. C'est lui qui décide combien de membres on prend. */
export const PLACES_PORTRAITS = POSITIONS.length;

/** Ce qu'un tirage donne à un portrait : son retard d'entrée et son flottement. */
type Tirage = { retard: number; montee: number; duree: number };

/** L'écart d'un portrait au centre de la section, en pixels. */
type Ecart = { x: number; y: number };

export function PortraitsFlottants({
  portraits,
  className,
  children,
}: {
  portraits: readonly { src: string; alt: string }[];
  className?: string;
  children: React.ReactNode;
}) {
  const sansMouvement = useReducedMotion();
  const [tirages, setTirages] = useState<Tirage[]>([]);
  const [ecarts, setEcarts] = useState<Ecart[] | null>(null);
  const section = useRef<HTMLElement>(null);
  const places = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    /* Leurs trois formules, au chiffre près : un retard jusqu'à une demi-
       seconde, une montée de cinq à vingt pixels, une durée de cinq à neuf
       secondes. */
    setTirages(
      POSITIONS.map(() => ({
        retard: Math.random() * 0.5,
        montee: Math.random() * -15 - 5,
        duree: Math.random() * 4 + 5,
      })),
    );
  }, []);

  useEffect(() => {
    const relever = () => {
      const cadre = section.current;
      if (!cadre) return;

      /* Le centre de la section, et l'écart de chaque portrait jusqu'à lui.
         C'est la mise en page qu'on relève, pas l'animation : à ce moment-là
         aucune transformation n'a encore été posée. */
      const boite = cadre.getBoundingClientRect();
      const centreX = boite.left + boite.width / 2;
      const centreY = boite.top + boite.height / 2;

      setEcarts(
        POSITIONS.map((_, i) => {
          const el = places.current[i];
          if (!el) return { x: 0, y: 0 };
          const r = el.getBoundingClientRect();
          return {
            x: centreX - (r.left + r.width / 2),
            y: centreY - (r.top + r.height / 2),
          };
        }),
      );
    };

    relever();
    window.addEventListener("resize", relever);
    return () => window.removeEventListener("resize", relever);
  }, []);

  return (
    <section
      ref={section}
      className={cn(
        "relative mx-auto w-full max-w-7xl px-4 pt-44 pb-8 sm:pt-56 sm:pb-10",
        className,
      )}
    >
      {portraits.slice(0, POSITIONS.length).map((portrait, i) => {
        const place = POSITIONS[i]!;
        const plan = PLANS[place.plan];
        const tirage = tirages[i];
        const ecart = ecarts?.[i];

        const cadre = cn("absolute rounded-full", OMBRE, place.className);
        const pose = {
          top: place.top,
          left: place.left,
          right: place.right,
          zIndex: plan.rang,
        };

        /* Premier passage : une boîte inerte, à sa place et invisible, dont le
           seul travail est de se laisser mesurer. */
        if (!ecart) {
          return (
            <div
              key={portrait.src}
              ref={(el) => {
                places.current[i] = el;
              }}
              aria-hidden
              className={cn(cadre, "opacity-0")}
              style={pose}
            />
          );
        }

        return (
          <motion.div
            key={portrait.src}
            className={cadre}
            style={pose}
            initial={
              sansMouvement
                ? undefined
                : { opacity: 0, scale: 0.3, x: ecart.x, y: ecart.y }
            }
            whileInView={
              sansMouvement
                ? undefined
                : {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      mass: 1.1,
                      delay: tirage?.retard ?? 0,
                    },
                  }
            }
            viewport={{ once: true, amount: 0.4 }}
            whileHover={
              sansMouvement ? undefined : { scale: 1.1, zIndex: 9 }
            }
          >
            {/* `img` et non `next/image` : le fichier fait 200 px de côté pour
                un affichage de 112 au plus, donc il couvre déjà le double
                densité, et il n'y a rien à redimensionner. `width` et `height`
                sont déclarés quand même, comme partout : sans eux, la place
                n'est pas réservée et la page saute au chargement. */}
            <motion.img
              src={portrait.src}
              alt={portrait.alt}
              width={200}
              height={200}
              loading="lazy"
              className="size-full rounded-full object-cover"
              animate={
                tirage && !sansMouvement
                  ? {
                      y: [0, tirage.montee * plan.ampleur, 0],
                      transition: {
                        duration: tirage.duree,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }
                  : undefined
              }
            />
          </motion.div>
        );
      })}

      <div className="relative z-10">{children}</div>
    </section>
  );
}
