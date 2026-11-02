"use client";

import { confirmationThanks } from "@/contenu/thanks";
import { confirmationFormFunnel } from "@/contenu/immersion";
import { dateLisible, useReservation } from "@/lib/reservation";
import { insecables } from "@/lib/typographie";

/**
 * Le haut de `/form-funnel-thanks` : « Félicitations Rémy, ton appel est
 * réservé pour le mardi 3 novembre à 11 h », puis l'alerte de `/thanks`.
 *
 * Le prénom et la date arrivent du sondage dans l'adresse, sous les noms
 * que Calendly emploie (`invitee_first_name`, `event_start_time`) : le relevé
 * de `/thanks` les lit et les retire de l'adresse avant Google Tag Manager
 * (voir `lib/reservation-capture.ts`). Rien n'arrive au rendu serveur : le
 * titre générique s'affiche, puis la version personnelle le remplace.
 */
export function TitreConfirmationForm() {
  const reservation = useReservation();
  const quand = dateLisible(reservation?.debut);
  const prenom = reservation?.prenom;
  const { alerte } = confirmationThanks;

  return (
    <>
      <h1 className="titre text-[2rem] text-balance text-foreground sm:text-5xl lg:text-6xl">
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
      <p className="mt-5 text-lg text-pretty text-foreground/80 sm:text-xl">
        <strong className="font-bold text-destructive">{alerte.important}</strong>
        {alerte.avant}
        <span className="underline decoration-2 underline-offset-4">
          {alerte.videos}
        </span>
        {alerte.milieu}
        <span className="underline decoration-2 underline-offset-4">
          {alerte.confirmez}
        </span>
        {alerte.apres}
      </p>
    </>
  );
}
