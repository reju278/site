import { Reseaux } from "@/components/reseaux";
import { TexteRoulant } from "@/components/texte-roulant";
import {
  avertissements,
  colonnesPiedDePage,
  consultingPiedDePage,
  estExterne,
  identite,
  legales,
  liens,
  livre,
} from "@/contenu/site";
import { CarteOffre } from "@/components/carte-offre";
import { LogoFunnels } from "@/components/logo-funnels";
import { KineticText } from "@repo/ui/components/kinetic-text";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Le pied de page, en carte posée sur la page.
 *
 * La forme est celle du pied de page de functionhealth.com, reprise sur demande
 * de Rémy : **une grande carte à ombre**, détachée des bords, avec le logo en
 * haut à gauche, les colonnes de liens en dessous, puis une rangée basse qui
 * porte les réseaux à gauche et les mentions à droite. Ce qui est long et
 * légal, l'avertissement et le copyright, sort de la carte et se pose en
 * dessous, en petit.
 *
 * **C'est ce découpage qui fait tout le travail**, plus que l'ombre. Un pied de
 * page classique met les mentions et l'avertissement sur le même rang que les
 * liens, et le regard ne sait plus ce qu'il doit lire. Ici la carte contient ce
 * qui sert à naviguer ; ce qui est sous la carte n'est plus de la navigation,
 * et sa mise en page le dit avant qu'on ait lu un mot.
 *
 * **Il n'y a pas d'image ici.** La page s'est fermée un temps sur le paysage du
 * hero vu d'en bas ; Rémy l'a retirée. Les deux fichiers restent dans `public/`,
 * donc le geste se refait en quelques lignes si la question revient.
 *
 * Le rayon est `--rayon-jonction` et non 5 px : la carte fait presque toute la
 * largeur de l'écran, et c'est exactement le cas que l'exception d'échelle du
 * projet décrit. Voir `AGENTS.md`.
 */
