"use client";

import { poigneeWistia } from "@/lib/wistia-poignee";
import { useEffect, useState } from "react";

/**
 * **Où une vidéo s'est arrêtée**, gardé dans le navigateur, sur demande de
 * Rémy pour Course modèle : la VSL (`/course-modele/vsl`) le note, la
 * confirmation (`/course-modele/thanks`) le dit (« Tu as arrêté la vidéo de
 * formation à 2 min 30 ») et y reprend la vidéo.
 *
 * Dans le navigateur et non par l'adresse e-mail : le CRM ne relit Wistia
 * que toutes les demi-heures, donc juste après une réservation il ne saurait
 * souvent rien ; et une adresse publique qui dirait « où s'est arrêtée telle
 * adresse » ouvrirait à n'importe qui le visionnage d'un autre. La personne
 * réserve presque toujours depuis le navigateur où elle regardait. Sur un
 * autre appareil, la confirmation propose simplement de regarder la vidéo.
 */

type Arret = {
  /** La seconde où la vidéo s'est arrêtée. */
  temps: number;
  /** Vue jusqu'au bout. */
  fin: boolean;
  /** Quand c'était. */
  t: number;
};

const cle = (id: string) => `video-arret:${id}`;
/** Au-delà d'une semaine, on n'en parle plus. */
const DUREE_DE_VIE = 7 * 24 * 60 * 60 * 1000;

function ecrire(id: string, arret: Omit<Arret, "t">) {
  try {
    localStorage.setItem(cle(id), JSON.stringify({ ...arret, t: Date.now() }));
  } catch {
    /* Stockage bloqué : la confirmation proposera de regarder la vidéo. */
  }
}

export function lireArret(id: string): Arret | null {
  try {
    const brut = localStorage.getItem(cle(id));
    if (!brut) return null;
    const arret = JSON.parse(brut) as Partial<Arret>;
    if (typeof arret.temps !== "number" || typeof arret.t !== "number")
      return null;
    if (Date.now() - arret.t > DUREE_DE_VIE) return null;
    return { temps: arret.temps, fin: arret.fin === true, t: arret.t };
  } catch {
    return null;
  }
}

/** 150 secondes : « 2 min 30 » ; 45 : « 45 s » ; 3 720 : « 1 h 02 ». */
export function dureeLisible(secondes: number) {
  const s = Math.max(0, Math.floor(secondes));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const reste = s % 60;
  if (h > 0) return `${h} h ${String(m).padStart(2, "0")}`;
  if (m > 0) return `${m} min ${String(reste).padStart(2, "0")}`;
  return `${reste} s`;
}

/**
 * Sur la VSL : écoute le lecteur (`LecteurVideo pilotable`) et note où il en
 * est, toutes les trois secondes de lecture, à chaque pause, à la fin et au
 * départ de la page. Le script de Wistia n'est demandé qu'une seconde et
 * demie après l'ouverture, une fois la page peinte.
 */
export function SuiviArretVideo({ id }: { id: string }) {
  useEffect(() => {
    let dernier = 0;
    let ecritLe = 0;
    let fini = false;
    const noter = () => ecrire(id, { temps: dernier, fin: fini });
    const quitter = () => {
      if (dernier > 0) noter();
    };
    window.addEventListener("pagehide", quitter);
    const depart = window.setTimeout(() => {
      void poigneeWistia(id).then((video) => {
        video.bind?.("secondchange", (seconde) => {
          if (typeof seconde !== "number") return;
          dernier = seconde;
          if (Date.now() - ecritLe > 3000) {
            ecritLe = Date.now();
            noter();
          }
        });
        video.bind?.("pause", () => {
          const maintenant = video.time?.();
          if (typeof maintenant === "number") dernier = maintenant;
          noter();
        });
        video.bind?.("end", () => {
          fini = true;
          noter();
        });
      });
    }, 1500);
    return () => {
      window.clearTimeout(depart);
      window.removeEventListener("pagehide", quitter);
    };
  }, [id]);
  return null;
}

/**
 * Sur la confirmation : où la personne s'est arrêtée, lu après le rendu
 * (le serveur n'en sait rien). `null` tant qu'on n'a pas lu, ou si rien
 * n'est noté.
 */
export function useArretVideo(id: string) {
  const [arret, setArret] = useState<Arret | null>(null);
  useEffect(() => setArret(lireArret(id)), [id]);
  return arret;
}
