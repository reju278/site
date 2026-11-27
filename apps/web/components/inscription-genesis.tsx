"use client";

import {
  completerGenesis,
  inscrireGenesis,
  situerGenesis,
} from "@/app/formation-genesis/actions";
import { BoutonGenesis } from "@/components/bouton-genesis";
import {
  ChampGenesis as Champ,
  ChampTelephoneGenesis,
} from "@/components/champ-genesis";
import {
  PiegeRobots,
  SuggestionEmail,
  useControleEmail,
  useRelance,
} from "@/components/controle-email";
import { ID_FORMULAIRE_GENESIS } from "@/components/maquette-lecteur-genesis";
import {
  CLE_BIENVENUE_GENESIS,
  optinGenesis,
  partiesGenesis,
  RACINE_GENESIS,
} from "@/contenu/formation-genesis";
import { API_FUNNELS, CLE_CONTACT_VSL, legalesVsl } from "@/contenu/vsl";
import type { Resultat } from "@/lib/clickfunnels";
import { numeroInternational, PAYS } from "@/lib/telephone";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

type Etape = "nom" | "email" | "telephone" | "situation" | "ca";

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
 *    (`completerGenesis`) ;
 * 4. **les questions de Direct Webinar (N)**, sur demande de Rémy le 27
 *    novembre 2026 : « Dernière étape, qu'est-ce qui vous décrit le mieux,
 *    {prénom} ? », deux réponses qu'on touche, sans bouton ; et pour qui a
 *    déjà une activité, « À quel niveau de chiffre d'affaires êtes-vous
 *    actuellement ? », quatre réponses. La réponse part au CRM (colonne
 *    « Situation ») et à ClickFunnels (`situerGenesis`, après la réponse),
 *    puis on entre dans l'espace membre. La situation de qui a une activité
 *    part au CRM dès le choix, pour qui s'arrêterait là. Pas d'écran de
 *    chargement comme sur N : il y préchargeait la vidéo de la page
 *    suivante, et l'espace s'ouvre aussitôt.
 *
 * Inscrire à la deuxième étape et non à la fin, c'est garder le contact de
 * qui s'arrête devant le téléphone : il reçoit quand même la formation par
 * e-mail. **L'espace, lui, ne s'ouvre qu'après la dernière.**
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
  /** La réponse de la situation, gardée pour la question qui suit. */
  const [situation, setSituation] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  /** Vrai après un essai de l'étape en cours : les champs vides passent au
   *  rouge. Remis à zéro à chaque changement d'étape. */
  const [tente, setTente] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const premierChamp = useRef<HTMLInputElement>(null);
  /** La première réponse d'une question à choix, qui prend le curseur. */
  const premierBouton = useRef<HTMLButtonElement>(null);
  const aChange = useRef(false);
  const formulaireRef = useRef<HTMLFormElement>(null);
  /** Le filtre des faux e-mails (`controle-email.tsx`), et l'envoi relancé
   *  après une correction acceptée ou refusée. */
  const controle = useControleEmail("formation-genesis", formulaire.erreurs);
  const relancer = useRelance(formulaireRef);
  /** Un robot pris au piège : le formulaire avance, plus rien ne part. */
  const robot = useRef(false);
  const erreursEmail: (string | null)[] = [
    formulaire.erreurs.email,
    formulaire.erreurs.jetable,
    formulaire.erreurs.exemple,
    formulaire.erreurs.essai,
    formulaire.erreurs.domaine,
  ];

  useEffect(() => {
    if (!aChange.current) return;
    if (etape === "situation" || etape === "ca") premierBouton.current?.focus();
    else premierChamp.current?.focus();
  }, [etape]);

  const aller = (suivante: Etape) => {
    aChange.current = true;
    setErreur(null);
    setTente(false);
    setEtape(suivante);
  };

  /** L'inscription en cours ou faite, lancée à la validation de l'e-mail.
   *  Le signal « lead » ne part qu'une fois, le contact créé. */
  const inscription = useRef<Promise<Resultat> | null>(null);
  const leadEnvoye = useRef(false);
  const inscrire = (): Promise<Resultat> =>
    robot.current
      ? Promise.resolve({ ok: true })
      : inscrireGenesis(prenom, nom, email)
      .catch((): Resultat => ({ ok: false, raison: "reseau" }))
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
   * l'opt-in à l'e-mail, le téléphone, puis la situation. **En tâche de
   * fond et sans jamais retenir personne** : un CRM injoignable ne bloque
   * pas l'inscription, qui part chez ClickFunnels par ailleurs. `keepalive`
   * laisse le dernier envoi finir pendant que la page change.
   */
  const signaler = (
    etapeCrm: "email" | "telephone" | "situation",
    ajouts: { telephone?: string; situation?: string; ca?: string } = {},
  ) => {
    if (robot.current) return;
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
        ...ajouts,
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
      const adresse = email.trim();
      if (!EMAIL.test(adresse)) {
        // `jean@gmail` : la correction se propose avant l'erreur.
        const examen = controle.examiner(adresse);
        if (examen.suite !== "arreter" || examen.erreur) {
          setErreur(formulaire.erreurs.email);
        }
        return;
      }
      /* **Le filtre des faux e-mails**, avant toute inscription : instantané
         pour un grand fournisseur, une seconde et demie au plus pour un
         autre domaine (`controle-email.tsx`). Un robot pris au piège passe
         sans rien envoyer. */
      robot.current = controle.estRobot(adresse);
      if (!robot.current) {
        const examen = controle.examiner(adresse);
        if (examen.suite === "arreter") {
          if (examen.erreur) setErreur(examen.erreur);
          return;
        }
        if (examen.suite === "verifier") {
          setEnvoi(true);
          const refus = await controle.verifier(adresse);
          setEnvoi(false);
          if (refus) {
            setErreur(refus);
            return;
          }
        }
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

    // Les questions à choix n'ont rien à envoyer : on touche une réponse.
    if (etape !== "telephone") return;

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
    // Une adresse refusée par le filtre du serveur ne passera pas mieux.
    if (!inscrit.ok && inscrit.raison !== "email") inscrit = await inscrire();
    if (!inscrit.ok && inscrit.raison === "email") {
      setEnvoi(false);
      aller("email");
      setErreur(formulaire.erreurs.domaine);
      return;
    }
    const resultat: Resultat = robot.current
      ? { ok: true }
      : inscrit.ok
        ? await completerGenesis(email, numero).catch(
            (): Resultat => ({ ok: false, raison: "reseau" }),
          )
        : inscrit;
    setEnvoi(false);
    if (!resultat.ok) {
      setErreur(formulaire.erreurs.envoi);
      return;
    }
    signaler("telephone", { telephone: numero });
    ranger(numero);
    aller("situation");
  };

  /**
   * La situation : une réponse qu'on touche. Qui a déjà une activité dit
   * encore son chiffre d'affaires ; sa situation part au CRM sans attendre,
   * pour qui s'arrêterait là. Les autres entrent dans l'espace.
   */
  const choisir = (valeur: string) => {
    if (envoi) return;
    setSituation(valeur);
    if (valeur === "activite") {
      signaler("situation", { situation: valeur });
      aller("ca");
      return;
    }
    terminer(valeur);
  };

  /** La réponse part au CRM et à ClickFunnels, puis l'espace s'ouvre. Le
   *  contact existe déjà (posé à l'e-mail, complété au téléphone) : rien
   *  n'est attendu. */
  const terminer = (valeur: string, ca?: string) => {
    if (envoi) return;
    setEnvoi(true);
    signaler("situation", { situation: valeur, ...(ca ? { ca } : {}) });
    if (!robot.current) void situerGenesis(email, valeur, ca).catch(() => {});
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

  const { bouton } = formulaire.etapes[etape];
  const question = formulaire.etapes[etape].question.replace(
    "{prenom}",
    prenom.trim(),
  );
  const precedente: Etape | null =
    etape === "ca"
      ? "situation"
      : etape === "situation"
        ? "telephone"
        : etape === "telephone"
          ? "email"
          : etape === "email"
            ? "nom"
            : null;
  /** Le dessin d'une réponse à toucher, celui de Direct Webinar (N) : le
   *  cadre des champs, angles droits, le surligné bleu pâle au survol. */
  const classeReponse =
    "flex w-full cursor-pointer items-center gap-3 rounded-none border border-black/45 bg-white px-4 py-3 text-left text-[17px] leading-snug text-pretty text-[var(--genesis-encre)] transition-[border-color,box-shadow,background-color] hover:border-[var(--genesis-encre)] hover:bg-[var(--genesis-surligne)] focus-visible:border-[var(--genesis-encre)] focus-visible:shadow-[0_0_0_1px_var(--genesis-encre)] focus-visible:outline-none";
  const telephoneFaux =
    (tente && manque.telephone) || erreur === formulaire.erreurs.telephone;

  return (
    <div
      id={ID_FORMULAIRE_GENESIS}
      className="scroll-mt-6 bg-white p-5 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-7"
    >
      <form
        ref={formulaireRef}
        noValidate
        onSubmit={valider}
        aria-describedby={erreur ? "erreur-genesis" : undefined}
      >
        {/* Le champ que seuls les robots remplissent (`PiegeRobots`). */}
        <PiegeRobots
          valeur={controle.piege.valeur}
          changer={controle.piege.changer}
        />
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
                  (tente && manque.email) || erreursEmail.includes(erreur)
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* La faute de frappe d'un grand fournisseur, proposée et non
                  imposée : on corrige ou l'on garde, et l'envoi repart. */}
              {controle.correctionPour(email) ? (
                <SuggestionEmail
                  adresse={controle.correctionPour(email)!}
                  textes={formulaire.suggestion}
                  onAccepter={() => {
                    setEmail(controle.correctionPour(email)!);
                    relancer();
                  }}
                  onGarder={() => {
                    controle.garder(email.trim());
                    relancer();
                  }}
                />
              ) : null}
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
            <ChampTelephoneGenesis
              ref={premierChamp}
              id="genesis-telephone"
              libelle={formulaire.telephone}
              libellePays={formulaire.pays}
              pays={pays}
              onPays={setPays}
              valeur={telephone}
              onValeur={setTelephone}
              faux={telephoneFaux}
            />
          ) : null}

          {etape === "situation" ? (
            // Deux grandes réponses, au dessin des champs : on touche celle
            // qui nous décrit, et c'est parti, sans bouton à valider.
            <div role="group" className="flex flex-col gap-3">
              {formulaire.situations.map((reponse, rang) => (
                <button
                  key={reponse.valeur}
                  ref={rang === 0 ? premierBouton : undefined}
                  type="button"
                  onClick={() => choisir(reponse.valeur)}
                  className={`${classeReponse} min-h-[64px]`}
                >
                  <span className="min-w-0 flex-1">
                    {reponse.texte.map((morceau, i) =>
                      typeof morceau === "string" ? (
                        <Fragment key={i}>{morceau}</Fragment>
                      ) : "gras" in morceau ? (
                        <strong key={i}>{morceau.gras}</strong>
                      ) : (
                        <u key={i}>{morceau.souligne}</u>
                      ),
                    )}
                  </span>
                  <ArrowRight aria-hidden className="size-5 shrink-0" />
                </button>
              ))}
            </div>
          ) : null}

          {etape === "ca" ? (
            // Le chiffre d'affaires : quatre réponses, au même dessin. On
            // touche, et l'espace s'ouvre.
            <div role="group" className="flex flex-col gap-3">
              {formulaire.chiffresAffaires.map((reponse, rang) => (
                <button
                  key={reponse.valeur}
                  ref={rang === 0 ? premierBouton : undefined}
                  type="button"
                  onClick={() =>
                    situation && terminer(situation, reponse.valeur)
                  }
                  className={`${classeReponse} min-h-[56px]`}
                >
                  <span className="min-w-0 flex-1">{reponse.libelle}</span>
                  <ArrowRight aria-hidden className="size-5 shrink-0" />
                </button>
              ))}
            </div>
          ) : null}

          {/* Pendant l'ouverture de l'espace, après un choix. */}
          {envoi && (etape === "situation" || etape === "ca") ? (
            <p
              role="status"
              className="inline-flex items-center justify-center gap-2 text-sm text-[#60606b]"
            >
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              {formulaire.envoi}
            </p>
          ) : null}

          {etape === "situation" || etape === "ca" ? null : (
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
          )}

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