export function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    // La largeur est celle de `Section`, au pixel : `max-w-6xl` plus `px-5`,
    // donc 1 112 px de contenu sur un écran de 1440. Le pied de page avait sa
    // propre mesure et tombait 20 px plus large de chaque côté que la carte du
    // livre juste au-dessus : deux blancs voisins qui ne s'alignent pas se
    // voient tout de suite, même sans savoir dire pourquoi.
    <footer className="relative isolate pb-5">
      {/* Le fond du deck, celui des en-têtes de pages intérieures.

          C'est exactement la même couche que `EnTetePage` et `FondResultats` :
          `fond-resultats` et `grain-resultats`, écrits une fois dans
          `globals.css`. Posé ici sur décision de Rémy, pour que la page se
          ferme sur la matière sur laquelle les pages s'ouvrent.

          **Le fondu est en haut et non en bas, et c'est la position du bloc qui
          le décide.** L'en-tête d'une page intérieure a du contenu en dessous,
          donc il s'éteint par le bas ; le pied de page a du contenu au-dessus
          et plus rien en dessous, donc il s'allume par le haut et va jusqu'au
          bord. Il n'y a aucun raccord à cacher en bas : il n'y a pas de bas.

          Pas de lèvre ni de filet, pour la même raison qu'en tête de page
          intérieure : une lèvre est la page qui **descend** sur un bloc, avec
          ses angles arrondis. Ici le fond monte vers la page au lieu de s'y
          heurter, donc il n'y a pas d'arête à rendre lisible.

          Le masque emporte le grain en même temps que la couleur, puisqu'il
          s'applique à l'élément et à son `::after`. C'est ce qui compte : une
          couche de couleur qui se fond sous un grain qui s'arrête net dessine
          exactement la ligne que le fondu essayait d'effacer. Voir `AGENTS.md`.

          Les deux écritures du masque s'écrivent : Safari n'a levé son préfixe
          qu'en 15.4. */}
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
        {/* La carte.

          L'ombre est large et très diffuse. Une ombre courte et dense
          donnerait une carte qui flotte au-dessus de la page ; celle-ci doit
          seulement s'en détacher. Elle est pensée pour les deux thèmes : en
          sombre, c'est la différence entre `--card` et `--background` qui
          sépare, et le filet en `--border` qui la souligne. */}
        <div
          /* Le relief de verre et l'ombre portée dans la même déclaration :
             deux `box-shadow` sur un même élément ne s'additionnent pas, le
             second remplace le premier. Les autres cartes prennent
             `relief-verre` en classe, n'ayant pas d'ombre à composer avec. */
          style={{
            boxShadow:
              "var(--ombre-verre), 0 18px 50px -30px rgba(0,0,0,0.35)",
          }}
          className="rounded-md border border-border bg-card px-6 py-8 sm:px-10 sm:py-10 lg:px-12"
        >
          {/* Le nom, en haut à gauche.

            Il était au centre et très grand. Ici il tient la place du logo de
            la référence : à gauche, en tête de carte, à une taille qui le
            laisse être une signature et non un titre.

            Il reprend le traitement du logo de l'en-tête et du mot
            « expertise » du hero : Fraunces en italique, avec l'effet lettre à
            lettre. « Rémy » est appuyé par un contour opaque, `mot-appuye`, et
            non par un `font-bold` : voir la règle dans `globals.css`.

            `aria-label` sur le lien : le nom est découpé en deux composants qui
            portent chacun leur texte de lecteur d'écran, et sans lui la
            destination s'annoncerait en deux morceaux. */}
          {/* Deux colonnes à partir de `lg` : la navigation à gauche, les trois
              cartes d'offre à droite.

              **Les cartes tiennent toute la hauteur du pied de page**, sur
              décision de Rémy, et c'est ce qui l'empêche de mesurer trois
              kilomètres. Empilées sous les colonnes de liens, elles ajoutaient
              leur hauteur à celle de la navigation ; à côté, elles occupent une
              place qui existait déjà. La grille étire la colonne de droite sur
              la hauteur de la ligne, et `flex-1` sur chaque carte la partage en
              trois.

              Sous `lg`, tout redevient une seule colonne et les cartes passent
              sous les liens : à cette largeur il n'y a pas de place à côté, et
              les étirer n'aurait plus de sens. */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-10">
            <div>
          <Link
            href="/"
            aria-label={`${identite.nom}, retour à l'accueil`}
            className="titre inline-flex flex-wrap items-baseline gap-x-[0.25em] text-2xl text-foreground sm:text-3xl"
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

          {/* Le corps : trois colonnes de liens, puis l'appel à l'action.

            La dernière colonne est plus large que les trois autres, comme dans
            la référence : elle porte une phrase et une action, pas une liste,
            et à largeur égale la phrase se couperait en lignes de trois mots.

            Deux colonnes de front sur téléphone : trois libellés de cette
            longueur sur 375 px donneraient des colonnes de cent pixels, où
            « Consulting privé avec Rémy » tiendrait sur quatre lignes. */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-10 sm:grid-cols-3 lg:gap-x-8">
            {colonnesPiedDePage.map((colonne) => (
              <nav key={colonne.titre} aria-label={colonne.titre}>
                {/* Un titre de colonne n'est pas un titre de document : il ne
                  prend donc pas de `h3`, qui l'inscrirait dans le plan que les
                  robots lisent. */}
                <p className="text-sm font-semibold text-foreground">
                  {colonne.titre}
                </p>

                <ul className="mt-4 space-y-2.5">
                  {colonne.entrees.map((entree) => (
                    <li key={entree.href}>
                      <Link
                        href={entree.href}
                        target={
                          entree.externe || estExterne(entree.href)
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          entree.externe || estExterne(entree.href)
                            ? "noreferrer"
                            : undefined
                        }
                        className="group/roule inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <TexteRoulant>{entree.libelle}</TexteRoulant>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

          </div>

          {/* La rangée basse de la carte : les réseaux, et eux seuls.

            Les mentions y étaient, à droite. Rémy les a descendues sous la
            carte, contre le copyright : elles y sont plus discrètes et
            alignées sur le texte légal, qui est de la même nature. */}
              <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <Reseaux rond />
              </div>
            </div>

            {/* L'appel à l'action.

              La référence met ici un formulaire d'inscription à sa lettre. On
              n'en met pas, et ce n'est pas un raccourci : le site n'a ni base
              ni envoi d'emails, et un champ qui ressemble à une inscription
              sans en être une est pire que pas de champ.

              Ce n'est pas la lettre qui occupe la place mais **Funnels Club**,
              sur décision de Rémy : c'est ce que le pied de page a de plus
              utile à proposer à quelqu'un arrivé jusqu'en bas. La lettre reste
              atteignable, dans la colonne « Ressources ».

              La phrase est la promesse de funnels.club, reprise au mot près, et
              le libellé du bouton est celui du hero. Rien n'est écrit ici. */}
            <div className="mt-10 flex flex-col gap-3 lg:mt-0">
              {/* La colonne est devenue une carte, sur demande de Rémy : le
                  fond du deck, un relief, et une inclinaison qui suit la
                  souris. Tout est dans `CarteFunnelsClub` ; ce qu'elle porte
                  n'a pas changé d'un mot.

                  `-mt-4` la remonte au ras des titres de colonnes : les trois
                  colonnes voisines commencent par une ligne de titre, et la
                  carte, qui n'en a pas, démarrait plus bas qu'elles. Elle
                  descend en revanche jusqu'au bas de la rangée, `h-full`, ce
                  qui est le « de haut en bas » demandé. */}
              <CarteOffre
                className="lg:flex-1"
                marque={
                  <LogoFunnels className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]" />
                }
                nom="Funnels Club"
                texte={identite.promesse}
                href={liens.decouvrir}
                action="Découvrir Funnels Club"
              />

              <CarteOffre
                className="lg:flex-1"
                teinte="or"
                marque={
                  <LogoFunnels
                    lettre="C"
                    className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]"
                  />
                }
                nom="Consulting privé"
                texte={consultingPiedDePage.texte}
                href={liens.consulting}
                action="Postuler pour le consulting"
              />

              <CarteOffre
                className="lg:flex-1"
                teinte="rouge"
                /* **Le logo de Digital Selfmade, et non la couverture du
                   livre.** C'est la couverture qui tenait cette place, et Rémy
                   l'a signalée cassée : `livre.visuel.large` est un rendu de
                   1200 sur 832 montrant trois exemplaires côte à côte, et
                   recadré dans un carré d'un cadratin il n'en restait qu'un
                   fragment du milieu. Rien n'échouait, l'image se chargeait.

                   **Une image large ne devient pas une icône en la rognant.**
                   Ce qui est carré ici, c'est le logo de la marque, pas la photo
                   de l'objet, et c'est le même fichier que la tuile du menu des
                   ressources. `object-contain` pour la même raison : le rogner
                   d'un pixel lui couperait son disque.

                   Elle est `aria-hidden` comme les deux tuiles, le nom étant
                   écrit juste à côté. */
                marque={
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/digital-selfmade.png"
                    alt=""
                    aria-hidden
                    width={128}
                    height={111}
                    loading="lazy"
                    className="mr-[0.28em] inline-block size-[0.95em] object-contain align-[-0.13em]"
                  />
                }
                nom={livre.nom}
                texte={livre.sousTitre}
                href={livre.href}
                action={livre.action}
              />
            </div>
          </div>
        </div>

        {/* Sous la carte : le copyright et l'avertissement.

          Ferrés à gauche. Le fer à droite est réservé aux colonnes de nombres,
          où il aligne les unités ; sur de la prose, il produit un bord gauche
          en dents de scie que l'œil doit rattraper à chaque ligne. Et pas de
          `whitespace-nowrap` sur le copyright : sur un écran étroit, il ferait
          déborder la page. */}
        {/* Les avertissements s'alignent sur le **bord de la carte** et non sur
          un rembourrage à eux. Ils en avaient un, plus grand, et leur bloc de
          texte démarrait en retrait du bord de la carte : le regard voyait deux
          alignements là où il n'en faut qu'un. */}
        <div className="pt-8 pb-8">
          {/* Pas de filet de séparation.

            Il y en avait un, et il ne servait à rien : la carte a déjà son
            bord, son ombre et sa couleur, et ce qui est en dehors d'elle est
            déjà visiblement en dehors. Un trait de plus au même endroit ne
            sépare pas mieux, il ajoute une ligne à regarder. Retiré sur
            décision de Rémy. */}
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-muted-foreground">
            {/* Les avertissements, au mot près. Voir `site.ts`. */}
            {avertissements.map((texte) => (
              <p key={texte} className="max-w-5xl text-pretty">
                {texte}
              </p>
            ))}

            {/* Les mentions, juste au-dessus du copyright et au même fer.

              Elles étaient dans la carte, à droite de la rangée des réseaux.
              Rémy les a descendues ici : ce sont des textes de même nature que
              l'avertissement, et les séparer revenait à dire que l'un se lit et
              l'autre se clique. Même corps, même couleur, même bord gauche. */}
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
