import { CartesTemoignage } from "@/components/cartes-temoignage";
import { FondCases } from "@/components/fond-cases";
import { FondResultats } from "@/components/fond-resultats";
import { GalerieEntretiens } from "@/components/galerie-entretiens";
import { LecteurVideo } from "@/components/lecteur-video";
import { MurCommunaute } from "@/components/mur-communaute";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { ParticulesHero } from "@/components/particules-hero";
import {
  Gelule,
  PilulesArguments,
  PointGelule,
} from "@/components/pilules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
import { RangeeEquipe } from "@/components/rangee-equipe";
import {
  ancreEntretien,
  ancresImmersion,
  avisImmersion,
  coachingImmersion,
  entretiensImmersion,
  equipeImmersion,
  identiteImmersion,
  plateformeImmersion,
  modeleImmersion,
} from "@/contenu/immersion";
import { insecables } from "@/lib/typographie";

import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";

/**
 * La page d'immersion.
 *
 * Elle reprend `www.funnels.club/inside-formateurs`, section pour section et
 * dans le même ordre, avec les codes de ce dépôt. Voir l'issue #3.
 *
 * **Le plan de titres est refait, et c'est la seule liberté prise sur la page
 * source.** Celle-ci empile quinze `h1` : un par section, puis un par nom de
 * membre de l'équipe et un par intitulé de poste. Un plan pareil n'annonce pas
 * quinze sujets, il n'annonce rien du tout. Ici, un seul `h1`, les sections en
 * `h2`, les noms de l'équipe en `h3`, et rien ne saute de marche.
 *
 * **Le `h1` est le premier titre de Rémy et non un titre neuf.** La page source
 * n'a pas de titre de page : elle commence par un logo, puis par « Présentation
 * de la plateforme de formation ». Écrire un titre d'accueil ici reviendrait à
 * inventer du texte, ce que le dépôt interdit. Si Rémy veut une phrase
 * d'ouverture, elle se pose dans `contenu/immersion.ts` et devient le `h1`.
 *
 * **Rien ne part chez Wistia avant un clic.** Les dix-huit vidéos sont des
 * affiches servies par nous ; l'iframe, et ses 505 Ko de JavaScript, n'arrive
 * qu'à la lecture. La page source les chargeait toutes au premier octet.
 */

export const metadata: Metadata = {
  title: identiteImmersion.titrePage,
  description: identiteImmersion.description,
};

