"use client";

import { LecteurYoutube } from "@/components/lecteur-youtube";
import { videoDepartZero } from "@/contenu/thanks";
import { useReservation } from "@/lib/reservation";
import type { CSSProperties } from "react";

/**
 * La vidéo réservée à qui démarre de zéro, sur demande de Rémy : elle ne paraît
 * que si le quiz porte cette réponse. Sans quiz, ni réponse, rien ne s'affiche.
 * Dessinée comme la vidéo de Roland, juste en dessous : sans carte.
 */
export function VideoDepartZero() {
  const r = useReservation();
  const concerne = r?.reponsesQuiz.some((ligne) =>
    ligne.reponse.includes(videoDepartZero.reponse),
  );
  if (!concerne) return null;

  const debut = videoDepartZero.titre(r?.prenom);
  const titre = `${debut} ${videoDepartZero.surligne}`;
  return (
    <section className="px-5 pt-20 sm:pt-24">
      <div className="mx-auto w-full max-w-[calc(var(--largeur-video)-2rem)] sm:max-w-[calc(var(--largeur-video)-3rem)]">
        <h2 className="titre mx-auto max-w-3xl text-center text-2xl text-balance text-foreground sm:text-3xl">
          {debut}{" "}
          <span
            className="surlignage"
            style={
              {
                "--surlignage-fond":
                  "color-mix(in srgb, var(--surlignage-jaune) 45%, transparent)",
              } as CSSProperties
            }
          >
            {videoDepartZero.surligne}
          </span>
        </h2>
        <div className="mt-6 rounded-md shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55),0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/25">
          <LecteurYoutube
            id={videoDepartZero.id}
            titre={titre}
            affiche={`/temoignages/${videoDepartZero.id}.jpg`}
          />
        </div>
      </div>
    </section>
  );
}
