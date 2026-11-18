import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

/**
 * Le bouton du tunnel Formation Genesis, relevé sur l'optin ClickFunnels de
 * référence (`elButton`), sur demande de Rémy : aplat bleu #438bf7, **angles
 * droits**, texte blanc en Roboto 700 et en capitales.
 *
 * **Les angles droits sont une exception à la règle des 5 px**, décidée par
 * Rémy en demandant que le tunnel colle à sa référence, boutons compris. Elle
 * ne s'étend à rien d'autre : voir `AGENTS.md`.
 *
 * **Le texte est à 19 px, et c'est un plancher.** Rémy le trouvait trop gros
 * pour le bouton à 24 px. Mais le blanc sur ce bleu ne tient que 3,35:1, le
 * seuil du grand texte gras et pas celui du texte courant ; le grand texte
 * gras commence à 18,66 px (14 pt). En dessous de 19 px, le bouton deviendrait
 * illisible au sens des règles d'accessibilité. Pour le réduire encore, il
 * faudrait foncer le bleu, ce qui est une décision de Rémy.
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
  /* **Un aplat sans ombre**, sur demande de Rémy : l'ombre bleue portée et
     la montée au survol ont été essayées et retirées. Il garde le geste du
     bouton d'Arc UI (`uiarc.dev`), invisible au repos : il s'enfonce de 2 %
     à l'appui, posé sur `scale` (Tailwind v4) et seulement sans mouvement
     réduit. */
  const classes = cn(
    "flex min-h-14 w-full items-center justify-center rounded-none bg-[var(--genesis-bleu)] px-6 py-3 text-center font-[family-name:var(--font-genesis-bouton)] text-[19px] leading-tight font-bold tracking-[0.04em] text-white uppercase transition-[filter,scale] duration-150 hover:brightness-[0.96] active:brightness-90 disabled:opacity-70 motion-safe:active:scale-[0.98]",
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
