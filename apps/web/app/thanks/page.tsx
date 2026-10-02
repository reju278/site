import { GalerieEntretiens } from "@/components/galerie-entretiens";
import { LecteurVideo } from "@/components/lecteur-video";
import { PointGelule } from "@/components/pilules-hero";
import { ParticulesHero } from "@/components/particules-hero";
import {
  ConsignesRendezVous,
  RecapRendezVous,
} from "@/components/rendez-vous";
import { SemisPoints } from "@/components/semis-points";
import { TitreRoulant } from "@/components/titre-roulant";
import { confirmationThanks, identiteThanks } from "@/contenu/thanks";
import { scriptCapture } from "@/lib/reservation-capture";
import { insecables } from "@/lib/typographie";

import { ShineBorder } from "@repo/ui/components/shine-border";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";

/**
 * La page de confirmation, servie sur `go.funnels.club/thanks`.
 *
 * **La structure est celle de `www.funnels.club/thanks-confirmation-2026`, le
 * dessin est celui du site**, sur demande de Rémy : le hero photographique,
 * les polices, les surlignages et la galerie d'`/immersion`, dans l'ordre de
 * la page source. Le titre et l'alerte, l'étape 1 (une seule carte : sa
 * vidéo, ses consignes, le récapitulatif), l'étape 2 et sa vidéo, puis les
 * entretiens.
 *
 * **Les vidéos ne basculent pas en 3D**, comme le formulaire d'`/appel` dont
 * la page reprend le hero : le hero ne prend donc pas une hauteur d'écran.
 *
 * **Pas de notification en bas de l'écran** : celle de `/preparation` y a
 * été, puis Rémy l'a retirée. L'alerte sous le titre suffit.
 *
 * **Le message de Rémy n'y est plus** : la page source n'en a pas.
 */

export const metadata: Metadata = {
  title: identiteThanks.titrePage,
  description: identiteThanks.description,
};

/** Le numéro d'étape, en pastille : il se lit sur la photographie comme sur la page. */
function Pastille({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-primary px-2 py-0.5 align-[0.1em] text-[0.8em] font-semibold text-primary-foreground">
      {children}
    </span>
  );
}

