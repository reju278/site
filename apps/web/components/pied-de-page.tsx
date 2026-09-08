import { identite, legales, liens, navigation } from "@/contenu/site";
import { Separator } from "@repo/ui/components/separator";
import Link from "next/link";

export function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="text-sm font-semibold tracking-tight text-foreground uppercase">
              {identite.nom}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {identite.resume}
            </p>
          </div>

          <div className="flex gap-12">
            <nav className="flex flex-col gap-2.5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Le site
              </p>
              {navigation.map((entree) => (
                <Link
                  key={entree.href}
                  href={entree.href}
                  target={entree.externe ? "_blank" : undefined}
                  rel={entree.externe ? "noreferrer" : undefined}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {entree.libelle}
                </Link>
              ))}
            </nav>

            <nav className="flex flex-col gap-2.5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Les programmes
              </p>
              <a
                href={liens.funnelsClub}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Funnels Club
              </a>
              <a
                href={liens.mastermind}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                F.C. Mastermind
              </a>
            </nav>

            <nav className="flex flex-col gap-2.5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Légal
              </p>
              {legales.map((entree) => (
                <Link
                  key={entree.href}
                  href={entree.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {entree.libelle}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {annee} {identite.societe}
          </p>
          <p className="max-w-2xl sm:text-right">
            Ce site n'est ni affilié à Meta Platforms, Inc. ni approuvé par
            Meta. Les résultats présentés sont ceux des personnes citées et ne
            constituent pas une promesse de résultat.
          </p>
        </div>
      </div>
    </footer>
  );
}
