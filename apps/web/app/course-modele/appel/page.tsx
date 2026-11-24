import { CompteurVue } from "@/components/compteur-vue";
import { FormulaireCalendly } from "@/components/formulaire-calendly";
import { VisiteAppelCrm } from "@/components/visite-appel-crm";
import { reservationAppel } from "@/contenu/appel";
import {
  appelCourseModele,
  CHEMINS_COURSE_MODELE,
} from "@/contenu/course-modele";
import { scriptContactEspace } from "@/lib/contact-lien";
import type { Metadata } from "next";

/**
 * La prise d'appel de Course modèle, `go.funnels.club/course-modele/appel`,
 * où mène le bouton de la vidéo : `funnels.club/appel-2025-fb` (le
 * formulaire Calendly seul), sur la structure de `/reservation` de Genesis,
 * sur demande de Rémy. Mêmes composants, donc mêmes réglages éprouvés :
 *
 * - **Calendly s'ouvre prérempli** avec le contact gardé par l'opt-in de
 *   Course modèle (prénom et e-mail ; nom et téléphone quand on les a, en
 *   question `a1`), sans rien faire passer par l'adresse ;
 * - un lien d'e-mail de la séquence peut aussi porter le contact
 *   (`?prenom={{contact.first_name | url_encode}}&email={{contact.email_address | url_encode}}…`) : relevé
 *   en tête de page, avant le formulaire, par `lib/contact-lien.ts` ;
 * - l'iframe part pendant la lecture du HTML et prend la hauteur que
 *   Calendly annonce : on ne défile jamais dedans ;
 * - les balises `utm_*` de la page passent à Calendly.
 *
 * **L'événement est celui de ce tunnel**, « Candidature Funnels Club (N) »
 * (voir `appelCourseModele.calendly`), dont la confirmation renvoie sur
 * `/course-modele/thanks`.
 */
export const metadata: Metadata = {
  title: { absolute: `${appelCourseModele.titrePage} · Funnels Club` },
  alternates: { canonical: `https://go.funnels.club${CHEMINS_COURSE_MODELE.appel}` },
};

export default function AppelCourseModele() {
  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      {/* **Le relevé du lien d'e-mail**, en HTML brut et avant le formulaire :
          Calendly lit le contact pendant la lecture du HTML, il doit donc y
          être rangé avant. Voir `lib/contact-lien.ts`. */}
      <div
        hidden
        dangerouslySetInnerHTML={{
          __html: `<script>${scriptContactEspace}</script>`,
        }}
      />
      {/* La visite compte dans le tunnel « Course modèle » du CRM. */}
      <CompteurVue tunnel="course-modele" etape="appel" />
      {/* Et, sous l'adresse de l'opt-in, qui y est passé : la colonne
          « Page d'appel » de l'onglet Inscription du CRM. */}
      <VisiteAppelCrm />
      {/* Le formulaire d'abord, sans bannière ni logo ni titre, sur demande
          de Rémy. */}
      <div className="mx-auto max-w-[72rem] px-5 pt-6 sm:px-8 sm:pt-10">
        <FormulaireCalendly
          url={appelCourseModele.calendly}
          titre={appelCourseModele.titreFormulaire}
          hauteurMin={reservationAppel.hauteurMin}
          telephone={appelCourseModele.questionTelephone}
          reponsesVsl={false}
          clair
        />
      </div>
    </main>
  );
}
