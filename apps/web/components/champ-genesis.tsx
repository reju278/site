import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

/*
 * Les champs des formulaires au dessin de Formation Genesis : l'optin en
 * trois étapes (`InscriptionGenesis`) et la fenêtre de Course modèle
 * (`InscriptionCourseModele`). Écrits une fois pour les deux.
 *
 * Refaits deux fois sur demande de Rémy. La seconde fois, sur le dessin du
 * champ d'Arc UI (`uiarc.dev`) : **un libellé au-dessus, un cadre d'un
 * pixel, aucune ombre, et le focus qui ne répond que par la bordure**. Leur
 * fichier n'est pas installé : il est écrit en `.module.css`, que ce dépôt
 * n'admet pas. Le dessin est donc repris en Tailwind, sur l'`Input` de shadcn
 * déjà présent, dont on retire l'ombre et l'anneau.
 *
 * Ce qui reste à nous : **les angles droits**, ceux du bouton, que Rémy a
 * demandé de garder ; le blanc ; et la bordure à 45 % de noir, le seuil de
 * 3:1 d'une bordure de contrôle. Au focus, elle passe au noir et double
 * d'épaisseur par une ombre d'un pixel, sans changer la taille du champ :
 * c'est l'indicateur qui remplace, ici seulement, le contour bleu global.
 *
 * 17 px de corps : en dessous de 16, l'iPhone zoome sur le champ.
 */
export const CADRE_GENESIS =
  "h-[52px] w-full min-w-0 rounded-none border border-black/45 bg-white transition-[border-color,box-shadow] hover:border-[var(--genesis-encre)]";

export const LIBELLE_GENESIS =
  "mb-2 font-[family-name:var(--font-genesis-bouton)] text-sm font-medium text-[var(--genesis-encre)]";

export function ChampGenesis({
  id,
  libelle,
  className,
  ...props
}: React.ComponentProps<"input"> & { id: string; libelle: string }) {
  return (
    <div className="grid min-w-0">
      <label htmlFor={id} className={LIBELLE_GENESIS}>
        {libelle}
      </label>
      <Input
        id={id}
        className={cn(
          CADRE_GENESIS,
          "px-4 text-[17px] shadow-none placeholder:text-[var(--genesis-gris)] focus-visible:ring-0 aria-invalid:ring-0 md:text-[17px] dark:bg-white text-[var(--genesis-encre)] outline-none focus-visible:border-[var(--genesis-encre)] focus-visible:shadow-[0_0_0_1px_var(--genesis-encre)] focus-visible:outline-none aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:shadow-[0_0_0_1px_var(--destructive)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}
