/**
 * Le gabarit des pages légales.
 *
 * Ces pages n'ont pas besoin de rythme visuel, elles ont besoin d'être lues.
 * Une colonne étroite, une hiérarchie de titres, rien d'autre. Le plugin
 * `@tailwindcss/typography` n'est pas installé et ne le sera pas pour trois
 * pages : les styles tiennent dans le sélecteur ci-dessous.
 */
export function PageLegale({
  titre,
  miseAJour,
  children,
}: {
  titre: string;
  miseAJour: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
        {titre}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Dernière mise à jour : {miseAJour}
      </p>

      <div
        className="mt-12 text-base leading-relaxed text-muted-foreground [&>h2]:mt-12 [&>h2]:mb-3 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-foreground [&>h3]:mt-8 [&>h3]:mb-2 [&>h3]:text-base [&>h3]:font-medium [&>h3]:text-foreground [&>p]:mt-4 [&>ul]:mt-4 [&>ul]:list-disc [&>ul]:space-y-1.5 [&>ul]:pl-5"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Le contenu qui attend son texte réel.
 *
 * Un encart visible plutôt qu'un faux paragraphe juridique : une page légale
 * approximative engage la société qui la publie.
 */
export function ATrancher({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-md border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">À rédiger : </span>
      {children}
    </p>
  );
}
