import { Apparition } from "@/components/apparition";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { EnTetePage } from "@/components/en-tete-page";
import { LecteurVideo } from "@/components/lecteur-video";
import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { avis } from "@/contenu/avis";
import { consulting, type Segment } from "@/contenu/consulting";
import { SITE, estExterne, temoignages } from "@/contenu/site";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * La page du consulting privé : l'entretien de Lilian, le texte de Rémy, puis
 * le bouton pour postuler.
 *
 * C'est la page vers laquelle mènent tous les liens « consulting » du site.
 * Le formulaire de candidature n'est atteint qu'ici, par le lien du premier paragraphe et par le
 * bouton : on postule après avoir lu ce qu'on demande.
 *
 * Le texte se lit comme la lettre de l'accueil : même mesure, même corps, même
 * surlignage jaune, qui y dit déjà « regardez ça ».
 */

export const metadata: Metadata = {
  title: consulting.titrePage,
  description: consulting.description,
  alternates: { canonical: "/consulting" },
};

const LIEN =
  "font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Un segment de paragraphe, avec sa marque. */
function rendre(segment: Segment, i: number) {
  if (typeof segment === "string") return insecables(segment);

  if ("href" in segment) {
    /* Le formulaire sort du site : nouvel onglet et `noreferrer`, la balise de
       provenance est déjà dans `liens`. Un lien interne reste dans l'onglet. */
    return estExterne(segment.href) ? (
      <a
        key={i}
        href={segment.href}
        target="_blank"
        rel="noreferrer"
        className={LIEN}
      >
        {segment.texte}
      </a>
    ) : (
      <Link key={i} href={segment.href} className={LIEN}>
        {segment.texte}
      </Link>
    );
  }

  if (segment.marque === "surligne") {
    return (
      <mark
        key={i}
        className="surlignage"
        style={
          {
            "--surlignage-fond":
              "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)",
          } as React.CSSProperties
        }
      >
        {insecables(segment.texte)}
      </mark>
    );
  }

  return segment.marque === "gras" ? (
    <strong key={i} className="font-semibold text-foreground">
      {insecables(segment.texte)}
    </strong>
  ) : (
    <em key={i}>{insecables(segment.texte)}</em>
  );
}

/** Les secondes en durée ISO 8601, celle que `VideoObject` demande. */
const dureeIso = (secondes: number) =>
  `PT${Math.floor(secondes / 60)}M${Math.round(secondes % 60)}S`;

export default function Consulting() {
  /* L'entretien et son article. S'il disparaissait d'`avis.ts`, la page
     resterait debout sans vidéo plutôt que de casser. */
  const article = avis.find((a) => a.id === consulting.temoignage);
  const temoignage = temoignages.find((t) => t.id === consulting.temoignage);
  const affiche = `/temoignages/${consulting.temoignage}.jpg`;

  /* `uploadDate` est la date de mise en ligne chez Wistia, portée par le
     témoignage : relevée, jamais approchée. */
  const donnees =
    article && temoignage
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: article.titrePage,
          description: article.description,
          thumbnailUrl: `${SITE}${affiche}`,
          uploadDate: temoignage.publie,
          duration: dureeIso(temoignage.secondes),
          embedUrl: `https://fast.wistia.net/embed/iframe/${temoignage.id}`,
        }
      : null;

  return (
    <>
      {donnees ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
        />
      ) : null}

      <EnTetePage>
        <p className="text-sm font-semibold text-muted-foreground">
          {consulting.surtitre}
        </p>
        <h1 className="titre mt-3 text-5xl text-balance text-foreground sm:text-6xl">
          {consulting.titre}
        </h1>
      </EnTetePage>

      <Section>
        {/* La vidéo est plus large que le texte, comme sur la page d'un avis :
            une vidéo se regarde, un texte se lit. */}
        {article && temoignage ? (
          <div className="mx-auto max-w-4xl">
            <LecteurVideo
              id={temoignage.id}
              titre={temoignage.nom}
              secondes={temoignage.secondes}
              affiche={affiche}
              afficheAlt={article.afficheAlt}
            />
          </div>
        ) : null}

        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-base leading-relaxed text-pretty text-foreground/85 sm:mt-16 sm:text-lg">
          {consulting.paragraphes.map((paragraphe, i) => (
            <Apparition key={i}>
              <p>{paragraphe.map(rendre)}</p>
            </Apparition>
          ))}

          <Apparition className="flex justify-center pt-8 sm:pt-10">
            <BoutonScintillant
              href={consulting.postuler.href}
              fond="var(--or)"
              encre="var(--or-encre)"
              className="w-full sm:w-auto"
            >
              <TexteRoulant>{consulting.postuler.libelle}</TexteRoulant>
            </BoutonScintillant>
          </Apparition>
        </div>
      </Section>
    </>
  );
}
