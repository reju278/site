import { CompteurVue } from "@/components/compteur-vue";
import { InscriptionVsl } from "@/components/inscription-vsl";
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
    <main className="px-5 pt-28 sm:pt-36">
      <CompteurVue tunnel="vsl" etape="optin" />
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
          <h1 className="titre text-3xl leading-tight text-balance text-foreground sm:text-[2.6rem]">
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
          <p className="text-base text-muted-foreground sm:text-lg">
            <span className="font-semibold text-primary">*Offre digitale</span>{" "}
            : {optinVsl.note}
          </p>
        </header>
        <InscriptionVsl />
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
