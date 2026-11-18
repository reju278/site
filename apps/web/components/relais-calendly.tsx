"use client";

import { adresseCalendly } from "@/lib/adresse-calendly";
import { useEffect } from "react";

/**
 * Le relais de `FormulaireCalendly` quand son script n'a pas tourné.
 *
 * Le script posé après l'iframe ne s'exécute qu'au chargement complet de la
 * page. Après une navigation côté client (un `Link` de Next), React pose le
 * même HTML sans exécuter ses scripts : l'iframe garde alors l'adresse de
 * repli, sans balises `utm_*` ni préremplissage. Ce relais, au montage,
 * reconnaît ce cas à l'absence d'`embed_domain` (que seul le script pose) et
 * donne à l'iframe l'adresse complète, par la même fonction.
 *
 * Sur un chargement complet, l'adresse a déjà son `embed_domain` : il ne fait
 * rien, et Calendly ne se charge pas deux fois.
 */
export function RelaisCalendly({
  url,
  options,
}: {
  url: string;
  options: { telephone: string | null; reponsesVsl: boolean };
}) {
  const { telephone, reponsesVsl } = options;
  useEffect(() => {
    const iframe = document.getElementById(
      "formulaire-calendly",
    ) as HTMLIFrameElement | null;
    if (!iframe || iframe.src.includes("embed_domain=")) return;
    iframe.src = adresseCalendly(url, { telephone, reponsesVsl });
  }, [url, telephone, reponsesVsl]);
  return null;
}
