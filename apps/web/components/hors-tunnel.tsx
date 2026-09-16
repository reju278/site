"use client";

import { usePathname } from "next/navigation";
import { dansUnTunnel } from "@/lib/tunnels";

/**
 * Ce qui n'a pas le droit d'apparaître dans un tunnel : l'en-tête et le pied
 * de page du site.
 *
 * Un tunnel est une page où l'on arrive par un lien qu'on a reçu, et sa règle
 * est qu'on n'en sort que par le bouton d'appel. Or l'en-tête et le pied de page sont posés par
 * `layout.tsx` sur **toutes** les pages du site : sans ce filtre, ils
 * offriraient au visiteur une trentaine de portes de sortie, menu déroulant
 * compris.
 *
 * **Pourquoi ici et pas dans les deux composants.** Ils auraient pu se taire
 * eux-mêmes, mais `PiedDePage` est un composant serveur et ne peut pas lire
 * l'adresse courante ; et surtout, une règle écrite à deux endroits finit par
 * n'être corrigée qu'à un seul. Le filtre est donc unique et s'applique aux
 * deux d'un coup.
 *
 * **Pourquoi pas un second layout racine.** Next sait le faire, avec un groupe
 * de routes et deux `<html>` distincts, et ce serait plus étanche. Mais ça
 * demande de déplacer toutes les pages existantes dans un groupe, donc de
 * toucher tout le site pour ajouter une page : Rémy a demandé qu'on ne touche à
 * rien d'actuel. Ce composant est le prix de cette contrainte, et il ne change
 * rien au rendu des pages existantes.
 *
 * **Il n'y a pas de clignotement.** `usePathname` est renseigné dès le rendu
 * serveur d'un composant client, donc le HTML servi pour un tunnel ne contient ni
 * en-tête ni pied de page. Ils ne sont pas cachés en CSS, ils ne sont pas là :
 * leurs liens ne sont donc pas non plus atteignables au clavier.
 */
export function HorsTunnel({ children }: { children: React.ReactNode }) {
  const chemin = usePathname();
  if (dansUnTunnel(chemin)) return null;
  return <>{children}</>;
}
