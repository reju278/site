import { PiedGenesis } from "@/components/gabarit-genesis";
import { CompteurVue } from "@/components/compteur-vue";
import {
  FenetreCourseModele,
  InscriptionCourseModele,
  OuvreInscription,
} from "@/components/inscription-course-modele";
import {
  optinCourseModele,
  optinCourseModeleB,
  type Segment,
} from "@/contenu/course-modele";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import { Fragment } from "react";

/**
 * **La version B de l'opt-in** de « Course modèle » (« Direct Webinar (N) »
 * dans le CRM), `go.funnels.club/course-modele/zvb5y`, pour le test A/B
 * demandé par Rémy le 24 novembre 2026. `/course-modele` y envoie la moitié
 * des visiteurs (`route.ts`).
 *
 * **La structure d'une page que Rémy a montrée**, avec les couleurs, les
 * polices et la photo du tunnel : le titre au milieu en haut, l'astérisque
 * dessous, puis une carte blanche à ombre douce (celle de la fenêtre
 * d'inscription), la photo à gauche, la promesse, la liste et le bouton à
 * droite. Empilés sur téléphone, dans le même ordre. La photo et le bouton
 * ouvrent **la même fenêtre** que la version A, qui dit au CRM de quelle
 * version vient l'inscription (`version="b"`).
 */
export const metadata: Metadata = {
  title: { absolute: optinCourseModele.titrePage },
  description: optinCourseModele.description,
  alternates: { canonical: "https://go.funnels.club/course-modele" },
};

/** Une phrase en morceaux : le texte, ses passages en gras. */
function Phrase({ segments }: { segments: Segment[] }) {
  return segments.map((segment, i) =>
    typeof segment === "string" ? (
      <Fragment key={i}>{insecables(segment)}</Fragment>
    ) : (
      <strong key={i}>{segment.gras}</strong>
    ),
  );
}

export default function CourseModeleB() {
  const { photo } = optinCourseModele;
  const { titre, note, promesse, points, bouton } = optinCourseModeleB;

  return (
    <>
      <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
        <FenetreCourseModele version="b">
          {/* La visite compte dans l'opt-in du CRM, et dans sa version B. */}
          <CompteurVue tunnel="course-modele" etape="optin" />
          <CompteurVue tunnel="course-modele" etape="optin-b" />

          <header className="mx-auto max-w-[1000px] px-5 pt-10 text-center sm:px-8 sm:pt-16">
            {/* Le titre au milieu, en grand, ses mots-clés en gras. */}
            <h1 className="text-[clamp(1.875rem,7.2vw,3.25rem)] leading-[1.15] font-normal tracking-[0.01em] text-balance">
              <Phrase segments={titre} />
            </h1>
            {/* Bien plus gros que la référence, sur demande de Rémy. */}
            <p className="mt-3 text-xl sm:mt-4 sm:text-3xl">{note}</p>
          </header>

          <section
            aria-label="Inscription"
            className="mx-auto max-w-[1142px] px-5 pt-8 pb-12 sm:px-8 sm:pt-10 sm:pb-16"
          >
            <div className="grid grid-cols-1 gap-6 bg-white p-4 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-8">
              {/* La photo du tunnel, avec le bouton lecture de la référence :
                  elle ouvre la fenêtre, comme celle de la version A. */}
              <OuvreInscription libelle={bouton} className="relative w-full">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.largeur}
                  height={photo.hauteur}
                  fetchPriority="high"
                  className="aspect-video w-full object-cover"
                />
                {/* « Cliquez pour activer le son », comme sur la référence,
                    sur demande de Rémy : la photo se lit comme une vidéo.
                    **En bas à droite et plus petite sur téléphone** : en
                    haut, elle masquait le visage. */}
                <span
                  aria-hidden
                  data-rond
                  className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white sm:top-4 sm:right-4 sm:bottom-auto sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  Cliquez pour activer le son
                  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 sm:size-4">
                    <path
                      d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span
                  aria-hidden
                  className="absolute top-1/2 left-1/2 flex h-[18%] min-h-11 w-[15%] min-w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[color-mix(in_srgb,var(--genesis-bleu)_88%,transparent)]"
                >
                  <svg viewBox="0 0 24 24" className="h-1/2 w-auto text-white">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
              </OuvreInscription>
              {/* Sur téléphone, un premier bouton juste sous l'image, comme
                  sur la version A, sur demande de Rémy. */}
              <div className="md:hidden">
                <InscriptionCourseModele
                  libelle={bouton}
                  className="min-h-14 px-4 text-[18px] normal-case"
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-lg leading-snug font-bold sm:text-xl">
                  {promesse}
                </p>
                <ul className="flex flex-col gap-2 text-[17px] leading-[1.5] sm:text-lg">
                  {points.map((point) => (
                    <li key={point} className="flex gap-2 text-pretty">
                      {/* La petite flèche de la référence, au bleu du
                          tunnel. */}
                      <span
                        aria-hidden
                        className="mt-[0.55em] size-0 shrink-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-[var(--genesis-bleu)]"
                      />
                      <span>{insecables(point)}</span>
                    </li>
                  ))}
                </ul>
                <InscriptionCourseModele
                  libelle={bouton}
                  className="mt-2 min-h-14 px-4 text-[18px] normal-case sm:min-h-16 sm:text-2xl"
                />
              </div>
            </div>
          </section>
        </FenetreCourseModele>
      </main>
      {/* Le pied de page, comme sur la version A. */}
      <PiedGenesis />
    </>
  );
}
