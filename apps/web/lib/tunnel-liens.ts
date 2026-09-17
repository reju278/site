import { avis } from "@/contenu/avis";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";

/** `[libellé](adresse)`, la syntaxe de `TexteLie` et rien d'autre. */
const LIEN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Réécrit les liens d'un article d'avis pour qu'ils restent dans `/immersion`.
 *
 * Les articles se citent entre eux : c'est le levier le plus fort du site, et
 * c'est écrit dans `AGENTS.md`. Mais sur une page de tunnel, chacun de ces liens
 * est une porte de sortie qui rendrait au visiteur l'en-tête du site et ses
 * trente entrées de menu. La règle du tunnel prime : on n'en sort pas.
 *
 * Deux sorts possibles, et **aucun ne laisse sortir** :
 *
 * - **Un lien vers l'entretien d'une personne qui est sur cette page** devient
 *   l'ancre de son lecteur. Le lien garde donc son sens, il reste cliquable, et
 *   il ne quitte pas la page. C'est mieux que de le déshabiller : une phrase
 *   qui renvoie à Roland renvoie vraiment à Roland.
 * - **Tout le reste est déshabillé** : le libellé reste en texte, le lien
 *   disparaît. Un lien retiré laisse une phrase intacte ; un lien oublié laisse
 *   une porte ouverte.
 *
 * **L'appel ne fait plus exception**, sur demande de Rémy : `/immersion` ne
 * porte plus un seul lien sortant, pas même celui-là. C'est la différence avec
 * `versHub`, qui le conserve avec sa balise Hyros.
 *
 * **La liste dit ce qui reste et non ce qui part**, comme `versHub`. Une liste
 * noire se fait contourner par la première adresse qu'on n'avait pas prévue ;
 * une liste blanche ne peut pas.
 *
 * Les entretiens absents de la page tombent donc dans le troisième cas, et
 * c'est voulu : `/immersion` en montre quatorze, `avis.ts` en compte
 * vingt-deux, et pointer vers une ancre qui n'existe pas donnerait un lien mort
 * que le clavier atteint quand même.
 */
export function versImmersion(texte: string): string {
  return texte.replace(LIEN, (_entier, libelle: string, href: string) => {
    if (href.startsWith("/resultats/")) {
      const slug = href.slice("/resultats/".length);
      const article = avis.find((a) => a.slug === slug);
      const present =
        article &&
        (entretiensImmersion as readonly string[]).includes(article.id);

      return present ? `[${libelle}](#${ancreEntretien(article.id)})` : libelle;
    }

    /* `/resultats` mène au sommaire du site. Ici, la section des entretiens
       tient ce rôle, et elle porte déjà son ancre. */
    if (href === "/resultats") return `[${libelle}](#avis)`;

    return libelle;
  });
}
