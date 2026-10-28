"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import {
  API_FUNNELS,
  CLE_CONTACT_VSL,
  optinVsl,
  videoVsl,
} from "@/contenu/vsl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { ArrowRight, LoaderCircle, Lock, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * L'opt-in de la formation gratuite : l'aperçu de la vidéo et le bouton
 * ouvrent la même fenêtre — prénom, e-mail, consentement.
 *
 * L'inscription part à ClickFunnels par son SDK : la page est l'étape
 * « Page d'inscription » du tunnel, et les automatisations se règlent
 * là-bas. Le CRM Funnels Club (`/vsl/optin`) ne sert plus que de repli
 * quand le SDK n'a pas pu se charger. Prénom et e-mail restent dans le
 * navigateur (`sessionStorage`, jamais dans
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
        <ApercuVerrouille ouvrir={() => setOuvert(true)} />

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
      sessionStorage.setItem(
        CLE_CONTACT_VSL,
        JSON.stringify({ prenom: prenom.trim(), email: email.trim() }),
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
      window.location.href = "/video";
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
      className="flex flex-col gap-3 px-6 pt-5 pb-6"
    >
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
        className="h-12 text-base"
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
        className="h-12 text-base"
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

/** Une durée en secondes, écrite comme un lecteur l'affiche : « 16:16 ». */
const duree = (secondes: number) =>
  `${Math.floor(secondes / 60)}:${String(Math.round(secondes % 60)).padStart(2, "0")}`;

/**
 * L'aperçu verrouillé de la vidéo, à la place de l'image d'avant.
 *
 * **Une vraie vidéo, mais pas le lecteur de Wistia** : huit secondes de la
 * formation, sans son, qui tournent en boucle comme une bande-annonce
 * (`public/vsl/apercu-boucle.mp4`, 257 Ko). Le lecteur de Wistia aurait coûté
 * environ 500 Ko de script en haut de page, et c'est ce haut de page que Google
 * chronomètre ; il aurait surtout lancé la vidéo au clic, alors qu'elle doit
 * rester fermée.
 *
 * **L'image passe avant la vidéo.** Elle est posée dessous, en
 * `fetchPriority="high"` : c'est elle qui s'affiche d'abord et que Google
 * mesure, et la vidéo la recouvre dès qu'elle tourne. Une affiche de `<video>`
 * ne peut pas recevoir de priorité.
 *
 * **Au clic**, l'image se voile et le cadenas dit qu'il faut s'inscrire, puis
 * la fenêtre d'inscription s'ouvre. Le voile reste ensuite : la vidéo est
 * toujours fermée tant qu'on ne s'est pas inscrit.
 *
 * **Sous mouvement réduit, rien ne tourne** : la lecture n'est lancée que si la
 * préférence ne demande rien, et l'image reste.
 */
function ApercuVerrouille({ ouvrir }: { ouvrir: () => void }) {
  const { apercu } = optinVsl;
  const [verrouille, setVerrouille] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.play().catch(() => {
      /* Lecture refusée (économie d'énergie, par exemple) : l'image reste. */
    });
  }, []);

  const cliquer = () => {
    if (verrouille) {
      ouvrir();
      return;
    }
    setVerrouille(true);
    video.current?.pause();
    /* Le temps de voir le cadenas avant que la fenêtre le recouvre. */
    window.setTimeout(ouvrir, 650);
  };

  return (
    <button
      type="button"
      onClick={cliquer}
      aria-label={`${apercu.verrou}. ${apercu.debloquer}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-md bg-black text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={apercu.affiche}
        alt={apercu.alt}
        width={960}
        height={540}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <video
        ref={video}
        src={apercu.video}
        muted
        loop
        playsInline
        preload="auto"
        width={960}
        height={540}
        aria-hidden
        className={`absolute inset-0 size-full object-cover transition-[filter,scale] duration-500 ${
          verrouille ? "scale-110 blur-md brightness-75" : ""
        }`}
      />

      {verrouille ? (
        /* Le verrou. Fond sombre sous le texte blanc, et non le seul flou :
           un flou ne change pas la luminosité de ce qu'il brouille. */
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-4 text-center text-white">
          <span className="flex size-14 items-center justify-center rounded-full border border-white/55 bg-white/15 backdrop-blur-[6px]">
            <Lock className="size-6" />
          </span>
          <span className="text-base font-bold [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] sm:text-lg">
            {apercu.verrou}
          </span>
          <span className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(4,94,230,0.9)]">
            {apercu.debloquer}
          </span>
        </span>
      ) : (
        <>
          <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-[6px]">
            {apercu.pastille}
          </span>
          <span className="absolute top-[46%] left-1/2 flex h-12 w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] transition-[scale] group-hover:scale-105">
            <Play className="size-6 fill-current" />
          </span>
        </>
      )}

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
