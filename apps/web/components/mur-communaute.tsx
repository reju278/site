import { Apparition } from "@/components/apparition";
import { MurDepliable } from "@/components/mur-depliable";
import { murCommunaute } from "@/contenu/communaute";
import { TitreRoulant } from "@/components/titre-roulant";
import { insecables } from "@/lib/typographie";
import { prenom } from "@/lib/prenom";
import { titreResultats } from "@/contenu/site";
import Image from "next/image";

/**
 * Le mur de la communauté, relevé sur la section « Wall of love » de
 * trendtrack.io, fournie par Rémy avec sa feuille de style.
 *
 * Ce qui vient d'eux, au caractère près :
 *
 * - **L'étiquette entre crochets**, ses crochets colorés et son libellé en
 *   capitales atténué. Chez eux `text-green-dk` et `text-a73` ; chez nous le
 *   vert du site, `--icone-resultats`, et `text-muted-foreground`.
 * - **Le titre centré et équilibré**, leur `u-text-balance`.
 * - **Le chapô à 60 caractères de large**, leur `max-width: 60ch`, qui est la
 *   bonne largeur de lecture et non un chiffre choisi au hasard.
 * - **L'écart de 16 px** entre l'étiquette, le titre et le chapô, leur
 *   `gap-16`.
 * - **Le rembourrage de la section**, leurs 71,6 px sur 35,8, soit 5 em sur
 *   2,5 à leur corps de texte.
 * - **La carte** : même famille que celle des avis du hero, fond à quatre pour
 *   cent, rayon de 25 px, aucune bordure, le relief venant des trois ombres
 *   intérieures.
 *
 * **Deux colonnes et non trois, sur demande de Rémy.** Leur mur en a trois et
 * porte des phrases ; le nôtre porte des posts entiers, dont un de quarante-cinq
 * paragraphes. À trois colonnes, chaque carte deviendrait une colonne de texte
 * de trente caractères de large.
 *
 * **Le mur coule en colonnes et non en grille.** `columns` laisse chaque carte
 * à sa hauteur et remplit la colonne la plus courte : c'est ce qui donne le
 * décalage du relevé. Une grille alignerait les rangées et rendrait toutes les
 * cartes d'une même ligne aussi hautes que la plus longue, ce qui creuse du
 * vide sous les courtes.
 *
 * **Ni étoiles ni compte de réactions**, voir `contenu/communaute.ts`. La carte
 * s'ouvre sur son auteur, puis sur un extrait qui lui sert de titre, puis sur le
 * post entier : c'est l'ordre d'un post, et c'est ce que Rémy a demandé.
 *
 * **Le titre est celui de l'accueil**, `titreResultats`, et non une variante
 * écrite pour l'occasion : « De vraies personnes. De vrais résultats. » est de
 * Rémy, déjà relu, et dit exactement ce que ce mur montre. Reprendre le
 * « Ils adorent, pourquoi pas vous ? » de TrendTrack aurait été recopier le
 * texte commercial d'une autre société sur le nôtre.
 */

/** Le fond de carte relevé chez eux, rendu aux deux thèmes. */
const FOND = "color-mix(in srgb, currentColor 4%, transparent)";

/**
 * Le trait de surligneur, comme sur les articles d'avis.
 *
 * **Il enveloppe, il ne réécrit pas.** Chaque passage de `surligne` est une
 * sous-chaîne exacte du post, vérifiée contre la source : la fonction la
 * retrouve et pose un `mark` autour, sans toucher à un seul caractère. Un
 * passage qui ne se retrouverait pas laisserait simplement le paragraphe
 * intact, plutôt que d'en perdre un bout.
 *
 * `mark` et non un `span` : c'est l'élément du surlignage, et c'est lui qui dit
 * à un lecteur d'écran que ce passage est mis en avant.
 *
 * Le jaune est `--surlignage-jaune` à 32 %, la même teinte et la même densité
 * que les voies du message de Rémy. Ce n'est pas une couleur de plus : c'est
 * celle que le site emploie déjà pour « regardez ça ».
 *
 * L'animation, elle, vit dans `globals.css` : le fond est une image tirée de
 * gauche à droite quand le bloc entre dans la vue. Elle a besoin d'un ancêtre
 * `data-apparition`, d'où l'`Apparition` autour de chaque carte.
 */
function surligner(texte: string, passages: readonly string[]) {
  /* On coupe sur chaque passage, dans l'ordre où il apparaît. `reduce` sur les
     morceaux et non une expression rationnelle : les passages portent des
     apostrophes, des accents et des chiffres, et les échapper un par un pour
     construire un motif serait une occasion de plus de se tromper. */
  let morceaux: (string | { marque: string })[] = [texte];

  for (const passage of passages) {
    morceaux = morceaux.flatMap((m) => {
      if (typeof m !== "string") return [m];
      const i = m.indexOf(passage);
      if (i === -1) return [m];
      return [
        m.slice(0, i),
        { marque: passage },
        m.slice(i + passage.length),
      ];
    });
  }

  return morceaux.map((m, i) =>
    typeof m === "string" ? (
      <span key={i}>{insecables(m)}</span>
    ) : (
      <mark
        key={i}
        className="surlignage"
        style={
          {
            "--surlignage-fond":
              "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)",
          } as React.CSSProperties
        }
      >
        {insecables(m.marque)}
      </mark>
    ),
  );
}

