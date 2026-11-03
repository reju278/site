"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { cn } from "@repo/ui/lib/utils";
import { LecteurVideo } from "@/components/lecteur-video";
import { NoteManuscrite } from "@/components/note-manuscrite";
import { AnimatePresence, motion } from "motion/react";

export type EntretienPile = {
  id: string;
  nom: string;
  description: string;
  secondes: number;
  /** Un titre écrit pour la pile ; à défaut, le nom et la ligne. */
  titre?: string;
  /** Une note au feutre, à gauche de la vidéo sur ordinateur. */
  note?: string;
};

/**
 * Les entretiens en grand, l'un sous l'autre, sous la vidéo du système de
 * `/form-funnel-thanks`, sur demande de Rémy : le premier (Roland) d'emblée,
 * les autres trois par trois derrière « Découvrir 3 autres histoires », et
 * « Fermer » (puis « Tout fermer ») à côté, qui replie tout.
 *
 * Chaque titre est le nom et la ligne de `temoignages` : tirée de l'entretien,
 * jamais réécrite ici. Le lecteur est celui de Wistia, servi d'emblée.
 */
export function PileEntretiens({
  entretiens,
  className,
}: {
  entretiens: readonly EntretienPile[];
  className?: string;
}) {
  /* Combien de paquets de trois sont ouverts sous le premier entretien. */
  const [paliers, setPaliers] = useState(0);
  const barre = useRef<HTMLDivElement>(null);
  const [premier, ...suite] = entretiens;
  if (!premier) return null;

  const ouverts = suite.slice(0, paliers * PAQUET);
  const prochains = Math.min(PAQUET, suite.length - ouverts.length);

  /* **Le navigateur ne doit pas recaler la page pendant l'animation.**
     Chrome « ancre » le défilement sur un élément visible : à l'ouverture, il
     faisait sauter la page de quatre cents pixels pour garder la barre en
     place. On coupe l'ancrage le temps du mouvement, et c'est nous qui
     décidons. */
  const sansAncrage = (ms: number) => {
    const racine = document.documentElement;
    racine.style.overflowAnchor = "none";
    window.setTimeout(() => {
      racine.style.overflowAnchor = "";
    }, ms);
  };

  /* **À la fermeture, la barre reste où elle est.** Les histoires se replient
     au-dessus d'elle : sans correction, elle remonte de toute leur hauteur et
     sort de l'écran par le haut. On la retient image par image, ce que Safari
     ne fait pas de lui-même. */
  const garderLaBarre = (ms: number) => {
    const el = barre.current;
    if (!el) return;
    const depart = el.getBoundingClientRect().top;
    const fin = performance.now() + ms;
    const pas = () => {
      const ecart = el.getBoundingClientRect().top - depart;
      /* `instant` : la page défile en douceur par défaut
         (`scroll-behavior: smooth`), et soixante corrections douces par
         seconde s'annulaient l'une l'autre, la barre filait quand même. */
      if (Math.abs(ecart) > 0.5) {
        window.scrollTo({ top: window.scrollY + ecart, behavior: "instant" });
      }
      if (performance.now() < fin) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };

  const ouvrir = () => {
    sansAncrage(DUREE_MS + 400);
    setPaliers((p) => p + 1);
  };

  const refermer = () => {
    sansAncrage(DUREE_MS + 200);
    garderLaBarre(DUREE_MS + 150);
    /* Un seul paquet ouvert : « Fermer » le replie. Au-delà, « Tout
       fermer » replie tout d'un coup, sur demande de Rémy. */
    setPaliers(0);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <Entretien entretien={premier} />
      {/* **La hauteur s'anime, à l'ouverture comme à la fermeture** : chaque
          histoire se déplie depuis zéro et se replie jusqu'à zéro, en fondu.
          Le contenu en dessous suit le mouvement au lieu de sauter. L'écart
          entre deux histoires est dans le bloc animé, pour se replier avec
          lui. */}
      <AnimatePresence initial={false}>
        {ouverts.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: DUREE_MS / 1000, ease: COURBE, delay: (i % PAQUET) * 0.06 },
                opacity: { duration: 0.45, ease: "easeOut", delay: (i % PAQUET) * 0.06 + 0.15 },
              },
              /* L'ombre de la vidéo déborde du bloc : une fois déplié, il cesse
                 de rogner. */
              transitionEnd: { overflow: "visible" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              overflow: "hidden",
              transition: {
                height: { duration: DUREE_MS / 1000, ease: COURBE },
                opacity: { duration: 0.25, ease: "easeIn" },
              },
            }}
          >
            <div className="pt-16 sm:pt-20">
              <Entretien entretien={e} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {prochains > 0 || paliers > 0 ? (
        <div
          ref={barre}
          /* Sur téléphone, les deux boutons s'empilent à la même largeur,
             « Fermer » au-dessus, sur demande de Rémy. */
          className="mx-auto mt-10 flex w-full flex-col items-stretch justify-center gap-3 max-sm:max-w-sm sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center"
        >
          {/* À gauche, tout refermer : « Fermer » après le premier paquet,
              « Tout fermer » dès le deuxième. */}
          {paliers > 0 ? (
            /* Le même bouton que le bleu, en gris et sans la lumière qui
               tourne : relief, ombre et texte qui roule restent. Un gris un
               peu plus soutenu que le fond, un liseré et un reflet en haut
               lui donnent le relief que le blanc du renfoncement ne donne
               pas sur un fond clair. */
            <BoutonScintillant
              action={refermer}
              rayon="25px"
              fond="color-mix(in oklab, var(--muted), var(--foreground) 9%)"
              encre="var(--foreground)"
              scintille={false}
              className={cn(OMBRE, "max-sm:w-full ring-1 ring-foreground/15 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(0,0,0,0.1)]")}
            >
              <ChevronUp aria-hidden className="size-4 shrink-0" />
              <TexteRoulant>{paliers > 1 ? "Tout fermer" : "Fermer"}</TexteRoulant>
            </BoutonScintillant>
          ) : null}
          {/* Le bouton du mur de la communauté, repris tel quel : même
              lumière qui tourne, même rayon de 25 px, une ombre plus marquée. */}
          {prochains > 0 ? (
            <BoutonScintillant
              action={ouvrir}
              rayon="25px"
              className={cn(OMBRE, "max-sm:w-full ring-1 ring-black/10")}
            >
              <TexteRoulant>
                {prochains > 1
                  ? `Découvrir ${prochains} autres histoires`
                  : "Découvrir une autre histoire"}
              </TexteRoulant>
              <ChevronDown aria-hidden className="size-4 shrink-0" />
            </BoutonScintillant>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** L'ombre portée des deux boutons, plus franche que celle du mur. */
const OMBRE = "shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]";

/** La durée du dépliage et du repli. */
const DUREE_MS = 650;

/** La courbe des apparitions de la page, `Apparition`. */
const COURBE = [0.32, 0.72, 0, 1] as const;

/** Les histoires s'ouvrent trois par trois, sur demande de Rémy. */
const PAQUET = 3;

function Entretien({ entretien }: { entretien: EntretienPile }) {
  return (
    <article>
      <h3 className="titre mx-auto max-w-3xl text-center text-2xl text-balance text-foreground sm:text-3xl">
        {entretien.titre ?? `${entretien.nom} : ${entretien.description}`}
      </h3>
      <div className="relative mt-6">
        {entretien.note ? (
          <NoteManuscrite className="mb-2 lg:absolute lg:top-1/4 lg:right-full lg:mr-4 lg:mb-0 lg:w-56 xl:w-64">
            {entretien.note}
          </NoteManuscrite>
        ) : null}
      <LecteurVideo
        id={entretien.id}
        titre={`Entretien avec ${entretien.nom}`}
        secondes={entretien.secondes}
        affiche={`/temoignages/${entretien.id}.jpg`}
        afficheAlt={`Entretien avec ${entretien.nom}`}
        /* Le lecteur de Wistia, comme la vidéo du système au-dessus. */
        natif
        className="shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55),0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/25"
      />
      </div>
    </article>
  );
}
