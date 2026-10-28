import { EnTeteImmersion } from "@/components/en-tete-immersion";

/**
 * L'en-tête des pages légales de l'opt-in : la marque seule, comme sur les
 * autres pages du tunnel. La page d'inscription n'en a pas, sur demande de
 * Rémy ; le groupe `(legales)` le rend aux trois pages légales sans changer
 * leurs adresses (`/course/cgv`, `/course/confidentialite`,
 * `/course/mentions`).
 */
export default function LayoutLegalesCourse({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <EnTeteImmersion ancres={[]} bascule={false} />
      {children}
    </>
  );
}
