import { LecteurVideo } from "@/components/lecteur-video";
import { LecteurYoutube } from "@/components/lecteur-youtube";
import { MurCommunaute } from "@/components/mur-communaute";
import { RangeeEquipe } from "@/components/rangee-equipe";
import { TitreRoulant } from "@/components/titre-roulant";
import { equipeImmersion } from "@/contenu/immersion";
import { PileEntretiens } from "@/components/pile-entretiens";
import { entretiensPile } from "@/contenu/entretiens-pile";
import {
  RecapRendezVous,
  SansWhatsapp,
} from "@/components/rendez-vous";
import { TitreConfirmationForm } from "@/components/titre-confirmation-form";
import { confirmationThanks, identiteThanks } from "@/contenu/thanks";
import { scriptCapture } from "@/lib/reservation-capture";
import { insecables } from "@/lib/typographie";

import type { Metadata } from "next";
import { partageTunnel } from "@/lib/partage";
import { avecReglages } from "@/lib/reglages-seo";
import { CompteurVue } from "@/components/compteur-vue";

/**
 * La page de confirmation, servie sur `go.funnels.club/thanks`.
 *
 * **La structure est celle de `www.funnels.club/thanks-confirmation-2026`, le
 * dessin est celui du tunnel**, sur demande de Rémy : le haut de
 * `/form-funnel-thanks`, sans photographie ni logo, les polices, les
 * surlignages, et la pile d'entretiens de `/form-funnel-thanks` à la place
 * de la galerie, dans l'ordre de la page source. Le titre et l'alerte, l'étape 1 (une seule carte : sa
 * vidéo, ses consignes, le récapitulatif), puis les entretiens, le mur de
 * la communauté et l'équipe. La vidéo de l'étape 2 a été retirée par Rémy.
 *
 * **Les vidéos ne basculent pas en 3D.**
 *
 * **Pas de notification en bas de l'écran** : celle de `/preparation` y a
 * été, puis Rémy l'a retirée. L'alerte sous le titre suffit.
 *
 * **Le message de Rémy n'y est plus** : la page source n'en a pas.
 */

const metadonnees: Metadata = {
  title: identiteThanks.titrePage,
  description: identiteThanks.description,
  ...partageTunnel({
    titre: `${identiteThanks.titrePage} · Funnels Club`,
    description: identiteThanks.description,
    image: "thanks",
    alt: "Félicitations, ton appel avec Funnels Club est réservé",
  }),
};

