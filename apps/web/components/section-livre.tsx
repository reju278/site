import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
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
    <div className="relief-verre overflow-hidden rounded-md border border-border bg-card">
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
          {/* Le titre roule lui aussi quand la carte entre dans la vue. Il est
              ferré à gauche, donc pas de `text-balance` : le bord est déjà
              l'axe, et l'équilibrage ne ferait que raccourcir la première ligne
              sans raison. */}
          <TitreRoulant
            segments={[{ texte: livre.nom }]}
            className="titre mt-5 text-4xl text-card-foreground sm:text-5xl"
          />

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

              **Ils tiennent sur une seule ligne, à toutes les largeurs**, sur
              décision de Rémy. C'est le libellé court qui le permet : « Chapitre
              gratuit » et non la phrase entière, donc ses mots quand même,
              puisque c'est ainsi que son propre menu l'appelle. La phrase
              longue ne tenait pas, se coupait en deux lignes à côté d'un plein
              qui en tenait une, et deux boutons de hauteur égale dont l'un porte
              deux lignes ne se lisent plus comme une paire.

              `flex-1` en dessous de `sm` : sur téléphone les deux se partagent
              la largeur en parts égales, ce qui aligne leurs quatre bords. Au
              delà, `sm:flex-none` leur rend la largeur de leur texte, sinon
              deux boutons étirés sur la moitié d'un volet auraient l'air d'une
              barre d'onglets.

              Le corps et le rembourrage descendent d'un cran sur téléphone.
              Sans ça, les deux libellés demandent 338 px là où la carte n'en
              offre que 287, et `whitespace-nowrap` les ferait sortir du bouton
              **sans que la page déborde** : `overflow-hidden` sur la carte les
              couperait en plein mot, et rien ne le signalerait. Les valeurs
              sont mesurées dans le navigateur, pas estimées. */}
          <div className="mt-8 flex items-stretch gap-3 sm:gap-4">
            {/* Le plein. Le scintillement reste, mais sur le rouge de la
                couverture : il passe par `--fond` et non par une classe, pour
                que le bouton et le masque de son liseré ne puissent pas
                diverger. */}
            <BoutonScintillant
              href={livre.href}
              fond="var(--livre)"
              className="h-12 flex-1 justify-center px-4 text-sm sm:h-14 sm:flex-none sm:px-8 sm:text-base"
            >
              <TexteRoulant>{livre.action}</TexteRoulant>
              {/* La flèche disparaît en dessous de `sm`, et c'est une décision
                  plutôt qu'un accident. Sur téléphone, le bouton fait 151 px
                  pour un libellé qui en demande 118 : l'icône, qui n'a pas de
                  `shrink-0`, se faisait écraser à zéro de largeur par le flex.
                  Elle était donc déjà invisible, mais par accident, et le jour
                  où le libellé raccourcit elle réapparaît à moitié. */}
              <ArrowRight className="hidden size-4 shrink-0 sm:block" />
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
              className="group/roule inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-current px-4 text-sm font-semibold whitespace-nowrap text-(--livre-texte) transition-colors hover:bg-[color-mix(in_oklab,var(--livre)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--livre-texte) sm:h-14 sm:flex-none sm:px-8 sm:text-base"
            >
              <TexteRoulant>{livre.actionSecondaire}</TexteRoulant>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
