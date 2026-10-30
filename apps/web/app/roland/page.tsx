import { metadonneesPage, PageTemoignage } from "@/components/page-temoignage";

/** `go.funnels.club/roland` : voir `components/page-temoignage.tsx`. */
export default function Roland() {
  return <PageTemoignage cle="roland" />;
}

export const generateMetadata = () => metadonneesPage("roland");
