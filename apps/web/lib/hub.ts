import { avis, type Avis, type SectionAvis } from "@/contenu/avis";
import { liens } from "@/contenu/site";
import { affichesConformes, sectionsHub, titresHub } from "@/contenu/hub";

/**
 * La mécanique du hub de retargeting.
 *
 * Le hub sert une page de publicité payante : `/hub` reprend le sommaire des
 * résultats et `/hub/<nom>` chaque entretien, au dessin près. Trois choses l'en
 * distinguent, et toutes les trois sont mécaniques plutôt que surveillées.
 *
 * **Il ne laisse sortir que vers l'appel.** C'est le seul lien sortant autorisé,
 * sur décision de Rémy : quelqu'un qui arrive par une publicité de reciblage
 * doit pouvoir lire les avis et réserver, rien d'autre. Les liens vers les
 * autres avis sont réécrits pour rester dans le hub ; tous les autres,
 * `/podcast`, `/articles`, la formation gratuite, sont **déshabillés** et
 * redeviennent du texte. Voir `versHub`.
 *
 * **Il ne porte aucun montant.** Les règles publicitaires de Meta refusent les
 * promesses de gain, et elles s'appliquent à la page d'arrivée autant qu'à
 * l'annonce : une annonce propre qui pointe vers une page de chiffres se fait
 * refuser à l'examen, et le compte publicitaire paie les refus répétés. Ce qui
 * déclenche le refus, ce n'est pas le témoignage, c'est le témoignage **centré
 * sur l'argent gagné plutôt que sur le problème résolu**.
 *
 * D'où la règle de ce fichier : **on retire, on ne réécrit pas.** Un paragraphe,
 * une citation ou un tour de parole qui porte un montant est retiré en entier du
 * hub ; il n'est jamais reformulé. Ce sont les mots de vraies personnes, et
 * changer ce que quelqu'un a dit pour le rendre publiable est une faute d'un
 * autre ordre qu'une page refusée. Les titres et les chapôs, eux, ne peuvent pas
 * être simplement retirés sans laisser une page sans en-tête : ils ont donc une
 * version propre au hub, écrite dans `contenu/hub.ts` et **à valider par Rémy**.
 *
 * **Et rien ne dépend de la vigilance.** `controlerLeHub` relit tout ce que le
 * hub s'apprête à servir et jette si un montant a survécu. Elle tourne au build,
 * donc un avis ajouté demain sans sa version de hub casse la construction au
 * lieu de partir en production avec un chiffre dessus. C'est le même
 * raisonnement qu'`avecTag` pour Hyros : une fonction plutôt qu'une consigne,
 * parce qu'un oubli ne se voit pas.
 */

/** La racine du hub. Écrite une fois : elle apparaît dans trois fichiers. */
export const HUB = "/hub";

/**
 * Ce qui compte comme un montant.
 *
 * Le symbole, mais surtout **le mot « euro » sous toutes ses formes** : la
 * moitié des montants de `avis.ts` sont écrits en lettres, parce que la
 * transcription rend ce que les gens disent. « Dix mille euros par mois » est
 * exactement la même promesse que « 10 000 € », et une expression qui ne
 * chercherait que des chiffres l'aurait laissée passer. C'est d'ailleurs ce qui
 * s'est produit au premier relevé : il annonçait deux paragraphes à retirer,
 * il y en avait soixante-cinq.
 *
 * Les pourcentages sont là pour la même raison, un rendement s'énonçant aussi
 * bien en part qu'en somme.
 */
const ARGENT = /(€|\beuros?\b|\bk€|\b\d+\s*(?:%|pour\s+cent)\b)/i;

/** Ce texte porte-t-il un montant ? */
export const porteUnMontant = (texte: string) => ARGENT.test(texte);

/**
 * La seule adresse qui a le droit de quitter le hub.
 *
 * Elle porte déjà sa balise de provenance Hyros, posée par `avecTag` dans
 * `liens` : le hub ne la recompose pas, il la reprend. Une balise réécrite à la
 * main ici serait une deuxième source de vérité, donc une divergence en
 * attente, et une balise perdue ne se voit pas, elle se lit des semaines plus
 * tard dans des chiffres d'attribution faux.
 */
export const SORTIE = liens.appel;

