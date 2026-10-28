import { CompteurVue } from "@/components/compteur-vue";
import { InscriptionVsl } from "@/components/inscription-vsl";
import { PreuveTrustpilot } from "@/components/preuve-trustpilot";
import { MessageRemy } from "@/components/message-remy";
import { OuvrirInscription } from "@/components/ouvrir-inscription";
import { messageRemyOptin, optinVsl } from "@/contenu/vsl";
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
          <h1
            /* **Une taille fluide sur téléphone**, proportionnelle à la
               largeur de l'écran : mesuré de 320 à 430 px, c'est ce qui
               garde la même forme de titre partout, en remplissant la
               largeur, sans mot isolé. Interligne serré sur téléphone pour
               que le bouton reste visible au chargement, et titre un peu
               plus petit sur les écrans peu hauts (iPhone SE et
               semblables), où il le poussait sous le bord. */
            className="titre text-[clamp(1.75rem,7.7vw,2.4rem)] leading-[1.15] [@media(max-height:720px)]:text-[clamp(1.5rem,7.25vw,2.4rem)] [@media(max-height:720px)]:leading-[1.12] text-balance text-foreground sm:text-[2.6rem] sm:leading-[1.22]"
          >
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

      {/* La lettre de Rémy, reprise de l'accueil, sous la note des avis. Ses
          deux liens ouvrent la fenêtre d'inscription : la vidéo est fermée
          tant qu'on ne s'est pas inscrit. La marge négative rend le
          rembourrage que la lettre porte déjà, pour qu'il ne s'ajoute pas à
          celui de la page. */}
      <div className="-mx-5 mt-16 sm:mt-24">
        <MessageRemy
          contenu={messageRemyOptin}
          lien={(libelle) => <OuvrirInscription>{libelle}</OuvrirInscription>}
        />
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
