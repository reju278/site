import { AppelHubArticle } from "@/components/appel-hub";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { LecteurVideo } from "@/components/lecteur-video";
import { Section } from "@/components/section";
import { TexteLie } from "@/components/texte-lie";
import { afficheHub, appelHub, titresHub } from "@/contenu/hub";
import { temoignages } from "@/contenu/site";
import { HUB, SORTIE, avisHub, avisServis, controlerLeHub } from "@/lib/hub";
import { insecables } from "@/lib/typographie";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Un entretien, dans sa version hub.
 *
 * **Le dessin est celui de `/resultats/<nom>`, à l'identique**, sur demande de
 * Rémy. Ce qui change relève de la conformité et de la fermeture du hub, jamais
 * de l'apparence :
 *
 * - l'en-tête vient de `contenu/hub.ts`, les corps sont expurgés de leurs
 *   montants par `avisHub` ;
 * - les liens en contexte, le bandeau de l'autre entretien et les avis voisins
 *   restent dans le hub ;
 * - l'encart du milieu ne propose plus que l'appel, la formation gratuite
 *   vivant sur un autre domaine ;
 * - les deux cartes d'offres de fin d'article sont retirées : elles mènent
 *   ailleurs, et la page a déjà son appel ;
 * - **la transcription n'est pas publiée**, sur décision de Rémy : elle ne sert
 *   ni au référencement, la page étant interdite d'index, ni à un lecteur
 *   d'écran qui trouverait la même vidéo sur `/resultats`, et mille mots de
 *   parole non relue sur une page de publicité sont autant d'occasions de
 *   retomber sur une promesse.
 *
 * **Pas de données structurées.** `VideoObject` et `BreadcrumbList` existent
 * pour être lus par un moteur ; les déclarer sur une page interdite d'index
 * serait se contredire. Elles restent sur `/resultats/<nom>`, qui est la page
 * faite pour être trouvée.
 *
 * **Pas de `dynamicParams`.** Le hub ne sert que les avis qui ont leur version
 * de hub : une adresse inventée, ou un avis ajouté sans passer par
 * `contenu/hub.ts`, rend un 404 plutôt que d'arriver avec son titre d'origine.
 */

