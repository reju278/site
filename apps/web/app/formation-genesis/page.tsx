import { InscriptionGenesis } from "@/components/inscription-genesis";
import { Emplacement } from "@/components/section";
import { optinGenesis } from "@/contenu/formation-genesis";
import { Badge } from "@repo/ui/components/badge";
import type { Metadata } from "next";

/**
 * L'optin de la Formation Genesis, `go.funnels.club/formation-genesis`
 * (issue #8).
 *
 * **La structure vient d'une page d'optin de cours vidéo** relevée par Rémy :
 * un sur-titre, le titre et sa promesse, le formulaire dans une carte avec sa
 * ligne de réassurance, puis trois blocs de ce qu'on y apprend. Ni texte ni
 * marque n'en sont repris. Le formulaire, lui, est réduit au prénom et à
 * l'e-mail : la référence en demande cinq, et chaque champ de plus est une
 * inscription de moins.
 *
 * **Le dessin est celui de `/course`** : pilule de sur-titre, police des
 * titres du tunnel, carte à grande ombre, bouton scintillant.
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
  const { surtitre, titre, sousTitre, points, reassurance } = optinGenesis;

  return (
    <main className="px-5 pt-8 sm:pt-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:gap-12">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:gap-5">
          {surtitre ? (
            <Badge
              asChild
              variant="outline"
              className="max-w-full bg-background px-4 py-1.5 text-sm font-medium whitespace-normal shadow-sm sm:text-base"
            >
              <p>{surtitre}</p>
            </Badge>
          ) : (
            <Emplacement
              attendu="le sur-titre, une ligne au-dessus du titre"
              className="min-h-0 w-full py-3"
            />
          )}
          {/* Le seul `h1` de la page : le titre de Rémy, ou le nom de la
              formation tant qu'il n'est pas écrit. */}
          <h1 className="titre text-[clamp(1.75rem,7.5vw,2.25rem)] leading-tight text-balance text-foreground sm:text-5xl">
            {titre ?? optinGenesis.titrePage}
          </h1>
          {titre ? null : (
            <Emplacement
              attendu="le titre de la page, la promesse de la formation"
              className="min-h-0 w-full py-4"
            />
          )}
          {sousTitre ? (
            <p className="text-lg text-pretty text-foreground/85 sm:text-xl">
              {sousTitre}
            </p>
          ) : (
            <Emplacement
              attendu="le sous-titre, ce que la formation apporte et à qui"
              className="min-h-0 w-full py-4"
            />
          )}
        </header>

        {/* Le formulaire et l'aperçu côte à côte en large, empilés sur
            téléphone, le formulaire en premier : c'est lui qu'on doit voir
            au chargement. */}
        <section
          aria-label="Inscription"
          className="grid items-center gap-5 rounded-[var(--radius-lg)] border bg-card p-4 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] sm:p-6 md:grid-cols-2 md:gap-8"
        >
          <div className="flex flex-col gap-3 md:order-2">
            <InscriptionGenesis />
            {reassurance ? (
              <p className="text-center text-sm text-muted-foreground">
                {reassurance}
              </p>
            ) : (
              <Emplacement
                attendu="la ligne de réassurance sous le bouton"
                className="min-h-0 py-3"
              />
            )}
          </div>
          <Emplacement
            attendu="un visuel de la formation : aperçu de la vidéo, couverture ou programme"
            className="aspect-video min-h-0 md:order-1"
          />
        </section>

        <section aria-label="Ce que tu vas apprendre">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {points.map((point, rang) => (
              <li key={rang} className="h-full">
                {point ? (
                  <p className="h-full rounded-md border bg-card p-5 text-pretty text-foreground/85">
                    {point}
                  </p>
                ) : (
                  <Emplacement
                    attendu={`le bloc ${rang + 1} de ce que la formation apprend`}
                    className="h-full min-h-32"
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
