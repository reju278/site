import Link from "next/link";
import { estExterne } from "@/contenu/site";

/**
 * Un paragraphe dont les liens sont écrits **dans le texte**.
 *
 * Les articles d'avis ont besoin de liens en contexte : c'est là que
 * l'ancre porte du sens, et un lien de contexte vaut mieux qu'une liste de
 * liens en bas de page, pour un lecteur comme pour un moteur. Mais écrire du
 * JSX dans `avis.ts` ferait entrer de la mise en forme dans le contenu, ce que
 * le projet refuse partout ailleurs.
 *
 * D'où cette syntaxe minimale, celle de Markdown et rien d'autre :
 * `[le texte du lien](/adresse)`. Une seule expression rationnelle, pas de
 * bibliothèque, et le contenu reste lisible tel quel dans le fichier.
 *
 * **Ce n'est pas du Markdown** et ça ne doit pas le devenir : ni gras, ni
 * italique, ni titres. Un format de contenu qui grossit finit par demander un
 * analyseur, puis un éditeur, et le texte cesse d'être relisible à l'œil nu.
 * S'il faut un jour plus que des liens, c'est le signe qu'il faut un vrai
 * format, pas une rustine de plus.
 *
 * Les liens sortants prennent leur `target` et leur `rel="noreferrer"`, et leur
 * balise de provenance est déjà dans `liens` : voir la règle Hyros dans
 * `AGENTS.md`.
 */

/** `[texte](adresse)`, et rien d'autre. */
const LIEN = /\[([^\]]+)\]\(([^)]+)\)/g;

const CLASSES =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function TexteLie({ children }: { children: string }) {
  const morceaux: React.ReactNode[] = [];
  let curseur = 0;

  for (const trouve of children.matchAll(LIEN)) {
    const [entier, libelle, href] = trouve;
    const debut = trouve.index;

    if (debut > curseur) morceaux.push(children.slice(curseur, debut));

    if (libelle && href) {
      morceaux.push(
        estExterne(href) ? (
          <a
            key={`${debut}-${href}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={CLASSES}
          >
            {libelle}
          </a>
        ) : (
          <Link key={`${debut}-${href}`} href={href} className={CLASSES}>
            {libelle}
          </Link>
        ),
      );
    }

    curseur = debut + entier.length;
  }

  if (curseur < children.length) morceaux.push(children.slice(curseur));

  return <>{morceaux}</>;
}
