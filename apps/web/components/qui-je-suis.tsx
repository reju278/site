import { quiJeSuis, type MorceauTexte } from "@/contenu/vsl";
import { insecables } from "@/lib/typographie";

/**
 * « Qui suis-je », sous la note des avis de `/course` : le portrait de Rémy à
 * côté du titre et de sa présentation, puis son texte, les faits clés en
 * gras.
 *
 * La mesure est celle d'un texte, `max-w-3xl` : une ligne de texte courant se
 * lit entre soixante et quatre-vingts caractères. Le portrait est rond, comme
 * toutes les photos de profil du site.
 */
function rendre(morceau: MorceauTexte, i: number) {
  return typeof morceau === "string" ? (
    insecables(morceau)
  ) : (
    <strong key={i} className="font-semibold text-foreground">
      {insecables(morceau.gras)}
    </strong>
  );
}

export function QuiJeSuis() {
  return (
    <section
      aria-labelledby="qui-je-suis"
      /* L'écart avec la note des avis, plus grand sur téléphone, sur demande
         de Rémy : les deux blocs s'y touchaient presque. */
      className="mx-auto mt-6 w-full max-w-3xl rounded-[var(--radius-lg)] border bg-card p-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] sm:mt-0 sm:p-8"
    >
      {/* L'en-tête : la photo à côté du titre et de la présentation, sur
          demande de Rémy, puis le texte en dessous, sur toute la largeur. */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={quiJeSuis.portrait}
          alt="Rémy Jupille, fondateur de Funnels Club"
          width={112}
          height={112}
          loading="lazy"
          className="size-20 shrink-0 rounded-full object-cover ring-4 ring-primary/15 sm:size-28"
        />
        <div>
          <h2
            id="qui-je-suis"
            className="titre text-3xl text-foreground sm:text-4xl"
          >
            {quiJeSuis.titre}
          </h2>
          <p className="mt-1 text-base font-semibold text-primary sm:text-lg">
            {quiJeSuis.presentation}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:mt-6">
        {quiJeSuis.paragraphes.map((paragraphe, i) => (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-pretty text-foreground/85 sm:text-base"
          >
            {paragraphe.map(rendre)}
          </p>
        ))}
      </div>
    </section>
  );
}
