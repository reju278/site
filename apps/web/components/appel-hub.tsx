import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { appelHub, avertissementHub, legalHub } from "@/contenu/hub";
import { SORTIE } from "@/lib/hub";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Les trois appels du hub, et le pied de page qui le ferme.
 *
 * Tous mènent au même endroit, `SORTIE`, qui est l'unique lien sortant autorisé
 * et porte déjà sa balise de provenance Hyros. Ils ne diffèrent que par le
 * moment auquel ils s'adressent, comme sur le site : le hub n'invente pas un
 * vocabulaire d'actions à lui.
 */

/**
 * La barre fixe en bas d'écran, sur téléphone uniquement. Demandée par Rémy.
 *
 * **Pourquoi seulement sur téléphone.** Sur un grand écran, les appels de la
 * page restent dans la vue en défilant et une barre fixe mangerait de la
 * hauteur pour rien. Sur un téléphone tenu à la main, l'appel sous la vidéo est
 * hors champ dès le troisième paragraphe, et c'est là que la question se pose.
 *
 * **`pb-[env(safe-area-inset-bottom)]`** : sans lui, la barre passe sous la
 * barre de gestes des iPhone récents et le bouton devient à moitié
 * inatteignable. C'est une hauteur que seul le navigateur connaît.
 *
 * **Le fond est plein, et il a fallu le corriger.** Il était à `background/95`,
 * ce qui paraissait sans conséquence : à cinq pour cent, le bouton d'appel
 * posé sous la vidéo transparaissait à travers la barre et on lisait deux fois
 * le même libellé, l'un net et l'autre fantôme. C'est la règle du projet, fonds
 * pleins partout, et le flou par-devant a ses trois exceptions déjà écrites
 * dans `AGENTS.md` : une quatrième se décide, elle ne s'ajoute pas.
 */
export function BarreAppelHub() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] sm:hidden">
      <div className="px-5 py-3">
        {/* `min-h-*` et pas de `whitespace-nowrap` : « Réserver mon appel
            gratuit » demande plus que la largeur d'un téléphone de 375 px, et
            un libellé qui refuse de passer à la ligne élargit le document
            entier. C'est exactement la panne décrite dans `AGENTS.md`. */}
        <BoutonScintillant href={SORTIE} className="flex w-full">
          {appelHub.libelle}
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </BoutonScintillant>
      </div>
    </div>
  );
}

/**
 * L'encart d'appel au milieu d'un article, à la place d'`AppelFormation`.
 *
 * Celui du site propose deux chemins, la formation gratuite et l'appel. Le hub
 * n'en a qu'un : la formation vit sur un autre domaine, donc ce serait une
 * sortie, et la règle du hub est qu'il n'y en a pas d'autre que l'appel. Le
 * dessin de la carte, lui, est celui du site au pixel près.
 */
export function AppelHubArticle() {
  return (
    <aside className="relief-verre my-14 rounded-md border border-border bg-card p-6 sm:my-16 sm:p-8">
      <p className="titre text-2xl text-balance text-card-foreground sm:text-3xl">
        {appelHub.titre}
      </p>

      <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
        {appelHub.texte}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={SORTIE}
          target="_blank"
          rel="noreferrer"
          className="group/roule inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
        >
          <TexteRoulant>{appelHub.libelle}</TexteRoulant>
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </a>
      </div>
    </aside>
  );
}

/**
 * Le pied du hub : l'avertissement, puis les mentions.
 *
 * **L'avertissement n'est pas en petits caractères**, et c'est un choix de
 * conformité et non de mise en page : une mention minuscule ou difficile à
 * trouver est elle-même un signal de méfiance à l'examen d'une page d'arrivée.
 * Il est donc à la taille du texte secondaire du site, sur toute la mesure.
 *
 * **Les trois liens légaux sortent du hub, et c'est assumé.** Une page
 * commerciale européenne doit donner accès à ses conditions et à sa politique
 * de confidentialité ; les cacher rendrait la page moins conforme, pas plus.
 * Ce ne sont pas des échappatoires : ce sont des documents, et ces pages
 * portent déjà `robots: { index: false }`.
 */
export function PiedHub() {
  return (
    <footer className="border-t border-border px-5 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {avertissementHub}
        </p>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {legalHub.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {page.libelle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
