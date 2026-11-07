"use client";

import {
  lireCreneaux,
  reserverAppel,
  type DemandeReservation,
} from "@/app/appel/actions";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { ChoixJour, cleDuJour, dateDuJour } from "@/components/choix-jour";
import { TexteRoulant } from "@/components/texte-roulant";
import { reservationYt } from "@/contenu/appel";
import { lireContactVsl } from "@/lib/prenom-vsl";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Globe,
  LoaderCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * La réservation de l'appel, chez nous (issue #7) : nos créneaux, un jour
 * puis une heure, puis les informations et les questions de Calendly. Le
 * rendez-vous part à Calendly par l'API, côté serveur (`app/appel/actions`).
 *
 * L'écran reprend celui du formulaire de réservation du CRM Funnels-Club
 * (`formulaire-public.tsx`), sur demande de Rémy : les jours en liste,
 * « Demain (mercredi 4 novembre) », puis les heures en grille. Le bloc qui le
 * porte est `BlocReservation`.
 *
 * **Le prénom et l'e-mail sont repris de l'inscription de `/course`**, lus
 * dans le `localStorage` comme le font les titres du tunnel, et restent
 * modifiables : quelqu'un qui arrive par un lien direct les remplit.
 *
 * **Pas de formulaire Calendly en repli**, sur décision de Rémy : tout passe
 * par l'API. Si les créneaux ne se lisent pas (jeton absent, Calendly qui ne
 * répond pas), la page le dit et propose de réessayer.
 */