export function MurCommunaute() {
  return (
    /* Leurs 71,6 px sur 35,8, arrondis à l'échelle du projet. */
    <div className="px-5 py-16 sm:py-20">
      {/* Leur `gap-16` entre l'étiquette, le titre et le chapô. */}
      <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
        {/* L'étiquette entre crochets. Les crochets sont `aria-hidden` : ils
            sont un signe de mise en page, et un lecteur d'écran annoncerait
            « crochet ouvrant, communauté, crochet fermant ». */}
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          <span aria-hidden style={{ color: "var(--icone-resultats)" }}>
            [
          </span>
          Le groupe Funnels Club
          <span aria-hidden style={{ color: "var(--icone-resultats)" }}>
            ]
          </span>
        </p>

        <TitreRoulant
          as="h2"
          segments={titreResultats}
          className="titre text-3xl text-balance text-foreground sm:text-4xl"
        />

        {/* Leur `max-width: 60ch` : c'est la largeur de lecture, et elle se
            mesure en caractères parce qu'elle suit le corps du texte. */}
        <p className="mx-auto max-w-[60ch] text-pretty text-muted-foreground">
          Ce que les membres écrivent dans le groupe, sans qu&apos;on le leur
          demande. Les posts sont recopiés en entier, sans un mot changé.
        </p>
      </div>

      {/* Le mur. `columns` et non `grid` : chaque carte garde sa hauteur, et
          c'est ce décalage qui fait le mur. `break-inside-avoid` empêche une
          carte d'être coupée en deux d'une colonne à l'autre, ce qui est le
          seul vrai piège de cette mise en page.

          Les cartes sont rendues ici, côté serveur, et passées en enfants à
          `MurDepliable`, qui ne tient que l'état ouvert ou fermé : les douze
          posts entiers ne partent pas dans le paquet JavaScript. */}
      <MurDepliable premieres={6}>
        {murCommunaute.map((avis) => (
          /* **La carte n'est pas un lien**, sur demande de Rémy. Elle
             renvoyait au post d'origine ; le groupe étant privé, un visiteur
             non membre atterrissait sur la page de connexion de Circle,
             c'est-à-dire hors du tunnel et dans une impasse. Vérifié, pas
             supposé : un clic de test a bien abouti sur `login.circle.so`. */
          /* `Apparition` n'est pas là pour l'entrée en fondu : c'est elle qui
             pose `data-apparition` et `data-vu`, que la règle du surlignage
             attend dans `globals.css` pour tirer le trait de surligneur quand
             la carte entre dans la vue. Sans elle, le fond reste plein, ce qui
             est le bon repli mais pas l'effet demandé. */
          <Apparition
            key={avis.nom + avis.titre}
            className="mb-4 break-inside-avoid"
          >
          <figure
            style={{ backgroundColor: FOND }}
            className="relief-verre flex flex-col gap-4 rounded-[25px] px-[18px] py-5"
          >
            {/* **L'auteur est en haut à gauche**, sur demande de Rémy : on sait
                qui parle avant de lire, ce qui est l'inverse de la carte
                relevée, où le nom ferme le bloc. C'est ce que fait un post :
                une signature en tête. */}
            <figcaption className="flex items-center gap-3">
              {avis.portrait ? (
                <Image
                  src={avis.portrait}
                  alt={`Portrait de ${prenom(avis.nom)}`}
                  width={200}
                  height={200}
                  loading="lazy"
                  className="size-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                /* `aria-hidden` : l'initiale ne dit rien que le nom juste à
                   côté ne dise déjà. */
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-muted-foreground"
                >
                  {prenom(avis.nom).slice(0, 1)}
                </span>
              )}

              <span className="min-w-0">
                {/* Le prénom seul, sur décision de Rémy. Voir `lib/prenom.ts` :
                    c'est l'affichage qui coupe, la donnée garde le nom entier. */}
                <span className="block text-sm font-medium text-foreground">
                  {prenom(avis.nom)}
                </span>
                {/* Le métier, lu dans le profil Circle. Rien quand il est vide :
                    une ligne blanche sous un nom est un défaut, un métier
                    deviné est un mensonge. Sur une ligne, comme leur
                    `u-text-clamp-1`. */}
                {avis.niche ? (
                  <span className="line-clamp-1 text-sm text-muted-foreground">
                    {insecables(avis.niche)}
                  </span>
                ) : null}
              </span>
            </figcaption>

            {/* Le titre : une phrase du post, recopiée. Il donne envie de lire
                le reste, et il n'est pas un résumé. Voir `contenu/communaute.ts`.

                `p` et non un `h3` : le mur porte déjà son `h2`, et douze titres
                de carte dans le plan annonceraient douze sujets. */}
            <p className="titre text-lg text-balance text-foreground">
              {insecables(avis.titre)}
            </p>

            {/* Le post entier et non un extrait, sur demande de Rémy.

                `blockquote` avec ses paragraphes : c'est la parole de quelqu'un
                d'autre, et c'est cet élément qui le dit à un lecteur d'écran.

                Les guillemets français ouvrent le premier paragraphe et ferment
                le dernier, comme en typographie, et non chacun d'eux. */}
            <blockquote className="space-y-3 text-sm leading-relaxed text-pretty text-foreground/85">
              {avis.paragraphes.map((paragraphe, i) => (
                <p key={paragraphe}>
                  {surligner(
                    (i === 0 ? "« " : "") +
                      paragraphe +
                      (i === avis.paragraphes.length - 1 ? " »" : ""),
                    avis.surligne,
                  )}
                </p>
              ))}
            </blockquote>
          </figure>
          </Apparition>
        ))}
      </MurDepliable>
    </div>
  );
}
