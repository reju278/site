"use client";

import { inscrireCourseModele } from "@/app/course-modele/actions";
import { BoutonGenesis } from "@/components/bouton-genesis";
import { ChampGenesis } from "@/components/champ-genesis";
import {
  APRES_INSCRIPTION,
  optinCourseModele,
  TAG_HYROS_COURSE_MODELE,
} from "@/contenu/course-modele";
import { API_FUNNELS, CLE_CONTACT_VSL, legalesVsl } from "@/contenu/vsl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Le bouton « Apprendre » de Course modèle et sa fenêtre d'inscription :
 * prénom, e-mail, consentement, puis « Voir la vidéo ».
 *
 * **Une fenêtre, comme sur `funnels.club/course-2025-fb`**, sur demande de
 * Rémy, mais **au dessin de Formation Genesis** : la carte blanche à ombre
 * douce et à angles droits, les champs d'Arc UI (`ChampGenesis`), la case de
 * consentement et la phrase rouge sous le bouton quand un champ manque
 * (`noValidate` : les bulles du navigateur ne se placent pas). La fenêtre
 * est rendue dans un portail, hors de `[data-genesis]` : la règle qui
 * équerre les angles du tunnel ne l'atteint pas, d'où les `rounded-none`
 * écrits ici. Les polices et les jetons, eux, sont posés sur la racine.
 *
 * À l'envoi, quatre destinataires, dans cet ordre :
 *
 * 1. **Hyros**, par son script chargé par GTM : le tag `!course-2025` puis
 *    l'adresse (`hyros_email`), avant tout le reste, pour qu'il ait le temps
 *    de partir avant que la page change. Son script lit aussi les champs
 *    seul, mais ceux d'une fenêtre naissent après son passage sur la page :
 *    on ne compte pas dessus.
 * 2. **Le CRM** (onglet Funnels, tunnel « Course modèle ») : l'opt-in, en
 *    tâche de fond et sans jamais retenir personne. `keepalive` le laisse
 *    finir pendant que la page change.
 * 3. **ClickFunnels**, par la server action : le contact et le tag
 *    « course-2025 », qui lance l'automatisation. Elle vérifie le prénom,
 *    l'adresse et sa configuration, puis répond aussitôt et inscrit après
 *    sa réponse (voir `actions.ts`) : **on passe à la vidéo sans attendre**,
 *    un contact neuf demandant près de dix secondes à ClickFunnels.
 * 4. **GTM**, l'événement `lead`, une fois l'inscription acceptée.
 *
 * Prénom et e-mail sont aussi gardés dans le navigateur, sous la clé du
 * tunnel VSL (sept jours, jamais dans l'adresse) : la page d'arrivée,
 * `/video-vsl`, en préremplit Calendly.
 */
export function InscriptionCourseModele() {
  const { bouton, fenetre } = optinCourseModele;
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      <BoutonGenesis onClick={() => setOuvert(true)}>{bouton}</BoutonGenesis>
      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent
          aria-describedby={undefined}
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-none border-0 bg-[var(--genesis-fond)] p-0 text-[var(--genesis-encre)] shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:max-w-[400px]"
        >
          {/* Le titre de la page ClickFunnels, centré et sur deux lignes ;
              la place de la croix est réservée des deux côtés pour que le
              centrage reste juste. **Sur téléphone, la coupure de la
              référence saute** : à 375 px, « pour découvrir la stratégie : »
              ne tenait pas sur une ligne et le titre en prenait trois ;
              `text-balance` en fait deux égales. */}
          <div className="px-11 pt-6 sm:px-12">
            <DialogTitle className="text-center text-lg leading-snug font-bold text-balance sm:text-xl">
              {fenetre.titre[0]}
              <br className="max-sm:hidden" /> {fenetre.titre[1]}
            </DialogTitle>
          </div>
          <Formulaire />
          <DialogClose
            aria-label={fenetre.fermer}
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-none bg-[var(--genesis-encre)] text-white transition-opacity hover:opacity-85 sm:size-9"
          >
            <X aria-hidden className="size-4" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

type Hyros = {
  hrs?: { addLeadTag?: (tag: string) => void };
};

function Formulaire() {
  const { fenetre } = optinCourseModele;
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [consenti, setConsenti] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  /** Vrai après un premier essai : les champs vides passent au rouge. */
  const [tente, setTente] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const manque = {
    prenom: !prenom.trim(),
    email: !email.trim(),
    consentement: !consenti,
  };

  const valider = async (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (envoi) return;
    setTente(true);
    setErreur(null);
    if (manque.prenom || manque.email || manque.consentement) {
      setErreur(fenetre.erreurs.champs);
      return;
    }
    const adresse = email.trim();
    if (!EMAIL.test(adresse)) {
      setErreur(fenetre.erreurs.email);
      return;
    }
    setEnvoi(true);

    /* 1. Hyros : le tag d'abord, pour qu'il parte avec l'adresse. Rien ne
       doit retenir l'inscription si son script n'est pas là (bloqueur). */
    try {
      (window as unknown as Hyros).hrs?.addLeadTag?.(TAG_HYROS_COURSE_MODELE);
      window.dispatchEvent(
        new CustomEvent("hyros_email", { detail: { email: adresse } }),
      );
    } catch {
      /* Hyros absent : il apprendra le contact par ClickFunnels. */
    }
    /* Son envoi part par son propre transport, qu'on ne choisit pas : on lui
       laisse au moins ce délai avant de changer de page. */
    const delaiHyros = new Promise((fin) => setTimeout(fin, 800));

    /* 2. Le CRM, sans attendre. */
    void fetch(`${API_FUNNELS}/course-modele/optin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        prenom: prenom.trim(),
        email: adresse,
        consentement: true,
      }),
    }).catch(() => {});

    try {
      localStorage.setItem(
        CLE_CONTACT_VSL,
        JSON.stringify({ prenom: prenom.trim(), email: adresse, t: Date.now() }),
      );
    } catch {
      /* Stockage bloqué : Calendly ne sera pas prérempli. */
    }

    /* 3. ClickFunnels : la réponse arrive dès la vérification faite, et
       l'inscription suit côté serveur. Un serveur injoignable est retenté
       une fois. */
    const inscrire = () =>
      inscrireCourseModele(prenom, adresse).catch(() => ({
        ok: false as const,
      }));
    let resultat = await inscrire();
    if (!resultat.ok) resultat = await inscrire();
    if (!resultat.ok) {
      setEnvoi(false);
      setErreur(fenetre.erreurs.envoi);
      return;
    }

    /* 4. GTM. */
    const fenetreGtm = window as unknown as { dataLayer?: unknown[] };
    fenetreGtm.dataLayer?.push({ event: "lead", funnel: "course-modele" });
    await delaiHyros;
    window.location.assign(APRES_INSCRIPTION);
  };

  return (
    <form
      noValidate
      onSubmit={valider}
      aria-describedby={erreur ? "erreur-course-modele" : undefined}
    >
      <fieldset
        disabled={envoi}
        className="flex flex-col gap-4 px-5 pt-5 pb-6 sm:px-6"
      >
        <ChampGenesis
          id="course-modele-prenom"
          libelle={fenetre.prenom}
          placeholder={fenetre.exemples.prenom}
          name="prenom"
          autoComplete="given-name"
          aria-required
          aria-invalid={tente && manque.prenom}
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <ChampGenesis
          id="course-modele-email"
          libelle={fenetre.email}
          placeholder={fenetre.exemples.email}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-required
          aria-invalid={
            (tente && manque.email) || erreur === fenetre.erreurs.email
          }
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-[#60606b]">
          <input
            type="checkbox"
            aria-required
            aria-invalid={tente && manque.consentement}
            checked={consenti}
            onChange={(e) => setConsenti(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--genesis-bleu)] aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive"
          />
          <span>
            {fenetre.consentement}
            <a
              href={legalesVsl[1].href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-[var(--genesis-encre)]"
            >
              {fenetre.lienConfidentialite}
            </a>
            .
          </span>
        </label>

        <BoutonGenesis soumettre disabled={envoi} className="mt-1">
          {envoi ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle aria-hidden className="size-5 animate-spin" />
              {fenetre.envoi}
            </span>
          ) : (
            fenetre.bouton
          )}
        </BoutonGenesis>

        {erreur ? (
          <p
            id="erreur-course-modele"
            role="alert"
            className="text-center text-sm font-bold text-destructive"
          >
            {erreur}
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}
