import { EnTete } from "@/components/en-tete";
import { PiedDePage } from "@/components/pied-de-page";
import { identite } from "@/contenu/site";
import { Toaster } from "@repo/ui/components/sonner";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

// Deux fontes, deux rôles, et aucun chevauchement.
//
// Passionfroot associe New Kansas, un serif chaud, aux grands titres, et Nunito
// Sans à tout le reste. New Kansas est sous licence Adobe et ne peut pas être
// servie par `next/font/google` ; Fraunces la remplace. C'est le serif libre le
// plus proche : même chaleur, mêmes empattements adoucis, et ses axes `SOFT` et
// `WONK` permettent de l'arrondir davantage si le rendu paraît trop sec.
//
// Nunito Sans, elle, est celle de passionfroot, à l'identique.
const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
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
      className={`${nunito.variable} ${fraunces.variable}`}
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
