import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreProchaineEtape } from "@/components/titre-prochaine-etape";
import {
  identiteProchaineEtape,
  prochaineEtape,
} from "@/contenu/prochaine-etape";
import { scriptCapture } from "@/lib/reservation-capture";
import { insecables } from "@/lib/typographie";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

/**
 * La page où arrive, depuis `/appel`, la personne qui a répondu ne pas avoir
 * les moyens de se faire accompagner. Elle n'a rien réservé.
 *
 * **Le dessin de `/thanks`, en rouge**, sur demande de Rémy : le même titre
 * et la même gélule d'alerte, puis une seule carte à la place de l'étape 1,
 * celle du Funnel Challenge, avec sa maquette. Pas de vidéo, pas
 * d'entretiens, pas d'équipe : la page n'a qu'une chose à proposer.
 */
export const metadata: Metadata = {
  title: identiteProchaineEtape.titrePage,
  description: identiteProchaineEtape.description,
};

export default function ProchaineEtape() {
  const { challenge } = prochaineEtape;
  const { texte } = challenge;

  return (
    <>
      {/* Le relevé de `/thanks`, pour le prénom : il le lit dans l'adresse
          et l'en retire avant GTM. Voir `app/thanks/page.tsx`. */}
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: `<script>${scriptCapture}</script>` }}
      />

      <section className="px-5 pt-8 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center lg:max-w-5xl">
          <TitreProchaineEtape />
        </div>
      </section>

      {/* La carte du challenge, au rayon et à l'ombre de celle de l'étape 1
          de `/thanks`. La maquette à gauche en large, au-dessus sur
          téléphone. */}
      <section className="px-5 pt-8 sm:pt-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-6 rounded-[var(--rayon-jonction)] border border-border bg-card p-6 text-card-foreground shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:p-8 md:grid-cols-[2fr_3fr] md:gap-10 md:p-10">
          {/* L'image du haut de page : pas de chargement différé. */}
          <img
            src={challenge.maquette.src}
            width={challenge.maquette.largeur}
            height={challenge.maquette.hauteur}
            alt={challenge.maquette.alt}
            fetchPriority="high"
            className="mx-auto h-auto w-full max-w-72 md:max-w-none"
          />
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-wide text-[#dc2626] uppercase">
              {challenge.surtitre}
            </p>
            <h2 className="titre mt-2 text-[1.625rem] leading-tight text-balance sm:text-3xl md:text-pretty">
              {challenge.nom}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
              {texte.avant}
              <strong className="font-semibold text-foreground">
                {insecables(texte.etape)}
              </strong>
              {texte.milieu}
              <strong className="font-semibold text-foreground">
                {texte.tarif}
              </strong>
              {texte.apres}
            </p>
            <div className="pt-7">
              {/* Le rouge de la gélule : la page est forcée au clair, il y
                  tient 4,8:1 sous le blanc. */}
              <BoutonScintillant
                href={challenge.lien}
                fond="#dc2626"
                encre="#ffffff"
                className="min-h-16 w-full gap-2.5 px-6 text-lg font-bold sm:w-auto"
              >
                <TexteRoulant>{challenge.bouton}</TexteRoulant>
                <ArrowRight
                  aria-hidden
                  className="size-5 shrink-0"
                  strokeWidth={2.5}
                />
              </BoutonScintillant>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
