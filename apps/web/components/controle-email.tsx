"use client";

import { API_FUNNELS } from "@/contenu/vsl";
import {
  adresseMasquee,
  examinerEmail,
  FILTRE_EMAIL_ACTIF,
  type MotifRefus,
} from "@/lib/filtre-email";
import { verifierDomaineEmail } from "@/lib/filtre-email-action";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * **Le filtre des faux e-mails, côté page**, partagé par les opt-ins de
 * Formation Genesis et de Course modèle : les règles de `filtre-email.ts`,
 * appliquées à l'étape de l'e-mail, avant toute inscription.
 *
 * - **Instantané pour presque tout le monde** : une adresse d'un grand
 *   fournisseur (gmail, hotmail, orange…) se juge sans le réseau. Seul un
 *   autre domaine fait demander au serveur s'il reçoit des e-mails, une
 *   seconde et demie au plus, puis l'adresse passe.
 * - **Une faute de frappe se propose** sous le champ (« Vouliez-vous dire
 *   jean@gmail.com ? ») : « Oui, corriger » ou « Non, garder la mienne »,
 *   et le formulaire repart tout seul. Appuyer de nouveau sur le bouton
 *   garde l'adresse tapée. Une adresse gardée passe encore par la
 *   vérification de son domaine.
 * - **Chaque refus est noté dans le CRM** (`/email/refus`, sans l'adresse
 *   entière : son domaine et ses deux premières lettres), pour repérer
 *   aussitôt une vraie personne refusée à tort.
 * - **Le piège à robots** : un champ invisible qu'une personne ne voit pas
 *   et que les robots remplissent. Il ne compte **que s'il est rempli et
 *   que l'e-mail arrive moins de trois secondes après l'ouverture du
 *   formulaire**, plus vite qu'une main, même aidée du remplissage
 *   automatique. Les deux à la fois, sinon rien : un gestionnaire de mots
 *   de passe qui le remplirait seul ne fait perdre personne. Un robot n'est
 *   pas prévenu : le formulaire avance, mais plus rien ne part.
 */

type Tunnel = "formation-genesis" | "course-modele";

/** Les phrases d'un refus, une par motif (sauf le robot, qu'on ne prévient
 *  pas). */
export type MessagesRefus = Record<Exclude<MotifRefus, "robot">, string>;

/** Ce que l'étape de l'e-mail fait de l'adresse. */
export type Examen =
  | { suite: "continuer" }
  | { suite: "verifier" }
  | { suite: "arreter"; erreur?: string };

const PIEGE_MS = 3000;
const ATTENTE_DOMAINE_MS = 1500;

