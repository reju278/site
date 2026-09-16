import { Apparition } from "@/components/apparition";
import { ContenuEntretien } from "@/components/contenu-entretien";
import { ModaleAvis } from "@/components/modale-avis";
import { temoignagesImmersion } from "@/contenu/immersion";
import { avisDe } from "@/contenu/avis";
import { sansNoms } from "@/lib/anonymat";
import { insecables } from "@/lib/typographie";
import { prenom } from "@/lib/prenom";
import Image from "next/image";

/**
 * Les trois cartes de témoignage court, dans le hero.
 *
 * **Le dessin est relevé sur trendtrack.io, pas approché**, sur demande de
 * Rémy, qui a fourni la carte `hero_review__card` et sa feuille de style. Les
 * valeurs viennent de là :
 *
 * - **Fond blanc à quatre pour cent**, leur `color(srgb 1 1 1 / 0.04)`.
 * - **Aucune bordure.** Leur `border-width` vaut zéro, et c'était le piège de
 *   ce relevé : le liseré lumineux qu'on voit sur leur carte n'est pas un
 *   filet, ce sont trois ombres **intérieures**. Une bordure aurait cerné la
 *   carte là où ces ombres la creusent, et le rendu n'aurait pas été le même.
 * - **Rayon de 25 px**, leur `border-radius: 25.06px`.
 * - **Rembourrage de 20 px sur 18**, leurs 19,69 et 17,90.
 * - **`justify-between`**, qui pousse la ligne du résultat en bas.
 * - **La citation à 0,9375 em** et en demi-gras, comme leur `p_wrap`.
 * - **Le métier sur une ligne**, leur `u-text-clamp-1`.
 *
 * **Le relief est déjà chez nous.** Leur `--sh-glass` est le jeton
 * `--ombre-verre` de `globals.css`, posé par l'utilitaire `relief-verre` : un
 * filet en haut, un halo très large, un halo court. `AGENTS.md` le décrit déjà,
 * pour le panneau des menus relevé chez eux. On ne le réécrit donc pas.
 *
 * **Le rayon de 25 px est une quatrième exception à la règle des 5 px**, et
 * elle est écrite dans `AGENTS.md` comme les trois du panneau de menu. Elle ne
 * s'étend à rien d'autre.
 *
 * **La seule adaptation est la couleur, et elle était obligatoire.** Leur site
 * n'a qu'un thème sombre : le fond de leur carte est un blanc à quatre pour
 * cent, qui ne se verrait pas sur notre page claire. Il passe donc par
 * `color-mix(in srgb, currentColor 4%, transparent)`, qui donne du clair sur le
 * sombre et du sombre sur le clair sans qu'on écrive deux valeurs. C'est déjà
 * l'adaptation faite pour leur panneau de menus, et elle est dans `AGENTS.md`.
 *
 * Les cartes se posent sur la couleur de page, sous la jonction, et non sur la
 * photographie : la vidéo reste à cheval sur la jonction, les trois clients
 * viennent en dessous d'elle. Un blanc en dur y serait invisible en thème
 * clair.
 *
 * **Ce qui n'a pas pu être repris, et pourquoi.** Leur carte porte une pastille
 * de logo d'entreprise en bas à droite du portrait. Roland, Valérie et
 * Christian n'ont pas de logo dans ce dépôt, et en fabriquer un serait inventer
 * la marque de quelqu'un. La pastille est donc absente tant que les trois
 * fichiers n'existent pas.
 */