export function ReservationAppel({
  niveauTitre: TitreFormulaire = "h1",
}: {
  /** `h2` quand la page porte déjà son propre `h1`. */
  niveauTitre?: "h1" | "h2";
}) {
  // `undefined` : en lecture ; `null` : indisponible.
  const racine = useRef<HTMLDivElement>(null);
  const [creneaux, setCreneaux] = useState<string[] | null | undefined>();
  const [jour, setJour] = useState<string | undefined>();
  const [heure, setHeure] = useState<string | undefined>();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pays, setPays] = useState<string>(PAYS[0].code);
  const [reponses, setReponses] = useState<Record<string, string[]>>({});
  const [autres, setAutres] = useState<Record<string, string>>({});
  /* La case de « Autre », cochée avant même qu'on ait écrit. Du texte la coche
     d'office : voir `autreCoche`. */
  const [autresCoches, setAutresCoches] = useState<Record<string, boolean>>({});
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | undefined>();
  /* Deux étapes, sur demande de Rémy : le jour et l'heure, puis
     « Suivant » et les informations. */
  const [etape, setEtape] = useState<"creneau" | "infos">("creneau");
  /* Les champs en défaut à la dernière tentative, et leur message : chacun
     est encadré en rouge, son message dessous. Un champ corrigé en sort. */
  const [fautifs, setFautifs] = useState<Record<string, string>>({});
  const corrige = (id: string) =>
    setFautifs((avant) => {
      if (!(id in avant)) return avant;
      const suite = { ...avant };
      delete suite[id];
      return suite;
    });

  const lire = useCallback(async (discret = false) => {
    if (!discret) setCreneaux(undefined);
    try {
      const libres = await lireCreneaux();
      if (libres || !discret) setCreneaux(libres);
    } catch {
      if (!discret) setCreneaux(null);
    }
  }, []);

  useEffect(() => {
    void lire();
    const contact = lireContactVsl();
    if (typeof contact?.prenom === "string") setPrenom(contact.prenom.trim());
    if (typeof contact?.email === "string") setEmail(contact.email.trim());
  }, [lire]);

  // Les créneaux bougent : relus chaque minute tant que l'écran est ouvert,
  // et au retour sur l'onglet.
  useEffect(() => {
    const relire = () => {
      if (document.visibilityState === "visible") void lire(true);
    };
    const minuterie = setInterval(relire, 60_000);
    document.addEventListener("visibilitychange", relire);
    return () => {
      clearInterval(minuterie);
      document.removeEventListener("visibilitychange", relire);
    };
  }, [lire]);

  const parJour = useMemo(() => {
    const groupes = new Map<string, string[]>();
    for (const creneau of creneaux ?? []) {
      const cle = cleDuJour(new Date(creneau));
      groupes.set(cle, [...(groupes.get(cle) ?? []), creneau]);
    }
    return groupes;
  }, [creneaux]);

  // Un créneau choisi qui n'est plus libre à la relecture : on le retire, et
  // on le dit, plutôt que de laisser réserver une heure prise.
  useEffect(() => {
    if (!heure || !creneaux || creneaux.includes(heure)) return;
    setHeure(undefined);
    setEtape("creneau");
    setErreur("Ce créneau vient d'être pris. Choisis-en un autre.");
  }, [creneaux, heure]);

  if (creneaux === null)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
        {/* Libellés d'interface de l'agent, provisoires : à valider. */}
        <p className="text-pretty text-muted-foreground">
          Les créneaux ne se chargent pas pour le moment.
        </p>
        <button
          type="button"
          onClick={() => void lire()}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground"
        >
          Réessayer
        </button>
      </div>
    );
  if (creneaux === undefined)
    return (
      <div className="flex justify-center py-24">
        <LoaderCircle
          aria-label="Chargement des créneaux"
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    );

  const jourActif = jour && parJour.has(jour) ? jour : [...parJour.keys()][0];
  const heures = jourActif ? (parJour.get(jourActif) ?? []) : [];

  const basculer = (cle: string, choix: string, multiple: boolean) => {
    setErreur(undefined);
    /* Un seul choix possible : en cocher un efface le champ « Autre ». */
    if (!multiple) {
      setAutres((avant) => ({ ...avant, [cle]: "" }));
      setAutresCoches((avant) => ({ ...avant, [cle]: false }));
    }
    setReponses((avant) => {
      const actuels = avant[cle] ?? [];
      if (!multiple) return { ...avant, [cle]: [choix] };
      return {
        ...avant,
        [cle]: actuels.includes(choix)
          ? actuels.filter((c) => c !== choix)
          : [...actuels, choix],
      };
    });
  };

  const autreCoche = (cle: string) =>
    Boolean(autresCoches[cle] || autres[cle]?.trim());

  const basculerAutre = (cle: string, multiple: boolean) => {
    setErreur(undefined);
    if (autreCoche(cle)) {
      setAutres((avant) => ({ ...avant, [cle]: "" }));
      setAutresCoches((avant) => ({ ...avant, [cle]: false }));
      return;
    }
    setAutresCoches((avant) => ({ ...avant, [cle]: true }));
    if (!multiple) setReponses((avant) => ({ ...avant, [cle]: [] }));
    document.getElementById(`${cle}-autre`)?.focus();
  };

  const confirmer = async () => {
    if (envoi) return;
    if (!heure) return setErreur("Choisis une heure.");
    /* **Toutes les erreurs d'un coup**, sur demande de Rémy : chaque champ
       en défaut est encadré en rouge avec son message, et la page descend
       au premier, le plus haut, le curseur dedans, prêt à écrire. Dans
       l'ordre de la page, puisque c'est le premier trouvé qui reçoit le
       curseur. */
    const defauts: Record<string, string> = {};
    if (!prenom.trim()) defauts["prenom-appel"] = "Indique ton prénom.";
    if (!nom.trim()) defauts["nom-appel"] = "Indique ton nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      defauts["email-appel"] = "Indique une adresse e-mail complète.";
    const numero = numeroInternational(pays, telephone);
    if (!numero)
      defauts["telephone-appel"] = "Indique ton numéro de téléphone complet.";
    const final: Record<string, string> = {};
    for (const question of reservationYt.questions) {
      if (question.type === "texte") {
        final[question.cle] = (reponses[question.cle]?.[0] ?? "").trim();
      } else {
        const choisis = [
          ...(reponses[question.cle] ?? []),
          (autres[question.cle] ?? "").trim(),
        ];
        final[question.cle] = choisis.filter(Boolean).join("\n");
      }
      if (!final[question.cle] && question.obligatoire)
        defauts[`question-${question.cle}`] =
          question.type === "texte"
            ? "Réponds à cette question."
            : "Choisis une réponse.";
    }
    const premier = Object.keys(defauts)[0];
    if (premier || !numero) {
      setFautifs(defauts);
      setErreur(undefined);
      requestAnimationFrame(() => {
        const bloc = document.getElementById(premier ?? "telephone-appel");
        const cible = bloc?.matches("input, textarea, button")
          ? bloc
          : bloc?.querySelector<HTMLElement>("textarea, input, button");
        bloc?.scrollIntoView({ block: "center", behavior: "smooth" });
        cible?.focus({ preventScroll: true });
      });
      return;
    }
    setFautifs({});

    setEnvoi(true);
    setErreur(undefined);
    const adresse = new URLSearchParams(window.location.search);

    /* Le « NON » réserve comme les autres réponses, sur décision de Rémy :
       plus de détour par `/prochaine-etape`. */
    const demande: DemandeReservation = {
      prenom,
      nom,
      email,
      telephone: numero,
      debut: heure,
      fuseau: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reponses: final,
      utm: Object.fromEntries(
        [...adresse.entries()].filter(([cle]) => cle.startsWith("utm_")),
      ),
    };
    try {
      const resultat = await reserverAppel(demande);
      if (!resultat.ok) {
        setEnvoi(false);
        setErreur(resultat.erreur);
        if (resultat.pris) {
          setHeure(undefined);
          setEtape("creneau");
          void lire(true);
        }
        return;
      }
      /* Comme Calendly sur sa page : droit à la confirmation, sous les noms
         de paramètres qu'il transmet. `/thanks` les relève puis les retire
         de l'adresse avant GTM (`reservation-capture.ts`). */
      const suite = new URL("/thanks", window.location.origin);
      suite.searchParams.set("invitee_first_name", prenom.trim());
      suite.searchParams.set("invitee_last_name", nom.trim());
      suite.searchParams.set("invitee_email", email.trim());
      suite.searchParams.set("event_start_time", heure);
      if (resultat.fin) suite.searchParams.set("event_end_time", resultat.fin);
      if (resultat.hote) suite.searchParams.set("assigned_to", resultat.hote);
      suite.searchParams.set("answer_1", numero);
      /* Les réponses, sous les noms que Calendly emploie, `answer_N` selon
         la position de la question : `/thanks` les montre dans son volet
         « Détail de l'événement » (voir `questionsReservation`). */
      for (const question of reservationYt.questions)
        if (final[question.cle])
          suite.searchParams.set(
            `answer_${question.position + 1}`,
            final[question.cle]!,
          );
      for (const [cle, valeur] of adresse.entries())
        if (cle.startsWith("utm_")) suite.searchParams.set(cle, valeur);
      window.location.assign(suite.toString());
    } catch {
      setEnvoi(false);
      setErreur("La réservation n'a pas abouti. Réessaie dans un instant.");
    }
  };

  return (
    <div
      ref={racine}
      className="mx-auto flex w-full max-w-xl scroll-mt-16 flex-col gap-8"
    >
      {/* L'en-tête : photo, marque, titre, durée. Pas de description. */}
      <header className="flex flex-col items-center gap-2 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/remy.webp"
          alt=""
          width={160}
          height={160}
          fetchPriority="high"
          className="size-20 rounded-full object-cover ring-1 ring-border"
        />
        <p className="text-sm font-semibold text-muted-foreground">
          {reservationYt.marque}
        </p>
        <TitreFormulaire className="titre text-3xl text-balance text-foreground sm:text-4xl">
          {reservationYt.titre}
        </TitreFormulaire>
        <p className="flex items-center gap-1.5 text-base font-semibold text-muted-foreground">
          <Clock aria-hidden className="size-4" />
          {reservationYt.duree}
        </p>
      </header>

      {/* Étape 1 : le jour, puis l'heure, puis « Suivant ». */}
      {etape === "creneau" ? (
      <section className="flex flex-col gap-4">
        {jourActif ? (
          <ChoixJour
            jours={[...parJour.keys()]}
            actif={jourActif}
            libelle={reservationYt.choisirJour}
            choisir={(cle) => {
              setJour(cle);
              setHeure(undefined);
              setErreur(undefined);
            }}
          />
        ) : null}

        {jourActif ? (
          <>
            <h2 className="pt-2 text-center text-lg font-bold text-balance text-foreground">
              {reservationYt.choisirHeure(jourLisible(jourActif))}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {heures.map((creneau) => (
                <button
                  key={creneau}
                  type="button"
                  aria-pressed={heure === creneau}
                  onClick={() => {
                    setHeure(creneau);
                    setErreur(undefined);
                  }}
                  className={cn(
                    "min-h-11 rounded-md border text-base tabular-nums transition-colors",
                    heure === creneau
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/15 bg-card hover:border-primary",
                  )}
                >
                  {heureLisible(creneau)}
                </button>
              ))}
            </div>
            {/* Le fuseau sous les heures et avant « Suivant », sur demande de
                Rémy. */}
            <p className="text-center text-xs text-balance text-muted-foreground">
              <Globe
                aria-hidden
                className="mr-1.5 inline-block size-3.5 align-[-0.15em]"
              />
              {reservationYt.fuseau}{"\u00a0:"} {fuseauLisible()}.
            </p>
          </>
        ) : null}
        {erreur ? (
          <p role="alert" className="text-sm text-destructive">
            {erreur}
          </p>
        ) : null}
        <BoutonScintillant
          action={() => {
            if (!heure) return setErreur("Choisis une heure.");
            setErreur(undefined);
            setEtape("infos");
            /* Le haut du formulaire et non celui de la page : sur
               `/appel-relance-newsletter`, une vidéo le précède. Sur `/appel`,
               il est en tête de page et la marge ramène au premier pixel. */
            racine.current?.scrollIntoView({ block: "start" });
          }}
          className="mt-2 min-h-16 w-full gap-3 text-xl font-bold sm:text-2xl"
        >
          <TexteRoulant>{reservationYt.suivant}</TexteRoulant>
          <ArrowRight aria-hidden className="size-6 shrink-0" strokeWidth={2.5} />
        </BoutonScintillant>
      </section>
      ) : null}

      {/* Étape 2 : le créneau choisi, puis les informations et les
          questions. « Modifier » ramène au choix du créneau. */}
      {etape === "infos" && heure ? (
        /* **Un vrai formulaire, et des champs nommés**, sur demande de Rémy :
           c'est ce qui fait proposer à l'iPhone et à Android le prénom, le
           nom, l'e-mail et le numéro enregistrés sur le téléphone. Safari ne
           propose guère son remplissage à des champs isolés. `autocomplete`
           dit ce qu'attend chaque champ ; le pays est un code ISO, ce que
           `autocomplete="country"` sait remplir. L'envoi reste celui du
           bouton : Entrée passe par `onSubmit`. */
        <form
          noValidate
          onSubmit={(evenement) => {
            evenement.preventDefault();
            void confirmer();
          }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border border-primary bg-primary/10 px-4 py-3">
            <span className="text-base font-semibold text-foreground">
              {quandLisible(heure)}
            </span>
            <button
              type="button"
              onClick={() => {
                setEtape("creneau");
                setErreur(undefined);
              }}
              className="text-sm font-semibold text-primary underline underline-offset-4"
            >
              {reservationYt.modifier}
            </button>
          </div>
          {/* Le prénom, déjà rempli, et le nom à côté, sur une ligne, sur
              demande de Rémy. */}
          <div className="grid grid-cols-2 gap-3">
            <Champ
              libelle={reservationYt.prenom}
              id="prenom-appel"
              erreur={fautifs["prenom-appel"]}
            >
              <Input
                id="prenom-appel"
                name="given-name"
                autoComplete="given-name"
                autoCapitalize="words"
                aria-required
                value={prenom}
                aria-invalid={"prenom-appel" in fautifs}
                onChange={(e) => {
                  setPrenom(e.target.value);
                  corrige("prenom-appel");
                }}
                className={CHAMP}
              />
            </Champ>
            <Champ
              libelle={reservationYt.nom}
              id="nom-appel"
              erreur={fautifs["nom-appel"]}
            >
              <Input
                id="nom-appel"
                name="family-name"
                autoComplete="family-name"
                autoCapitalize="words"
                aria-required
                value={nom}
                aria-invalid={"nom-appel" in fautifs}
                onChange={(e) => {
                  setNom(e.target.value);
                  corrige("nom-appel");
                }}
                className={CHAMP}
              />
            </Champ>
          </div>
          <Champ
            libelle={reservationYt.email}
            id="email-appel"
            erreur={fautifs["email-appel"]}
          >
            <Input
              id="email-appel"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-required
              value={email}
              aria-invalid={"email-appel" in fautifs}
              onChange={(e) => {
                setEmail(e.target.value);
                corrige("email-appel");
              }}
              className={CHAMP}
            />
          </Champ>
          <Champ
            libelle={reservationYt.telephone}
            id="telephone-appel"
            erreur={fautifs["telephone-appel"]}
          >
            {/* Le pays au drapeau, puis le numéro comme on l'écrit chez soi,
                0 compris, sur demande de Rémy : l'indicatif vient du pays.
                Un seul cadre autour des deux, qui s'éclaire en entier au
                focus. Le menu est un `select` natif : sur téléphone, c'est la
                roue du système qui s'ouvre. */}
            <div
              className={cn(
                "flex h-11 overflow-hidden rounded-md border border-foreground/20 bg-card shadow-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:border-foreground/25",
                "telephone-appel" in fautifs &&
                  "border-destructive ring-[3px] ring-destructive/20 dark:border-destructive",
              )}
            >
              <div className="relative flex shrink-0 items-center gap-1.5 border-r border-foreground/15 px-3">
                <span aria-hidden className="text-xl leading-none">
                  {PAYS.find((p) => p.code === pays)?.drapeau}
                </span>
                <span aria-hidden className="text-base text-foreground/80 tabular-nums">
                  {PAYS.find((p) => p.code === pays)?.indicatif}
                </span>
                <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
                <select
                  name="country"
                  autoComplete="country"
                  aria-label={reservationYt.pays}
                  value={pays}
                  onChange={(e) => {
                    setPays(e.target.value);
                    corrige("telephone-appel");
                  }}
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
                id="telephone-appel"
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                aria-required
                placeholder={PAYS.find((p) => p.code === pays)?.exemple}
                value={telephone}
                aria-invalid={"telephone-appel" in fautifs}
                onChange={(e) => {
                  setTelephone(e.target.value);
                  corrige("telephone-appel");
                }}
                className="min-w-0 flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-foreground/50"
              />
            </div>
          </Champ>

          {reservationYt.questions.map((question) => (
            <fieldset
              key={question.cle}
              id={`question-${question.cle}`}
              className="flex flex-col gap-3"
            >
              <legend className="mb-3 text-base font-semibold text-pretty text-foreground">
                {question.libelle}
                {question.obligatoire ? <Obligatoire /> : null}
              </legend>
              {question.type === "texte" ? (
                /* Deux lignes au départ, et la zone grandit avec la réponse là où
                   le navigateur connaît `field-sizing`. Sinon, elle défile. */
                <textarea
                  aria-label={question.libelle}
                  aria-required={question.obligatoire}
                  aria-invalid={`question-${question.cle}` in fautifs}
                  rows={2}
                  value={reponses[question.cle]?.[0] ?? ""}
                  onChange={(e) => {
                    corrige(`question-${question.cle}`);
                    setReponses((avant) => ({
                      ...avant,
                      [question.cle]: [e.target.value],
                    }));
                  }}
                  className={cn(
                    CHAMP,
                    "block h-auto min-h-16 w-full resize-none rounded-md border px-3 py-2 field-sizing-content",
                    `question-${question.cle}` in fautifs &&
                      "border-destructive ring-[3px] ring-destructive/20 dark:border-destructive",
                  )}
                />
              ) : (
                question.choix.map((choix) => {
                  const multiple = question.type === "multi";
                  const actif = (reponses[question.cle] ?? []).includes(choix);
                  return (
                    <button
                      key={choix}
                      type="button"
                      role={multiple ? "checkbox" : "radio"}
                      aria-checked={actif}
                      onClick={() => {
                        corrige(`question-${question.cle}`);
                        basculer(question.cle, choix, multiple);
                      }}
                      /* Sans cadre, comme Calendly, sur demande de Rémy : toute
                         la ligne reste cliquable, et seul le champ « Autre »
                         garde son encadré. */
                      className="flex w-full items-center gap-3 rounded-md py-1.5 text-left text-base text-foreground"
                    >
                      <CaseChoix
                        multiple={multiple}
                        actif={actif}
                        erreur={`question-${question.cle}` in fautifs}
                      />
                      {choix}
                    </button>
                  );
                })
              )}
              {/* « Autre » porte sa case, sur demande de Rémy, alignée sur celles
                  du dessus. La cocher donne la main au champ, la décocher le
                  vide, et y écrire la coche. Pour une question à un seul
                  choix, elle décoche le choix fait. */}
              {question.autre ? (
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    role={question.type === "multi" ? "checkbox" : "radio"}
                    aria-checked={autreCoche(question.cle)}
                    aria-label={reservationYt.autre}
                    onClick={() =>
                      basculerAutre(question.cle, question.type === "multi")
                    }
                    className="-ml-2.5 flex size-10 shrink-0 items-center justify-center"
                  >
                    <CaseChoix
                      multiple={question.type === "multi"}
                      actif={autreCoche(question.cle)}
                      erreur={`question-${question.cle}` in fautifs}
                    />
                  </button>
                  <Input
                    id={`${question.cle}-autre`}
                    name={`${question.cle}-autre`}
                    aria-label={`${question.libelle} : ${reservationYt.autre}`}
                    placeholder={reservationYt.autre}
                    autoComplete="off"
                    value={autres[question.cle] ?? ""}
                    onChange={(e) => {
                      const valeur = e.target.value;
                      corrige(`question-${question.cle}`);
                      setAutres((avant) => ({
                        ...avant,
                        [question.cle]: valeur,
                      }));
                      if (question.type !== "multi" && valeur.trim())
                        setReponses((avant) => ({
                          ...avant,
                          [question.cle]: [],
                        }));
                    }}
                    className={cn(
                      CHAMP,
                      "min-w-0 flex-1",
                      `question-${question.cle}` in fautifs &&
                        "border-destructive dark:border-destructive",
                    )}
                  />
                </div>
              ) : null}
              {fautifs[`question-${question.cle}`] ? (
                <p className="text-sm font-medium text-destructive">
                  {fautifs[`question-${question.cle}`]}
                </p>
              ) : null}
            </fieldset>
          ))}

          {/* Le message du bas : le compte des champs en défaut, ou l'erreur
              du serveur (créneau pris, réservation refusée). Annoncé à un
              lecteur d'écran. */}
          {Object.keys(fautifs).length || erreur ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {Object.keys(fautifs).length
                ? reservationYt.aCompleter(Object.keys(fautifs).length)
                : erreur}
            </p>
          ) : null}
          {/* « Réserver mon appel », sans la date, sur demande de
              Rémy : elle est déjà dans le bandeau du haut. */}
          <BoutonScintillant
            action={() => void confirmer()}
            className="min-h-16 w-full text-xl font-bold sm:text-2xl"
          >
            {envoi ? (
              <LoaderCircle className="size-6 animate-spin" />
            ) : (
              <TexteRoulant>{reservationYt.bouton}</TexteRoulant>
            )}
          </BoutonScintillant>
        </form>
      ) : null}
    </div>
  );
}

