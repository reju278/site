import { Emplacement } from "@/components/section";
import type { DocumentLegal } from "@/contenu/legal";

/**
 * Le gabarit des pages légales.
 *
 * `document` porte le texte publié ; sans lui, la page affiche ce qu'elle
 * attend plutôt qu'une prose vraisemblable que personne ne relirait. Les deux
 * cas coexistent parce qu'une page légale se remplit le jour où le texte
 * existe, pas le jour où la page est construite.
 *
 * Les titres du document deviennent des `h2` : le `h1` est le titre de la page,
 * et un document juridique n'a qu'un seul niveau de section.
 */
export function PageLegale({
  titre,
  document,
  attendu,
}: {
  titre: string;
  document?: DocumentLegal;
  attendu?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 sm:pt-40">
      <h1 className="titre text-4xl text-foreground sm:text-5xl">{titre}</h1>

      {document ? (
        <div className="mt-10 space-y-5 text-pretty text-muted-foreground">
          {document.map((bloc, i) =>
            bloc.type === "titre" ? (
              <h2
                key={i}
                className="titre pt-6 text-xl text-foreground sm:text-2xl"
              >
                {bloc.texte}
              </h2>
            ) : bloc.type === "liste" ? (
              <ul key={i} className="list-disc space-y-2 pl-5">
                {bloc.elements.map((element, j) => (
                  <li key={j}>{element}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className="leading-relaxed">
                {bloc.texte}
              </p>
            ),
          )}
        </div>
      ) : (
        <Emplacement attendu={attendu ?? ""} className="mt-10" />
      )}
    </div>
  );
}
