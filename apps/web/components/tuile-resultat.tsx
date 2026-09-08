import { pastille, type Teinte } from "@/lib/teintes";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/lib/utils";

/**
 * Une tuile de la mosaïque de preuve.
 *
 * Deux formes seulement, dans l'esprit de la page « customer stories » de
 * Jasper : un chiffre posé très gros sur un aplat coloré, ou une parole sur un
 * fond de carte. Les alterner suffit à donner du rythme ; une troisième forme
 * rendrait la grille bavarde.
 */

type Base = {
  personne: string;
  metier: string;
  className?: string;
};

/**
 * Seul le chiffre porte une teinte : c'est lui qu'on veut voir de loin. Une
 * citation colorée se lirait comme un chiffre et la grille perdrait sa
 * respiration.
 */
export type Resultat =
  | (Base & {
      type: "chiffre";
      valeur: string;
      libelle: string;
      teinte: Teinte;
    })
  | (Base & { type: "citation"; texte: string });

function Signature({ personne, metier }: { personne: string; metier: string }) {
  const initiales = personne
    .split(" ")
    .map((mot) => mot[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-7">
        <AvatarFallback className="text-[10px] font-medium">
          {initiales}
        </AvatarFallback>
      </Avatar>
      <p className="text-sm">
        {/* Point médian et non tiret cadratin : la règle du projet. */}
        <span className="font-medium">{personne}</span>
        <span className="opacity-70"> · {metier}</span>
      </p>
    </div>
  );
}

export function TuileResultat(resultat: Resultat) {
  if (resultat.type === "chiffre") {
    return (
      <figure
        style={pastille(resultat.teinte)}
        className={cn(
          "flex flex-col justify-between gap-8 rounded-lg p-6",
          resultat.className
        )}
      >
        <div>
          <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {resultat.valeur}
          </p>
          <p className="mt-2 text-sm opacity-80">{resultat.libelle}</p>
        </div>
        <figcaption>
          <Signature personne={resultat.personne} metier={resultat.metier} />
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        "flex flex-col justify-between gap-8 rounded-lg border border-border bg-card p-6 text-card-foreground",
        resultat.className
      )}
    >
      <blockquote className="text-base leading-relaxed text-pretty">
        « {resultat.texte} »
      </blockquote>
      <figcaption>
        <Signature personne={resultat.personne} metier={resultat.metier} />
      </figcaption>
    </figure>
  );
}
