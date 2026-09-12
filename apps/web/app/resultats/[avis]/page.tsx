import { AppelFormation } from "@/components/appel-formation";
import { AppelOffres } from "@/components/appel-offres";
import { EnTetePage } from "@/components/en-tete-page";
import { LecteurVideo } from "@/components/lecteur-video";
import { Section } from "@/components/section";
import { TexteLie } from "@/components/texte-lie";
import { avis } from "@/contenu/avis";
import { SITE, temoignages } from "@/contenu/site";
import type { Metadata } from "next";
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

  return {
    title: article.titre,
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
      />

      {/* L'en-tête, sur le fond du deck.

          C'est `EnTetePage`, la même couche que les autres pages intérieures,
          sur demande de Rémy : un avis est une page du site, pas un document à
          part. Elle centre son contenu, ce qui donne au titre et au chapô l'axe
          des autres pages. L'article, lui, redevient ferré à gauche plus bas :
          un texte long se lit à gauche, un titre s'annonce au centre. */}
      <EnTetePage>
        <h1 className="titre text-3xl text-balance text-foreground sm:text-4xl lg:text-5xl">
          {article.titre}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {article.chapo}
        </p>
      </EnTetePage>

      {/* L'entretien.

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
          />
        </div>
      </section>

      {/* La séparation entre l'entretien et l'article, sur demande de Rémy.

          C'est la lèvre de l'accueil : un filet qui remonte à ses deux bouts,
          `rounded-t` et `border-t`. Elle ne sépare pas deux couleurs, les deux
          côtés sont sur le fond de page ; elle sépare deux **natures**, ce
          qu'on regarde et ce qu'on lit, et c'est une frontière qui mérite d'être
          dessinée plutôt que cachée.

          Le rayon est `--rayon-jonction` et non 5 px : la jonction fait toute la
          largeur de l'écran, et c'est exactement le cas que l'exception
          d'échelle du projet décrit. Voir `AGENTS.md`. */}
      <div
        aria-hidden
        className="mt-16 h-16 rounded-t-[var(--rayon-jonction)] border-t border-border sm:mt-20"
      />

      <Section className="[&>div]:pt-0">
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
              {section.citation ? (
                <figure className="mt-6 border-l-2 border-primary pl-5">
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
        </article>
      </Section>

      <AppelOffres />
    </>
  );
}
