"use client";

import { ShineBorder } from "@repo/ui/components/shine-border";
import { PointGelule } from "@/components/pilules-hero";
import { prochaineEtape } from "@/contenu/prochaine-etape";
import { useReservation } from "@/lib/reservation";

/**
 * Le haut de `/prochaine-etape` : le titre au prénom, puis l'alerte rouge.
 *
 * **C'est le dessin de `TitreConfirmationForm`**, sur demande de Rémy (« le
 * design de `/thanks` en rouge ») : même titre, même gélule, son point qui
 * pulse et son liseré qui tourne. Seul le texte change, et le mot « PAS »
 * prend le rouge que le titre de `/thanks` donne à la date.
 *
 * Le prénom arrive dans l'adresse sous le nom que Calendly emploie,
 * `invitee_first_name`, posé par le formulaire d'`/appel`, et le relevé de
 * `/thanks` l'en retire avant GTM. Sans lui, le titre s'écrit sans prénom.
 */
export function TitreProchaineEtape() {
  const prenom = useReservation()?.prenom;
  const { titre, alerte } = prochaineEtape;

  return (
    <>
      <h1 className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
        {titre.avant}
        <span className="text-[#dc2626]">{titre.pas}</span>
        {titre.apres}
        {prenom ? `, ${prenom}` : ""}
      </h1>
      <div
        role="note"
        style={{ "--teinte": "#ffffff" } as React.CSSProperties}
        className="relative mt-6 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-[1.25rem] bg-[#dc2626] px-5 py-3 text-left text-base leading-snug font-medium text-white shadow-[0_14px_34px_-14px_rgba(220,38,38,0.65)] sm:mt-7 sm:rounded-full sm:px-6 sm:py-3 sm:text-lg"
      >
        <ShineBorder
          borderWidth={2}
          duration={8}
          shineColor={["#fca5a5", "#f87171"]}
        />
        <PointGelule />
        <span>{alerte}</span>
      </div>
    </>
  );
}
