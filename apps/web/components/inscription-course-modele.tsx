"use client";

import {
  inscrireCourseModele,
  situerCourseModele,
} from "@/app/course-modele/actions";
import { BoutonGenesis } from "@/components/bouton-genesis";
import { ChampGenesis, Obligatoire } from "@/components/champ-genesis";
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
import { ArrowRight, LoaderCircle, X } from "lucide-react";
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Le petit chargement après le choix, en millisecondes : assez pour lire
 *  la phrase, pas assez pour qu'on se demande si ça marche. */
const DUREE_CHARGEMENT = 2800;

/**
 * Les boutons « Apprendre » de Course modèle et leur fenêtre d'inscription,
 * en trois temps : le prénom et le nom, l'e-mail et le consentement, puis
 * ce qui décrit le mieux la personne, un petit chargement et la vidéo (voir
 * `Formulaire`).
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
 * À l'e-mail, quatre destinataires, dans cet ordre (le choix, au temps
 * suivant, complète le CRM et ClickFunnels) :
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
/** Ce qui ouvre la fenêtre, partagé par tous ses déclencheurs. */
const OuvrirFenetre = createContext<(() => void) | null>(null);

const useOuvrir = () => {
  const ouvrir = useContext(OuvrirFenetre);
  if (!ouvrir) {
    throw new Error("Un déclencheur d'inscription hors de FenetreCourseModele");
  }
  return ouvrir;
};

/**
 * **Une seule fenêtre par page**, posée autour de la page : les deux
 * boutons « Apprendre » (un de plus sur téléphone), la photo et le logo
 * l'ouvrent tous, sur demande de Rémy.
 */
export function FenetreCourseModele({ children }: { children: ReactNode }) {
  const { fenetre } = optinCourseModele;
  const [ouvert, setOuvert] = useState(false);
  const ouvrir = useCallback(() => setOuvert(true), []);

  return (
    <OuvrirFenetre.Provider value={ouvrir}>
      {children}
      <Dialog open={ouvert} onOpenChange={setOuvert}>
        {/* Sur téléphone, plus haut que le milieu, sur demande de Rémy : le
            clavier qui monte ne la recouvre pas. La fenêtre elle-même ne
            défile pas (sa croix est dehors, elle serait rognée) : c'est la
            carte qu'elle contient qui défile. */}
        <DialogContent
          aria-describedby={undefined}
          showCloseButton={false}
          className="max-w-[calc(100%-2rem)] gap-0 overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none sm:max-w-[400px] max-md:top-[calc(10svh+1.5rem)] max-md:translate-y-0"
        >
          <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-[var(--genesis-fond)] text-[var(--genesis-encre)] shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] max-md:max-h-[calc(90svh-2.5rem)]">
            <Formulaire />
          </div>
          {/* La croix hors du cadre, sur demande de Rémy : au-dessus de la
              fenêtre, à droite, sur téléphone ; à côté d'elle, en haut, sur
              ordinateur. Blanche : posée sur le voile sombre, une croix
              noire s'y perdait. */}
          <DialogClose
            aria-label={fenetre.fermer}
            className="absolute right-0 -top-12 flex size-10 items-center justify-center rounded-none bg-white text-[var(--genesis-encre)] transition-opacity hover:opacity-85 md:top-0 md:-right-12"
          >
            <X aria-hidden className="size-5" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </OuvrirFenetre.Provider>
  );
}

/** Le bouton « Apprendre ». */
export function InscriptionCourseModele() {
  const ouvrir = useOuvrir();
  return (
    <BoutonGenesis onClick={ouvrir}>{optinCourseModele.bouton}</BoutonGenesis>
  );
}

/**
 * Tout autre élément qui ouvre la fenêtre : la photo, la tuile du logo. Un
 * vrai bouton, nommé pour les lecteurs d'écran, qui ne change rien au
 * dessin de ce qu'il entoure.
 */
