import { BoutonScintillant } from "@/components/bouton-scintillant";
import { livre } from "@/contenu/site";
import { ArrowRight } from "lucide-react";

/**
 * Le livre, en une carte à deux volets.
 *
 * Le volet de gauche ne porte que l'objet. Il est sur `--accent` et non sur
 * `--card` : sans ce changement de valeur, la couverture flotterait au milieu
 * du blanc et la carte se lirait comme un paragraphe avec une illustration.
 * Le halo derrière le livre est une seule touche de `--primary` très diluée,
 * qui décolle le rendu 3D du fond sans peindre un carré de couleur.
 *
 * Le volet de droite porte le texte, et rien de ce texte n'est écrit ici : tout
 * vient de `livre`, donc de la page de vente de Rémy. Voir le commentaire de
 * `livre` dans `site.ts`.
 *
 * `items-stretch` sur la grille, et le volet de l'image en `flex` centré : les
 * deux volets font la même hauteur quelle que soit la longueur du texte, ce
 * qui est la moitié de ce qui fait tenir une carte à deux colonnes. L'autre
 * moitié est le `lg:` : en dessous, les volets s'empilent, l'image d'abord.
 */
export function SectionLivre() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="grid items-stretch lg:grid-cols-2">
        {/* Le volet de l'objet. */}
        <div className="relative isolate flex items-center justify-center bg-accent px-6 py-12 sm:px-10 sm:py-16">
          {/* Le halo. `--primary` à 12 % dans un dégradé radial qui s'éteint
              avant les bords : posé en dur, ce serait une couleur écrite, et
              elle ne suivrait pas le thème. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)]"
          />

          {/* Deux fichiers, un par largeur. Le rendu est large et détaillé :
              servir les 1200 px à un téléphone de 375 ferait payer trois fois
              le poids pour rien.

              `loading="lazy"` parce que cette image est très bas dans la page :
              celle que Google chronomètre est celle du hero. */}
          <picture>
            <source media="(min-width: 640px)" srcSet={livre.visuel.large} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={livre.visuel.mobile}
              alt={livre.visuel.alt}
              width={1200}
              height={832}
              loading="lazy"
              className="w-full max-w-md drop-shadow-2xl"
            />
          </picture>
        </div>

        {/* Le volet du texte. */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
          {/* L'étiquette. Ce sont les mots de sa page de vente, pas un intitulé
              de rubrique fabriqué ici. Le fond est `--primary` pleine
              opacité : une pastille diluée ne tiendrait pas ses 4,5:1. */}
          <p className="w-fit rounded-md bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground uppercase">
            {livre.etiquette}
          </p>

          {/* `h2` : le même rang que le titre des offres et celui des
              résultats. La section n'a pas de sous-titre de rang inférieur, le
              plan reste donc plat et sans marche sautée. */}
          <h2 className="titre mt-5 text-4xl text-card-foreground sm:text-5xl">
            {livre.nom}
          </h2>

          <p className="mt-3 text-lg leading-relaxed text-pretty text-foreground">
            {livre.sousTitre}
          </p>

          <div className="mt-6 space-y-4">
            {livre.paragraphes.map((paragraphe) => (
              <p
                key={paragraphe}
                className="text-base leading-relaxed text-pretty text-muted-foreground"
              >
                {paragraphe}
              </p>
            ))}
          </div>

          {/* Les deux actions mènent à la même page, et c'est voulu : le
              bouton pour qui veut le livre, le lien pour qui veut le lire
              avant de payer. Le texte de chacun dit lequel des deux il est,
              donc aucun « en savoir plus ».

              `items-start` et non `items-center` : sur téléphone les deux
              passent l'un sous l'autre, et un lien centré sous un bouton pleine
              largeur casse le bord gauche du bloc. */}
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <BoutonScintillant href={livre.href}>
              {livre.action}
              <ArrowRight className="size-4" />
            </BoutonScintillant>

            <a
              href={livre.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-md text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {livre.actionSecondaire}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
