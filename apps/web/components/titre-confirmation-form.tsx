"use client";

import { ShineBorder } from "@repo/ui/components/shine-border";
import { PointGelule } from "@/components/pilules-hero";
import { confirmationThanks } from "@/contenu/thanks";
import { confirmationFormFunnel } from "@/contenu/immersion";
import { dateLisible, useReservation } from "@/lib/reservation";
import { insecables } from "@/lib/typographie";

/**
 * Le haut de `/form-funnel-thanks`, et de `/thanks` depuis que Rémy l'y a
 * demandé : « Félicitations Rémy, ton appel est
 * réservé pour le mardi 3 novembre à 11 h », puis l'alerte de `/thanks`,
 * reprise à l'identique sur demande de Rémy : la gélule rouge, son point qui
 * pulse et son liseré qui tourne.
 *
 * Le prénom et la date arrivent du sondage dans l'adresse, sous les noms
 * que Calendly emploie (`invitee_first_name`, `event_start_time`) : le relevé
 * de `/thanks` les lit et les retire de l'adresse avant Google Tag Manager
 * (voir `lib/reservation-capture.ts`). Rien n'arrive au rendu serveur : le
 * titre générique s'affiche, puis la version personnelle le remplace.
 */
export function TitreConfirmationForm({
  classeTitre = "text-[2rem] sm:text-5xl lg:text-6xl",
  alerte = confirmationThanks.alerte,
}: {
  /** La taille du titre. `/thanks` le veut plus petit, sur demande de Rémy. */
  classeTitre?: string;
  /** Le texte de l'alerte : `/thanks` n'a plus qu'une vidéo. */
  alerte?: {
    important: string;
    avant: string;
    videos: string;
    milieu: string;
    confirmez: string;
    apres: string;
  };
} = {}) {
  const reservation = useReservation();
  const quand = dateLisible(reservation?.debut);
  const prenom = reservation?.prenom;

  return (
    <>
      <h1 className={`titre text-balance text-foreground ${classeTitre}`}>
        {prenom || quand ? (
          <>
            Félicitations{prenom ? ` ${prenom}` : ""}, ton appel est réservé
            {quand ? (
              <>
                {" "}
                pour le{" "}
                <span className="text-primary">
                  {insecables(quand)}
                </span>
              </>
            ) : null}
            &nbsp;!
          </>
        ) : (
          confirmationFormFunnel.titreGenerique
        )}
      </h1>
      {/* `div` et non `p` : `ShineBorder` rend une `div`, qu'un paragraphe
          ne peut pas contenir (voir `app/thanks/page.tsx`). 16 px sur
          téléphone et non 14, sur demande de Rémy. */}
      <div
        role="note"
        style={{ "--teinte": "#ffffff" } as React.CSSProperties}
        className="relative mt-6 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-[1.25rem] bg-[#dc2626] px-5 py-3 text-left text-base leading-snug font-medium text-white shadow-[0_14px_34px_-14px_rgba(220,38,38,0.65)] sm:mt-7 sm:rounded-full sm:px-6 sm:py-3 sm:text-lg"
      >
        {/* Le liseré en rouges clairs, et non dans les rouges presque noirs
            de /thanks : sur ce fond crème, ils se lisaient comme une ombre
            noire autour de la gélule (relevé par Rémy). */}
        <ShineBorder
          borderWidth={2}
          duration={8}
          shineColor={["#fca5a5", "#f87171"]}
        />
        <PointGelule />
        <span>
          <strong className="font-bold">{alerte.important}</strong>
          {alerte.avant}
          <strong className="font-bold underline decoration-white/70 decoration-2 underline-offset-4">
            {alerte.videos}
          </strong>
          {alerte.milieu}
          <strong className="font-bold underline decoration-white/70 decoration-2 underline-offset-4">
            {alerte.confirmez}
          </strong>
          {alerte.apres}
        </span>
      </div>
    </>
  );
}
