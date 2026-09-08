"use client";

import { Button } from "@repo/ui/components/button";
import { useTheme } from "next-themes";

export default function Accueil() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6">
      <h1 className="text-2xl font-medium text-foreground">Site</h1>
      <p className="text-muted-foreground">La stack est montée.</p>
      <Button
        variant="outline"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        Basculer le thème
      </Button>
    </main>
  );
}
