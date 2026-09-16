import { EnTetePage } from "@/components/en-tete-page";
import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { afficheHub, sommaireHub } from "@/contenu/hub";
import { temoignages } from "@/contenu/site";
import { HUB, avisServis, controlerLeHub, controlerLesPassages } from "@/lib/hub";
import { titresHub } from "@/contenu/hub";
import { insecables } from "@/lib/typographie";
import { ArrowRight, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Le sommaire des entretiens du hub, à `/hub/resultats`.
 *
 * **Il n'est plus l'accueil du hub.** `/hub` porte la formation gratuite, sur
 * décision de Rémy : c'est la vidéo qu'un visiteur de reciblage a souvent déjà
 * vue, donc celle par laquelle on le reprend. Ce sommaire est ce qu'on lui
 * propose ensuite.
 *
 * C'est la page `/resultats` au dessin près, et volontairement : Rémy a demandé
 * que tout reste exactement identique. Trois choses seulement changent, et
 * toutes les trois pour la même raison, la conformité aux règles publicitaires
 * de Meta et le fait qu'on ne sorte pas du hub :
 *
 * - le titre, le chapô et la ligne de chaque carte viennent de `contenu/hub.ts`
 *   et non de `site.ts`, où ils annoncent des montants ;
 * - les cartes mènent à `/hub/<nom>` et non à `/resultats/<nom>` ;
 * - un avertissement ferme la page, posé par le cadre du hub.
 *
 * **Pas de `Carte` facultative ici**, contrairement à `/resultats`. Le hub ne
 * liste que les entretiens qui ont leur article **et** leur version de hub :
 * une carte qui ne mène nulle part est un cul-de-sac sur une page payante.
 */

export const metadata: Metadata = {
  title: sommaireHub.titre,
  description: sommaireHub.description,
};

/**
 * Les secondes en `m:ss`.
 *
 * **Recopié et non importé**, à regret. La même fonction est exportée par
 * `lecteur-video.tsx`, mais ce fichier porte `"use client"` : un composant
 * serveur qui en importe quoi que ce soit ne reçoit pas la valeur, il reçoit
 * une référence client. C'est la panne silencieuse décrite dans `AGENTS.md`,
 * celle de `HAUTEUR_ENTETE`, et la règle qui en sort est qu'une valeur
 * partagée habite un module neutre. La sortir de `lecteur-video.tsx`
 * demanderait de toucher un fichier du site, ce que Rémy a exclu : ces quatre
 * lignes sont le prix de cette contrainte.
 */
function dureeLisible(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = Math.round(secondes % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SommaireHub() {
  /* Les entretiens que le hub sert. L'ordre est celui de `temoignages`, qui
     est celui de la page Résultats : le hub en est le même sommaire, il n'a
     aucune raison de les ranger autrement. `avisServis` décide seul de qui
     entre, affiche comprise. */
  const entrees = temoignages.flatMap((temoignage) => {
    const article = avisServis.find((a) => a.id === temoignage.id);
    const entetes = article ? titresHub[article.slug] : undefined;
    if (!article || !entetes) return [];
    return [{ temoignage, slug: article.slug, entetes }];
  });

  /* Le contrôle, avant le rendu et non après.
     Il relit tout ce que cette page s'apprête à écrire, y compris les lignes
     des cartes : elles viennent de `contenu/hub.ts`, mais c'est précisément le
     genre d'endroit qu'on oublie de nettoyer, puisqu'il est ailleurs que dans
     le fichier des articles. Voir `lib/hub.ts`. */
  controlerLesPassages();

  controlerLeHub(
    [
      sommaireHub.titre,
      sommaireHub.chapo,
      sommaireHub.description,
      ...entrees.map((e) => e.entetes.carte),
      ...entrees.map((e) => e.temoignage.nom),
    ],
    "le sommaire du hub",
  );

  return (
    <>
      {/* `EnTetePage` et non un bloc à part, et c'est la réparation d'un
          défaut signalé par Rémy : le sommaire avait perdu le fond du deck, ce
          fond très clair bleuté avec ses trois halos et son grain, qui ouvre
          toutes les pages intérieures du site. Recopier les cotes sans le
          composant, c'était recopier l'espacement en oubliant la matière.

          Il apporte aussi son `data-entete-page`, donc la règle d'espacement de
          `globals.css` qui annule le rembourrage haut de la section suivante.
          C'est elle qui tient les 40 px d'écart du site, et elle dispense d'un
          réglage écrit ici. */}
      <EnTetePage>
        <h1 className="titre text-4xl text-balance text-foreground sm:text-5xl lg:text-6xl">
          {insecables(sommaireHub.titre)}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
          {insecables(sommaireHub.chapo)}
        </p>
      </EnTetePage>

      <Section>
        {/* Deux par ligne, grille resserrée en `max-w-4xl` et recentrée : c'est
            la grille de `/resultats` à l'identique. */}
        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {entrees.map(({ temoignage, slug, entetes }) => (
            <li key={temoignage.id}>
              <Link
                href={`${HUB}/${slug}`}
                className="relief-verre group/carte group/roule flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {/* L'affiche, **recadrée sur la bande d'image réelle**.

                    C'est la réparation du défaut que Rémy a signalé sur ces
                    vignettes. Les entretiens sont des appels à deux, et
                    l'enregistrement porte ses propres bandes noires : en 16/9,
                    la moitié de la vignette était du noir, et la carte avait
                    l'air cassée plutôt que sobre.

                    **Le rapport est mesuré, pas choisi.** Les neuf affiches ont
                    été relevées en lisant leur luminance ligne par ligne : sur
                    sept d'entre elles, le contenu occupe exactement les lignes
                    90 à 269 d'une image de 360, c'est-à-dire la moitié centrale
                    au pixel près. 640 sur 180 donne 32/9, et c'est la seule
                    valeur qui les découvre entièrement sans laisser de noir.
                    Un 2,4/1, essayé d'abord, laissait encore quarante-trois
                    pixels noirs en haut et en bas.

                    Les deux autres affiches, Lilian et Sébastien, sont plus
                    hautes que cette bande : elles sont donc rognées, mais du
                    contenu et non du noir, et le cadrage reste centré sur les
                    visages.

                    **Le lecteur de l'article, lui, ne bouge pas.** Il reste en
                    16/9 : Rémy avait tranché là-dessus, et une vignette de
                    sommaire n'est pas une vidéo qu'on regarde. */}
                <div className="relative aspect-32/9 overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={afficheHub(temoignage.id)}
                    alt=""
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover/carte:scale-[1.03]"
                  />

                  {/* La durée, en bas à droite de l'affiche.

                      **Elle dit que c'est une vidéo**, ce que la carte ne
                      disait nulle part : on y lisait un nom, une phrase et un
                      lien, sans rien qui annonce un entretien filmé. Et elle
                      dit surtout **combien de temps ça prend**, qui est la
                      question qu'on se pose avant de cliquer.

                      Ce n'est pas un disque de lecture : celui-ci appartient
                      aux affiches qui lancent vraiment la vidéo, et le poser
                      ici promettrait une lecture sur place alors que la carte
                      change de page. Le petit glyphe suffit à dire la nature.

                      Fond noir à 70 % et non un voile de thème : il se pose sur
                      une photographie, dont on ne sait pas si elle est claire
                      ou sombre à cet endroit. Mesuré au pire cas, image
                      entièrement blanche dessous, le blanc y tient 8,6:1. */}
                  <span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-white tabular-nums">
                    <Play aria-hidden className="size-2.5 fill-current" />
                    {dureeLisible(temoignage.secondes)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-base font-semibold text-card-foreground">
                    {temoignage.nom}
                  </p>
                  <p className="mt-1 text-sm text-pretty text-muted-foreground">
                    {insecables(entetes.carte)}
                  </p>

                  {/* L'action.

                      **Ni un lien de texte, ni un bouton cerné.** Le premier
                      état était un libellé bleu que rien ne distinguait d'une
                      phrase ; le second, un creux à bordure pleine, que Rémy a
                      trouvé trop lourd, et il avait raison : la carte entière
                      est déjà cliquable, donc un cadre dessiné à l'intérieur
                      d'une surface cliquable dessine une cible dans une cible.

                      Ce qui reste est une barre pleine mais discrète, en
                      `accent`, qui prend la couleur d'action au survol de la
                      carte. Elle se lit comme une action sans prétendre être un
                      second bouton.

                      **L'espace au-dessus est un `pt-5` et non un `mt-*`** :
                      `mt-auto` pousse le bloc au bas de la carte, et une marge
                      haute entrerait en conflit avec lui. C'est précisément ce
                      qui manquait, un `pt-0` étant resté là par mégarde : la
                      description touchait le bouton.

                      `min-h-10` et non `h-10` : le libellé est court, mais un
                      libellé qui passerait à deux lignes serait rogné par une
                      hauteur fixe. C'est la règle du projet. */}
                  <span className="mt-auto pt-5">
                    <span className="flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-accent px-4 text-sm font-semibold text-foreground transition-colors group-hover/carte:bg-primary group-hover/carte:text-primary-foreground">
                      <TexteRoulant>Lire son parcours</TexteRoulant>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 transition-transform group-hover/carte:translate-x-0.5"
                      />
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
