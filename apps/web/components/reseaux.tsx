import { reseaux } from "@/contenu/site";
import { SigneRoulant, TexteRoulant } from "@/components/texte-roulant";
import { cn } from "@repo/ui/lib/utils";
import { siFacebook, siInstagram, siTiktok, siYoutube } from "simple-icons";

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

/**
 * `rond` habille chaque réseau en pastille circulaire sur `--accent`, comme
 * dans le pied de page de functionhealth.com, repris sur demande de Rémy. Le
 * `rounded-full` est l'exception consignée dans `AGENTS.md` ; la pastille est
 * aussi ce qui porte la cible tactile, une icône nue n'ayant pas de surface.
 */
/**
 * `autres` est la variante du panneau de l'en-tête, sur demande de Rémy : « en
 * bas dans le menu, tu vas mettre Autres réseaux, et tu mets Instagram, TikTok,
 * Facebook, LinkedIn en toutes lettres, comme pour LinkedIn ».
 *
 * Elle fait deux choses, et les deux tiennent ensemble. **Elle écrit les noms**
 * plutôt que les signes : le traitement que LinkedIn subissait faute de glyphe
 * devient celui de toute la rangée, donc la ligne se lit au lieu de se
 * déchiffrer, et LinkedIn cesse d'avoir l'air de l'exception qu'il était. **Et
 * elle retire YouTube**, qui n'est plus un réseau parmi d'autres dans ce
 * panneau : les trois chaînes ont leur propre entrée juste au-dessus, avec leur
 * logo, et un sixième lien YouTube en pied de liste renverrait à la même
 * maison sans dire laquelle.
 *
 * Le pied de page, lui, garde ses pastilles rondes et son YouTube : il n'a pas
 * d'entrées de chaînes au-dessus, et c'est là que la rangée de signes est à sa
 * place.
 */
export function Reseaux({
  className,
  rond = false,
  autres = false,
  titre,
}: {
  className?: string;
  rond?: boolean;
  autres?: boolean;
  titre?: string;
}) {
  const liste = autres
    ? reseaux.filter((reseau) => reseau.glyphe !== "youtube")
    : reseaux;

  return (
    <div className={className}>
      {titre ? (
        <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {titre}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {liste.map((reseau) => (
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
              "group/roule flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
              rond
                ? // 40 px : la cible tactile minimale du projet. Le fond est
                  // posé en permanence et non au survol, parce que sur un
                  // téléphone il n'y a pas de survol et que la pastille est ce
                  // qui montre où appuyer.
                  "h-10 rounded-full bg-accent hover:bg-accent/70"
                : "h-9 rounded-md hover:bg-accent",
              // LinkedIn n'a pas de glyphe : sa pastille s'allonge autour de son
              // nom écrit, mais garde le même fond et le même rayon que les
              // autres, sinon elle se lirait comme un objet d'une autre nature.
              reseau.glyphe && !autres
                ? rond
                  ? "w-10"
                  : "w-9"
                : "px-4 text-sm font-semibold",
            )}
          >
            {reseau.glyphe && !autres ? (
              <SigneRoulant className="size-[18px]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-[18px] fill-current"
                >
                  <path d={GLYPHES[reseau.glyphe]} />
                </svg>
              </SigneRoulant>
            ) : (
              <TexteRoulant>{reseau.nom}</TexteRoulant>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
