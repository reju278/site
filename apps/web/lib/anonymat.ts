/**
 * Ce qu'on retire du texte des membres avant de l'afficher.
 *
 * Deux retraits, tous deux demandés par Rémy, et tous deux faits **à
 * l'affichage** : les données de `contenu/communaute.ts` restent le post tel
 * que Circle le rend, mot pour mot. Une donnée déjà caviardée ne se vérifie
 * plus contre sa source.
 *
 * **Les noms de famille des personnes citées.** Les membres se mentionnent
 * entre eux dans leurs posts et leurs réponses. Publier « @Nathalie Rossa
 * Tisseau » sur une page ouverte, c'est exposer quelqu'un qui écrivait dans un
 * groupe privé et qui n'a rien demandé. Le prénom suffit à montrer que des gens
 * se répondent.
 *
 * **Sauf Geoffrey Bonniot et Rémy Jupille**, sur consigne explicite de Rémy :
 * ce sont les deux seuls noms complets cités dans ces textes qui soient ceux de
 * l'équipe, et ils s'assument publiquement. Ludivine et Monica ne sont jamais
 * citées avec leur nom de famille, il n'y a donc rien à garder pour elles.
 *
 * **La table est écrite et non devinée.** Couper au premier espace marche pour
 * « Nathalie Rossa Tisseau » et se trompe pour « BUFFET Roland », qui donnerait
 * « BUFFET », pour « Laurent et Élisabeth. », qui perdrait Élisabeth, et pour
 * « Sarah de Azevedo », dont la particule n'est pas un prénom. Les soixante et
 * un cas sont relevés dans les textes réellement publiés ici, et les ambigus
 * sont tranchés à la main.
 *
 * **Les adresses.** Un lien dans un témoignage emmène ailleurs, et cette page
 * est un tunnel. Ils ne sont pas rendus cliquables, ils sont retirés du texte.
 *
 * L'ordre du tableau compte : du nom le plus long au plus court, pour que
 * « Christophe & Dominique Crapez » soit traité avant « Dominique BERTON ».
 */
const NOMS: readonly (readonly [string, string])[] = [
  ["Christian Joyce", "Christian"],
  ["Mathieu Tison", "Mathieu"],
  ["Augustin Passy", "Augustin"],
  ["Patrick Pinot", "Patrick"],
  ["Roland Buffet", "Roland"],
  ["Guy Anastaze", "Guy"],
  ["Dominique BERTON & Michel ROUSSET", "Dominique & Michel"],
  ["Marlyse et Richard de Villeneuve", "Marlyse et Richard"],
  ["Christophe & Dominique Crapez", "Christophe & Dominique"],
  ["Sylvie PONT & Yannick DIAZ", "Sylvie & Yannick"],
  ["Nathalie Rossa Tisseau", "Nathalie"],
  ["Laurent et Élisabeth.", "Laurent et Élisabeth"],
  ["Sophie Boeuf Brunner", "Sophie"],
  ["Corentin Ghisalberti", "Corentin"],
  ["Judith Kamdem Simo", "Judith"],
  ["Amandine GUERREIRO", "Amandine"],
  ["Alexandra Sinkova", "Alexandra"],
  ["Brigitte Le Moine", "Brigitte"],
  ["Mathieu Granchamp", "Mathieu"],
  ["Florence CHAGNEUX", "Florence"],
  ["Mario Gaudreault", "Mario"],
  ["Catherine Dumont", "Catherine"],
  ["Séverine SASSARD", "Séverine"],
  ["Sarah de Azevedo", "Sarah"],
  ["Nicolas Havenith", "Nicolas"],
  ["MADELEINE ROMMEL", "Madeleine"],
  ["Frédéric FELLER", "Frédéric"],
  ["Laëtitia Miroux", "Laëtitia"],
  ["Chrystel Gerard", "Chrystel"],
  ["Olivier CAETANO", "Olivier"],
  ["Mayis Al Tatari", "Mayis"],
  ["HUGUENIN Benoit", "Benoit"],
  ["Patricia Nagant", "Patricia"],
  ["Merveille Lucia", "Merveille"],
  ["Nicolas Majois", "Nicolas"],
  ["Clemence Privé", "Clemence"],
  ["François DAOUD", "François"],
  ["Alexis Gaborit", "Alexis"],
  ["Augustin Passy", "Augustin"],
  ["Tatiana Moreau", "Tatiana"],
  ["Ilyasse Setti", "Ilyasse"],
  ["Maxime LEGROS", "Maxime"],
  ["BUFFET Roland", "Roland"],
  ["Mario Orsinet", "Mario"],
  ["Patrick Pinot", "Patrick"],
  ["Mohamed ASHAD", "Mohamed"],
  ["Mauro Di Fino", "Mauro"],
  ["Jeremy Renoux", "Jeremy"],
  ["Dory Marciuk", "Dory"],
  ["Colas Zibaut", "Colas"],
  ["Guy Anastaze", "Guy"],
  ["Virak CHHUOR", "Virak"],
  ["Doan PANNIER", "Doan"],
  ["Many Soliman", "Many"],
  ["Cathy Arnaud", "Cathy"],
  ["Cédric Bizet", "Cédric"],
  ["Bruno Beuret", "Bruno"],
  ["Thomas Venet", "Thomas"],
  ["Curier Davy", "Curier"],
  ["Lilian Céré", "Lilian"],
  ["Barbara Bay", "Barbara"],
  ["Sacha COHEN", "Sacha"],
  ["Neyla Mudi", "Neyla"],
  ["sheikh ali", "sheikh"],
  ["Judith Nah", "Judith"],
  ["Khaled B.", "Khaled"],
  ["Linn 🦋", "Linn"],
];

/**
 * Les noms de famille en moins.
 *
 * **Séparée du retrait des adresses**, et il le fallait : les articles d'avis
 * portent des liens écrits `[libellé](adresse)`, et une expression qui efface
 * les adresses les viderait de leur destination. Les deux passes ne servent donc
 * pas les mêmes textes : les posts du groupe reçoivent les deux, les articles
 * d'avis n'en reçoivent qu'une, leurs liens étant traités par `versImmersion`.
 */
export function sansNoms(texte: string): string {
  let sortie = texte;
  for (const [complet, court] of NOMS) {
    sortie = sortie.split(complet).join(court);
  }
  return sortie;
}

/** Les adresses en moins. À ne pas appliquer à un texte qui porte des liens. */
export function sansAdresses(texte: string): string {
  /* Les adresses partent avec la ponctuation collée mais pas celle de la phrase :
     `[^\s)]` s'arrête à l'espace et à la parenthèse fermante, et la virgule ou
     le point final qui suit reste, sans quoi la phrase perdrait sa ponctuation. */
  const sortie = texte.replace(/https?:\/\/[^\s)]+/g, "");

  /* Le retrait d'une adresse laisse deux espaces, et parfois une espace avant
     une virgule. On recolle, sinon le caviardage se voit plus que le lien. */
  return sortie.replace(/[ \t]{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

/** Le texte d'un post du groupe, prêt à l'affichage : ni noms, ni adresses. */
export function anonymiser(texte: string): string {
  return sansAdresses(sansNoms(texte));
}
