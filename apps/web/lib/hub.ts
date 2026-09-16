import { avis, type Avis, type SectionAvis } from "@/contenu/avis";
import { liens } from "@/contenu/site";
import {
  affichesConformes,
  affichesRecadrees,
  passagesRetires,
  sectionsHub,
  surlignagesHub,
  titresHub,
} from "@/contenu/hub";

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

/**
 * La racine du hub, et le sommaire des entretiens.
 *
 * **Les deux ne sont plus la même page**, sur décision de Rémy : `/hub` porte
 * désormais la formation gratuite, parce que c'est elle qu'un visiteur de
 * reciblage a déjà vue et que c'est par elle qu'on le reprend. Le sommaire des
 * entretiens est descendu d'un cran, sous `/hub/resultats`.
 *
 * Les deux sont écrites une fois : elles apparaissent dans les pages, dans le
 * menu, dans le pied de page et dans la réécriture des liens de contenu, et
 * cinq copies d'une adresse finissent toujours par diverger.
 *
 * **Les entretiens restent à `/hub/<nom>`** et ne descendent pas sous
 * `/hub/resultats/<nom>` : en Next, un segment fixe l'emporte sur un segment
 * dynamique voisin, donc `/hub/resultats` est servi par sa page et non par
 * `[avis]`. Les déplacer n'aurait rien apporté et aurait allongé chaque
 * adresse.
 */
export const HUB = "/hub";
export const HUB_RESULTATS = `${HUB}/resultats`;

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
    if (href === "/resultats") return `[${libelle}](${HUB_RESULTATS})`;
    if (href.startsWith("/resultats/")) {
      return `[${libelle}](${HUB}/${href.slice("/resultats/".length)})`;
    }
    return libelle;
  });
}

/**
 * Un avis tel que le hub le sert.
 *
 * **Sans sa transcription** : le hub ne la publie pas, sur décision de Rémy, et
 * une donnée qu'on ne montre pas n'a pas à traverser la fonction. La retirer du
 * type est ce qui garantit qu'elle ne réapparaîtra pas par distraction dans une
 * page future.
 */
export type AvisHub = Omit<Avis, "sections" | "transcription"> & {
  sections: SectionAvis[];
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

  const retires = passagesRetires
    .filter((r) => r.slug === article.slug)
    .map((r) => r.fragment);

  const sections = article.sections
    .map((section) => {
      const paragraphes = section.paragraphes
        .filter((p) => !porteUnMontant(p))
        .filter((p) => !retires.some((f) => p.includes(f)))
        .map(versHub)
        .map((p) => surligner(p, surlignagesHub[article.slug] ?? []));

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
  (a) =>
    titresHub[a.slug] &&
    (affichesConformes.includes(a.id) || affichesRecadrees.includes(a.id)),
);

/**
 * Pose le surlignage `==…==` sur les passages désignés d'un paragraphe.
 *
 * **Une seule passe, et elle protège ce qui existe.** Les paragraphes portent
 * déjà des `==…==` et des `[libellé](adresse)` écrits dans `avis.ts` : marquer
 * naïvement un passage qui traverse l'un ou l'autre produirait des marques
 * imbriquées, que l'expression de `TexteLie` ne sait pas lire. Un passage qui
 * chevauche une marque existante est donc laissé tel quel, et le contrôle le
 * dira.
 *
 * Le passage doit se trouver **une fois et une seule**. Deux occurrences, et on
 * ne saurait pas laquelle marquer ; zéro, et le surlignage disparaîtrait en
 * silence le jour où quelqu'un retouche la phrase.
 */
export function surligner(
  texte: string,
  passages: readonly string[],
): string {
  let sortie = texte;

  for (const passage of passages) {
    const debut = sortie.indexOf(passage);
    if (debut === -1) continue;
    if (sortie.indexOf(passage, debut + 1) !== -1) continue;

    /* Le passage ne doit traverser ni une marque de surlignage ni un lien. */
    const avant = sortie.slice(0, debut);
    const dansUneMarque =
      (avant.match(/==/g) ?? []).length % 2 === 1 ||
      avant.lastIndexOf("[") > avant.lastIndexOf(")");
    if (dansUneMarque) continue;

    sortie = `${avant}==${passage}==${sortie.slice(debut + passage.length)}`;
  }

  return sortie;
}

/**
 * Le contrôle des passages désignés : chacun doit exister, une fois et une
 * seule, dans l'article qui le déclare.
 *
 * Sans lui, une retouche d'`avis.ts` ferait disparaître un surlignage ou un
 * retrait sans que rien ne le signale : la page resterait juste, simplement
 * plus fade, ou avec une phrase qu'on croyait retirée. Il tourne au build,
 * comme `controlerLeHub`.
 */
export function controlerLesPassages(): void {
  const fautes: string[] = [];

  const compter = (slug: string, fragment: string) => {
    const article = avis.find((a) => a.slug === slug);
    if (!article) return `avis « ${slug} » introuvable`;
    const corpus = article.sections.flatMap((s) => s.paragraphes);
    const n = corpus.filter((p) => p.includes(fragment)).length;
    if (n === 0) return `introuvable dans « ${slug} » : « ${fragment} »`;
    if (n > 1) return `trouvé ${n} fois dans « ${slug} » : « ${fragment} »`;
    return null;
  };

  for (const retire of passagesRetires) {
    const faute = compter(retire.slug, retire.fragment);
    if (faute) fautes.push(faute);
  }

  for (const [slug, passages] of Object.entries(surlignagesHub)) {
    for (const passage of passages) {
      const faute = compter(slug, passage);
      if (faute) fautes.push(faute);
    }
  }

  if (fautes.length > 0) {
    throw new Error(
      "Les passages désignés dans contenu/hub.ts ne correspondent plus au " +
        "contenu d'avis.ts :\n" +
        fautes.map((f) => `  · ${f}`).join("\n"),
    );
  }
}
