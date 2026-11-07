"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { OUVRIR_INSCRIPTION } from "@/components/ouvrir-inscription";
import {
  API_FUNNELS,
  CLE_CONTACT_VSL,
  optinVsl,
} from "@/contenu/vsl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import {
  Check,
  LoaderCircle,
  Play,
  Scan,
  Settings,
  X,
} from "lucide-react";
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
          <span className="text-base leading-snug text-foreground/85 sm:text-[17px] lg:text-xl">
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
      {/* Sur ordinateur, photo et texte se partagent la carte à parts
          égales, comme sur la page ClickFunnels d'origine, sur demande de
          Rémy. La photo y passe en 4/3, sur sa demande aussi : plus haute,
          elle rejoint la hauteur du texte ; ses côtés sont recadrés, pas
          ses commandes, qui sont dessinées par-dessus. Sur téléphone, elle
          garde son 16/9. */}
      <div className="grid items-center gap-4 rounded-[var(--radius-lg)] border bg-card p-3 sm:gap-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] sm:p-6 md:grid-cols-2 md:gap-8">
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
          <p className="text-lg font-bold text-foreground sm:text-xl lg:text-2xl">
            {optinVsl.intro}
          </p>
          {/* Les trois points, précédés d'une coche verte, choisie par Rémy
              parmi cinq dessins. Le vert est `--icone-resultats`, celui de la
              flèche des résultats : il change de valeur selon le thème pour
              tenir le contraste d'un glyphe. */}
          <ListePointsVsl />
          <BoutonScintillant
            action={() => setOuvert(true)}
            className="mt-2 min-h-16 w-full text-lg sm:text-xl lg:min-h-[4.5rem] lg:text-[1.625rem] lg:font-bold xl:text-[2rem]"
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
          /* La croix du registre s'annonce « Close » en anglais aux lecteurs
             d'écran ; la nôtre, même dessin, dit « Fermer ». */
          showCloseButton={false}
          className="top-[calc(var(--zone-visible-haut,0px)+0.75rem)] max-h-[calc(var(--zone-visible-hauteur,100dvh)-1.5rem)] max-w-md translate-y-0 gap-0 overflow-y-auto overscroll-contain p-0 sm:top-[50%] sm:max-h-none sm:max-w-md sm:translate-y-[-50%] sm:overflow-visible"
        >
          {/* Le titre seul, sans phrase dessous ni trait de séparation, sur
              demande de Rémy : le formulaire suit directement. */}
          <div className="px-6 pt-5 text-center sm:pt-7">
            <DialogTitle className="titre text-xl text-balance sm:text-2xl">
              {fenetre.titre}
            </DialogTitle>
          </div>
          <Formulaire />
          <DialogClose
            aria-label="Fermer"
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:opacity-100 sm:top-4 sm:right-4 sm:size-8"
          >
            <X aria-hidden className="size-4" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Formulaire() {
  const { fenetre } = optinVsl;
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const formulaire = useRef<HTMLFormElement>(null);

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
      {/* **Plus de questions après le prénom et l'e-mail**, sur demande de
          Rémy : le bouton envoie le formulaire, et ClickFunnels renvoie
          directement vers la vidéo. Le questionnaire de `questionnaireVsl`
          reste écrit, Calendly et `/video-vsl` savent lire ses réponses, mais
          plus rien ne le pose : la stratégie chiffrée de `/video-vsl`, qui en
          dépend, ne s'affiche donc plus. */}
      <div className="flex flex-col gap-3">
        {/* Les trois champs portent leur `data-cf-element` : c'est ce que le
          SDK lit, et rien d'autre. Aucun champ du formulaire n'en est
          dépourvu, la documentation de ClickFunnels l'interdisant. */}
        <Input
          required
          data-cf-element="first-name"
          name="first_name"
          autoComplete="given-name"
          /* Majuscule au prénom, comme sur `/appel` : avec un vrai
             formulaire et des champs nommés, c'est ce qui fait proposer à
             l'iPhone et à Android le prénom enregistré sur le téléphone. */
          autoCapitalize="words"
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
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
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
          /* Le bouton du site est un `type="button"` : il envoie par
             `requestSubmit`, qui passe par les contrôles natifs puis par
             l'événement `submit` que le SDK de ClickFunnels écoute. Texte
             plus grand, sur demande de Rémy. */
          action={() => {
            if (!envoi) formulaire.current?.requestSubmit();
          }}
          className="mt-2 min-h-14 w-full text-xl font-bold sm:text-2xl"
        >
          {envoi ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : (
            <TexteRoulant>{fenetre.bouton}</TexteRoulant>
          )}
        </BoutonScintillant>
      </div>
    </form>
  );
}

/**
 * L'icône son du lecteur Wistia : un haut-parleur plein et deux ondes en
 * parenthèses. Les ondes s'allument et s'éteignent l'une après l'autre, sur
 * demande de Rémy, pour dire que le son est là. `anime` les fige, pour la
 * barre du bas, où Wistia ne les anime pas.
 *
 * L'animation ne joue que si le mouvement réduit n'est pas demandé : arrêtée
 * par la règle globale, elle figerait une onde à moitié éteinte.
 */
