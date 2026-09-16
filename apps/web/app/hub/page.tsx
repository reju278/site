import { LecteurVideo } from "@/components/lecteur-video";
import { ParticulesHero } from "@/components/particules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { formationHub } from "@/contenu/hub";
import { video } from "@/contenu/site";
import { HUB_RESULTATS, SORTIE, controlerLeHub } from "@/lib/hub";
import { KineticText } from "@repo/ui/components/kinetic-text";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * L'accueil du hub : la formation gratuite.
 *
 * **C'est la page que la publicité montre en premier**, sur décision de Rémy.
 * Quelqu'un qui arrive par une publicité de reciblage a souvent déjà vu cette
 * vidéo ; la retrouver à l'identique est ce qui fait qu'il se reconnaît, et le
 * sommaire des entretiens vient après, à `/hub/resultats`.
 *
 * C'est le hero de l'accueil repris tel quel, sur demande de Rémy : la même
 * image de fond, le même voile, les mêmes particules, le même titre avec son
 * mot accentué, le même sous-titre et la même vidéo. Quelqu'un qui arrive par
 * une publicité de reciblage a souvent déjà vu cette vidéo ; la retrouver à
 * l'identique est ce qui fait qu'il se reconnaît.
 *
 * **Trois différences, et toutes viennent de ce qu'est le hub.**
 *
 * Il n'y a **ni pastille de preuve ni boutons au-dessus de la vidéo**. Sur
 * l'accueil, la paire de boutons est posée entre le sous-titre et la vidéo,
 * parce que la page continue en dessous ; ici la vidéo est la page, et deux
 * appels au-dessus d'elle inviteraient à partir avant de l'avoir regardée.
 *
 * Les **deux liens sont donc sous la vidéo**, sur demande de Rémy : voir les
 * résultats, ou réserver un appel. C'est la paire du projet, un plein et un
 * creux, à la même hauteur et au même rayon.
 *
 * **Le plein mène au sommaire des entretiens et non à l'extérieur.** Sur
 * l'accueil du site, il mène à la formation de Funnels Club ; ici on y est
 * déjà, et la suite du parcours est de voir qui l'a suivie.
 */

export const metadata: Metadata = {
  title: formationHub.titrePage,
  description: formationHub.description,
};

