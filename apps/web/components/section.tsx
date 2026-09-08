import { cn } from "@repo/ui/lib/utils";

/**
 * Le rythme vertical du site, en un seul endroit.
 *
 * Toutes les sections partagent la même largeur et le même souffle. Le jour où
 * la page respire mal, on corrige ici et pas dans quinze fichiers.
 */
export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("border-b border-border", className)} {...props}>
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">{children}</div>
    </section>
  );
}

/**
 * Le chapeau d'une section : une étiquette discrète, un titre court et
 * affirmatif, une phrase d'appui.
 */
export function TitreSection({
  etiquette,
  titre,
  texte,
  className,
}: {
  etiquette?: string;
  titre: React.ReactNode;
  texte?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {etiquette ? (
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {etiquette}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
        {titre}
      </h2>
      {texte ? (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
          {texte}
        </p>
      ) : null}
    </div>
  );
}
