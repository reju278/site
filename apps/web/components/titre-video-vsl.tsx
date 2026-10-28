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
