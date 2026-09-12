import { cn } from "@repo/ui/lib/utils";
import type { CSSProperties } from "react";

/**
 * L'appel à l'action principal, en version lien.
 *
 * `ShimmerButton` de MagicUI ne rend qu'un `<button>` et n'accepte pas
 * `asChild`. Or tous les appels principaux du site mènent ailleurs : ce sont
 * des liens, et un bouton qui navigue perd le clic du milieu, l'ouverture dans
 * un onglet, le menu contextuel et le survol qui montre la destination.
 *
 * Plutôt que de retoucher le fichier de registre, qui doit rester alignable sur
 * ses mises à jour, on compose ici une ancre avec les mêmes animations.
 *
 * **La couleur passe par `--fond` et non par une classe.** Le fond est écrit à
 * deux endroits, le bouton lui-même et le masque qui rentre le cône lumineux de
 * `--cut` : ces deux-là doivent être exactement la même couleur, sinon le
 * liseré du bord change de teinte au lieu de scintiller. Une variable garantit
 * qu'ils ne peuvent pas diverger, là où deux classes passées de l'extérieur le
 * permettraient. Le défaut reste `--primary`, donc tous les appels existants ne
 * bougent pas. Elles
 * viennent de `@theme` (`--animate-shimmer-slide`, `--animate-spin-around`),
 * donc du thème du projet, et `globals.css` les neutralise déjà sous
 * `prefers-reduced-motion` puisque ce sont des animations CSS ordinaires.
 */
export function BoutonScintillant({
  href,
  externe = true,
  vitesse = "3s",
  /** Le fond du bouton, en valeur CSS. Un jeton, jamais une couleur écrite. */
  fond = "var(--primary)",
  className,
  children,
}: {
  href: string;
  externe?: boolean;
  vitesse?: string;
  fond?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={externe ? "_blank" : undefined}
      rel={externe ? "noreferrer" : undefined}
      style={
        {
          "--spread": "90deg",
          "--speed": vitesse,
          // Le liseré scintillant est laissé dépasser d'un cheveu du fond, et
          // c'est cette bande de un pixel qui fait tout l'effet.
          "--cut": "1px",
          "--fond": fond,
        } as CSSProperties
      }
      className={cn(
        // Plus haut, plus large, et le texte au corps courant plutôt qu'en
        // petit : c'est l'appel principal du site, et il était au même corps
        // que les liens secondaires. 56 px de haut, bien au-delà des 40 px de
        // cible tactile que demande le projet.
        "group relative z-0 inline-flex h-14 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md px-8 text-base font-semibold whitespace-nowrap",
        "bg-(--fond) text-primary-foreground",
        "transform-gpu transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-100 active:translate-y-px",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {/* Le cône lumineux qui tourne, sous tout le reste. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-30 overflow-visible blur-[2px] @container-[size]"
      >
        <span className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh]">
          <span className="animate-spin-around absolute -inset-full [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,white_var(--spread),transparent_var(--spread))]" />
        </span>
      </span>

      {children}

      {/* Le fond opaque, rentré de `--cut` : il masque le cône partout sauf sur
          le liseré du bord. */}
      <span
        aria-hidden
        className="absolute inset-(--cut) -z-20 rounded-md bg-(--fond)"
      />

      {/* Le renfoncement lumineux du bas, qui donne le relief. */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-md shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
      />
    </a>
  );
}
