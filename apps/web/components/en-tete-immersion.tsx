"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { LogoFunnels } from "@/components/logo-funnels";
import { ancresImmersion } from "@/contenu/immersion";
import { HAUTEUR_ENTETE } from "@/lib/entete";
import { cn } from "@repo/ui/lib/utils";
import { useLayoutEffect, useState } from "react";

/**
 * L'en-tête de la page d'immersion : deux capsules, et aucune sortie.
 *
 * C'est l'en-tête du hub, sur demande de Rémy, qui veut la même chose que son
 * modèle. Comme lui, `/immersion` est un tunnel et non une page du site : le
 * nom ne ramène donc pas à l'accueil, qui serait une sortie, il ramène en haut
 * de la page.
 *
 * **L'habillage suit la page, jamais le défilement**, et c'est ce qui faisait
 * défaut à la première version de ce fichier. La page pose maintenant une
 * photographie sombre sous l'en-tête : sans observation, les capsules
 * restaient en verre de page, c'est-à-dire presque blanches sur une image
 * sombre, et leur texte en encre de thème. On observe donc le repère que le
 * hero déclare, `data-bande-sombre`, et une page qui n'en pose pas démarre et
 * reste en habillage de page, ce qui est le défaut sûr.
 *
 * Un seuil en pixels comparé à `scrollY` aurait décrit cette page-là et rien
 * d'autre : c'est la panne que le hub a déjà connue, et elle est écrite dans
 * `AGENTS.md`.
 *
 * `useLayoutEffect` et non `useEffect` : la mesure a lieu avant la peinture,
 * donc sans un éclair d'habillage clair sur l'image au chargement.
 *
 * **La capsule de droite porte les quatre ancres et non un menu déroulant.**
 * C'est la seule différence avec le hub, et elle vient de la page source : son
 * menu est fait de renvois vers des sections de la même page. Un panneau
 * déroulant pour quatre liens internes ajouterait un geste pour atteindre ce
 * qui est déjà sur la page.
 *
 * **Les classes des capsules sont reprises et non importées.** Elles vivent
 * dans `en-tete.tsx`, qui porte `"use client"` et n'en exporte rien, et
 * `en-tete-hub.tsx` les a déjà recopiées pour la même raison. Le verre des
 * capsules vit donc à trois endroits, et c'est écrit ici comme là-bas : le jour
 * où il change, il change aux trois.
 */

/* Repris de `CAPSULE_BASE` dans `en-tete.tsx`, via `en-tete-hub.tsx`. Le rayon
   de 12 px et le flou sont la première exception du projet à « le flou va
   derrière, jamais devant » : voir `AGENTS.md`. */
const CAPSULE_BASE =
  "flex items-center gap-2 rounded-[12px] p-1.25 pr-1.5 transition-all duration-300 backdrop-blur-md ring-1 ring-inset";

/* Au-dessus d'une image sombre : le verre blanc de passionfroot. C'est le seul
   endroit où un blanc en dur est justifié, le fond n'étant pas un jeton de
   thème mais une photographie, sombre dans les deux thèmes. */
const CAPSULE_SUR_IMAGE =
  "bg-gradient-to-b from-white/10 to-white/5 ring-white/7 shadow-[0_1px_1px_rgba(255,255,255,0.04)_inset,0_2px_8px_rgba(0,0,0,0.10)]";

const CAPSULE_SUR_PAGE =
  "bg-card/85 ring-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

/* Repris de `CLASSES_ENTREE` et `CLASSES_ENTREE_SUR_PAGE`. */
const ENTREE_BASE =
  "flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const ENTREE_SUR_IMAGE =
  "text-white/80 hover:bg-white/15 hover:text-white focus:bg-white/15";

const ENTREE_SUR_PAGE =
  "text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent";

export function EnTeteImmersion() {
  const [surImage, setSurImage] = useState(false);

  useLayoutEffect(() => {
    const bande = document.querySelector("[data-bande-sombre]");
    if (!bande) {
      setSurImage(false);
      return;
    }

    const observateur = new IntersectionObserver(
      ([entree]) => setSurImage(entree?.isIntersecting ?? false),
      { rootMargin: `-${HAUTEUR_ENTETE}px 0px 0px 0px`, threshold: 0 },
    );
    observateur.observe(bande);
    return () => observateur.disconnect();
  }, []);

  const capsule = cn(
    CAPSULE_BASE,
    surImage ? CAPSULE_SUR_IMAGE : CAPSULE_SUR_PAGE,
  );
  const entree = cn(
    ENTREE_BASE,
    surImage ? ENTREE_SUR_IMAGE : ENTREE_SUR_PAGE,
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        {/* La marque est Funnels.Club et non Rémy Jupille, comme sur le hub :
            c'est la porte d'entrée d'un programme, pas la vitrine de la
            personne. Et sans italique : un nom de marque se pose droit, là où
            le logo du site reprend un mot penché du hero. `titre` garde donc la
            fonte, `titre-fort` saute, puisque c'est lui qui portait
            `font-style: italic`.

            `whitespace-nowrap` : sans lui, la capsule casserait le nom en deux
            sur un écran étroit.

            `href="#haut"` et non `/` : l'accueil du site serait une sortie. */}
        <div className={capsule}>
          <div className="flex h-9 items-center justify-center px-2">
            <a
              href="#haut"
              className={cn(
                "titre flex items-center gap-2 text-lg tracking-tight whitespace-nowrap transition-colors duration-300",
                surImage ? "text-white" : "text-foreground",
              )}
            >
              <LogoFunnels className="size-[1.05em]" />
              Funnels.Club
            </a>
          </div>
        </div>

        <div className={capsule}>
          {/* Les quatre ancres sont cachées sous `sm`, où elles occuperaient
              toute la largeur : à 375 px, les deux capsules et la bascule de
              thème prennent déjà presque les 375 pixels. C'est la même mesure
              qui a fait nommer « Menu » le déclencheur du hub. La page reste
              parcourable en défilant, et c'est ce que fait quelqu'un sur un
              téléphone. */}
          <nav
            aria-label="Les sections de la page"
            className="hidden items-center gap-1 sm:flex"
          >
            {ancresImmersion.map((ancre) => (
              <a key={ancre.id} href={`#${ancre.id}`} className={entree}>
                {ancre.libelle}
              </a>
            ))}
          </nav>

          <BasculeTheme surImage={surImage} />
        </div>
      </div>
    </header>
  );
}
