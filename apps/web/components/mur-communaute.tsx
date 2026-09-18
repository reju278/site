import { Apparition } from "@/components/apparition";
import { LogoFunnels } from "@/components/logo-funnels";
import { MurDepliable } from "@/components/mur-depliable";
import {
  PLACES_PORTRAITS,
  PortraitsFlottants,
} from "@/components/portraits-flottants";
import { murCommunaute } from "@/contenu/communaute";
import { TitreRoulant } from "@/components/titre-roulant";
import { insecables } from "@/lib/typographie";
import { anonymiser } from "@/lib/anonymat";
import { prenom } from "@/lib/prenom";
import { surligner } from "@/lib/surligner";
import { titreCommunaute } from "@/contenu/immersion";
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
 * **Le titre est à lui, `titreCommunaute`, et c'est une correction.** Il
 * reprenait celui de l'accueil, « De vraies personnes. De vrais résultats. »,
 * ce qui était défendable tant que le mur passait pour une preuve de résultats.
 * Rémy a demandé qu'il dise le côté communautaire, et cette phrase-là sert
 * aussi à la section des avis de l'accueil : la changer là-bas aurait touché une
 * page qu'il n'a pas demandé de modifier. Un titre par endroit.
 *
 * Reprendre le « Ils adorent, pourquoi pas vous ? » de TrendTrack aurait été
 * recopier le texte commercial d'une autre société sur le nôtre : le titre et
 * le chapô sont de Rémy, dictés.
 */

/** Le fond de carte relevé chez eux, rendu aux deux thèmes. */
const FOND = "color-mix(in srgb, currentColor 4%, transparent)";

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

  /* Les portraits qui entourent le titre : ceux des membres dont les posts sont
     juste en dessous, pris dans l'ordre du mur, qui va du résultat le plus
     exceptionnel au simple mot de gratitude. Dédoublonnés, parce qu'une même
     personne peut y revenir plusieurs fois et qu'on ne veut pas deux fois le
     même visage. */
  const portraits: { src: string; alt: string }[] = [];
  for (const avis of murCommunaute) {
    if (!avis.portrait) continue;
    if (portraits.some((p) => p.src === avis.portrait)) continue;
    /* **`alt` vide, et c'est décidé.** Ces visages sont une preuve, pas une
       information : les mêmes personnes sont nommées, portraiturées et citées
       en entier dans le mur juste en dessous. Un prénom par portrait ferait
       annoncer onze prénoms hors contexte avant même le titre de la section.
       Un `alt` absent serait un défaut ; celui-ci est assumé. */
    portraits.push({ src: avis.portrait, alt: "" });
    if (portraits.length === PLACES_PORTRAITS) break;
  }

  return (
    /* Leurs 71,6 px sur 35,8, arrondis à l'échelle du projet.

       Le rembourrage vertical est celui de 21st.dev, `py-32 sm:py-40`, et il
       est porté par `PortraitsFlottants` : c'est lui qui donne aux portraits la
       place de se poser autour du titre sans lui passer dessus.

       L'espace **autour** du bloc, lui, est à nous : sur demande de Rémy, le
       haut et le bas ont été desserrés pour que les portraits ne touchent ni la
       section précédente ni la première carte du mur. Il se pose ici et non sur
       la section : le rembourrage de la section est ce qui place les portraits,
       et l'augmenter les aurait écartés du titre au lieu d'écarter le bloc de
       ses voisins. */
    <div className="px-5 pt-16 pb-0 sm:pt-24">
      <PortraitsFlottants
        portraits={portraits}
        /* Le bas de la section est resserré, sur demande de Rémy : depuis que
           plus aucun portrait ne se pose sous le titre, le rembourrage de
           21st.dev n'y dégage plus rien et ne fait qu'éloigner le premier
           post. Le haut garde le leur, qui porte encore les portraits. */
        className="pb-8 sm:pb-10"
      >
      {/* Leur `gap-16` entre le titre et le chapô.

          **L'étiquette entre crochets est partie**, sur demande de Rémy. Elle
          venait du relevé et annonçait la section ; le titre et son chapô le
          font déjà, et trois lignes empilées au-dessus d'un mur de posts
          faisaient une marche de plus avant d'arriver au sujet. */}
      <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
        {/* La marque, centrée au-dessus du titre, sur demande de Rémy. Elle
            prend la place de l'étiquette entre crochets qui était là, et dit la
            même chose sans une ligne de texte de plus.

            `aria-hidden` est porté par le logo lui-même : le nom de la marque
            est écrit dans le titre juste en dessous, le faire annoncer deux
            fois n'apprendrait rien. */}
        <LogoFunnels className="mx-auto size-12" />

        <TitreRoulant
          as="h2"
          segments={titreCommunaute}
          className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
        />

        {/* Leur `max-width: 60ch` : c'est la largeur de lecture, et elle se
            mesure en caractères parce qu'elle suit le corps du texte. */}
        <p className="mx-auto max-w-[60ch] text-pretty text-muted-foreground">
          Faire partie d&apos;une communauté, c&apos;est être entouré de
          personnes qui sont comme nous, qui pensent comme nous et qui avancent
          dans la même direction que nous, pour se sentir compris et soutenu.
        </p>
      </div>
      </PortraitsFlottants>

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

          **Deux appuis mènent au mur entier**, sur demande de Rémy. Le pas
          n'est donc plus une hauteur en pixels : la colonne la plus haute fait
          dix-sept mille pixels sur un écran large et le double sur un
          téléphone, où les deux colonnes s'empilent, et mille huit cents
          pixels par clic demandaient dix appuis d'un côté et vingt de l'autre.
          `MurDepliable` découvre la moitié de ce qui reste, donc le compte
          tient à toutes les largeurs. */}
      <div className="mt-12">
      <MurDepliable hauteur={760} posts={2} clics={2}>
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
                /* **La largeur déclarée est celle de l'affichage, pas celle du
                   fichier.** `next/image` choisit la variante qu'il sert à
                   partir d'elle : avec les 200 px du fichier, il servait du
                   384 px pour un rond de 40, soit huit fois trop. 96 couvre le
                   double densité et rien de plus. */
                <Image
                  src={avis.portrait}
                  alt={`Portrait de ${prenom(avis.nom)}`}
                  width={96}
                  height={96}
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
