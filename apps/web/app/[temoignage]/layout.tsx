import { CadreTemoignage, metadonneesCadre } from "@/components/page-temoignage";
import type { CleTemoignage } from "@/lib/pages-temoignage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ temoignage: string }>;
}) {
  const { temoignage } = await params;
  return metadonneesCadre(temoignage as CleTemoignage);
}

export default function LayoutTemoignage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CadreTemoignage>{children}</CadreTemoignage>;
}
