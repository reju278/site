"use client";

import { inscrireGenesis } from "@/app/formation-genesis/actions";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import {
  optinGenesis,
  partiesGenesis,
  RACINE_GENESIS,
} from "@/contenu/formation-genesis";
import { CLE_CONTACT_VSL } from "@/contenu/vsl";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

/**
 * Le formulaire d'optin de la Formation Genesis : prénom et e-mail, puis
 * l'espace membre.
 *
 * **L'inscription part à ClickFunnels par la server action**, qui crée le
 * contact et lui pose le tag « formation genesis » : c'est le tag qui lance
 * la séquence e-mail. Pas de SDK de ClickFunnels ici, contrairement à
 * `/course` : la page n'est l'étape d'aucun tunnel ClickFunnels, et c'est
 * l'API qui inscrit.
 *
 * **On n'entre dans l'espace qu'une fois l'inscription passée.** Sinon la
 * personne verrait la première partie sans jamais recevoir les suivantes, et
 * personne ne le saurait.
 *
 * Prénom et e-mail sont aussi gardés dans le navigateur, sous la clé du
 * tunnel VSL (sept jours, jamais dans l'adresse) : la réservation de
 * `/formation-genesis/appel` est celle d'`/appel`, qui s'en préremplit.
 */
export function InscriptionGenesis() {
  const { formulaire } = optinGenesis;
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(false);

  const valider = async (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (envoi) return;
    setEnvoi(true);
    setErreur(false);
    const resultat = await inscrireGenesis(prenom, email).catch(() => ({
      ok: false as const,
    }));
    if (!resultat.ok) {
      setEnvoi(false);
      setErreur(true);
      return;
    }
    try {
      localStorage.setItem(
        CLE_CONTACT_VSL,
        JSON.stringify({
          prenom: prenom.trim(),
          email: email.trim(),
          t: Date.now(),
        }),
      );
    } catch {
      /* Stockage bloqué : la réservation ne sera pas préremplie. */
    }
    const fenetreGtm = window as unknown as { dataLayer?: unknown[] };
    fenetreGtm.dataLayer?.push({ event: "lead", funnel: "genesis" });
    window.location.assign(
      `${RACINE_GENESIS}/espace/${partiesGenesis[0]?.cle ?? "1"}`,
    );
  };

  return (
    <form
      onSubmit={valider}
      className="flex flex-col gap-4"
      aria-describedby={erreur ? "erreur-genesis" : undefined}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="prenom-genesis">{formulaire.prenom}</Label>
        <Input
          id="prenom-genesis"
          name="prenom"
          autoComplete="given-name"
          required
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="h-12 text-base"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-genesis">{formulaire.email}</Label>
        <Input
          id="email-genesis"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 text-base"
        />
      </div>
      {erreur ? (
        <p
          id="erreur-genesis"
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {formulaire.erreur}
        </p>
      ) : null}
      <BoutonScintillant
        soumettre
        className="mt-1 min-h-14 w-full text-lg sm:text-xl"
      >
        {envoi ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle aria-hidden className="size-5 animate-spin" />
            {formulaire.envoi}
          </span>
        ) : (
          <TexteRoulant>{formulaire.bouton}</TexteRoulant>
        )}
      </BoutonScintillant>
    </form>
  );
}
