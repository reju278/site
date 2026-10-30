import { CadreTemoignage, metadonneesCadre } from "@/components/page-temoignage";

export const metadata = metadonneesCadre("roland");

export default function LayoutRoland({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CadreTemoignage>{children}</CadreTemoignage>;
}