export default function Thanks() {
  const { etape1, videoYoutube } = confirmationThanks;

  return (
    <>
      <div id="haut" />
      {/* Compté dans le VSL Funnel du CRM (étape « Appel réservé ») : la
          page sert aussi les autres prises d'appel, ses chiffres les
          comptent toutes. */}
      <CompteurVue tunnel="vsl" etape="merci" />

      {/* **Le relevé de la réservation**, en HTML brut et en tête de page :
          il lit ce que Calendly a mis dans l'adresse et l'en retire pendant
          la lecture du HTML, avant l'hydratation, donc avant Google Tag
          Manager. Voir `lib/reservation-capture.ts`. Brut parce que React signale
          toute balise `<script>` qu'il hydrate ; le contenu d'un
          `dangerouslySetInnerHTML`, il ne le lit pas. */}
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>${scriptCapture}</script>` }}
      />

      {/* LE HAUT ET L'ÉTAPE 1.

          **Le haut est celui de `/form-funnel-thanks`**, sur demande de
          Rémy : ni photographie ni logo, sur le fond de page du tunnel, les
          félicitations au prénom et à la date de l'appel, puis l'alerte
          rouge. Le même composant, `TitreConfirmationForm`, pour que les
          deux confirmations ne divergent pas.

          **L'étape 1 est un seul bloc**, sur demande de Rémy : son titre, sa
          vidéo, ses consignes et le récapitulatif dans la même carte, pour
          qu'on lise ce qu'il y a à faire d'un seul tenant. */}
      <div id="presentation">
        <section className="px-5 pt-8 sm:pt-12">
          <div className="mx-auto max-w-3xl text-center lg:max-w-5xl">
            {/* Le titre un cran plus petit que sur `/form-funnel-thanks`,
                sur demande de Rémy. */}
            <TitreConfirmationForm
              classeTitre="text-[1.625rem] sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
              alerte={confirmationThanks.alerte}
            />
          </div>
        </section>

        {/* La carte de l'étape 1, juste sous l'alerte. Son rembourrage,
            1 rem puis 1,5 rem en grand, est celui que déduit la largeur de
            la vidéo de l'étape 2. */}
        <section className="relative px-5 pt-8 sm:pt-10">
          <div className="mx-auto max-w-[var(--largeur-video)] rounded-[var(--rayon-jonction)] border border-border bg-card p-4 text-card-foreground shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:p-6">
            {/* La police et le corps du titre de la vidéo 2, sur demande de
                Rémy : les deux titres se répondent. Un cran sous les titres
                de section du site, qu'il trouvait trop gros ici : ce sont des
                légendes de vidéo, pas des titres de page. */}
            <h2 className="titre mx-auto max-w-3xl px-1 pt-1 text-center text-[1.375rem] leading-tight text-balance text-card-foreground sm:pt-2 sm:text-3xl">
              {/* « Vidéo 1/2 » devant le titre, sur demande de Rémy : il
                  répond aux « 2 vidéos » de l'alerte. */}
              {insecables(`${etape1.numero} : ${etape1.titre}`)}
            </h2>

            <div className="mt-4 w-full sm:mt-6">
              <LecteurVideo
                id={etape1.video.id}
                titre={etape1.video.titre}
                secondes={etape1.video.secondes}
                affiche={`/temoignages/${etape1.video.id}.jpg`}
                afficheAlt={etape1.video.titre}
                natif
              />
            </div>

            {/* Le rendez-vous, dessiné comme une vraie réservation, avec le
                bouton WhatsApp qui le confirme à l'intérieur, sur demande de
                Rémy. Voir `components/rendez-vous.tsx`. */}
            <div className="px-1 pt-6 pb-2 sm:px-2 sm:pt-8 sm:pb-4">
              <RecapRendezVous />
              <SansWhatsapp />
            </div>
          </div>
        </section>

        {/* La vidéo 2/2, dans une carte comme la première, sur demande de
            Rémy. */}
        <section className="relative px-5 pt-8 sm:pt-10">
          <div className="mx-auto max-w-[var(--largeur-video)] rounded-[var(--rayon-jonction)] border border-border bg-card p-4 text-card-foreground shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:p-6">
            <h2 className="titre mx-auto max-w-3xl px-1 pt-1 text-center text-[1.375rem] leading-tight text-balance text-card-foreground sm:pt-2 sm:text-3xl">
              {insecables(`${videoYoutube.numero} : ${videoYoutube.titre}`)}
            </h2>
            <div className="mt-4 w-full sm:mt-6">
              <LecteurYoutube
                id={videoYoutube.id}
                titre={videoYoutube.titre}
                affiche={`/temoignages/${videoYoutube.id}.jpg`}
              />
            </div>
          </div>
        </section>
      </div>

      {/* LES ENTRETIENS, la pile de `/form-funnel-thanks`, sur demande de
          Rémy : Roland en grand, avec son titre et sa note au feutre, puis
          les autres derrière « Découvrir 3 autres histoires ». Elle remplace
          la grille de cartes, qui montrait les mêmes vidéos. Sans boutons de
          réservation : l'appel est déjà pris. */}
      <section id="avis" className="scroll-mt-24 px-5 pt-20 sm:pt-24">
        {/* Sans la note au feutre de Roland, retirée ici sur demande de
            Rémy ; `/form-funnel-thanks` la garde. La vidéo reprend donc la
            largeur de celles du dessus. */}
        <PileEntretiens
          entretiens={entretiensPile.map((e) => ({ ...e, note: undefined }))}
          /* Les boutons au rayon du tunnel, 5 px, comme ceux de `/course`,
             `/video-vsl` et `/appel`, sur demande de Rémy. */
          rayonBoutons="var(--radius-md)"
          className="mx-auto w-full max-w-[calc(var(--largeur-video)-2rem)] sm:max-w-[calc(var(--largeur-video)-3rem)]"
        />
      </section>

      {/* LE MUR DE LA COMMUNAUTÉ ET L'ÉQUIPE, ceux de `/form-funnel-thanks`,
          sur demande de Rémy, dans le même ordre : les récits complets,
          puis ce que les membres écrivent au quotidien, puis qui les
          accompagne. Les mêmes composants, pour que les deux confirmations
          ne divergent pas. */}
      <div className="pt-16 sm:pt-20">
        {/* Le mur sans ses portraits flottants ni son en-tête, retirés ici
            sur demande de Rémy, et sous un titre à lui, qu'il a dicté. */}
        <div className="mx-auto max-w-3xl px-5 pb-8 text-center sm:pb-10">
          <TitreRoulant
            as="h2"
            segments={[{ texte: confirmationThanks.titreMur }]}
            className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
          />
        </div>
        <MurCommunaute defilant entete={false} />
      </div>

      <section id="equipe" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:py-12">
          <div className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
            <TitreRoulant
              as="h2"
              segments={[{ texte: equipeImmersion.titre }]}
              className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
            />
          </div>

          <RangeeEquipe />
        </div>
      </section>
    </>
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/thanks", metadonnees);
}
