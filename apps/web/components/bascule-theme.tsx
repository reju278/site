"use client";

import { AnimatedThemeToggler } from "@repo/ui/components/animated-theme-toggler";
import { cn } from "@repo/ui/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * La bascule entre thème clair et thème sombre.
 *
 * Le composant de MagicUI est employé **en mode contrôlé** : on lui passe le
 * thème courant et un rappel, et c'est `next-themes` qui garde la valeur. Sans
 * cela il écrirait lui-même dans le stockage local, en concurrence avec
 * `next-themes`, et les deux finiraient par diverger.
 *
 * Il anime la transition avec l'API View Transitions, un disque qui s'ouvre
 * depuis le bouton. Les navigateurs qui ne la connaissent pas basculent
 * simplement d'un thème à l'autre, et `globals.css` la neutralise sous
 * `prefers-reduced-motion`.
 *
 * Tout ce qui dépend du thème passe par `monte`, l'étiquette d'accessibilité
 * comprise : au rendu serveur, le navigateur n'a pas encore dit ce qu'il
 * préfère, et l'oublier fait diverger le HTML du serveur du rendu client.
 */
export function BasculeTheme({ surImage = false }: { surImage?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [monte, setMonte] = useState(false);

  useEffect(() => setMonte(true), []);

  const sombre = monte && resolvedTheme === "dark";

  return (
    <AnimatedThemeToggler
      theme={sombre ? "dark" : "light"}
      onThemeChange={setTheme}
      variant="circle"
      duration={500}
      aria-label={sombre ? "Passer au thème clair" : "Passer au thème sombre"}
      // 40 px au doigt, 36 px à la souris : la cible tactile prime sur le
      // gabarit de bureau tant qu'on est sur un écran étroit.
      className={cn(
        "flex size-10 items-center justify-center rounded-md transition-colors duration-300 sm:size-9",
        "[&_svg]:size-4",
        // Sur l'image du hero, le jeton `foreground` serait sombre sur sombre
        // dans le thème clair : l'icône y passe en blanc.
        surImage
          ? "text-white hover:bg-white/15"
          : "text-foreground hover:bg-accent",
      )}
    />
  );
}
