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
import { useRef, useState } from "react";

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
      {/* Sur ordinateur, les deux colonnes s'étirent à la même hauteur
          (`md:items-stretch`) : la photo remplit toute sa zone, quelle que soit
          la longueur du texte à droite, au lieu de flotter au milieu avec du
          blanc au-dessus et au-dessous. Sur téléphone, elles s'empilent et la
          photo garde son 16/9. */}
      <div className="grid items-center gap-4 rounded-[var(--radius-lg)] border bg-card p-3 sm:gap-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] sm:p-6 md:grid-cols-[1.15fr_1fr] md:items-stretch md:gap-8">
        <ApercuVideo ouvrir={() => setOuvert(true)} />

        <div className="flex flex-col gap-4">
          {/* Un bouton de plus, sur téléphone seulement, sur demande de Rémy :
              les colonnes s'y empilent, et celui du bas de la carte tombe sous
              la ligne de flottaison. Celui-ci est visible au chargement, juste
              sous la photo. */}
          <BoutonScintillant
            action={() => setOuvert(true)}
            className="w-full text-lg md:hidden"
          >
            <TexteRoulant>{optinVsl.bouton}</TexteRoulant>
          </BoutonScintillant>
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
      className="group relative block aspect-video w-full overflow-hidden rounded-md bg-black md:aspect-auto md:h-full md:min-h-64 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
