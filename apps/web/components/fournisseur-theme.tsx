"use client";

import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { usePathname } from "next/navigation";

/**
 * Les pages qui ne connaissent que le thème clair, sans bascule.
 *
 * **`/appel`, sur décision de Rémy** : le formulaire de Calendly y est blanc
 * quoi qu'il arrive, et une page sombre autour de lui le faisait trancher.
 * **`/thanks`**, qui reprend `/appel` à l'identique.
 */
const PAGES_CLAIRES = ["/appel", "/thanks"] as const;

/**
 * Le fournisseur de thème du site, qui force le clair sur `PAGES_CLAIRES`.
 *
 * **Le forçage se fait ici, sur le fournisseur racine, et ne peut pas se
 * faire ailleurs** : `next-themes` ignore un second fournisseur imbriqué, il
 * se contente de rendre ses enfants. Un `ThemeProvider forcedTheme="light"`
 * posé dans le gabarit d'`/appel` n'aurait donc rien fait.
 *
 * `forcedTheme` n'écrit rien dans le stockage : la préférence du visiteur est
 * gardée, et il la retrouve sur les autres pages. Le chemin est connu au rendu
 * serveur, donc le script de `next-themes` pose le clair avant la première
 * peinture, sans éclair sombre.
 */
export function FournisseurTheme({
  defaultTheme,
  children,
}: {
  defaultTheme: string;
  children: React.ReactNode;
}) {
  const chemin = usePathname();
  const clair = PAGES_CLAIRES.some(
    (racine) => chemin === racine || chemin?.startsWith(`${racine}/`),
  );

  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      forcedTheme={clair ? "light" : undefined}
    >
      {children}
    </ThemeProvider>
  );
}
