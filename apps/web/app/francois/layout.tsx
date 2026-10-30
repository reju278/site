import { CadreTemoignage, metadonneesCadre } from "@/components/page-temoignage";

export const metadata = metadonneesCadre("francois");

export default function LayoutFrancois({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CadreTemoignage>{children}</CadreTemoignage>;
}