export default function Immersion() {
  return (
    <>
      {/* La cible du nom de marque, dans l'en-tête et dans le pied de page :
          ils ramènent en haut de la page et non à l'accueil du site, qui serait
          une sortie. */}
      <div id="haut" />

      {/* LE HERO, repris du hub au caractère près, sur demande de Rémy : la
          même image de fond, le même voile, les mêmes particules, la même
          lèvre, et la vidéo à cheval sur la jonction.

          **`data-hero` n'est pas décoratif.** `--jonction`, la ligne où l'image
          cède la place à la page, n'est déclarée dans `globals.css` que sous
          `[data-hero]`. Sans l'attribut, la variable n'existe pas,
          `calc(var(--jonction) - 96px)` devient invalide, et la lèvre perd son
          ancrage : elle remonte et se pose en travers du titre. Rien
          n'échoue, un CSS invalide est simplement ignoré. C'est la panne que le
          hub a déjà connue. */}
      <section
        id="programme"
        data-hero
        /* Le rembourrage haut dégage la barre de navigation, qui flotte
           au-dessus. Il est plus court qu'avant : le titre est monté, et
           quatre-vingt-seize pixels laissaient un vide que Rémy a signalé. */
        className="relative isolate flex flex-col px-5 pt-20 sm:min-h-[calc(100svh+var(--part-cachee))] sm:pt-24"
      >
        {/* Deux fichiers, un par largeur : servir 1920 px à un écran de 375 en
            fait payer six fois le poids pour rien. Le voile assombri garantit
            le contraste du texte dans les deux thèmes.

            `data-bande-sombre` est le repère qu'observe `EnTeteImmersion` pour
            savoir qu'il surplombe une image : sans lui, il s'habillerait pour
            un fond de page et deviendrait clair sur sombre. */}
        <div
          data-bande-sombre
          /* `bg-[var(--fond-hero)]` : la photographie porte sa propre
             transparence dans son tiers haut, donc sans fond opaque elle
             laissait paraître la couleur de page au travers. En thème clair,
             cela donnait un gris moyen sous le voile, et tout ce qui est posé
             dessus y perdait son relief. Voir le jeton dans `globals.css`. */
          className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px)] -z-10 overflow-hidden bg-[var(--fond-hero)]"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fond-hero-mobile.jpg"
              alt=""
              width={1920}
              height={1097}
              fetchPriority="high"
              /* **Cadrée par le bas**, sur demande de Rémy : le pied de
                 l'image est le vrai pied de l'image.

                 Depuis que le hero fait une hauteur d'écran, le cadre est plus
                 large que haut par rapport au paysage : `cover` le met donc à
                 l'échelle sur la largeur et rogne en hauteur. Centré, il
                 mangeait une cinquantaine de pixels en bas comme en haut, et
                 le chemin du premier plan se terminait dans le vide.

                 **Ce qui est rogné passe entièrement en haut, et c'est sans
                 conséquence ici.** `AGENTS.md` prévient qu'un cadrage par le
                 bas supprime la transparence que ces paysages portent dans leur
                 tiers haut, et qu'il faut alors refaire le raccord au masque.
                 Le cas ne se pose pas : ce bord-là est au tout premier pixel de
                 la page, il n'a rien au-dessus avec quoi se raccorder. */
              className="size-full object-cover object-bottom"
            />
          </picture>
          <div aria-hidden className="absolute inset-0 bg-black/55" />
          <ParticulesHero />
        </div>

        {/* La lèvre : la page qui monte par-dessus l'image, ses deux angles
            hauts arrondis. Elle est **en dehors** du conteneur de l'image, et
            c'est la réparation d'un vrai défaut : ce conteneur est rogné sur un
            pixel fractionnaire, et le lissage de cette arête dessinait un trait
            clair sur toute la largeur. Dehors, la lèvre couvre l'arête au lieu
            de s'aligner dessus. */}
        <div
          aria-hidden
          className="absolute inset-x-0 -z-10 h-24 rounded-t-[var(--rayon-jonction)] bg-background"
          style={{ bottom: "calc(var(--jonction) - 96px)" }}
        />

        <div className="mx-auto flex w-full max-w-[var(--largeur-video)] flex-1 flex-col">
          {/* **`mt-auto` et non `my-auto` : tout l'espace libre passe
              au-dessus du titre**, sur demande de Rémy, qui le veut « vraiment
              juste au-dessus » de la vidéo. Centré, le bloc flottait au milieu
              du vide et laissait un écart de cent trente pixels sous les
              gélules ; collé, il ne reste que la marge haute de la vidéo.

              Une seule marge automatique suffit à poser la vidéo au bas de la
              colonne : elle absorbe tout ce qui reste. */}
          <div className="mx-auto mt-auto max-w-3xl text-center">
            {/* Le titre est celui de Rémy, relevé sur la page source. La page
                source n'a pas de titre d'accueil : elle commence par un logo
                puis par cette phrase. En inventer une ici reviendrait à écrire
                du texte, ce que le dépôt interdit. */}
            {/* **Le titre roule mot à mot comme ceux des sections**, sur
                demande de Rémy. C'est le même composant, donc le même effet et
                les mêmes réparations : le masque par mot, qui est ce qui le
                fait tenir sur plusieurs lignes, et la contre-règle sans
                JavaScript posée une seule fois dans `layout.tsx`.

                **Les deux lignes deviennent deux segments**, ce qui est
                exactement ce à quoi ils servent : un segment occupe sa ligne,
                donc la coupure est la même à toutes les largeurs et c'est Rémy
                qui décide où sa phrase se coupe, pas la fenêtre. */}
            <TitreRoulant
              as="h1"
              segments={plateformeImmersion.titre.map((texte) => ({ texte }))}
              className="titre text-4xl text-balance text-white sm:text-5xl lg:text-6xl"
            />

            {/* Les trois arguments, en gélules de verre à point vert, sur
                demande de Rémy : le même verre que la pastille au-dessus et que
                les capsules de l'en-tête. */}
            <div className="mt-6">
              <PilulesArguments points={plateformeImmersion.points} />
            </div>
          </div>

          {/* La vidéo, **à cheval sur la jonction** : sa moitié haute sur la
              photographie, sa moitié basse sur la couleur de page. C'est le
              hero du hub et de l'accueil, et c'est de là que part `--jonction`.

              Le rapport 16/9 est porté par `LecteurVideo` : c'est lui qui fait
              remplir le cadre exactement, sans bande noire.

              La largeur vient de `--largeur-video`, écrite une seule fois sur
              la section : c'est elle qui sert aussi à `--video-h`, donc à la
              jonction. Deux écritures divergeraient au premier agrandissement,
              et la lèvre dessinerait sa ligne en travers de la vidéo. */}
                    <div className="scene-video mt-8 w-full sm:mt-10">
            <LecteurVideo
              id={plateformeImmersion.video.id}
              titre={plateformeImmersion.video.titre}
              secondes={plateformeImmersion.video.secondes}
              affiche={`/temoignages/${plateformeImmersion.video.id}.jpg`}
              afficheAlt="La plateforme de formation de Funnels Club"
              /* **Le lecteur de Wistia, servi d'emblée**, sur demande de Rémy,
                 et pour cette vidéo seulement : son affiche et son bouton à
                 lui, pas les nôtres. Le prix est écrit sur la propriété, une
                 iframe qui se charge avant qu'on ait rien demandé. */
              natif
              /* Une ombre portée pour détacher la vidéo, sur demande de Rémy.
                 Très diffuse et décalée vers le bas, donc elle se lit comme de
                 la profondeur et non comme un contour. Elle est **portée** et
                 non intérieure : elle ne se dispute pas la place du relief de
                 verre. */
              /* **Inclinée vers l'avant, puis redressée au défilement**, sur
                 demande de Rémy et relevée sur wistia.com. La recette vit dans
                 `globals.css`, avec la perspective posée sur le conteneur
                 juste au-dessus : les deux classes vont ensemble, une carte qui
                 tourne sans perspective au-dessus d'elle s'aplatit au lieu de
                 se coucher. */
              className="video-bascule shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </section>

      {/* **Les trois témoignages sont sous la vidéo et sous la jonction**, donc
          sur la couleur de page et non sur la photographie. C'est ce que Rémy
          décrit : la vidéo à cheval entre l'image et le bloc clair, les trois
          clients en dessous d'elle.

          Les avoir posés dans le hero était une mauvaise lecture de sa demande
          précédente, et ça déplaçait la jonction hors de la vidéo. */}
      {/* Resserré sur demande de Rémy : il y avait 104 px entre le bas de la
          vidéo et les cartes, la marge de la grille s'ajoutant au rembourrage
          de la section sans que l'une sache l'autre. La marge est retirée de la
          grille, et l'écart est celui de la section, une seule valeur. */}
      {/* **L'écart du haut est plus grand que celui du bas**, sur demande de
          Rémy : au-dessus, il y a la vidéo, qui est un objet ; en dessous, la
          section suivante. À rembourrage égal, les cartes paraissaient collées
          à la vidéo, parce que l'écart perçu au-dessus s'arrête au bord de la
          vidéo alors que celui du bas se prolonge dans le blanc de la page. */}
      <SectionImmersion className="[&>div]:pt-16 [&>div]:pb-10 sm:[&>div]:pt-20 sm:[&>div]:pb-12">
        <CartesTemoignage />
      </SectionImmersion>

      {/* Les quatre ancres, **sur téléphone seulement.** Au-dessus de `sm`,
          elles sont dans la capsule de droite de l'en-tête, comme le menu du
          hub ; en dessous, la capsule les cache, faute de place à 375 px. Les
          montrer aux deux endroits donnerait deux fois la même rangée sur un
          grand écran.

          **Elles sont sous la jonction et non dans le hero.** Posées
          dedans, elles tombaient sur la photographie à 375 px de large, où la
          vidéo est plus courte et où tout remonte : leurs jetons de thème y
          devenaient de l'encre presque noire sur un paysage sombre. Sorties,
          elles se posent sur la couleur de page quelle que soit la largeur.
          C'est la panne que le hub a déjà connue avec ses deux boutons.

          `flex-wrap` : quatre libellés en une ligne tiennent en large et
          débordent à 375 px, et un débordement horizontal du document est
          exactement ce que la règle du dépôt interdit. */}
      <nav
        aria-label="Les sections de la page"
        className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 px-5 pt-8 sm:hidden"
      >
        {ancresImmersion.map((ancre) => (
          <a
            key={ancre.id}
            href={`#${ancre.id}`}
            className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {ancre.libelle}
          </a>
        ))}
      </nav>

      {/* STRATÉGIE : le modèle, sa fiche et son schéma, sur la bande bleutée.

          Elle est avant le coaching, comme sur la page source.

          **`FondResultats` est repris de l'accueil**, sur demande de Rémy : le
          fond du deck publicitaire, ses trois halos et son grain, avec sa lèvre
          en haut et son fondu en bas. C'est le même composant, donc la section
          suivra ses corrections.

          Le rembourrage haut est augmenté : la lèvre de `FondResultats` fait
          80 px et mangerait le titre. C'est ce que fait l'accueil au même
          endroit, et c'est pour ça que `Section` y accepte un
          `[&>div]:pt-*`. */}
      {/* `rayons` : les rayons de lumière que Rémy a demandés sur ce fond-là.
          Ils sont facultatifs, et ne servent qu'ici : voir la propriété. */}
      <FondResultats rayons>
      <SectionImmersion
        id="strategie"
        /* **Plus d'air au-dessus**, sur demande de Rémy. La lèvre de
           `FondResultats` fait déjà 80 px, et l'étiquette qui ouvre maintenant
           la section a besoin de respirer sous elle : à `pt-24`, elle semblait
           collée au raccord. */
        /* **Le conteneur de la section s'élargit à la vidéo.**

           `SectionImmersion` borne son contenu à `max-w-6xl`, soit 1152 px,
           rembourrage compris. La vidéo du modèle en fait 1216 depuis qu'elle a
           la largeur de celle du haut : plus large que son conteneur, elle
           cessait d'être centrée, `mx-auto` n'ayant plus d'espace à répartir.
           Elle se calait à gauche et débordait le document de 32 px à droite,
           ce que la règle du dépôt interdit. C'est le décentrage que Rémy a vu.

           La borne devient donc la largeur de la vidéo plus son rembourrage.
           Sur écran étroit, `--largeur-video` vaut déjà `100vw - 2.5rem`, donc
           le compte tombe juste sans rien ajouter. Le titre, lui, garde son
           `max-w-3xl` : il est borné à l'intérieur. */
        className="scroll-mt-24 [&>div]:max-w-[calc(var(--largeur-video)+2.5rem)] [&>div]:pt-32 sm:[&>div]:pt-40"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* L'étiquette, en pilule, sur demande de Rémy. Elle porte la moitié
              du titre de la page source, « Extrait de formation », et dit la
              nature de ce qui suit avant qu'on lise le titre.

              **Fond plein et non verre.** Le flou par-devant a ses cinq
              exceptions, écrites dans `AGENTS.md`, et une étiquette posée dans
              le flux d'une page n'a rien derrière elle à brouiller.

              `rounded-full` : une pilule n'a pas d'angle, la règle des 5 px ne
              la concerne pas. */}
          {/* **Exactement la gélule du hero**, sur demande de Rémy : même
              composant, mêmes cotes, même typographie, même pastille, même
              lumière. Seules changent la teinte, qui passe au bleu du site, et
              l'encre, parce que le fond n'est pas le même : voir la propriété
              `sur` du composant. */}
          <Gelule
            as="p"
            sur="page"
            teinte="var(--primary)"
            pastille={<PointGelule />}
          >
            {modeleImmersion.etiquette}
          </Gelule>

          <TitreRoulant
            as="h2"
            segments={[{ texte: modeleImmersion.titre }]}
            className="titre mt-5 text-3xl text-balance text-foreground sm:text-4xl"
          />
        </div>

        {/* **La même largeur que la vidéo du haut**, sur demande de Rémy, et
            par la même variable : deux largeurs écrites séparément auraient
            cessé d'être égales au premier réglage. */}
        <div className="video-approche mx-auto mt-8 w-[var(--largeur-video)]">
          <LecteurVideo
            id={modeleImmersion.video.id}
            titre={modeleImmersion.video.titre}
            secondes={modeleImmersion.video.secondes}
            affiche={`/temoignages/${modeleImmersion.video.id}.jpg`}
            afficheAlt="Le modèle de Funnels Club"
            /* **Le lecteur de Wistia, servi d'emblée**, comme la vidéo du haut
               de page et sur la même demande de Rémy : son affiche et son bouton
               à lui, pas les nôtres.

               Le prix est celui écrit sur la propriété, et il double ici : deux
               iframes se chargent maintenant à l'ouverture de la page sans que
               personne ait rien demandé. C'est pour cette raison que les
               vingt-deux entretiens de la galerie gardent, eux, l'affiche
               cliquable : ils ne se montent qu'à l'ouverture de leur fenêtre. */
            natif
          />
        </div>

        {/* **Les deux ressources ne sont plus affichées**, sur demande de
            Rémy : cette page ne porte aucun lien sortant, et ces deux boutons
            n'existaient que pour en sortir, l'un vers la fiche modèle et
            l'autre vers le tableau Miro.

            Ils sont retirés plutôt que déshabillés. La règle des tunnels veut
            qu'un lien de contenu perde son adresse et garde son libellé en
            texte, mais elle parle d'un lien au milieu d'une phrase : là, la
            phrase reste lisible sans lui. Un bouton, lui, n'est qu'un geste :
            déshabillé, il reste une cible qui ne fait rien.

            `modeleImmersion.ressources` n'est pas touché : c'est du contenu de
            Rémy, et il revient le jour où ces deux adresses ont leur place. */}
      </SectionImmersion>
      </FondResultats>

      {/* COACHING : les deux extraits. */}
      <SectionImmersion cases id="coaching" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl text-center">
          <TitreRoulant
            as="h2"
            segments={[{ texte: coachingImmersion.titre }]}
            className="titre text-3xl text-balance text-foreground sm:text-4xl"
          />
          <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
            {insecables(coachingImmersion.texte)}
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {coachingImmersion.extraits.map((extrait) => (
            <li key={extrait.id}>
              <LecteurVideo
                id={extrait.id}
                titre={extrait.titre}
                secondes={extrait.secondes}
                affiche={`/temoignages/${extrait.id}.jpg`}
              />
              <p className="mt-3 text-sm text-pretty text-muted-foreground">
                {insecables(extrait.titre)}
              </p>
            </li>
          ))}
        </ul>

      </SectionImmersion>

      {/* AVIS : les quatorze entretiens.

          **Ce sont des liens vers les pages d'avis, pas des lecteurs.** C'est
          la décision déjà prise pour `/resultats`, et elle vaut ici pour les
          mêmes deux raisons : chaque entretien a sa page, où il est raconté et
          transcrit ; et quatorze lecteurs Wistia assemblés d'avance, c'est
          plusieurs mégaoctets de JavaScript pour une page qu'on ouvre depuis un
          lien qu'on vient de recevoir.

          La carte est celle de `/resultats`, au détail près. */}
      <SectionImmersion id="avis" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl text-center">
          <TitreRoulant
            as="h2"
            segments={[{ texte: avisImmersion.titre }]}
            className="titre text-3xl text-balance text-foreground sm:text-4xl"
          />
          <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
            {insecables(avisImmersion.sousTitre)}
          </p>
        </div>

        {/* La galerie : les cartes du sommaire des résultats, qui ouvrent
            l'entretien dans une fenêtre au lieu de mener à une page. Voir
            `GalerieEntretiens`. */}
        <GalerieEntretiens />
      </SectionImmersion>

      {/* LE MUR DE LA COMMUNAUTÉ, entre les entretiens et l'équipe.

          Sa place se déduit du parcours : on regarde d'abord les entretiens,
          qui sont des récits complets, puis ce que les membres écrivent au
          quotidien, puis qui les accompagne. L'inverse montrerait des citations
          de gens qu'on n'a pas encore vus. */}
      <MurCommunaute />

      {/* L'ÉQUIPE.

          **Elle est masquée sur la page source et Rémy la remet**, réduite aux
          cinq personnes d'aujourd'hui et redessinée en une carte par ligne.
          Voir `RangeeEquipe`. */}
      <SectionImmersion id="equipe" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl text-center">
          <TitreRoulant
            as="h2"
            segments={[{ texte: equipeImmersion.titre }]}
            className="titre text-3xl text-balance text-foreground sm:text-4xl"
          />
        </div>

        <RangeeEquipe />
      </SectionImmersion>
    </>
  );
}

