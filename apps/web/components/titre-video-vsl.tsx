"use client";

import { TitreRoulant } from "@/components/titre-roulant";
import { strategieVsl, videoVsl } from "@/contenu/vsl";
import { usePrenomVsl, useReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/* Le surligneur jaune de la lettre, **sans rembourrage sur les côtés**, sur
   demande de Rémy : seul le texte est surligné, pas un espace autour. */
export const jaune = {
  "--surlignage-fond":
    "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)",
  paddingInline: 0,
} as React.CSSProperties;

/** Le montant mensuel retenu pour la tranche d'objectif choisie, s'il y en a. */
function useObjectifVsl(): number | undefined {
  const reponses = useReponsesVsl();
  return reponses?.objectif
    ? strategieVsl.montants[reponses.objectif]
    : undefined;
}

/**
 * Les titres du tunnel VSL suivis du prénom de l'opt-in, sur demande de Rémy :
 * « Voici ta vidéo de formation offerte Prénom ! » sur `/video-vsl`,
 * « Réserve ton appel Prénom ! » sur `/appel`, sans virgule devant le prénom.
 * Sans prénom, la phrase reste juste sans lui. Voir `usePrenomVsl`.
 */
export function TitreVideoVsl({ texte }: { texte: string }) {
  const prenom = usePrenomVsl();
  const objectif = useObjectifVsl();

  /* Avec un objectif connu, le titre le promet, sur demande de Rémy, et le
     montant passe au surligneur jaune de la page d'inscription. */
  if (objectif) {
    const [avant, apres] = videoVsl.titreObjectif.split("{objectif}");
    return (
      <h1 className="titre text-2xl text-balance text-foreground sm:text-3xl">
        {insecables(avant ?? "")}
        <mark className="surlignage" style={jaune}>
          {insecables(euros.format(objectif))}
        </mark>
        {insecables(apres ?? "")}
        {prenom ? ` ${prenom}` : null}
        {"\u00a0!"}
      </h1>
    );
  }

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
  const reponses = useReponsesVsl();
  const objectif = useObjectifVsl();

  /* **Avec les réponses, le bloc parle de la personne**, sur demande de
     Rémy, qui trouvait le paragraphe générique et peu joli : ce qu'on
     regardera ensemble, avec son objectif surligné. */
  if (reponses?.prix && objectif) {
    const valeurs: Record<string, string> = {
      prix: reponses.prix,
      objectif: euros.format(objectif),
    };
    return (
      <div className="mt-4 max-w-2xl">
        <p className="text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
          {prenom ? `${prenom}, ` : null}
          {insecables(
            prenom
              ? videoVsl.appelPersonnalise.charAt(0).toLowerCase() +
                  videoVsl.appelPersonnalise.slice(1)
              : videoVsl.appelPersonnalise,
          )
            .split(/(\{\w+\})/)
            .map((morceau, i) => {
              const cle = /^\{(\w+)\}$/.exec(morceau)?.[1];
              return cle && valeurs[cle] ? (
                <mark key={i} className="surlignage" style={jaune}>
                  {insecables(valeurs[cle])}
                </mark>
              ) : (
                morceau
              );
            })}
        </p>
      </div>
    );
  }

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
