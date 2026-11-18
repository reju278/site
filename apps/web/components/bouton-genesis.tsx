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
  const classes = cn(
    "flex min-h-[52px] w-full items-center justify-center rounded-none bg-[var(--genesis-bleu)] px-5 py-3 text-center font-[family-name:var(--font-genesis-bouton)] text-xl leading-tight font-bold text-white uppercase transition-[filter] hover:brightness-95 disabled:opacity-70 sm:text-2xl",
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