/**
 * La case d'un choix : vide, puis cochée d'un V. Carrée pour plusieurs choix,
 * ronde pour un seul, comme partout ailleurs.
 */
function CaseChoix({
  multiple,
  actif,
  erreur,
}: {
  multiple: boolean;
  actif: boolean;
  erreur: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center border-2 transition-colors",
        multiple ? "rounded-[5px]" : "rounded-full",
        actif
          ? "border-primary bg-primary text-primary-foreground"
          : erreur
            ? "border-destructive bg-card"
            : "border-foreground/30 bg-card",
      )}
    >
      {actif ? <Check className="size-3.5" strokeWidth={3.5} /> : null}
    </span>
  );
}

/** Un libellé au-dessus de son champ, et une aide dessous s'il en a une. */
function Champ({
  libelle,
  id,
  aide,
  erreur,
  children,
}: {
  libelle: string;
  id: string;
  aide?: string;
  /** Le message d'erreur du champ, en rouge sous lui. */
  erreur?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {libelle}
        <Obligatoire />
      </label>
      {children}
      {erreur ? (
        <p className="text-sm font-medium text-destructive">{erreur}</p>
      ) : aide ? (
        <p className="text-xs text-muted-foreground">{aide}</p>
      ) : null}
    </div>
  );
}

