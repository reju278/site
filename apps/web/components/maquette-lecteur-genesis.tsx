"use client";

import { optinGenesis, partiesGenesis } from "@/contenu/formation-genesis";
import { cn } from "@repo/ui/lib/utils";
import {
  Captions,
  List,
  Maximize,
  Play,
  Settings,
  Volume2,
} from "lucide-react";

/** L'identifiant de la carte du formulaire, que la maquette vise au clic. */
export const ID_FORMULAIRE_GENESIS = "inscription-genesis";

/**
 * La maquette du lecteur, à gauche du formulaire de l'optin, sur demande de
 * Rémy : **une reproduction du lecteur Wistia aux couleurs du tunnel**,
 * composée comme une référence qu'il a fournie (acquisition.com) : la carte
 * du premier module au premier plan, deux autres derrière elle, à gauche et à
 * droite.
 *
 * Sur la carte, ce que montre Wistia : le grand bouton de lecture
 * rectangulaire au centre et la barre de commandes en bas (lecture, frise
 * des chapitres, sous-titres, volume, réglages, chapitres, plein écran), en
 * `--genesis-bleu` au lieu du bleu de Wistia. **Sans la durée**, sur sa
 * demande. Au-dessus de la barre, comme sur la référence, le rang du module
 * en badge et son titre, lus dans `partiesGenesis` : ils ne peuvent pas
 * diverger de l'espace membre.
 *
 * **Les angles restent à 5 px et rien n'est rond**, contrairement aux deux
 * références : les jalons des chapitres sont des traits et non des points,
 * le badge un rectangle et non une pilule. Les commandes rondes du site sont
 * une famille fermée (voir `AGENTS.md`).
 *
 * **Ce n'est pas un lecteur, et elle ne fait pas semblant d'en être un** :
 * un bouton de lecture qui ne lit rien serait un piège, surtout sur
 * téléphone, où la maquette passe au-dessus du formulaire. Toute la maquette
 * est donc un seul bouton, qui descend au formulaire et place le curseur
 * dans son premier champ. Les images sont décoratives (`alt=""`) : le nom du
 * bouton dit où il mène.
 *
 * **Les cartes de derrière ne débordent pas** : elles sont posées dans la
 * largeur de la colonne, la carte de devant rentrée de chaque côté, et le
 * bloc porte `overflow-x-clip` par prudence. Une carte qui dépasse élargit
 * la page sur téléphone (voir `AGENTS.md`, le débordement se mesure).
 */
