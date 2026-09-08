import { EnTete } from "@/components/en-tete";
import { PiedDePage } from "@/components/pied-de-page";
import { identite } from "@/contenu/site";
import { Toaster } from "@repo/ui/components/sonner";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import type { Metadata } from "next";
import { Instrument_Serif, Nunito_Sans } from "next/font/google";
import "./globals.css";

// Deux fontes, deux rôles, et aucun chevauchement.
//
// Instrument Serif est celle des titres de funnels.club, vérifiée dans leur
// feuille de style et non supposée. Elle vient d'ailleurs que passionfroot,
// et c'est voulu : la mise en page est empruntée, la voix typographique reste
// celle de la marque.
//
// Nunito Sans, pour le texte, est celle de passionfroot, à l'identique.
const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-titre",
  display: "swap",
});

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
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${nunito.variable} ${instrumentSerif.variable}`}
    >
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
