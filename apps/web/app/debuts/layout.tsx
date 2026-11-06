import { CadrePageVideo } from "@/components/cadre-page-video";
import type { Metadata } from "next";

/** Une page de tunnel : hors du site, interdite d'index, absente de `sitemap.ts`. */
export const metadata: Metadata = {
  alternates: { canonical: "https://go.funnels.club/debuts" },
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LayoutDebuts({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CadrePageVideo>{children}</CadrePageVideo>;
}
