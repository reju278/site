/**
 * Les espaces insécables que le français demande, posées à l'affichage.
 *
 * En français, la ponctuation haute (`: ; ! ?`) et les guillemets sont précédés
 * ou suivis d'une espace, et **cette espace ne doit jamais se couper** : sinon
 * une ligne finit sur « ou commence par « : », ce qui se lit comme une faute.
 *
 * C'est arrivé deux fois sur le téléphone de Rémy, et les deux fois sur des
 * titres : « Place au parfait « / tunnel de vente ». », et « Avis Funnels Club
 * / : Christian Joyce ». Le second cas ne passe pas par `TitreRoulant`, qui a sa
 * propre réparation, donc il lui fallait celle-ci.
 *
 * **Posé à l'affichage et non dans le contenu**, et c'est délibéré : `avis.ts`
 * porte vingt-deux titres, le flux Substack en apporte de nouveaux chaque
 * semaine et celui de YouTube aussi. Une règle appliquée au rendu vaut pour ce
 * qui existe et pour ce qui arrivera ; une correction saisie à la main ne vaut
 * que pour ce qu'on a pensé à corriger.
 *
 * Le texte n'est pas modifié au sens de ce que le projet interdit : c'est la
 * même phrase, avec la coupure que le français refuse en moins. Ce qu'un lecteur
 * copie reste lisible, et un moteur lit l'espace insécable comme une espace.
 */

/** L'espace insécable, U+00A0. Nommée pour qu'on la reconnaisse dans le code. */
const INSECABLE = " ";

export function insecables(texte: string): string {
  return (
    texte
      // Une espace ordinaire devant une ponctuation haute ou un guillemet
      // fermant : elle devient insécable.
      .replace(/ ([:;!?»])/g, `${INSECABLE}$1`)
      // Une espace ordinaire derrière un guillemet ouvrant : même chose.
      .replace(/« /g, `«${INSECABLE}`)
      // **Un nombre ne se coupe pas**, et c'est le cas le plus grave des trois.
      // « 160 000 € » écrit avec des espaces ordinaires se cassait en « 160 / 000 € »
      // en tête d'une page d'avis : un lecteur lit alors deux nombres là où il
      // y en a un, et sur une page qui annonce un chiffre d'affaires, c'est une
      // erreur de fait, pas une gêne de mise en page.
      .replace(/(\d) (?=\d)/g, `$1${INSECABLE}`)
      // Et l'espace entre le nombre et son unité ne se coupe pas non plus.
      .replace(/(\d) (€|%|k€|h|min|ans?|mois)\b/g, `$1${INSECABLE}$2`)
  );
}
