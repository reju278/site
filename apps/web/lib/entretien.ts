import type { Avis } from "@/contenu/avis";

/**
 * Ce qu'une fenêtre d'entretien reçoit, et rien de plus.
 *
 * **Ce type vit dans `lib` et non à côté du composant**, parce qu'il est la
 * couture entre trois endroits qui ne s'importent pas les uns les autres : la
 * route qui le sert, le composant client qui l'affiche et la galerie qui le
 * demande. Écrit dans l'un des trois, les deux autres l'auraient recopié.
 *
 * Les champs sont **bruts**, tels qu'ils sortent d'`avis.ts` : le caviardage et
 * la réécriture des liens se font à l'affichage, comme partout dans ce dépôt.
 */
export type Entretien = {
  id: string;
  /** Le nom complet ; c'est l'affichage qui décide d'en garder le prénom. */
  nom: string;
  secondes: number;
  titre: string;
  chapo: string;
  afficheAlt: string;
  sections: Avis["sections"];
  /** L'autre entretien de la même personne, s'il est sur cette page. */
  autre: { id: string; libelle: string } | null;
};
