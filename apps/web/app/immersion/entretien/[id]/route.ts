import { avisDe } from "@/contenu/avis";
import { entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { NextResponse } from "next/server";

/**
 * Un entretien, servi à la demande.
 *
 * **Il existe pour vider la charge utile de la page**, et le chiffre est la
 * raison d'être de ce fichier : les vingt-deux articles étaient rendus par le
 * serveur et passés à la fenêtre, donc **sérialisés dans le HTML même si on
 * n'en ouvrait aucun**. Mesuré : 766 Ko de charge utile React sur une page de
 * 1 Mo, soit les trois quarts, pour du texte qu'on ne lit qu'un à la fois.
 *
 * **Les données partent brutes, et c'est délibéré.** Le caviardage des noms et
 * la réécriture des liens du tunnel s'appliquent à l'affichage, comme partout
 * dans ce dépôt, et c'est `ContenuEntretien` qui les pose. Les transformer ici
 * obligerait à reproduire la façon dont `ArticleAvis` les applique, champ par
 * champ, et deux écritures de la même règle finissent par diverger. Ce qui sort
 * d'ici est exactement ce qui sortait de `avis.ts`.
 *
 * **La réponse est figée au build**, `force-static` et `generateStaticParams` :
 * ce sont vingt-deux fichiers écrits une fois, servis par le CDN comme le reste
 * de la page. Il n'y a pas de calcul à l'exécution, donc pas de temps de
 * réponse à surveiller.
 *
 * **Seuls les entretiens de la page sont servis.** Un identifiant qui n'est pas
 * dans `entretiensImmersion` rend un 404 : cette route n'est pas une API de
 * lecture d'`avis.ts`, c'est le contenu d'une fenêtre de cette page-là.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return entretiensImmersion.map((id) => ({ id }));
}

export async function GET(
  _requete: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!(entretiensImmersion as readonly string[]).includes(id)) {
    return new NextResponse("Entretien inconnu", { status: 404 });
  }

  const temoignage = temoignages.find((t) => t.id === id);
  const article = avisDe(id);
  if (!temoignage || !article) {
    return new NextResponse("Entretien inconnu", { status: 404 });
  }

  /* L'autre entretien de la même personne, **seulement s'il est lui aussi sur
     cette page** : sans ce test, on pointerait vers une ancre qui n'existe
     pas. C'est le même filtre que celui que faisait `ContenuEntretien`. */
  const autre = article.autreEntretien
    ? (entretiensImmersion as readonly string[]).find(
        (x) => avisDe(x)?.slug === article.autreEntretien!.slug,
      )
    : undefined;

  return NextResponse.json({
    id,
    nom: temoignage.nom,
    secondes: temoignage.secondes,
    titre: article.titre,
    chapo: article.chapo,
    afficheAlt: article.afficheAlt,
    sections: article.sections,
    autre: autre
      ? { id: autre, libelle: article.autreEntretien!.libelle }
      : null,
  });
}
