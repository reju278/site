import { anonymiser } from "@/lib/anonymat";
import { insecables } from "@/lib/typographie";
import { prenom } from "@/lib/prenom";
import { MessageCircle } from "lucide-react";

/**
 * Les réponses des autres membres, repliées sous un post du mur.
 *
 * **Elles sont là pour montrer que le groupe répond**, sur demande de Rémy :
 * un témoignage seul dit qu'une personne a réussi ; le même témoignage suivi de
 * douze encouragements dit qu'il y a une communauté derrière. C'est ce qu'on ne
 * peut pas fabriquer.
 *
 * **`details` et `summary` natifs, pas d'état React.** Aucun JavaScript n'est
 * nécessaire, le pli s'ouvre au clavier comme à la souris, et le texte est dans
 * le document dès le premier octet. C'est le même choix que la transcription
 * des articles d'avis, et pour les mêmes raisons.
 *
 * `marker:` retire le triangle du navigateur, qui n'a pas la même forme d'un
 * navigateur à l'autre.
 *
 * **Les prénoms seuls, et les noms cités retirés du texte.** Deux règles
 * différentes qui se cumulent : `prenom` coupe le nom de l'auteur de la
 * réponse, `anonymiser` coupe ceux qu'il cite dans sa phrase et retire les
 * adresses. Voir `lib/anonymat.ts`.
 *
 * **Le compte est écrit**, parce qu'il est vrai et qu'il décide de l'envie
 * d'ouvrir : « 3 réponses » et « 83 réponses » ne racontent pas la même chose.
 * C'est la seule exception à la règle du dépôt sur les textes qui comptent
 * leurs éléments, et elle tient parce que le nombre est **calculé** et non
 * écrit dans une phrase.
 */
export function ReponsesPost({
  reponses,
}: {
  reponses: readonly { nom: string; texte: string }[];
}) {
  if (reponses.length === 0) return null;

  return (
    <details className="group/reponses border-t border-border/60 pt-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-muted-foreground transition-colors marker:hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <MessageCircle aria-hidden className="size-4 shrink-0" />
        Voir les {reponses.length} réponses
      </summary>

      <ul className="mt-4 space-y-3">
        {reponses.map((reponse, i) => (
          <li key={`${i}-${reponse.nom}`} className="text-sm leading-relaxed">
            <span className="font-medium text-foreground">
              {prenom(reponse.nom)}
            </span>{" "}
            <span className="text-pretty text-muted-foreground">
              {insecables(anonymiser(reponse.texte))}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
