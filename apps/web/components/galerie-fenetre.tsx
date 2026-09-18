"use client";

import { CarteInclinable } from "@/components/carte-inclinable";
import { TexteRoulant } from "@/components/texte-roulant";
import { Gelule } from "@/components/pilules-hero";
import { insecables } from "@/lib/typographie";
import { cn } from "@repo/ui/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/** La durée d'un entretien, en minutes et secondes. */
function dureeLisible(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Ce qu'une carte a besoin de savoir. Le contenu vient déjà rendu du serveur. */
export type EntretienGalerie = {
  id: string;
  ancre: string;
  nom: string;
  description: string;
  secondes: number;
  /** Le chapô, pour le nom accessible de la fenêtre. */
  chapo: string;
  /** L'article, rendu par le serveur et passé tel quel. */
  contenu: React.ReactNode;
};

/* Le verre du bouton « Fermer » et des deux flèches, écrit une fois. C'est la
   cinquième exception du projet à « le flou va derrière, jamais devant », déjà
   décrite dans `AGENTS.md` : ces commandes flottent au-dessus du contenu de la
   page, déjà flouté par le voile, et c'est le verre qui les fait tenir sur un
   fond dont on ne sait rien. */
const VERRE_COMMANDE =
  "inline-flex items-center justify-center gap-2 rounded-full bg-card/85 text-sm font-semibold text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.10)] ring-1 ring-border ring-inset backdrop-blur-md transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * La galerie des entretiens et la fenêtre qui les montre.
 *
 * **Les deux vivent dans le même composant depuis que Rémy veut des flèches**
 * pour passer d'un témoignage au suivant sans refermer. Une fenêtre par carte,
 * ce qu'on avait, ne peut pas faire ça : chacune ignore les autres, et passer de
 * l'une à l'autre demanderait d'en fermer une et d'en ouvrir une autre, donc de
 * faire clignoter le voile entre les deux. Ici il n'y a **qu'une** fenêtre, et
 * c'est son contenu qui change.
 *
 * **Le contenu des vingt-deux articles est rendu par le serveur** et passé tel
 * quel. C'est ce qui garde `avis.ts` et ses cinq cents kilooctets hors du paquet
 * JavaScript, et ça n'a pas changé : seule celle qui est ouverte est dans le
 * DOM, donc **un seul lecteur Wistia peut exister**.
 *
 * `null` plutôt qu'un booléen et un index séparés : un seul état ne peut pas se
 * contredire, là où deux finissent par dire « fermée sur l'entretien 7 ».
 */
export function GalerieFenetre({
  entretiens,
}: {
  entretiens: readonly EntretienGalerie[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const courant = index === null ? null : entretiens[index];

  const aller = (pas: number) =>
    setIndex((i) =>
      i === null ? i : (i + pas + entretiens.length) % entretiens.length,
    );

  return (
    <>
      <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {entretiens.map((e, n) => (
          <li key={e.id} id={e.ancre} className="scroll-mt-24">
            {/* **La carte s'incline sous le pointeur**, sur demande de Rémy, qui
                a cité les cartes 3D de l'accueil. C'est le même geste, sorti en
                composant plutôt que recopié : voir `CarteInclinable`. */}
            <CarteInclinable
              teinte="doux"
              rayon="rounded-[25px]"
              className="h-full"
            >
              <button
                type="button"
                onClick={() => setIndex(n)}
                style={{
                  /* Le fond des cartes du hero, **posé sur la couleur de
                     carte et non sur du vide**.

                     Chez elles, `color-mix(… 4%, transparent)` est juste :
                     elles flottent sur une photographie, et c'est un verre.
                     Ici, le semis de points court derrière la section : à 4 %
                     d'opacité, on le voyait **au travers de la carte**, ce que
                     Rémy a signalé. Le même mélange, appliqué sur une couleur
                     au lieu du vide, rend la carte opaque sans rien changer à
                     sa teinte.

                     **Et la couleur est celle de la page, pas celle des
                     cartes.** Mélangé à `--card`, qui est un blanc pur, le gris
                     tirait plus froid que ce qu'on voyait à travers ; sur
                     `--background`, qui est le blanc cassé de la page, on
                     retrouve exactement la teinte d'avant. Rémy a vu la
                     différence. */
                  backgroundColor:
                    "color-mix(in srgb, currentColor 4%, var(--background))",
                }}
                /* **Au survol, la carte se soulève, elle ne se cerne pas.**
                   Le motif du site colore la bordure en `ring` ; Rémy ne veut
                   pas de ce cadre coloré ici. Une ombre portée et deux pixels
                   de montée disent la même chose sans dessiner de trait : la
                   carte répond au clic qu'on s'apprête à faire.

                   L'ombre est de la famille de celles du projet, très diffuse
                   et décalée vers le bas, donc lue comme de la profondeur et
                   non comme un contour. Elle est **portée** et ne se dispute
                   pas la place du relief de verre, qui est intérieur.

                   La translation est verticale : elle n'élargit pas la boîte,
                   donc rien à couper, contrairement à ce que la règle du
                   dépôt impose aux rotations.

                   **La propriété animée est `translate` et non `transform`.**
                   Tailwind v4 pose les translations sur la propriété
                   `translate` du CSS, pas sur `transform` : écrite
                   `transition-[transform,…]`, la montée se produisait d'un
                   coup, sans transition, et `getComputedStyle` rendait
                   `transform: none`. Mesuré, pas supposé.

                   On n'anime pas tout : au survol, la couleur de fond de la
                   pilule change aussi, et `transition-all` ferait traîner ce
                   qui doit être net. */
                /* **Le dessin des trois cartes du hero**, sur demande de
                   Rémy : le fond de verre, le rayon de 25 px et **aucune
                   bordure**.

                   L'absence de bordure n'est pas un oubli : le liseré qu'on
                   voit sur ces cartes n'est pas un filet, ce sont les trois
                   ombres **intérieures** de `relief-verre`. En ajouter un
                   cernerait la carte là où ces ombres la creusent, et c'est le
                   piège que `AGENTS.md` décrit déjà pour le relevé du hero. */
                className="relief-verre group/carte group/roule flex h-full w-full flex-col overflow-hidden rounded-[25px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {/* L'affiche, **recadrée sur la bande d'image réelle**.

                    Les entretiens sont des appels à deux, et l'enregistrement
                    porte ses propres bandes noires : en 16/9, la moitié de la
                    vignette était du noir, et la carte avait l'air cassée
                    plutôt que sobre. C'est le défaut que Rémy a signalé, et
                    c'est la même réparation que sur le sommaire du hub.

                    **Le rapport est mesuré, pas choisi.** Les affiches ont été
                    relevées en lisant leur luminance ligne par ligne : le
                    contenu occupe les lignes 90 à 269 d'une image de 360,
                    c'est-à-dire la moitié centrale au pixel près. 640 sur 180
                    donne 32/9, seule valeur qui les découvre sans laisser de
                    noir.

                    L'image ne bouge plus : voir la note sur le zoom
                    ci-dessous. */}
                <span className="relative block aspect-32/9 overflow-hidden bg-black">
                  {/* **Servie par `next/image` et non en `img` brute.**

                      Les vingt-deux affiches pesaient 756 Ko à elles seules,
                      le premier poste de la page, parce qu'une `img` simple
                      sert le fichier tel quel : 640 px de large pour une
                      carte qui en fait 440, en JPEG là où le navigateur
                      accepte de l'AVIF.

                      `fill` et non une largeur : le cadre porte déjà le
                      rapport 32/9, et c'est lui qui décide. `sizes` dit la
                      largeur réelle d'une carte, sans quoi Next sert la plus
                      grande variante par précaution. */}
                  <Image
                    src={`/temoignages/${e.id}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 440px, 100vw"
                    loading="lazy"
                    /* **Plus de zoom au survol**, sur demande de Rémy : la
                       carte s'incline désormais, et deux mouvements pour un
                       seul objet se contrarient. L'image reste fixe, c'est la
                       carte qui bouge. */
                    className="object-cover"
                  />

                  {/* La durée, en bas à droite.

                      **Elle dit que c'est une vidéo**, ce que la carte ne
                      disait nulle part, et surtout combien de temps ça prend,
                      qui est la question qu'on se pose avant de cliquer.

                      Fond noir à 70 % et non un jeton de thème : il se pose
                      sur une photographie, dont on ne sait pas si elle est
                      claire ou sombre à cet endroit. Au pire cas, image
                      entièrement blanche dessous, le blanc y tient 8,6:1. */}
                  <span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-white tabular-nums">
                    <Play aria-hidden className="size-2.5 fill-current" />
                    {dureeLisible(e.secondes)}
                  </span>
                </span>

                <span className="flex flex-1 flex-col p-5">
                  {/* Le prénom dans la fonte des titres et un cran plus
                      gros, sur demande de Rémy : c'est le nom de quelqu'un,
                      et c'est ce qu'on lit en premier sur la carte. */}
                  <span className="titre block text-lg text-card-foreground sm:text-xl">
                    {e.nom}
                  </span>
                  <span className="mt-1 block text-sm text-pretty text-muted-foreground">
                    {insecables(e.description)}
                  </span>

                  {/* L'action, **en pilule**, sur demande de Rémy : le libellé
                      bleu d'avant ne se distinguait pas d'une phrase et ne
                      mettait rien en valeur.

                      Elle ne prend pas toute la largeur, contrairement à la
                      barre du hub : une pilule se lit comme un objet posé là,
                      une barre pleine comme un second bouton, et la carte
                      entière est déjà cliquable.

                      `rounded-full` est ici légitime : la règle des 5 px parle
                      d'angles arrondis, et une pilule n'a pas d'angle. C'est
                      la forme des gélules du hero, déjà dans la page.

                      **L'espace au-dessus est un `pt-5` et non un `mt-*`** :
                      `mt-auto` pousse le bloc au bas de la carte, et une marge
                      haute entrerait en conflit avec lui.

                      `min-h-9` et non `h-9` : un libellé qui passerait à deux
                      lignes serait rogné par une hauteur fixe. */}
                  <span className="mt-auto pt-5">
                    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-foreground transition-colors group-hover/carte:bg-primary group-hover/carte:text-primary-foreground">
                      <TexteRoulant>Voir son entretien</TexteRoulant>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 transition-transform group-hover/carte:translate-x-0.5"
                      />
                    </span>
                  </span>
                </span>
              </button>
            </CarteInclinable>
          </li>
        ))}
      </ul>

      <Dialog
        open={courant !== null}
        onOpenChange={(ouvert) => {
          if (!ouvert) setIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-none max-w-[calc(100%-2rem)] gap-3 border-0 bg-transparent p-0 shadow-none sm:max-w-4xl"
        >
          <DialogTitle className="sr-only">
            {courant ? `Entretien avec ${courant.nom}` : ""}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {courant?.chapo ?? ""}
          </DialogDescription>

          <div className="relative">
            {/* Les deux flèches, **en dehors du panneau**, comme le bouton
                « Fermer » : elles commandent la fenêtre, elles n'appartiennent
                pas à l'article.

                `-left-14` et `-right-14` : hors du panneau sur grand écran. En
                dessous de `sm`, il n'y a pas la place de chaque côté, elles
                reviennent **dans** la marge du panneau, où elles se posent sur
                l'en-tête coloré de l'entretien.

                `size-10` : la cible tactile du projet. */}
            <button
              type="button"
              onClick={() => aller(-1)}
              aria-label="Entretien précédent"
              className={cn(
                VERRE_COMMANDE,
                "absolute top-1/2 left-2 z-10 size-10 -translate-y-1/2 sm:-left-14",
              )}
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => aller(1)}
              aria-label="Entretien suivant"
              className={cn(
                VERRE_COMMANDE,
                "absolute top-1/2 right-2 z-10 size-10 -translate-y-1/2 sm:-right-14",
              )}
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>

            {/* Le panneau. C'est lui qui porte le rayon, le fond et le rognage.

                **La fenêtre prend toute la hauteur**, sur demande de Rémy, et la
                marge qui reste est comptée et non choisie : le bouton
                « Fermer » fait 36 px, son écart au panneau 12, et on laisse
                12 px au-dessus et en dessous. Le panneau vaut donc la hauteur
                d'écran moins 72. Tout ce qui est repris là est rendu à la
                vidéo.

                **Le défilement est sur le bloc intérieur et non sur le
                panneau** : la barre de défilement courait sur l'angle arrondi,
                qui la coupait en haut et en bas.

                `key` sur le bloc : changer d'entretien remonte le contenu, donc
                démonte le lecteur Wistia du précédent, ce qui coupe son son, et
                remet le défilement en haut. Sans elle, on arriverait au milieu
                de l'article suivant. */}
            <div className="overflow-hidden rounded-[var(--rayon-jonction)] border border-border bg-background shadow-lg">
              <div
                key={courant?.id}
                className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto"
                /* **Un renvoi vers un autre entretien change la fenêtre au
                   lieu de la fermer**, sur demande de Rémy.

                   Les articles se citent entre eux, et `versImmersion`
                   transforme ces renvois en ancres vers la carte de la personne.
                   Tant qu'il n'y avait qu'une fenêtre par carte, tout ce qu'on
                   pouvait faire était fermer et laisser le navigateur sauter à
                   la carte, qu'il fallait ensuite rouvrir. Maintenant qu'une
                   seule fenêtre sert les vingt-deux, elle peut simplement
                   changer de contenu.

                   **Les autres ancres gardent l'ancien sort** : `#avis` mène au
                   sommaire de la page, il n'y a pas de fenêtre à ouvrir. On
                   ferme, et on ne bloque pas le saut.

                   Le clic est écouté ici, sur le conteneur, et non posé sur
                   chaque lien : les liens sont rendus par le serveur, à
                   l'intérieur de `TexteLie`, et leur passer un gestionnaire
                   demanderait de rendre tout l'article côté client. */
                onClick={(evenement) => {
                  const cible = (evenement.target as HTMLElement).closest("a");
                  const href = cible?.getAttribute("href");
                  if (!href?.startsWith("#")) return;

                  const vise = entretiens.findIndex(
                    (e) => `#${e.ancre}` === href,
                  );

                  if (vise === -1) {
                    setIndex(null);
                    return;
                  }

                  evenement.preventDefault();
                  setIndex(vise);
                }}
              >
                {courant?.contenu}
              </div>
            </div>
          </div>

          {/* **Le bouton « Fermer » est exactement la gélule du hero**, sur
              demande de Rémy, avec sa lumière qui tourne, en rouge. Même
              composant, donc mêmes cotes, même typographie et même mécanique :
              rien n'est redessiné ici.

              `sur="voile"` : le voile d'une fenêtre est sombre dans les deux
              thèmes, mais l'encre suit le thème. Une gélule « page » y était de
              l'encre sombre sur du sombre en thème clair, presque illisible.
              Celle-ci reprend le verre du bouton de fermeture d'origine, une
              vraie surface sous le texte.

              `--destructive` et non le rouge du livre : celui-ci est la couleur
              d'un objet, une couverture, et `AGENTS.md` interdit de l'étendre.
              Fermer est l'action que les jetons du projet appellent
              destructive. */}
          <DialogClose asChild>
            <Gelule
              as="button"
              sur="voile"
              teinte="var(--destructive)"
              /* `group/roule` : le libellé roule au survol, comme les entrées
                 du menu, sur demande de Rémy. */
              className="group/roule mx-auto"
              pastille={<X aria-hidden className="size-4 shrink-0" />}
            >
              <TexteRoulant>Fermer</TexteRoulant>
            </Gelule>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
