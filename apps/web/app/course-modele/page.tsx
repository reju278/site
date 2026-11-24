import { BanniereGenesis } from "@/components/banniere-genesis";
import { CompteurVue } from "@/components/compteur-vue";
import { InscriptionCourseModele } from "@/components/inscription-course-modele";
import { optinCourseModele, type Segment } from "@/contenu/course-modele";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import { Fragment } from "react";

/**
 * « Course modèle », `go.funnels.club/course-modele` : la copie de
 * `funnels.club/course-2025-fb`, sur demande de Rémy.
 *
 * **Le contenu est celui de la page ClickFunnels** (titre, sous-titre,
 * accroche, quatre points, photo, fenêtre d'inscription) ; **la structure est
 * celle de Formation Genesis** : son gabarit, sa bannière, ses polices, son
 * bouton, ses champs, son compteur de visites et son tunnel dans le CRM. La
 * mise en page est celle que Genesis avait à sa première version, relevée
 * sur la même famille de pages ClickFunnels : le titre et le sous-titre
 * surligné, puis la photo à gauche, l'accroche, la liste et le bouton à
 * droite. Le bouton ouvre la fenêtre (`InscriptionCourseModele`).
 */
export const metadata: Metadata = {
  title: { absolute: optinCourseModele.titrePage },
  description: optinCourseModele.description,
  alternates: { canonical: "https://go.funnels.club/course-modele" },
  openGraph: {
    title: optinCourseModele.titrePage,
    description: optinCourseModele.description,
    url: "https://go.funnels.club/course-modele",
    images: [
      {
        url: optinCourseModele.photo.src,
        width: optinCourseModele.photo.largeur,
        height: optinCourseModele.photo.hauteur,
        alt: optinCourseModele.photo.alt,
      },
    ],
  },
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

export default function CourseModele() {
  const { titre, sousTitre, photo, accroche, points } = optinCourseModele;

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      {/* La visite compte dans le tunnel « Course modèle » du CRM. */}
      <CompteurVue tunnel="course-modele" etape="optin" />
      <BanniereGenesis />

      <header className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        {/* Le seul `h1` de la page : le titre de la page ClickFunnels.
            **Sur une ligne en large**, comme la référence : à 44 px et à
            l'espacement de Genesis, il demande 930 px pour 896 de colonne
            et passait sur deux lignes jusque sur un grand écran. 40 px le
            font tenir dès 1 024 px de large. */}
        <h1 className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance lg:text-[2.5rem]">
          {insecables(titre)}
        </h1>
        <p className="mt-3 text-lg leading-[1.6] tracking-[0.02em] text-pretty sm:text-2xl">
          <span className="bg-[var(--genesis-surligne)] box-decoration-clone">
            <Phrase segments={sousTitre} />
          </span>
        </p>
      </header>

      {/* La photo à gauche, l'accroche, la liste et le bouton à droite.
          Empilés sur téléphone, la photo en premier comme sur la page
          ClickFunnels, **et un premier bouton juste sous elle** : sur
          téléphone, la page en a deux, l'un sous la photo, l'autre au
          bout de la liste. */}
      <section
        aria-label="Inscription"
        className="mx-auto grid max-w-[1065px] grid-cols-1 items-start gap-6 px-5 pt-6 sm:px-8 md:grid-cols-2 md:gap-8 md:pt-8"
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.largeur}
          height={photo.hauteur}
          fetchPriority="high"
          className="aspect-video w-full object-cover"
        />
        <div className="md:hidden">
          <InscriptionCourseModele />
        </div>
        <div className="flex flex-col gap-4 text-[17px] leading-[1.5] sm:text-xl">
          <p className="text-pretty">
            <Phrase segments={accroche} />
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-7 marker:text-[var(--genesis-encre)]">
            {points.map((point) => (
              <li key={point.suite} className="text-pretty">
                {point.surligne ? (
                  <>
                    <span className="bg-[var(--genesis-rose)] box-decoration-clone">
                      {point.surligne}
                    </span>{" "}
                  </>
                ) : null}
                {insecables(point.suite)}
              </li>
            ))}
          </ul>
          <InscriptionCourseModele />
        </div>
      </section>
    </main>
  );
}
