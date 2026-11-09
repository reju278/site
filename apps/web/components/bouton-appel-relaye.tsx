"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Ce que le bouton reprend de l'adresse de la page pour le passer à l'appel.
 *
 * **`el`**, parce qu'un lien d'e-mail arrive avec sa propre balise
 * (`el=email-…`) et que le bouton posait `el=site` en dur : Hyros voyait
 * l'e-mail à l'arrivée puis « site » au clic qui compte. **`email`**, parce
 * que c'est par lui qu'Hyros reconnaît la personne, sur décision de Rémy :
 * `go.funnels.club/stable-appel?email={{contact.email_address}}&el=email-…`.
 * Les `utm_*` suivent pour la même raison que `el`.
 */
const TRANSMIS = ["el", "email"];

/**
 * Le bouton d'appel des pages vidéo, qui relaie la provenance et l'e-mail reçus.
 *
 * Le rendu serveur sert l'adresse de départ, balisée `el=site` : sans
 * JavaScript, ou sans rien dans l'adresse, le bouton reste celui d'avant.
 * La réécriture se fait au montage, la page étant statique.
 */
export function BoutonAppelRelaye({
  href,
  libelle,
}: {
  href: string;
  libelle: string;
}) {
  const [cible, setCible] = useState(href);

  useEffect(() => {
    const recue = new URLSearchParams(window.location.search);
    const url = new URL(href);
    let change = false;
    recue.forEach((valeur, nom) => {
      if (!valeur || valeur.includes("{{")) return;
      if (TRANSMIS.includes(nom) || nom.startsWith("utm_")) {
        url.searchParams.set(nom, valeur);
        change = true;
      }
    });
    if (change) setCible(url.toString());
  }, [href]);

  return (
    <BoutonScintillant
      href={cible}
      className="min-h-16 w-full text-lg sm:w-auto sm:px-12 sm:text-xl"
    >
      <TexteRoulant>{libelle}</TexteRoulant>
      <ArrowRight aria-hidden className="size-5 shrink-0" />
    </BoutonScintillant>
  );
}
