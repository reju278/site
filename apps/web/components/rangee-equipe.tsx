import { equipeImmersion } from "@/contenu/immersion";
import { prenom } from "@/lib/prenom";
import Image from "next/image";

/**
 * L'équipe, en rang de portraits ronds.
 *
 * **Sur demande de Rémy, et c'est la deuxième forme de cette section.** Elle
 * était une carte par ligne, un annuaire : le visage à gauche, le nom et le
 * rôle à côté. Il l'a trouvée trop lourde et a demandé « un truc plus simple,
 * la photo en rond, alignée horizontalement, le nom en dessous, tout
 * simplement ». Quatre personnes ne demandent pas quatre cartes : un rang de
 * visages se lit d'un coup d'œil, là où une pile de cartes se parcourt.
 *
 * **Les rôles ne s'affichent plus** : voir `contenu/immersion.ts`.
 *
 * **Le portrait est rond**, comme partout sur le site : c'est la seule
 * exception que la règle des 5 px autorise.
 *
 * **Une personne sans portrait porte son initiale**, pas une silhouette
 * générique ni un trou dans le rang. Le rond garde sa taille, donc le peigne
 * tient même quand une photo manque.
 *
 * **Le rang s'enroule au lieu de défiler.** `flex-wrap` et non un défilement
 * horizontal : les visages tiennent sur deux lignes à 375 px, et ce que le
 * dépôt interdit, c'est qu'une page défile latéralement.
 */
export function RangeeEquipe() {
  return (
    <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-8 sm:gap-x-12">
      {equipeImmersion.membres.map((membre) => (
        <li key={membre.nom} className="flex w-24 flex-col items-center gap-3">
          {membre.photo ? (
            /* `width` et `height` déclarés même si la taille finale vient du
               CSS : sans eux, le navigateur ne réserve pas la place et la page
               saute au chargement. */
            <Image
              src={membre.photo}
              alt={`Portrait de ${prenom(membre.nom)}`}
              width={192}
              height={192}
              loading="lazy"
              className="size-20 rounded-full object-cover sm:size-24"
            />
          ) : (
            /* `aria-hidden` : l'initiale ne dit rien que le nom juste en
               dessous ne dise déjà, et la faire lire donnerait « R, Rémy ». */
            <span
              aria-hidden
              className="flex size-20 items-center justify-center rounded-full bg-accent text-xl font-semibold text-muted-foreground sm:size-24"
            >
              {prenom(membre.nom).slice(0, 1)}
            </span>
          )}

          {/* Le prénom seul, sur décision de Rémy. Voir `lib/prenom.ts`. */}
          <p className="text-center text-sm font-semibold text-balance text-foreground">
            {prenom(membre.nom)}
          </p>
        </li>
      ))}
    </ul>
  );
}
