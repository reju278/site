"use client";

import {
  completerGenesis,
  inscrireGenesis,
} from "@/app/formation-genesis/actions";
import { BoutonGenesis } from "@/components/bouton-genesis";
import {
  CADRE_GENESIS as CADRE,
  ChampGenesis as Champ,
  LIBELLE_GENESIS as LIBELLE,
} from "@/components/champ-genesis";
import { ID_FORMULAIRE_GENESIS } from "@/components/maquette-lecteur-genesis";
import {
  CLE_BIENVENUE_GENESIS,
  optinGenesis,
  partiesGenesis,
  RACINE_GENESIS,
} from "@/contenu/formation-genesis";
import { API_FUNNELS, CLE_CONTACT_VSL, legalesVsl } from "@/contenu/vsl";
import { numeroInternational, PAYS } from "@/lib/telephone";
import { cn } from "@repo/ui/lib/utils";
import { ArrowLeft, ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Etape = "nom" | "email" | "telephone";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Le formulaire de l'optin de la Formation Genesis, **posé dans la page et
 * non dans une fenêtre**, en trois étapes, sur demande de Rémy :
 *
 * 1. le prénom et le nom, bouton « Obtenir la formation gratuite » ;
 * 2. l'e-mail et le consentement, bouton « Continuer » : **c'est ici que la
 *    personne est inscrite** dans ClickFunnels et reçoit le tag qui lance la
 *    séquence (`inscrireGenesis`). **Sans attente**, sur demande de Rémy :
 *    l'envoi part en arrière-plan et le téléphone s'affiche aussitôt ; la
 *    troisième étape attend sa réponse avant d'ajouter le numéro ;
 * 3. le téléphone, bouton « Continuer » : il s'ajoute au même contact
 *    (`completerGenesis`), puis on entre dans l'espace membre.
 *
 * Inscrire à la deuxième étape et non à la fin, c'est garder le contact de
 * qui s'arrête devant le téléphone : il reçoit quand même la formation par
 * e-mail. **L'espace, lui, ne s'ouvre qu'après la troisième.**
 *
 * Une seule `form` dont le contenu change, et non trois : l'état vit ici, et
 * revenir en arrière retrouve ce qu'on avait tapé. Le changement d'étape
 * place le curseur dans le premier champ de la suivante, sauf au chargement,
 * où ça ferait défiler la page sur téléphone.
 *
 * **La vérification est la nôtre, pas celle du navigateur** (`noValidate`) :
 * Rémy veut une phrase rouge sous le bouton quand un champ manque, sur une
 * référence, et les bulles natives ne se placent ni ne se rédigent. Un champ
 * qui manque prend aussi la bordure rouge (`aria-invalid`).
 *
 * Prénom, nom, e-mail et numéro sont aussi gardés dans le navigateur, sous
 * la clé du tunnel VSL (sept jours, jamais dans l'adresse) : la réservation
 * de `/reservation` (Calendly) s'en préremplit : prénom, nom, e-mail et
 * téléphone.
 */
export function InscriptionGenesis() {
  const { formulaire } = optinGenesis;
  const [etape, setEtape] = useState<Etape>("nom");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [consenti, setConsenti] = useState(false);
  const [pays, setPays] = useState<string>(PAYS[0].code);
  const [telephone, setTelephone] = useState("");
  const [envoi, setEnvoi] = useState(false);
  /** Vrai après un essai de l'étape en cours : les champs vides passent au
   *  rouge. Remis à zéro à chaque changement d'étape. */
  const [tente, setTente] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const premierChamp = useRef<HTMLInputElement>(null);
  const aChange = useRef(false);

  useEffect(() => {
    if (aChange.current) premierChamp.current?.focus();
  }, [etape]);

  const aller = (suivante: Etape) => {
    aChange.current = true;
    setErreur(null);
    setTente(false);
    setEtape(suivante);
  };

  /** L'inscription en cours ou faite, lancée à la validation de l'e-mail.
   *  Le signal « lead » ne part qu'une fois, le contact créé. */
  const inscription = useRef<Promise<{ ok: boolean }> | null>(null);
  const leadEnvoye = useRef(false);
  const inscrire = () =>
    inscrireGenesis(prenom, nom, email)
      .catch(() => ({ ok: false as const }))
      .then((resultat) => {
        if (resultat.ok && !leadEnvoye.current) {
          leadEnvoye.current = true;
          const fenetreGtm = window as unknown as { dataLayer?: unknown[] };
          fenetreGtm.dataLayer?.push({ event: "lead", funnel: "genesis" });
        }
        return resultat;
      });

  /**
   * Le CRM Funnels Club (onglet Funnels, tunnel « Formation Genesis ») :
   * l'opt-in à l'e-mail, puis le téléphone. **En tâche de fond et sans
   * jamais retenir personne** : un CRM injoignable ne bloque pas
   * l'inscription, qui part chez ClickFunnels par ailleurs. `keepalive`
   * laisse le dernier envoi finir pendant que la page change.
   */
  const signaler = (etapeCrm: "email" | "telephone", numero?: string) => {
    void fetch(`${API_FUNNELS}/genesis/optin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        etape: etapeCrm,
        prenom: prenom.trim(),
        nom: nom.trim(),
        email: email.trim(),
        consentement: consenti,
        ...(numero ? { telephone: numero } : {}),
      }),
    }).catch(() => {});
  };

  const ranger = (numero?: string) => {
    try {
      localStorage.setItem(
        CLE_CONTACT_VSL,
        JSON.stringify({
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim(),
          ...(numero ? { telephone: numero } : {}),
          t: Date.now(),
        }),
      );
    } catch {
      /* Stockage bloqué : la réservation ne sera pas préremplie. */
    }
  };

  /* Ce qui manque à l'étape en cours, pour la phrase rouge et les bordures. */
  const manque = {
    prenom: !prenom.trim(),
    nom: !nom.trim(),
    email: !email.trim(),
    consentement: !consenti,
    telephone: !telephone.trim(),
  };

  const valider = async (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (envoi) return;
    setTente(true);
    setErreur(null);

    if (etape === "nom") {
      if (manque.prenom || manque.nom) {
        setErreur(formulaire.erreurs.champs);
        return;
      }
      aller("email");
      return;
    }

    if (etape === "email") {
      if (manque.email || manque.consentement) {
        setErreur(formulaire.erreurs.champs);
        return;
      }
      if (!EMAIL.test(email.trim())) {
        setErreur(formulaire.erreurs.email);
        return;
      }
      /* **Instantané**, sur demande de Rémy : l'inscription part en
         arrière-plan et l'étape du téléphone s'affiche tout de suite. Le
         temps de taper un numéro, ClickFunnels a répondu. */
      inscription.current = inscrire();
      signaler("email");
      ranger();
      aller("telephone");
      return;
    }

    if (manque.telephone) {
      setErreur(formulaire.erreurs.champs);
      return;
    }
    const numero = numeroInternational(pays, telephone);
    if (!numero) {
      setErreur(formulaire.erreurs.telephone);
      premierChamp.current?.focus();
      return;
    }
    setEnvoi(true);
    /* L'inscription partie à l'étape précédente doit avoir réussi avant
       qu'on y ajoute le numéro. Si elle a échoué (réseau coupé, adresse
       refusée), elle est retentée une fois ici ; si elle échoue encore,
       l'erreur s'affiche et le bouton « Retour » mène à l'e-mail. */
    let inscrit = await (inscription.current ?? inscrire());
    if (!inscrit.ok) inscrit = await inscrire();
    const resultat = inscrit.ok
      ? await completerGenesis(email, numero).catch(() => ({
          ok: false as const,
        }))
      : inscrit;
    if (!resultat.ok) {
      setEnvoi(false);
      setErreur(formulaire.erreurs.envoi);
      return;
    }
    signaler("telephone", numero);
    ranger(numero);
    /* La marque de l'arrivée qui suit l'inscription : l'espace l'efface en
       la lisant et affiche une fois la notification de l'e-mail envoyé
       (`BienvenueGenesis`). Un onglet, une fois : `sessionStorage`. */
    try {
      sessionStorage.setItem(CLE_BIENVENUE_GENESIS, "1");
    } catch {
      /* Stockage refusé : pas de notification, l'espace s'ouvre quand même. */
    }
    window.location.assign(
      `${RACINE_GENESIS}/espace/${partiesGenesis[0]?.cle ?? "1"}`,
    );
  };

  const { question, bouton } = formulaire.etapes[etape];
  const precedente: Etape | null =
    etape === "telephone" ? "email" : etape === "email" ? "nom" : null;
  const choisi = PAYS.find((p) => p.code === pays) ?? PAYS[0];
  const telephoneFaux =
    (tente && manque.telephone) || erreur === formulaire.erreurs.telephone;

  return (
    <div
      id={ID_FORMULAIRE_GENESIS}
      className="scroll-mt-6 bg-white p-5 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-7"
    >
      <form
        noValidate
        onSubmit={valider}
        aria-describedby={erreur ? "erreur-genesis" : undefined}
      >
        <fieldset className="flex flex-col gap-4" disabled={envoi}>
          {/* La question est la légende du groupe : un lecteur d'écran la
              lit avec le champ, et elle n'entre pas dans le plan des
              titres. */}
          {/* 20 px sur téléphone : à 24, « Comment vous appelez-vous ? » se
              coupait au trait d'union. */}
          <legend className="mb-5 text-xl leading-snug font-bold text-pretty sm:text-2xl">
            {question}
          </legend>

          {etape === "nom" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <Champ
                ref={premierChamp}
                id="genesis-prenom"
                libelle={formulaire.prenom}
                placeholder={formulaire.exemples.prenom}
                name="prenom"
                autoComplete="given-name"
                aria-required
                aria-invalid={tente && manque.prenom}
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              <Champ
                id="genesis-nom"
                libelle={formulaire.nom}
                placeholder={formulaire.exemples.nom}
                name="nom"
                autoComplete="family-name"
                aria-required
                aria-invalid={tente && manque.nom}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
          ) : null}

          {etape === "email" ? (
            <>
              <Champ
                ref={premierChamp}
                id="genesis-email"
                libelle={formulaire.email}
                placeholder={formulaire.exemples.email}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-required
                aria-invalid={
                  (tente && manque.email) || erreur === formulaire.erreurs.email
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* 12 px, sur demande de Rémy, pour tenir en deux lignes dans la
                  colonne du formulaire en large : mesuré, la phrase fait 701 px
                  à ce corps et 760 à 13, pour deux lignes de 402. */}
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
                  {formulaire.consentement}
                  <a
                    href={legalesVsl[1].href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--genesis-encre)]"
                  >
                    {formulaire.lienConfidentialite}
                  </a>
                  .
                </span>
              </label>
            </>
          ) : null}

          {etape === "telephone" ? (
            <div className="grid">
              <label htmlFor="genesis-telephone" className={LIBELLE}>
                {formulaire.telephone}
              </label>
              {/* Un seul cadre autour du pays et du numéro, qui répond au
                  focus comme les autres champs. Le menu est un `select`
                  natif posé sur le drapeau : sur téléphone, c'est la roue
                  du système qui s'ouvre. */}
              <div
                className={cn(
                  CADRE,
                  "flex focus-within:border-[var(--genesis-encre)] focus-within:shadow-[0_0_0_1px_var(--genesis-encre)]",
                  telephoneFaux &&
                    "border-destructive focus-within:border-destructive focus-within:shadow-[0_0_0_1px_var(--destructive)] hover:border-destructive",
                )}
              >
                <div className="relative flex shrink-0 items-center gap-1.5 border-r border-black/15 px-3">
                  <span aria-hidden className="text-xl leading-none">
                    {choisi.drapeau}
                  </span>
                  <span aria-hidden className="text-base tabular-nums">
                    {choisi.indicatif}
                  </span>
                  <ChevronDown aria-hidden className="size-4 text-[#60606b]" />
                  <select
                    name="country"
                    autoComplete="country"
                    aria-label={formulaire.pays}
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  >
                    {PAYS.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.drapeau} {p.nom} ({p.indicatif})
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  ref={premierChamp}
                  id="genesis-telephone"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  aria-required
                  placeholder={choisi.exemple}
                  aria-invalid={telephoneFaux}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 text-[17px] text-[var(--genesis-encre)] outline-none placeholder:text-[var(--genesis-gris)] focus-visible:outline-none"
                />
              </div>
            </div>
          ) : null}

          <BoutonGenesis soumettre disabled={envoi} className="mt-1">
            {envoi ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle aria-hidden className="size-5 animate-spin" />
                {formulaire.envoi}
              </span>
            ) : (
              bouton
            )}
          </BoutonGenesis>

          {/* La phrase rouge sous le bouton, sur la référence de Rémy. */}
          {erreur ? (
            <p
              id="erreur-genesis"
              role="alert"
              className="text-center text-sm font-bold text-destructive"
            >
              {erreur}
            </p>
          ) : null}

          {precedente ? (
            <button
              type="button"
              onClick={() => aller(precedente)}
              className="inline-flex min-h-10 items-center gap-1.5 self-center text-sm text-[#60606b] underline-offset-4 hover:text-[var(--genesis-encre)] hover:underline"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {formulaire.retour}
            </button>
          ) : null}
        </fieldset>
      </form>
    </div>
  );
}
