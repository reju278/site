import { BanniereGenesis } from "@/components/banniere-genesis";
import { LecteurVideo } from "@/components/lecteur-video";
import { ConsignesRendezVous } from "@/components/rendez-vous";
import { TitreConfirmationForm } from "@/components/titre-confirmation-form";
import { confirmationGenesis } from "@/contenu/formation-genesis";
import { confirmationThanks, identiteThanks } from "@/contenu/thanks";
import { scriptCapture } from "@/lib/reservation-capture";
import type { Metadata } from "next";

/**
 * La confirmation de l'appel de la Formation Genesis,
 * `go.funnels.club/reservation-thanks` (issue #8), sur demande de Rémy :
 * **`/thanks` refaite aux codes du tunnel**, pour qu'on ne se sente pas
 * ailleurs en sortant de `/reservation`.
 *
 * **Ce qui est gardé de `/thanks`, à l'identique** : le relevé de la
 * réservation dans l'adresse (prénom, date, téléphone, hôte, réponses), fait
 * avant Google Tag Manager par `scriptCapture` ; le titre « Félicitations
 * Rémy, ton appel est réservé pour le… » et l'alerte rouge
 * (`TitreConfirmationForm`) ; la carte de l'étape 1, sa vidéo de
 * confirmation et ses consignes personnelles (`ConsignesRendezVous`). Ce
 * sont les mêmes composants, donc la même logique.
 *
 * **Ce qui change** : la seule vidéo de confirmation, sans « Vidéo 1/2 » ni
 * la vidéo 2/2, retirée par Rémy, d'où l'alerte « regarde la vidéo »
 * (`alerteUneVideo`) ; ni entretiens ni mur, puisqu'il ne reste que cette
 * vidéo ; et le dessin de Genesis : bannière et logo, titres en PT Serif,
 * angles droits, la carte blanche à ombre douce du formulaire de l'optin.
 * Les titres et les angles des deux composants partagés passent par deux
 * règles de `globals.css` limitées à `[data-genesis]`, et non par une copie.
 */
export const metadata: Metadata = {
  title: { absolute: `${identiteThanks.titrePage} · Funnels Club` },
  description: identiteThanks.description,
};

export default function ReservationThanks() {
  const { etape1 } = confirmationThanks;

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      {/* **Le relevé de la réservation**, en HTML brut et en tête de page,
          comme sur `/thanks` : il lit ce que Calendly a mis dans l'adresse et
          l'en retire pendant la lecture du HTML, donc avant Google Tag
          Manager. Voir `lib/reservation-capture.ts`. */}
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>${scriptCapture}</script>` }}
      />

      <BanniereGenesis libelle={confirmationGenesis.barre} />

      {/* Le titre et l'alerte, ferrés à gauche sur la colonne de la
          bannière, comme les autres pages du tunnel. */}
      <header className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        <TitreConfirmationForm
          classeTitre="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1]"
          alerte={confirmationThanks.alerteUneVideo}
        />
      </header>

      {/* L'étape 1, seule : la vidéo de confirmation et les consignes, dans
          la carte blanche à ombre douce du formulaire de l'optin. */}
      <section className="mx-auto max-w-[960px] px-5 pt-8 sm:px-8 sm:pt-10">
        <div className="bg-white p-4 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-7">
          <h2 className="titre text-[1.375rem] leading-tight text-pretty sm:text-3xl">
            {etape1.titre}
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
    </main>
  );
}
