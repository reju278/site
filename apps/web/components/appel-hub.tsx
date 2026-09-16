import { BoutonScintillant } from "@/components/bouton-scintillant";
import { CarteOffre } from "@/components/carte-offre";
import { LogoFunnels } from "@/components/logo-funnels";
import { TexteRoulant } from "@/components/texte-roulant";
import { appelHub, avertissementHub } from "@/contenu/hub";
import { identite, legales } from "@/contenu/site";
import { SORTIE } from "@/lib/hub";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Les trois appels du hub, et le pied de page qui le ferme.
 *
 * Tous mènent au même endroit, `SORTIE`, qui est l'unique lien sortant autorisé
 * et porte déjà sa balise de provenance Hyros. Ils ne diffèrent que par le
 * moment auquel ils s'adressent, comme sur le site : le hub n'invente pas un
 * vocabulaire d'actions à lui.
 */

/**
 * La barre fixe en bas d'écran, sur téléphone uniquement. Demandée par Rémy.
 *
 * **Pourquoi seulement sur téléphone.** Sur un grand écran, les appels de la
 * page restent dans la vue en défilant et une barre fixe mangerait de la
 * hauteur pour rien. Sur un téléphone tenu à la main, l'appel sous la vidéo est
 * hors champ dès le troisième paragraphe, et c'est là que la question se pose.
 *
 * **`pb-[env(safe-area-inset-bottom)]`** : sans lui, la barre passe sous la
 * barre de gestes des iPhone récents et le bouton devient à moitié
 * inatteignable. C'est une hauteur que seul le navigateur connaît.
 *
 * **Le fond est plein, et il a fallu le corriger.** Il était à `background/95`,
 * ce qui paraissait sans conséquence : à cinq pour cent, le bouton d'appel
 * posé sous la vidéo transparaissait à travers la barre et on lisait deux fois
 * le même libellé, l'un net et l'autre fantôme. C'est la règle du projet, fonds
 * pleins partout, et le flou par-devant a ses trois exceptions déjà écrites
 * dans `AGENTS.md` : une quatrième se décide, elle ne s'ajoute pas.
 */
export function BarreAppelHub() {
  return (
    /* `data-barre-appel` est lu par `globals.css`, qui efface la barre quand une
       fenêtre est ouverte : sur téléphone, elle passait par-dessus la fenêtre
       des entretiens et y répétait le même bouton d'appel. */
    <div
      data-barre-appel
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <div className="px-5 py-3">
        {/* `min-h-*` et pas de `whitespace-nowrap` : « Réserver mon appel
            gratuit » demande plus que la largeur d'un téléphone de 375 px, et
            un libellé qui refuse de passer à la ligne élargit le document
            entier. C'est exactement la panne décrite dans `AGENTS.md`. */}
        <BoutonScintillant href={SORTIE} className="flex w-full">
          {appelHub.libelle}
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </BoutonScintillant>
      </div>
    </div>
  );
}

/**
 * L'encart d'appel au milieu d'un article, à la place d'`AppelFormation`.
 *
 * Celui du site propose deux chemins, la formation gratuite et l'appel. Le hub
 * n'en a qu'un : la formation vit sur un autre domaine, donc ce serait une
 * sortie, et la règle du hub est qu'il n'y en a pas d'autre que l'appel. Le
 * dessin de la carte, lui, est celui du site au pixel près.
 */
export function AppelHubArticle() {
  return (
    <aside className="relief-verre my-14 rounded-md border border-border bg-card p-6 sm:my-16 sm:p-8">
      <p className="titre text-2xl text-balance text-card-foreground sm:text-3xl">
        {appelHub.titre}
      </p>

      <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
        {appelHub.texte}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={SORTIE}
          target="_blank"
          rel="noreferrer"
          className="group/roule inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
        >
          <TexteRoulant>{appelHub.libelle}</TexteRoulant>
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </a>
      </div>
    </aside>
  );
}

/**
 * Le pied de page du hub, calqué sur celui du site.
 *
 * Même forme exactement, sur demande de Rémy : le fond du deck qui s'allume par
 * le haut, la grande carte à ombre détachée des bords, le nom en haut à gauche,
 * les colonnes de liens, et sous la carte ce qui est légal. C'est le découpage
 * qui fait le travail, pas l'ombre : ce qui est dans la carte sert à naviguer,
 * ce qui est dessous ne se clique pas.
 *
 * **Trois différences, et toutes viennent de ce qu'est le hub.**
 *
 * Les colonnes de liens ne mènent pas aux pages du site, qui seraient autant de
 * sorties : elles listent **les entretiens**, qui sont la seule navigation que
 * le hub possède. Le nom ramène au sommaire et non à l'accueil.
 *
 * **Une seule carte d'offre et non trois**, celle de l'appel, sur demande de
 * Rémy. Les deux autres mènent au consulting et au livre : ce sont des
 * destinations, et le hub n'en a qu'une.
 *
 * **Pas de rangée de réseaux.** Cinq pastilles vers cinq plateformes sont cinq
 * portes de sortie, et c'est précisément ce que le hub n'a pas.
 *
 * L'avertissement prend la place des avertissements du site, au même endroit et
 * au même fer. **Il n'est pas en petits caractères par hasard** : il est au
 * corps des mentions parce que c'est là qu'elles vivent, mais son texte est
 * long et pleine mesure, alors qu'une mention minuscule et difficile à trouver
 * est elle-même un signal de méfiance à l'examen d'une page d'arrivée.
 */