/**
 * L'astérisque des réponses obligatoires, sur demande de Rémy : celles que
 * Calendly marque « requis ». Décoratif pour un lecteur d'écran : les champs
 * portent déjà `aria-required`.
 */
function Obligatoire() {
  return (
    <span aria-hidden className="ml-0.5 text-destructive">
      *
    </span>
  );
}

/* Les champs de la fenêtre d'inscription de `/course` : fond de carte,
   contour marqué, texte de 16 px qui empêche l'iPhone de zoomer. Doublés en
   `dark:` : la variante du registre pose `dark:bg-input/30`, que `cn()` ne
   voit pas comme un conflit. */
const CHAMP =
  "h-11 border-foreground/20 bg-card text-base shadow-sm placeholder:text-foreground/50 md:text-base dark:border-foreground/25 dark:bg-card";

/**
 * Les pays du menu, la France en tête : les pays francophones d'abord, les
 * départements d'outre-mer, puis les voisins. Un numéro d'un pays absent se
 * tape avec son indicatif, `+…`, qui l'emporte sur le menu.
 */
const PAYS = [
  { code: "FR", nom: "France", indicatif: "+33", drapeau: "🇫🇷", exemple: "06 12 34 56 78" },
  { code: "BE", nom: "Belgique", indicatif: "+32", drapeau: "🇧🇪", exemple: "0470 12 34 56" },
  { code: "CH", nom: "Suisse", indicatif: "+41", drapeau: "🇨🇭", exemple: "078 123 45 67" },
  { code: "LU", nom: "Luxembourg", indicatif: "+352", drapeau: "🇱🇺", exemple: "621 123 456" },
  { code: "MC", nom: "Monaco", indicatif: "+377", drapeau: "🇲🇨", exemple: "06 12 34 56 78" },
  { code: "CA", nom: "Canada", indicatif: "+1", drapeau: "🇨🇦", exemple: "514 123 4567" },
  { code: "RE", nom: "La Réunion", indicatif: "+262", drapeau: "🇷🇪", exemple: "0692 12 34 56" },
  { code: "GP", nom: "Guadeloupe", indicatif: "+590", drapeau: "🇬🇵", exemple: "0690 12 34 56" },
  { code: "MQ", nom: "Martinique", indicatif: "+596", drapeau: "🇲🇶", exemple: "0696 12 34 56" },
  { code: "GF", nom: "Guyane", indicatif: "+594", drapeau: "🇬🇫", exemple: "0694 12 34 56" },
  { code: "PF", nom: "Polynésie française", indicatif: "+689", drapeau: "🇵🇫", exemple: "87 12 34 56" },
  { code: "NC", nom: "Nouvelle-Calédonie", indicatif: "+687", drapeau: "🇳🇨", exemple: "75 12 34" },
  { code: "MU", nom: "Maurice", indicatif: "+230", drapeau: "🇲🇺", exemple: "5251 2345" },
  { code: "MA", nom: "Maroc", indicatif: "+212", drapeau: "🇲🇦", exemple: "0612 345678" },
  { code: "DZ", nom: "Algérie", indicatif: "+213", drapeau: "🇩🇿", exemple: "0551 23 45 67" },
  { code: "TN", nom: "Tunisie", indicatif: "+216", drapeau: "🇹🇳", exemple: "20 123 456" },
  { code: "SN", nom: "Sénégal", indicatif: "+221", drapeau: "🇸🇳", exemple: "70 123 45 67" },
  { code: "CI", nom: "Côte d'Ivoire", indicatif: "+225", drapeau: "🇨🇮", exemple: "01 23 45 67 89" },
  { code: "CM", nom: "Cameroun", indicatif: "+237", drapeau: "🇨🇲", exemple: "6 71 23 45 67" },
  { code: "MG", nom: "Madagascar", indicatif: "+261", drapeau: "🇲🇬", exemple: "032 12 345 67" },
  { code: "ES", nom: "Espagne", indicatif: "+34", drapeau: "🇪🇸", exemple: "612 34 56 78" },
  { code: "PT", nom: "Portugal", indicatif: "+351", drapeau: "🇵🇹", exemple: "912 345 678" },
  { code: "IT", nom: "Italie", indicatif: "+39", drapeau: "🇮🇹", exemple: "312 345 6789" },
  { code: "DE", nom: "Allemagne", indicatif: "+49", drapeau: "🇩🇪", exemple: "01512 3456789" },
  { code: "GB", nom: "Royaume-Uni", indicatif: "+44", drapeau: "🇬🇧", exemple: "07400 123456" },
  { code: "US", nom: "États-Unis", indicatif: "+1", drapeau: "🇺🇸", exemple: "201 555 0123" },
  { code: "AE", nom: "Émirats arabes unis", indicatif: "+971", drapeau: "🇦🇪", exemple: "050 123 4567" },
  { code: "IL", nom: "Israël", indicatif: "+972", drapeau: "🇮🇱", exemple: "050 123 4567" },
] as const;

