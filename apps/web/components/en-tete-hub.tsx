"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { LogoFunnels } from "@/components/logo-funnels";
import { formationHub } from "@/contenu/hub";
import { TexteRoulant } from "@/components/texte-roulant";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/ui/components/navigation-menu";
import { HUB, HUB_RESULTATS } from "@/lib/hub";
import { cn } from "@repo/ui/lib/utils";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { HAUTEUR_ENTETE } from "@/lib/entete";

/**
 * L'en-tête du hub : deux capsules, et aucune sortie.
 *
 * C'est l'en-tête du site dans sa forme, sur demande de Rémy, mais il ne mène
 * qu'à deux endroits : le nom ramène au sommaire des témoignages, le menu de
 * droite les liste un par un. Rien d'autre, puisque le hub est fermé.
 *
 * **Il n'a pas d'habillage sur image.** Celui du site bascule en verre blanc
 * quand une bande sombre passe dessous, et observe pour cela un
 * `data-bande-sombre` que seul le hero de l'accueil déclare. Aucune page du hub
 * n'en a : l'habillage de page est donc le seul état possible, et le mécanisme
 * d'observation n'a pas lieu d'être recopié ici.
 *
 * **Les classes des capsules sont reprises et non importées.** Elles vivent
 * dans `en-tete.tsx`, qui porte `"use client"` et n'en exporte rien ; les en
 * sortir demanderait de toucher l'en-tête du site, ce que Rémy a exclu. Elles
 * sont donc recopiées ici, avec leur origine en commentaire. Si le verre des
 * capsules change un jour, il change à deux endroits, et c'est écrit.
 */

/* Repris de `CAPSULE_BASE` dans `en-tete.tsx`. Le rayon de 12 px et le flou
   sont la première exception du projet à « le flou va derrière, jamais
   devant » : voir `AGENTS.md`. */
const CAPSULE_BASE =
  "flex items-center gap-2 rounded-[12px] p-1.25 pr-1.5 transition-all duration-300 backdrop-blur-md ring-1 ring-inset";

/* Au-dessus d'une image sombre : le verre blanc de passionfroot. C'est le seul
   endroit où un blanc en dur est justifié, le fond n'étant pas un jeton de
   thème mais une photographie, sombre dans les deux thèmes. */
const CAPSULE_SUR_IMAGE =
  "bg-gradient-to-b from-white/10 to-white/5 ring-white/7 shadow-[0_1px_1px_rgba(255,255,255,0.04)_inset,0_2px_8px_rgba(0,0,0,0.10)]";

const CAPSULE_SUR_PAGE =
  "bg-card/85 ring-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

/* Repris de `CLASSES_ENTREE` et `CLASSES_ENTREE_SUR_PAGE`. */
const ENTREE_BASE =
  "flex h-9 items-center gap-1.5 px-3 rounded-md transition-colors text-sm font-semibold bg-transparent data-[state=open]:bg-popover data-[state=open]:text-popover-foreground";

const ENTREE_SUR_IMAGE =
  "text-white/80 hover:bg-white/15 hover:text-white focus:bg-white/15";

const ENTREE_SUR_PAGE =
  "text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent";

