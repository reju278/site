import { BoutonScintillant } from "@/components/bouton-scintillant";
import { livre } from "@/contenu/site";
import { ArrowRight } from "lucide-react";

/**
 * Le livre, en une carte à deux volets.
 *
 * Le volet de gauche ne porte que l'objet. Il est sur `--accent` et non sur
 * `--card` : sans ce changement de valeur, la couverture flotterait au milieu
 * du blanc et la carte se lirait comme un paragraphe avec une illustration.
 * Le halo derrière le livre est une seule touche de `--livre` très diluée, qui
 * décolle le rendu 3D du fond sans peindre un carré de couleur.
 *
 * **Toute la section est en `--livre`, le rouge de la couverture**, et non dans
 * le bleu du reste du site. C'est le seul écran qui montre un objet ayant déjà
 * sa couleur : lui coller le bleu ferait cohabiter deux rouges, celui de la
 * couverture et rien pour lui répondre. Voir le commentaire des jetons dans
 * `globals.css`.
 *
 * **Les deux actions sont deux boutons, un plein et un creux**, comme
 * « Découvrir » et « Connexion » dans l'en-tête. Un lien souligné à côté d'un
 * bouton de 56 px se lit comme une note de bas de page, alors que ces deux
 * chemins sont d'importance comparable : l'un mène à l'achat, l'autre au
 * chapitre offert, et beaucoup de gens prendront le second d'abord.
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
          {/* Le halo. `--livre` à 14 % dans un dégradé radial qui s'éteint
              avant les bords : posé en dur, ce serait une couleur écrite, et
              elle ne suivrait pas le thème. Il reprend le rouge de la
              couverture, donc la couleur rayonne de l'objet au lieu d'être
              posée autour de lui. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,color-mix(in_oklab,var(--livre)_14%,transparent),transparent_70%)]"
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
              de rubrique fabriqué ici. Le fond est `--livre` pleine opacité :
              une pastille diluée ne tiendrait pas ses 4,5:1, et le blanc n'a
              déjà que 4,75:1 sur ce rouge. */}
          <p className="w-fit rounded-md bg-(--livre) px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
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

          {/* Les deux actions mènent à la même page, et c'est voulu : le plein
              pour qui veut le livre, le creux pour qui veut d'abord le lire.
              Le texte de chacun dit lequel des deux il est, donc aucun « en
              savoir plus ».

              **Le creux ne se coupe jamais en deux lignes.** Son libellé fait
              deux mots de plus que celui du plein : posés côte à côte dans le
              volet de droite, qui ne fait que la moitié de la carte, il n'a pas
              la place de tenir sur une ligne et se cassait en deux, à côté d'un
              plein qui en tenait une. Deux boutons de même hauteur dont l'un
              porte deux lignes et l'autre une ne se lisent plus comme une
              paire.

              `whitespace-nowrap` sur le creux et `flex-wrap` sur la rangée : le
              libellé reste d'un seul tenant, et c'est la **rangée** qui cède
              quand la place manque, en faisant passer le creux sous le plein.
              Le point de bascule n'est donc écrit nulle part, il se déduit de
              la largeur réelle du texte, ce qu'aucun point de rupture choisi à
              la main ne saurait faire.

              **Mais le `nowrap` s'arrête en dessous de `sm`.** Sur un écran de
              375 px, la carte ne laisse que 223 px au texte du creux, qui en
              demande 300 : d'un seul tenant, il sortait du bouton, et
              `overflow-hidden` sur la carte le coupait en plein mot, sans que
              la page déborde ni que rien ne signale la perte. Le bouton
              retrouve donc le droit de se couper en deux lignes là où il n'a
              pas le choix, et `min-h-14` le laisse grandir au lieu de rogner
              son propre texte.

              `w-full sm:w-auto` : sur téléphone les deux prennent toute la
              largeur, ce qui aligne leurs deux bords. Au-delà, ils reprennent
              la largeur de leur texte. */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Le plein. Le scintillement reste, mais sur le rouge de la
                couverture : il passe par `--fond` et non par une classe, pour
                que le bouton et le masque de son liseré ne puissent pas
                diverger. */}
            <BoutonScintillant
              href={livre.href}
              fond="var(--livre)"
              className="w-full justify-center sm:w-auto"
            >
              {livre.action}
              <ArrowRight className="size-4" />
            </BoutonScintillant>

            {/* Le creux.

                Même hauteur et même rayon que le plein, pour qu'ils se lisent
                comme une paire et non comme deux objets voisins. Le fond est
                transparent, la couleur est portée par le texte et la bordure,
                et c'est `--livre-texte` qui les porte : le rouge de la
                couverture ne tient que 4,75:1 sur du blanc, alors que le texte
                d'un bouton creux se pose directement sur la carte. En thème
                sombre, le jeton remonte vers un rose clair pour la raison
                inverse.

                La bordure est en `currentColor` : elle ne peut donc pas
                diverger du texte, et elle tient d'office les 3:1 que le projet
                demande à une bordure de contrôle puisque le texte en tient
                déjà 6. */}
            <a
              href={livre.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-current px-6 py-3 text-center text-base font-semibold text-(--livre-texte) transition-colors hover:bg-[color-mix(in_oklab,var(--livre)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--livre-texte) sm:w-auto sm:px-8 sm:whitespace-nowrap"
            >
              {livre.actionSecondaire}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
