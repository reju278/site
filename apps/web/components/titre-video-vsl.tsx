"use client";

import { TitreRoulant } from "@/components/titre-roulant";
import { usePrenomVsl } from "@/lib/prenom-vsl";

/**
 * Les titres du tunnel VSL suivis du prénom de l'opt-in, sur demande de Rémy :
 * « Ta vidéo de formation offerte, comme promis, Prénom » sur `/video-vsl`,
 * « Réserve ton appel, Prénom » sur `/appel`. Sans prénom, la phrase s'arrête
 * avant la virgule et reste juste. Voir `usePrenomVsl`.
 */
export function TitreVideoVsl({ texte }: { texte: string }) {
  const prenom = usePrenomVsl();
  return (
    <h1 className="titre text-2xl text-balance text-foreground sm:text-3xl">
      {texte}
      {prenom ? `, ${prenom}` : null}
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
      segments={[{ texte: prenom ? `${texte}, ${prenom}` : texte }]}
      className={className}
    />
  );
}
