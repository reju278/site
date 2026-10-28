"use client";

import { TitreRoulant } from "@/components/titre-roulant";
import { usePrenomVsl } from "@/lib/prenom-vsl";

/**
 * Les titres du tunnel VSL suivis du prénom de l'opt-in, sur demande de Rémy :
 * « Voici ta vidéo de formation offerte Prénom ! » sur `/video-vsl`,
 * « Réserve ton appel Prénom ! » sur `/appel`, sans virgule devant le prénom.
 * Sans prénom, la phrase reste juste sans lui. Voir `usePrenomVsl`.
 */
export function TitreVideoVsl({ texte }: { texte: string }) {
  const prenom = usePrenomVsl();
  return (
    <h1 className="titre text-2xl text-balance text-foreground sm:text-3xl">
      {texte}
      {prenom ? ` ${prenom}` : null}
      {"\u00a0!"}
    </h1>
  );
}

/** Le titre animé de `/appel`, même règle. */
export function TitreAppelVsl({
  texte,
  className,
}: {
  texte: string;
  className?: string;
}) {
  const prenom = usePrenomVsl();
  return (
    <TitreRoulant
      as="h1"
      segments={[{ texte: `${prenom ? `${texte} ${prenom}` : texte}\u00a0!` }]}
      className={className}
    />
  );
}

/**
 * Le paragraphe sous la vidéo de `/video-vsl`, ouvert par le prénom, sur
 * demande de Rémy : « Prénom, postule maintenant… ». Sans prénom, la phrase
 * commence comme elle est écrite.
 */
export function AppelVideoVsl({
  morceaux,
}: {
  morceaux: readonly { texte: string; gras?: boolean }[];
}) {
  const prenom = usePrenomVsl();
  return (
    <p className="mt-4 max-w-3xl text-xl leading-relaxed text-pretty text-foreground sm:text-2xl">
      {morceaux.map((morceau, rang) => {
        const texte =
          rang === 0 && prenom
            ? `${prenom}, ${morceau.texte.charAt(0).toLowerCase()}${morceau.texte.slice(1)}`
            : morceau.texte;
        return morceau.gras ? (
          <strong key={rang}>{texte}</strong>
        ) : (
          <span key={rang}>{texte}</span>
        );
      })}
    </p>
  );
}
