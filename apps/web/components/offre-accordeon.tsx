"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { MaquetteEspaceMembre } from "@/components/maquette-espace-membre";
import { Emplacement } from "@/components/section";
import type { Pilier } from "@/contenu/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

/** Le temps qu'un pilier reste ouvert avant que le suivant prenne la main. */
const DUREE_PILIER = 7000;

/**
 * Vrai quand la personne a demandé moins de mouvement.
 *
 * `globals.css` neutralise déjà transitions et animations CSS, mais l'avance
 * automatique est une minuterie JavaScript : aucune feuille de style ne
 * l'arrête. Il faut donc la lire ici aussi, et écouter les changements, parce
 * que le réglage se modifie sans recharger la page.
 *
 * L'état part à `false` et non à la valeur lue : au rendu serveur la préférence
 * est inconnue, et supposer l'une des deux ferait diverger le HTML du serveur
 * de celui du client. Le premier effet corrige au montage.
 */
function useMouvementReduit() {
  const [reduit, setReduit] = useState(false);

  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduit(requete.matches);

    const suivre = (evenement: MediaQueryListEvent) =>
      setReduit(evenement.matches);
    requete.addEventListener("change", suivre);
    return () => requete.removeEventListener("change", suivre);
  }, []);

  return reduit;
}

/**
 * Une offre présentée en deux colonnes : le visuel d'un côté, les piliers en
 * accordéon de l'autre.
 *
 * La mise en page est reprise de la section « switchback » de calendly.com, sur
 * demande de Rémy. Le principe : un seul pilier ouvert à la fois, le visuel qui
 * suit celui qui est ouvert, et les piliers qui défilent seuls. C'est ce lien
 * entre les deux colonnes qui fait le motif ; sans lui, ce serait un accordéon
 * posé à côté d'une image.
 *
 * L'accordéon vient du registre shadcn. Il est employé **en mode contrôlé**
 * parce que deux autres choses ont besoin de savoir quel pilier est ouvert : le
 * visuel et la minuterie.
 *
 * `collapsible` est volontairement absent. Refermer le dernier pilier ouvert
 * laisserait la colonne du visuel sans rien à montrer. Il y a toujours un
 * pilier ouvert.
 */
