import { ancreEntretien, temoignagesImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { insecables } from "@/lib/typographie";
import Image from "next/image";

/**
 * Les trois cartes de témoignage court, sous la vidéo de la plateforme.
 *
 * **L'organisation est relevée sur trendtrack.io**, sur demande de Rémy, à
 * partir de leur rangée d'avis : portrait rond à gauche, nom et métier
 * empilés à sa droite, la citation en dessous, et une ligne basse qui porte le
 * résultat en gros avec sa légende en petit. C'est cette dernière ligne qui
 * fait le travail : elle donne à trois citations de longueurs différentes un
 * même point de chute, et c'est ce qui les fait lire comme une rangée plutôt
 * que comme trois blocs voisins.
 *
 * **Ce qui n'est pas repris d'eux, c'est le dessin.** Leurs cartes sont des
 * panneaux de verre sur fond noir, avec le relief à trois ombres de leur
 * `--sh-glass`. Ici ce sont les cartes du site : `bg-card`, filet en
 * `border-border`, rayon de 5 px, et les deux thèmes. Le flou va derrière, et
 * une carte posée dans le flux d'une page n'a rien derrière elle à brouiller.
 *
 * **Le gros chiffre n'est pas écrit à la main.** Il vient de l'accroche déjà
 * relue dans `temoignages`, retrouvée par l'identifiant Wistia : la même phrase
 * que porte la carte de `/resultats` et l'affiche du carrousel d'accueil. Une
 * seconde écriture ici aurait divergé à la première correction, et ces lignes
 * annoncent les revenus de personnes réelles.
 *
 * Deux règles de grille appliquées telles quelles : `h-full` sur la carte pour
 * qu'elle occupe sa cellule, et `mt-auto` sur la ligne basse pour qu'elle
 * tombe au même endroit dans les trois. Sans elles, le résultat suivrait sa
 * citation et se retrouverait dix pixels plus haut d'une carte à l'autre.
 */
export function CartesTemoignage() {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
      {temoignagesImmersion.map((personne) => {
        /* L'accroche vient de `temoignages`, jamais d'ici. Si l'identifiant
           n'y est plus, la ligne basse disparaît au lieu d'afficher un vide :
           une carte sans résultat reste une carte, une carte avec une ligne
           vide est un défaut. */
        const resultat = temoignages.find((t) => t.id === personne.id)
          ?.description;

        return (
          <li key={personne.id} className="h-full">
            {/* **La carte mène au lecteur de la personne, plus bas sur cette
                page, et non à `/resultats`.** C'est la règle du tunnel : cette
                page est fermée, et un lien vers le site rendrait au visiteur
                l'en-tête complet et ses trente portes de sortie. Les trois
                personnes citées ici ont toutes leur entretien dans la section
                des avis, donc l'ancre existe ; `ancreEntretien` est la seule
                écriture de son nom, partagée avec le pied de page. */}
            <a
              href={`#${ancreEntretien(personne.id)}`}
              /* La carte entière est la cible, donc pas de bouton à
                 l'intérieur : ce serait dessiner une cible dans une cible.
                 Et c'est un lien et non un bouton, parce que ça navigue. */
              className="group flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex items-center gap-3">
                {/* `rounded-full` sur une photo de profil : c'est la seule
                    exception que la règle des 5 px autorise. */}
                <Image
                  src={personne.portrait}
                  alt={`Portrait de ${personne.nom}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {personne.nom}
                  </p>
                  {/* Une ligne, comme leur `u-text-clamp-1` : dans une rangée
                      de trois, un métier qui passe à deux lignes décale la
                      citation de sa voisine et le peigne est perdu. */}
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {personne.metier}
                  </p>
                </div>
              </div>

              {/* Les guillemets français sont dans le contenu, et `insecables` y
                  pose l'espace insécable qui va avec : sans elle, un « peut
                  finir seul en bout de ligne. */}
              <blockquote className="mt-5 text-pretty text-foreground/90">
                {insecables(`« ${personne.citation} »`)}
              </blockquote>

              {resultat ? (
                <p className="mt-auto pt-6 text-sm text-muted-foreground">
                  {insecables(resultat)}
                </p>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
