import { reseaux } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";
import {
  siFacebook,
  siInstagram,
  siTiktok,
  siYoutube,
} from "simple-icons";

/**
 * La rangée des réseaux, en pied du panneau « Ressources ».
 *
 * Les glyphes viennent de `simple-icons`, le jeu de référence, distribué en
 * CC0. Lucide, la bibliothèque d'icônes du projet, a retiré toutes ses icônes
 * de marque à partir de la version 1 : il ne lui reste que des formes
 * génériques, et un rond gris ne dit pas « TikTok ».
 *
 * Les chemins sont dessinés dans un repère de 24 sur 24 et remplis avec
 * `currentColor`, donc ils suivent la couleur du texte et fonctionnent dans les
 * deux thèmes sans qu'aucune couleur ne soit écrite.
 *
 * LinkedIn n'a pas de glyphe et n'en aura pas : LinkedIn a demandé le retrait
 * de sa marque des jeux d'icônes libres. Son entrée s'affiche avec son nom
 * écrit, ce qui est la façon correcte de citer une marque dont on ne peut pas
 * montrer le signe.
 */

const GLYPHES = {
  youtube: siYoutube.path,
  instagram: siInstagram.path,
  tiktok: siTiktok.path,
  facebook: siFacebook.path,
} as const;

export function Reseaux({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {reseaux.map((reseau) => (
        <a
          key={reseau.href}
          href={reseau.href}
          target="_blank"
          rel="noreferrer"
          // Le nom est porté par `aria-label` et non par du texte visible : la
          // rangée est une bande de signes, et un lecteur d'écran a besoin du
          // nom de la destination, pas du mot « icône ».
          aria-label={reseau.nom}
          title={reseau.nom}
          className={cn(
            "flex h-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            reseau.glyphe ? "w-9" : "px-3 text-sm font-semibold"
          )}
        >
          {reseau.glyphe ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-[18px] fill-current"
            >
              <path d={GLYPHES[reseau.glyphe]} />
            </svg>
          ) : (
            reseau.nom
          )}
        </a>
      ))}
    </div>
  );
}
