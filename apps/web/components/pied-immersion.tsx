import { LogoFunnels } from "@/components/logo-funnels";
import { TexteRoulant } from "@/components/texte-roulant";
import { appelHub, avertissementHub } from "@/contenu/hub";
import { identite } from "@/contenu/site";

/**
 * Le pied de page de la page d'immersion.
 *
 * C'est celui du hub dans sa forme, et pour la même raison : une page de
 * tunnel n'a pas de carte du site à tenir, donc pas de colonnes de liens. Une
 * seule carte d'offre, l'appel, puis ce qui est légal.
 *
 * **Pas de rangée de réseaux.** Cinq pastilles sont cinq portes de sortie, et
 * c'est déjà la règle du hub.
 *
 * **L'avertissement et le libellé de l'appel sont ceux du hub**, repris et non
 * réécrits. Ils ne parlent pas du hub mais du programme et des personnes qui
 * témoignent : les redire ici en d'autres termes créerait deux versions d'un
 * texte qui engage la société, et c'est exactement ce qu'une seconde écriture
 * finit toujours par produire.
 *
 * **Les trois liens légaux sont la seule sortie tolérée**, comme sur le hub :
 * une page commerciale européenne sans accès à ses conditions et à sa politique
 * de confidentialité est moins conforme, pas plus. Ce sont des documents, et
 * ils portent déjà leur `robots: { index: false }`.
 */
export function PiedImmersion({
  entretiens,
}: {
  entretiens: readonly { ancre: string; nom: string }[];
}) {
  const annee = new Date().getFullYear();

  return (
    <footer className="relative isolate pb-5">
      {/* Le fond du deck. **Le fondu est en haut**, et c'est la position du
          bloc qui le décide : il y a du contenu au-dessus et plus rien en
          dessous, donc il s'allume par le haut et va jusqu'au bord. Les deux
          écritures du masque s'écrivent : Safari n'a levé son préfixe qu'en
          15.4. */}
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
        {/* Le relief de verre et l'ombre portée dans la même déclaration : deux
            `box-shadow` sur un même élément ne s'additionnent pas, le second
            remplace le premier. */}
        <div
          style={{
            boxShadow: "var(--ombre-verre), 0 18px 50px -30px rgba(0,0,0,0.35)",
          }}
          className="rounded-md border border-border bg-card px-6 py-8 sm:px-10 sm:py-10 lg:px-12"
        >
          <div>
            <div>
              {/* La marque, droite et non penchée : un nom de marque se pose
                  droit. `href="#haut"` et non `/`, qui serait une sortie. */}
              <a
                href="#haut"
                className="titre flex items-center gap-2 text-2xl tracking-tight text-foreground sm:text-3xl"
              >
                <LogoFunnels className="size-[1.05em]" />
                Funnels.Club
              </a>

              <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-muted-foreground">
                {appelHub.texte}
              </p>

              {/* Les entretiens, à la place des colonnes de liens du site,
                  comme dans le pied de page du hub.

                  **Ils pointent vers les lecteurs de cette page et non vers
                  `/resultats`.** C'est la règle du tunnel : chaque nom renvoie
                  à l'ancre de son lecteur, plus haut, donc on reste dedans. Le
                  hub, lui, peut pointer vers `/hub/<nom>`, parce que chacun y a
                  sa page ; ici les entretiens se regardent sur place.

                  Un seul titre au-dessus des colonnes et non un titre par
                  colonne : ce sont les entrées d'une même liste, et les
                  répartir sous des intitulés inventés leur fabriquerait des
                  catégories qui n'existent pas.

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
                    <li key={entretien.ancre}>
                      <a
                        href={`#${entretien.ancre}`}
                        className="group/roule inline-block rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <TexteRoulant>{entretien.nom}</TexteRoulant>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

            </div>
          </div>
        </div>

        {/* Sous la carte : l'avertissement, les mentions, le copyright.

            Ferrés à gauche et alignés sur le bord de la carte, sans rembourrage
            à eux : deux alignements voisins qui ne coïncident pas se voient
            tout de suite. Pas de filet de séparation, la carte ayant déjà son
            bord, son ombre et sa couleur. */}
        <div className="pt-8 pb-8">
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-muted-foreground">
            <p className="max-w-5xl text-pretty">{avertissementHub}</p>

            <p>
              © {annee} {identite.societe}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
