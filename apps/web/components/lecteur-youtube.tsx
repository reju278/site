"use client";

import { Play } from "lucide-react";
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
    <div className="relative aspect-16/9 overflow-hidden rounded-md bg-black">
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
          className="group absolute inset-0 size-full cursor-pointer"
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
          <span className="bg-primary text-primary-foreground absolute top-1/2 left-1/2 flex h-12 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md transition-transform group-hover:scale-105 sm:h-14 sm:w-20">
            <Play aria-hidden className="size-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