/**
 * Le numéro au format international que Calendly attend, ou `null`. Écrit
 * comme on l'écrit chez soi : le 0 en tête tombe et l'indicatif du pays
 * choisi le remplace. Un numéro tapé avec son `+` ou son `00` garde le sien.
 * L'Italie garde son 0, qui fait partie du numéro chez elle.
 */
function numeroInternational(pays: string, saisie: string): string | null {
  let numero = saisie.replace(/[\s.\-()]/g, "");
  if (numero.startsWith("00")) numero = `+${numero.slice(2)}`;
  if (!numero.startsWith("+")) {
    const choisi = PAYS.find((p) => p.code === pays) ?? PAYS[0];
    if (choisi.code !== "IT") numero = numero.replace(/^0/, "");
    numero = `${choisi.indicatif}${numero}`;
  }
  return /^\+\d{8,15}$/.test(numero) ? numero : null;
}

/** Un jour de créneaux, dit comme on le dit : « jeudi 5 novembre ». */
function jourLisible(cle: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(dateDuJour(cle));
}

const heureLisible = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

/** Le créneau en entier, puisque l'appel a une durée : « Vendredi 6 novembre
 * de 12:00 à 12:30 ». */
const quandLisible = (iso: string) => {
  const debut = new Date(iso);
  const fin = new Date(debut.getTime() + reservationYt.dureeMinutes * 60_000);
  const jour = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(debut);
  const texte = `${jour} de ${heureLisible(iso)} à ${heureLisible(fin.toISOString())}`;
  return texte.charAt(0).toUpperCase() + texte.slice(1);
};

/** Le fuseau de l'appareil, en clair : « heure normale d'Europe centrale (UTC+1) ». */
function fuseauLisible() {
  const nom = (style: "longGeneric" | "shortOffset") =>
    new Intl.DateTimeFormat("fr-FR", { timeZoneName: style })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value ?? "";
  const decalage = nom("shortOffset");
  return `${nom("longGeneric")}${decalage ? ` (${decalage})` : ""}`;
}