export function PiedHub({
  entretiens,
}: {
  entretiens: readonly { slug: string; nom: string }[];
}) {
  const annee = new Date().getFullYear();

  return (
    <footer className="relative isolate pb-5">
      {/* Le fond du deck. **Le fondu est en haut**, et c'est la position du
          bloc qui le décide : il y a du contenu au-dessus et plus rien en
          dessous, donc il s'allume par le haut et va jusqu'au bord. C'est la
          même couche que celle des en-têtes de pages, écrite une fois dans
          `globals.css`. Les deux écritures du masque s'écrivent : Safari n'a
          levé son préfixe qu'en 15.4. */}
      <div
        aria-hidden
        className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5">
        {/* La carte. Le relief de verre et l'ombre portée dans la même
            déclaration : deux `box-shadow` sur un même élément ne s'additionnent
            pas, le second remplace le premier. */}
        <div
          style={{
            boxShadow: "var(--ombre-verre), 0 18px 50px -30px rgba(0,0,0,0.35)",
          }}
          className="rounded-md border border-border bg-card px-6 py-8 sm:px-10 sm:py-10 lg:px-12"
        >
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-10">
            <div>
              {/* La marque, en haut à gauche.

                  **Funnels.Club et non Rémy Jupille**, sur demande de Rémy, et
                  **sans italique** : un nom de marque se pose droit, là où le
                  logo du site reprend un mot penché du hero. C'est la même
                  marque que dans l'en-tête du hub, et elle ramène au sommaire.

                  `KineticText` et son effet lettre à lettre sautent avec :
                  il découpe un mot pour l'animer, et « Funnels.Club » porte un
                  point au milieu, qui deviendrait une lettre à part entière
                  avec sa propre marge. */}
              <Link
                href="/hub"
                className="titre flex items-center gap-2 text-2xl tracking-tight text-foreground sm:text-3xl"
              >
                <LogoFunnels className="size-[1.05em]" />
                Funnels.Club
              </Link>

              {/* Les entretiens, à la place des colonnes de liens du site.

                  Un seul titre au-dessus de trois colonnes, et non trois titres
                  de colonne : ce sont neuf entrées d'une même liste, et les
                  répartir sous trois intitulés inventés reviendrait à leur
                  fabriquer des catégories qui n'existent pas.

                  Deux colonnes de front sur téléphone : à trois, un nom comme
                  « Yannick et Sylvie » tiendrait sur trois lignes. */}
              <nav aria-label="Les entretiens" className="mt-8 sm:mt-10">
                {/* Pas de `h3` : un titre de colonne de pied de page n'est pas
                    un titre de document et n'a rien à faire dans le plan. */}
                <p className="text-sm font-semibold text-foreground">
                  Les entretiens
                </p>

                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:gap-x-8">
                  {entretiens.map((entretien) => (
                    <li key={entretien.slug}>
                      <Link
                        href={`/hub/${entretien.slug}`}
                        className="group/roule inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <TexteRoulant>{entretien.nom}</TexteRoulant>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* La carte d'appel, seule, **et à sa hauteur naturelle**.

                Le pied de page du site étire ses trois cartes sur toute la
                hauteur de la rangée, `flex-1` sur chacune : à trois, cela les
                partage et chacune reste compacte. Seule, la même règle donnait
                une carte haute comme toute la colonne de liens, soit une grande
                surface presque vide au milieu du pied de page. Elle se cale
                donc en haut à droite et s'arrête à son contenu, ce que Rémy a
                demandé : « c'est pas grave si elle est en haut à droite, mais
                il faut qu'elle soit cohérente ».

                `items-start` est ce qui l'empêche de s'étirer : dans une grille,
                une cellule prend par défaut toute la hauteur de sa rangée. */}
            <div className="mt-10 flex flex-col items-stretch self-start lg:mt-0">
              <CarteOffre
                marque={
                  <LogoFunnels className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]" />
                }
                nom="Funnels Club"
                texte={identite.promesse}
                href={SORTIE}
                action="Réserver votre appel"
              />
            </div>
          </div>
        </div>

        {/* Sous la carte : l'avertissement, les mentions, le copyright.

            Ferrés à gauche et alignés sur le **bord de la carte**, sans
            rembourrage à eux : deux alignements voisins qui ne coïncident pas
            se voient tout de suite. Pas de filet de séparation non plus, la
            carte ayant déjà son bord, son ombre et sa couleur. */}
        <div className="pt-8 pb-8">
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-muted-foreground">
            <p className="max-w-5xl text-pretty">{avertissementHub}</p>

            {/* Les mentions restent atteignables, et c'est une entorse assumée
                à « rien ne sort du hub » : une page commerciale européenne sans
                accès à ses conditions et à sa politique de confidentialité est
                moins conforme, pas plus, et leur absence est un signal de
                méfiance connu à l'examen des pages d'arrivée. Ce sont des
                documents, et ils portent déjà `robots: { index: false }`. */}
            <nav aria-label="Mentions légales" className="pt-2">
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {legales.map((entree) => (
                  <li key={entree.href}>
                    <Link
                      href={entree.href}
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
        </div>
      </div>
    </footer>
  );
}
