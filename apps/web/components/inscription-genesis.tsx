"use client";

import { inscrireGenesis } from "@/app/formation-genesis/actions";
import { BoutonGenesis } from "@/components/bouton-genesis";
import { Emplacement } from "@/components/section";
import {
  optinGenesis,
  partiesGenesis,
  RACINE_GENESIS,
} from "@/contenu/formation-genesis";
import { CLE_CONTACT_VSL } from "@/contenu/vsl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";

/**
 * Le bouton de l'optin de la Formation Genesis et sa fenêtre d'inscription :
 * prénom et e-mail, puis l'espace membre.
 *
 * **La fenêtre est celle de la référence ClickFunnels**, sur demande de Rémy :
 * le bouton bleu ouvre une carte blanc cassé à grande ombre douce, son titre
 * en PT Serif gras, deux champs hauts de 53 px au creux d'une ombre
 * intérieure, et le même bouton bleu pour envoyer. La croix de la référence
 * est un disque ; la nôtre garde 5 px, parce que les commandes rondes du site
 * sont une famille fermée (voir `AGENTS.md`).
 *
 * **L'inscription part à ClickFunnels par la server action**, qui crée le
 * contact et lui pose le tag « formation genesis » : c'est le tag qui lance
 * la séquence e-mail. **On n'entre dans l'espace qu'une fois l'inscription
 * passée** : sinon la personne verrait la première partie sans jamais
 * recevoir les suivantes, et personne ne le saurait.
 *
 * Prénom et e-mail sont aussi gardés dans le navigateur, sous la clé du
 * tunnel VSL (sept jours, jamais dans l'adresse) : la réservation de
 * `/formation-genesis/appel` est celle d'`/appel`, qui s'en préremplit.
 */
export function InscriptionGenesis() {
  const { formulaire } = optinGenesis;
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      <BoutonGenesis onClick={() => setOuvert(true)}>
        {formulaire.bouton}
      </BoutonGenesis>
      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent
          aria-describedby={undefined}
          showCloseButton={false}
          className="max-w-[calc(100%-2rem)] gap-0 rounded-[5px] border-0 bg-[var(--genesis-fond)] p-0 text-[var(--genesis-encre)] shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:max-w-[352px]"
        >
          <div className="px-4 pt-5 pr-12 sm:px-[15px]">
            <DialogTitle className="text-xl leading-snug font-bold text-balance">
              {formulaire.titre}
            </DialogTitle>
          </div>
          <Formulaire />
          <DialogClose
            aria-label="Fermer"
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-md bg-[var(--genesis-encre)] text-white sm:size-9"
          >
            <X aria-hidden className="size-4" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Formulaire() {
  const { formulaire, reassurance } = optinGenesis;
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

  /* Le champ de la référence : 53 px, angles de 5 px, pas de bordure, une
     ombre intérieure. Le libellé est dans le champ, en PT Serif 16 px ; ici
     il reste un `placeholder` doublé d'un `aria-label`, puisqu'un texte
     d'exemple disparaît à la saisie et ne nomme rien aux lecteurs d'écran. */
  const champ =
    "h-[53px] w-full rounded-[5px] border border-transparent bg-white px-[13px] text-base text-[var(--genesis-encre)] shadow-[inset_0_0_5px_rgba(0,0,0,0.21)] placeholder:text-[#151517]/70";

  return (
    <form
      onSubmit={valider}
      className="flex flex-col gap-[15px] px-4 pt-4 pb-5 sm:px-[15px]"
      aria-describedby={erreur ? "erreur-genesis" : undefined}
    >
      <input
        name="prenom"
        autoComplete="given-name"
        required
        placeholder={formulaire.prenom}
        aria-label={formulaire.prenom}
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className={champ}
      />
      <input
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder={formulaire.email}
        aria-label={formulaire.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={champ}
      />
      {erreur ? (
        <p
          id="erreur-genesis"
          role="alert"
          className="text-sm font-bold text-destructive"
        >
          {formulaire.erreur}
        </p>
      ) : null}
      <BoutonGenesis soumettre disabled={envoi}>
        {envoi ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle aria-hidden className="size-5 animate-spin" />
            {formulaire.envoi}
          </span>
        ) : (
          formulaire.bouton
        )}
      </BoutonGenesis>
      {reassurance ? (
        <p className="text-center text-sm text-[#60606b]">{reassurance}</p>
      ) : (
        <Emplacement
          attendu="la ligne de réassurance sous le bouton"
          className="min-h-0 px-3 py-3"
        />
      )}
    </form>
  );
}
