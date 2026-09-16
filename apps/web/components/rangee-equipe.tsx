import { Emplacement } from "@/components/section";
import { equipeImmersion } from "@/contenu/immersion";
import { prenom } from "@/lib/prenom";
import Image from "next/image";

/**
 * L'équipe, une personne par ligne.
 *
 * **Sur demande de Rémy : une carte membre sur une seule ligne**, et non la
 * grille de portraits empilés de la page source. C'est ce qui change tout à la
 * lecture : dans une grille, on voit cinq visages et on cherche ensuite qui
 * fait quoi ; sur une ligne, le nom et le rôle sont à côté du visage, à la
 * hauteur de l'œil, et la rangée se lit comme un annuaire.
 *
 * **Rémy voulait s'inspirer de ReUI. Le registre est fermé.** Il répond 401,
 * « Authentication required », sur toutes ses adresses, y compris la variante
 * `radix-nova` : c'est ce qu'annonce `AGENTS.md`, et je l'ai vérifié plutôt que
 * de le supposer. Tant qu'il n'y a pas de clé de licence, on ne peut rien y
 * installer, et la carte est donc écrite avec les briques du dépôt : la carte
 * du site, son filet, son relief de verre et son rayon de 5 px.
 *
 * **Le portrait est rond**, comme partout sur le site : c'est la seule
 * exception que la règle des 5 px autorise.
 *
 * **Une personne sans portrait porte son initiale**, pas une silhouette
 * générique ni un trou dans la rangée. Le rond garde sa taille, donc les cinq
 * lignes gardent la même hauteur : c'est ce qui empêche une carte incomplète de
 * casser le peigne.
 */
export function RangeeEquipe() {
  return (
    <>
      {/* `max-w-2xl` : une ligne de carte qui fait toute la largeur d'un grand
          écran laisse un nom de vingt caractères seul devant huit cents pixels
          de vide. Les cartes sont larges d'une colonne de lecture, pas de la
          page. */}
      <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
        {equipeImmersion.membres.map((membre) => (
          <li
            key={membre.nom}
            className="relief-verre flex items-center gap-4 rounded-md border border-border bg-card px-5 py-4"
          >
            {membre.photo ? (
              /* `width` et `height` déclarés même si la taille finale vient du
                 CSS : sans eux, le navigateur ne réserve pas la place et la
                 page saute au chargement. */
              <Image
                src={membre.photo}
                alt={`Portrait de ${prenom(membre.nom)}`}
                width={128}
                height={128}
                loading="lazy"
                className="size-14 shrink-0 rounded-full object-cover"
              />
            ) : (
              /* `aria-hidden` : l'initiale ne dit rien que le nom juste à côté
                 ne dise déjà, et la faire lire donnerait « F, Fabri ». */
              <span
                aria-hidden
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-muted-foreground"
              >
                {prenom(membre.nom).slice(0, 1)}
              </span>
            )}

            <div className="min-w-0">
              {/* Le prénom seul, sur décision de Rémy. Voir `lib/prenom.ts`. */}
              <p className="text-base font-semibold text-foreground">
                {prenom(membre.nom)}
              </p>
              {/* Pas de ligne vide quand le rôle manque : une carte sans rôle
                  reste une carte, une carte avec une ligne vide est un défaut
                  qu'on voit et qu'on ne sait pas nommer. */}
              {membre.role ? (
                <p className="text-sm text-muted-foreground">{membre.role}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {/* Ce qui manque s'affiche, visiblement, plutôt que de s'inventer. Le
          site ne part pas en production tant qu'il reste un emplacement. */}
      <Emplacement
        attendu={equipeImmersion.manquant}
        className="mx-auto mt-6 max-w-2xl"
      />
    </>
  );
}