export function MaquetteLecteurGenesis() {
  const { maquette } = optinGenesis;
  const modules = partiesGenesis.filter((p) => !p.bonus);
  const [premier, deuxieme, troisieme] = modules;

  const versFormulaire = () => {
    const carte = document.getElementById(ID_FORMULAIRE_GENESIS);
    carte?.scrollIntoView({ behavior: "smooth", block: "center" });
    carte
      ?.querySelector<HTMLInputElement>("input:not([type=checkbox])")
      ?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={versFormulaire}
      aria-label={maquette.action}
      className="group/maquette relative block w-full overflow-x-clip py-[6%] text-left"
    >
      {/* Les deux cartes de derrière, plus petites, grisées, et centrées
          sur la hauteur de celle de devant. */}
      <CarteArriere
        image={maquette.gauche}
        legende={deuxieme ? `${deuxieme.etiquette} : ${deuxieme.titre ?? ""}` : ""}
        cote="gauche"
      />
      <CarteArriere
        image={maquette.droite}
        legende={troisieme ? `${troisieme.etiquette} : ${troisieme.titre ?? ""}` : ""}
        cote="droite"
      />

      {/* La carte de devant : le lecteur. */}
      {/* Une carte-conteneur : ses textes et sa barre se mesurent en
          largeur de carte (`cqw`), pas d'écran, pour garder les
          proportions du lecteur à toutes les tailles. */}
      <div className="@container relative z-10 mx-auto w-[80%] overflow-hidden sm:w-[72%] rounded-[5px] bg-black shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-video">
          <img
            src={maquette.principale}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          {/* Le voile du bas, sous le titre, comme sur la référence. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/75 to-transparent"
          />

          {/* Le rang du module, en haut à gauche. */}
          {premier ? (
            <span
              aria-hidden
              className="absolute top-[5%] left-[3.5%] rounded-[5px] bg-[#1d1d24]/85 px-[1.6cqw] py-[0.8cqw] font-[family-name:var(--font-genesis-bouton)] text-[2.8cqw] leading-none font-bold text-white"
            >
              {premier.etiquette}
            </span>
          ) : null}

          {/* Le grand bouton de lecture de Wistia : un rectangle plein, aux
              proportions relevées sur son lecteur (environ 15 % de la
              largeur, 25 sur 16). */}
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 flex w-[15%] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[var(--genesis-bleu)] transition-[filter] group-hover/maquette:brightness-110 [aspect-ratio:25/16]"
          >
            <Play className="size-[38%] fill-white text-white" />
          </span>

          {/* Le titre du module, au-dessus de la barre. */}
          {premier ? (
            <span
              aria-hidden
              className="absolute bottom-[4%] left-[3.5%] font-[family-name:var(--font-genesis-bouton)] text-[4.4cqw] leading-tight font-bold text-white"
            >
              {premier.titre ?? premier.etiquette}
            </span>
          ) : null}
        </div>

        {/* La barre de commandes de Wistia, en bleu du tunnel. Hauteur
            relevée sur son lecteur : 7 % de la hauteur de l'image. */}
        <div
          aria-hidden
          className="flex h-[7.5cqw] items-center gap-[2.6cqw] bg-[var(--genesis-bleu)] px-[2.6cqw] text-white"
        >
          <Play className="h-[45%] w-auto shrink-0 fill-white" />
          <Frise />
          <Captions className="h-[45%] w-auto shrink-0" />
          <Volume2 className="h-[45%] w-auto shrink-0" />
          <Settings className="h-[45%] w-auto shrink-0" />
          <List className="h-[45%] w-auto shrink-0" />
          <Maximize className="h-[45%] w-auto shrink-0" />
        </div>
      </div>
    </button>
  );
}

/**
 * La frise : la piste, la part déjà vue en blanc plein, et un jalon par
 * chapitre. Wistia les dessine en cercles ; ici ce sont des traits.
 */
function Frise() {
  const jalons = [9, 18, 31, 44, 57, 70, 83, 94];
  return (
    <span className="relative h-[0.5cqw] min-h-[2px] min-w-0 flex-1 bg-white/40">
      <span className="absolute inset-y-0 left-0 w-[9%] bg-white" />
      {jalons.map((x) => (
        <span
          key={x}
          className="absolute top-1/2 h-[1.6cqw] w-[0.35cqw] min-w-px -translate-y-1/2 bg-white"
          style={{ left: `${x}%` }}
        />
      ))}
    </span>
  );
}

/** Une carte de derrière. Sa légende se pose du côté qui dépasse de la
 *  carte de devant, sans quoi elle serait cachée. */
function CarteArriere({
  image,
  legende,
  cote,
}: {
  image: string;
  legende: string;
  cote: "gauche" | "droite";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "@container absolute top-1/2 z-0 w-[44%] -translate-y-1/2 overflow-hidden rounded-[5px] bg-[#d9d9de] shadow-[0_16px_32px_-16px_rgba(0,0,0,0.35)]",
        cote === "gauche" ? "left-0" : "right-0",
      )}
    >
      <div className="relative aspect-video">
        <img
          src={image}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-70 grayscale-[35%]"
        />
        {legende ? (
          <span
            className={cn(
              "absolute bottom-[6%] rounded-[5px] whitespace-nowrap bg-[#1d1d24]/85 px-[2cqw] py-[1cqw] font-[family-name:var(--font-genesis-bouton)] text-[4cqw] leading-none font-bold text-white",
              cote === "gauche" ? "left-[4%]" : "right-[4%]",
            )}
          >
            {legende}
          </span>
        ) : null}
      </div>
    </div>
  );
}
