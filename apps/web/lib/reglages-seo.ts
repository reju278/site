import type { Metadata } from "next";
import { identite } from "@/contenu/site";

/**
 * Les réglages SEO posés depuis le CRM Funnels Club (onglet Funnels →
 * « Réglages » d'une page) : titre, description, image de partage,
 * indexation.
 *
 * Le site les lit à l'affichage, par l'adresse publique du CRM, et les pose
 * par-dessus ce que la page déclare. Sans réglage — ou si le CRM ne répond
 * pas dans les deux secondes — la page garde ses propres métadonnées : un
 * site ne tombe jamais pour une balise.
 *
 * Ces réglages sont publics par nature (ils finissent dans le HTML) ; seul
 * le CRM les écrit. Relus toutes les cinq minutes au plus.
 */

const ADRESSE_REGLAGES =
  "https://lovely-pheasant-821.eu-west-1.convex.site/funnel/seo";

type Reglages = {
  indexable?: boolean | null;
  titre?: string | null;
  description?: string | null;
  image?: string | null;
};

const lire = async (chemin: string): Promise<Reglages> => {
  try {
    const reponse = await fetch(
      `${ADRESSE_REGLAGES}?domaine=remy-jupille.com&chemin=${encodeURIComponent(chemin)}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(2000) },
    );
    return reponse.ok ? ((await reponse.json()) as Reglages) : {};
  } catch {
    return {};
  }
};

/** Les métadonnées d'une page, avec les réglages du CRM par-dessus. */
export async function avecReglages(
  chemin: string,
  page: Metadata,
): Promise<Metadata> {
  const r = await lire(chemin);
  if (!r.titre && !r.description && !r.image && r.indexable == null) {
    return page;
  }
  const titre = r.titre ?? undefined;
  const description = r.description ?? page.description ?? undefined;
  const images = r.image
    ? [{ url: r.image, width: 1200, height: 630 }]
    : page.openGraph?.images;
  return {
    ...page,
    // Absolu : le titre du CRM est écrit en entier, sans le gabarit
    // « … · Rémy Jupille » du site.
    ...(titre ? { title: { absolute: titre } } : {}),
    ...(description ? { description } : {}),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: identite.nom,
      ...page.openGraph,
      ...(titre ? { title: titre } : {}),
      ...(description ? { description } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(titre ? { title: titre } : {}),
      ...(description ? { description } : {}),
      ...(r.image ? { images: [r.image] } : {}),
    },
    ...(r.indexable === true ? { robots: { index: true, follow: true } } : {}),
    ...(r.indexable === false
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
