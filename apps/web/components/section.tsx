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
    <section className={cn(className)} {...props}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">{children}</div>
    </section>
  );
}

/**
 * Le titre d'une section.
 *
 * Le serif ne sert qu'ici et au logo. Partout ailleurs, y compris pour les
 * sous-titres à l'intérieur des blocs, c'est la sans qui parle : c'est le
 * contraste entre les deux qui donne le ton, et un serif employé partout ne
 * contraste plus avec rien.
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
        <p className="text-sm font-semibold text-muted-foreground">
          {etiquette}
        </p>
      ) : null}
      <h2 className="titre mt-3 text-4xl text-foreground sm:text-5xl">
        {titre}
      </h2>
      {texte ? (
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
          {texte}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Un emplacement qui attend le texte de Rémy.
 *
 * Le site ne s'écrit pas tout seul et n'invente rien : tant qu'une section n'a
 * pas ses mots, elle affiche ce qu'elle attend, visiblement, au lieu d'une
 * phrase plausible que personne ne penserait à relire.
 */
export function Emplacement({
  attendu,
  className,
}: {
  attendu: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 items-center justify-center rounded-md border border-dashed border-border px-6 py-10 text-center",
        className
      )}
    >
      <p className="max-w-md text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Emplacement : </span>
        {attendu}
      </p>
    </div>
  );
}
