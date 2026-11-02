import { SemisPoints } from "@/components/semis-points";
import { GalerieEntretiens } from "@/components/galerie-entretiens";
import { LecteurVideo } from "@/components/lecteur-video";
import { Play } from "lucide-react";
import { MurCommunaute } from "@/components/mur-communaute";
import { TitreRoulant } from "@/components/titre-roulant";
import { RangeeEquipe } from "@/components/rangee-equipe";
import {
  ancreEntretien,
  confirmationFormFunnel,
  avisImmersion,
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
          {/* **« Vidéo 1/2 » est une bande bleue collée au haut de la vidéo**,
              sur demande de Rémy : elle repère la vidéo au premier coup d'œil.
              Le cadre commun porte la largeur (celle de la vidéo, bornée à la
              hauteur de l'écran), l'arrondi et l'ombre ; la bande passe cinq
              pixels sous la vidéo pour que ses coins arrondis laissent voir du
              bleu et non un creux. */}
          <div
            className="scene-video mx-auto mt-8 w-full overflow-hidden rounded-md shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] sm:mt-10"
            style={{
              maxWidth: `calc(85svh * ${confirmationFormFunnel.video1.video.format.largeur} / ${confirmationFormFunnel.video1.video.format.hauteur})`,
            }}
          >
            {/* La police des titres, une icône de lecture et la durée : elle
                se lit comme le titre de la vidéo, pas comme une étiquette. */}
            <p className="titre relative z-0 -mb-[5px] flex items-center justify-center gap-2 bg-primary px-4 pt-2.5 pb-[calc(0.625rem+5px)] text-base tracking-tight text-primary-foreground sm:text-lg">
              <Play aria-hidden className="size-4 fill-current" />
              {confirmationFormFunnel.video1.numero}
              <span className="font-sans text-sm font-medium text-primary-foreground/75 sm:text-base">
                · {Math.round(confirmationFormFunnel.video1.video.secondes / 60)} min
              </span>
            </p>
            <LecteurVideo
              id={confirmationFormFunnel.video1.video.id}
              titre={confirmationFormFunnel.video1.video.titre}
              secondes={confirmationFormFunnel.video1.video.secondes}
              affiche={`/temoignages/${confirmationFormFunnel.video1.video.id}.jpg`}
              afficheAlt="Rémy explique comment confirmer ton rendez-vous"
              format={confirmationFormFunnel.video1.video.format}
              /* L'aperçu muet intégré de Wistia, sur demande de Rémy : la
                 vidéo défile sans le son, en boucle sur ses trente-cinq
                 premières secondes, et « Cliquer pour le son » la lance. */
              apercuAnime
              boucleApercu={35}
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
              /* Plus d'inclinaison au défilement, sur demande de Rémy. L'ombre
                 est portée par le cadre commun, avec la bande. */
              className="relative z-10"
            />
          </div>
        </div>
      </section>

      {/* **Ni témoignages, ni vidéo 2/2 sous la vidéo du haut**, sur demande
          de Rémy : les trois cartes de clients et la section du modèle
          (« Voici ta vidéo de formation gratuite… », sur le fond bleuté) sont
          retirées. La page passe de la vidéo du haut à l'extrait de coaching. */}

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

      {/* Plus d'extrait de coaching, sur demande de Rémy : le semis de
          points ne porte plus que les entretiens. */}

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
