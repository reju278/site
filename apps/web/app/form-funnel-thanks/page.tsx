import { CartesTemoignage } from "@/components/cartes-temoignage";
import { SemisPoints } from "@/components/semis-points";
import { ExtraitsCoaching } from "@/components/extraits-coaching";
import { FondResultats } from "@/components/fond-resultats";
import { GalerieEntretiens } from "@/components/galerie-entretiens";
import { LecteurVideo } from "@/components/lecteur-video";
import { MurCommunaute } from "@/components/mur-communaute";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { Gelule, PointGelule } from "@/components/pilules-hero";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
import { RangeeEquipe } from "@/components/rangee-equipe";
import {
  ancreEntretien,
  confirmationFormFunnel,
  avisImmersion,
  coachingImmersion,
  entretiensImmersion,
  equipeImmersion,
} from "@/contenu/immersion";
import { insecables } from "@/lib/typographie";
import { scriptCapture } from "@/lib/reservation-capture";
import { TitreConfirmationForm } from "@/components/titre-confirmation-form";

import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";
import { avecReglages } from "@/lib/reglages-seo";

/**
 * La confirmation du Form Funnel, `go.funnels.club/form-funnel-thanks`.
 *
 * C'est `/immersion` recopiée, sur demande de Rémy, avec un autre haut de
 * page : les félicitations au prénom et à la date de l'appel, l'alerte de
 * `/thanks`, et ses deux vidéos numérotées (voir `confirmationFormFunnel`).
 * Tout ce qui suit, témoignages, coaching, entretiens, communauté et
 * équipe, est le même composant qu'`/immersion` : leurs corrections valent
 * pour les deux pages.
 *
 * On y arrive depuis le sondage de form.funnels.club, une fois l'appel
 * réservé : ce dépôt n'en sait que ce que l'adresse transmet.
 */

const metadonnees: Metadata = {
  title: confirmationFormFunnel.titrePage,
  description: confirmationFormFunnel.description,
};

