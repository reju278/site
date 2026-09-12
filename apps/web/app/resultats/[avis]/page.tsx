import { AppelFormation } from "@/components/appel-formation";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { AppelOffres } from "@/components/appel-offres";
import { LecteurVideo } from "@/components/lecteur-video";
import { Section } from "@/components/section";
import { TexteLie } from "@/components/texte-lie";
import { avis } from "@/contenu/avis";
import { SITE, liens, temoignages } from "@/contenu/site";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * La page d'un avis : l'entretien vidéo, puis son article.
 *
 * **L'adresse est `/resultats/<nom>` et non `/avis/<nom>`**, et ce n'est pas un
 * rangement. `/resultats` devient le sommaire qui les relie : le fil d'Ariane
 * est naturel, les enfants renforcent le parent au lieu de lui faire
 * concurrence, et tout le groupe parle du même sujet. Une page par témoignage
 * plutôt que des ancres sur une seule : une ancre n'a ni titre, ni description,
 * ni adresse à elle, et quinze ancres sur une page font une page qui parle de
 * quinze choses et ne se classe sur aucune.
 *
 * **Pas de balisage `Review`, et c'est délibéré.** Les avis qu'une entreprise
 * publie sur elle-même sont explicitement exclus des résultats enrichis de
 * Google depuis 2019 : poser des étoiles ici n'apporterait rien et exposerait à
 * une pénalité manuelle. Ce qui est éligible, et qui est réel, c'est le
 * `VideoObject` : la vignette de l'entretien dans les résultats, avec sa durée.
 *
 * Les pages sont **statiques** : `generateStaticParams` les construit toutes au
 * build, comme le reste du site. Rien n'est rendu à la demande.
 */

export function generateStaticParams() {
  return avis.map((a) => ({ avis: a.slug }));
}

