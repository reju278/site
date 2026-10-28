"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { API_FUNNELS, CLE_CONTACT_VSL, optinVsl } from "@/contenu/vsl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";
import { useRef, useState } from "react";

/**
 * L'opt-in de la formation gratuite : l'aperçu de la vidéo et le bouton
 * ouvrent la même fenêtre — prénom, e-mail, consentement.
 *
 * L'inscription part au CRM Funnels Club (`/vsl/optin`), qui pose le
 * contact dans ClickFunnels avec l'étiquette « inscription vsl ». Prénom
 * et e-mail restent dans le navigateur (`sessionStorage`, jamais dans
 * l'adresse) pour pré-remplir Calendly sur `/video`. On y va par une
 * navigation complète : le formulaire de Calendly lit ces informations au
 * chargement de la page, pas après une navigation côté client.
 */
export function InscriptionVsl() {
  const [ouvert, setOuvert] = useState(false);
  const { fenetre } = optinVsl;

  return (
    <>
      <div className="grid items-center gap-6 rounded-[var(--radius-lg)] border bg-card p-4 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] sm:p-6 md:grid-cols-[1.15fr_1fr] md:gap-8">
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-label="Voir la vidéo gratuite"
          className="group relative block overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vsl/apercu.jpg"
            alt="Rémy présente la formation gratuite"
            width={1280}
            height={721}
            fetchPriority="high"
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {/* L'aperçu porte déjà son bouton de lecture : seul un voile au
              survol dit qu'il se clique. */}
          <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </button>

        <div className="flex flex-col gap-4">
          <p className="font-semibold text-foreground">{optinVsl.intro}</p>
          <ul className="flex flex-col gap-3">
            {optinVsl.points.map((point) => (
              <li key={point} className="flex gap-2.5 text-[15px] leading-snug">
                <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <ArrowRight className="size-3" strokeWidth={3} />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <BoutonScintillant
            action={() => setOuvert(true)}
            className="mt-2 w-full text-lg"
          >
            <TexteRoulant>{optinVsl.bouton}</TexteRoulant>
          </BoutonScintillant>
        </div>
      </div>

      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md">
          <div className="border-b px-6 pt-7 pb-5 text-center">
            <DialogTitle className="titre text-2xl text-balance">
              {fenetre.titre}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm">
              La vidéo vous attend juste après.
            </DialogDescription>
          </div>
          <Formulaire />
        </DialogContent>
      </Dialog>

      {/* Le relais vers ClickFunnels, invisible.

          C'est lui que le SDK prend en charge, et non le formulaire de la
          fenêtre, parce que le SDK **remplace l'envoi** : il l'annule, puis
          poste lui-même vers ClickFunnels par une navigation complète, qui
          aurait pu couper en route l'envoi au CRM, donc l'étiquette
          « inscription vsl » et la séquence. Ici, on ne le soumet qu'une fois
          le CRM d'accord : ClickFunnels compte alors l'opt-in de l'étape, et
          renvoie vers l'étape suivante du tunnel.

          Toujours monté, hors de la fenêtre : le SDK le trouve au
          chargement. Pas de `type="hidden"` sur les champs, que le SDK ne
          lit pas forcément ; le `hidden` du formulaire suffit à les cacher,
          et `tabIndex` à les sortir du clavier. */}
      <form id={RELAIS_CLICKFUNNELS} hidden aria-hidden>
        <input data-cf-element="first-name" name="first_name" tabIndex={-1} />
        <input data-cf-element="email" name="email" type="email" tabIndex={-1} />
      </form>
    </>
  );
}

const RELAIS_CLICKFUNNELS = "relais-clickfunnels";

/**
 * Passe l'inscription au SDK de ClickFunnels, puis à l'étape suivante.
 *
 * Le SDK ne s'occupe que d'un formulaire qu'il a reconnu
 * (`data-cf-sdk-enhanced`) ; sinon, script bloqué ou pas encore chargé, on va
 * directement à `/video`. Et si sa navigation n'est pas partie au bout de
 * cinq secondes, en local par exemple, où l'adresse ne correspond pas à
 * l'étape enregistrée, on y va aussi : l'inscription est déjà au CRM, le
 * visiteur ne doit pas rester bloqué.
 */
function continuer(prenom: string, email: string) {
  const relais = document.getElementById(RELAIS_CLICKFUNNELS);
  if (
    relais instanceof HTMLFormElement &&
    relais.dataset.cfSdkEnhanced === "true"
  ) {
    const champ = (nom: string) =>
      relais.querySelector<HTMLInputElement>(`[data-cf-element="${nom}"]`);
    const champPrenom = champ("first-name");
    const champEmail = champ("email");
    if (champPrenom && champEmail) {
      champPrenom.value = prenom;
      champEmail.value = email;
      window.setTimeout(() => {
        window.location.href = "/video";
      }, 5000);
      relais.requestSubmit();
      return;
    }
  }
  window.location.href = "/video";
}

function Formulaire() {
  const { fenetre } = optinVsl;
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [accord, setAccord] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const formulaire = useRef<HTMLFormElement>(null);

  const valider = async (evenement: React.FormEvent) => {
    evenement.preventDefault();
    if (!accord) {
      setErreur("Cochez la case pour recevoir la formation.");
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      const reponse = await fetch(`${API_FUNNELS}/vsl/optin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, email, consentement: true }),
      });
      if (!reponse.ok) {
        const corps = (await reponse.json().catch(() => ({}))) as {
          erreur?: string;
        };
        throw new Error(corps.erreur ?? "Inscription impossible");
      }
      try {
        sessionStorage.setItem(
          CLE_CONTACT_VSL,
          JSON.stringify({ prenom: prenom.trim(), email: email.trim() }),
        );
      } catch {
        /* Stockage bloqué : Calendly ne sera simplement pas pré-rempli. */
      }
      const fenetreGtm = window as unknown as { dataLayer?: unknown[] };
      fenetreGtm.dataLayer?.push({ event: "lead", funnel: "vsl" });
      continuer(prenom.trim(), email.trim());
    } catch (e) {
      setErreur(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "Inscription impossible, réessayez dans un instant.",
      );
      setEnvoi(false);
    }
  };

  return (
    <form ref={formulaire} onSubmit={valider} className="flex flex-col gap-3 px-6 pt-5 pb-6">
      <Input
        required
        autoComplete="given-name"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className="h-12 text-base"
        aria-label="Prénom"
      />
      <Input
        required
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 text-base"
        aria-label="Email"
      />
      <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={accord}
          onChange={(e) => setAccord(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--primary)]"
        />
        <span>
          {fenetre.consentement}
          <a
            href="/course/confidentialite"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {fenetre.lienConfidentialite}
          </a>
          .
        </span>
      </label>
      {erreur ? (
        <p role="alert" className="text-sm text-destructive">
          {erreur}
        </p>
      ) : null}
      <BoutonScintillant
        /* Le bouton du site est un `type="button"` : il demande l'envoi
           du formulaire, qui garde ainsi ses vérifications natives. */
        action={() => {
          if (!envoi) formulaire.current?.requestSubmit();
        }}
        className="mt-2 w-full text-lg"
      >
        {envoi ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          <TexteRoulant>{fenetre.bouton}</TexteRoulant>
        )}
      </BoutonScintillant>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Vos informations restent confidentielles.
      </p>
    </form>
  );
}
