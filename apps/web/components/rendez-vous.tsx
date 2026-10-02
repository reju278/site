"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { PointGelule } from "@/components/pilules-hero";
import {
  consignesRendezVous,
  messageWhatsapp,
  recapReservation,
  whatsappHotes,
} from "@/contenu/thanks";
import {
  dateLisible,
  heureLisible,
  jourLisible,
  useReservation,
  type Reservation,
} from "@/lib/reservation";
import { surligner } from "@/lib/surligner";
import { cn } from "@repo/ui/lib/utils";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import { siWhatsapp } from "simple-icons";

/**
 * Le rendez-vous que Calendly vient de réserver, sur `/thanks` : les consignes
 * personnelles, puis le récapitulatif et le bouton WhatsApp.
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
 * préparé. `null` sans numéro. Écrit une fois : le bouton du récapitulatif et
 * le lien des consignes mènent au même endroit.
 */
function lienWhatsapp(r: Reservation | null) {
  const numero = hoteConnu(r?.hote)?.numero ?? whatsappHotes.parDefaut;
  if (!numero) return null;
  const message = messageWhatsapp({
    prenom: r?.prenom,
    hote: prenomHote(r?.hote),
    date: dateLisible(r?.debut),
  });
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/**
 * Un paragraphe, ses valeurs en gras, ses gestes surlignés et son lien.
 *
 * Les valeurs et le lien sont coupés d'abord, puis chaque morceau de texte
 * passe par `surligner` : un passage surligné ne contient jamais ni valeur ni
 * lien, donc les marques ne se chevauchent pas.
 */
function marquer(
  texte: string,
  gras: readonly string[],
  surligne: readonly string[],
  lien: { texte: string; href: string } | null,
) {
  type Morceau = string | { gras: string } | { lien: string };
  const couper = (
    morceaux: Morceau[],
    cible: string,
    marque: (c: string) => Morceau,
  ) =>
    morceaux.flatMap((m): Morceau[] => {
      if (typeof m !== "string") return [m];
      const i = m.indexOf(cible);
      if (i === -1) return [m];
      return [m.slice(0, i), marque(cible), m.slice(i + cible.length)];
    });

  let morceaux: Morceau[] = [texte];
  for (const valeur of gras)
    morceaux = couper(morceaux, valeur, (c) => ({ gras: c }));
  if (lien) morceaux = couper(morceaux, lien.texte, (c) => ({ lien: c }));

  return morceaux.map((m, i) => {
    if (typeof m === "string")
      return <span key={i}>{surligner(m, surligne)}</span>;
    if ("gras" in m)
      return (
        <strong key={i} className="font-semibold text-card-foreground">
          {m.gras}
        </strong>
      );
    /* Le vert de WhatsApp, celui du bouton, pour dire où mène le lien. Un
       nouvel onglet : sur ordinateur, `wa.me` ouvre une page qui propose
       l'application, et la confirmation ne doit pas faire quitter la page. */
    return (
      <a
        key={i}
        href={lien!.href}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#008069] underline decoration-2 underline-offset-4 hover:text-[#00684f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {m.lien}
      </a>
    );
  });
}

export function ConsignesRendezVous() {
  const r = useReservation();
  const href = lienWhatsapp(r);
  const { paragraphes, surligne, gras, lien } = consignesRendezVous({
    prenom: r?.prenom,
    email: r?.email,
    telephone: r?.telephone,
    date: dateLisible(r?.debut),
    whatsapp: Boolean(href),
  });

  return (
    <div className="space-y-4">
      {paragraphes.map((paragraphe, i) => (
        /* La clé est la place et non le texte : le premier paragraphe change
           de texte quand la réservation est lue, et une clé qui change
           remonterait l'élément au lieu de le mettre à jour. */
        <p key={i}>
          {marquer(
            paragraphe,
            gras,
            /* La phrase du lien n'est pas surlignée : elle porte aussi
               « via WhatsApp », et le surlignage ne vaut que pour la phrase
               d'origine, sur demande de Rémy. Le lien suffit à la marquer. */
            href && paragraphe.includes(lien) ? [] : surligne,
            href ? { texte: lien, href } : null,
          )}
        </p>
      ))}
    </div>
  );
}

/** Une ligne de coordonnées : une icône dans sa pastille, un libellé, une valeur. */
function Coordonnee({
  icone: Icone,
  libelle,
  valeur,
  large = false,
}: {
  icone: LucideIcon;
  libelle: string;
  valeur: string;
  /** Sur toute la largeur de la grille : l'e-mail, qui est long. */
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        large && "sm:col-span-2",
      )}
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
      >
        <Icone className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{libelle}</p>
        <p className="truncate font-medium text-card-foreground">{valeur}</p>
      </div>
    </div>
  );
}

/**
 * Le récapitulatif, en carte de rendez-vous, **seulement si Calendly a
 * transmis quelque chose** : sans réservation, une carte de cases vides ne
 * dirait rien. Le bouton WhatsApp, lui, s'affiche dès qu'un numéro d'hôte est
 * connu, réservation lue ou non : confirmer reste utile sans prénom.
 *
 * **Trois étages, sur demande de Rémy, qui voulait mieux qu'un tableau** :
 * l'en-tête dit qui et quand, avec le portrait de l'hôte, comme un carton
 * d'invitation ; les coordonnées viennent ensuite, à vérifier d'un coup
 * d'œil ; les réponses enfin, chacune sous sa question, parce qu'une réponse
 * longue ne tient pas dans une colonne. Chaque étage disparaît s'il est vide.
 */
