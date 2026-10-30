import { metadonneesPage, PageTemoignage } from "@/components/page-temoignage";

/** `go.funnels.club/francois` : voir `components/page-temoignage.tsx`. */
export default function Francois() {
  return <PageTemoignage cle="francois" />;
}

export const generateMetadata = () => metadonneesPage("francois");