/** L'avis et le témoignage qui vont ensemble, ou rien. */
const lire = (slug: string) => {
  const article = avis.find((a) => a.slug === slug);
  if (!article) return null;
  const temoignage = temoignages.find((t) => t.id === article.id);
  if (!temoignage) return null;
  return { article, temoignage };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ avis: string }>;
}): Promise<Metadata> {
  const { avis: slug } = await params;
  const trouve = lire(slug);
  if (!trouve) return {};

  const { article, temoignage } = trouve;
  const affiche = `/temoignages/${temoignage.id}.jpg`;

  /* Les trois avis qui suivent celui-ci dans le tableau, en bouclant. */
  const depart = avis.findIndex((a) => a.slug === article.slug);
  const voisins = Array.from({ length: Math.min(3, avis.length - 1) }, (_, i) =>
    avis[(depart + i + 1) % avis.length],
  ).filter((a): a is NonNullable<typeof a> => Boolean(a));

  return {
    title: article.titrePage,
    description: article.description,
    alternates: { canonical: `/resultats/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.titre,
      description: article.description,
      url: `/resultats/${article.slug}`,
      images: [{ url: affiche, width: 1280, height: 720 }],
    },
  };
}

/** Les secondes en durée ISO 8601, celle que `VideoObject` demande. */
const dureeIso = (secondes: number) => {
  const m = Math.floor(secondes / 60);
  const s = Math.round(secondes % 60);
  return `PT${m}M${s}S`;
};

export default async function PageAvis({
  params,
}: {
  params: Promise<{ avis: string }>;
}) {
  const { avis: slug } = await params;
  const trouve = lire(slug);
  if (!trouve) notFound();

  const { article, temoignage } = trouve;
  const affiche = `/temoignages/${temoignage.id}.jpg`;

  /* Les trois avis qui suivent celui-ci dans le tableau, en bouclant : chaque
     avis en cite donc trois, et chacun est cité autant de fois. */
  const depart = avis.findIndex((a) => a.slug === article.slug);
  const voisins = Array.from(
    { length: Math.min(3, avis.length - 1) },
    (_, i) => avis[(depart + i + 1) % avis.length],
  ).filter((a): a is (typeof avis)[number] => Boolean(a));

  /* Les données structurées de la vidéo.

     `uploadDate` est obligatoire pour `VideoObject` et **elle n'est pas
     inventée** : c'est la date de mise en ligne du média chez Wistia, portée
     par le témoignage. Une date approchée serait une donnée fausse déclarée à
     Google, ce qui est plus grave qu'une donnée absente. */
  const donnees = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: article.titre,
    description: article.description,
    thumbnailUrl: `${SITE}${affiche}`,
    uploadDate: temoignage.publie,
    duration: dureeIso(temoignage.secondes),
    embedUrl: `https://fast.wistia.net/embed/iframe/${temoignage.id}`,
    /* La transcription est **déclarée** et non laissée à découvrir :
       schema.org a une propriété faite pour ça, et la page la publie déjà en
       entier. La donner évite à Google d'avoir à deviner que le texte replié
       sous l'article est la parole de la vidéo. */
    transcript: article.transcription
      .map((tour) => `${tour.qui} : ${tour.texte}`)
      .join("\n\n"),
  };

  /* Le fil d'Ariane.

     C'est lui qui fait afficher « Résultats › Roland Buffet » dans les résultats
     de recherche au lieu de l'adresse brute. La page a un parent évident et un
     seul, donc deux échelons suffisent : un fil qui remonterait à l'accueil
     n'ajouterait qu'une ligne que tout le monde connaît déjà. */
  const filDAriane = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Résultats",
        item: `${SITE}/resultats`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: temoignage.nom,
        item: `${SITE}/resultats/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(filDAriane) }}
      />

      {/* Le cadre commun à l'en-tête, à l'entretien et à l'article.

          Il existe pour deux raisons qui doivent tenir ensemble. C'est lui qui
          porte le **fond du deck**, étendu jusque derrière la vidéo sur demande
          de Rémy, pour que l'entretien se détache au lieu de flotter sur la
          couleur de page. Et c'est lui le parent du `sticky` : sans parent
          commun, la vidéo se décollerait à la fin de sa propre section.

          Le fond n'a pas besoin de fondu par le bas, contrairement aux autres
          pages : la couche de l'article est opaque et passe par-dessus, donc il
          n'y a aucun endroit où on puisse le voir s'arrêter. C'est le même
          principe que le fondu, obtenu sans masque. */}
      <div className="relative isolate">
        <div
          aria-hidden
          className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10"
        />

      {/* L'en-tête.

          Il ne porte plus son fond lui-même, `EnTetePage` étant remplacé par le
          cadre ci-dessus : deux couches de la même matière l'une sur l'autre
          doubleraient le grain et les halos.

          Les cotes sont celles d'`EnTetePage`, reprises telles quelles pour que
          la page d'un avis démarre exactement comme les autres pages
          intérieures. Le contenu est centré, ce qui donne au titre et au chapô
          l'axe des autres pages ; l'article, lui, redevient ferré à gauche plus
          bas, un texte long se lisant à gauche et un titre s'annonçant au
          centre. */}
      <section className="px-5 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-6xl text-center">
        <h1 className="titre text-3xl text-balance text-foreground sm:text-4xl lg:text-5xl">
          {article.titre}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {article.chapo}
        </p>
        </div>
      </section>

      {/* L'entretien.

          Il défile avec la page : l'effet collant, où la vidéo restait en place
          pendant que l'article montait par-dessus, a été retiré sur décision de
          Rémy. Ce qui reste de lui est le panneau arrondi de l'article, qui
          était la moitié visible de l'idée.

          Il est plus large que le texte, `max-w-4xl` contre `max-w-3xl` : une
          vidéo se regarde, un texte se lit, et les deux n'ont pas la même bonne
          mesure. Le lecteur n'appelle Wistia qu'au clic. */}
        <section className="px-5">
          <div className="mx-auto max-w-4xl">
            <LecteurVideo
              id={temoignage.id}
              titre={temoignage.nom}
              secondes={temoignage.secondes}
              affiche={affiche}
              afficheAlt={article.afficheAlt}
            />

            {/* L'appel, juste sous l'entretien, sur demande de Rémy.

                Sa place est le moment : quelqu'un qui vient de voir un client
                raconter ses résultats est exactement là où la question se pose,
                et c'est avant d'avoir lu l'article, pas après. Les deux autres
                appels de la page ne visent pas le même moment, celui du milieu
                d'article propose de comprendre, celui de la fin propose de
                choisir entre les deux offres.

                `BoutonScintillant` est le bouton d'appel du site, celui de la
                page Résultats, et son fond se passe en valeur CSS et jamais en
                classe : voir la règle dans `AGENTS.md`. */}
            <div className="mt-6 flex justify-center">
              <BoutonScintillant href={liens.appel}>
                Réserver mon appel gratuit
                <ArrowRight className="size-4" />
              </BoutonScintillant>
            </div>
          </div>
        </section>

        {/* La couche de l'article : c'est elle, la page qui s'ouvre.

            **L'arrondi et le filet sont sur elle et non sur un bandeau
            au-dessus**, et c'est la réparation d'un défaut visible. Ils vivaient
            sur une lèvre posée par-dessus : la courbe se dessinait, mais le
            panneau opaque derrière gardait ses angles droits et venait remplir
            l'encoche. On voyait un trait courbe collé à un angle droit, ce qui
            n'a de sens nulle part. Porté par le panneau lui-même, l'arrondi
            découpe vraiment la matière, et le fond du deck se voit dans les
            deux coins.

            Le rayon est `--rayon-jonction` et non 5 px : la jonction fait toute
            la largeur de l'écran, et c'est exactement le cas que l'exception
            d'échelle du projet décrit. Voir `AGENTS.md`. */}
        <div className="relative mt-16 rounded-t-[var(--rayon-jonction)] border-t border-border bg-background sm:mt-20">


      <Section className="[&>div]:pt-14 sm:[&>div]:pt-20">
        {/* L'article.

            `max-w-3xl` et non la mesure des blocs : une ligne de texte courant
            se lit entre soixante et quatre-vingts caractères, et à la largeur
            d'une carte elle en porterait le double. */}
        <article className="mx-auto max-w-3xl">
          {article.sections.map((section, i) => (
            <section key={section.titre} className="mt-12 first:mt-0">
              <h2 className="titre text-2xl text-balance text-foreground sm:text-3xl">
                {section.titre}
              </h2>

              <div className="mt-5 space-y-5 text-base leading-relaxed text-pretty text-foreground/85 sm:text-lg">
                {section.paragraphes.map((paragraphe) => (
                  <p key={paragraphe}>
                    <TexteLie>{paragraphe}</TexteLie>
                  </p>
                ))}
              </div>

              {/* La citation.

                  `blockquote` et non un paragraphe en italique : c'est
                  l'élément d'une citation, et c'est lui qui dit à un lecteur
                  d'écran que ces mots sont ceux de quelqu'un d'autre.

                  **Les guillemets sont posés ici et non dans le texte**, sur
                  demande de Rémy : à l'écrire dans la donnée, on finit avec des
                  citations qui en ont et d'autres qui n'en ont pas. Ce sont les
                  guillemets français, avec leurs espaces insécables : une espace
                  ordinaire y autorise un retour à la ligne, et le guillemet se
                  retrouve seul en fin de ligne. */}
              {/* Le filet de la citation est en `foreground` et non en
                  `primary`, sur décision de Rémy : le bleu du site sert aux
                  actions, et une citation n'en est pas une. Un trait neutre
                  marque le retrait sans promettre un clic. */}
              {section.citation ? (
                <figure className="mt-6 border-l-2 border-foreground pl-5">
                  <blockquote className="text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
                    {`«\u00a0${section.citation.texte}\u00a0»`}
                  </blockquote>
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    <cite className="not-italic">{section.citation.qui}</cite>
                  </figcaption>
                </figure>
              ) : null}

              {/* L'appel à l'action, à la moitié de l'article.

                  Sa place est calculée et non écrite dans le contenu : un
                  article de cinq sections et un de huit ne coupent pas au même
                  endroit, et un numéro posé à la main dans `avis.ts` serait faux
                  au premier remaniement. */}
              {i === Math.floor(article.sections.length / 2) - 1 ? (
                <AppelFormation />
              ) : null}
            </section>
          ))}
          {/* La transcription, repliée sous l'article.

              `details` et `summary` natifs : aucun JavaScript, le texte est dans
              le document dès le premier octet, et le pli s'ouvre au clavier
              comme à la souris. Un accordéon écrit à la main demanderait un état
              React et retirerait le contenu du DOM tant qu'il est fermé, ce qui
              est exactement l'inverse de ce qu'on veut ici.

              Un moteur indexe normalement ce qui est replié, depuis
              l'indexation mobile d'abord : mille mots de plus par page, sur le
              bon sujet et dans les mots de la personne. Et c'est d'abord de
              l'accessibilité, que les conventions du projet réclament pour toute
              vidéo qui porte le message d'une page.

              `marker:` retire le triangle du navigateur, qui n'a pas la même
              forme d'un navigateur à l'autre, au profit d'un chevron qui pivote
              à l'ouverture. */}
          <details className="group/pli mt-16 border-t border-border pt-8">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-base font-semibold text-foreground marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              <ChevronRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-open/pli:rotate-90"
              />
              Lire la transcription de l&apos;entretien
            </summary>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-pretty text-foreground/75">
              {article.transcription.map((tour, i) => (
                <p key={`${i}-${tour.qui}`}>
                  <span className="font-semibold text-foreground">
                    {tour.qui} :
                  </span>{" "}
                  {tour.texte}
                </p>
              ))}
            </div>
          </details>

          {/* Les avis voisins.

              **C'est le levier le plus fort de l'ensemble**, et il ne se voit
              pas sur une page seule : quinze articles qui ne se citent pas sont
              quinze pages isolées ; les mêmes qui se citent forment un groupe où
              chacune renforce les autres.

              Les voisins sont pris **à la suite dans le tableau, en bouclant**.
              Chaque avis en cite donc trois, et chacun est cité autant de fois.
              Un tirage au hasard ferait des orphelins ; un tri par date
              laisserait les plus anciens sans personne pour les pointer.

              Le bloc ne s'affiche pas tant qu'il n'y a pas d'autre avis : une
              page ne s'annonce pas des voisins qui n'existent pas encore. */}
          {voisins.length > 0 ? (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="titre text-2xl text-foreground sm:text-3xl">
                D&apos;autres membres racontent
              </h2>

              <ul className="mt-6 space-y-4">
                {voisins.map((voisin) => (
                  <li key={voisin.slug}>
                    <Link
                      href={`/resultats/${voisin.slug}`}
                      className="text-base font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-lg"
                    >
                      {voisin.titre}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </Section>

      <AppelOffres />
        </div>
      </div>
    </>
  );
}
