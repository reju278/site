import { BoutonOuvrirInscription } from "@/components/ouvrir-inscription";
import { avisDe } from "@/contenu/avis";
import { temoignages } from "@/contenu/site";
import { optinVsl, temoignagesVsl, titreTemoignagesVsl } from "@/contenu/vsl";
import { insecables } from "@/lib/typographie";
import Image from "next/image";

/**
 * Les témoignages de `/course`, sous la lettre de Rémy.
 *
 * **Le dessin est celui des cartes d'avis du hero d'`/immersion`** : verre en
 * `color-mix`, relief intérieur, 25 px de rayon, aucune bordure. Sans
 * l'inclinaison au survol, sur demande de Rémy. L'affiche de l'entretien prend
 * la place du portrait, en photo fixe : la vidéo y a été, Rémy l'a retirée,
 * pour que la carte se lise d'un coup d'œil sans rien promettre au clic.
 *
 * **Les résultats sont ceux de vraies personnes.** La mention qui dit qu'ils
 * ne sont pas garantis est dans le pied de page, sous les avertissements, sur
 * décision de Rémy : voir `mentionTemoignagesVsl`.
 */
export function TemoignagesVsl() {
  const cartes = temoignagesVsl.map(({ id, citation }) => {
    const temoignage = temoignages.find((t) => t.id === id);
    const article = avisDe(id);
    if (!temoignage || !article) {
      throw new Error(`Témoignage de /course introuvable : ${id}`);
    }
    /* Une citation au mot près se vérifie : si l'article change, la carte
       ne doit pas garder une phrase que la personne n'a plus dite. */
    const citee = article.sections.some((s) => s.citation?.texte === citation);
    if (!citee) {
      throw new Error(`Citation absente de l'article ${id} : ${citation}`);
    }
    return { ...temoignage, citation };
  });

  return (
    <section className="mx-auto max-w-6xl pb-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="titre text-3xl tracking-tight text-balance text-foreground sm:text-4xl">
          {titreTemoignagesVsl.map((morceau, rang) =>
            "accent" in morceau ? (
              <span key={rang} className="text-primary">
                {morceau.texte}
              </span>
            ) : (
              <span key={rang}>{morceau.texte}</span>
            ),
          )}
        </h2>
      </div>

      <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2">
        {cartes.map((carte) => (
          <li key={carte.id} className="h-full">
            <figure
              className="relief-verre flex h-full flex-col gap-4 rounded-[25px] p-3 pb-5 text-foreground"
              style={{
                backgroundColor:
                  "color-mix(in srgb, currentColor 4%, transparent)",
              }}
            >
              {/* L'affiche de l'entretien, recadrée en 32/9 comme dans la
                  galerie d'`/immersion` : c'est le rapport mesuré qui
                  retire les bandes noires et le titre incrusté. Une photo
                  et pas une vidéo, sur décision de Rémy : rien ne se
                  clique, rien ne se lance. */}
              <span className="relative block aspect-32/9 overflow-hidden rounded-[16px] bg-black">
                <Image
                  src={`/temoignages/${carte.id}.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 896px) 430px, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </span>
              {/* Le nom juste sous l'image, sur demande de Rémy, puis
                  l'accroche à la place du métier des cartes du hero. */}
              <div className="flex flex-1 flex-col gap-3 px-2">
                <figcaption>
                  <span className="block font-semibold">{carte.nom}</span>
                  <span className="block text-sm text-pretty text-muted-foreground">
                    {insecables(carte.description)}
                  </span>
                </figcaption>
                <blockquote className="text-[0.9375rem] leading-relaxed font-medium text-pretty">
                  {insecables(`« ${carte.citation} »`)}
                </blockquote>
              </div>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <BoutonOuvrirInscription>{optinVsl.bouton}</BoutonOuvrirInscription>
      </div>
    </section>
  );
}
