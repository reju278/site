"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { OUVRIR_INSCRIPTION } from "@/components/ouvrir-inscription";
import {
  API_FUNNELS,
  CLE_CONTACT_VSL,
  optinVsl,
  questionnaireVsl,
  videoVsl,
} from "@/contenu/vsl";
import { enregistrerReponsesVsl, type ReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { cn } from "@repo/ui/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Lock,
  Play,
  Volume2,
} from "lucide-react";
import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";

/**
 * L'opt-in de la formation gratuite : l'aperçu de la vidéo et le bouton
 * ouvrent la même fenêtre — prénom, e-mail, consentement.
 *
 * L'inscription part à ClickFunnels par son SDK : la page est l'étape
 * « Page d'inscription » du tunnel, et les automatisations se règlent
 * là-bas. Le CRM Funnels Club (`/vsl/optin`) ne sert plus que de repli
 * quand le SDK n'a pas pu se charger. Prénom et e-mail restent dans le
 * navigateur (`localStorage`, sept jours, jamais dans
 * l'adresse) pour pré-remplir Calendly sur `/video-vsl`. On y va par une
 * navigation complète : le formulaire de Calendly lit ces informations au
 * chargement de la page, pas après une navigation côté client.
 */
/**
 * Les trois points de la vidéo, coche verte devant. Écrits une fois et montrés
 * deux fois sur `/course` : à côté de l'aperçu, et à la fin de la lettre de
 * Rémy, sur sa demande.
 */
