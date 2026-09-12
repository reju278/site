import { AppelOffres } from "@/components/appel-offres";
import { LecteurVideo } from "@/components/lecteur-video";
import { Section } from "@/components/section";
import { avis } from "@/contenu/avis";
import { SITE, temoignages } from "@/contenu/site";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
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

      <Section className="[&>div]:pt-32 [&>div]:pb-0 sm:[&>div]:pt-40">
        <div className="mx-auto max-w-3xl">
          {/* Le retour au sommaire, au-dessus du titre.

              C'est le fil d'Ariane du pauvre, et il suffit ici : la page n'a
              qu'un seul parent, et un fil de deux échelons sur trois lignes
              coûte plus qu'il ne rapporte. Il est **avant** le titre parce
              qu'un lien de retour placé après l'article n'aide que ceux qui
              l'ont lu en entier. */}
          <Link
            href="/resultats"
            className="group/roule inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Tous les résultats
          </Link>

          <h1 className="titre mt-6 text-3xl text-balance text-foreground sm:text-4xl lg:text-5xl">
            {article.titre}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
            {article.chapo}
          </p>
        </div>
      </Section>

      {/* L'entretien, en haut de page comme demandé.

          Il est plus large que le texte, `max-w-4xl` contre `max-w-3xl` : une
          vidéo se regarde, un texte se lit, et les deux n'ont pas la même bonne
          mesure. Le lecteur n'appelle Wistia qu'au clic. */}
      <Section className="[&>div]:pt-10 [&>div]:pb-0 sm:[&>div]:pt-12">
        <div className="mx-auto max-w-4xl">
          <LecteurVideo
            id={temoignage.id}
            titre={temoignage.nom}
            secondes={temoignage.secondes}
            affiche={affiche}
          />
        </div>
      </Section>

      <Section className="[&>div]:pt-12 sm:[&>div]:pt-16">
        {/* L'article.

            `max-w-3xl` et non la mesure des blocs : une ligne de texte courant
            se lit entre soixante et quatre-vingts caractères, et à la largeur
            d'une carte elle en porterait le double. */}
        <article className="mx-auto max-w-3xl">
          {article.sections.map((section) => (
            <section key={section.titre} className="mt-12 first:mt-0">
              <h2 className="titre text-2xl text-balance text-foreground sm:text-3xl">
                {section.titre}
              </h2>

              <div className="mt-5 space-y-5 text-base leading-relaxed text-pretty text-foreground/85 sm:text-lg">
                {section.paragraphes.map((paragraphe) => (
                  <p key={paragraphe}>{paragraphe}</p>
                ))}
              </div>

              {/* La citation.

                  `blockquote` et non un paragraphe en italique : c'est
                  l'élément d'une citation, et c'est lui qui dit à un lecteur
                  d'écran que ces mots sont ceux de quelqu'un d'autre. Le filet
                  à gauche et non des guillemets dessinés : le texte cité en
                  porte déjà, et deux marques pour la même chose se gênent.

                  `cite` porte le nom de qui parle, sous la citation. */}
              {section.citation ? (
                <figure className="mt-6 border-l-2 border-primary pl-5">
                  <blockquote className="text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
                    {section.citation.texte}
                  </blockquote>
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    <cite className="not-italic">{section.citation.qui}</cite>
                  </figcaption>
                </figure>
              ) : null}
            </section>
          ))}
        </article>
      </Section>

      <AppelOffres />
    </>
  );
}