/** `[libellé](adresse)`, la syntaxe de `TexteLie` et rien d'autre. */
const LIEN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Réécrit les liens d'un texte de contenu pour qu'ils restent dans le hub.
 *
 * Trois sorts possibles, et un seul laisse sortir :
 *
 * - `/resultats/<nom>` et `/resultats` deviennent leur équivalent dans le hub ;
 * - l'adresse de l'appel est conservée telle quelle, balise comprise ;
 * - **tout le reste est déshabillé** : le libellé reste, le lien disparaît. Un
 *   lien retiré laisse une phrase intacte, alors qu'un lien oublié laisse une
 *   porte ouverte. C'est la raison pour laquelle cette fonction liste ce qui
 *   reste plutôt que ce qui part : une liste blanche ne peut pas se faire
 *   contourner par une adresse qu'on n'avait pas prévue.
 */
export function versHub(texte: string): string {
  return texte.replace(LIEN, (entier, libelle: string, href: string) => {
    if (href === SORTIE) return entier;
    if (href === "/resultats") return `[${libelle}](${HUB})`;
    if (href.startsWith("/resultats/")) {
      return `[${libelle}](${HUB}/${href.slice("/resultats/".length)})`;
    }
    return libelle;
  });
}

/** Un avis tel que le hub le sert. */
export type AvisHub = Omit<Avis, "sections" | "transcription"> & {
  sections: SectionAvis[];
  transcription: Avis["transcription"];
};

/**
 * La version hub d'un avis : ses en-têtes remplacés, ses montants retirés.
 *
 * Une section dont tous les paragraphes portaient un montant disparaît
 * entièrement : un titre seul au-dessus du vide est pire que pas de section,
 * et c'est déjà la règle du site pour la rangée des dernières vidéos.
 */
export function avisHub(slug: string): AvisHub | null {
  const article = avisServis.find((a) => a.slug === slug);
  if (!article) return null;

  const entetes = titresHub[article.slug];
  if (!entetes) return null;

  const sections = article.sections
    .map((section) => {
      const paragraphes = section.paragraphes
        .filter((p) => !porteUnMontant(p))
        .map(versHub);

      const citation =
        section.citation && !porteUnMontant(section.citation.texte)
          ? section.citation
          : undefined;

      return {
        ...section,
        titre: sectionsHub[section.titre] ?? section.titre,
        paragraphes,
        citation,
      };
    })
    .filter((section) => section.paragraphes.length > 0);

  return {
    ...article,
    ...entetes,
    chapo: versHub(entetes.chapo),
    sections,
    transcription: article.transcription.filter(
      (tour) => !porteUnMontant(tour.texte),
    ),
  };
}

/**
 * Le contrôle : rien de ce que le hub sert ne porte de montant.
 *
 * Elle est appelée par les deux pages du hub, donc au build, et **elle jette**.
 * C'est volontairement brutal : une page qui manque se remarque tout de suite,
 * un chiffre oublié sur une page de publicité ne se remarque qu'au refus de
 * Meta, ou pas du tout.
 *
 * Elle relit aussi les cartes du sommaire, qui viennent de `temoignages` et non
 * d'`avis` : c'est exactement le genre d'endroit qu'on oublie, puisqu'il n'est
 * pas dans le fichier qu'on est en train de nettoyer.
 */
export function controlerLeHub(textes: readonly string[], ou: string): void {
  const fautifs = textes.filter(porteUnMontant);
  if (fautifs.length === 0) return;

  throw new Error(
    `Le hub est une page de publicité : aucun montant n'y est admis. ` +
      `Trouvé dans ${ou} :\n` +
      fautifs.map((t) => `  · ${t}`).join("\n") +
      `\nRetirer le passage, ou lui donner sa version de hub dans contenu/hub.ts.`,
  );
}

/**
 * Les avis que le hub sert, dans l'ordre d'`avis.ts`.
 *
 * Deux conditions, et les deux sont nécessaires : un en-tête écrit pour le hub,
 * et une **affiche sans allégation incrustée**. La seconde écarte treize
 * entretiens sur vingt-deux, et c'est le prix d'une page qui passe : voir
 * `affichesConformes` dans `contenu/hub.ts`.
 *
 * Tout ce qui liste des entretiens dans le hub part d'ici, le sommaire comme
 * les voisins de bas d'article : une seconde façon de les compter finirait par
 * en laisser passer un.
 */
export const avisServis = avis.filter(
  (a) => titresHub[a.slug] && affichesConformes.includes(a.id),
);