/**
 * Une section de la page d'immersion.
 *
 * **C'est `Section` avec un rythme resserré, et il fallait le redéclarer plutôt
 * que le corriger de l'extérieur.** Dans `Section`, le rembourrage vit sur le
 * bloc intérieur et non sur la balise qui reçoit la classe : un `className`
 * passé de l'extérieur n'écrase donc rien, ce que `AGENTS.md` note déjà à
 * propos de l'écart des en-têtes de page.
 *
 * **Mesuré avant d'être corrigé.** `Section` pose `py-20 sm:py-28`, soit
 * 80 px et 112 px, en haut **et** en bas : entre deux sections, les deux
 * s'additionnent sans se connaître et donnent 160 px sur téléphone et 224 px
 * en large. C'est le souffle du site, où chaque section est un sujet qu'on
 * découvre ; ici les blocs se suivent et se répondent, et Rémy a demandé de
 * resserrer, l'espace au-dessus des titres en premier.
 *
 * Le rythme du site n'est pas touché : cette valeur ne vaut que dans ce
 * tunnel. La moitié, 36 px et 48 px, donc 72 px et 96 px entre deux sections.
 */
function SectionImmersion({
  className,
  children,
  cases = false,
  ...props
}: React.ComponentProps<"section"> & {
  /**
   * Pose le quadrillage de cases derrière la section.
   *
   * **Facultatif, et il faut qu'il le reste.** Rémy l'a demandé pour la seule
   * section des extraits de coaching. Il l'avait d'abord voulu sur trois, puis
   * a tranché pour celle-là : partout, il cesserait d'être un accent pour
   * devenir le fond de la page.
   */
  cases?: boolean;
}) {
  return (
    /* `relative` dès qu'il y a un quadrillage : c'est lui qui donne son cadre à
       la couche posée en dessous. Sans quadrillage, la section reste ce qu'elle
       était, pour ne rien changer aux cinq autres. */
    <section className={cn(cases && "relative isolate", className)} {...props}>
      {cases ? <FondCases /> : null}
      <div className="mx-auto max-w-6xl px-5 py-9 sm:py-12">{children}</div>
    </section>
  );
}
