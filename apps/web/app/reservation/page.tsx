import { BanniereGenesis } from "@/components/banniere-genesis";
import { FormulaireCalendly } from "@/components/formulaire-calendly";
import { reservationGenesis } from "@/contenu/formation-genesis";
import { reservationAppel } from "@/contenu/appel";
import type { Metadata } from "next";

/**
 * La réservation de l'appel de la Formation Genesis,
 * `go.funnels.club/reservation` (issue #8), sur demande de Rémy. On y arrive
 * par le bouton « Réserver mon appel » des modules de l'espace membre.
 *
 * **Le formulaire est celui de Calendly, intégré avec les réglages déjà
 * éprouvés sur le tunnel VSL** (`FormulaireCalendly`) :
 * - l'iframe part pendant la lecture du HTML, sans attendre l'hydratation ni
 *   le `widget.js` de Calendly ;
 * - son cadre prend la hauteur que Calendly annonce à chaque étape
 *   (`calendly.page_height`) : tout s'affiche d'un coup, on ne défile jamais
 *   dans le formulaire ;
 * - il ne descend jamais sous 800 px, la hauteur où la première vue de
 *   Calendly tient entière, et fait 72 rem de large pour que la colonne des
 *   horaires ne s'écrase pas.
 *
 * **Il s'ouvre prérempli** avec ce que l'optin a gardé dans le navigateur :
 * prénom, nom, e-mail et téléphone (question `a1`). Rien de tout ça ne passe
 * par l'adresse de la page ; seules les balises `utm_*` du module d'origine y
 * sont, et Calendly les garde avec le rendez-vous.
 *
 * Le titre est un libellé de l'agent, PROVISOIRE.
 */
export const metadata: Metadata = {
  title: { absolute: `${reservationGenesis.titrePage} · Funnels Club` },
  alternates: { canonical: "https://go.funnels.club/reservation" },
};

export default function Reservation() {
  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      <BanniereGenesis libelle={reservationGenesis.barre} />
      <header className="mx-auto max-w-[960px] px-5 pt-5 sm:px-8 sm:pt-6">
        <h1 className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance">
          {reservationGenesis.titre}
        </h1>
      </header>
      <div className="mx-auto max-w-[72rem] px-5 pt-6 sm:px-8 sm:pt-8">
        <FormulaireCalendly
          url={reservationGenesis.calendly}
          titre={reservationGenesis.titreFormulaire}
          hauteurMin={reservationAppel.hauteurMin}
          telephone={reservationGenesis.questionTelephone}
          reponsesVsl={false}
          clair
        />
      </div>
    </main>
  );
}
