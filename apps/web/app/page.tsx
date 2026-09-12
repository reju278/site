import { BandeDegradee } from "@/components/bande-degradee";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { CarrouselTemoignages } from "@/components/carrousel-temoignages";
import { LecteurVideo } from "@/components/lecteur-video";
import { LogoFunnels } from "@/components/logo-funnels";
import { SectionLivre } from "@/components/section-livre";
import { SurtitreOffre } from "@/components/surtitre-offre";
import { KineticText } from "@repo/ui/components/kinetic-text";
import { ParticulesHero } from "@/components/particules-hero";
import { Emplacement, Section, TitreSection } from "@/components/section";
import {
  SITE,
  identite,
  liens,
  offres,
  sections,
  titreOffres,
  titreResultats,
  video,
} from "@/contenu/site";
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

              C'était un dégradé, qui fondait l'image vers la couleur de page.
              C'est maintenant une **lèvre** : un bandeau de la couleur de la
              page, posé sur le bas de l'image, aux deux angles hauts arrondis.
              La page ne s'efface plus dans l'image, elle monte par-dessus, et
              la vidéo chevauche la limite.

              Le bandeau doit être plus haut que son rayon, sinon les deux
              angles se rejoignent et l'arrondi se coupe au milieu. `h-20` tient
              les 2,5 rem de `sm` avec de la marge.

              `bg-background` et rien d'autre : aucune couleur n'est écrite, la
              lèvre suit le thème. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-20 rounded-t-[var(--rayon-jonction)] bg-background"
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
                // `font-[700]` n'est pas décoratif : `KineticText` pose `font-[300]`
                // sur son conteneur, et `cn()` ne le voit pas comme un conflit
                // puisque `titre-fort` n'est pas une classe de graisse. Sans
                // lui, le mot accentué rendait en 300 au milieu d'un titre en
                // 700, donc visiblement plus maigre que ce qui l'entoure.
                className="titre-fort inline-flex font-[600] tracking-tight"
              />{" "}
              en ligne.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-white/85 sm:text-xl">
              {identite.resume}
            </p>

            {/* L'appel à l'action, sous le sous-titre et au-dessus de la
                vidéo. Il est donc sur l'image, où le voile assombri garantit
                déjà le contraste, et non sur la couleur de page. */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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

      {/* ---------------------------------------------------------------
          Les deux programmes, côte à côte.

          Une carte par offre, et rien de plus : le design de cette section
          n'est pas arrêté, et une carte sobre se remplace sans rien casser.

          `h-full` sur la carte et `mt-auto` sur l'action : c'est ce couple qui
          aligne les boutons entre eux. Sans lui, chaque bouton suit son propre
          texte, et deux descriptions de longueur différente produisent deux
          boutons décalés de dix pixels, ce que l'œil voit immédiatement.
      --------------------------------------------------------------- */}
      <Section>
        {/* Le titre de la section, centré et coupé à la main.

            Chaque ligne est un `block` : la césure est donc garantie, à toutes
            les largeurs, au lieu de dépendre de ce que le moteur veut bien
            produire. Voir le commentaire de `titreOffres` pour la raison.

            Pas de `text-balance` : il n'a plus rien à équilibrer puisque les
            lignes sont posées. `text-pretty` reste utile sur l'écran étroit,
            où la seconde ligne se recoupe d'elle-même : il empêche qu'un mot
            s'y retrouve seul. */}
        <TitreSection
          titre={titreOffres.map((ligne) => (
            <span key={ligne} className="block text-pretty">
              {ligne}
            </span>
          ))}
          className="mx-auto mb-10 max-w-4xl text-center sm:mb-12"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {offres.map((offre) => (
            <article
              key={offre.id}
              className="flex h-full flex-col rounded-md border border-border bg-card p-8"
            >
              {"surtitre" in offre && offre.surtitre && (
                <SurtitreOffre
                  texte={offre.surtitre.texte}
                  portrait={offre.surtitre.portrait}
                />
              )}

              {/* La marque n'accompagne que l'offre qui en a une. Le
                  consulting n'est pas un produit distinct, c'est Rémy en
                  direct : lui coller une tuile inventée serait fabriquer une
                  identité qui n'existe pas. */}
              {/* La marque est **dans** le titre, et dimensionnée en `em`.

                  C'est ce qui la rend proportionnelle : `em` se résout sur la
                  taille du texte qui la porte, donc la tuile suit le titre à
                  chaque point de rupture au lieu d'être figée à une valeur qui
                  ne vaut qu'à une seule largeur d'écran.

                  Elle est `aria-hidden`, donc le nom accessible du titre reste
                  « Funnels Club » et non « image, Funnels Club ».

                  Le consulting n'en a pas : ce n'est pas un produit distinct,
                  c'est Rémy en direct, et lui inventer une tuile fabriquerait
                  une identité qui n'existe pas. */}
              {/* `h3` et non `h2` : le titre de la section occupe désormais
                  le `h2`, et deux niveaux ne peuvent pas cohabiter sur le même
                  rang sans casser le plan que les robots lisent. */}
              <h3 className="titre text-3xl text-balance text-card-foreground">
                {offre.id === "funnels-club" && (
                  <LogoFunnels // L'alignement passe par `vertical-align` et non par une
                    // translation. Une translation déplace le dessin sans
                    // rien dire à la ligne, donc le réglage se refait à
                    // chaque changement de corps. `vertical-align` s'exprime
                    // en `em` par rapport à la ligne de base : la tuile est
                    // centrée sur la hauteur de capitale et y reste à
                    // n'importe quelle taille.
                    className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]"
                  />
                )}
                {offre.nom}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
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
      {/* La bande des résultats.

          Elle ne porte plus que son titre et le lien vers la page. Les
          emplacements qui s'y trouvaient sont redescendus sous la bande : ils
          n'ont rien à voir avec les résultats, et un cadre pointillé posé sur
          une texture se lit comme un défaut d'affichage, pas comme une
          réserve. */}
      <BandeDegradee>
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="titre mx-auto max-w-3xl text-4xl text-balance text-white sm:text-5xl">
            {titreResultats}
          </h2>

          {/* Le carrousel ne déborde plus des marges du conteneur.

              Il le faisait pour que le bord de l'écran tranche les cartes
              voisines, ce qui était censé dire qu'il y en a d'autres. Ça le
              disait en coupant des visages en deux à la verticale. C'est le
              rang de miniatures qui le dit maintenant, et il montre les seize
              au lieu d'en suggérer deux. */}
          <div className="mt-12 text-left sm:mt-14">
            <CarrouselTemoignages />
          </div>

          {/* Le passage vers la page qui les porte tous.

              Le texte du lien dit où il mène : la bande n'en montre que
              seize, et c'est la page « Résultats » qui les rassemble. Un
              « en savoir plus » ne dirait rien à un robot, qui lit ce texte
              pour décrire la page d'arrivée.

              La pastille est blanche pleine, et le texte en `--bande-nuit`.
              Le lien tombe à 81 % de la hauteur de la bande, donc sur la zone
              claire de la texture : en thème clair le fond y vaut
              `--bande-lavande`, où du texte blanc ne tient que 2,13:1. Sur du
              blanc opaque, le texte tient 14,9:1 en clair et 18,4:1 en sombre,
              sans rien devoir à ce qu'il y a dessous. */}
          <div className="mt-12">
            <Link
              href="/resultats"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-[var(--bande-nuit)] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Voir tous les résultats
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </BandeDegradee>

      {/* ---------------------------------------------------------------
          Le livre.

          Il vient juste après les résultats, et c'est l'ordre qui compte :
          quelqu'un qui vient de regarder seize personnes raconter ce qu'elles
          ont obtenu n'est pas au même endroit qu'en haut de page. Le livre est
          la marche la moins chère du site, et c'est celle qu'on lui propose là.

          Tout son texte vient de sa page de vente, mot pour mot. Voir le
          commentaire de `livre` dans `site.ts`.
      --------------------------------------------------------------- */}
      <Section>
        <SectionLivre />
      </Section>

      {/* Ce qui attend encore le texte de Rémy, sur le fond de page. */}
      <Section>
        <Emplacement attendu={sections.aPropos.attendu} />
        <Emplacement attendu={sections.appel.attendu} className="mt-4" />
      </Section>
    </>
  );
}
