import { EnTete } from "@/components/en-tete";
import { PiedDePage } from "@/components/pied-de-page";
import { identite } from "@/contenu/site";
import { Toaster } from "@repo/ui/components/sonner";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Une seule graisse variable, resserrée sur les titres par `tracking-tight`.
// C'est le resserrage qui donne le ton, pas le choix de la fonte.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// L'onglet porte le nom de l'écran, pas celui du logiciel : dix onglets ouverts
// sur le même nom ne se distinguent plus.
export const metadata: Metadata = {
  metadataBase: new URL("https://remy-jupille.com"),
  title: {
    default: `${identite.nom} · ${identite.promesse}`,
    template: `%s · ${identite.nom}`,
  },
  description: identite.resume,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: identite.nom,
    title: `${identite.nom} · ${identite.promesse}`,
    description: identite.resume,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <EnTete />
            <main className="flex-1">{children}</main>
            <PiedDePage />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
