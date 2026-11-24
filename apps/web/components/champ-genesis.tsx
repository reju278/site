import { PAYS } from "@/lib/telephone";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";
import { ChevronDown } from "lucide-react";

/*
 * Les champs des formulaires au dessin de Formation Genesis : l'optin en
 * trois étapes (`InscriptionGenesis`) et la fenêtre de Course modèle, en
 * trois étapes elle aussi (`InscriptionCourseModele`). Écrits une fois pour
 * les deux, le téléphone compris (`ChampTelephoneGenesis`).
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

/**
 * L'astérisque d'un champ obligatoire, en rouge, à côté du libellé. Muet
 * pour les lecteurs d'écran : le champ dit déjà `aria-required`.
 */
export function Obligatoire() {
  return (
    <span aria-hidden className="text-destructive">
      {" "}
      *
    </span>
  );
}

export function ChampGenesis({
  id,
  libelle,
  obligatoire = false,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  id: string;
  libelle: string;
  /** Un astérisque rouge après le libellé (fenêtre de Course modèle). */
  obligatoire?: boolean;
}) {
  return (
    <div className="grid min-w-0">
      <label htmlFor={id} className={LIBELLE_GENESIS}>
        {libelle}
        {obligatoire ? <Obligatoire /> : null}
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

/**
 * Le téléphone, au même dessin : **un seul cadre autour du pays et du
 * numéro**, qui répond au focus comme les autres champs. Le menu des pays est
 * un `select` natif posé sur le drapeau : sur téléphone, c'est la roue du
 * système qui s'ouvre. Le numéro prend l'exemple du pays choisi.
 *
 * L'optin de Genesis et la fenêtre de Course modèle, qui demandent tous deux
 * le numéro au dernier temps.
 */
export function ChampTelephoneGenesis({
  ref,
  id,
  libelle,
  libellePays,
  pays,
  onPays,
  valeur,
  onValeur,
  faux,
  obligatoire = false,
}: {
  ref?: React.Ref<HTMLInputElement>;
  /** Un astérisque rouge après le libellé. */
  obligatoire?: boolean;
  id: string;
  libelle: string;
  libellePays: string;
  /** Le code du pays choisi (`PAYS`). */
  pays: string;
  onPays: (code: string) => void;
  valeur: string;
  onValeur: (valeur: string) => void;
  /** Le numéro manque ou ne tient pas : la bordure passe au rouge. */
  faux: boolean;
}) {
  const choisi = PAYS.find((p) => p.code === pays) ?? PAYS[0];
  return (
    <div className="grid">
      <label htmlFor={id} className={LIBELLE_GENESIS}>
        {libelle}
        {obligatoire ? <Obligatoire /> : null}
      </label>
      <div
        className={cn(
          CADRE_GENESIS,
          "flex focus-within:border-[var(--genesis-encre)] focus-within:shadow-[0_0_0_1px_var(--genesis-encre)]",
          faux &&
            "border-destructive focus-within:border-destructive focus-within:shadow-[0_0_0_1px_var(--destructive)] hover:border-destructive",
        )}
      >
        <div className="relative flex shrink-0 items-center gap-1.5 border-r border-black/15 px-3">
          <span aria-hidden className="text-xl leading-none">
            {choisi.drapeau}
          </span>
          <span aria-hidden className="text-base tabular-nums">
            {choisi.indicatif}
          </span>
          <ChevronDown aria-hidden className="size-4 text-[#60606b]" />
          <select
            name="country"
            autoComplete="country"
            aria-label={libellePays}
            value={pays}
            onChange={(e) => onPays(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {PAYS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.drapeau} {p.nom} ({p.indicatif})
              </option>
            ))}
          </select>
        </div>
        <input
          ref={ref}
          id={id}
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-required
          placeholder={choisi.exemple}
          aria-invalid={faux}
          value={valeur}
          onChange={(e) => onValeur(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-[17px] text-[var(--genesis-encre)] outline-none placeholder:text-[var(--genesis-gris)] focus-visible:outline-none"
        />
      </div>
    </div>
  );
}
