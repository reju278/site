import { Emplacement, Section, TitreSection } from "@/components/section";
import { identite, lettre, liens, offres, sections } from "@/contenu/site";
import { formaterDate, lireArticles } from "@/lib/flux";
import { Button } from "@repo/ui/components/button";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import Link from "next/link";

export default async function Accueil() {
  const articles = await lireArticles(3);

  return (
    <>
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
            <img
              src="/fond-hero-mobile.jpg"
              alt=""
              className="size-full object-cover"
            />
          </picture>
          <div aria-hidden className="absolute inset-0 bg-black/55" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="titre text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              Vivez de votre expertise en ligne.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-white/80">
              {identite.resume}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={liens.funnelsClub}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Découvrir Funnels Club
              </a>
              {/* Libellé de travail, à renommer. */}
              <a
                href="#video"
                // Fond porté à 20 % et filet à 45 % : à 10 % et 15 %, le
                // libellé tombait à 3,91:1 et le filet très en dessous du 3:1
                // attendu d'une bordure de contrôle.
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white/20 px-5 text-sm font-semibold text-white ring-1 ring-white/45 ring-inset backdrop-blur-md transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Voir la vidéo
                <Play className="size-4" />
              </a>
            </div>
          </div>

          {/* Le cadre est en 16/9, comme la vidéo : c'est ce qui la fait
              remplir exactement, sans bande noire. Wistia est intégré en
              `iframe` plutôt qu'avec leur `player.js` : le lecteur est le
              même, et on évite de charger un script tiers sur toutes les
              pages pour une seule vidéo. */}
          <div
            id="video"
            className="mx-auto mt-14 max-w-3xl scroll-mt-[66px] sm:mt-20"
          >
            <div className="aspect-16/9 overflow-hidden rounded-md bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/45">
              <iframe
                src="https://fast.wistia.net/embed/iframe/di3bzcmi50?videoFoam=false"
                title="Vidéo de présentation"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="size-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Les deux programmes. Texte repris de remy-jupille.com, au mot près.
      --------------------------------------------------------------- */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          {offres.map((offre) => (
            <article
              key={offre.id}
              className="flex flex-col rounded-md border border-border bg-card p-8"
            >
              <h2 className="titre text-3xl text-card-foreground">
                {offre.nom}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {offre.texte}
              </p>

              <Button asChild className="mt-8 h-11 w-fit font-semibold">
                <a href={offre.href} target="_blank" rel="noreferrer">
                  {offre.action}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          La lettre. Seul contenu du site qui vienne de l'extérieur : il est
          lu dans le flux RSS de Substack, au build puis toutes les heures.
      --------------------------------------------------------------- */}
      {articles.length > 0 ? (
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <TitreSection
              etiquette={lettre.baseline}
              titre={lettre.nom}
              className="max-w-xl"
            />
            <Button asChild variant="outline" className="h-11 font-semibold">
              <a href={liens.lettre} target="_blank" rel="noreferrer">
                Tous les articles
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <a
                key={article.lien}
                href={article.lien}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring"
              >
                {article.image ? (
                  // Une image de Substack, servie par leur CDN et de taille
                  // inconnue au build : `next/image` n'y gagnerait rien et
                  // exigerait de déclarer leur domaine.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.image}
                    alt=""
                    loading="lazy"
                    className="aspect-16/9 w-full object-cover"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-muted-foreground">
                    {formaterDate(article.date)}
                  </p>
                  <h3 className="mt-2 text-lg leading-snug font-semibold text-balance text-card-foreground">
                    {article.titre}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {article.chapeau}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Section>
      ) : null}

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
