import { Apparition } from "@/components/apparition";
import { MurDepliable } from "@/components/mur-depliable";
import { murCommunaute } from "@/contenu/communaute";
import { TitreRoulant } from "@/components/titre-roulant";
import { insecables } from "@/lib/typographie";
import { anonymiser } from "@/lib/anonymat";
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
  /* **Les deux premiers posts ouvrent les deux colonnes**, dans l'ordre du
     fichier, sur décision de Rémy : François en haut à gauche, Judith en haut à
     droite. Ce sont les deux récits les plus longs et les plus forts, et ce sont
     eux qu'on doit voir avant de faire défiler.

     Les suivants vont dans la colonne la plus courte. La hauteur est estimée au
     nombre de paragraphes : c'est grossier, mais c'est la seule mesure dont on
     dispose côté serveur, et ça suffit à ne pas empiler les deux plus longs du
     même côté. Une alternance un sur deux, elle, ne regarde pas les hauteurs. */
  const gauche: (typeof murCommunaute)[number][] = [];
  const droite: (typeof murCommunaute)[number][] = [];
  let poidsGauche = 0;
  let poidsDroite = 0;

  murCommunaute.forEach((avis, rang) => {
    const aGauche = rang === 0 || (rang !== 1 && poidsGauche <= poidsDroite);
    if (aGauche) {
      gauche.push(avis);
      poidsGauche += avis.paragraphes.length;
    } else {
      droite.push(avis);
      poidsDroite += avis.paragraphes.length;
    }
  });

  const colonnes = [gauche, droite];

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

      {/* Le mur, en **deux colonnes réelles** et non en `columns` CSS.

          C'est la réparation d'un vrai défaut, et il ne se voyait qu'une fois le
          repli en place : `columns` doit répartir son contenu dans une boîte de
          hauteur bornée, donc une carte plus haute que cette boîte est
          **coupée**, et la suite du post de Lilian se retrouvait en haut de la
          colonne voisine. `break-inside-avoid` n'y peut rien : le navigateur
          n'a pas le choix. Nos cartes portent des posts entiers, dont un de
          quarante-cinq paragraphes ; elles dépassent forcément.

          Deux colonnes posées à la main règlent le problème : chaque colonne
          est un flux ordinaire, une carte n'y est jamais scindée, et le décalage
          entre les deux vient de ce qu'elles ne portent pas les mêmes hauteurs.

          La répartition est **gloutonne et non alternée** : on pose chaque carte
          dans la colonne la plus courte, mesurée en paragraphes. Une alternance
          un sur deux mettrait les deux plus longs posts du même côté et
          donnerait une colonne deux fois plus haute que l'autre.

          Les cartes sont rendues ici, côté serveur, et passées en enfants à
          `MurDepliable`, qui ne tient que l'état ouvert ou fermé : les douze
          posts entiers ne partent pas dans le paquet JavaScript. */}
      {/* Le mur est replié en hauteur et fondu par le bas, pas tronqué dans sa
          liste : voir `MurDepliable`. La hauteur et le pas sont passés ici
          parce que c'est le mur qui sait ce qu'il montre, pas le composant qui
          le replie.

          **Le pas est mesuré.** Le mur déplié fait dix-sept mille pixels ; à
          neuf cents pixels par clic, il fallait trente-neuf clics pour en voir
          le bout, soit un post par clic. À mille huit cents, il en faut une
          dizaine, et chaque clic découvre quatre ou cinq posts. C'est ce que
          Rémy demande : plusieurs appuis, pas une page qui s'ouvre d'un
          coup. */}
      <div className="mt-12">
      <MurDepliable hauteur={760} pas={1800}>
        {colonnes.map((colonne, i) => (
          <div key={i} className="flex flex-1 flex-col gap-4">
            {colonne.map((avis) => (
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
          <Apparition key={avis.nom + avis.titre}>
          <figure
            /* Lu par `MurDepliable`, qui pose `inert` sur les cartes
               entièrement sous la ligne de coupe : sans ça, leurs dépliants de
               réponses restent atteignables à la tabulation alors qu'on ne les
               voit pas. Le repère est sur la carte et non sur l'`Apparition`
               qui l'enveloppe, celle-ci ne transmettant pas les attributs
               qu'on lui passe. */
            data-carte
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
            {/* Les guillemets sont posés ici et non dans la donnée, sur
                demande de Rémy : à les écrire dans le contenu, on finit avec des
                titres qui en ont et d'autres qui n'en ont pas. Ce sont les
                guillemets français, avec leurs espaces insécables : une espace
                ordinaire y autorise un retour à la ligne, et le guillemet se
                retrouve seul en fin de ligne. C'est la même règle que pour les
                citations des articles d'avis. */}
            <p className="titre text-lg text-balance text-foreground">
              {insecables(`« ${anonymiser(avis.titre)} »`)}
            </p>

            {/* Le post entier et non un extrait, sur demande de Rémy.

                `blockquote` avec ses paragraphes : c'est la parole de quelqu'un
                d'autre, et c'est cet élément qui le dit à un lecteur d'écran.

                **Le corps ne porte plus de guillemets** : ils sont passés sur
                le titre, qui est lui aussi une phrase de la personne. Les poser
                aux deux endroits aurait ouvert une citation dans une
                citation. */}
            <blockquote className="space-y-3 text-sm leading-relaxed text-pretty text-foreground/85">
              {avis.paragraphes.map((paragraphe, i) => (
                <p key={paragraphe}>
                  {surligner(anonymiser(paragraphe), avis.surligne)}
                </p>
              ))}
            </blockquote>
          </figure>
          </Apparition>
            ))}
          </div>
        ))}
      </MurDepliable>
      </div>
    </div>
  );
}
