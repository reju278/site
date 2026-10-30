import { metadonneesPage, PageTemoignage } from "@/components/page-temoignage";
import { CLES_TEMOIGNAGE, type CleTemoignage } from "@/lib/pages-temoignage";

/**
 * Les pages de témoignage, `go.funnels.club/<clé>` : une par entretien du
 * site. Voir `components/page-temoignage.tsx`.
 *
 * **Figées au build, et seulement celles-là** : `dynamicParams` à `false`
 * rend un 404 pour toute autre adresse à la racine. Sans lui, cette route
 * attraperait n'importe quelle faute de frappe. Les routes écrites en dur,
 * `/resultats` et les autres, passent devant elle.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return CLES_TEMOIGNAGE.map((temoignage) => ({ temoignage }));
}

type Props = { params: Promise<{ temoignage: string }> };

export default async function Temoignage({ params }: Props) {
  const { temoignage } = await params;
  return <PageTemoignage cle={temoignage as CleTemoignage} />;
}

export async function generateMetadata({ params }: Props) {
  const { temoignage } = await params;
  return metadonneesPage(temoignage as CleTemoignage);
}
