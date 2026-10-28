import { CompteurVue } from "@/components/compteur-vue";
import { InscriptionVsl } from "@/components/inscription-vsl";
import { PreuveTrustpilot } from "@/components/preuve-trustpilot";
import { optinVsl } from "@/contenu/vsl";
import { avecReglages } from "@/lib/reglages-seo";
import type { Metadata } from "next";
import Script from "next/script";

/**
 * L'opt-in du VSL Funnel : la promesse, l'aperçu de la vidéo, et la fenêtre
 * d'inscription. Reprise de `funnels.club/course-2025`, au mot près, dans le
 * dessin du site.
 */
const metadonnees: Metadata = {
  title: { absolute: "La formation gratuite · Funnels Club" },
  description:
    "La vidéo gratuite qui présente le parfait tunnel de vente pour vendre votre offre digitale, de façon simple, régulière et prévisible.",
  /* Le jeton de page externe de ClickFunnels : il désigne cette page comme
     l'étape d'inscription du tunnel « 2026 : Direct VSL (Claude) », et le SDK
     chargé plus bas le lit dans le `head`. Posé ici et non dans le gabarit,
     qui couvre aussi les pages légales de `/course` : elles seraient sinon
     comptées comme des visites de l'inscription. */
  other: { "cf-page-token": "cfp_RZaldUb55ckllKCJnqLN9TPk" },
};

export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/course", metadonnees);
}

export default function Course() {
  return (
    <main
      /* Le haut de page ne dégage plus l'en-tête, retiré sur demande de
         Rémy : le titre monte au plus près du bord. */
      className="px-5 pt-5 sm:pt-12"
    >
      <CompteurVue tunnel="vsl" etape="optin" />
      {/* Sur téléphone, tout est resserré, titre compris, sur demande de Rémy :
          le bouton qui ouvre l'inscription doit être visible au chargement,
          sans défiler, même sur un petit iPhone dont les barres du navigateur
          mangent une centaine de pixels. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-10">
        <header className="mx-auto flex max-w-4xl flex-col gap-2 text-center sm:gap-4">
          <h1 className="titre text-2xl leading-tight whitespace-pre-line text-balance sm:whitespace-normal text-foreground sm:text-[2.6rem] sm:leading-[1.22]">
            {optinVsl.titre.map((morceau, rang) =>
              "accent" in morceau ? (
                <span key={rang} className="text-primary">
                  {morceau.texte}
                </span>
              ) : "souligne" in morceau ? (
                <span
                  key={rang}
                  className="underline decoration-primary/40 decoration-2 underline-offset-4"
                >
                  {morceau.texte}
                </span>
              ) : (
                <span key={rang}>{morceau.texte}</span>
              ),
            )}
          </h1>
        </header>
        <InscriptionVsl />
        <PreuveTrustpilot />
      </div>
      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme sur `/thanks` : rien ne doit retarder le
          rendu. */}
      <Script
        src="https://sdk.myclickfunnels.com/sdk.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
