"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";

/** Le nom de l'événement qui ouvre la fenêtre d'inscription de `/course`. */
export const OUVRIR_INSCRIPTION = "ouvrir-inscription-vsl";

/**
 * Un lien de texte qui ouvre la fenêtre d'inscription de `/course`.
 *
 * **Un bouton et non un lien** : il ne mène nulle part, il ouvre une fenêtre.
 * Il a l'allure des liens de la lettre de Rémy, dans laquelle il s'insère.
 * La fenêtre vit dans `InscriptionVsl` ; on la prévient par un événement de
 * la page plutôt qu'en remontant un état, les deux composants ne partageant
 * pas d'ancêtre client.
 */
export function OuvrirInscription({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OUVRIR_INSCRIPTION))}
      className="inline font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </button>
  );
}

/** Le bouton plein qui ouvre la même fenêtre, à la fin de la lettre. */
export function BoutonOuvrirInscription({ children }: { children: string }) {
  return (
    <BoutonScintillant
      action={() => window.dispatchEvent(new Event(OUVRIR_INSCRIPTION))}
      className="min-h-16 w-full text-lg sm:w-auto sm:px-10 sm:text-xl"
    >
      <TexteRoulant>{children}</TexteRoulant>
    </BoutonScintillant>
  );
}
