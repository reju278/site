"use client";

import {
  completerGenesis,
  inscrireGenesis,
} from "@/app/formation-genesis/actions";
import { BoutonGenesis } from "@/components/bouton-genesis";
import {
  optinGenesis,
  partiesGenesis,
  RACINE_GENESIS,
} from "@/contenu/formation-genesis";
import { CLE_CONTACT_VSL, legalesVsl } from "@/contenu/vsl";
import { numeroInternational, PAYS } from "@/lib/telephone";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";
import { ArrowLeft, ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Etape = "nom" | "email" | "telephone";

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
 * Les champs sont ceux de la fenêtre qu'il remplace, relevés sur la
 * référence ClickFunnels : 53 px, angles de 5 px, une ombre intérieure. Le
 * téléphone reprend la règle d'`/appel` (`lib/telephone.ts`) : le pays au
 * drapeau, puis le numéro comme on l'écrit chez soi.
 *
 * Prénom, nom, e-mail et numéro sont aussi gardés dans le navigateur, sous
 * la clé du tunnel VSL (sept jours, jamais dans l'adresse) : la réservation
 * de `/formation-genesis/appel` s'en préremplit.
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
  const [erreur, setErreur] = useState<string | null>(null);
  const premierChamp = useRef<HTMLInputElement>(null);
  const aChange = useRef(false);

  useEffect(() => {
    if (aChange.current) premierChamp.current?.focus();
  }, [etape]);

  const aller = (suivante: Etape) => {
    aChange.current = true;
    setErreur(null);
    setEtape(suivante);
  };

  /** L'inscription en cours ou faite, lancée à la validation de l'e-mail.
   *  Le signal « lead » ne part qu'une fois le contact créé. */
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

  const valider = async (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (envoi) return;
    setErreur(null);

    if (etape === "nom") {
      aller("email");
      return;
    }

    if (etape === "email") {
      /* **Instantané**, sur demande de Rémy : l'inscription part en
         arrière-plan et l'étape du téléphone s'affiche tout de suite. Le
         temps de taper un numéro, ClickFunnels a répondu. */
      inscription.current = inscrire();
      ranger();
      aller("telephone");
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
    ranger(numero);
    window.location.assign(
      `${RACINE_GENESIS}/espace/${partiesGenesis[0]?.cle ?? "1"}`,
    );
  };

  const { question, bouton } = formulaire.etapes[etape];
  const precedente: Etape | null =
    etape === "telephone" ? "email" : etape === "email" ? "nom" : null;
  const choisi = PAYS.find((p) => p.code === pays) ?? PAYS[0];

  return (
    <div className="rounded-[5px] bg-[var(--genesis-fond)] p-4 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-6">
      <form
        onSubmit={valider}
        aria-describedby={erreur ? "erreur-genesis" : undefined}
      >
        <fieldset className="flex flex-col gap-[15px]" disabled={envoi}>
          {/* La question est la légende du groupe : un lecteur d'écran la
              lit avec le champ, et elle n'entre pas dans le plan des
              titres. */}
          <legend className="mb-[15px] text-2xl leading-snug font-bold text-pretty">
            {question}
          </legend>

          {etape === "nom" ? (
            <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <ChampFlottant
                ref={premierChamp}
                id="genesis-prenom"
                libelle={formulaire.prenom}
                name="prenom"
                autoComplete="given-name"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              <ChampFlottant
                id="genesis-nom"
                libelle={formulaire.nom}
                name="nom"
                autoComplete="family-name"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
          ) : null}

          {etape === "email" ? (
            <>
              <ChampFlottant
                ref={premierChamp}
                id="genesis-email"
                libelle={formulaire.email}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-[#60606b]">
                <input
                  type="checkbox"
                  required
                  checked={consenti}
                  onChange={(e) => setConsenti(e.target.checked)}
                  className="mt-1 size-4 shrink-0 cursor-pointer accent-[var(--genesis-bleu)]"
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
            /* Un seul cadre autour du pays et du numéro, qui s'éclaire en
               entier au focus. Le menu est un `select` natif posé sur le
               drapeau : sur téléphone, c'est la roue du système qui
               s'ouvre. */
            <div
              className={cn(
                CADRE,
                "flex overflow-hidden focus-within:border-[var(--genesis-bleu)] focus-within:ring-[3px] focus-within:ring-[var(--genesis-bleu)]/20",
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
              {/* Le numéro a son libellé flottant comme les autres champs ;
                  l'exemple du pays n'apparaît qu'au focus, une fois le
                  libellé remonté, pour ne pas s'écrire par-dessus. */}
              <div className="relative min-w-0 flex-1">
                <input
                  ref={premierChamp}
                  id="genesis-telephone"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  required
                  placeholder={choisi.exemple}
                  aria-invalid={erreur === formulaire.erreurs.telephone}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="peer size-full bg-transparent px-4 pt-5 pb-1 text-[17px] text-[var(--genesis-encre)] outline-none placeholder:text-transparent focus:placeholder:text-[#8a8a93]"
                />
                <label htmlFor="genesis-telephone" className={LIBELLE}>
                  {formulaire.telephone}
                </label>
              </div>
            </div>
          ) : null}

          {erreur ? (
            <p
              id="erreur-genesis"
              role="alert"
              className="text-sm font-bold text-destructive"
            >
              {erreur}
            </p>
          ) : null}

          <BoutonGenesis soumettre disabled={envoi}>
            {envoi ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle aria-hidden className="size-5 animate-spin" />
                {formulaire.envoi}
              </span>
            ) : (
              bouton
            )}
          </BoutonGenesis>

          {precedente ? (
            <button
              type="button"
              onClick={() => aller(precedente)}
              className="inline-flex min-h-10 items-center gap-1.5 self-start text-sm text-[#60606b] underline-offset-4 hover:text-[var(--genesis-encre)] hover:underline"
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

/*
 * Les champs, refaits sur demande de Rémy, qui n'aimait pas ceux relevés sur
 * la référence (ombre intérieure, libellé en texte d'exemple). Ils partent de
 * l'`Input` de shadcn, déjà dans `packages/ui`.
 *
 * - **Un vrai cadre** : 56 px, angles de 5 px, fond blanc, bordure à 45 %
 *   de noir. C'est le seuil : une bordure de contrôle doit tenir 3:1 sur son
 *   fond, et le gris clair habituel (15 %) n'en tient que 1,4.
 * - **Le focus en bleu du tunnel**, bordure pleine (3,35:1) et halo à 20 %.
 * - **Un libellé qui reste** : au repos il occupe le champ, à la saisie il
 *   remonte en petit dans le haut du cadre. Un texte d'exemple disparaissait
 *   à la première lettre et ne nommait rien aux lecteurs d'écran ; celui-ci
 *   est un `label` relié au champ. Le mécanisme est en CSS seul, par
 *   `:placeholder-shown` sur un texte d'exemple fait d'une espace.
 * - **17 px de corps** : en dessous de 16, l'iPhone zoome sur le champ.
 *
 * Les couleurs sont écrites en dur, comme le reste du tunnel : il est forcé
 * au clair, et ses jetons n'ont pas de valeur sombre.
 */
const CADRE =
  "h-14 rounded-[5px] border border-black/45 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] hover:border-black/60";

const LIBELLE =
  "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-[family-name:var(--font-genesis-bouton)] text-[17px] text-[#60606b] transition-[top,translate,font-size] peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs";

function ChampFlottant({
  id,
  libelle,
  className,
  ...props
}: React.ComponentProps<"input"> & { id: string; libelle: string }) {
  return (
    <div className="relative">
      <Input
        id={id}
        placeholder=" "
        className={cn(
          CADRE,
          "peer w-full px-4 pt-5 pb-1 text-[17px] text-[var(--genesis-encre)] focus-visible:border-[var(--genesis-bleu)] focus-visible:ring-[3px] focus-visible:ring-[var(--genesis-bleu)]/20 md:text-[17px] dark:bg-white",
          className,
        )}
        {...props}
      />
      <label htmlFor={id} className={LIBELLE}>
        {libelle}
      </label>
    </div>
  );
}
