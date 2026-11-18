import { BanniereGenesis } from "@/components/banniere-genesis";
import { InscriptionGenesis } from "@/components/inscription-genesis";
import { Emplacement } from "@/components/section";
import { optinGenesis } from "@/contenu/formation-genesis";
import type { Metadata } from "next";

/**
 * L'optin de la Formation Genesis, `go.funnels.club/formation-genesis`
 * (issue #8).
 *
 * **Le dessin est celui de l'optin ClickFunnels de Rémy**,
 * `funnels.club/course-2027-fb-2`, sur sa demande : la barre et la bannière,
 * le titre en PT Serif gras, le sous-titre surligné en bleu pâle, puis deux
 * colonnes, le visuel à gauche et à droite l'accroche, la liste à puces et le
 * bouton bleu qui ouvre la fenêtre d'inscription.
 *
 * Tout ce qui attend un texte de Rémy est un `<Emplacement>`.
 */
export const metadata: Metadata = {
  title: { absolute: `${optinGenesis.titrePage} · Funnels Club` },
  ...(optinGenesis.description
    ? { description: optinGenesis.description }
    : {}),
  alternates: { canonical: "https://go.funnels.club/formation-genesis" },
};

export default function FormationGenesis() {
  const { etiquette, titre, sousTitre, accroche, points } = optinGenesis;

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      <BanniereGenesis />

      <header className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        {/* L'étiquette au-dessus du titre, demandée par Rémy : capitales en
            Roboto, la police des boutons, sur le bleu pâle du sous-titre.
            Un `p` et non un titre : elle ne décrit pas une section. L'espace
            entre les lettres est resserré sur téléphone, mesuré : à 0,08 em
            elle demande 336 px et passe sur deux lignes à 375 px de large. */}
        <p className="mb-3 inline-block rounded-[5px] bg-[var(--genesis-surligne)] px-2.5 py-1 font-[family-name:var(--font-genesis-bouton)] text-xs font-bold tracking-[0.04em] uppercase sm:text-sm sm:tracking-[0.08em]">
          {etiquette}
        </p>
        {/* Le seul `h1` de la page : le titre de Rémy, ou le nom de la
            formation tant qu'il n'est pas écrit. */}
        <h1 className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance">
          {titre ?? optinGenesis.titrePage}
        </h1>
        {titre ? null : (
          <Emplacement
            attendu="le titre de la page, la promesse de la formation"
            className="mt-3 min-h-0 py-4"
          />
        )}
        {sousTitre ? (
          <p className="mt-2 text-lg leading-[1.6] tracking-[0.02em] text-pretty sm:text-2xl">
            <span className="bg-[var(--genesis-surligne)] box-decoration-clone">
              {sousTitre}
            </span>
          </p>
        ) : (
          <Emplacement
            attendu="le sous-titre, surligné en bleu pâle sous le titre"
            className="mt-3 min-h-0 py-4"
          />
        )}
      </header>

      {/* Le visuel à gauche, l'accroche, la liste et le bouton à droite.
          Empilés sur téléphone, le visuel en premier comme sur la
          référence. */}
      <section
        aria-label="Inscription"
        className="mx-auto grid max-w-[1065px] grid-cols-1 gap-6 px-5 pt-6 sm:px-8 md:grid-cols-2 md:gap-8 md:pt-8"
      >
        <Emplacement
          attendu="un visuel de la formation, une photo de Rémy ou un aperçu de la vidéo"
          className="aspect-video min-h-0"
        />
        <div className="flex flex-col gap-4 text-[17px] leading-[1.5] sm:text-xl">
          {accroche ? (
            <p className="text-pretty">{accroche}</p>
          ) : (
            <Emplacement
              attendu="l'accroche : ce que la formation permet de construire"
              className="min-h-0 py-4"
            />
          )}
          {points.length ? (
            <ul className="flex list-disc flex-col gap-1 pl-7 marker:text-[var(--genesis-encre)]">
              {points.map((point) => (
                <li key={point.suite} className="text-pretty">
                  {point.surligne ? (
                    <>
                      <span className="bg-[var(--genesis-rose)] box-decoration-clone">
                        {point.surligne}
                      </span>{" "}
                    </>
                  ) : null}
                  {point.suite}
                </li>
              ))}
            </ul>
          ) : (
            <Emplacement
              attendu="la liste à puces, quatre lignes environ, avec les mots à surligner en rose"
              className="min-h-28 py-4"
            />
          )}
          <InscriptionGenesis />
        </div>
      </section>
    </main>
  );
}