export function OuvreInscription({
  libelle,
  className = "",
  children,
}: {
  libelle: string;
  className?: string;
  children: ReactNode;
}) {
  const ouvrir = useOuvrir();
  return (
    <button
      type="button"
      onClick={ouvrir}
      aria-label={libelle}
      className={`block cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

type Hyros = {
  hrs?: { addLeadTag?: (tag: string) => void };
};

type Etape = "nom" | "email" | "situation" | "chargement";

/**
 * Le formulaire de la fenêtre, **en trois temps comme l'optin de Genesis**
 * (`InscriptionGenesis`), sur demande de Rémy :
 *
 * 1. le prénom et le nom ;
 * 2. l'e-mail et le consentement : **c'est ici que la personne est
 *    inscrite**, sans attente (Hyros, le CRM, ClickFunnels, GTM), et le
 *    choix s'affiche aussitôt. Qui s'arrête là reçoit quand même la suite
 *    par e-mail ;
 * 3. « Dernière étape, qu'est-ce qui te décrit le mieux, {prénom} ? » : deux
 *    réponses, de Rémy, à la place du téléphone. On touche, et c'est parti :
 *    le choix s'ajoute au contact (CRM, colonne « Situation » ; ClickFunnels,
 *    `course_modele_situation`), un petit chargement dit « Génial {prénom} ! »
 *    avec une phrase qui suit le choix, puis la vidéo s'ouvre.
 *
 * La question de chaque temps est le titre de la fenêtre, centré (la croix
 * est hors du cadre).
 * **Pas de bouton « Retour »**, sur demande de Rémy : on ne fait qu'avancer.
 * Chaque champ, tous obligatoires, porte un astérisque rouge (`obligatoire`).
 * Le changement de temps place le curseur dans le premier champ du suivant.
 */
function Formulaire() {
  const { fenetre } = optinCourseModele;
  const [etape, setEtape] = useState<Etape>("nom");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [consenti, setConsenti] = useState(false);
  /** Le choix du dernier temps, qui décide de la phrase du chargement. */
  const [situation, setSituation] = useState<string | null>(null);
  /** Le chargement se remplit de 0 à 100 % : vrai une fois lancé. */
  const [charge, setCharge] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  /** Vrai après un essai du temps en cours : les champs vides passent au
   *  rouge. Remis à zéro à chaque changement de temps. */
  const [tente, setTente] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const premierChamp = useRef<HTMLInputElement>(null);
  const premierBouton = useRef<HTMLButtonElement>(null);
  const aChange = useRef(false);
  /** L'inscription de l'e-mail, en cours ou faite : le choix l'attend. */
  const inscription = useRef<Promise<{ ok: boolean }> | null>(null);
  /** Le signal « lead » et Hyros ne partent qu'une fois par adresse. */
  const signale = useRef<string | null>(null);

  useEffect(() => {
    if (aChange.current) {
      if (etape === "situation") premierBouton.current?.focus();
      else premierChamp.current?.focus();
    }
    // La barre du chargement part de zéro, puis se remplit (transition CSS).
    if (etape === "chargement") {
      const depart = requestAnimationFrame(() => setCharge(true));
      return () => cancelAnimationFrame(depart);
    }
  }, [etape]);

  const aller = (suivante: Etape) => {
    aChange.current = true;
    setErreur(null);
    setTente(false);
    setEtape(suivante);
  };

  /**
   * Le CRM (onglet Funnels, tunnel « Course modèle ») : l'opt-in à l'e-mail,
   * puis le choix. En tâche de fond et sans jamais retenir personne ;
   * `keepalive` laisse le dernier envoi finir pendant que la page change.
   */
  const signalerCrm = (etapeCrm: "email" | "situation", choix?: string) => {
    void fetch(`${API_FUNNELS}/course-modele/optin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        etape: etapeCrm,
        prenom: prenom.trim(),
        nom: nom.trim(),
        email: email.trim(),
        consentement: consenti,
        ...(choix ? { situation: choix } : {}),
      }),
    }).catch(() => {});
  };

  /** Le contact, gardé pour préremplir Calendly sur la prise d'appel. */
  const ranger = () => {
    try {
      localStorage.setItem(
        CLE_CONTACT_VSL,
        JSON.stringify({
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim(),
          t: Date.now(),
        }),
      );
    } catch {
      /* Stockage bloqué : Calendly ne sera pas prérempli. */
    }
  };

  /** ClickFunnels : la réponse arrive dès la vérification faite, et
   *  l'inscription suit côté serveur. Un serveur injoignable est retenté. */
  const inscrire = async () => {
    const essai = () =>
      inscrireCourseModele(prenom, nom, email.trim()).catch(() => ({
        ok: false as const,
      }));
    let resultat = await essai();
    if (!resultat.ok) resultat = await essai();
    if (resultat.ok && signale.current !== email.trim()) {
      signale.current = email.trim();
      const fenetreGtm = window as unknown as { dataLayer?: unknown[] };
      fenetreGtm.dataLayer?.push({ event: "lead", funnel: "course-modele" });
    }
    return resultat;
  };

  const manque = {
    prenom: !prenom.trim(),
    nom: !nom.trim(),
    email: !email.trim(),
    consentement: !consenti,
  };

  const valider = async (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (envoi) return;
    setTente(true);
    setErreur(null);

    if (etape === "nom") {
      if (manque.prenom || manque.nom) {
        setErreur(fenetre.erreurs.champs);
        return;
      }
      aller("email");
      return;
    }

    if (etape === "email") {
      if (manque.email || manque.consentement) {
        setErreur(fenetre.erreurs.champs);
        return;
      }
      const adresse = email.trim();
      if (!EMAIL.test(adresse)) {
        setErreur(fenetre.erreurs.email);
        return;
      }
      /* Hyros d'abord : le tag, puis l'adresse. Rien ne doit retenir
         l'inscription si son script n'est pas là (bloqueur). Son envoi a
         tout le temps du choix pour partir. */
      try {
        (window as unknown as Hyros).hrs?.addLeadTag?.(TAG_HYROS_COURSE_MODELE);
        window.dispatchEvent(
          new CustomEvent("hyros_email", { detail: { email: adresse } }),
        );
      } catch {
        /* Hyros absent : il apprendra le contact par ClickFunnels. */
      }
      inscription.current = inscrire();
      signalerCrm("email");
      ranger();
      aller("situation");
      return;
    }
  };

  /**
   * Le dernier temps : un choix, et c'est parti. Le chargement s'affiche
   * aussitôt, le choix part au CRM et à ClickFunnels, et la vidéo s'ouvre
   * quand la barre est pleine. L'inscription partie à l'e-mail doit avoir
   * été acceptée ; refusée deux fois, on revient à l'e-mail avec l'erreur.
   */
  const choisir = async (valeur: string) => {
    if (envoi) return;
    setEnvoi(true);
    setSituation(valeur);
    aller("chargement");
    const plein = new Promise((fin) => setTimeout(fin, DUREE_CHARGEMENT));
    let inscrit = await (inscription.current ?? inscrire());
    if (!inscrit.ok) inscrit = await inscrire();
    if (!inscrit.ok) {
      setEnvoi(false);
      setCharge(false);
      aller("email");
      setErreur(fenetre.erreurs.envoi);
      return;
    }
    signalerCrm("situation", valeur);
    void situerCourseModele(email.trim(), valeur).catch(() => {});
    ranger();
    await plein;
    window.location.assign(APRES_INSCRIPTION);
  };

  const leNom = prenom.trim();
  const choix = fenetre.situations.find((s) => s.valeur === situation);
  const { question, bouton } =
    etape === "chargement"
      ? {
          question: [fenetre.chargement.titre.replace("{prenom}", leNom)],
          bouton: "",
        }
      : {
          ...fenetre.etapes[etape],
          question: fenetre.etapes[etape].question.map((ligne) =>
            ligne.replace("{prenom}", leNom),
          ),
        };

  return (
    <>
      <div className="px-5 pt-6 sm:px-6">
        {/* **Sur téléphone, la coupure saute** : à 375 px, « pour découvrir
            la stratégie : » ne tenait pas sur une ligne et le titre en
            prenait trois ; `text-balance` en fait deux égales. */}
        <DialogTitle className="text-center text-lg leading-snug font-bold text-balance sm:text-xl">
          {question.map((ligne, rang) => (
            <Fragment key={ligne}>
              {rang > 0 ? <br className="max-sm:hidden" /> : null}
              {rang > 0 ? " " : null}
              {ligne}
            </Fragment>
          ))}
        </DialogTitle>
      </div>
      <form
        noValidate
        onSubmit={valider}
        aria-describedby={erreur ? "erreur-course-modele" : undefined}
      >
        <fieldset
          disabled={envoi}
          className="flex flex-col gap-4 px-5 pt-5 pb-6 sm:px-6"
        >
          {etape === "nom" ? (
            <>
              <ChampGenesis
                ref={premierChamp}
                id="course-modele-prenom"
                obligatoire
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
                id="course-modele-nom"
                obligatoire
                libelle={fenetre.nom}
                placeholder={fenetre.exemples.nom}
                name="nom"
                autoComplete="family-name"
                aria-required
                aria-invalid={tente && manque.nom}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </>
          ) : null}

          {etape === "email" ? (
            <>
              <ChampGenesis
                ref={premierChamp}
                id="course-modele-email"
                obligatoire
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
                  <Obligatoire />
                </span>
              </label>
            </>
          ) : null}

          {etape === "situation" ? (
            // Deux grandes réponses, au dessin des champs (cadre d'un pixel,
            // angles droits) : on touche celle qui nous décrit, et c'est
            // parti, sans bouton à valider.
            <div role="group" className="flex flex-col gap-3">
              {fenetre.situations.map((reponse, rang) => (
                <button
                  key={reponse.valeur}
                  ref={rang === 0 ? premierBouton : undefined}
                  type="button"
                  onClick={() => void choisir(reponse.valeur)}
                  className="flex min-h-[64px] w-full items-center gap-3 rounded-none border border-black/45 bg-white px-4 py-3 text-left text-[17px] leading-snug text-pretty text-[var(--genesis-encre)] transition-[border-color,box-shadow,background-color] hover:border-[var(--genesis-encre)] hover:bg-[var(--genesis-surligne)] focus-visible:border-[var(--genesis-encre)] focus-visible:shadow-[0_0_0_1px_var(--genesis-encre)] focus-visible:outline-none"
                >
                  <span className="min-w-0 flex-1">{reponse.texte}</span>
                  <ArrowRight aria-hidden className="size-5 shrink-0" />
                </button>
              ))}
            </div>
          ) : null}

          {etape === "chargement" ? (
            // Le petit chargement, de Rémy : la phrase suit le choix, la barre
            // se remplit, puis la vidéo s'ouvre.
            <div role="status" className="flex flex-col gap-4 text-center">
              <p className="text-[17px] leading-relaxed text-pretty">
                {choix?.suite} {fenetre.chargement.fin}
              </p>
              <div className="h-2 w-full overflow-hidden bg-black/10">
                <div
                  className="h-full bg-[var(--genesis-bleu)] transition-[width] ease-out"
                  style={{
                    width: charge ? "100%" : "0%",
                    transitionDuration: `${DUREE_CHARGEMENT}ms`,
                  }}
                />
              </div>
              <p className="inline-flex items-center justify-center gap-2 text-sm text-[#60606b]">
                <LoaderCircle aria-hidden className="size-4 animate-spin" />
                {fenetre.chargement.attente}
              </p>
            </div>
          ) : null}

          {etape === "nom" || etape === "email" ? (
            <BoutonGenesis soumettre disabled={envoi} className="mt-1">
              {bouton}
            </BoutonGenesis>
          ) : null}

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
    </>
  );
}