export function ListePointsVsl() {
  return (
    <ul className="flex flex-col gap-3.5">
      {optinVsl.points.map((point, rang) => (
        <li key={rang} className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--icone-resultats)] text-white">
            <Check className="size-3.5" strokeWidth={3.5} />
          </span>
          <span className="text-base leading-snug text-foreground/85 sm:text-[17px]">
            {point.map((morceau, i) =>
              typeof morceau === "string" ? (
                morceau
              ) : (
                <strong key={i} className="font-semibold text-foreground">
                  {morceau.gras}
                </strong>
              ),
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function InscriptionVsl() {
  const [ouvert, setOuvert] = useState(false);
  const [annonce, setAnnonce] = useState<string | null>(null);
  useZoneVisible(ouvert);

  /* Les liens de la lettre de Rémy, plus bas sur la page, ouvrent aussi la
     fenêtre : voir `OuvrirInscription`. */
  useEffect(() => {
    const ouvrir = () => setOuvert(true);
    window.addEventListener(OUVRIR_INSCRIPTION, ouvrir);
    return () => window.removeEventListener(OUVRIR_INSCRIPTION, ouvrir);
  }, []);
  const { fenetre } = optinVsl;

  return (
    <>
      {/* La photo garde toujours son 16/9, sur décision de Rémy : la vidéo
          doit se montrer sous son meilleur jour, pas rognée pour remplir une
          hauteur. Pour qu'il n'y ait pas de blanc à côté d'elle sur
          ordinateur, c'est la largeur des colonnes qui s'ajuste : la photo
          prend un peu plus de place, et sa hauteur rejoint celle de la
          liste. Mesuré à 1280 px : carte de 72 rem, 1,5 part pour la photo,
          361 px de haut pour 347 de liste. */}
      <div className="grid items-center gap-4 rounded-[var(--radius-lg)] border bg-card p-3 sm:gap-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] sm:p-6 md:grid-cols-[1.5fr_1fr] md:gap-8">
        <ApercuVideo ouvrir={() => setOuvert(true)} />

        <div className="flex flex-col gap-4">
          {/* Un bouton de plus, sur téléphone seulement, sur demande de Rémy :
              les colonnes s'y empilent, et celui du bas de la carte tombe sous
              la ligne de flottaison. Celui-ci est visible au chargement, juste
              sous la photo. */}
          <BoutonScintillant
            action={() => setOuvert(true)}
            className="min-h-16 w-full text-lg sm:text-xl md:hidden"
          >
            <TexteRoulant>{optinVsl.bouton}</TexteRoulant>
          </BoutonScintillant>
          <p className="text-lg font-bold text-foreground sm:text-xl">
            {optinVsl.intro}
          </p>
          {/* Les trois points, précédés d'une coche verte, choisie par Rémy
              parmi cinq dessins. Le vert est `--icone-resultats`, celui de la
              flèche des résultats : il change de valeur selon le thème pour
              tenir le contraste d'un glyphe. */}
          <ListePointsVsl />
          <BoutonScintillant
            action={() => setOuvert(true)}
            className="mt-2 min-h-16 w-full text-lg sm:text-xl"
          >
            <TexteRoulant>{optinVsl.bouton}</TexteRoulant>
          </BoutonScintillant>
        </div>
      </div>

      <Dialog open={ouvert} onOpenChange={setOuvert}>
        {/* **Sur téléphone, la fenêtre se cale sur ce qu'on voit vraiment**,
            sur signalement de Rémy : centrée sur l'écran entier, elle passait
            pour moitié sous le clavier d'iPhone, case et bouton compris. Elle
            se colle donc en haut de la zone visible et en prend la hauteur au
            plus, en défilant à l'intérieur, les deux valeurs venant de
            `visualViewport` (voir `useZoneVisible`). Au-dessus de `sm`, elle
            reste centrée comme les autres fenêtres du site. */}
        <DialogContent
          /* Sans description : Radix demande de le dire explicitement. */
          aria-describedby={undefined}
          className="top-[calc(var(--zone-visible-haut,0px)+0.75rem)] max-h-[calc(var(--zone-visible-hauteur,100dvh)-1.5rem)] max-w-md translate-y-0 gap-0 overflow-y-auto overscroll-contain p-0 sm:top-[50%] sm:max-h-none sm:max-w-md sm:translate-y-[-50%] sm:overflow-visible"
        >
          {/* Le titre seul, sans phrase dessous ni trait de séparation, sur
              demande de Rémy : le formulaire suit directement. */}
          {/* Pendant les questions, le titre devient l'annonce des trois
              questions, sur demande de Rémy : « Juste un instant Prénom… ».
              Le formulaire le fait savoir par `annoncer`. */}
          <div className="px-6 pt-5 text-center sm:pt-7">
            <DialogTitle className="titre text-xl text-balance sm:text-2xl">
              {annonce ? insecables(annonce) : fenetre.titre}
            </DialogTitle>
          </div>
          <Formulaire annoncer={setAnnonce} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Formulaire({
  annoncer,
}: {
  /** Le titre de la fenêtre pendant les questions, `null` avant. */
  annoncer: (titre: string | null) => void;
}) {
  const { fenetre } = optinVsl;
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  /* `-1` : prénom, e-mail et consentement. `0` à `2` : les trois questions,
     une à la fois, à la place des champs. Voir `questionnaireVsl`. */
  const [etape, setEtape] = useState(-1);
  const [reponses, setReponses] = useState<ReponsesVsl>({});
  const formulaire = useRef<HTMLFormElement>(null);
  const { questions } = questionnaireVsl;
  const question = etape >= 0 ? questions[etape] : undefined;

  /* Le titre de la fenêtre suit l'étape, et revient au sien quand la
     fenêtre se ferme (le formulaire est alors démonté). */
  const questionsEnCours = etape >= 0;
  const prenomSaisi = prenom.trim();
  useEffect(() => {
    annoncer(
      questionsEnCours
        ? prenomSaisi
          ? questionnaireVsl.introAvecPrenom.replace("{prenom}", prenomSaisi)
          : questionnaireVsl.intro
        : null,
    );
  }, [annoncer, questionsEnCours, prenomSaisi]);
  useEffect(() => () => annoncer(null), [annoncer]);

  /* Un choix fait avancer ; le dernier envoie le formulaire. `flushSync`
     écrit la réponse dans son champ caché avant l'envoi : sans lui, le SDK
     lirait la valeur d'avant. */
  const choisir = (choix: string) => {
    if (!question || envoi) return;
    const suite = { ...reponses, [question.cle]: choix };
    flushSync(() => setReponses(suite));
    if (etape < questions.length - 1) {
      setEtape(etape + 1);
      return;
    }
    formulaire.current?.requestSubmit();
  };

  /* Deux chemins, et le SDK décide lequel.

     **Le SDK de ClickFunnels a pris le formulaire en charge**
     (`data-cf-sdk-enhanced`) : c'est le chemin normal. Il a déjà annulé
     l'envoi natif, il poste le prénom, l'e-mail et le consentement à
     ClickFunnels, qui crée le contact, compte l'opt-in de l'étape, lance ses
     automatisations et renvoie vers l'étape suivante du tunnel. On ne fait
     ici que ce qui doit se faire avant que la page change : garder prénom et
     e-mail pour pré-remplir Calendly, et prévenir GTM.

     **Le SDK n'est pas là**, bloqueur de publicités ou script en échec :
     l'inscription passe par le CRM, comme avant le SDK, pour ne perdre
     personne. Sans ce chemin, le formulaire, qui n'a pas d'`action`, se
     renverrait sur la page avec le prénom et l'e-mail dans l'adresse. */
  const valider = async (evenement: React.FormEvent<HTMLFormElement>) => {
    const parLeSdk = evenement.currentTarget.dataset.cfSdkEnhanced === "true";
    /* Les réponses, pour pré-remplir Calendly et régler la stratégie de
       `/video-vsl`. Elles partent aussi à ClickFunnels, par leurs champs
       cachés. */
    enregistrerReponsesVsl(reponses);
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
      /* Stockage bloqué : Calendly ne sera simplement pas pré-rempli. */
    }
    const fenetreGtm = window as unknown as { dataLayer?: unknown[] };
    fenetreGtm.dataLayer?.push({ event: "lead", funnel: "vsl" });

    if (parLeSdk) {
      setEnvoi(true);
      return;
    }

    evenement.preventDefault();
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
      window.location.href = "/video-vsl";
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
    <form
      ref={formulaire}
      onSubmit={valider}
      onFocus={recentrer}
      className="flex flex-col gap-3 px-6 pt-5 pb-6"
    >
      {/* Les trois réponses, en champs personnalisés de la fiche du contact
          ClickFunnels, sur demande de Rémy. Un `input` caché est un élément
          que le SDK accepte pour `custom-attribute:` ; le champ se crée chez
          ClickFunnels à la première valeur reçue. */}
      {questions.map((q) => (
        <input
          key={q.cle}
          type="hidden"
          data-cf-element={`custom-attribute:${q.champ}`}
          name={q.champ}
          value={reponses[q.cle] ?? ""}
        />
      ))}

      {question ? (
        <EtapeQuestion
          rang={etape}
          total={questions.length}
          titre={question.titre}
          choix={question.choix}
          emojis={question.emojis}
          choisi={reponses[question.cle]}
          envoi={envoi}
          choisir={choisir}
          retour={() => setEtape(etape - 1)}
        />
      ) : null}

      {/* **Les champs restent dans le formulaire pendant les questions**,
          cachés et non démontés : c'est ce formulaire-là que le SDK envoie à
          la dernière réponse, prénom et e-mail compris. */}
      <div hidden={etape >= 0} className="flex flex-col gap-3">
        {/* Les trois champs portent leur `data-cf-element` : c'est ce que le
          SDK lit, et rien d'autre. Aucun champ du formulaire n'en est
          dépourvu, la documentation de ClickFunnels l'interdisant. */}
        <Input
          required
          data-cf-element="first-name"
          name="first_name"
          autoComplete="given-name"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          /* Plus visibles, sur demande de Rémy : fond de carte, blanc sur le
           beige de la fenêtre, contour plus marqué, texte indicatif plus
           lisible. Doublés en `dark:` : la variante du registre pose
           `dark:bg-input/30`, que `cn()` ne voit pas comme un conflit. Et
           `md:text-base` contre son `md:text-sm`. */
          className="h-13 border-foreground/20 bg-card text-base shadow-sm placeholder:text-foreground/50 md:text-base dark:border-foreground/25 dark:bg-card"
          aria-label="Prénom"
        />
        <Input
          required
          data-cf-element="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          /* Plus visibles, sur demande de Rémy : fond de carte, blanc sur le
           beige de la fenêtre, contour plus marqué, texte indicatif plus
           lisible. Doublés en `dark:` : la variante du registre pose
           `dark:bg-input/30`, que `cn()` ne voit pas comme un conflit. Et
           `md:text-base` contre son `md:text-sm`. */
          className="h-13 border-foreground/20 bg-card text-base shadow-sm placeholder:text-foreground/50 md:text-base dark:border-foreground/25 dark:bg-card"
          aria-label="Email"
        />
        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-relaxed text-muted-foreground">
          {/* Le consentement part à ClickFunnels comme champ personnalisé de
            la fiche du contact, « consentement ». Le SDK envoie la valeur
            d'une case sans regarder si elle est cochée : c'est `required`
            qui garantit qu'elle l'est, puisque le formulaire ne part pas
            sans. Tout contact arrivé par ici porte donc « oui ». */}
          <input
            type="checkbox"
            required
            data-cf-element="custom-attribute:consentement"
            name="consentement"
            value="oui"
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
          /* Le bouton du site est un `type="button"`. **Il n'envoie plus** :
           il vérifie les champs avec les contrôles natifs, puis passe aux
           questions, sur décision de Rémy. L'envoi part à la dernière
           réponse. */
          action={() => {
            if (!envoi && formulaire.current?.reportValidity()) setEtape(0);
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
      </div>
    </form>
  );
}

/**
 * Une question du questionnaire, à la place des champs de la fenêtre : la
 * fenêtre et son titre ne changent pas, sur demande de Rémy, pour qu'on ne
 * se sente pas ailleurs.
 */
function EtapeQuestion({
  rang,
  total,
  titre,
  choix,
  emojis,
  choisi,
  envoi,
  choisir,
  retour,
}: {
  rang: number;
  total: number;
  titre: string;
  choix: readonly string[];
  emojis: readonly string[];
  choisi: string | undefined;
  envoi: boolean;
  choisir: (choix: string) => void;
  retour: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* La progression : une barre et « 1 / 3 ». */}
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={rang + 1}
          aria-label="Progression"
          className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${((rang + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {rang + 1} / {total}
        </span>
      </div>

      {/* La `key` remonte le bloc à chaque question : l'apparition se
          rejoue. */}
      <fieldset
        key={titre}
        disabled={envoi}
        className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
      >
        <legend className="text-lg font-semibold text-balance text-foreground">
          {insecables(titre)}
        </legend>
        <div className="mt-4 flex flex-col gap-2.5">
          {choix.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => choisir(c)}
              aria-pressed={choisi === c}
              className={cn(
                "flex min-h-13 w-full items-center justify-between gap-3 rounded-md border bg-card px-4 py-3 text-left text-base font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                choisi === c
                  ? "border-primary bg-primary/5"
                  : "border-foreground/20",
              )}
            >
              {/* L'émoji à l'écran seulement : la valeur choisie reste `c`. */}
              <span className="flex items-center gap-3">
                <span aria-hidden className="text-xl leading-none">
                  {emojis[i]}
                </span>
                {c}
              </span>
              {envoi && choisi === c && rang === total - 1 ? (
                <LoaderCircle
                  aria-hidden
                  className="size-5 shrink-0 animate-spin"
                />
              ) : null}
            </button>
          ))}
        </div>
      </fieldset>

      {rang > 0 ? (
        <button
          type="button"
          onClick={retour}
          disabled={envoi}
          className="inline-flex min-h-10 items-center gap-1.5 self-start rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {questionnaireVsl.retour}
        </button>
      ) : null}
    </div>
  );
}

/** Une durée en secondes, écrite comme un lecteur l'affiche : « 16:16 ». */
const duree = (secondes: number) =>
  `${Math.floor(secondes / 60)}:${String(Math.round(secondes % 60)).padStart(2, "0")}`;

/**
 * L'aperçu de la vidéo : une photo, qui ouvre la fenêtre d'inscription.
 *
 * **Une photo et non un extrait vidéo**, sur décision de Rémy : un extrait
 * assez léger pour le haut de page ne rendait pas justice à la qualité de la
 * vidéo. L'image est tirée de la vidéo en 4K, ramenée à 1920 et à 1080 px en
 * WebP (52 et 24 Ko) : le navigateur prend la plus petite qui suffit à son
 * écran.
 *
 * **Le bouton de lecture et la barre sont dessinés par la page**, pas dans
 * l'image comme sur l'ancienne, qui était une capture du lecteur : ils restent
 * nets à toutes les tailles.
 *
 * **Le clic ouvre la fenêtre, et rien d'autre**, sur décision de Rémy : un
 * verrou animé a été essayé avant, puis retiré.
 */
function ApercuVideo({ ouvrir }: { ouvrir: () => void }) {
  const { apercu } = optinVsl;

  return (
    <button
      type="button"
      onClick={ouvrir}
      aria-label="Voir la vidéo gratuite"
      className="group relative block aspect-video w-full overflow-hidden rounded-md bg-black text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* L'image du haut de page : `fetchPriority="high"`, et la largeur
          qu'elle occupe pour que le navigateur choisisse bien. Elle fait
          toute la largeur de la carte sur téléphone, un peu plus de la
          moitié de la carte au-delà. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={apercu.image}
        srcSet={`${apercu.imageMobile} 1080w, ${apercu.image} 1920w`}
        sizes="(min-width: 768px) 640px, calc(100vw - 4rem)"
        alt={apercu.alt}
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />

      {/* Le bouton de lecture est translucide, comme celui de Wistia, sur
          demande de Rémy : le visage reste visible au travers. Il se remplit
          au survol. Pas d'ombre portée : sur un fond qu'on voit au travers,
          elle salirait l'image au lieu de détacher le bouton. */}
      <span className="absolute top-[46%] left-1/2 flex h-12 w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-primary/70 text-primary-foreground transition-colors group-hover:bg-primary/90">
        <Play className="size-6 fill-current" />
      </span>

      {/* L'icône son, en haut à droite comme sur le lecteur de Wistia, sur
          demande de Rémy : elle dit que la vidéo est parlée. Décorative, le
          bouton entier portant déjà son libellé. */}
      <span
        aria-hidden
        className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/55 text-white"
      >
        <Volume2 className="size-[18px]" />
      </span>

      {/* La barre du lecteur : elle dit que c'est une vidéo, et sa durée. */}
      <span className="absolute inset-x-0 bottom-0 flex h-9 items-center gap-2 bg-gradient-to-t from-black/65 to-transparent px-3 text-xs text-white">
        <Play className="size-3.5 fill-current" />
        <span>0:00</span>
        <span className="relative h-1 flex-1 rounded-full bg-white/35">
          <span className="absolute inset-y-0 left-0 w-[3%] rounded-full bg-primary" />
        </span>
        <span>{duree(videoVsl.video.secondes)}</span>
      </span>
    </button>
  );
}

/**
 * Publie la zone de l'écran réellement visible pendant que la fenêtre est
 * ouverte : `--zone-visible-haut` et `--zone-visible-hauteur` sur la racine.
 *
 * Sur iPhone, le clavier ne réduit pas la page, il la recouvre : `100vh` et
 * `100dvh` gardent leur valeur, et seul `visualViewport` dit ce qui reste
 * au-dessus du clavier, et de combien la page a glissé pour montrer le champ.
 * Les deux sont relus à chaque changement, ouverture et fermeture du clavier
 * comprises.
 */
function useZoneVisible(actif: boolean) {
  useEffect(() => {
    const zone = window.visualViewport;
    if (!actif || !zone) return;
    const racine = document.documentElement.style;
    const publier = () => {
      racine.setProperty("--zone-visible-haut", `${zone.offsetTop}px`);
      racine.setProperty("--zone-visible-hauteur", `${zone.height}px`);
    };
    publier();
    zone.addEventListener("resize", publier);
    zone.addEventListener("scroll", publier);
    return () => {
      zone.removeEventListener("resize", publier);
      zone.removeEventListener("scroll", publier);
      racine.removeProperty("--zone-visible-haut");
      racine.removeProperty("--zone-visible-hauteur");
    };
  }, [actif]);
}

/**
 * Ramène au milieu de la fenêtre le champ qu'on vient de toucher, une fois le
 * clavier sorti : iOS fait défiler la page, pas la fenêtre, et le champ
 * suivant pouvait rester sous le clavier. Sur ordinateur, la fenêtre ne
 * défile pas, donc rien ne bouge.
 */
function recentrer(evenement: React.FocusEvent<HTMLFormElement>) {
  const champ = evenement.target;
  if (!(champ instanceof HTMLElement)) return;
  window.setTimeout(() => {
    champ.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 300);
}