export function RecapRendezVous() {
  const r = useReservation();
  const lien = lienWhatsapp(r);
  const hote = hoteConnu(r?.hote);
  const prenom = prenomHote(r?.hote);

  const jour = jourLisible(r?.debut);
  const debut = heureLisible(r?.debut);
  const fin = heureLisible(r?.fin);
  const creneau = debut ? (fin ? `${debut} – ${fin}` : debut) : undefined;

  const nomComplet = [r?.prenom, r?.nom].filter(Boolean).join(" ");
  const coordonnees = [
    nomComplet && {
      icone: User,
      libelle: recapReservation.nom,
      valeur: nomComplet,
    },
    r?.telephone && {
      icone: Phone,
      libelle: recapReservation.telephone,
      valeur: r.telephone,
    },
    r?.email && {
      icone: Mail,
      libelle: recapReservation.email,
      valeur: r.email,
      large: true,
    },
  ].filter(Boolean) as {
    icone: LucideIcon;
    libelle: string;
    valeur: string;
    large?: boolean;
  }[];
  const reponses = r?.reponses ?? [];

  const aDuContenu = Boolean(
    r && (jour || r.hote || coordonnees.length || reponses.length),
  );
  if (!aDuContenu && !lien) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-[12px] border border-border bg-background shadow-[0_12px_32px_-24px_rgba(0,0,0,0.35)]">
      {aDuContenu ? (
        <>
          {/* L'EN-TÊTE : qui et quand. Un lavis du bleu du site, assez léger
              pour que le texte garde le contraste de la page. */}
          <div className="flex items-center gap-4 border-b border-border bg-primary/[0.06] p-5 sm:p-6">
            {hote?.photo ? (
              /* `alt` vide : le nom de l'hôte est écrit juste à côté. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hote.photo}
                alt=""
                width={112}
                height={112}
                className="size-14 shrink-0 rounded-full object-cover ring-2 ring-background sm:size-16"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-16"
              >
                <CalendarCheck className="size-6" />
              </span>
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                {recapReservation.surtitre}
              </p>
              <p className="titre mt-0.5 text-lg leading-snug text-card-foreground sm:text-2xl">
                {recapReservation.appelAvec(prenom)}
              </p>
              {jour ? (
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground sm:text-base">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden className="size-4 shrink-0" />
                    <span className="first-letter:uppercase">{jour}</span>
                  </span>
                  {creneau ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="size-4 shrink-0" />
                      {creneau}
                    </span>
                  ) : null}
                </p>
              ) : null}

              {/* **« En attente de confirmation »**, sur demande de Rémy :
                  un rappel de plus que le rendez-vous n'est pas acquis tant
                  qu'il n'a pas répondu à l'e-mail. Le jaune des surlignages
                  de la page, qui marque déjà les gestes à faire, et le point
                  qui pulse des gélules de l'accueil : un état en cours, pas
                  une erreur. L'encre reste celle de la page, le jaune n'est
                  qu'un fond. */}
              <p
                style={
                  {
                    "--teinte": "var(--surlignage-jaune)",
                  } as React.CSSProperties
                }
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--surlignage-jaune)_22%,transparent)] px-3 py-1 text-xs font-semibold text-card-foreground ring-1 ring-[color-mix(in_srgb,var(--surlignage-jaune)_45%,transparent)] ring-inset sm:text-sm"
              >
                <PointGelule />
                {recapReservation.statut}
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            {coordonnees.length ? (
              <section>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {recapReservation.coordonnees}
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {coordonnees.map((c) => (
                    <Coordonnee key={c.libelle} {...c} />
                  ))}
                </div>
              </section>
            ) : null}

            {reponses.length ? (
              <section>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {recapReservation.reponses}
                </p>
                {/* Une liste de définitions : chaque question est le nom de
                    sa réponse, ce qu'un lecteur d'écran annonce comme tel.
                    La réponse sous sa question et non à côté : certaines
                    font trois lignes. */}
                <dl className="mt-3 divide-y divide-border rounded-md border border-border bg-card">
                  {reponses.map((q) => (
                    <div key={q.libelle} className="px-4 py-3">
                      <dt className="text-xs text-muted-foreground">
                        {q.libelle}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium break-words whitespace-pre-line text-card-foreground sm:text-base">
                        {q.reponse}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        </>
      ) : null}

      {/* **Le vert de WhatsApp, assombri** : le #25D366 de la marque ne tient
          que 2:1 sous un texte blanc. #008069 est le vert de ses propres
          en-têtes, et le blanc y tient 5:1. En dur, parce que c'est la
          couleur d'une marque, pas une surface du site. */}
      {lien ? (
        <div
          className={cn(
            "flex justify-center p-5 sm:p-6",
            aDuContenu && "border-t border-border",
          )}
        >
          <BoutonScintillant href={lien} fond="#008069" encre="#ffffff">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-5 shrink-0 fill-current"
            >
              <path d={siWhatsapp.path} />
            </svg>
            {recapReservation.bouton}
          </BoutonScintillant>
        </div>
      ) : null}
    </div>
  );
}
