import type { Metadata } from "next";

/**
 * L'aperçu d'une page du tunnel VSL quand on colle son lien dans WhatsApp,
 * LinkedIn, Messenger ou un e-mail : son titre, sa description et son image.
 *
 * **Les images sont des photographies des pages elles-mêmes**, composées au
 * dessin du tunnel (fond crème, Plus Jakarta Sans, le bleu du site) et
 * relevées par Chrome en 1200 × 630, le format qu'attendent ces applications.
 * Elles vivent dans `public/partage/` ; une page qui change de visage doit
 * changer d'image. Les dates en sont absentes exprès : une image de partage
 * reste en cache des semaines chez ceux qui l'affichent.
 *
 * Le chemin est relatif : `metadataBase`, posé dans le gabarit racine, le
 * rend absolu, et la même image sert sur `go.funnels.club`.
 *
 * Le CRM peut encore poser une autre image par-dessus, voir `avecReglages`.
 */
export function partageTunnel({
  titre,
  description,
  image,
  alt,
}: {
  titre: string;
  description: string;
  /** Le nom du fichier dans `public/partage/`, sans extension. */
  image: string;
  alt: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [
    { url: `/partage/${image}.jpg`, width: 1200, height: 630, alt },
  ];
  return {
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Funnels Club",
      title: titre,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: titre,
      description,
      images,
    },
  };
}
