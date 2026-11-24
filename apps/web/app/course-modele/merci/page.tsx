import { BanniereGenesis } from "@/components/banniere-genesis";
import { CompteurVue } from "@/components/compteur-vue";
import { LecteurVideo } from "@/components/lecteur-video";
import { NumeroVideo } from "@/components/numero-video";
import { PreuvesTunnel } from "@/components/preuves-tunnel";
import { ConsignesRendezVous } from "@/components/rendez-vous";
import { TitreConfirmationForm } from "@/components/titre-confirmation-form";
import { VideoDepartZero } from "@/components/video-depart-zero";
import {
  CHEMINS_COURSE_MODELE,
  confirmationCourseModele,
} from "@/contenu/course-modele";
import { confirmationThanks, identiteThanks } from "@/contenu/thanks";
import { scriptCapture } from "@/lib/reservation-capture";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";

/**
 * La confirmation de Course modèle, `go.funnels.club/course-modele/merci`,
 * où Calendly renverra une fois l'appel réservé : **`go.funnels.club/thanks`
 * sous une autre adresse**, sur demande de Rémy, au dessin du tunnel (comme
 * `/reservation-thanks` pour Genesis).
 *
 * **Tout ce qui personnalise `/thanks` est gardé, par les mêmes composants** :
 * le relevé de la réservation que Calendly met dans l'adresse (prénom, date,
 * téléphone, hôte, réponses), fait avant Google Tag Manager par
 * `scriptCapture` ; « Félicitations Rémy, ton appel est réservé pour le… »
 * et l'alerte rouge (`TitreConfirmationForm`) ; les consignes personnelles
 * de l'étape 1 (`ConsignesRendezVous`). **À défaut du prénom de Calendly,
 * celui de l'opt-in** (`prenomOptin`), gardé dans le navigateur depuis la
 * fenêtre d'inscription.
 *
 * **Les deux vidéos de `/thanks`**, puis la vidéo de qui démarre de zéro
 * (conditionnelle) et les preuves (entretiens, mur, équipe), boutons au
 * dessin du tunnel.
 *
 * **Calendly doit y renvoyer** : réglage de l'événement à faire par Rémy
 * (page de confirmation externe, détails de l'événement transmis).
 */
export const metadata: Metadata = {
  title: { absolute: `${confirmationCourseModele.titrePage} · Funnels Club` },
  description: identiteThanks.description,
  alternates: { canonical: `https://go.funnels.club${CHEMINS_COURSE_MODELE.merci}` },
};

/** La carte blanche à ombre douce du tunnel, celle de la fenêtre d'inscription. */
const CARTE = "bg-white p-4 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-7";

export default function MerciCourseModele() {
  const { etape1, video2 } = confirmationThanks;

  return (
    <main
      className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]"
      /* La largeur de `/thanks`, 56 rem, que ses blocs de preuves attendent,
         comme sur `/reservation-thanks`. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 56rem)",
        } as React.CSSProperties
      }
    >
      {/* La visite compte dans le tunnel « Course modèle » du CRM : un
          visiteur de cette page est un appel réservé. */}
      <CompteurVue tunnel="course-modele" etape="merci" />
      {/* **Le relevé de la réservation**, en HTML brut et en tête de page,
          comme sur `/thanks` : il lit ce que Calendly a mis dans l'adresse et
          l'en retire pendant la lecture du HTML, donc avant Google Tag
          Manager. Voir `lib/reservation-capture.ts`. */}
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>${scriptCapture}</script>` }}
      />

      <BanniereGenesis libelle={confirmationCourseModele.barre} />

      <header className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        <TitreConfirmationForm
          classeTitre="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1]"
          alerte={confirmationThanks.alerte}
          prenomOptin
        />
      </header>

      {/* L'étape 1 : la vidéo de confirmation et les consignes. */}
      <section className="mx-auto max-w-[960px] px-5 pt-8 sm:px-8 sm:pt-10">
        <div className={CARTE}>
          <h2 className="titre text-[1.375rem] leading-tight text-pretty sm:text-3xl">
            <NumeroVideo>{etape1.numero}</NumeroVideo>
            {insecables(`: ${etape1.titre}`)}
          </h2>
          <div className="mt-4 w-full sm:mt-6">
            <LecteurVideo
              id={etape1.video.id}
              titre={etape1.video.titre}
              secondes={etape1.video.secondes}
              affiche={`/temoignages/${etape1.video.id}.jpg`}
              afficheAlt={etape1.video.titre}
              natif
              carre
            />
          </div>
          <ConsignesRendezVous />
        </div>
      </section>

      {/* La vidéo 2/2, dans une carte comme la première. */}
      <section className="mx-auto max-w-[960px] px-5 pt-8 sm:px-8 sm:pt-10">
        <div className={CARTE}>
          <h2 className="titre text-[1.375rem] leading-tight text-pretty sm:text-3xl">
            <NumeroVideo>{video2.numero}</NumeroVideo>
            {insecables(`: ${video2.titre}`)}
          </h2>
          <div className="mt-4 w-full sm:mt-6">
            <LecteurVideo
              id={video2.id}
              titre={video2.titre}
              secondes={video2.secondes}
              affiche={`/temoignages/${video2.id}.jpg`}
              afficheAlt={video2.titre}
              natif
              carre
            />
          </div>
        </div>
      </section>

      {/* Tout ce qui suit sur `/thanks` : la vidéo de qui démarre de zéro
          (si le quiz le dit), puis les entretiens, le mur et l'équipe, aux
          boutons du tunnel. */}
      <VideoDepartZero />
      <PreuvesTunnel boutonsGenesis />
    </main>
  );
}
