import { FormulaireCalendly } from "@/components/formulaire-calendly";
import { ReservationAppel } from "@/components/reservation-appel";
import { identiteAppel, reservationAppel } from "@/contenu/appel";

import type { Metadata } from "next";
import { partageTunnel } from "@/lib/partage";
import { preconnect } from "react-dom";
import { avecReglages } from "@/lib/reglages-seo";

/**
 * La page de réservation d'appel, servie sur `go.funnels.club/appel`.
 *
 * **Notre propre réservation, sur fond neutre** (issue #7), sur décision de
 * Rémy : la marque, le titre, le sous-titre et la photo du hero de
 * `/preparation` sont partis, pour qu'elle ressemble à `/video-vsl`, d'où
 * l'on arrive. Le rendez-vous part à Calendly par son API ; le formulaire de
 * Calendly intégré ne reste qu'en repli. Le pied de page, avec les mentions du site, est dans le
 * gabarit. Le message de Rémy et la galerie des entretiens vivent sur
 * `/thanks`.
 */

const metadonnees: Metadata = {
  title: identiteAppel.titrePage,
  description: identiteAppel.description,
  ...partageTunnel({
    titre: `${identiteAppel.titrePage} · Funnels Club`,
    description: identiteAppel.description,
    image: "appel",
    alt: "Réserve ton appel avec l'équipe Funnels Club",
  }),
};

export default function Appel() {
  const { calendlyPageAppel, hauteurMin } = reservationAppel;

  /* La poignée de main avec Calendly commence dès l'en-tête du HTML, avant
     même que l'iframe soit lue : `calendly.com` sert sa page, `assets` ses
     scripts et ses styles. */
  preconnect("https://calendly.com");
  preconnect("https://assets.calendly.com", { crossOrigin: "anonymous" });

  return (
    <main
      id="reservation"
      /* **Sur fond neutre**, sur demande de Rémy, comme `/video-vsl` : ni
         marque en haut, ni photo de fond. */
      className="px-5 pt-8 sm:pt-12"
    >
      {/* Notre réservation, sur demande de Rémy (issue #7). Le formulaire
          de Calendly n'est plus que le repli, si les créneaux ne se lisent
          pas : voir `ReservationAppel`. */}
      <ReservationAppel
        repli={
          <div className="mx-auto w-full max-w-[var(--largeur-video)]">
            <FormulaireCalendly
              url={calendlyPageAppel}
              titre="Réserve ton appel avec Funnels Club"
              hauteurMin={hauteurMin}
              className="w-full"
            />
          </div>
        }
      />
    </main>
  );
}

/** Les métadonnées de la page, avec les réglages SEO du CRM par-dessus. */
export async function generateMetadata(): Promise<Metadata> {
  return avecReglages("/appel", metadonnees);
}
