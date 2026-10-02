import { TexteRoulant } from "@/components/texte-roulant";
import { avertissements, identite, legales } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

/**
 * Les avertissements, les mentions légales et le copyright, sous la carte du
 * pied de page.
 *
 * **Écrits une fois, montrés à deux endroits** : le pied de page du site, et
 * le bas d'`/appel`, sur demande de Rémy, qui n'a pas le pied de page du site.
 * Ce sont des textes légaux : deux copies auraient divergé à la première
 * correction, et c'est la version oubliée qui aurait engagé la société.
 *
 * Les avertissements sont au mot près : voir `site.ts`.
 *
 * **Les mentions sont juste au-dessus du copyright et au même fer**, sur
 * décision de Rémy. Elles étaient dans la carte, à droite de la rangée des
 * réseaux ; ce sont des textes de même nature que l'avertissement, et les
 * séparer revenait à dire que l'un se lit et l'autre se clique. Même corps,
 * même couleur, même bord gauche.
 */
export function MentionsLegales({
  nouvelOnglet = false,
  className,
}: {
  /**
   * Ouvre les pages légales dans un nouvel onglet. **Sur `/appel`** : on y
   * lit une mention sans quitter le formulaire, et un tunnel ne se quitte que
   * par la réservation.
   */
  nouvelOnglet?: boolean;
  className?: string;
}) {
  const annee = new Date().getFullYear();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {avertissements.map((texte) => (
        <p key={texte} className="max-w-5xl text-pretty">
          {texte}
        </p>
      ))}

      <nav aria-label="Mentions légales" className="pt-2">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {legales.map((entree) => (
            <li key={entree.href}>
              <Link
                href={entree.href}
                target={nouvelOnglet ? "_blank" : undefined}
                rel={nouvelOnglet ? "noreferrer" : undefined}
                className="group/roule inline-block rounded-md transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <TexteRoulant>{entree.libelle}</TexteRoulant>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p>
        © {annee} {identite.societe}
      </p>
    </div>
  );
}
