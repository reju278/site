import { EnTete } from "@/components/en-tete";
import { PiedDePage } from "@/components/pied-de-page";
import { GTM, SITE, identite } from "@/contenu/site";
import { Toaster } from "@repo/ui/components/sonner";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import type { Metadata } from "next";
import { Fraunces, Ms_Madi } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

// Deux fontes, deux rôles, et aucun chevauchement.
//
// Deux polices, deux rôles, et aucun chevauchement. La mise en page est
// empruntée à passionfroot et à calendly.com ; la voix typographique ne vient
// ni de l'un ni de l'autre.
//
// Source Sans Pro porte le texte, sur décision de Rémy. Elle remplace Nunito
// Sans, qui était celle de passionfroot reprise à l'identique.
//
// **Elle est servie depuis le dépôt et non par `next/font/google`**, et ce
// n'est pas un choix esthétique : Google Fonts a retiré Source Sans Pro de son
// catalogue quand Adobe l'a renommée Source Sans 3, et `next/font/google` ne
// propose donc plus que la 3. Rémy veut la Pro.
//
// Les fichiers viennent de la distribution officielle d'Adobe, sous licence
// SIL Open Font 1.1, que cette licence autorise expressément à héberger. Le
// texte de la licence est livré à côté, dans `polices/LICENSE.txt`, parce que
// l'OFL impose qu'il accompagne les fichiers.
//
// Elle porte le **texte**. Les titres sont en Fraunces, voir plus bas.
//
// Sept coupes, et chacune a son emploi : 400 et son italique pour le texte
// courant, 600 et son italique pour les libellés et les boutons, 700 et son
// italique pour les titres et le mot accentué du hero, 900 pour le nom appuyé
// du pied de page.
//
// Les italiques sont livrées et non synthétisées. `titre-fort` pose
// `font-synthesis: none`, ce qui interdit au navigateur de pencher lui-même un
// romain : sans le fichier italique de la bonne graisse, le mot « expertise »
// s'afficherait tout simplement droit.
//
// La variable garde son nom, `--font-nunito` : elle est lue par `@theme` dans
// `globals.css` et par les composants, et la renommer demanderait une passe
// complète pour un gain nul.
const nunito = localFont({
  src: [
    {
      path: "./polices/source-sans-pro-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./polices/source-sans-pro-400-italique.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./polices/source-sans-pro-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./polices/source-sans-pro-600-italique.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./polices/source-sans-pro-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./polices/source-sans-pro-700-italique.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./polices/source-sans-pro-900.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nunito",
  display: "swap",
});

/**
 * Fraunces porte les titres, sur décision de Rémy après un banc d'essai
 * comparant six serifs (`labo/polices-titres.html`).
 *
 * Elle est **variable** et ses axes sont ce qui la rend intéressante ici :
 *
 * - `SOFT` arrondit les angles du dessin. C'est l'axe qui produit exactement
 *   ce que Rémy cherchait, « du serif mais plus arrondi », et il est réglé à
 *   50 dans `globals.css`. Sans lui, Fraunces est une serif anguleuse assez
 *   ordinaire.
 * - `WONK` bascule certaines lettres sur des formes plus fantaisistes. Il est
 *   laissé à zéro : sur un site qui vend un accompagnement, la fantaisie
 *   typographique se paie en crédibilité.
 * - `opsz` adapte le dessin au corps, les navigateurs l'appliquent d'eux-mêmes.
 *   C'est ce qui évite qu'un titre à 60 px et un titre de carte à 30 px
 *   paraissent dessinés par deux mains différentes.
 *
 * Les axes doivent être déclarés ici pour être **présents dans le fichier** ;
 * leurs valeurs se règlent en CSS. Les déclarer sans les régler ne sert à
 * rien, les régler sans les déclarer non plus.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-titre",
  display: "swap",
});

/**
 * La fonte de la signature, et elle ne sert qu'à ça.
 *
 * Ms Madi est une anglaise à plume, d'un seul poids : elle imite une signature
 * manuscrite, ce que Rémy a demandé pour clore son message. Elle n'a aucun autre
 * emploi sur le site, et elle n'en aura pas : une écriture manuscrite qui
 * servirait ailleurs cesserait d'être une signature pour devenir un style.
 *
 * Un seul sous-ensemble et un seul poids, donc une quinzaine de kilooctets pour
 * deux mots. C'est le prix d'une signature, et il est payé une fois.
 *
 * `display: "swap"` comme les autres : le nom s'affiche dans la fonte de
 * remplacement le temps du chargement plutôt que de laisser un trou. Ici le
 * remplacement est très loin de l'originale, mais deux mots qui changent de
 * dessin se remarquent moins qu'un blanc à la fin d'une lettre.
 */
const signature = Ms_Madi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  alternates: { canonical: "/" },
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
      className={`${nunito.variable} ${fraunces.variable} ${signature.variable}`}
    >
      <body className="font-sans antialiased">
        {/* Google Tag Manager.

            `afterInteractive` place le script juste après l'hydratation : GTM
            recommande le haut du `head`, mais un script bloquant y retarde le
            premier rendu, que Google chronomètre par ailleurs. C'est la
            stratégie que Next emploie lui-même pour cette balise.

            Le `noscript` doit rester le premier élément du `body` : c'est le
            seul relevé possible quand JavaScript est coupé, et il ne sert à
            rien s'il arrive après le contenu. Son `title` n'est pas décoratif,
            un lecteur d'écran annonce sinon un cadre anonyme. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM}`}
            title="Google Tag Manager"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* La contre-règle du titre roulant.

            Les mots de `TitreRoulant` partent cachés sous leur masque et
            remontent quand le titre entre dans la vue. Sans script, rien ne
            vient jamais poser `data-vu` : le titre resterait invisible, pour le
            lecteur comme pour un robot qui rend la page, et c'est un niveau
            entier du plan qui disparaît.

            Elle est ici et non dans le composant : React sérialise le contenu
            d'un `noscript` comme du texte, donc la feuille se retrouvait dans le
            `textContent` du titre. Invisible à l'écran, mais lue. */}
        <noscript>
          <style>{`[data-titre-roulant] span{transform:none}`}</style>
        </noscript>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM}');`}
        </Script>

        {/* Le thème par défaut est le **sombre**, sur décision de Rémy.

            Il vaut pour quelqu'un qui arrive sans préférence enregistrée, et
            quelle que soit celle de son système : c'est dans ce thème que le
            site se regarde. Quelqu'un qui a déjà basculé garde son choix, la
            valeur étant stockée par `next-themes`.

            `enableSystem` reste en place, et ce n'est pas une contradiction :
            il ne décide plus de l'accueil, mais il continue de faire vivre la
            valeur « système » déjà enregistrée dans le navigateur des
            visiteurs précédents. La retirer ferait retomber ceux-là sur un
            thème non résolu, donc sur le clair, ce qui est exactement
            l'inverse de ce qu'on demande ici.

            La valeur est passée ici et non dans `packages/ui` : le composant
            partagé reste un fournisseur générique, et c'est le site qui dit ce
            qu'il veut. */}
        <ThemeProvider defaultTheme="dark">
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
