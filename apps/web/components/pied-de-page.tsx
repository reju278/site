import { Reseaux } from "@/components/reseaux";
import {
  avertissement,
  colonnesPiedDePage,
  identite,
  legales,
} from "@/contenu/site";
import { KineticText } from "@repo/ui/components/kinetic-text";
import { Separator } from "@repo/ui/components/separator";
import Link from "next/link";

/**
 * Le pied de page.
 *
 * Il portait quatre liens en rang, alors que le site a trois programmes, deux
 * podcasts, une lettre, un livre et une page de résultats. Quatre destinations
 * sur onze, choisies sans règle, obligeaient à remonter au menu pour savoir ce
 * que le site contient. Les colonnes reprennent donc les menus de l'en-tête
 * entrée pour entrée, voir `colonnesPiedDePage`.
 *
 * **La page se ferme sur le paysage qui l'a ouverte.** Le hero est une vallée
 * vue depuis un col ; le pied de page est la même vallée, vue d'en bas, à la
 * tombée du jour. C'est la seule image du site qui ne serve à rien d'autre qu'à
 * finir la page, et c'est pour cela qu'elle est en dernier, sous le texte et
 * non derrière : posée en fond, elle aurait mis de la prose sur de la peinture,
 * et le contraste d'un texte sur une image se mesure au pire cas.
 *
 * Les deux fichiers portent leur transparence. Ils se posent donc sur
 * `--background` et suivent le thème sans qu'aucune couleur ne soit écrite ;
 * c'est aussi pourquoi ils n'ont pas de voile.
 */
export function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:pt-20">
        {/* Le bloc de marque, centré. */}
        <div className="text-center">
          {/* Le nom, en deux mots de poids différents.

              Il reprend le traitement du logo de l'en-tête et du mot
              « expertise » du hero : Fraunces en italique, avec l'effet lettre
              à lettre. Ici le corps est grand, et c'est le seul endroit du site
              où cet effet se voit vraiment, le contour et l'écartement étant
              proportionnels au corps.

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

        {/* Les colonnes.

            Deux de front sur téléphone, trois à partir de `sm`. Trois libellés
            de cette longueur sur un écran de 375 px donneraient des colonnes de
            cent pixels, où « Consulting privé avec Rémy » tiendrait sur quatre
            lignes.

            La troisième colonne se retrouve seule sur la seconde rangée en
            dessous de `sm`, et c'est le bon compromis : mieux vaut une colonne
            orpheline que trois colonnes illisibles. */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-20 sm:grid-cols-3">
          {colonnesPiedDePage.map((colonne) => (
            <nav key={colonne.titre} aria-label={colonne.titre}>
              {/* Un titre de colonne n'est pas un titre de document : il ne
                  prend donc pas de `h3`, qui l'inscrirait dans le plan que les
                  robots lisent, juste sous le `h2` de la dernière section. */}
              <p className="text-sm font-semibold text-foreground">
                {colonne.titre}
              </p>

              <ul className="mt-4 space-y-3">
                {colonne.entrees.map((entree) => (
                  <li key={entree.href}>
                    <Link
                      href={entree.href}
                      target={entree.externe ? "_blank" : undefined}
                      rel={entree.externe ? "noreferrer" : undefined}
                      className="rounded-md text-sm text-pretty text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {entree.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Le bas de page légal.

            L'avertissement reste ferré à gauche : le fer à droite est réservé
            aux colonnes de nombres, où il aligne les unités. Sur de la prose,
            il produit un bord gauche en dents de scie que l'œil doit rattraper
            à chaque ligne. Et pas de `whitespace-nowrap` sur le copyright : sur
            un écran étroit, il ferait déborder la page. */}
        <div className="mt-16">
          <Separator className="mb-8" />

          <nav aria-label="Mentions légales">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legales.map((entree) => (
                <li key={entree.href}>
                  <Link
                    href={entree.href}
                    className="rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {entree.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 flex flex-col gap-3 pb-12 text-xs text-muted-foreground">
            <p>
              © {annee} {identite.societe}
            </p>
            {/* Repris du pied de page de remy-jupille.com, au mot près. */}
            <p>{avertissement}</p>
          </div>
        </div>
      </div>

      {/* Le paysage de fin.

          Il est hors du conteneur à `max-w-6xl` : c'est un horizon, et un
          horizon qui s'arrête à mille cent pixels avec du beige de chaque côté
          n'est plus un horizon.

          `object-bottom` avec une hauteur bornée : l'image fait 1,75 de rapport,
          donc 823 px de haut sur un écran de 1440. On n'en garde que le bas,
          c'est-à-dire la vallée ; le haut est transparent et ne porte rien.
          `clamp` évite d'écrire une hauteur en dur, qui serait juste à une
          seule largeur d'écran.

          **Le raccord du haut est un masque, pas un dégradé posé par-dessus.**
          L'image porte déjà sa propre transparence, mais elle s'éteint dans le
          tiers haut, c'est-à-dire exactement la partie que le cadrage par le
          bas supprime : la coupure redevenait donc franche, et une ligne droite
          en travers d'un paysage se voit comme un défaut d'affichage. Le
          masque rend au bord la disparition que le cadrage lui a prise.

          Un voile de la couleur de page aurait fait la même chose à l'œil, mais
          seulement tant que le fond ne bouge pas : le masque, lui, retire des
          pixels, donc il tient quel que soit le thème et quoi qu'on mette
          derrière.

          `alt=""` assumé et le tout `aria-hidden` : l'image est décorative, et
          elle ne dit rien que la page ne dise déjà. */}
      <div aria-hidden className="mt-4 w-full overflow-hidden">
        <picture>
          <source media="(min-width: 768px)" srcSet="/fond-pied-de-page.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fond-pied-de-page-mobile.webp"
            alt=""
            width={1920}
            height={1097}
            loading="lazy"
            // Les deux écritures du masque : Safari n'a levé son préfixe qu'en
            // 15.4, et un pied de page n'est pas l'endroit où laisser une
            // coupure franche aux navigateurs d'avant.
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 32%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 32%)",
            }}
            className="h-[clamp(8rem,26vw,20rem)] w-full object-cover object-bottom"
          />
        </picture>
      </div>
    </footer>
  );
}
