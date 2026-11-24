import type { CSSProperties, ReactNode } from "react";

/**
 * « Vidéo 1/2 », surligné en jaune pour sauter aux yeux, demandé par Rémy.
 * Devant le titre des vidéos des confirmations : `/thanks` et celle de
 * Course modèle (`/course-modele/thanks`).
 */
export function NumeroVideo({ children }: { children: ReactNode }) {
  return (
    <span
      className="surlignage"
      style={
        {
          "--surlignage-fond":
            "color-mix(in srgb, var(--surlignage-jaune) 45%, transparent)",
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
