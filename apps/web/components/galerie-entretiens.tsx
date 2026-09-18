import { ContenuEntretien } from "@/components/contenu-entretien";
import { GalerieFenetre, type EntretienGalerie } from "@/components/galerie-fenetre";
import { avisDe } from "@/contenu/avis";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { sansNoms } from "@/lib/anonymat";

/**
 * La galerie des entretiens : les cartes de `/resultats`, mais qui ouvrent
 * l'entretien dans une fenêtre au lieu de mener à une page.
 *
 * **Ce fichier ne dessine plus rien.** Il prépare les données et rend les
 * articles ; les cartes et la fenêtre vivent dans `GalerieFenetre`, qui est un
 * composant client. La coupure est là et pas ailleurs pour une raison précise :
 * depuis que Rémy veut des flèches pour passer d'un témoignage au suivant, il
 * faut **une seule** fenêtre et un état partagé, donc du JavaScript ; mais le
 * corps des vingt-deux articles doit rester côté serveur.
 *
 * **C'est ce qui garde `avis.ts` hors du paquet JavaScript**, cinq cents
 * kilooctets qui traverseraient sinon le réseau une seconde fois. Les articles
 * sont rendus ici et passés déjà faits ; le composant client ne fait que choisir
 * lequel montrer.
 *
 * **Le corps de l'article n'est pas réécrit**, il vient d'`ArticleAvis`, le même
 * composant que sert `/resultats/<nom>`. Les surlignages, les citations et les
 * liens en contexte sont donc les mêmes objets, pas des copies.
 *
 * **Les liens de l'article passent par `versImmersion`.** Un article qui renvoie
 * à l'entretien d'une autre personne présente sur la page renvoie à l'ancre de
 * son lecteur ; tout le reste est déshabillé. On n'ouvre pas une porte de sortie
 * au milieu d'un tunnel.
 *
 * **Pas de transcription dans la fenêtre**, et c'est un choix. Sur une page
 * interdite d'index, mille mots de parole non relue n'apportent aucun
 * référencement ; elles restent sur `/resultats/<nom>`, où elles font leur
 * travail. C'est déjà la règle du hub, dans `AGENTS.md`.
 */
export function GalerieEntretiens() {
  /* Le nom, l'accroche, la durée et l'affiche sont lus dans `temoignages` et
     `avis.ts`, jamais réécrits ici. Un entretien retiré de là disparaît d'ici
     sans laisser de carte vide.

     **Le nom de famille s'affiche quand il existe**, sur demande de Rémy, là où
     la carte ne portait que le prénom. C'est une exception à `lib/prenom.ts`, et
     elle se limite aux entretiens : ces personnes ont accepté d'être filmées et
     leur nom complet est déjà publié sur `/resultats/<nom>`, alors que les
     membres du mur ont écrit dans un groupe privé et gardent leur prénom seul.

     Huit des vingt-deux en ont un dans les données, les autres n'ont jamais été
     enregistrés qu'avec leur prénom : il n'y a donc rien à conditionner, le
     champ porte déjà ce qu'on sait de chacun. */
  const entretiens = entretiensImmersion.flatMap<EntretienGalerie>((id) => {
    const temoignage = temoignages.find((t) => t.id === id);
    const article = avisDe(id);
    if (!temoignage || !article) return [];

    return [
      {
        id,
        ancre: ancreEntretien(id),
        nom: temoignage.nom,
        description: temoignage.description,
        secondes: temoignage.secondes,
        chapo: sansNoms(article.chapo),
        contenu: <ContenuEntretien id={id} />,
      },
    ];
  });

  return <GalerieFenetre entretiens={entretiens} />;
}
