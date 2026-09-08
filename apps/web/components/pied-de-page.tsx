import { avertissement, identite, legales, liens, navigation } from "@/contenu/site";
import { Separator } from "@repo/ui/components/separator";
import Link from "next/link";

export function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <p className="titre text-xl text-foreground">{identite.nom}</p>

          <div className="flex flex-wrap gap-12">
            <nav className="flex flex-col gap-2.5">
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
              <a
                href={liens.appel}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Accompagnement Funnels Club
              </a>
              <a
                href={liens.consulting}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Consulting privé
              </a>
            </nav>

            <nav className="flex flex-col gap-2.5">
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

        {/* L'avertissement reste ferré à gauche : le fer à droite est réservé
            aux colonnes de nombres, où il aligne les unités. Sur de la prose,
            il produit un bord gauche en dents de scie que l'œil doit
            rattraper à chaque ligne. Et pas de `whitespace-nowrap` sur le
            copyright : sur un écran étroit, il ferait déborder la page. */}
        <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <p>
            © {annee} {identite.societe}
          </p>
          {/* Repris du pied de page de remy-jupille.com, au mot près. */}
          <p className="max-w-2xl">{avertissement}</p>
        </div>
      </div>
    </footer>
  );
}