export function EnTeteHub() {
  const chemin = usePathname();

  /* **L'habillage suit la page, jamais le défilement.**

     La page de formation pose une image sombre sous l'en-tête, les autres non.
     Un seuil en pixels comparé à `scrollY` décrirait cette page-là et rien
     d'autre : en haut du sommaire, l'en-tête resterait en verre blanc sur un
     fond clair, soit un contraste de 1,17:1. On observe donc le repère que la
     page déclare, `data-bande-sombre`, et une page qui n'en pose pas démarre et
     reste en habillage de page, ce qui est le défaut sûr.

     `useLayoutEffect` et non `useEffect` : la mesure a lieu avant la peinture,
     donc sans un éclair d'habillage clair sur l'image au chargement. */
  const [surImage, setSurImage] = useState(false);

  useLayoutEffect(() => {
    const bande = document.querySelector("[data-bande-sombre]");
    if (!bande) {
      setSurImage(false);
      return;
    }

    const observateur = new IntersectionObserver(
      ([entree]) => setSurImage(entree?.isIntersecting ?? false),
      { rootMargin: `-${HAUTEUR_ENTETE}px 0px 0px 0px`, threshold: 0 },
    );
    observateur.observe(bande);
    return () => observateur.disconnect();
  }, [chemin]);

  const capsule = cn(
    CAPSULE_BASE,
    surImage ? CAPSULE_SUR_IMAGE : CAPSULE_SUR_PAGE,
  );
  const classesEntree = cn(
    ENTREE_BASE,
    surImage ? ENTREE_SUR_IMAGE : ENTREE_SUR_PAGE,
  );

  /* **La formation est en tête et porte la marque**, sur demande de Rémy : un
     visiteur de reciblage a souvent déjà vu cette vidéo, et c'est par elle
     qu'on veut le reprendre. Les résultats viennent ensuite, avec la flèche
     verte du menu du site. */
  const entrees = [
    {
      href: HUB,
      libelle: formationHub.libelleMenu,
      ligne: formationHub.ligneMenu,
      marque: true,
    },
    {
      href: HUB_RESULTATS,
      libelle: "Résultats",
      ligne: "Les membres racontent ce qu'ils ont changé",
      marque: false,
    },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        {/* La capsule de gauche : le nom, qui ramène au sommaire. */}
        <div className={capsule}>
          <div className="flex h-9 items-center justify-center px-2">
            {/* **La marque du hub est Funnels.Club et non Rémy Jupille**, sur
                demande de Rémy : le hub est la porte d'entrée d'une publicité
                pour le programme, pas la vitrine de la personne.

                **Et sans italique**, également sur sa demande. Le logo du site
                reprend le mot « expertise » du hero, en serif penchée ; un nom
                de marque n'est pas un mot mis en avant dans une phrase, il se
                pose droit. `titre` garde donc la fonte, `titre-fort` saute,
                puisque c'est lui qui portait `font-style: italic`.

                `whitespace-nowrap` reste : sans lui, la capsule casserait le
                nom en deux sur un écran étroit. Le lien mène à `/hub` et non à
                l'accueil, qui serait une sortie. */}
            <Link
              href={HUB}
              className={cn(
                "titre flex items-center gap-2 text-lg whitespace-nowrap tracking-tight transition-colors duration-300",
                surImage ? "text-white" : "text-foreground",
              )}
            >
              <LogoFunnels className="size-[1.05em]" />
              Funnels.Club
            </Link>
          </div>
        </div>

        {/* La capsule de droite : la liste des entretiens.

            **La racine du menu enveloppe la capsule**, exactement comme dans
            l'en-tête du site, et pour la même raison : un `backdrop-filter`
            posé à l'intérieur d'un élément qui en porte déjà un n'a plus rien à
            brouiller. Le panneau doit se rendre à côté de la capsule, pas
            dedans, sinon il est translucide mais net. */}
        <NavigationMenu
          data-menu-hub
          delayDuration={0}
          className="relative max-w-none items-start justify-end"
        >
          <div className={capsule}>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn("group/roule", classesEntree)}>
                  {/* « Menu » et non « Les entretiens », pour deux raisons.
                      Le panneau ne liste plus les entretiens mais deux
                      destinations. Et à 375 px, les deux capsules et la bascule
                      occupaient 366 des 375 pixels disponibles : un libellé de
                      quatorze caractères ne laissait plus rien respirer, ce que
                      Rémy a signalé. */}
                  <TexteRoulant>Menu</TexteRoulant>
                </NavigationMenuTrigger>

                {/* Le panneau. Son verre est écrit dans `globals.css`, sur le
                    `viewport` du composant de registre, qui ne laisse passer
                    aucune classe : celui-ci ne porte que son rembourrage.

                    **Une colonne sur téléphone, deux à partir de `sm`.** Neuf
                    entrées sur une colonne à 375 px tiennent, mais le panneau
                    devient plus haut que l'écran, d'où la hauteur bornée et le
                    défilement interne. Le site, lui, cache son menu sous `md`
                    et bascule dans un panneau latéral ; le hub n'a qu'un menu
                    et neuf entrées, un panneau latéral serait une mécanique de
                    plus pour le même résultat. */}
                {/* Le panneau. Son verre est écrit dans `globals.css`, sur le
                    `viewport` du composant de registre, qui ne laisse passer
                    aucune classe : celui-ci ne porte que son rembourrage.

                    **Deux entrées et non la liste des entretiens**, sur demande
                    de Rémy. Dix-sept noms dans un panneau demandaient de
                    choisir avant de savoir ; deux destinations disent ce qu'on
                    peut faire. Les entretiens restent listés dans le pied de
                    page, qui est fait pour ça.

                    Les tuiles sont celles du menu du site, relevées sur
                    TrendTrack : 44 px de côté, 10 px de rayon, un fond à 4 % de
                    la couleur du texte, un filet à 2 % et l'ombre de verre.
                    C'est ce triplé qui fait qu'une tuile a l'air taillée dans
                    la matière ; une bordure ne le remplace pas, elle cerne au
                    lieu de creuser. */}
                <NavigationMenuContent className="p-2 sm:p-3">
                  <ul className="grid w-[19rem] max-w-[calc(100vw-2rem)] grid-cols-1 gap-0.5">
                    {entrees.map((entree) => {
                      const ici = chemin === entree.href;

                      return (
                        <li key={entree.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={entree.href}
                              aria-current={ici ? "page" : undefined}
                              className={cn(
                                "flex flex-row items-center gap-4 rounded-[12px] px-3 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,currentColor_5%,transparent)]",
                                ici &&
                                  "bg-[color-mix(in_srgb,currentColor_7%,transparent)]",
                              )}
                            >
                              {entree.marque ? (
                                /* **La formation porte le logo Funnels.Club**,
                                   sur demande de Rémy, pour la mettre en avant.
                                   Le logo a son fond et son relief à lui, donc
                                   il remplace la tuile de verre au lieu de se
                                   poser dedans : deux reliefs emboîtés ne font
                                   pas un objet, ils font une bordure de trop.
                                   C'est déjà la règle des deux programmes dans
                                   le menu du site. */
                                <LogoFunnels className="size-11 shrink-0" />
                              ) : (
                                <span
                                  aria-hidden
                                  /* La teinte est posée en `color` et non en
                                     classe : le glyphe est rempli en
                                     `currentColor`, donc une seule propriété
                                     suffit, et le fond comme le filet de la
                                     tuile la prennent avec lui.

                                     C'est le vert de la courbe vivante,
                                     `--icone-resultats`, le même que dans le
                                     menu du site, et il **change de valeur
                                     selon le thème** : le vert franc ne tient
                                     que 2,45:1 sur la page claire, en dessous
                                     des 3:1 qu'un glyphe demande. */
                                  style={{
                                    boxShadow: "var(--ombre-verre)",
                                    color: "var(--icone-resultats)",
                                  }}
                                  className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[color-mix(in_srgb,currentColor_4%,transparent)] p-2.5 outline outline-[color-mix(in_srgb,currentColor_8%,transparent)] -outline-offset-1"
                                >
                                  <TrendingUp className="size-full" />
                                </span>
                              )}

                              {/* `min-w-0` : sans lui, un bloc de texte dans un
                                  conteneur en `flex` refuse de descendre sous
                                  la largeur de son plus long mot, et la
                                  troncature d'une ligne n'a jamais lieu. */}
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-foreground">
                                  {entree.libelle}
                                </span>
                                {/* Une ligne et pas deux : au-delà, les entrées
                                    n'ont plus la même hauteur et la colonne
                                    perd son peigne. Règle du menu du site. */}
                                <span className="line-clamp-1 block text-xs text-muted-foreground">
                                  {entree.ligne}
                                </span>
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            {/* Le filet vertical, puis la bascule de thème, exactement comme
                dans la capsule de droite du site. Le filet sépare ce qui
                navigue de ce qui règle l'affichage ; sans lui, la bascule a
                l'air d'une entrée de menu de plus.

                **Pas de `surImage`** : aucune page du hub ne pose de bande
                sombre sous l'en-tête, donc l'habillage de page est le seul
                état possible. Voir le commentaire en tête de ce fichier. */}
            <span
              aria-hidden
              className={cn(
                "hidden h-5 w-px transition-colors duration-300 sm:block",
                surImage ? "bg-white/15" : "bg-border",
              )}
            />
            <BasculeTheme surImage={surImage} />
          </div>
        </NavigationMenu>
      </div>
    </header>
  );
}
