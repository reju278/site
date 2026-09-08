import { BoutonScintillant } from "@/components/bouton-scintillant";
import { LecteurVideo } from "@/components/lecteur-video";
import { KineticText } from "@repo/ui/components/kinetic-text";
import { ParticulesHero } from "@/components/particules-hero";
import { Emplacement, Section } from "@/components/section";
import { SITE, identite, liens, offres, sections } from "@/contenu/site";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Les données structurées de la page d'accueil.
 *
 * `sameAs` est la partie qui compte : c'est elle qui dit à Google que le site,
 * la chaîne YouTube, l'Instagram et le LinkedIn appartiennent à la même
 * personne. Sans elle, chaque profil vit de son côté et le nom ne consolide
 * rien.
 *
 * Le bloc est écrit avec `dangerouslySetInnerHTML` parce que c'est la seule
 * façon de poser du JSON-LD dans React : un `<script>` avec des enfants JSX
 * serait échappé et deviendrait illisible pour les robots.
 */
const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identite.nom,
  url: SITE,
  jobTitle: "Formateur et consultant en acquisition",
  worksFor: { "@type": "Organization", name: identite.societe },
  sameAs: [
    liens.youtube,
    liens.youtubeFunnels,
    liens.instagram,
    liens.tiktok,
    liens.linkedin,
    liens.facebook,
  ],
};

export default function Accueil() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(donneesStructurees),
        }}
      />

      {/* ---------------------------------------------------------------
          Le hero.

          Titre, sous-titre, deux boutons, la vidéo. Rien d'autre : pas de
          fond animé, pas de cartes qui flottent. Ce qui doit retenir le
          regard ici, c'est la vidéo, et un décor qui bouge lui volerait la
          place.

          L'en-tête est flottant et fixe : le `pt-40` le dégage et pose le
          titre vers le milieu de l'image.
      --------------------------------------------------------------- */}
      <section
        className="relative isolate px-5 pt-40 sm:pt-52"
        // La hauteur exacte du cadre vidéo, en 16/9 : la largeur disponible
        // (l'écran moins les marges, plafonnée à la largeur du cadre) multipliée
        // par 9/16. Le fond s'arrête à la moitié de cette valeur, ce qui coupe
        // la vidéo en deux quelle que soit la taille de l'écran. Une hauteur
        // écrite en dur produisait un cadre qui n'était plus en 16/9, et Wistia
        // y ajoutait des bandes noires sur les côtés.
        style={
          {
            "--video-h": "calc(min(100vw - 2.5rem, 48rem) * 9 / 16)",
          } as React.CSSProperties
        }
      >
        {/* Le fond.

            Deux fichiers, un par largeur : 960 px pour le téléphone, 1920 px
            au-delà. Servir 1920 px à un écran de 375 fait payer six fois le
            poids pour rien.

            L'image ne descend pas jusqu'au bas de la section : elle s'arrête à
            la moitié de `--video-h`, déclarée sur la section. C'est ce décalage
            qui fait chevaucher la vidéo sur la limite entre l'image et la page,
            sans marge négative ni décalage de transformation, donc sans que la
            section suivante ait à réserver de la place.

            Le voile assombri garantit le contraste du texte quel que soit le
            thème : cette bande reste sombre dans les deux, sinon le verre de
            l'en-tête n'aurait rien à mordre. */}
        <div
          // Le repère que l'en-tête observe pour savoir s'il surplombe une
          // bande sombre. Sans lui, il s'habille pour un fond de page, ce qui
          // est le défaut sûr : c'est cette absence qui le rendait blanc sur
          // beige en haut des pages sans hero.
          data-bande-sombre
          className="absolute inset-x-0 top-0 bottom-[calc(var(--video-h)/2)] -z-10 overflow-hidden"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* `alt=""` assumé : cette image est décorative, elle ne porte
                aucune information que le texte ne dise déjà. Les dimensions
                sont déclarées pour que le navigateur réserve la place et que
                la page ne saute pas au chargement, et `fetchPriority` la
                signale comme l'image que Google chronomètre. */}
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

          {/* Les particules passent après le voile, donc au-dessus de lui, mais
              restent dans la bande en `-z-10` : elles dérivent derrière le
              titre sans jamais le recouvrir. */}
          <ParticulesHero />

          {/* Le raccord entre l'image et la page.

              Sans lui, l'image s'arrête net sur une ligne horizontale. Le
              dégradé va du transparent vers `--background`, donc vers le beige
              en thème clair et vers le brun sombre en thème sombre : un seul
              élément couvre les deux, sans qu'aucune couleur ne soit écrite. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background sm:h-56"
          />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="titre text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              Vivez de votre{" "}
              {/* `as="span"` et `inline-flex` : le composant pose un
                  conteneur flex, qui serait de niveau bloc et casserait la
                  ligne s'il gardait son affichage par défaut. */}
              <KineticText
                as="span"
                text="expertise"
                // Deux corrections au composant, passées par ses propres
                // variables plutôt qu'en retouchant le fichier de registre.
                //
                // `--hover-padding` valait `1em/12`, soit près de cinq pixels
                // par lettre à ce corps : le mot s'étirait visiblement au
                // survol. Divisé par quarante, l'épaississement se voit encore
                // mais le mot ne bouge plus.
                //
                // `tracking-tight` rattrape le crénage : le composant place
                // chaque lettre dans un élément flex, ce qui supprime les
                // paires crénées de la fonte et fait respirer les lettres plus
                // que dans le reste du titre.
                style={
                  { "--hover-padding": "calc(1em / 40)" } as React.CSSProperties
                }
                className="titre-fort inline-flex tracking-tight"
              />{" "}
              en ligne.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-white/85 sm:text-xl">
              {identite.resume}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <BoutonScintillant href={liens.funnelsClub}>
                Découvrir Funnels Club
              </BoutonScintillant>
            </div>
          </div>

          {/* Le rapport 16/9 est porté par `LecteurVideo` : c'est lui qui fait
              remplir le cadre exactement, sans bande noire. */}
          <div
            id="video"
            className="mx-auto mt-8 max-w-3xl scroll-mt-[66px] sm:mt-10"
          >
            <LecteurVideo />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Les deux programmes. Texte repris de remy-jupille.com, au mot près.
      --------------------------------------------------------------- */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          {offres.map((offre) => (
            // `h-full` sur la carte et `mt-auto` sur l'action : c'est ce
            // couple qui aligne les boutons entre eux. Sans lui, chaque bouton
            // suit son propre texte, et deux descriptions de longueur
            // différente produisent deux boutons décalés.
            <article
              key={offre.id}
              className="flex h-full flex-col rounded-md border border-border bg-card p-8"
            >
              <h2 className="titre text-3xl text-card-foreground">
                {offre.nom}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {offre.texte}
              </p>

              <div className="mt-auto pt-8">
                <BoutonScintillant href={offre.href}>
                  {offre.action}
                  <ArrowRight className="size-4" />
                </BoutonScintillant>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          Ce qui attend votre texte.
      --------------------------------------------------------------- */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <Emplacement attendu={sections.preuve.attendu} />
          <Emplacement attendu={sections.aPropos.attendu} />
        </div>
        <Emplacement attendu={sections.appel.attendu} className="mt-4" />

        <Button asChild variant="ghost" className="mt-8 font-semibold">
          <Link href="/resultats">
            Page Résultats
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Section>
    </>
  );
}
