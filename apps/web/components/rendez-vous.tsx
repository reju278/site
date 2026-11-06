"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import {
  consignesRendezVous,
  messageWhatsapp,
  recapReservation,
  sansWhatsapp,
  whatsappHotes,
} from "@/contenu/thanks";
import {
  dateLisible,
  heureLisible,
  jourLisible,
  useReservation,
  type Reservation,
} from "@/lib/reservation";
import { cn } from "@repo/ui/lib/utils";
import {
  BellRing,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Clock,
  Mail,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { siWhatsapp } from "simple-icons";

/**
 * Le rendez-vous que Calendly vient de réserver, sur `/thanks`, dessiné comme
 * une vraie réservation, avec le bouton WhatsApp qui le confirme. Les
 * consignes écrites qui le précédaient ont été retirées par Rémy.
 *
 * **Client et non serveur, et c'est voulu** : les détails arrivent dans
 * l'adresse, que le script de `lib/reservation.ts` relève puis efface avant
 * l'hydratation. Lire l'adresse côté serveur rendrait la page dynamique et
 * laisserait les données dans le HTML ; ici, la page reste statique, le
 * serveur rend la version générique et le navigateur la complète.
 */

/** Le prénom de l'hôte, « Geoffrey » pour « Geoffrey BONNIOT ». */
function prenomHote(hote: string | undefined) {
  return hote?.split(/\s+/)[0];
}

/** Un nom comparable : sans casse, sans accents, espaces resserrés. */
function cleNom(nom: string) {
  return nom
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** L'hôte connu sous ce nom, s'il est dans `whatsappHotes`. */
function hoteConnu(hote: string | undefined) {
  return hote
    ? whatsappHotes.hotes.find((h) => cleNom(h.nom) === cleNom(hote))
    : undefined;
}

/**
 * Le lien `wa.me` vers l'hôte, ou vers le numéro par défaut, avec le message
 * préparé. `null` sans numéro.
 */
function lienWhatsapp(r: Reservation | null) {
  const numero = hoteConnu(r?.hote)?.numero ?? whatsappHotes.parDefaut;
  if (!numero) return null;
  const message = messageWhatsapp({
    prenom: r?.prenom,
    hote: prenomHote(r?.hote),
    jour: jourLisible(r?.debut),
    heure: heureLisible(r?.debut),
  });
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/** Une ligne du rendez-vous : une icône dans sa pastille, puis le texte. */
function Ligne({
  icone,
  children,
}: {
  icone: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground/[0.05] text-foreground/70"
      >
        {icone}
      </span>
      <span className="min-w-0 text-base text-card-foreground sm:text-lg">
        {children}
      </span>
    </li>
  );
}

/** Les initiales d'un nom, « RT » pour « Rémy Test ». */
function initiales(prenom?: string, nom?: string) {
  return [prenom, nom]
    .map((mot) => mot?.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("");
}

/** « Geoffrey Bonniot » pour « Geoffrey BONNIOT », comme Calendly l'écrit. */
function nomPropre(nom: string) {
  return nom
    .toLowerCase()
    .replace(/(^|[\s-])\p{L}/gu, (lettre) => lettre.toUpperCase());
}

/** Le logo de WhatsApp, en `currentColor`. */
function LogoWhatsapp({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("fill-current", className)}>
      <path d={siWhatsapp.path} />
    </svg>
  );
}

/**
 * Le rendez-vous, dessiné comme une vraie réservation, sur demande de Rémy :
 * les deux visages superposés, « Rémy Test avec Geoffrey Bonniot », le lieu
 * (WhatsApp, au numéro de la personne), le jour et l'heure, puis le bouton
 * vert qui le confirme. Plus de coordonnées ni de réponses en vrac, plus de
 * pastille « En attente de confirmation » : le bouton dit ce qu'il reste à
 * faire.
 *
 * **Chaque ligne tombe si elle manque**, et sans réservation lue il ne reste
 * que le bouton : une carte de cases vides ne dirait rien, confirmer reste
 * utile sans prénom.
 */
/**
 * Les consignes sous la vidéo 1/2, personnelles dès que la réservation dit
 * de quoi : le prénom, l'e-mail, la date et le téléphone. Sans réservation
 * connue, le texte générique, sans trou.
 */
export function ConsignesRendezVous() {
  const r = useReservation();
  const { lignes, gras, cloture, signature } = consignesRendezVous({
    email: r?.email,
    date: dateLisible(r?.debut),
    telephone: r?.telephone ? numeroLisible(r.telephone) : undefined,
  });

  const [premiere, ...suivantes] = lignes;

  return (
    <div className="pt-6 sm:pt-8">
      {/* Le geste à faire, à part des autres consignes, sur demande de Rémy. */}
      <div className="flex gap-3.5 rounded-md border border-primary/25 bg-primary/5 p-4 sm:gap-4 sm:p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Mail aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 self-center text-card-foreground">
          <p className="text-[15px] leading-relaxed break-words sm:text-base">
            <AvecGras texte={premiere.texte} gras={gras} />
          </p>
          <p className="mt-2 text-base font-semibold leading-relaxed sm:text-lg">
            <span
              className="surlignage"
              style={
                {
                  "--surlignage-fond":
                    "color-mix(in srgb, var(--surlignage-jaune) 45%, transparent)",
                } as React.CSSProperties
              }
            >
              {premiere.action}
            </span>
          </p>
        </div>
      </div>

      <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-background">
        {suivantes.map((ligne) => {
          const Icone = ICONES_CONSIGNES[ligne.icone];
          return (
            <li key={ligne.icone} className="flex gap-3.5 p-4 sm:gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icone aria-hidden className="size-[18px]" />
              </span>
              <p className="min-w-0 self-center text-[15px] leading-relaxed break-words text-card-foreground sm:text-base">
                <AvecGras texte={ligne.texte} gras={gras} />
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center gap-3 px-1">
        <Image
          src="/remy.webp"
          alt=""
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-full object-cover"
        />
        <p className="text-[15px] leading-snug text-card-foreground sm:text-base">
          {cloture}
          <span className="block text-sm text-muted-foreground">
            {signature}
          </span>
        </p>
      </div>

      <DetailEvenement reservation={r} />
    </div>
  );
}

const ICONES_CONSIGNES = {
  whatsapp: MessageCircle,
  rappel: BellRing,
  heure: Clock,
};

/** Le texte, avec en gras les valeurs propres à la personne. */
function AvecGras({ texte, gras }: { texte: string; gras: string[] }) {
  if (!gras.length) return texte;
  const motif = new RegExp(
    `(${gras.map((g) => g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  );
  return texte
    .split(motif)
    .map((morceau, i) =>
      i % 2 ? <strong key={i}>{morceau}</strong> : morceau,
    );
}

/**
 * « Détail de l'événement », replié et discret, sur demande de Rémy : qui
 * l'on est, puis ce qu'on a répondu. `details` natif : le texte est dans le
 * document dès le premier octet, et il s'ouvre au clavier sans rien écrire.
 */
function DetailEvenement({ reservation: r }: { reservation: Reservation | null }) {
  const coordonnees = [
    ...(r?.prenom ? [{ libelle: recapReservation.prenom, reponse: r.prenom }] : []),
    ...(r?.nom ? [{ libelle: recapReservation.nom, reponse: r.nom }] : []),
    ...(r?.email ? [{ libelle: recapReservation.email, reponse: r.email }] : []),
    ...(r?.telephone
      ? [
          {
            libelle: recapReservation.telephone,
            reponse: numeroLisible(r.telephone),
          },
        ]
      : []),
  ];
  /* Le quiz d'abord, les questions de la réservation ensuite. */
  const blocs = [
    { titre: recapReservation.coordonnees, lignes: coordonnees },
    {
      titre: recapReservation.reponses,
      lignes: [...(r?.reponsesQuiz ?? []), ...(r?.reponses ?? [])],
    },
  ].filter((bloc) => bloc.lignes.length);

  if (!blocs.length) return null;

  return (
    <details className="group mt-5 rounded-md border border-border bg-background">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
        {recapReservation.detail}
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="space-y-5 border-t border-border p-4 text-left">
        {blocs.map((bloc) => (
          <section key={bloc.titre}>
            <h3 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {bloc.titre}
            </h3>
            <dl
              className={
                bloc.titre === recapReservation.coordonnees
                  ? "grid gap-x-6 gap-y-3 sm:grid-cols-2"
                  : "space-y-3"
              }
            >
              {bloc.lignes.map((q) => (
                <div key={q.libelle}>
                  <dt className="text-[13px] leading-snug text-muted-foreground">
                    {q.libelle}
                  </dt>
                  <dd className="mt-0.5 text-[15px] font-medium break-words whitespace-pre-line text-card-foreground">
                    {q.reponse}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </details>
  );
}

export function RecapRendezVous() {
  const r = useReservation();
  const lien = lienWhatsapp(r);
  const hote = hoteConnu(r?.hote);
  const nomHote = hote?.nom ?? (r?.hote ? nomPropre(r.hote) : undefined);
  const invite = [r?.prenom, r?.nom].filter(Boolean).join(" ");

  const jour = jourLisible(r?.debut);
  const debut = heureLisible(r?.debut);
  const fin = heureLisible(r?.fin);
  const creneau = debut ? (fin ? `${debut} – ${fin}` : debut) : undefined;

  const aDuContenu = Boolean(r && (invite || nomHote || jour || r.telephone));
  if (!aDuContenu && !lien) return null;

  const bouton = lien ? (
    <BoutonScintillant
      href={lien}
      fond="#1DAA4D"
      encre="#ffffff"
      /* Sur téléphone, 16 px et un rembourrage resserré : la carte est
         posée dans celle de l'étape 1, et à 20 px le libellé passait sur deux
         lignes. */
      className="min-h-16 w-full gap-2 px-4 text-base font-bold sm:gap-3 sm:px-8 sm:text-2xl"
    >
      <LogoWhatsapp className="size-5 shrink-0 sm:size-6" />
      {/* Le texte qui roule au survol, comme sur les autres boutons du
          tunnel, relevé par Rémy. */}
      <TexteRoulant>{recapReservation.bouton}</TexteRoulant>
    </BoutonScintillant>
  ) : null;

  if (!aDuContenu) return bouton;

  return (
    <div className="mx-auto w-full max-w-xl rounded-[12px] border border-border bg-background p-4 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.35)] sm:p-7">
      {/* Les deux visages, celui de l'hôte devant, à cheval sur celui de la
          personne : ses initiales, faute de photo. Décoratifs, les deux noms
          sont écrits juste à côté. */}
      <div className="flex items-center gap-4">
        <div aria-hidden className="flex shrink-0 items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary ring-4 ring-background sm:size-16 sm:text-xl">
            {initiales(r?.prenom, r?.nom) || "?"}
          </span>
          {hote?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hote.photo}
              alt=""
              width={128}
              height={128}
              className="-ml-4 size-14 rounded-full object-cover ring-4 ring-background sm:size-16"
            />
          ) : (
            <span className="-ml-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background sm:size-16">
              <CalendarCheck className="size-6" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {recapReservation.surtitre}
          </p>
          <p className="titre mt-1 text-lg leading-snug text-balance text-card-foreground sm:text-2xl">
            {recapReservation.avec(invite, nomHote)}
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-3 border-t border-border pt-6">
        {r?.telephone ? (
          <Ligne icone={<LogoWhatsapp className="size-4" />}>
            {recapReservation.lieu}{" "}
            <strong className="font-semibold whitespace-nowrap">
              {numeroLisible(r.telephone)}
            </strong>
          </Ligne>
        ) : null}
        {jour ? (
          <Ligne icone={<CalendarDays className="size-4" />}>
            {/* La majuscule en texte : `first-letter` n'agit pas sur un
                élément en ligne. */}
            {jour.charAt(0).toUpperCase() + jour.slice(1)}
            {creneau ? (
              <>
                {" · "}
                <span className="whitespace-nowrap">{creneau}</span>
              </>
            ) : null}
          </Ligne>
        ) : null}
      </ul>

      {bouton ? <div className="mt-7">{bouton}</div> : null}

      <DetailEvenement reservation={r} />
    </div>
  );
}

/** Un numéro français lisible, « +33 6 00 00 00 00 » ; les autres tels quels. */
function numeroLisible(numero: string) {
  const fr = numero.replace(/\s/g, "").match(/^\+33(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/);
  return fr ? `+33 ${fr.slice(1).join(" ")}` : numero;
}

/**
 * « Tu n'as pas WhatsApp ? », sous le rendez-vous, replié par défaut, sur
 * demande de Rémy : confirmer en répondant « Oui » à l'e-mail d'invitation
 * que l'hôte a envoyé, montré tel qu'il arrive dans Gmail.
 *
 * **L'e-mail est dessiné aux couleurs de Gmail en sombre**, en dur : c'est
 * la capture d'une autre application, comme dans le script de la vidéo de
 * Rémy (`labo/confirmer-appel.html`), pas une surface du site. L'expéditeur,
 * le sujet et l'aperçu prennent l'hôte, la personne et le créneau de la
 * réservation ; l'heure de réception est celle de la page, puisque
 * l'invitation part au moment de la réservation.
 */
export function SansWhatsapp() {
  const r = useReservation();
  /* Rien sans réservation lue : au rendu serveur, où elle est toujours
     absente, l'heure de réception différerait de celle du navigateur. */
  if (!r) return null;
  const hote = hoteConnu(r?.hote);
  const nomHote = hote?.nom ?? (r?.hote ? nomPropre(r.hote) : undefined);
  const prenomH = prenomHote(nomHote);
  const debut = r?.debut ? new Date(r.debut) : undefined;
  const fin = r?.fin ? new Date(r.fin) : undefined;

  const heure = (date: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  const jourCourt = debut
    ? new Intl.DateTimeFormat("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(debut)
    : undefined;
  const jourLong = debut
    ? new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(debut)
    : undefined;
  const plage = debut
    ? `${heure(debut)}${fin ? ` - ${heure(fin)}` : ""}`
    : undefined;

  const qui = [prenomH, r.prenom].filter(Boolean).join(" et ") || "Funnels Club";
  const sujet = `Invitation: ${qui}${jourCourt ? ` - ${jourCourt} ${plage}` : ""}`;
  const apercu = `${qui}.${jourLong ? ` ${jourLong.charAt(0).toUpperCase() + jourLong.slice(1)} ⋅ ${plage?.replace(" - ", " – ")}` : ""}`;

  return (
    <details className="group mx-auto mt-4 w-full max-w-xl rounded-[12px] border border-border bg-background shadow-[0_12px_32px_-24px_rgba(0,0,0,0.35)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-base font-semibold text-card-foreground sm:px-7 [&::-webkit-details-marker]:hidden">
        {sansWhatsapp.titre}
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="space-y-4 border-t border-border px-4 pt-4 pb-5 text-base text-card-foreground/85 sm:px-7 sm:pb-7">
        <p>
          <span className="font-semibold text-primary">1.</span>{" "}
          {sansWhatsapp.etape1(prenomH)}
        </p>

        {/* La boîte de réception, une ligne : l'invitation, non lue. */}
        <div
          aria-hidden
          className="rounded-[18px] bg-[#0f0f0f] p-1.5 font-[Roboto,Arial,sans-serif] select-none"
        >
          <div className="flex items-start gap-3 rounded-[14px] bg-[#1e1e1e] px-3 pt-3 pb-2.5 text-[#c4c7c5]">
            {hote?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hote.photo}
                alt=""
                width={88}
                height={88}
                className="mt-0.5 size-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="mt-0.5 size-10 shrink-0 rounded-full bg-[#3c4043]" />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="flex items-center justify-between gap-2">
                <span className="truncate text-[15px] font-bold text-[#e3e3e3]">
                  {nomHote ?? "Funnels Club"}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-[#e3e3e3]">
                  {heure(new Date())}
                  <span className="size-2 rounded-full bg-[#a8c7fa]" />
                </span>
              </p>
              <p className="truncate text-sm font-bold text-[#e3e3e3]">{sujet}</p>
              <p className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-[#a8aaa9]">{apercu}</span>
                <span className="shrink-0 text-base text-[#a8aaa9]">☆</span>
              </p>
            </div>
          </div>
        </div>

        <p>
          <span className="font-semibold text-primary">2.</span>{" "}
          {sansWhatsapp.etape2.avant}
          <strong className="font-semibold text-card-foreground">
            {sansWhatsapp.etape2.invitation}
          </strong>
          {sansWhatsapp.etape2.milieu}
          <strong className="font-semibold text-card-foreground">
            {sansWhatsapp.etape2.oui}
          </strong>
          {sansWhatsapp.etape2.apres}
        </p>
      </div>
    </details>
  );
}
