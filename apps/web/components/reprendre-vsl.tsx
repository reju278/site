"use client";

import { dureeLisible, useArretVideo } from "@/components/arret-video";
import { LecteurVideo } from "@/components/lecteur-video";
import {
  confirmationCourseModele,
  videoCourseModele,
} from "@/contenu/course-modele";
import { insecables } from "@/lib/typographie";

/** En dessous de quinze secondes, on n'a pas vraiment commencé. */
const COMMENCEE = 15;
/** Dans les trente dernières secondes, on l'a vue jusqu'au bout. */
const PRESQUE_FINIE = 30;

/**
 * La VSL sur la confirmation de Course modèle, sur demande de Rémy, à la
 * place de la seconde vidéo de `/thanks` : « Tu as arrêté la vidéo de
 * formation à 2 min 30. Finis-la avant ton rendez-vous ». Où elle s'est
 * arrêtée vient du navigateur, noté par la VSL (`SuiviArretVideo`, voir
 * `arret-video.tsx`). Sans trace (un autre appareil), la phrase invite
 * simplement à la regarder.
 *
 * **Le lecteur est celui de la VSL, brut**, sur demande de Rémy : même
 * cadre, même bleu, et la miniature vidéo réglée dans Wistia. **C'est
 * Wistia qui reprend à 2 min 30**, par sa reprise à lui (la barre montre
 * l'endroit, le bouton lecture y repart), comme sur la VSL. Lui imposer
 * l'instant (`debut`, l'option `time`) faisait sauter cette miniature au
 * profit de l'image fixe de l'instant, sans bouton lecture. Une boucle
 * posée par-dessus a aussi été essayée, et retirée : une surcouche.
 */
export function ReprendreVsl() {
  const { video } = videoCourseModele;
  const textes = confirmationCourseModele.vsl;
  const arret = useArretVideo(video.id);
  const finie =
    arret !== null &&
    (arret.fin || arret.temps >= video.secondes - PRESQUE_FINIE);
  const arretee = arret !== null && !finie && arret.temps >= COMMENCEE;
  const { titre, texte } = arretee
    ? {
        titre: textes.arretee.titre.replace(
          "{temps}",
          dureeLisible(arret.temps),
        ),
        texte: textes.arretee.texte,
      }
    : finie
      ? textes.finie
      : textes.aVoir;

  return (
    <section className="mx-auto max-w-[960px] px-5 pt-10 text-center sm:px-8 sm:pt-14">
      <h2 className="titre text-[1.375rem] leading-tight text-balance sm:text-3xl">
        {insecables(titre)}
      </h2>
      <p className="mt-3 text-[17px] leading-[1.5] text-balance sm:text-xl">
        {insecables(texte)}
      </p>
      <div className="mt-5 border-2 border-[var(--genesis-bleu)] text-left sm:mt-6">
        <LecteurVideo
          id={video.id}
          titre={video.titre}
          secondes={video.secondes}
          affiche={video.affiche}
          afficheAlt={video.titre}
          couleur={video.couleur}
          natif
          carre
          pilotable
        />
      </div>
    </section>
  );
}
