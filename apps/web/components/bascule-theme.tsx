"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Le thème n'est connu qu'une fois le composant monté : au rendu serveur, le
 * navigateur n'a pas encore dit ce qu'il préfère.
 *
 * Tout ce qui dépend du thème passe donc par `monte`, l'étiquette
 * d'accessibilité comprise. L'oublier sur l'étiquette suffit à faire diverger
 * le HTML serveur du rendu client, et React s'en plaint à chaque chargement.
 */
export function BasculeTheme({ surImage = false }: { surImage?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [monte, setMonte] = useState(false);

  useEffect(() => setMonte(true), []);

  const sombre = monte && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      // 40 px au doigt, 36 px à la souris : la cible tactile prime sur le
      // gabarit par défaut de shadcn tant qu'on est sur un écran étroit.
      className={cn(
        "size-10 transition-colors duration-300 sm:size-9",
        // Sur l'image du hero, le jeton `foreground` serait sombre sur sombre
        // dans le thème clair : l'icône y passe en blanc.
        surImage && "text-white hover:bg-white/10 hover:text-white"
      )}
      aria-label={sombre ? "Passer au thème clair" : "Passer au thème sombre"}
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    >
      {sombre ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
