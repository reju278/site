"use client";

import { tachesImmersion } from "@/contenu/immersion";
import { cn } from "@repo/ui/lib/utils";
import { Check, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Les trois tâches de la page, à cocher, posées en bas de l'écran.
 *
 * Sur demande de Rémy : une pilule fixe en bas de l'écran, qui ouvre la liste
 * d'un seul bloc, et une progression qui survit à la visite.
 *
 * **Ce n'est pas `Gelule`, et c'est une correction.** La première version
 * reprenait les gélules du hero, verre, filet et lumière qui en fait le tour.
 * Rémy a tranché : « pas des trucs qui clignotent, une vraie checklist ». Une
 * lumière qui tourne dit « regarde-moi » ; une liste de tâches dit « il te reste
 * ça à faire », et les deux ne peuvent pas être le même objet. Le verre, lui,
 * est repris au caractère près de `sur="voile"` : `bg-card/85`, son flou, son
 * filet.
 *
 * **C'est la sixième exception à « le flou va derrière, jamais devant »**, et
 * elle se décide plutôt qu'elle ne se constate : Rémy l'a demandée
 * explicitement. Elle se justifie comme les capsules de l'en-tête : un objet qui
 * flotte au-dessus d'un contenu dont on ne sait rien a besoin du verre pour
 * tenir. Elle est écrite dans `AGENTS.md`.
 *
 * **La même mise en page aux deux largeurs**, après deux corrections. Il y a eu
 * un rang de trois pilules sur ordinateur, puis trois cases étroites, avant que
 * Rémy demande le panneau dépliant des deux côtés. Un rang qui traverse un grand
 * écran se lit comme une barre d'outils ; un panneau qu'on ouvre se lit comme
 * une liste, et c'est une liste.
 *
 * **Cochée, la pilule devient verte et la case laisse la place à un V blanc.**
 * Pas de texte barré, sur sa demande : une tâche faite n'est pas une tâche
 * annulée.
 *
 * **Le vert du fond est celui que Rémy a donné**, #11b981, dans
 * `--tache-faite`. Le blanc n'y tient que 2,56:1, sous les seuils du dépôt, et
 * c'est écrit à côté du jeton : il a tranché en connaissant la mesure.
 *
 * **La progression vit dans le navigateur du visiteur**, `localStorage`, parce
 * que le site n'a ni base ni compte. Trois précautions qui n'en sont pas :
 *
 * - **Tout est enveloppé de `try`/`catch`.** En navigation privée, avec les
 *   données de site bloquées ou effacées, l'accès lui-même lève.
 * - **On ne lit rien au premier rendu.** Le serveur ne connaît pas ce stockage :
 *   rendre les cases cochées dès le départ ferait diverger les deux HTML et
 *   casserait l'hydratation. La liste apparaît décochée une image, puis se
 *   remplit.
 * - **Une tâche disparue est ignorée.** On ne garde que les identifiants connus,
 *   pour qu'un vieil enregistrement ne ressuscite pas une tâche retirée.
 *
 * Ce stockage est **fonctionnel et non traçant** : il ne quitte pas l'appareil,
 * ne dit rien de la personne et ne sert qu'à lui rendre son propre écran.
 *
 * **La barre s'efface quand une fenêtre d'entretien est ouverte**, par la règle
 * de `globals.css` qui le faisait déjà pour la barre d'appel : le bouton
 * « Fermer » de la fenêtre est en bas de l'écran, exactement là où ces pilules
 * se posent.
 */

const CLE = "immersion-taches";

/* Le verre, repris de `Gelule` en `sur="voile"`, au caractère près. */
const VERRE = "border border-border bg-card/85 backdrop-blur-md";

export function TachesImmersion() {
  const [faites, setFaites] = useState<readonly string[]>([]);
  const [ouverte, setOuverte] = useState(false);

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE);
      if (!brut) return;
      const lues: unknown = JSON.parse(brut);
      if (!Array.isArray(lues)) return;
      setFaites(
        tachesImmersion
          .map((t) => t.id)
          .filter((id) => (lues as unknown[]).includes(id)),
      );
    } catch {
      /* Pas de stockage : la liste marche, elle ne se souvient pas. */
    }
  }, []);

  const basculer = (id: string) => {
    setFaites((avant) => {
      const apres = avant.includes(id)
        ? avant.filter((x) => x !== id)
        : [...avant, id];
      try {
        window.localStorage.setItem(CLE, JSON.stringify(apres));
      } catch {
        /* Rien à faire : la coche vaut pour cette visite. */
      }
      return apres;
    });
  };

  return (
    <div
      data-taches
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 sm:bottom-5"
    >
      {/* **Une seule mise en page pour les deux largeurs**, et c'est une
          correction. Il y avait un rang de trois pilules sur ordinateur et un
          panneau dépliant sur téléphone ; Rémy a demandé le panneau des deux
          côtés. Deux dessins pour la même chose, c'était aussi deux réglages à
          tenir d'accord, et le rang s'étalait sur presque toute la largeur d'un
          grand écran, ce qui en faisait une barre d'outils plutôt qu'une liste.

          Le panneau monte plutôt qu'il ne descend : il n'y a rien sous une
          barre posée en bas d'écran. */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {ouverte ? (
          /* **Un seul bloc et non trois pilules empilées**, sur sa demande :
             « d'un seul bloc, séparé par une ligne ». C'est le panneau des
             menus de l'en-tête, même verre et même rayon de 16 px, et c'est ce
             qui le fait lire comme une liste plutôt que comme trois objets
             posés les uns sur les autres.

             `overflow-hidden` n'est pas décoratif : une ligne cochée porte un
             fond plein, et sans rognage ses angles dépasseraient du panneau.

             `divide-y` plutôt qu'une bordure par ligne : le filet ne se pose
             qu'entre deux lignes, donc ni au-dessus de la première ni sous la
             dernière, où il doublerait le bord du panneau. */
          <ul
            className={cn(
              VERRE,
              "w-full max-w-xs divide-y divide-border overflow-hidden rounded-[16px] sm:max-w-sm",
            )}
          >
            {tachesImmersion.map((tache) => (
              <li key={tache.id} className="flex">
                <Tache
                  texte={tache.texte}
                  ancre={tache.ancre}
                  faite={faites.includes(tache.id)}
                  onClick={() => basculer(tache.id)}
                  onVoir={() => setOuverte(false)}
                  className="w-full"
                />
              </li>
            ))}
          </ul>
        ) : null}

        <button
          type="button"
          onClick={() => setOuverte((o) => !o)}
          aria-expanded={ouverte}
          className={cn(
            VERRE,
            "inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-3 text-sm font-semibold text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <ChevronUp
            aria-hidden
            className={cn(
              "size-4 shrink-0 transition-transform duration-300",
              ouverte && "rotate-180",
            )}
          />
          {/* Le libellé est de Rémy, à sa troisième formulation : « 1 sur 3 »,
              qui disait où on en est, puis « Liste des tâches à remplir », qui
              nommait l'objet, puis celui-ci, qui dit à quoi ça sert. */}
          À regarder avant votre rendez-vous
        </button>
      </div>

    </div>
  );
}

/**
 * Une tâche.
 *
 * **`aria-pressed` et non `role="checkbox"`** : c'est un bouton qui bascule, et
 * un lecteur d'écran annonce alors « activé » ou « non activé » sans qu'on ait à
 * simuler une case à la main.
 *
 * **La case et le V occupent la même place**, donc la ligne ne change pas de
 * hauteur quand on coche.
 *
 * **La coche n'est pas le seul signe.** Le fond change en même temps, et la case
 * vide devient une coche pleine : quelqu'un qui distingue mal le vert lit quand
 * même la différence.
 *
 * **La ligne n'est pas un bouton, elle en contient un.** La case se coche, le
 * lien « Voir » navigue, et ce sont deux gestes différents : les fondre dans un
 * seul élément cliquable obligerait à deviner lequel on voulait.
 */
function Tache({
  texte,
  ancre,
  faite,
  onClick,
  onVoir,
  className,
}: {
  texte: string;
  ancre: string;
  faite: boolean;
  onClick: () => void;
  onVoir: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 pr-2 transition-colors duration-300",
        faite ? "bg-[var(--tache-faite)] text-white" : "text-foreground",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={faite}
        className={cn(
          "flex min-w-0 flex-1 items-start gap-2.5 px-3.5 py-3 text-left text-xs leading-snug font-medium",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mt-px grid size-[18px] shrink-0 place-items-center rounded-[5px]",
            faite ? "bg-white/20" : "border-2 border-foreground/25",
          )}
        >
          {faite ? (
            /* `scale` et non `transform` : Tailwind v4 pose les échelles sur la
               propriété `scale`. La coche arrive donc en grossissant, avec un
               ressort court : c'est une action qu'on vient de faire, et le
               geste doit se sentir. */
            <Check className="size-3.5 animate-[apparait-coche_320ms_cubic-bezier(0.34,1.56,0.64,1)_both] text-white" />
          ) : null}
        </span>

        <span>{texte}</span>
      </button>

      {/* **Un lien et non un bouton** : ça navigue, donc le clic du milieu,
          l'ouverture dans un onglet et le survol qui montre la destination
          doivent marcher. C'est la règle du dépôt, et c'est aussi ce qui
          interdit de le loger *dans* le bouton de la case : un lien à
          l'intérieur d'un bouton est du HTML invalide, et les deux se
          disputeraient le clic.

          L'ancre désigne une section de cette page : ce n'est pas une sortie de
          tunnel.

          **Le panneau se referme au clic**, sinon il recouvrirait justement ce
          qu'on vient de demander à voir. */}
      <a
        href={`#${ancre}`}
        onClick={onVoir}
        className={cn(
          "shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          faite
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-accent text-foreground hover:bg-foreground/10",
        )}
      >
        Voir
      </a>
    </div>
  );
}
