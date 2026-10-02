"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { LogoFunnels } from "@/components/logo-funnels";
import { TexteRoulant } from "@/components/texte-roulant";
import { ancresImmersion } from "@/contenu/immersion";
import { HAUTEUR_ENTETE } from "@/lib/entete";
import { cn } from "@repo/ui/lib/utils";
import { Menu, X } from "lucide-react";
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

export function EnTeteImmersion({
  ancres = ancresImmersion,
  bascule = true,
  className,
}: {
  /**
   * La bascule de thème. Retirée sur `/appel`, dont le thème est forcé au
   * clair : voir `FournisseurTheme`.
   */
  bascule?: boolean;
  /**
   * Pour descendre la capsule sous une bande fixe, sur `/preparation`. Les
   * classes `top-*` passées ici remplacent celles du composant.
   */
  className?: string;
  /**
   * Les sections de la page que la capsule désigne. Celles d'`/immersion` par
   * défaut ; `/preparation` passe les siennes, qui sont moins nombreuses.
   * **Chaque entrée doit désigner une section qui existe sur la page qui
   * l'affiche** : une ancre vers une section absente est une cible qui ne mène
   * nulle part. **Une liste vide ne laisse que la marque et la bascule de
   * thème**, sans menu de téléphone : c'est l'en-tête d'`/appel`.
   */
  ancres?: readonly { id: string; libelle: string }[];
} = {}) {
  const [surImage, setSurImage] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const avecAncres = ancres.length > 0;

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
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5",
        className,
      )}
    >
      {/* **Une seule capsule, centrée**, sur demande de Rémy : le nom, les
          ancres et la bascule de thème sont fusionnés. Elles étaient deux,
          poussées aux deux bords par un `justify-between`.

          Ce n'est pas qu'une affaire de goût : depuis que le hero fait une
          hauteur d'écran, l'en-tête flotte au-dessus d'un paysage, et deux
          objets aux coins opposés découpaient l'image en trois. Un bloc unique
          au milieu se lit comme un objet posé sur la photographie.

          Le `max-w` tombe donc, la capsule se dimensionne sur son contenu. */}
      <div className="pointer-events-auto flex items-center justify-center">
        {/* La marque est Funnels.Club et non Rémy Jupille, comme sur le hub :
            c'est la porte d'entrée d'un programme, pas la vitrine de la
            personne. Et sans italique : un nom de marque se pose droit, là où
            le logo du site reprend un mot penché du hero. `titre` garde donc la
            fonte, `titre-fort` saute, puisque c'est lui qui portait
            `font-style: italic`.

            `whitespace-nowrap` : sans lui, la capsule casserait le nom en deux
            sur un écran étroit.

            `href="#haut"` et non `/` : l'accueil du site serait une sortie. */}
        <div className={cn(capsule, "flex-col items-stretch gap-0")}>
          <div className="flex items-center gap-2">
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

          {/* **Les ancres sont toujours là**, sur demande de Rémy. Elles se
              dépliaient au survol de la capsule ; il a préféré les voir. Ce
              qui tombe avec le repli : le `group`, la grille qui s'animait de
              `0fr` à `1fr`, le décalage d'apparition et la compensation
              d'espacement, qui n'existaient que pour lui.

              Elles restent cachées sous `sm`, où elles occuperaient toute la
              largeur : à 375 px, la capsule et la bascule de thème prennent
              déjà presque les 375 pixels. C'est le bouton juste à côté qui les
              ouvre là-bas. */}
          {avecAncres && (
          <nav
            aria-label="Les sections de la page"
            className="hidden items-center gap-1 sm:flex"
          >
            {/* **Le libellé roule au survol**, sur demande de Rémy : le même
                effet que les liens du pied de page et le bouton du mur. Il
                demande `group/roule` sur ce qui porte le survol, faute de quoi
                il ne se déclenche que sur les lettres et non sur l'entrée
                entière, rembourrage compris. */}
            {ancres.map((ancre) => (
              <a
                key={ancre.id}
                href={`#${ancre.id}`}
                className={cn(entree, "group/roule")}
              >
                <TexteRoulant>{ancre.libelle}</TexteRoulant>
              </a>
            ))}
          </nav>
          )}

          {bascule && <BasculeTheme surImage={surImage} />}

          {/* **Le déclencheur du menu, à droite de la bascule de thème**, sur
              demande de Rémy, et sur téléphone seulement : au-dessus de `sm`,
              les quatre ancres sont déjà dans la rangée et un bouton pour les
              ouvrir n'aurait rien à ouvrir.

              `size-10 sm:size-9`, exactement comme la bascule : 40 px au doigt,
              36 px à la souris. La règle du dépôt sur les cibles tactiles vaut
              pour celui-ci comme pour l'autre, et les deux voisins doivent de
              toute façon avoir la même taille.

              Une icône seule porte son `aria-label`, et `aria-expanded` dit
              l'état : sans lui, un lecteur d'écran annonce un bouton sans
              jamais dire qu'il vient d'ouvrir quelque chose. */}
          {avecAncres && (
          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            aria-controls="menu-immersion"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            className={cn(
              "flex size-10 items-center justify-center rounded-md transition-colors duration-300 sm:hidden",
              surImage
                ? "text-white hover:bg-white/15"
                : "text-foreground hover:bg-accent",
            )}
          >
            {ouvert ? (
              <X aria-hidden className="size-4" />
            ) : (
              <Menu aria-hidden className="size-4" />
            )}
          </button>
          )}
          </div>

          {/* Le panneau qui pousse la capsule vers le bas.

              **La hauteur s'anime de `0fr` à `1fr`**, et non d'un `max-height`
              choisi au jugé. Une grille d'une seule rangée mesure son contenu
              toute seule : la capsule s'ouvre donc exactement à la hauteur des
              quatre ancres, et resterait juste si on en ajoutait une
              cinquième. Un `max-height` trop court couperait la dernière, trop
              grand ferait traîner la fin de l'animation dans le vide.

              C'est le rognage qui vit dans l'enfant : une grille ne peut pas
              couper son propre contenu.

              **`inert` quand c'est fermé**, et ce n'est pas une politesse : le
              panneau reste dans le DOM à hauteur nulle, donc ses quatre liens
              restent atteignables à la tabulation. On tabulerait dans un menu
              invisible. C'est exactement la panne que `AGENTS.md` décrit pour
              le mur de la communauté, et elle se répare pareil. Il règle au
              passage le doublon de repère : les deux `nav` porteraient sinon le
              même nom.

              **La propriété animée est `translate` et non `transform`.**
              Tailwind v4 pose les translations sur `translate` : écrite
              autrement, la descente se ferait d'un coup. C'est le piège que le
              dépôt a déjà rencontré sur les cartes de la galerie. */}
          {avecAncres && (
          <div
            id="menu-immersion"
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:hidden",
              ouvert ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden" inert={!ouvert}>
              <nav
                aria-label="Les sections de la page"
                className="flex flex-col gap-1 pt-2"
              >
                {ancres.map((ancre, rang) => (
                  <a
                    key={ancre.id}
                    href={`#${ancre.id}`}
                    onClick={() => setOuvert(false)}
                    /* Les entrées tombent l'une après l'autre plutôt que
                       d'apparaître ensemble : c'est ce qui donne la goutte
                       d'eau que Rémy décrit, une rangée qui se pose au lieu
                       d'un bloc qui s'allume. Le retard ne vaut qu'à
                       l'ouverture ; à la fermeture, tout part ensemble, sinon
                       la dernière entrée s'attarderait après le repli. */
                    style={{
                      transitionDelay: ouvert ? `${120 + rang * 60}ms` : "0ms",
                    }}
                    className={cn(
                      entree,
                      "group/roule min-h-10 justify-center transition-[opacity,translate,background-color] duration-300",
                      ouvert
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-1 opacity-0",
                    )}
                  >
                    <TexteRoulant>{ancre.libelle}</TexteRoulant>
                  </a>
                ))}
              </nav>
            </div>
          </div>
          )}
        </div>
      </div>
    </header>
  );
}
