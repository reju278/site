import { ContenuEntretien } from "@/components/contenu-entretien";
import { ModaleAvis } from "@/components/modale-avis";
import { TexteRoulant } from "@/components/texte-roulant";
import { avisDe } from "@/contenu/avis";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";
import { sansNoms } from "@/lib/anonymat";
import { temoignages } from "@/contenu/site";
import { prenom } from "@/lib/prenom";
import { insecables } from "@/lib/typographie";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";


/**
 * La durée d'un entretien, en minutes et secondes.
 *
 * Elle répond à la question qu'on se pose avant de cliquer : combien de temps
 * ça prend. Reprise du sommaire du hub.
 */
function dureeLisible(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * La galerie des entretiens : les cartes de `/resultats`, mais qui ouvrent
 * l'entretien dans une fenêtre au lieu de mener à une page.
 *
 * **C'est la demande de Rémy, mot pour mot : « exactement la même chose que ce
 * qu'on avait fait, mais adapté avec cette vue pop-up ».** La carte est celle du
 * sommaire des résultats, au détail près : affiche en 16/9, prénom, accroche, et
 * un libellé qui roule au survol. Ce qui change est ce qu'elle fait.
 *
 * **Le corps de l'article n'est pas réécrit**, il vient d'`ArticleAvis`, le même
 * composant que sert `/resultats/<nom>`. Les surlignages, les citations et les
 * liens en contexte sont donc les mêmes objets, pas des copies.
 *
 * **Les liens de l'article passent par `versImmersion`.** Un article qui renvoie
 * à l'entretien d'une autre personne présente sur la page renvoie à l'ancre de
 * son lecteur ; tout le reste est déshabillé. On n'ouvre pas une porte de sortie
 * au milieu d'un tunnel.
 *
 * **Pas de transcription dans la fenêtre**, et c'est un choix. Sur une page
 * interdite d'index, mille mots de parole non relue n'apportent aucun
 * référencement ; quatorze transcriptions pèsent trois cent vingt-huit
 * kilooctets dans `avis.ts`, qui partiraient toutes dans la charge utile pour
 * être lues par presque personne. C'est déjà la règle du hub, dans `AGENTS.md`.
 * Elles restent sur `/resultats/<nom>`, où elles font leur travail.
 *
 * **Un seul lecteur Wistia peut exister à la fois** : Radix ne monte le contenu
 * d'une fenêtre que lorsqu'elle est ouverte, et le démonte à la fermeture, ce
 * qui coupe le son au passage. La page source chargeait ses dix-neuf lecteurs
 * d'avance.
 */
export function GalerieEntretiens() {
  return (
    <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
      {entretiensImmersion.map((id) => {
        /* Le prénom, l'accroche, la durée et l'affiche sont lus dans
           `temoignages` et `avis.ts`, jamais réécrits ici. Un entretien retiré
           de là disparaît d'ici sans laisser de carte vide. */
        const temoignage = temoignages.find((t) => t.id === id);
        const article = avisDe(id);
        if (!temoignage || !article) return null;

        const nom = prenom(temoignage.nom);

        return (
          <li key={id} id={ancreEntretien(id)} className="scroll-mt-24">
            <ModaleAvis
              titre={`Entretien avec ${nom}`}
              description={sansNoms(article.chapo)}
              declencheur={
                /* Un `button` et non un lien : ça n'emmène nulle part, ça ouvre
                   une fenêtre. C'est la règle du projet, et c'est aussi ce qui
                   donne le bon rôle à un lecteur d'écran. `text-left` parce
                   qu'un bouton centre son texte par défaut. */
                <button
                  type="button"
                  /* **Au survol, la carte se soulève, elle ne se cerne pas.**
                     Le motif du site colore la bordure en `ring` ; Rémy ne veut
                     pas de ce cadre coloré ici. Une ombre portée et deux pixels
                     de montée disent la même chose sans dessiner de trait : la
                     carte répond au clic qu'on s'apprête à faire.

                     L'ombre est de la famille de celles du projet, très diffuse
                     et décalée vers le bas, donc lue comme de la profondeur et
                     non comme un contour. Elle est **portée** et ne se dispute
                     pas la place du relief de verre, qui est intérieur.

                     La translation est verticale : elle n'élargit pas la boîte,
                     donc rien à couper, contrairement à ce que la règle du
                     dépôt impose aux rotations.

                     **La propriété animée est `translate` et non `transform`.**
                     Tailwind v4 pose les translations sur la propriété
                     `translate` du CSS, pas sur `transform` : écrite
                     `transition-[transform,…]`, la montée se produisait d'un
                     coup, sans transition, et `getComputedStyle` rendait
                     `transform: none`. Mesuré, pas supposé.

                     On n'anime pas tout : au survol, la couleur de fond de la
                     pilule change aussi, et `transition-all` ferait traîner ce
                     qui doit être net. */
                  className="relief-verre group/carte group/roule flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-card text-left transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {/* L'affiche, **recadrée sur la bande d'image réelle**.

                      Les entretiens sont des appels à deux, et l'enregistrement
                      porte ses propres bandes noires : en 16/9, la moitié de la
                      vignette était du noir, et la carte avait l'air cassée
                      plutôt que sobre. C'est le défaut que Rémy a signalé, et
                      c'est la même réparation que sur le sommaire du hub.

                      **Le rapport est mesuré, pas choisi.** Les affiches ont été
                      relevées en lisant leur luminance ligne par ligne : le
                      contenu occupe les lignes 90 à 269 d'une image de 360,
                      c'est-à-dire la moitié centrale au pixel près. 640 sur 180
                      donne 32/9, seule valeur qui les découvre sans laisser de
                      noir.

                      L'image avance légèrement au survol de la carte : c'est ce
                      qui la fait répondre au clic qu'on s'apprête à faire. */}
                  <span className="relative block aspect-32/9 overflow-hidden bg-black">
                    {/* **Servie par `next/image` et non en `img` brute.**

                        Les vingt-deux affiches pesaient 756 Ko à elles seules,
                        le premier poste de la page, parce qu'une `img` simple
                        sert le fichier tel quel : 640 px de large pour une
                        carte qui en fait 440, en JPEG là où le navigateur
                        accepte de l'AVIF.

                        `fill` et non une largeur : le cadre porte déjà le
                        rapport 32/9, et c'est lui qui décide. `sizes` dit la
                        largeur réelle d'une carte, sans quoi Next sert la plus
                        grande variante par précaution. */}
                    <Image
                      src={`/temoignages/${id}.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 440px, 100vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover/carte:scale-[1.03]"
                    />

                    {/* La durée, en bas à droite.

                        **Elle dit que c'est une vidéo**, ce que la carte ne
                        disait nulle part, et surtout combien de temps ça prend,
                        qui est la question qu'on se pose avant de cliquer.

                        Fond noir à 70 % et non un jeton de thème : il se pose
                        sur une photographie, dont on ne sait pas si elle est
                        claire ou sombre à cet endroit. Au pire cas, image
                        entièrement blanche dessous, le blanc y tient 8,6:1. */}
                    <span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-white tabular-nums">
                      <Play aria-hidden className="size-2.5 fill-current" />
                      {dureeLisible(temoignage.secondes)}
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-5">
                    <span className="block text-base font-semibold text-card-foreground">
                      {nom}
                    </span>
                    <span className="mt-1 block text-sm text-pretty text-muted-foreground">
                      {insecables(temoignage.description)}
                    </span>

                    {/* L'action, **en pilule**, sur demande de Rémy : le libellé
                        bleu d'avant ne se distinguait pas d'une phrase et ne
                        mettait rien en valeur.

                        Elle ne prend pas toute la largeur, contrairement à la
                        barre du hub : une pilule se lit comme un objet posé là,
                        une barre pleine comme un second bouton, et la carte
                        entière est déjà cliquable.

                        `rounded-full` est ici légitime : la règle des 5 px parle
                        d'angles arrondis, et une pilule n'a pas d'angle. C'est
                        la forme des gélules du hero, déjà dans la page.

                        **L'espace au-dessus est un `pt-5` et non un `mt-*`** :
                        `mt-auto` pousse le bloc au bas de la carte, et une marge
                        haute entrerait en conflit avec lui.

                        `min-h-9` et non `h-9` : un libellé qui passerait à deux
                        lignes serait rogné par une hauteur fixe. */}
                    <span className="mt-auto pt-5">
                      <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-foreground transition-colors group-hover/carte:bg-primary group-hover/carte:text-primary-foreground">
                        <TexteRoulant>Voir son entretien</TexteRoulant>
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 transition-transform group-hover/carte:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </span>
                </button>
              }
            >
              {/* Le contenu, partagé avec les cartes du hero. */}
              <ContenuEntretien id={id} />
            </ModaleAvis>
          </li>
        );
      })}
    </ul>
  );
}