/** Le refus dans le CRM, en tâche de fond : rien n'attend sa réponse. */
function noterRefus(tunnel: Tunnel, adresse: string, motif: MotifRefus) {
  const { domaine, masque } = adresseMasquee(adresse);
  void fetch(`${API_FUNNELS}/email/refus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ tunnel, motif, domaine, masque }),
  }).catch(() => {});
}

export function useControleEmail(tunnel: Tunnel, messages: MessagesRefus) {
  /** La correction proposée, pour l'adresse telle qu'elle était tapée. */
  const [proposee, setProposee] = useState<{ pour: string; adresse: string } | null>(
    null,
  );
  /** Les adresses dont la personne a refusé la correction. */
  const gardees = useRef(new Set<string>());
  const [piege, setPiege] = useState("");
  const ouvert = useRef(0);
  useEffect(() => {
    ouvert.current = Date.now();
  }, []);

  const refuser = useCallback(
    (adresse: string, motif: Exclude<MotifRefus, "robot">) => {
      noterRefus(tunnel, adresse, motif);
      return messages[motif];
    },
    [tunnel, messages],
  );

  /** Un robot : le piège rempli, et l'e-mail arrivé trop vite. Noté une
   *  fois dans le CRM. */
  const estRobot = useCallback(
    (adresse: string) => {
      if (!FILTRE_EMAIL_ACTIF || !piege.trim()) return false;
      if (Date.now() - ouvert.current >= PIEGE_MS) return false;
      noterRefus(tunnel, adresse, "robot");
      return true;
    },
    [piege, tunnel],
  );

  /** Le verdict sans le réseau. Une correction se propose une fois par
   *  adresse ; redemander la même adresse, c'est la garder. */
  const examiner = useCallback(
    (adresse: string): Examen => {
      const verdict = examinerEmail(adresse);
      if (verdict.etat === "refus") {
        return { suite: "arreter", erreur: refuser(adresse, verdict.motif) };
      }
      if (verdict.etat === "suggestion") {
        if (gardees.current.has(adresse) || proposee?.pour === adresse) {
          gardees.current.add(adresse);
          setProposee(null);
          return { suite: "verifier" };
        }
        setProposee({ pour: adresse, adresse: verdict.adresse });
        return { suite: "arreter" };
      }
      return verdict.verifierDomaine ? { suite: "verifier" } : { suite: "continuer" };
    },
    [proposee, refuser],
  );

  /** Le domaine reçoit-il des e-mails ? La phrase du refus, ou `null` si
   *  l'adresse passe (une réponse trop lente aussi). */
  const verifier = useCallback(
    async (adresse: string): Promise<string | null> => {
      const reception = await Promise.race([
        verifierDomaineEmail(adresse).catch(() => "inconnu" as const),
        new Promise<"inconnu">((fin) =>
          setTimeout(() => fin("inconnu"), ATTENTE_DOMAINE_MS),
        ),
      ]);
      return reception === "non" ? refuser(adresse, "domaine") : null;
    },
    [refuser],
  );

  /** La personne garde son adresse : la correction ne se repropose plus. */
  const garder = useCallback((adresse: string) => {
    gardees.current.add(adresse);
    setProposee(null);
  }, []);

  return {
    examiner,
    verifier,
    estRobot,
    garder,
    /** La correction à montrer pour l'adresse actuelle, ou `null`. */
    correctionPour: (adresse: string) =>
      proposee && proposee.pour === adresse.trim() ? proposee.adresse : null,
    piege: { valeur: piege, changer: setPiege },
  };
}

/**
 * Relance l'envoi du formulaire après le prochain rendu, quand l'adresse
 * corrigée est posée : c'est elle que l'envoi lira.
 */
export function useRelance(formulaire: React.RefObject<HTMLFormElement | null>) {
  const [demandes, setDemandes] = useState(0);
  useEffect(() => {
    if (demandes === 0) return;
    const form = formulaire.current;
    if (!form) return;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
  }, [demandes, formulaire]);
  return useCallback(() => setDemandes((n) => n + 1), []);
}

/**
 * « Vouliez-vous dire jean@gmail.com ? » sous le champ : une question, pas
 * une erreur (ni rouge ni alerte), au surligné bleu pâle du tunnel.
 */
export function SuggestionEmail({
  adresse,
  textes,
  onAccepter,
  onGarder,
}: {
  adresse: string;
  textes: { question: string; accepter: string; garder: string };
  onAccepter: () => void;
  onGarder: () => void;
}) {
  return (
    <div
      role="status"
      className="flex flex-col gap-1 rounded-none bg-[var(--genesis-surligne)] px-3 py-2.5 text-[15px] leading-snug"
    >
      <p className="text-pretty">
        {textes.question} <strong className="break-all">{adresse}</strong>&nbsp;?
      </p>
      <div className="flex flex-wrap gap-x-4">
        <button
          type="button"
          onClick={onAccepter}
          className="inline-flex min-h-10 cursor-pointer items-center font-bold underline underline-offset-4"
        >
          {textes.accepter}
        </button>
        <button
          type="button"
          onClick={onGarder}
          className="inline-flex min-h-10 cursor-pointer items-center text-[#60606b] underline-offset-4 hover:text-[var(--genesis-encre)] hover:underline"
        >
          {textes.garder}
        </button>
      </div>
    </div>
  );
}

/**
 * Le champ que seuls les robots remplissent : hors de l'écran, hors du
 * parcours au clavier, caché aux lecteurs d'écran. Un nom et un libellé
 * que le remplissage automatique ne reconnaît pas (ni nom, ni société, ni
 * site), et `autoComplete="off"`.
 */
export function PiegeRobots({
  valeur,
  changer,
}: {
  valeur: string;
  changer: (valeur: string) => void;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        Ne pas remplir
        <input
          type="text"
          name="champ-controle"
          tabIndex={-1}
          autoComplete="off"
          value={valeur}
          onChange={(e) => changer(e.target.value)}
        />
      </label>
    </div>
  );
}