function IconeSon({
  className,
  anime = true,
}: {
  className: string;
  anime?: boolean;
}) {
  const onde = anime
    ? "motion-safe:animate-[onde-son_1.2s_ease-in-out_infinite]"
    : "";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      className={className}
    >
      <path d="M3 9.5h3.5L11 5.5v13l-4.5-4H3z" fill="currentColor" stroke="none" />
      <path d="M15 9a4.5 4.5 0 0 1 0 6" className={onde} />
      <path
        d="M18.5 6a8.5 8.5 0 0 1 0 12"
        className={onde}
        style={anime ? { animationDelay: "0.3s" } : undefined}
      />
    </svg>
  );
}

/**
 * L'aperçu de la vidéo : une photo, qui ouvre la fenêtre d'inscription.
 *
 * **Une photo et non un extrait vidéo**, sur décision de Rémy : un extrait
 * assez léger pour le haut de page ne rendait pas justice à la qualité de la
 * vidéo. L'image est tirée de la vidéo en 4K, ramenée à 1920 et à 1080 px en
 * WebP (41 et 19 Ko) : le navigateur prend la plus petite qui suffit à son
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
      className="group @container relative block aspect-video w-full md:aspect-[4/3] overflow-hidden rounded-md bg-black text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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

      {/* Les trois commandes reprennent le lecteur Wistia de la page
          d'origine, sur capture fournie par Rémy, « exactement comme ça » :
          un bouton de lecture rectangulaire au centre, un rond noir pour le
          son en haut à droite, une barre bleue pleine en bas. Toutes
          décoratives : c'est le bouton entier qui ouvre l'inscription.

          **Leurs cotes sont des proportions de la largeur du cadre**, en
          `cqw`, relevées sur la capture de 2000 px de large : elles gardent
          le même rapport à l'image à toutes les tailles. Chacune a un
          plancher, sans quoi la barre tomberait à 10 px sur téléphone. */}
      <span className="absolute top-[46.7%] left-1/2 flex h-[max(3rem,8.4cqw)] w-[max(4.75rem,13.15cqw)] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden bg-primary/85 text-white transition-colors group-hover:bg-primary">
        {/* Le reflet du bouton Wistia : une ellipse plus claire qui en
            couvre le haut. */}
        <span
          aria-hidden
          className="absolute -top-[45%] -left-[15%] h-[120%] w-[110%] rounded-[50%] bg-white/10"
        />
        <Play className="relative size-[max(1.5rem,2.9cqw)] fill-current" strokeWidth={0} />
      </span>

      {/* Le son se déplie vers la gauche au survol, comme celui de Wistia,
          sur demande de Rémy : « Cliquez pour activer le son ». Replié, c'est
          un rond ; déplié, une pilule ancrée à droite dont le libellé
          s'ouvre en largeur. Sur téléphone, sans survol, il reste rond. */}
      <span
        aria-hidden
        className="group/son absolute top-[2cqw] right-[1.6cqw] flex h-[max(2.25rem,5.9cqw)] min-w-[max(2.25rem,5.9cqw)] items-center justify-end rounded-full bg-black/85 text-[max(0.8125rem,1.5cqw)] text-white"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,padding] duration-300 ease-out group-hover/son:max-w-[20rem] group-hover/son:pl-[1.1em] group-hover/son:opacity-100">
          Cliquez pour activer le son
        </span>
        {/* Des cotes écrites, et non `h-full` et un pourcentage : une taille
            en pourcentage dans une boîte qui tient sa largeur d'`aspect-square`
            ne se résout pas de la même façon d'un navigateur à l'autre. */}
        <span className="flex size-[max(2.25rem,5.9cqw)] shrink-0 items-center justify-center">
          <IconeSon className="size-[max(1rem,2.65cqw)] shrink-0" />
        </span>
      </span>

      {/* La barre : lecture, temps écoulé, piste fine et son curseur, puis
          sous-titres, son, réglages et plein écran. Pas de durée, comme sur
          l'original. Les sous-titres et les réglages s'effacent sur
          téléphone, où la barre n'a pas la place de tout porter. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 flex h-[max(1.75rem,3.25cqw)] items-center gap-[max(0.625rem,1.6cqw)] bg-primary px-[max(0.5rem,1cqw)] text-[max(0.75rem,1.6cqw)] font-medium text-white"
      >
        <Play className="aspect-square h-[55%] w-auto shrink-0 fill-current" strokeWidth={0} />
        <span className="tabular-nums">0:00</span>
        <span className="relative h-0.5 flex-1 rounded-full bg-white/70">
          <span className="absolute top-1/2 left-0 size-[max(0.5rem,0.55cqw)] -translate-y-1/2 rounded-full bg-white" />
        </span>
        <span className="hidden h-[55%] items-center rounded-[3px] border-[1.5px] border-current px-[0.2em] text-[0.7em] leading-none font-bold sm:flex">
          cc
        </span>
        <IconeSon className="aspect-square h-[60%] w-auto shrink-0" anime={false} />
        <Settings className="hidden aspect-square h-[60%] w-auto shrink-0 sm:block" />
        <Scan className="aspect-square h-[60%] w-auto shrink-0" />
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
 * suivant pouvait rester sous le clavier.
 *
 * **Sur écran tactile seulement.** Sur ordinateur, il n'y a pas de clavier à
 * éviter, et ce défilement faisait bouger la page derrière la fenêtre à
 * chaque champ touché, ce que Rémy a relevé.
 */
function recentrer(evenement: React.FocusEvent<HTMLFormElement>) {
  if (!window.matchMedia("(pointer: coarse)").matches) return;
  const champ = evenement.target;
  if (!(champ instanceof HTMLElement)) return;
  window.setTimeout(() => {
    champ.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 300);
}
