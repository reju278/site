"use client";

import { useState } from "react";

/**
 * Une vidéo YouTube derrière notre affiche : rien ne part chez YouTube avant
 * le clic, comme pour `LecteurVideo`. Le domaine `youtube-nocookie` évite le
 * dépôt de cookies publicitaires à l'ouverture du lecteur.
 *
 * `rel=0` limite les suggestions de fin à la chaîne de la vidéo : YouTube ne
 * permet plus de les retirer, ni de masquer les publicités.
 */
export function LecteurYoutube({
  id,
  titre,
  affiche,
}: {
  id: string;
  titre: string;
  affiche: string;
}) {
  const [lance, setLance] = useState(false);

  return (
    <div className="@container relative aspect-16/9 overflow-hidden rounded-md bg-black">
      {lance ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&iv_load_policy=3`}
          title={titre}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLance(true)}
          aria-label={`Lire la vidéo : ${titre}`}
          className="absolute inset-0 size-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={affiche}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            className="size-full object-cover"
          />
          {/* **Le bouton et le son de Wistia, au pixel**, mesurés sur la vidéo
              1/2 et écrits en largeur de cadre (`cqw`) : ils suivent la taille
              de la vidéo, comme chez Wistia. Bouton : 14,8 % de large, centré
              sur la largeur, à 38 % du haut, et bleu foncé à son propre survol. */}
          <span
            className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center bg-[rgb(4_94_230/0.85)] hover:bg-[rgb(2_16_112/0.92)]"
            style={{ top: "38%", width: "14.8cqw", height: "9.46cqw" }}
          >
            <svg
              aria-hidden
              viewBox="0 0 50 65"
              style={{ width: "2.96cqw", height: "3.84cqw" }}
              className="ml-[0.3cqw] fill-white stroke-white"
              strokeWidth={8}
              strokeLinejoin="round"
            >
              <path d="M4 4l42 28.5L4 61z" />
            </svg>
          </span>
          {/* Un rond de 6,6 % de la largeur, qui s'ouvre vers la gauche au
              survol sur « Cliquez pour activer le son ». */}
          <span
            className="group/son absolute flex items-center rounded-full bg-black/80 text-white"
            style={{
              top: "2.07cqw",
              right: "2.07cqw",
              height: "6.6cqw",
              paddingInline: "2.1cqw",
              fontSize: "2.25cqw",
            }}
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover/son:mr-[1.65cqw] group-hover/son:max-w-[27cqw] group-hover/son:opacity-100">
              Cliquez pour activer le son
            </span>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              style={{ width: "2.4cqw", height: "2.4cqw" }}
              className="shrink-0"
            >
              <path fill="currentColor" d="M2 8.5h5L14 3v18l-7-5.5H2z" />
              <path
                d="M17 8a6 6 0 0 1 0 8"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeWidth={2.2}
                strokeLinecap="round"
              />
              <path
                d="M20 5a10.5 10.5 0 0 1 0 14"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={2.2}
                strokeLinecap="round"
                className="group-hover/son:opacity-0"
              />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
