import { BanniereGenesis } from "@/components/banniere-genesis";
import { InscriptionGenesis } from "@/components/inscription-genesis";
import { FlecheGenesis } from "@/components/fleche-genesis";
import { MaquetteLecteurGenesis } from "@/components/maquette-lecteur-genesis";
import { Emplacement } from "@/components/section";
import { optinGenesis, partiesGenesis } from "@/contenu/formation-genesis";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import { Fragment } from "react";

/**
 * L'optin de la Formation Genesis, `go.funnels.club/formation-genesis`
 * (issue #8).
 *
 * **Le dessin est celui de l'optin ClickFunnels de Rémy**,
 * `funnels.club/course-2027-fb-2`, sur sa demande : la barre et la bannière,
 * le titre en PT Serif gras, le sous-titre surligné en bleu pâle, puis deux
 * colonnes. **Elles ne sont plus celles de la référence**, sur demande de
 * Rémy : le mockup de la vidéo à gauche, et à droite directement le
 * formulaire en trois étapes (`InscriptionGenesis`), sans fenêtre.
 *
 * Tout ce qui attend un texte ou une image de Rémy est un `<Emplacement>`.
 */
export const metadata: Metadata = {
  title: { absolute: `${optinGenesis.titrePage} · Funnels Club` },
  ...(optinGenesis.description
    ? { description: optinGenesis.description }
    : {}),
  alternates: { canonical: "https://go.funnels.club/formation-genesis" },
};

export default function FormationGenesis() {
  const { etiquette, titre } = optinGenesis;
  /* Les deux derniers mots sont liés par une espace insécable : sans elle,
     le dernier mot finit seul sur sa ligne à 375 px, et `text-pretty` ne
     l'empêche pas. En lier quatre laissait « développer un » seul sur une
     ligne courte. Ils sont dans le dernier segment, qui est du texte. */
  const segments = optinGenesis.sousTitre(
    partiesGenesis.filter((p) => !p.bonus).length,
  );
  const sousTitre = segments.map((segment, i) => {
    if (typeof segment !== "string")
      return "gras" in segment ? (
        <strong key={i}>{segment.gras}</strong>
      ) : (
        <span
          key={i}
          className="underline decoration-[0.08em] underline-offset-[0.18em]"
        >
          {segment.souligne}
        </span>
      );
    const texte =
      i === segments.length - 1
        ? segment.replace(/ (\S+)$/, " $1")
        : segment;
    return <Fragment key={i}>{insecables(texte)}</Fragment>;
  });

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      <BanniereGenesis />

      <header className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        {/* L'étiquette au-dessus du titre, demandée par Rémy : capitales en
            Roboto, la police des boutons, sur le jaune de Notion qu'il a
            donné (`--genesis-jaune`).
            Un `p` et non un titre : elle ne décrit pas une section. L'espace
            entre les lettres est resserré sur téléphone, mesuré : à 0,08 em
            elle demande 336 px et passe sur deux lignes à 375 px de large. */}
        <p className="mb-3 inline-block rounded-[5px] bg-[var(--genesis-jaune)] px-2.5 py-1 font-[family-name:var(--font-genesis-bouton)] text-xs font-bold tracking-[0.04em] uppercase sm:text-sm sm:tracking-[0.08em]">
          {etiquette}
        </p>
        {/* Le seul `h1` de la page : le titre de Rémy, ou le nom de la
            formation tant qu'il n'est pas écrit.
            **Deux lignes à partir de `sm`**, sur demande de Rémy : le titre
            mesure 45,9 fois son corps sur une ligne, la colonne fait au plus
            896 px, donc deux lignes équilibrées tiennent jusqu'à 4 % de la
            largeur d'écran moins 3 px, plafonné à 36 px. Sur téléphone, il
            n'y a pas de corps lisible qui tienne en deux lignes. */}
        <h1 className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance sm:text-[clamp(1.75rem,calc(4vw-3px),2.25rem)]">
          {insecables(titre ?? optinGenesis.titrePage)}
        </h1>
        {titre ? null : (
          <Emplacement
            attendu="le titre de la page, la promesse de la formation"
            className="mt-3 min-h-0 py-4"
          />
        )}
        <p className="mt-2 text-lg leading-[1.6] tracking-[0.02em] text-pretty sm:text-2xl">
          <span className="bg-[var(--genesis-surligne)] box-decoration-clone">
            {sousTitre}
          </span>
        </p>
      </header>

      {/* Le mockup de la vidéo à gauche, le formulaire à droite, sans
          fenêtre, sur demande de Rémy. Empilés sur téléphone, le visuel en
          premier comme sur la référence. Centrés l'un sur l'autre en
          large : le formulaire change de hauteur d'une étape à l'autre. */}
      <section
        aria-label="Inscription"
        className="mx-auto grid max-w-[1065px] grid-cols-1 items-center gap-14 px-5 pt-6 sm:px-8 md:grid-cols-[1.15fr_1fr] md:gap-8 md:pt-8"
      >
        <MaquetteLecteurGenesis />
        {/* Le formulaire porte la flèche qui le désigne depuis le
            sous-titre : elle se mesure depuis son haut, à toutes les
            largeurs. */}
        <div className="relative">
          <FlecheGenesis />
          <InscriptionGenesis />
        </div>
      </section>
    </main>
  );
}
