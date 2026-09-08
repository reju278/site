import { Toaster } from "@repo/ui/components/sonner";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import type { Metadata } from "next";
import { ConvexClientProvider } from "./_providers/convex";
import "./globals.css";

// L'onglet porte le nom de l'écran, pas celui du logiciel : dix onglets ouverts
// sur le même nom ne se distinguent plus.
export const metadata: Metadata = {
  title: { default: "Site", template: "%s · Site" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
