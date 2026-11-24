import { BanniereGenesis } from "@/components/banniere-genesis";
import { BoutonGenesis } from "@/components/bouton-genesis";
import { CompteurVue } from "@/components/compteur-vue";
import { LecteurVideo } from "@/components/lecteur-video";
import { TitreReservationGenesis } from "@/components/titre-reservation-genesis";
import { VitesseVideo } from "@/components/vitesse-video";
import {
  CHEMINS_COURSE_MODELE,
  videoCourseModele,
  type Segment,
} from "@/contenu/course-modele";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import { Fragment } from "react";
import { preload } from "react-dom";

/**
 * La vidéo de Course modèle, `go.funnels.club/course-modele/video`, où l'on
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

export default function VideoCourseModele() {
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
      <BanniereGenesis />

      <div className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        {/* Le titre de Rémy suivi du prénom laissé à l'opt-in, lu dans le
            navigateur après le rendu : sans lui, « Ta formation offerte ». */}
        <TitreReservationGenesis
          titre={titre}
          separateur=" "
          className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance"
        />
        <div className="mt-5 sm:mt-6">
          <LecteurVideo
            id={video.id}
            titre={video.titre}
            secondes={video.secondes}
            affiche={video.affiche}
            afficheAlt="La formation gratuite Funnels Club"
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
        <div className="mt-3">
          <VitesseVideo id={video.id} />
        </div>
        <p className="mt-5 text-[17px] leading-[1.5] text-pretty sm:mt-6 sm:text-xl">
          <Phrase segments={appel} />
        </p>
        <BoutonGenesis
          href={CHEMINS_COURSE_MODELE.appel}
          nouvelOnglet
          // À la largeur de son texte en grand, comme sur la référence ;
          // pleine largeur sur téléphone, où le pouce le trouve.
          className="mt-5 sm:mt-6 sm:w-fit sm:px-10"
        >
          {bouton}
        </BoutonGenesis>
      </div>
    </main>
  );
}
