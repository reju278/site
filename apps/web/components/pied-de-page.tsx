import { Reseaux } from "@/components/reseaux";
import { avertissement, identite, legales, liens } from "@/contenu/site";
import { KineticText } from "@repo/ui/components/kinetic-text";
import { Separator } from "@repo/ui/components/separator";
import Link from "next/link";

/**
 * Les quatre destinations mises en avant.
 *
 * Les libellés sont ceux qui existent déjà ailleurs dans le site, menus de
 * l'en-tête et cartes d'offres : un pied de page qui rebaptise les pages oblige
 * le lecteur à deviner qu'il s'agit des mêmes.
 *
 * Chacun dit où il mène. Aucun « en savoir plus » : c'est le texte du lien que
 * les robots lisent pour décrire la page d'arrivée.
 */
const DESTINATIONS = [
  { libelle: "Funnels Club", href: liens.appel, externe: true },
  { libelle: "Consulting privé", href: liens.consulting, externe: true },
  { libelle: "Résultats", href: "/resultats", externe: false },
  { libelle: "Digital Selfmade", href: "/articles", externe: false },
] as const;

export function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-14 sm:pt-20">
        {/* Le bloc de marque, centré. */}
        <div className="text-center">
          {/* Le nom, en deux mots de poids différents.

              Il reprend le traitement du logo de l'en-tête et du mot
              « expertise » du hero : Instrument Serif en italique, avec l'effet
              lettre à lettre. Ici le corps est grand, et c'est le seul endroit
              du site où cet effet se voit vraiment, le contour et l'écartement
              étant proportionnels au corps.

              « Rémy » est appuyé par un contour opaque, `mot-appuye`, et non
              par un `font-bold` : voir la règle dans `globals.css`. Le survol
              de chaque mot reste indépendant.

              `aria-label` sur le lien : le nom est découpé en deux composants
              qui portent chacun leur texte de lecteur d'écran, et sans lui la
              destination s'annoncerait en deux morceaux. */}
          <Link
            href="/"
            aria-label={`${identite.nom}, retour à l'accueil`}
            className="titre inline-flex flex-wrap items-baseline justify-center gap-x-[0.25em] text-5xl text-foreground sm:text-6xl"
          >
            <KineticText
              as="span"
              text="Rémy"
              style={
                { "--hover-padding": "calc(1em / 40)" } as React.CSSProperties
              }
              className="titre-fort mot-appuye inline-flex flex-nowrap font-[600] tracking-tight"
            />
            <KineticText
              as="span"
              text="Jupille"
              style={
                { "--hover-padding": "calc(1em / 40)" } as React.CSSProperties
              }
              className="titre-fort inline-flex flex-nowrap font-[600] tracking-tight"
            />
          </Link>

          {/* La phrase du site, pas une phrase écrite pour l'occasion. */}
          <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground">
            {identite.resume}
          </p>

          <Reseaux className="mt-8 justify-center" />
        </div>

        {/* La rangée des destinations.

            Deux colonnes sur téléphone, quatre à partir de `sm` : quatre
            libellés de cette longueur sur un écran étroit donneraient des
            colonnes de quarante pixels. */}
        <nav className="mt-14">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-4">
            {DESTINATIONS.map((destination) => (
              <li key={destination.href}>
                <Link
                  href={destination.href}
                  target={destination.externe ? "_blank" : undefined}
                  rel={destination.externe ? "noreferrer" : undefined}
                  className="text-sm text-pretty text-muted-foreground transition-colors hover:text-foreground"
                >
                  {destination.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Le bas de page légal.

            L'avertissement reste ferré à gauche : le fer à droite est réservé
            aux colonnes de nombres, où il aligne les unités. Sur de la prose,
            il produit un bord gauche en dents de scie que l'œil doit rattraper
            à chaque ligne. Et pas de `whitespace-nowrap` sur le copyright : sur
            un écran étroit, il ferait déborder la page. */}
        <div className="mt-14">
          <Separator className="mb-8" />

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legales.map((entree) => (
              <Link
                key={entree.href}
                href={entree.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {entree.libelle}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3 text-xs text-muted-foreground">
            <p>
              © {annee} {identite.societe}
            </p>
            {/* Repris du pied de page de remy-jupille.com, au mot près. */}
            <p>{avertissement}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
