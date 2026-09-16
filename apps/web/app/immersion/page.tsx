import { CartesTemoignage } from "@/components/cartes-temoignage";
import { FondResultats } from "@/components/fond-resultats";
import { LecteurVideo } from "@/components/lecteur-video";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { ParticulesHero } from "@/components/particules-hero";
import { PastillePreuve, PilulesArguments } from "@/components/pilules-hero";
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
import { temoignages } from "@/contenu/site";
import { insecables } from "@/lib/typographie";

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
        className="relative isolate px-5 pt-24 sm:pt-28"
        style={
          {
            /* **La largeur s'écrit une seule fois**, et il le fallait : elle
               sert au cadre de la vidéo et à sa hauteur, d'où `--jonction` est
               calculée. Écrite deux fois, elle aurait divergé au premier
               agrandissement, et la lèvre aurait dessiné sa jonction en travers
               de la vidéo. C'est la panne que `AGENTS.md` décrit déjà.

               Élargie de 48 à 56 rem sur demande de Rémy : la vidéo était trop
               petite pour la page. */
            "--largeur-video": "min(100vw - 2.5rem, 56rem)",
            /* La hauteur exacte du cadre en 16/9, d'où part la jonction. Une
               hauteur en dur donnerait un cadre qui n'est plus en 16/9, et
               Wistia y ajouterait des bandes noires sur les côtés. */
            "--video-h": "calc(var(--largeur-video) * 9 / 16)",
          } as React.CSSProperties
        }
      >
        {/* Deux fichiers, un par largeur : servir 1920 px à un écran de 375 en
            fait payer six fois le poids pour rien. Le voile assombri garantit
            le contraste du texte dans les deux thèmes.

            `data-bande-sombre` est le repère qu'observe `EnTeteImmersion` pour
            savoir qu'il surplombe une image : sans lui, il s'habillerait pour
            un fond de page et deviendrait clair sur sombre. */}
        <div
          data-bande-sombre
          className="absolute inset-x-0 top-0 bottom-[calc(var(--jonction)-88px)] -z-10 overflow-hidden"
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
              className="size-full object-cover"
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

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            {/* La pastille de preuve, au-dessus du titre, sur demande de
                Rémy : la même que celle de l'accueil, reprise et non
                réécrite. Son chiffre est le sien.

                **C'est une allégation chiffrée**, et elle est donc à prouver
                si on la porte un jour sur une page de publicité : c'est pour
                cette raison qu'elle a été retirée du hub, et c'est écrit dans
                `AGENTS.md`. Ici elle est celle de l'accueil, donc elle suit le
                même sort. */}
            <div className="mb-6 sm:mb-8">
              <PastillePreuve />
            </div>

            {/* Le titre est celui de Rémy, relevé sur la page source. La page
                source n'a pas de titre d'accueil : elle commence par un logo
                puis par cette phrase. En inventer une ici reviendrait à écrire
                du texte, ce que le dépôt interdit. */}
            <h1 className="titre text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              {insecables(plateformeImmersion.titre)}
            </h1>

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
          <div className="mx-auto mt-6 w-[var(--largeur-video)] sm:mt-8">
            <LecteurVideo
              id={plateformeImmersion.video.id}
              titre={plateformeImmersion.video.titre}
              secondes={plateformeImmersion.video.secondes}
              affiche={`/temoignages/${plateformeImmersion.video.id}.jpg`}
              afficheAlt="La plateforme de formation de Funnels Club"
              /* Une ombre portée pour détacher la vidéo, sur demande de Rémy.
                 Très diffuse et décalée vers le bas, donc elle se lit comme de
                 la profondeur et non comme un contour. Elle est **portée** et
                 non intérieure : elle ne se dispute pas la place du relief de
                 verre. */
              className="shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]"
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
      <SectionImmersion className="[&>div]:py-10 sm:[&>div]:py-12">
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
      <FondResultats>
      <SectionImmersion
        id="strategie"
        className="scroll-mt-24 [&>div]:pt-24 sm:[&>div]:pt-28"
      >
        <div className="mx-auto max-w-3xl text-center">
          <TitreRoulant
            as="h2"
            segments={[{ texte: modeleImmersion.titre }]}
            className="titre text-3xl text-balance text-foreground sm:text-4xl"
          />
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <LecteurVideo
            id={modeleImmersion.video.id}
            titre={modeleImmersion.video.titre}
            secondes={modeleImmersion.video.secondes}
            affiche={`/temoignages/${modeleImmersion.video.id}.jpg`}
            afficheAlt="Le modèle de Funnels Club"
          />
        </div>

        {/* **La paire du site, un plein et un creux**, sur demande de Rémy :
            on ne dessine pas un troisième bouton. Ce sont deux ressources
            d'importance comparable, exactement le cas que la règle décrit, et
            elles ont la même hauteur et le même rayon.

            Le plein est `BoutonScintillant`, qui prend sa couleur par la
            propriété `fond` et jamais par une classe : le fond est écrit à deux
            endroits, le bouton et le masque qui rentre son liseré, et les deux
            doivent être la même couleur au bit près.

            Le creux porte sa bordure en `currentColor`, donc elle ne peut pas
            diverger de son texte. Ici il se pose sur la couleur de page et non
            sur une photographie : son encre est le jeton `--foreground`, pas le
            blanc en dur du hero.

            `min-h-14` et pas de `whitespace-nowrap` : « Cliquez ici pour
            accéder à la fiche » demande plus que la largeur d'un téléphone, et
            un libellé qui refuse de passer à la ligne élargit le document
            entier. C'est la panne que `AGENTS.md` décrit. */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <BoutonScintillant href={modeleImmersion.ressources[0].href}>
            <TexteRoulant>{modeleImmersion.ressources[0].libelle}</TexteRoulant>
          </BoutonScintillant>

          <a
            href={modeleImmersion.ressources[1].href}
            target="_blank"
            rel="noreferrer"
            className="group/roule inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-current px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <TexteRoulant>{modeleImmersion.ressources[1].libelle}</TexteRoulant>
          </a>
        </div>
      </SectionImmersion>
      </FondResultats>

      {/* COACHING : les deux extraits. */}
      <SectionImmersion id="coaching" className="scroll-mt-24">
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

        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {entretiensImmersion.map((id) => {
            /* Le nom, l'accroche et la durée sont lus dans `temoignages`,
               jamais réécrits ici. Un entretien retiré de là disparaît d'ici
               sans laisser de carte vide. */
            const temoignage = temoignages.find((t) => t.id === id);
            if (!temoignage) return null;

            return (
              <li key={id} id={ancreEntretien(id)} className="scroll-mt-24">
                {/* **L'entretien se regarde ici, il ne mène nulle part.**
                    C'est la différence avec `/resultats`, dont les cartes sont
                    des liens vers la page de chacun : cette page-ci est un
                    tunnel, et sa règle est qu'on n'en sort pas. Envoyer vers
                    `/resultats/<nom>` rendrait au visiteur l'en-tête du site et
                    ses trente portes de sortie.

                    Ça ne coûte rien : `LecteurVideo` ne sert qu'une affiche
                    tant que personne n'a cliqué, et l'iframe Wistia, avec ses
                    505 Ko de JavaScript, n'arrive qu'à la lecture. C'est aussi
                    ce que fait la page source, en moins lourd. */}
                <LecteurVideo
                  id={id}
                  titre={`Entretien avec ${temoignage.nom}`}
                  secondes={temoignage.secondes}
                  affiche={`/temoignages/${id}.jpg`}
                />

                <p className="mt-3 text-base font-semibold text-foreground">
                  {temoignage.nom}
                </p>
                <p className="mt-1 text-sm text-pretty text-muted-foreground">
                  {insecables(temoignage.description)}
                </p>
              </li>
            );
          })}
        </ul>
      </SectionImmersion>

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
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={className} {...props}>
      <div className="mx-auto max-w-6xl px-5 py-9 sm:py-12">{children}</div>
    </section>
  );
}
