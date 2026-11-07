import { CompteurVue } from "@/components/compteur-vue";
import { InscriptionVsl } from "@/components/inscription-vsl";
import { optinVsl } from "@/contenu/vsl";
import { avecReglages } from "@/lib/reglages-seo";
import { SdkClickFunnels } from "@/components/sdk-clickfunnels";
import type { Metadata } from "next";
import { partageTunnel } from "@/lib/partage";
import { Badge } from "@repo/ui/components/badge";

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
  ...partageTunnel({
    titre: "La formation gratuite · Funnels Club",
    description:
      "La vidéo gratuite qui présente le parfait tunnel de vente pour vendre votre offre digitale grâce à la publicité en ligne.",
    image: "course",
    alt: "La formation gratuite Funnels Club : le parfait tunnel de vente pour vendre votre offre digitale",
  }),
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
        <header className="mx-auto flex max-w-6xl flex-col gap-2 text-center sm:gap-4">
          {/* Le sur-titre est une pilule d'en-tête, sur demande de Rémy : la
              pastille du socle, neutre, sans couleur ni effet au survol. Le texte
              passe à la ligne sur téléphone, où il ne tient pas sur une seule. */}
          <Badge
            asChild
            variant="outline"
            className="mb-1 max-w-full shrink self-center bg-background px-4 py-1.5 text-center text-sm leading-snug font-medium whitespace-normal shadow-sm sm:mb-2 sm:text-lg"
          >
            <p>
              <span className="block text-balance">
                {optinVsl.surtitre.map((ligne) =>
                  ligne.map((morceau, rang) =>
                    "gras" in morceau ? (
                      <strong key={rang} className="font-extrabold">
                        {morceau.texte}
                      </strong>
                    ) : (
                      <span key={rang}>{morceau.texte}</span>
                    ),
                  ),
                )}
              </span>
            </p>
          </Badge>
          <h1
            /* **Une taille fluide sur téléphone**, proportionnelle à la
               largeur de l'écran. Le titre s'y lit par blocs, sur demande de
               Rémy : la promesse, la parenthèse à part et plus petite, puis
               une ligne par chose qu'on évite. Le bouton reste visible au
               chargement sur un écran de 667 px de haut (iPhone SE), barres
               du navigateur non comprises. En large, le titre tient sur
               quatre lignes. */
            className="titre text-[clamp(1.4rem,6.2vw,2rem)] leading-[1.15] [@media(max-height:720px)]:text-[clamp(1.3rem,5.8vw,2rem)] [@media(max-height:720px)]:leading-[1.12] text-balance text-foreground sm:text-[2.6rem] sm:leading-[1.22]"
          >
            {optinVsl.titre.map((morceau, rang) =>
              "coupure" in morceau ? (
                <br key={rang} className="sm:hidden" />
              ) : "accent" in morceau ? (
                <span key={rang} className="text-primary">
                  {morceau.texte}
                </span>
              ) : "italique" in morceau ? (
                <em
                  key={rang}
                  className="max-sm:my-1 max-sm:block max-sm:text-[0.72em] max-sm:font-medium"
                >
                  {morceau.texte}
                </em>
              ) : "rouge" in morceau ? (
                <span
                  key={rang}
                  className={
                    "telephone" in morceau
                      ? "text-[color:var(--livre-texte)] sm:hidden"
                      : "text-[color:var(--livre-texte)]"
                  }
                >
                  {morceau.texte}
                </span>
              ) : "souligne" in morceau ? (
                <span
                  key={rang}
                  className="underline decoration-[var(--livre-texte)] decoration-2 underline-offset-4 sm:decoration-[3px]"
                >
                  {morceau.texte}
                </span>
              ) : (
                <span
                  key={rang}
                  className={"ordinateur" in morceau ? "max-sm:hidden" : undefined}
                >
                  {morceau.texte}
                </span>
              ),
            )}
          </h1>
          <div className="flex flex-col gap-1 text-[clamp(13px,3.85vw,15px)] text-pretty text-foreground/85 max-sm:-mx-3 max-sm:mt-3 sm:text-xl lg:text-2xl">
            {optinVsl.renvois.map((renvoi) => (
              <p key={renvoi.accent}>
                <span className="font-semibold text-primary">
                  {renvoi.accent}
                </span>
                {renvoi.suite}
              </p>
            ))}
          </div>
        </header>
        <InscriptionVsl />
      </div>

      {/* Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
          `afterInteractive`, comme sur `/thanks` : rien ne doit retarder le
          rendu. */}
      <SdkClickFunnels />
    </main>
  );
}