export default function Thanks() {
  const { titre, alerte, etape1, etape2, avis } = confirmationThanks;

  return (
    <>
      <div id="haut" />

      {/* **Le relevé de la réservation**, en HTML brut et en tête de page :
          il lit ce que Calendly a mis dans l'adresse et l'en retire pendant
          la lecture du HTML, avant l'hydratation, donc avant Google Tag
          Manager. Voir `lib/reservation-capture.ts`. Brut parce que React signale
          toute balise `<script>` qu'il hydrate ; le contenu d'un
          `dangerouslySetInnerHTML`, il ne le lit pas. */}
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>${scriptCapture}</script>` }}
      />

      {/* LE HERO ET L'ÉTAPE 1.

          **L'étape 1 est un seul bloc**, sur demande de Rémy : son titre, sa
          vidéo, ses consignes et le récapitulatif dans la même carte, pour qu'on
          lise ce qu'il y a à faire d'un seul tenant. La carte est posée à
          cheval sur la photographie, comme la vidéo des autres pages.

          **La carte est hors de la section, remontée par une marge
          négative**, et c'est ce qui place la jonction. Celle des autres
          pages se mesure depuis le bas du hero, au milieu de la vidéo ; ici
          le bas de la carte porte un texte de hauteur inconnue. La section
          s'arrête donc à une hauteur connue, le haut de la carte plus son
          titre et une demi-vidéo, et la carte en ressort d'autant.
          `--jonction` vaut 88 px : la photographie s'arrête au bas de la
          section, et la lèvre s'y pose. */}
      <div id="presentation">
        <section
          data-hero
          className="relative isolate flex flex-col px-5 pt-20 pb-[calc(var(--video-h)/2+6rem)] sm:pt-28"
          style={{ "--jonction": "88px" } as React.CSSProperties}
        >
          <div
            data-bande-sombre
            className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px)] -z-10 overflow-hidden bg-[var(--fond-hero)]"
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
                className="size-full object-cover object-bottom"
              />
            </picture>
            <div aria-hidden className="absolute inset-0 bg-black/55" />
            <ParticulesHero />
          </div>

          <div
            aria-hidden
            className="absolute inset-x-0 -z-10 h-24 rounded-t-[var(--rayon-jonction)] bg-background"
            style={{ bottom: "calc(var(--jonction) - 96px)" }}
          />

          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <TitreRoulant
              as="h1"
              segments={titre}
              className="titre text-[2rem] text-balance text-white sm:text-5xl lg:text-6xl"
            />

            {/* **L'alerte, en bloc rouge à liseré lumineux**, sur demande de
                Rémy : un rouge plein, et le `ShineBorder` de MagicUI dans un
                rouge plus foncé qui glisse le long du bord. Elle tient sur une
                ligne en grand ; sur téléphone, la phrase passe sur deux lignes
                et l'arrondi se resserre pour ne pas faire une gélule de deux
                lignes.

                **Les rouges sont en dur**, comme les blancs du hero : le bloc
                est posé sur une photographie sombre dans les deux thèmes, et
                aucun jeton de thème ne décrit ce rouge-là. Le blanc sur
                #dc2626 tient 4,8:1, au-dessus du seuil du texte courant.

                Le point blanc qui pulse est celui des gélules de l'accueil :
                `--teinte` le colore. Le liseré et le point s'arrêtent sous
                mouvement réduit. */}
            {/* `div` et non `p` : `ShineBorder` rend une `div`, qu'un
                paragraphe ne peut pas contenir. Le navigateur fermait le `p`
                avant elle, et React, qui ne retrouvait plus son arbre,
                refaisait toute la page côté client. */}
            <div
              role="note"
              style={{ "--teinte": "#ffffff" } as React.CSSProperties}
              className="relative mt-6 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-[1.25rem] bg-[#dc2626] px-5 py-2.5 text-left text-sm leading-snug font-medium text-white shadow-[0_14px_34px_-14px_rgba(220,38,38,0.65)] sm:mt-7 sm:rounded-full sm:px-6 sm:py-3 sm:text-lg"
            >
              <ShineBorder
                borderWidth={2}
                duration={8}
                shineColor={["#7f1d1d", "#450a0a"]}
              />
              <PointGelule />
              <span>
                <strong className="font-bold">{alerte.important}</strong>
                {alerte.avant}
                <strong className="font-bold underline decoration-white/70 decoration-2 underline-offset-4">
                  {alerte.videos}
                </strong>
                {alerte.milieu}
                <strong className="font-bold underline decoration-white/70 decoration-2 underline-offset-4">
                  {alerte.confirmez}
                </strong>
                {alerte.apres}
              </span>
            </div>
          </div>
        </section>

        {/* La carte de l'étape 1. Le rembourrage est celui que soustrait
            `--video-h` dans le gabarit : 1 rem, puis 1,5 rem en grand. */}
        <section className="relative px-5 -mt-[calc(var(--video-h)/2+6rem-2.5rem)]">
          <div className="mx-auto max-w-[var(--largeur-video)] rounded-[var(--rayon-jonction)] border border-border bg-card p-4 text-card-foreground shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:p-6">
            {/* La police et le corps du titre de la vidéo 2, sur demande de
                Rémy : les deux titres se répondent. Un cran sous les titres
                de section du site, qu'il trouvait trop gros ici : ce sont des
                légendes de vidéo, pas des titres de page. */}
            <h2 className="titre mx-auto max-w-3xl px-1 pt-1 text-center text-[1.375rem] leading-tight text-balance text-card-foreground sm:pt-2 sm:text-3xl">
              <Pastille>{etape1.numero}</Pastille> {insecables(etape1.titre)}
            </h2>

            <div className="mt-4 w-full sm:mt-6">
              <LecteurVideo
                id={etape1.video.id}
                titre={etape1.video.titre}
                secondes={etape1.video.secondes}
                affiche={`/temoignages/${etape1.video.id}.jpg`}
                afficheAlt={etape1.video.titre}
                natif
              />
            </div>

            {/* Les consignes, au tutoiement et complétées de ce que Calendly
                a transmis, puis le récapitulatif. Voir
                `components/rendez-vous.tsx`. */}
            <div className="mx-auto max-w-3xl px-1 pt-6 pb-2 text-base leading-relaxed text-pretty text-card-foreground/85 sm:px-2 sm:pt-8 sm:pb-4 sm:text-lg">
              <ConsignesRendezVous />

              {/* La signature « – Rémy et l'équipe Funnels Club » et son
                  portrait y ont été, puis Rémy les a retirés : le
                  récapitulatif suit directement les consignes. */}
              <RecapRendezVous />
            </div>
          </div>
        </section>
      </div>

      {/* L'ÉTAPE 2 et la vidéo de la stratégie, celle de `/preparation`. */}
      <section id="strategie" className="scroll-mt-24 px-5 pt-16 sm:pt-24">
        <div className="mx-auto w-full max-w-[var(--largeur-video)]">
          <h2 className="titre mx-auto max-w-3xl text-center text-[1.375rem] leading-tight text-balance text-foreground sm:text-3xl">
            <Pastille>{etape2.numero}</Pastille> {insecables(etape2.titre)}
          </h2>

          {/* La largeur de la vidéo de l'étape 1, rembourrage de sa carte
              déduit : les deux vidéos de la page ont la même taille. */}
          <div className="mx-auto mt-8 w-full max-w-[calc(var(--largeur-video)-2rem)] sm:mt-10 sm:max-w-[calc(var(--largeur-video)-3rem)]">
            <LecteurVideo
              id={etape2.video.id}
              titre={etape2.video.titre}
              secondes={etape2.video.secondes}
              affiche={`/temoignages/${etape2.video.id}.jpg`}
              afficheAlt={etape2.video.titre}
              natif
              className="shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </section>

      {/* LES ENTRETIENS, ceux d'`/immersion`, sans boutons de réservation :
          l'appel est déjà pris. */}
      <div className="relative isolate pt-8 sm:pt-12">
        <SemisPoints
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 text-border",
            "[mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent),linear-gradient(to_bottom,transparent,#000_6%,#000_94%,transparent)]",
            "[mask-composite:intersect] [-webkit-mask-composite:source-in]",
          )}
        />

        <section id="avis" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5 pt-16 pb-9 sm:pt-20 sm:pb-12">
            <div className="mx-auto max-w-3xl text-center">
              <TitreRoulant
                as="h2"
                segments={[{ texte: avis.titre }]}
                className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
              />
              <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
                {insecables(avis.sousTitre)}
              </p>
            </div>

            <GalerieEntretiens />
          </div>
        </section>
      </div>
    </>
  );
}