export default function ConfirmationFormFunnel() {
  return (
    <>
      {/* **Le relevé de la réservation**, comme sur `/thanks` : il lit le
          prénom et la date que le sondage a mis dans l'adresse et les en
          retire pendant la lecture du HTML, avant Google Tag Manager. Voir
          `lib/reservation-capture.ts`. */}
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>${scriptCapture}</script>` }}
      />
      {/* La cible du nom de marque, dans l'en-tête et dans le pied de page :
          ils ramènent en haut de la page et non à l'accueil du site, qui serait
          une sortie. */}
      <div id="haut" />

      {/* **Le haut de page, sans photographie**, sur demande de Rémy : ni
          image, ni voile, ni particules, ni lèvre. La page est la suite du
          sondage et en garde l'habit, le fond crème du formulaire, avec la
          marque seule au-dessus (`layout.tsx`). */}
      <section id="programme" className="relative flex flex-col px-5 pt-8 sm:pt-12">
        <div className="mx-auto flex w-full max-w-[var(--largeur-video)] flex-1 flex-col">
          {/* **`mt-auto` et non `my-auto` : tout l'espace libre passe
              au-dessus du titre**, sur demande de Rémy, qui le veut « vraiment
              juste au-dessus » de la vidéo. Centré, le bloc flottait au milieu
              du vide et laissait un écart de cent trente pixels sous les
              gélules ; collé, il ne reste que la marge haute de la vidéo.

              Une seule marge automatique suffit à poser la vidéo au bas de la
              colonne : elle absorbe tout ce qui reste. */}
          <div className="mx-auto max-w-3xl text-center">
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
            {/* **Le haut de la confirmation**, à la place du titre et des
                arguments d'`/immersion` : les félicitations, au prénom et à
                la date de l'appel quand le sondage les a transmis, puis
                l'alerte de `/thanks`. */}
            <TitreConfirmationForm />
            <p className="mt-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {confirmationFormFunnel.video1.numero}
            </p>
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
              id={confirmationFormFunnel.video1.video.id}
              titre={confirmationFormFunnel.video1.video.titre}
              secondes={confirmationFormFunnel.video1.video.secondes}
              affiche={`/temoignages/${confirmationFormFunnel.video1.video.id}.jpg`}
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

      {/* **Il n'y a plus de rangée d'ancres sur téléphone**, sur demande de
          Rémy : « ça n'a rien à faire là ». Elle doublait le menu de l'en-tête,
          que la capsule cache à 375 px faute de place, et elle tombait entre le
          hero et la stratégie, c'est-à-dire au premier endroit où l'on descend.
          Les sections restent atteignables par le menu de l'en-tête. */}

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
            {confirmationFormFunnel.video2.numero}
          </Gelule>

          <TitreRoulant
            as="h2"
            segments={[{ texte: confirmationFormFunnel.video2.titre }]}
            className="titre mt-5 text-[1.625rem] text-balance text-foreground sm:text-4xl"
          />
        </div>

        {/* **La même largeur que la vidéo du haut**, sur demande de Rémy, et
            par la même variable : deux largeurs écrites séparément auraient
            cessé d'être égales au premier réglage. */}
        <div className="video-approche mx-auto mt-8 w-[var(--largeur-video)]">
          <LecteurVideo
            id={confirmationFormFunnel.video2.video.id}
            titre={confirmationFormFunnel.video2.video.titre}
            secondes={confirmationFormFunnel.video2.video.secondes}
            affiche={`/temoignages/${confirmationFormFunnel.video2.video.id}.jpg`}
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

      {/* **La séparation entre le modèle et l'extrait de coaching**, sur demande
          de Rémy.

          Un filet qui s'éteint à ses deux bouts, et rien au milieu. Le fond des
          résultats se termine juste au-dessus par un fondu qui ne laisse aucune
          arête : c'est voulu, et c'est écrit dans `AGENTS.md`, mais les deux
          sections finissaient par se toucher sans qu'on sache où l'une
          s'arrêtait.

          **Il s'éteint au lieu de s'arrêter**, pour la même raison que tout le
          reste de cette page : un trait qui bute sur ses extrémités dessine deux
          points, et on les voit. Et il est plus étroit que la page, pour se lire
          comme une respiration et non comme une bordure de section.

          `aria-hidden` : c'est une figure, elle ne dit rien qu'un lecteur
          d'écran ait besoin d'entendre. Le changement de sujet est déjà porté
          par les deux `h2` qui l'encadrent. */}
      <div aria-hidden className="mx-auto max-w-3xl px-5 pt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* **Le semis de points court sur deux sections**, le coaching et les
          entretiens, sur demande de Rémy. Il était derrière la seule fenêtre
          Safari, puis il allait jusqu'au mur de la communauté ; Rémy l'a arrêté
          **juste avant** celui-ci, qui garde donc son fond nu.

          **Une seule couche pour les deux**, et pas une par section : posé deux
          fois, le semis se serait réaligné à chaque fois, et le raccord se
          serait vu en travers de la page. Ici la grille est continue d'un bout
          à l'autre.

          **Le masque croise deux fondus.** L'horizontal est ce que Rémy décrit,
          des points au centre et un peu sur les côtés, qui s'éteignent avant le
          bord. Le vertical n'a pas été demandé mais il le fallait : sans lui, la
          traversée commencerait et finirait sur une ligne de points nette en
          travers de la page, c'est-à-dire la couture que tout le reste de cette
          page s'applique à éviter. Il est court, six pour cent à chaque bout.

          `isolate` : le semis est en `-z-10`, il lui faut un contexte
          d'empilement à lui, sinon il passerait derrière le fond de page. */}
      <div className="relative isolate">
        {/* **Un motif CSS et non le `DotPattern` du registre**, et c'est une
            mesure qui l'a décidé : leur composant dessine un cercle par point,
            soit 21 252 nœuds sur les 23 550 de la page. Voir `SemisPoints`. */}
        <SemisPoints
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 text-border",
            "[mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent),linear-gradient(to_bottom,transparent,#000_6%,#000_94%,transparent)]",
            "[mask-composite:intersect] [-webkit-mask-composite:source-in]",
          )}
        />

      {/* COACHING : les deux extraits. */}
      <SectionImmersion id="coaching" className="scroll-mt-24">
        {/* **Un simple libellé en italique**, sur demande de Rémy, et le
            sous-titre est retiré.

            **Il reste un `h2` malgré son allure de légende**, et ce n'est pas
            une coquetterie : c'est le plan du document que les robots lisent, et
            c'est la cible de l'ancre « Coaching » de l'en-tête. Une section
            atteignable par un menu et qui n'a pas de titre est un trou dans ce
            plan. Ce qui change, c'est sa mise en forme, pas son rang.

            **Il a la taille des autres titres de section**, sur correction de
            Rémy : je l'avais rentré à `text-xl`, ce qui le faisait lire comme
            une légende alors que c'est le titre de la section.

            Plus de `TitreRoulant`, en revanche. L'effet découpe le titre en mots
            et enferme chacun dans un masque en `overflow-hidden` : une fonte
            italique déborde son cadre, et les jambages se feraient couper. */}
        <h2 className="titre text-center text-[1.625rem] text-balance text-foreground italic sm:text-4xl">
          {coachingImmersion.titre}
        </h2>

        <ExtraitsCoaching extrait={coachingImmersion.extrait} />

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
            className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
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
      </div>

      {/* LE MUR DE LA COMMUNAUTÉ, entre les entretiens et l'équipe.

          Sa place se déduit du parcours : on regarde d'abord les entretiens,
          qui sont des récits complets, puis ce que les membres écrivent au
          quotidien, puis qui les accompagne. L'inverse montrerait des citations
          de gens qu'on n'a pas encore vus. */}
      <MurCommunaute />

      {/* L'ÉQUIPE.

          **Elle est masquée sur la page source et Rémy la remet**, réduite aux
          cinq personnes d'aujourd'hui et redessinée en un rang de portraits
          ronds. Voir `RangeeEquipe`.

          L'espace au-dessus du titre est plus large que le rythme de la page,
          sur sa demande : le mur de la communauté finit sur ses cartes, et ce
          rang de visages qui commence trop près se lisait comme la suite du
          mur plutôt que comme une autre section. */}
      <SectionImmersion id="equipe" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
          <TitreRoulant
            as="h2"
            segments={[{ texte: equipeImmersion.titre }]}
            className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
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

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/form-funnel-thanks", metadonnees);
}
