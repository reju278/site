import { BoutonGenesis } from "@/components/bouton-genesis";
import { SuiviArretVideo } from "@/components/arret-video";
import { CompteurVue } from "@/components/compteur-vue";
import {
  PastilleReservations,
  SEUIL_PASTILLE,
} from "@/components/pastille-reservations";
import { LecteurVideo } from "@/components/lecteur-video";
import { TitreReservationGenesis } from "@/components/titre-reservation-genesis";
import { VitesseVideo } from "@/components/vitesse-video";
import {
  CHEMINS_COURSE_MODELE,
  videoCourseModele,
  type Segment,
} from "@/contenu/course-modele";
import { API_FUNNELS } from "@/contenu/vsl";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import { Fragment } from "react";
import { preload } from "react-dom";

/**
 * La vidéo de Course modèle, `go.funnels.club/course-modele/vsl`, où l'on
 * arrive après l'opt-in : la page de `funnels.club/vsl-2025-fb`, au mot près,
 * sur la structure de Formation Genesis (bannière, PT Serif, angles droits,
 * bouton bleu), sur demande de Rémy.
 *
 * Le titre, la vidéo (« VSL 2027 (N) », `videoCourseModele.video`), la
 * phrase d'appel et le bouton. **Le bouton mène à la prise
 * d'appel dans un nouvel onglet**, comme sur `/video-vsl` et dans l'espace de
 * Genesis : la vidéo reste ouverte derrière. Le nouvel onglet partage le
 * contact gardé par l'opt-in, dont Calendly se préremplit.
 *
 * Sur la page ClickFunnels, ce bouton ouvrait une ancienne fenêtre d'opt-in
 * (« Accéder à la vidéo GRATUITE ») : un reste, qu'on ne reprend pas.
 */
export const metadata: Metadata = {
  title: { absolute: `${videoCourseModele.titrePage} · Funnels Club` },
  alternates: { canonical: `https://go.funnels.club${CHEMINS_COURSE_MODELE.video}` },
};

function Phrase({ segments }: { segments: Segment[] }) {
  return segments.map((segment, i) =>
    typeof segment === "string" ? (
      <Fragment key={i}>{insecables(segment)}</Fragment>
    ) : (
      <strong key={i}>{segment.gras}</strong>
    ),
  );
}

/**
 * Le nombre réel de réservations des dernières 24 heures, compté par le CRM,
 * pour la pastille sous le bouton. Lu côté serveur et gardé dix minutes :
 * il reste le même pendant qu'on regarde, et la page ne fait pas une
 * lecture par visiteur. `null` si le CRM ne répond pas : pas de pastille.
 */
async function reservationsRecentes(): Promise<number | null> {
  try {
    const reponse = await fetch(
      `${API_FUNNELS}/course-modele/reservations-recentes`,
      { next: { revalidate: 600 }, signal: AbortSignal.timeout(2500) },
    );
    if (!reponse.ok) return null;
    const { nombre } = (await reponse.json()) as { nombre?: unknown };
    return typeof nombre === "number" ? nombre : null;
  } catch {
    return null;
  }
}

export default async function VideoCourseModele() {
  const reservations = await reservationsRecentes();
  const { video, titre, appel, bouton } = videoCourseModele;
  // L'affiche relayée depuis Wistia (`app/affiches`), celle que le lecteur
  // demande pour une copie de `public/temoignages`.
  preload(`/affiches/${video.id}.webp`, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: `/affiches/${video.id}-640.webp 640w, /affiches/${video.id}-960.webp 960w, /affiches/${video.id}.webp 1280w`,
    imageSizes: "(min-width: 1216px) 1216px, 100vw",
  });

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      {/* Les domaines que le lecteur de Wistia contacte, ouverts pendant la
          lecture du HTML, comme sur `/video-vsl` (voir son commentaire). */}
      <link rel="preconnect" href="https://fast.wistia.net" />
      <link rel="preconnect" href="https://fast.wistia.com" />
      <link rel="preconnect" href="https://embed-ssl.wistia.com" />
      <link rel="preconnect" href="https://embed-cloudfront.wistia.com" />
      {/* La visite compte dans le tunnel « Course modèle » du CRM. */}
      <CompteurVue tunnel="course-modele" etape="video" />
      {/* Où la vidéo s'arrête, gardé dans le navigateur : la confirmation
          le dit et y reprend la vidéo (`arret-video.tsx`). */}
      <SuiviArretVideo id={video.id} />

      {/* Sans bannière ni logo, et tout au centre, sur demande de Rémy : le
          titre, la vidéo, la phrase et le bouton. */}
      <div className="mx-auto max-w-[960px] px-5 pt-8 text-center sm:px-8 sm:pt-12">
        {/* Le titre de Rémy suivi du prénom laissé à l'opt-in, lu dans le
            navigateur après le rendu : sans lui, « Ta formation offerte ». */}
        <TitreReservationGenesis
          titre={titre}
          separateur=" "
          className="text-center text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance"
        />
        {/* Un cadre fin du bleu des commandes du lecteur, sur demande de
            Rémy. */}
        <div className="mt-5 border-2 border-[var(--genesis-bleu)] text-left sm:mt-6">
          <LecteurVideo
            id={video.id}
            titre={video.titre}
            secondes={video.secondes}
            affiche={video.affiche}
            afficheAlt="La formation gratuite Funnels Club"
            couleur={video.couleur}
            natif
            prioritaire
            carre
            pilotable
            // L'adresse de l'opt-in au lecteur : le CRM sait ensuite qui a
            // vu la vidéo, et jusqu'où (tableau Inscription).
            emailContact
          />
        </div>
        {/* La vitesse de lecture, sous le lecteur, sur demande de Rémy : elle
            règle le lecteur de Wistia lui-même. */}
        <div className="mt-3 flex justify-center">
          <VitesseVideo id={video.id} />
        </div>
        <p className="mt-5 text-center text-[17px] leading-[1.5] text-balance sm:mt-6 sm:text-xl">
          <Phrase segments={appel} />
        </p>
        <div className="mt-5 flex justify-center sm:mt-6">
          <BoutonGenesis
            href={CHEMINS_COURSE_MODELE.appel}
            nouvelOnglet
            // Plus grand sur ordinateur, et plus large que la pastille en
            // dessous, sur demande de Rémy ; pleine largeur sur téléphone, où
            // le pouce le trouve.
            className="w-full sm:min-h-16 sm:w-fit sm:min-w-[35rem] sm:px-14 sm:text-[21px]"
          >
            {bouton}
          </BoutonGenesis>
        </div>
        {/* Sous le bouton, le nombre réel de réservations des dernières
            24 heures, sur demande de Rémy (voir `PastilleReservations`). */}
        {reservations !== null && reservations >= SEUIL_PASTILLE ? (
          <div className="mt-4 flex justify-center">
            <PastilleReservations nombre={reservations} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
