/**
 * Le prénom seul, sur décision de Rémy : la page d'immersion ne porte pas les
 * noms de famille.
 *
 * **Ce n'est pas une coquetterie, c'est une réduction de ce qu'on publie.** Les
 * personnes citées ici ont écrit dans un groupe privé ou répondu à un entretien ;
 * leur nom complet associé à leur métier et à leur chiffre d'affaires sur une
 * page publique en dit plus long que ce à quoi elles ont consenti. Le prénom
 * suffit à savoir que ce sont des gens réels.
 *
 * **Elle vit ici et non dans `contenu/`**, et c'est délibéré : les noms complets
 * restent dans les données, parce que `temoignages` et `avis.ts` servent aussi
 * `/resultats`, où les entretiens sont publiés avec l'accord des personnes et
 * où le nom complet est ce qui rend la page crédible. C'est l'affichage qui
 * coupe, pas la source. Une seconde liste de prénoms aurait divergé au premier
 * ajout.
 *
 * **Les couples restent des couples.** « Yannick et Sylvie » et « Christophe et
 * Dominique Crapez » désignent deux personnes : couper au premier espace les
 * réduirait à une seule. La fonction traite donc chaque côté du « et »
 * séparément.
 *
 * Un prénom déjà seul, « Linn », « Olga », « Sandrine », traverse sans changer.
 */
export function prenom(nom: string): string {
  return nom
    .split(/\s+et\s+/)
    .map((part) => part.trim().split(/\s+/)[0] ?? "")
    .filter(Boolean)
    .join(" et ");
}
