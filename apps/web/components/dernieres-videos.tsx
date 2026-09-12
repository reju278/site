import { formaterDate, lireDernieresVideos } from "@/lib/flux";
import { insecables } from "@/lib/typographie";
import { ArrowUpRight } from "lucide-react";

/**
 * « Mes dernières vidéos » : la dernière vidéo de chacune des trois chaînes.
 *
 * Le titre est de Rémy, la forme aussi : « trois colonnes, donc le même design
 * qu'on pourra avoir sur la page du blog : trois fiches ». C'est donc la carte
 * du blog reprise telle quelle, image en 16/9 puis date, titre et une ligne en
 * dessous. Une seule différence, et elle est nécessaire : la ligne du bas porte
 * le nom de la chaîne, parce que c'est ce qui distingue les trois fiches.
 *
 * **Ces fiches mènent à YouTube et n'ont pas de page ici**, contrairement aux
 * articles de la lettre. Ce n'est pas une inconséquence : le flux de Substack
 * porte le texte entier de l'article, donc il y a de quoi faire une page ; le
 * flux de YouTube ne porte qu'un titre, une date et une vignette. Une page par
 * vidéo ne contiendrait qu'un lecteur embarqué et trois lignes de description,
 * c'est-à-dire une page vide pour un moteur, et ça se retourne contre le site.
 *
 * La section se met à jour toute seule, comme le blog : les flux sont relus
 * toutes les dix minutes et les pages restent servies en statique.
 *
 * **Elle ne s'affiche pas si elle n'a rien.** Une section vide sous son titre
 * est pire que pas de section, et les trois flux peuvent tomber.
 */
export async function DernieresVideos() {
  const videos = await lireDernieresVideos();

  if (videos.length === 0) return null;

  return (
    <>
      {/* `h2` : c'est une section de la page d'accueil, dont le `h1` est le
          titre du hero. Aucun niveau n'est sauté.

          Pas de `TitreRoulant` ici, contrairement aux deux sections
          au-dessus : leurs titres sont des phrases de deux membres dont l'un
          porte l'accent, et l'effet mot à mot a été relevé sur elles. Celui-ci
          est une étiquette de trois mots. */}
      {/* `text-3xl` sur téléphone : à 36 px, « Mes dernières vidéos » se coupe
          et laisse « vidéos » seul sur sa ligne, ce que la règle de forme du
          projet interdit. À 30 px, le titre tient sur une ligne. Mesuré. */}
      <h2 className="titre text-center text-3xl text-balance text-foreground sm:text-5xl">
        Mes dernières vidéos
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
        {videos.map((video) => (
          <a
            key={video.lien}
            href={video.lien}
            target="_blank"
            rel="noreferrer"
            className="relief-verre group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {/* **`object-cover` dans un cadre en 16/9, et c'est un recadrage
                voulu.** `hqdefault` est servie en 480 sur 360, donc en 4/3 :
                affichée telle quelle à côté des fiches du blog, qui sont en
                16/9, elle casserait l'alignement de la grille. Le cadre porte
                le rapport, l'image le remplit, et ce qui est rogné est le haut
                et le bas, là où une vignette YouTube ne met jamais l'essentiel.

                Servie par YouTube et non par nous : `next/image` n'y gagnerait
                rien et exigerait de déclarer leur domaine. Ses cotes sont
                déclarées, sans quoi la page saute au chargement. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.image}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              className="aspect-16/9 w-full object-cover"
            />

            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm text-muted-foreground">
                {formaterDate(video.date)}
              </p>
              <h3 className="mt-2 text-lg leading-snug font-semibold text-balance text-card-foreground">
                {insecables(video.titre)}
              </h3>

              {/* Le nom de la chaîne, poussé en bas de la fiche : `mt-auto`
                  sur une carte en `h-full` est ce qui aligne les trois lignes
                  entre elles, quelle que soit la longueur des titres. La
                  flèche dit que le lien sort du site. */}
              <p className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-muted-foreground">
                {video.chaine}
                <ArrowUpRight aria-hidden className="size-3.5 shrink-0 opacity-60" />
              </p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
