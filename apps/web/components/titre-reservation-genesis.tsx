"use client";

import { reservationGenesis } from "@/contenu/formation-genesis";
import { usePrenomVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";

/**
 * Le titre de `/reservation`, au prénom laissé à l'optin, sur demande de
 * Rémy : « Réservez votre appel ci-dessous, Rémy ».
 *
 * **Le prénom est lu dans le navigateur, après le rendu** (`usePrenomVsl`) :
 * le serveur ne le connaît pas, il ne passe jamais par l'adresse. Sans lui,
 * le titre reste juste : « Réservez votre appel ci-dessous ».
 *
 * Servi aussi à Course modèle, qui passe son `titre`, sans virgule, comme le
 * titre de `/video-vsl` : la vidéo (« Ta formation offerte Rémy ») et la
 * prise d'appel (« Réserve ton appel ci-dessous Rémy »).
 */
export function TitreReservationGenesis({
  className,
  titre = reservationGenesis.titre,
  separateur = ", ",
}: {
  className?: string;
  titre?: string;
  /** Entre le titre et le prénom. */
  separateur?: string;
}) {
  const prenom = usePrenomVsl();
  return (
    <h1 className={className}>
      {insecables(prenom ? `${titre}${separateur}${prenom}` : titre)}
    </h1>
  );
}
