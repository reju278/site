import { TexteLie } from "@/components/texte-lie";
import type { Avis } from "@/contenu/avis";

/**
 * Le corps d'un article d'avis : ses sections, leurs citations, l'appel du
 * milieu.
 *
 * **Il existe parce qu'il est rendu à deux endroits** : la page
 * `/resultats/<nom>` et la fenêtre des entretiens de `/immersion`. Rémy a
 * demandé que la fenêtre montre « exactement la même chose » que la page. Une
 * seconde écriture aurait divergé à la première correction, et c'est un texte
 * qui porte les mots et les chiffres de vraies personnes : deux versions du
 * même entretien, c'est une version fausse tôt ou tard.
 *
 * **Le texte passe par `texte`, jamais rendu en dur.** La page le laisse tel
 * quel ; le tunnel y réécrit les liens pour qu'on n'en sorte pas et y coupe les
 * noms de famille. Le composant ne sait pas dans lequel des deux il se trouve,
 * et c'est ce qui lui permet de servir les deux.
 *
 * **La transcription est facultative**, et son absence est un choix et non un
 * oubli : sur une page interdite d'index, mille mots de parole non relue
 * n'apportent aucun référencement et alourdissent d'autant. C'est déjà la règle
 * du hub, écrite dans `AGENTS.md`.
 *
 * **L'appel du milieu est passé en propriété.** Sa place, elle, est calculée
 * ici : un article de cinq sections et un de huit ne coupent pas au même
 * endroit, et un numéro écrit à la main dans `avis.ts` serait faux au premier
 * remaniement. Le contenu de l'appel, en revanche, n'est pas le même sur le
 * site et dans un tunnel, d'où la propriété.
 */
export function ArticleAvis({
  article,
  texte = (t) => t,
  appel = null,
  transcription = null,
}: {
  article: Pick<Avis, "sections"> & { transcription?: Avis["transcription"] };
  /**
   * Transforme chaque texte avant de le rendre : titre de section, paragraphe,
   * citation. Identité sur le site, qui ne retire rien.
   *
   * **Elle s'applique à tout et pas seulement aux paragraphes**, et c'est une
   * correction : la première version ne réécrivait que les liens, donc les
   * noms de famille restaient dans les titres de section et dans les citations.
   * Un caviardage qui oublie un endroit sur trois ne caviarde rien.
   */
  texte?: (t: string) => string;
  /** L'encart posé au milieu de l'article. `null` pour n'en poser aucun. */
  appel?: React.ReactNode;
  /** Le pli de la transcription, rendu par l'appelant. `null` pour l'omettre. */
  transcription?: React.ReactNode;
}) {
  const milieu = Math.floor(article.sections.length / 2) - 1;

  return (
    <>
      {article.sections.map((section, i) => (
        <section key={section.titre} className="mt-12 first:mt-0">
          <h2 className="titre text-2xl text-balance text-foreground sm:text-3xl">
            {texte(section.titre)}
          </h2>

          <div className="mt-5 space-y-5 text-base leading-relaxed text-pretty text-foreground/85 sm:text-lg">
            {section.paragraphes.map((paragraphe) => (
              <p key={paragraphe}>
                <TexteLie>{texte(paragraphe)}</TexteLie>
              </p>
            ))}
          </div>

          {/* La citation.

              `blockquote` et non un paragraphe en italique : c'est l'élément
              d'une citation, et c'est lui qui dit à un lecteur d'écran que ces
              mots sont ceux de quelqu'un d'autre.

              **Les guillemets sont posés ici et non dans la donnée**, sur
              demande de Rémy : à les écrire dans le contenu, on finit avec des
              citations qui en ont et d'autres qui n'en ont pas. Ce sont les
              guillemets français, avec leurs espaces insécables : une espace
              ordinaire y autorise un retour à la ligne, et le guillemet se
              retrouve seul en fin de ligne.

              Le filet est en `foreground` et non en `primary`, sur décision de
              Rémy : le bleu du site sert aux actions, et une citation n'en est
              pas une. */}
          {section.citation ? (
            <figure className="mt-6 border-l-2 border-foreground pl-5">
              <blockquote className="text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
                {`« ${texte(section.citation.texte)} »`}
              </blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                <cite className="not-italic">
                  {texte(section.citation.qui)}
                </cite>
              </figcaption>
            </figure>
          ) : null}

          {appel && i === milieu ? appel : null}
        </section>
      ))}

      {transcription}
    </>
  );
}