export function generateStaticParams() {
  return avisServis.map((a) => ({ avis: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ avis: string }>;
}): Promise<Metadata> {
  const { avis: slug } = await params;
  const article = avisHub(slug);
  if (!article) return {};

  return {
    title: article.titrePage,
    description: article.description,
  };
}

export default async function PageAvisHub({
  params,
}: {
  params: Promise<{ avis: string }>;
}) {
  const { avis: slug } = await params;
  const article = avisHub(slug);
  if (!article) notFound();

  const temoignage = temoignages.find((t) => t.id === article.id);
  if (!temoignage) notFound();

  /* **L'affiche nettoyée et non l'originale**, quand il y en a une. Elle
     porte les mêmes cotes et le même cadrage, seules ses bandes noires ont été
     repeintes : le lecteur ne change donc ni de rapport ni de mise en page.
     Le sommaire passe par la même fonction, sans quoi la phrase reparaîtrait
     sur la page où l'on regarde vraiment la vidéo. */
  const affiche = afficheHub(temoignage.id);

  /* Les trois avis qui suivent, en bouclant, et **seulement ceux qui ont leur
     version de hub** : un voisin sans entrée mènerait à un 404. */
  const servis = avisServis;
  const depart = servis.findIndex((a) => a.slug === article.slug);
  const voisins = Array.from(
    { length: Math.min(3, servis.length - 1) },
    (_, i) => servis[(depart + i + 1) % servis.length],
  ).filter((a): a is (typeof servis)[number] => Boolean(a));

  /* L'autre entretien de la même personne n'est montré que s'il est lui-même
     servi par le hub : son jumeau peut avoir été écarté pour son affiche, et un
     bandeau qui mène à un 404 est pire que pas de bandeau. La valeur est
     calculée **une fois** et sert au contrôle comme au rendu : c'est ce qui
     empêche de contrôler autre chose que ce qu'on affiche. */
  const autre =
    article.autreEntretien &&
    servis.some((a) => a.slug === article.autreEntretien?.slug)
      ? article.autreEntretien
      : null;

  /* Le contrôle, sur tout ce que la page va écrire.
     Il tourne au build, puisque la page est statique : un montant qui aurait
     échappé au nettoyage casse la construction au lieu de partir en production
     sur une page de publicité. */
  controlerLeHub(
    [
      article.titre,
      article.titrePage,
      article.description,
      article.chapo,
      article.afficheAlt,
      ...article.sections.flatMap((s) => [
        s.titre,
        ...s.paragraphes,
        ...(s.citation ? [s.citation.texte] : []),
      ]),
      ...voisins.map((v) => titresHub[v.slug]?.titre ?? ""),
      ...(autre ? [autre.libelle] : []),
      appelHub.titre,
      appelHub.texte,
      appelHub.libelle,
    ],
    `l'avis « ${article.slug} » du hub`,
  );

  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10"
      />

      <section className="px-5 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="titre text-3xl text-balance text-foreground sm:text-4xl lg:text-5xl">
            {insecables(article.titre)}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            <TexteLie>{article.chapo}</TexteLie>
          </p>
        </div>
      </section>

      <section className="px-5">
        <div className="mx-auto max-w-4xl">
          <LecteurVideo
            id={temoignage.id}
            titre={temoignage.nom}
            secondes={temoignage.secondes}
            affiche={affiche}
            afficheAlt={article.afficheAlt}
          />

          {/* L'appel juste sous l'entretien, comme sur le site : c'est le
              moment où la question se pose, avant même d'avoir lu l'article. */}
          <div className="mt-6 flex justify-center">
            <BoutonScintillant href={SORTIE}>
              {appelHub.libelle}
              <ArrowRight className="size-4" />
            </BoutonScintillant>
          </div>
        </div>
      </section>

      <div className="relative mt-16 rounded-t-[var(--rayon-jonction)] border-t border-border bg-background sm:mt-20">
        <Section className="[&>div]:pt-14 sm:[&>div]:pt-20">
          {/* Le bandeau vers l'autre entretien de la même personne, réécrit vers
              le hub. Il n'apparaît que si cet autre entretien y est servi. */}
          {autre ? (
            <div className="mx-auto mb-12 max-w-3xl">
              <Link
                href={`${HUB}/${autre.slug}`}
                className="relief-verre group/roule flex items-center gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    L&apos;autre entretien
                  </span>
                  <span className="mt-1 block text-base text-pretty text-card-foreground">
                    {autre.libelle}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-5 shrink-0 text-primary transition-transform group-hover/roule:translate-x-0.5"
                />
              </Link>
            </div>
          ) : null}

          <article className="mx-auto max-w-3xl">
            {article.sections.map((section, i) => (
              <section key={section.titre} className="mt-12 first:mt-0">
                <h2 className="titre text-2xl text-balance text-foreground sm:text-3xl">
                  {insecables(section.titre)}
                </h2>

                <div className="mt-5 space-y-5 text-base leading-relaxed text-pretty text-foreground/85 sm:text-lg">
                  {section.paragraphes.map((paragraphe) => (
                    <p key={paragraphe}>
                      <TexteLie>{paragraphe}</TexteLie>
                    </p>
                  ))}
                </div>

                {section.citation ? (
                  <figure className="mt-6 border-l-2 border-foreground pl-5">
                    <blockquote className="text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
                      {`« ${section.citation.texte} »`}
                    </blockquote>
                    <figcaption className="mt-2 text-sm text-muted-foreground">
                      <cite className="not-italic">{section.citation.qui}</cite>
                    </figcaption>
                  </figure>
                ) : null}

                {/* L'appel à mi-article. Sa place se calcule sur le nombre de
                    sections **restantes** : le hub en retire celles dont tous
                    les paragraphes portaient un montant, donc un rang repris de
                    l'article d'origine tomberait à côté. */}
                {i === Math.floor(article.sections.length / 2) - 1 ? (
                  <AppelHubArticle />
                ) : null}
              </section>
            ))}

            {/* **Pas de transcription sur le hub**, sur décision de Rémy.

                Elle existe sur `/resultats/<nom>`, où elle fait tout son
                travail : mille mots de plus sur le bon sujet, dans les mots de
                la personne, et l'accessibilité d'une vidéo pour qui ne peut pas
                l'écouter. Ici, aucun des deux ne s'applique. La page est
                interdite d'index, donc le référencement ne la lira jamais ; et
                c'est une page de publicité, où mille mots de parole non relue
                multiplient les occasions de retomber sur un montant ou sur une
                promesse qu'aucun contrôle n'attrape.

                C'est le même raisonnement que pour les affiches : ce qui ne
                sert à rien sur cette page-ci et peut coûter cher n'y est pas. */}

            {voisins.length > 0 ? (
              <section className="mt-16 border-t border-border pt-10">
                <h2 className="titre text-2xl text-foreground sm:text-3xl">
                  D&apos;autres membres racontent
                </h2>

                <ul className="mt-6 space-y-4">
                  {voisins.map((voisin) => (
                    <li key={voisin.slug}>
                      <Link
                        href={`${HUB}/${voisin.slug}`}
                        className="text-base font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-lg"
                      >
                        {insecables(titresHub[voisin.slug]?.titre ?? "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        </Section>
      </div>
    </div>
  );
}
