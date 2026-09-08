import { Emplacement } from "@/components/section";

/**
 * Le gabarit des pages légales.
 *
 * Ces pages n'ont pas de texte pour l'instant, et c'est délibéré : une mention
 * légale approximative engage la société qui la publie, et le droit de
 * rétractation ne s'improvise pas. La page dit donc ce qu'elle attend au lieu
 * d'afficher une prose vraisemblable que personne ne relirait.
 */
export function PageLegale({
  titre,
  attendu,
}: {
  titre: string;
  attendu: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 sm:pt-40">
      <h1 className="titre text-4xl text-foreground sm:text-5xl">{titre}</h1>
      <Emplacement attendu={attendu} className="mt-10" />
    </div>
  );
}
