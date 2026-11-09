import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * L'affiche d'une vidéo Wistia, **telle que Wistia l'affiche aujourd'hui**.
 *
 * **Elle existe pour réparer un vrai défaut.** Les affiches étaient des copies
 * figées dans `public/temoignages`, et Rémy change ses miniatures dans Wistia :
 * le site montrait alors son ancienne image, puis le lecteur de Wistia peignait
 * la nouvelle par-dessus, ce que Rémy a vu comme « une frame, puis la
 * miniature ». Relevé le 9 novembre 2026 : trois affiches sur trente-quatre ne
 * correspondaient plus (`/debuts`, `/stable`, la vidéo verticale
 * d'`/immersion`), et celle de `/lancement` a changé pendant qu'on mesurait.
 * Une copie qui doit être tenue à jour à la main finit fausse.
 *
 * **Servie par nous et mise en cache**, revalidée toutes les dix minutes :
 * le CDN de Vercel garde le fichier, donc aucune requête ne part chez Wistia à
 * l'ouverture d'une page, et un changement de miniature arrive tout seul.
 *
 * **En WebP, et en trois largeurs.** Wistia sait les produire : 116 Ko en
 * 1 280 px contre 327 pour le JPEG qu'on servait sur `/debuts`, et 40 Ko en
 * 640 px pour un téléphone.
 *
 * **Seules les vidéos du site sont servies** : la liste est celle des fichiers
 * de `public/temoignages`, lue au build, et `dynamicParams` refuse le reste.
 * Cette route n'est pas un relais ouvert vers n'importe quel compte Wistia.
 *
 * **Si Wistia ne répond pas**, on renvoie à la copie locale : une affiche un
 * peu ancienne vaut mieux qu'une image cassée. Le cache garde cette réponse
 * dix minutes, puis réessaie.
 */
export const revalidate = 600;
export const dynamicParams = false;

/** Les largeurs servies. 1 280 est celle d'origine, les deux autres pour les écrans étroits. */
const LARGEURS = [640, 960, 1280] as const;

/** `h4z4g82lyi.webp` ou `h4z4g82lyi-640.webp`. */
const FICHIER = /^([a-z0-9]{10})(?:-(640|960))?\.webp$/;

export function generateStaticParams() {
  const ids = readdirSync(join(process.cwd(), "public/temoignages"))
    .filter((f) => f.endsWith(".jpg"))
    .map((f) => f.slice(0, -4));
  return ids.flatMap((id) =>
    LARGEURS.map((l) => ({
      fichier: l === 1280 ? `${id}.webp` : `${id}-${l}.webp`,
    })),
  );
}

export async function GET(
  _requete: Request,
  { params }: { params: Promise<{ fichier: string }> },
) {
  const { fichier } = await params;
  const lu = FICHIER.exec(fichier);
  if (!lu) return new Response("Affiche inconnue", { status: 404 });
  const id = lu[1]!;
  const largeur = lu[2] ?? "1280";
  /* Une adresse relative, et pas `requete.url` : lire la requête rendrait la
     route dynamique, donc recalculée à chaque appel au lieu d'être figée au
     build et servie par le CDN. */
  const repli = new Response(null, {
    status: 307,
    headers: { Location: `/temoignages/${id}.jpg` },
  });

  try {
    const media = await fetch(`https://fast.wistia.com/embed/medias/${id}.json`, {
      next: { revalidate },
    });
    if (!media.ok) return repli;
    const json = (await media.json()) as {
      media?: { assets?: { type: string; url: string }[] };
    };
    const still = json.media?.assets?.find((a) => a.type === "still_image");
    if (!still) return repli;

    /* L'adresse de Wistia finit en `.bin` : c'est l'extension qui choisit le
       format servi, et `image_resize` garde les proportions, ce qui compte
       pour la vidéo verticale. */
    const source = `${still.url.replace(/\.[a-z]+$/, ".webp")}?image_resize=${largeur}`;
    const image = await fetch(source, { next: { revalidate } });
    if (!image.ok) return repli;

    return new Response(await image.arrayBuffer(), {
      headers: { "Content-Type": "image/webp" },
    });
  } catch {
    return repli;
  }
}