export function CartesTemoignage() {
  return (
    <ul /* Pas de marge haute : l'écart avec la vidéo est tenu par le
         rembourrage de la section, à un seul endroit. Les deux s'ajoutaient. */
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {temoignagesImmersion.map((personne, rang) => {
        const article = avisDe(personne.id);

        return (
        <li key={personne.id} className="h-full">
          {/* **Elles montent à l'entrée dans la vue**, comme les cartes du mur
              et les titres de section, sur demande de Rémy.

              Le décalage est de quatre-vingts millisecondes par carte : elles
              se suivent au lieu d'arriver ensemble, ce qui se lit comme une
              rangée qui se pose plutôt que comme un bloc qui apparaît. Trois
              cartes d'un coup, c'est un clignotement.

              `h-full` sur l'`Apparition` : sans lui, le conteneur qu'elle
              ajoute casserait l'égalisation des hauteurs de la grille, et les
              lignes du résultat cesseraient de s'aligner. */}
          <Apparition delai={rang * 80} className="h-full">
          {/* **La carte ouvre l'entretien dans une fenêtre**, sur demande de
              Rémy, comme les cartes de la galerie. Elle renvoyait à l'ancre du
              lecteur, plus bas : on arrivait sur la bonne carte mais il fallait
              cliquer une seconde fois.

              Le contenu vient de `ContenuEntretien`, le même composant que la
              galerie : le texte n'existe qu'une fois en code.

              Un `button` et non un lien : ça n'emmène nulle part, ça ouvre une
              fenêtre. Et la carte entière est la cible, donc pas de bouton à
              l'intérieur, ce serait une cible dans une cible. */}
          <ModaleAvis
            titre={`Entretien avec ${prenom(personne.nom)}`}
            description={article ? sansNoms(article.chapo) : personne.citation}
            declencheur={
          <button
            type="button"
            style={{
              /* Leur `color(srgb 1 1 1 / 0.04)`, rendu aux deux thèmes.
                 `color-mix` sur `currentColor` donne du clair sur le sombre et
                 du sombre sur le clair sans qu'on écrive deux valeurs : c'est
                 déjà l'adaptation faite pour le panneau des menus relevé chez
                 eux, et elle est écrite dans `AGENTS.md`. */
              backgroundColor:
                "color-mix(in srgb, currentColor 4%, transparent)",
            }}
            className="relief-verre flex h-full flex-col justify-between rounded-[25px] px-[18px] py-5 text-foreground transition-colors hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {/* `rounded-full` sur une photo de profil : la seule exception
                    que la règle des 5 px autorise depuis toujours. */}
                <Image
                  src={personne.portrait}
                  alt={`Portrait de ${prenom(personne.nom)}`}
                  width={176}
                  height={176}
                  loading="lazy"
                  className="size-11 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="font-medium">{prenom(personne.nom)}</p>
                  {/* Une seule ligne, comme leur `u-text-clamp-1` : dans une
                      rangée de trois, un métier qui passe à deux lignes décale
                      la citation de sa voisine et le peigne est perdu.
                      `text-white/50`, leur `text-a50`. */}
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {personne.metier}
                  </p>
                </div>
              </div>

              {/* Les guillemets français sont dans le contenu, et `insecables`
                  y pose l'espace qui va avec : sans elle, un « peut finir seul
                  en bout de ligne. */}
              <blockquote className="text-[0.9375em] leading-relaxed font-medium text-pretty">
                {insecables(`« ${personne.citation} »`)}
              </blockquote>
            </div>

            {/* La ligne du résultat, leur `hero_review__data` : le chiffre en
                gros, sa légende en petit et atténuée, sur la même ligne et
                calés sur la même base.

                **Le `pt-6` n'est pas un `mt-*`.** Le bloc est déjà poussé en
                bas par `justify-between` ; une marge haute automatique entrerait
                en conflit avec elle, et c'est la règle que le dépôt écrit déjà
                pour `mt-auto`.

                Le chiffre et sa légende viennent de l'accroche déjà relue dans
                `temoignages`, coupée en deux dans `contenu/immersion.ts` et
                jamais réécrite : ce sont les mots de Rémy, et chaque chiffre
                qu'ils portent est prononcé dans l'entretien. */}
            <p className="flex items-baseline gap-2 pt-6">
              <span className="titre text-2xl tracking-tight sm:text-3xl">
                {insecables(personne.chiffre)}
              </span>
              <span className="text-sm text-muted-foreground">
                {insecables(personne.legende)}
              </span>
            </p>
          </button>
            }
          >
            <ContenuEntretien id={personne.id} />
          </ModaleAvis>
          </Apparition>
        </li>
        );
      })}
    </ul>
  );
}
