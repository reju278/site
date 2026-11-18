import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

/**
 * Le bouton du tunnel Formation Genesis, relevé sur l'optin ClickFunnels de
 * référence (`elButton`), sur demande de Rémy : aplat bleu #438bf7, **angles
 * droits**, texte blanc en Roboto 700 et en capitales, 24 px en large.
 *
 * **Les angles droits sont une exception à la règle des 5 px**, décidée par
 * Rémy en demandant que le tunnel colle à sa référence, boutons compris. Elle
 * ne s'étend à rien d'autre : voir `AGENTS.md`.
 *
 * Le blanc sur ce bleu tient 3,35:1, c'est-à-dire le seuil du grand texte
 * gras et pas celui du texte courant : le corps ne descend donc jamais sous
 * 20 px gras, téléphone compris.
 *
 * Trois formes, une seule apparence : un lien interne (`href`), un bouton
 * d'envoi (`soumettre`) ou un bouton qui agit (`onClick`). Ce qui navigue est
 * un lien, ce qui agit est un bouton.
 */
export function BoutonGenesis({
  href,
  soumettre,
  onClick,
  disabled,
  className,
  children,
}: {
  href?: string;
  soumettre?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  /* **Plus de présence**, sur demande de Rémy, qui le trouvait trop
     effacé, et sur le geste du bouton d'Arc UI (`uiarc.dev`) : il
     s'enfonce de 2 % à l'appui et gagne une ombre au survol. L'ombre est
     bleue et portée sous le bouton, comme sur sa référence, pour qu'il se
     détache du blanc ; elle prend la couleur du bouton par `color-mix` et
     ne peut donc pas s'en écarter. Angles droits et aplat inchangés.
     L'enfoncement et la montée sont des translations et des échelles,
     posées sur `scale` et `translate` (Tailwind v4) et seulement sans
     mouvement réduit. */
  const classes = cn(
    "flex min-h-14 w-full items-center justify-center rounded-none bg-[var(--genesis-bleu)] px-5 py-3 text-center font-[family-name:var(--font-genesis-bouton)] text-xl leading-tight font-bold tracking-[0.02em] text-white uppercase shadow-[0_12px_24px_-12px_color-mix(in_srgb,var(--genesis-bleu)_80%,transparent)] transition-[filter,box-shadow,scale,translate] duration-150 hover:shadow-[0_16px_32px_-12px_color-mix(in_srgb,var(--genesis-bleu)_95%,transparent)] hover:brightness-[0.96] active:brightness-90 disabled:opacity-70 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] sm:text-2xl",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={soumettre ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
