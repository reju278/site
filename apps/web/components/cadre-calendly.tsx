"use client";

import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Le cadre du formulaire de Calendly, à la hauteur de son contenu.
 *
 * **Sur demande de Rémy** : une fois l'horaire choisi, les questions
 * s'affichaient dans un cadre resté à 700 px, et il fallait défiler dans le
 * formulaire au lieu de défiler dans la page. Calendly annonce lui-même la
 * hauteur de sa page à chaque changement, par un message
 * `calendly.page_height` : le cadre la prend, et l'iframe n'a plus jamais de
 * barre de défilement.
 *
 * **Seuls les messages de `calendly.com` sont lus**, et seules les hauteurs
 * plausibles : Calendly annonce 2 px puis 26 px pendant son chargement, ce qui
 * replierait le cadre avant de le déplier.
 *
 * **Il ne descend jamais sous `hauteurMin`**, qui sert aussi de hauteur de
 * départ, rendue au serveur : la page ne saute pas avant que Calendly ait
 * parlé. Voir `contenu/appel.ts`.
 *
 * **Ce qu'il prend au-delà est annoncé au hero**, par `--surplus-formulaire`
 * sur `[data-hero]`, pour que la photo garde sa hauteur : voir `/appel`.
 */
export function CadreCalendly({
  hauteurMin,
  className,
  children,
}: {
  hauteurMin: number;
  className?: string;
  children: React.ReactNode;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const [hauteur, setHauteur] = useState(hauteurMin);

  useEffect(() => {
    function ecouter(evenement: MessageEvent) {
      if (evenement.origin !== "https://calendly.com") return;
      const donnees = evenement.data as
        | { event?: string; payload?: { height?: string } }
        | undefined;
      if (donnees?.event !== "calendly.page_height") return;
      const valeur = Number.parseInt(donnees.payload?.height ?? "", 10);
      if (valeur >= 300) setHauteur(Math.max(valeur, hauteurMin));
    }

    window.addEventListener("message", ecouter);
    return () => window.removeEventListener("message", ecouter);
  }, [hauteurMin]);

  useEffect(() => {
    const hero = cadre.current?.closest<HTMLElement>("[data-hero]");
    hero?.style.setProperty("--surplus-formulaire", `${hauteur - hauteurMin}px`);
  }, [hauteur, hauteurMin]);

  return (
    <div
      ref={cadre}
      /* `@container` : `FormulaireCalendly` habille l'iframe selon sa
         largeur à elle. */
      className={cn("@container relative isolate min-w-[320px]", className)}
      style={{ height: hauteur }}
    >
      {children}
    </div>
  );
}
