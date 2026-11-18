import { PT_Serif, Roboto } from "next/font/google";

/**
 * Les deux polices du tunnel Formation Genesis, relevées sur l'optin
 * ClickFunnels de référence, `funnels.club/course-2027-fb-2`, sur demande de
 * Rémy : **PT Serif** pour tout le texte, titres compris (400 et 700), et
 * **Roboto 700** pour les boutons, seul endroit où la référence quitte
 * l'empattement.
 *
 * Chargées ici et posées par le gabarit du tunnel, comme `PoliceTunnel` pour
 * le VSL : `next/font` ne précharge les fichiers que sur ces pages.
 */
const texte = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const bouton = Roboto({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

/**
 * Déclare les polices pour toute la page, **sur la racine** : la fenêtre
 * d'inscription est rendue dans un portail, hors du gabarit, et une variable
 * posée sur celui-ci ne l'atteindrait pas. La règle de `globals.css` vise
 * `:root:has([data-genesis])`.
 */
export function PoliceGenesis() {
  return (
    <style>{`:root:has([data-genesis]){--font-genesis:${texte.style.fontFamily};--font-genesis-bouton:${bouton.style.fontFamily}}`}</style>
  );
}