export default function FormationHub() {
  /* Le contrôle tourne ici comme sur les autres pages du hub : cette page-ci
     est la plus exposée, c'est celle que la publicité montre en premier. */
  controlerLeHub(
    [
      formationHub.titrePage,
      formationHub.description,
      formationHub.resume,
      "Voir les résultats",
      "Réserver un appel",
    ],
    "la page de formation du hub",
  );

  return (
    <>
    <section
      /* **`data-hero` n'est pas décoratif**, et l'oublier a produit le défaut
         que Rémy a signalé : « il y a un bloc au milieu ». `--jonction`, la
         ligne où l'image cède la place à la page, n'est déclarée dans
         `globals.css` que sous `[data-hero]`. Sans l'attribut, la variable
         n'existe pas, `calc(var(--jonction) - 96px)` devient invalide, et la
         lèvre blanche perd son ancrage : elle remonte en haut de la section et
         se pose en travers du titre. Rien n'échoue, le CSS invalide est
         simplement ignoré. */
      data-hero
      /* `--video-h` : la hauteur exacte du cadre vidéo en 16/9, d'où part la
         jonction entre l'image et la page. Une hauteur écrite en dur donnerait
         un cadre qui n'est plus en 16/9, et Wistia y ajouterait des bandes
         noires sur les côtés. Repris de l'accueil au caractère près. */
      className="relative isolate px-5 pt-28 sm:pt-52"
      style={
        {
          "--video-h": "calc(min(100vw - 2.5rem, 48rem) * 9 / 16)",
        } as React.CSSProperties
      }
    >
      {/* Le fond. Deux fichiers, un par largeur : servir 1920 px à un écran de
          375 fait payer six fois le poids pour rien. Le voile assombri garantit
          le contraste du texte dans les deux thèmes.

          `data-bande-sombre` est le repère que l'en-tête observe pour savoir
          qu'il surplombe une image : sans lui, il s'habillerait pour un fond de
          page et deviendrait blanc sur sombre. C'est la seule page du hub qui
          en déclare un. */}
      <div
        data-bande-sombre
        className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px)] -z-10 overflow-hidden"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fond-hero-mobile.jpg"
            alt=""
            width={1920}
            height={1097}
            fetchPriority="high"
            className="size-full object-cover"
          />
        </picture>
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <ParticulesHero />
      </div>

      {/* La lèvre : la page qui monte par-dessus l'image, ses deux angles hauts
          arrondis. Elle est **en dehors** du conteneur de l'image, et c'est la
          réparation d'un vrai défaut : ce conteneur est rogné sur un pixel
          fractionnaire, et le lissage de cette arête dessinait un trait clair
          sur toute la largeur. Dehors, la lèvre couvre l'arête au lieu de
          s'aligner dessus. Repris de l'accueil. */}
      <div
        aria-hidden
        className="absolute inset-x-0 -z-10 h-24 rounded-t-[var(--rayon-jonction)] bg-background"
        style={{ bottom: "calc(var(--jonction) - 96px)" }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="titre text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
            Vivez de votre{" "}
            {/* `as="span"` et `inline-flex` : le composant pose un conteneur
                flex, qui casserait la ligne s'il gardait son affichage par
                défaut. `font-[600]` n'est pas décoratif : `KineticText` pose
                `font-[300]`, que `cn()` ne voit pas comme un conflit avec
                `titre-fort`, et le mot rendrait visiblement plus maigre que ce
                qui l'entoure. */}
            <KineticText
              as="span"
              text="expertise"
              style={
                { "--hover-padding": "calc(1em / 40)" } as React.CSSProperties
              }
              className="titre-fort inline-flex font-[600] tracking-tight"
            />{" "}
            en ligne.
          </h1>

          {/* Le sous-titre est celui du hub et non `identite.resume`, qui
              annonce « jusqu'à 6 ou 7 chiffres par an ». Voir `contenu/hub.ts`.
              Le contrôle ci-dessus le refuserait de toute façon au build. */}
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-white/85 sm:text-xl">
            {formationHub.resume}
          </p>
        </div>

        {/* Le rapport 16/9 est porté par `LecteurVideo` : c'est lui qui fait
            remplir le cadre exactement, sans bande noire. */}
        <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
          <LecteurVideo
            id={video.id}
            titre={video.titre}
            secondes={video.secondes}
            affiche="/affiche-video.jpg"
            afficheMobile="/affiche-video-mobile.jpg"
          />
        </div>

      </div>
    </section>

      {/* Les deux liens, **sous la vidéo** et non au-dessus, sur demande de
          Rémy : ici la vidéo est la page, et deux appels posés avant elle
          inviteraient à partir sans l'avoir regardée.

          **Ils sont en dehors du hero, et il le fallait.** Placés dedans, ils
          tombaient encore sur la photographie à 375 px de large : la vidéo y
          est plus courte, donc tout remonte, et le creux se retrouvait en encre
          de thème, c'est-à-dire presque noire en thème clair, sur un paysage
          sombre. Sortis dans un bloc qui suit, ils se posent sur la couleur de
          page quelle que soit la largeur, et leurs jetons redeviennent justes.

          Régler la marge aurait marché à une largeur et pas à l'autre : c'est
          exactement ce que dit la règle du projet sur les valeurs relatives.

          Ils sont sous la jonction, donc sur la couleur de page et non sur
          l'image : leurs couleurs sont celles des jetons, pas le blanc en dur
          du hero. C'est la paire du projet, un plein et un creux, même
          hauteur et même rayon, la bordure du creux en `currentColor` pour
          qu'elle ne puisse pas diverger de son texte.

          `flex-col` puis `sm:flex-row` : deux boutons de 56 px côte à côte
          sur 375 px coupent leurs libellés en trois lignes. */}
      <div className="mx-auto flex max-w-3xl flex-col items-stretch justify-center gap-3 px-5 pt-8 pb-16 sm:flex-row sm:items-center sm:pt-10 sm:pb-20">
        <Link
          href={HUB_RESULTATS}
          className="group/roule inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <TexteRoulant>Voir les résultats</TexteRoulant>
        </Link>

        <a
          href={SORTIE}
          target="_blank"
          rel="noreferrer"
          className="group/roule inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-current px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <TexteRoulant>Réserver un appel</TexteRoulant>
        </a>
      </div>
    </>
  );
}