export function OffreAccordeon({
  nom,
  maquette = false,
  surtitre,
  texte,
  piliers,
  action,
  href,
  visuelInverse = false,
}: {
  nom: string;
  /** Remplace l'emplacement du visuel quand une maquette tient lieu d'image. */
  maquette?: boolean;
  /** Le bandeau au-dessus du titre. Absent sur les offres qui n'en ont pas. */
  surtitre?: { texte: string; portrait?: string };
  texte: string;
  piliers: readonly Pilier[];
  action: string;
  href: string;
  /** Renvoie le visuel de l'autre côté, pour alterner d'une offre à l'autre. */
  visuelInverse?: boolean;
}) {
  const [ouvert, setOuvert] = useState(piliers[0]?.id ?? "");
  /* Deux sources de pause, et deux états distincts.

     Un seul booléen partagé se contredirait : sortir la souris d'une section
     où le focus est resté sur un déclencheur relancerait le défilement sous
     les doigts de quelqu'un qui navigue au clavier. Chaque source éteint la
     sienne, et la pause tient tant que l'une des deux dure. */
  const [survole, setSurvole] = useState(false);
  const [focalise, setFocalise] = useState(false);
  const enPause = survole || focalise;
  const mouvementReduit = useMouvementReduit();

  const pilierOuvert = piliers.find((pilier) => pilier.id === ouvert);
  const anime = !mouvementReduit && piliers.length > 1;

  /* L'avance automatique.
     
     Elle se remet à zéro à chaque changement de `ouvert`, y compris quand c'est
     un clic qui l'a changé : la minuterie repart donc du début après une
     intervention, au lieu de couper la lecture au bout du temps qui restait. */
  useEffect(() => {
    if (!anime || enPause) return;

    const minuterie = setTimeout(() => {
      const rang = piliers.findIndex((pilier) => pilier.id === ouvert);
      setOuvert(piliers[(rang + 1) % piliers.length]!.id);
    }, DUREE_PILIER);

    return () => clearTimeout(minuterie);
  }, [anime, enPause, ouvert, piliers]);

  return (
    <div
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      /* Le défilement s'arrête dès qu'on s'intéresse à la section : au survol,
         et au clavier dès qu'un élément y prend le focus. Sans cette seconde
         condition, la minuterie déplacerait le contenu sous les doigts de
         quelqu'un qui navigue à la tabulation. */
      onMouseEnter={() => setSurvole(true)}
      onMouseLeave={() => setSurvole(false)}
      onFocusCapture={() => setFocalise(true)}
      onBlurCapture={() => setFocalise(false)}
    >
      {/* Le visuel.

          `lg:order-last` inverse les colonnes sans toucher à l'ordre du DOM :
          sur téléphone comme au clavier, le titre est lu avant l'image, quel
          que soit le côté où elle s'affiche.

          La `key` porte l'identifiant du pilier : elle force React à remplacer
          le nœud au lieu de le mettre à jour, ce qui rejoue l'animation
          d'entrée. Sans elle, l'image changerait de source sans un fondu. */}
      <div
        className={cn(
          // La réserve du bas laisse dépasser le téléphone de la maquette.
          maquette && "pl-[5%] pb-[9%]",
          visuelInverse && "lg:order-last",
        )}
      >
        <div
          key={maquette ? "maquette" : pilierOuvert?.id}
          className={maquette ? undefined : "animate-in fade-in duration-500"}
        >
          {maquette ? (
            /* La maquette ne change pas d'un pilier à l'autre : elle montre la
               plateforme, pas le pilier. Elle est donc hors de la `key` qui
               rejoue le fondu, sinon elle clignoterait à chaque changement
               pour se redessiner à l'identique.

               Le `pb` laisse la place au téléphone, qui déborde du cadre. */
            <MaquetteEspaceMembre />
          ) : pilierOuvert?.visuel ? (
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={pilierOuvert.visuel.large}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pilierOuvert.visuel.mobile}
                alt={pilierOuvert.visuel.alt}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="w-full rounded-md border border-border"
              />
            </picture>
          ) : (
            // Le rapport 4/3 tient la place que prendra l'image : sans lui, la
            // page se réorganiserait le jour où elle arrive.
            <Emplacement
              attendu={`le visuel de « ${pilierOuvert?.titre ?? nom} », en deux fichiers, un par largeur.`}
              className="aspect-[4/3]"
            />
          )}
        </div>
      </div>

      <div>
        {/* Le surtitre.

            L'`Avatar` vient du registre shadcn. Il est employé ici pour une
            raison précise : il affiche ses initiales tant que l'image ne
            répond pas. Le portrait n'existe pas encore dans le dépôt, et un
            `img` nu montrerait une vignette cassée en attendant.

            Le rond est la seule exception au rayon de 5 px que la règle du
            projet autorise, et c'est exactement son cas : une photo de profil.

            La photo est décorative, le nom est déjà dans le texte à côté :
            `alt` vide, assumé, pour ne pas faire annoncer deux fois « Rémy ». */}
        {surtitre && (
          <div className="mb-4 flex items-center gap-2.5">
            <Avatar className="size-7">
              {surtitre.portrait && (
                <AvatarImage src={surtitre.portrait} alt="" />
              )}
              <AvatarFallback className="text-[0.625rem] font-semibold">
                RJ
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">
              {surtitre.texte}
            </span>
          </div>
        )}

        <h2 className="titre text-3xl text-balance text-foreground sm:text-4xl">
          {nom}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
          {texte}
        </p>

        {piliers.length > 0 ? (
          <Accordion
            type="single"
            value={ouvert}
            onValueChange={(valeur) => valeur && setOuvert(valeur)}
            className="mt-8"
          >
            {piliers.map((pilier) => {
              const actif = pilier.id === ouvert;

              return (
                <AccordionItem
                  key={pilier.id}
                  value={pilier.id}
                  /* La barre remplace la bordure du bas sur le pilier ouvert :
                     les deux au même endroit feraient un double filet. */
                  className={actif ? "border-b-0" : undefined}
                >
                  <AccordionTrigger className="text-base font-semibold text-foreground">
                    {pilier.titre}
                  </AccordionTrigger>

                  <AccordionContent className="text-base leading-relaxed text-pretty text-muted-foreground">
                    {pilier.texte}
                  </AccordionContent>

                  {/* La barre de progression.

                      Elle n'existe que sous le pilier ouvert, et seulement si
                      le défilement automatique tourne : afficher une barre
                      figée sous mouvement réduit annoncerait une minuterie qui
                      n'existe pas.

                      `aria-hidden` parce qu'elle ne dit rien qu'un lecteur
                      d'écran ait besoin d'entendre : le pilier ouvert est déjà
                      annoncé par l'accordéon lui-même.

                      La `key` la rejoue à chaque changement de pilier, et
                      `animationPlayState` la fige au survol, en même temps que
                      la minuterie. Les deux doivent s'arrêter ensemble, sinon
                      la barre ment sur le temps qui reste. */}
                  {actif && anime && (
                    <div
                      aria-hidden
                      className="h-px w-full overflow-hidden bg-border"
                    >
                      <div
                        key={pilier.id}
                        className="h-full w-full origin-left bg-foreground"
                        style={{
                          animation: `barre-de-progression ${DUREE_PILIER}ms linear forwards`,
                          animationPlayState: enPause ? "paused" : "running",
                        }}
                      />
                    </div>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Emplacement
            attendu="les piliers de cette offre, un titre et un paragraphe chacun, écrits par Rémy."
            className="mt-8"
          />
        )}

        <div className="mt-8">
          <BoutonScintillant href={href}>
            {action}
            <ArrowRight className="size-4" />
          </BoutonScintillant>
        </div>
      </div>
    </div>
  );
}
