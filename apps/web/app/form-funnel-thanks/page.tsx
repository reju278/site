import { PileEntretiens } from "@/components/pile-entretiens";
import { entretiensPile } from "@/contenu/entretiens-pile";
import { LecteurVideo } from "@/components/lecteur-video";
import { NoteManuscrite } from "@/components/note-manuscrite";
import { MurCommunaute } from "@/components/mur-communaute";
import { TitreRoulant } from "@/components/titre-roulant";
import { RangeeEquipe } from "@/components/rangee-equipe";
import { confirmationFormFunnel, equipeImmersion } from "@/contenu/immersion";
import { scriptCapture } from "@/lib/reservation-capture";
import { TitreConfirmationForm } from "@/components/titre-confirmation-form";

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
      {/* `overflow-x-clip` : les notes au feutre se posent dans les marges, de
          biais ; si l'une touchait le bord, elle ne doit jamais faire défiler
          la page de côté. `clip` et non `hidden`, qui casserait le
          défilement vertical des éléments collants. */}
      <section id="programme" className="relative flex flex-col overflow-x-clip px-5 pt-8 sm:pt-12">
        <div className="mx-auto flex w-full max-w-[var(--largeur-video)] flex-1 flex-col">
          {/* **`mt-auto` et non `my-auto` : tout l'espace libre passe
              au-dessus du titre**, sur demande de Rémy, qui le veut « vraiment
              juste au-dessus » de la vidéo. Centré, le bloc flottait au milieu
              du vide et laissait un écart de cent trente pixels sous les
              gélules ; collé, il ne reste que la marge haute de la vidéo.

              Une seule marge automatique suffit à poser la vidéo au bas de la
              colonne : elle absorbe tout ce qui reste. */}
          {/* Plus large sur ordinateur, sur demande de Rémy : à 768 px, le
              titre s'empilait sur quatre lignes resserrées. */}
          <div className="mx-auto max-w-3xl text-center lg:max-w-5xl">
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
          {/* **Une note écrite au feutre montre la vidéo**, sur demande de
              Rémy, à la place de la bande « Vidéo 1/2 » : au-dessus sur
              téléphone, à gauche sur ordinateur, avec sa flèche. Le cadre est
              celui de la vidéo (sa largeur, bornée à la hauteur de l'écran) ;
              la note en sort sur ordinateur, posée contre son bord gauche. */}
          {/* La hauteur de la vidéo, bornée à l'écran : 85 % sur téléphone,
              68 % sur ordinateur, où le titre et la gélule prennent déjà le
              haut de l'écran (Rémy voulait la voir entière sans défiler). */}
          <div
            className="scene-video relative mx-auto mt-8 w-full [--hauteur-video:85svh] sm:mt-10 lg:[--hauteur-video:68svh]"
            style={{
              maxWidth: `calc(var(--hauteur-video) * ${confirmationFormFunnel.video1.video.format.largeur} / ${confirmationFormFunnel.video1.video.format.hauteur})`,
            }}
          >
            <NoteManuscrite
              legende={confirmationFormFunnel.video1.numero}
              className="mb-2 lg:absolute lg:top-1/4 lg:right-full lg:mr-4 lg:mb-0 lg:w-72 xl:w-[27rem]"
            >
              {confirmationFormFunnel.video1.consigne}
            </NoteManuscrite>
            <LecteurVideo
              id={confirmationFormFunnel.video1.video.id}
              titre={confirmationFormFunnel.video1.video.titre}
              secondes={confirmationFormFunnel.video1.video.secondes}
              affiche={`/temoignages/${confirmationFormFunnel.video1.video.id}.jpg`}
              afficheAlt="Rémy explique comment confirmer ton rendez-vous"
              format={confirmationFormFunnel.video1.video.format}
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
              /* Plus d'inclinaison au défilement, sur demande de Rémy. Un
                 liseré sombre et une ombre serrée détachent ses bords du fond
                 crème, que la vidéo partage : sans eux, elle s'y fondait. */
              className="shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55),0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/25"
            />
          </div>

          {/* **La seconde vidéo, sous celle de la confirmation**, sur demande
              de Rémy : son titre, puis le montage en 16/9, au lecteur de
              Wistia comme la première. */}
          <div className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
            <div className="mx-auto max-w-4xl text-center">
              <TitreRoulant
                as="h2"
                segments={[{ texte: confirmationFormFunnel.video2.titre }]}
                className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
              />
            </div>
            {/* La note au feutre, comme pour la première vidéo, mais **à
                droite** sur ordinateur, sur demande de Rémy. La vidéo se
                resserre assez pour lui laisser sa place dans la fenêtre. */}
            <div className="relative mt-8 lg:mx-auto lg:max-w-[min(48rem,calc(100vw-40rem))]">
              <NoteManuscrite
                legende={confirmationFormFunnel.video2.numero}
                cote="droite"
                className="mb-2 lg:absolute lg:top-1/4 lg:left-full lg:ml-4 lg:mb-0 lg:w-56 xl:w-64"
              >
                {confirmationFormFunnel.video2.consigne}
              </NoteManuscrite>
            <LecteurVideo
              id={confirmationFormFunnel.video2.video.id}
              titre={confirmationFormFunnel.video2.video.titre}
              secondes={confirmationFormFunnel.video2.video.secondes}
              affiche={`/temoignages/${confirmationFormFunnel.video2.video.id}.jpg`}
              afficheAlt="Rémy présente le système de A à Z"
              natif
              className="shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55),0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/25"
            />
            </div>

            {/* **Les entretiens en grand, sous la vidéo du système**, sur
                demande de Rémy : Roland d'emblée, à la même largeur, puis les
                autres derrière « Voir plus de témoignages ». Ils remplacent la
                grille de cartes, qui montrait les mêmes vidéos. */}
            <PileEntretiens
              entretiens={entretiensPile}
              className="mt-20 sm:mt-24 lg:mx-auto lg:max-w-[min(48rem,calc(100vw-40rem))]"
            />
          </div>
        </div>
      </section>

      {/* **Ni témoignages, ni vidéo 2/2 sous la vidéo du haut**, sur demande
          de Rémy : les trois cartes de clients et la section du modèle
          (« Voici ta vidéo de formation gratuite… », sur le fond bleuté) sont
          retirées. La page passe de la vidéo du haut à l'extrait de coaching. */}


      {/* LE MUR DE LA COMMUNAUTÉ, entre les entretiens et l'équipe.

          Sa place se déduit du parcours : on regarde d'abord les entretiens,
          qui sont des récits complets, puis ce que les membres écrivent au
          quotidien, puis qui les accompagne. L'inverse montrerait des citations
          de gens qu'on n'a pas encore vus. */}
      <MurCommunaute defilant />

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
