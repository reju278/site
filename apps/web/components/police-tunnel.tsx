import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * La police des titres du tunnel VSL (`/course`, `/video-vsl`, `/appel`,
 * `/thanks`), choisie par Rémy parmi dix propositions : plus moderne que
 * Fraunces, qui reste celle du reste du site.
 *
 * **Chargée ici et posée par les gabarits du tunnel, pas par le gabarit
 * racine** : `next/font` précharge le fichier sur les routes qui l'emploient,
 * donc il ne part que sur ces quatre pages, et il y part tôt, le titre étant
 * le premier objet qu'on regarde.
 *
 * Une seule graisse, 800 : elle ne sert qu'aux titres.
 */
const policeTunnel = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

/**
 * Déclare la police du tunnel pour toute la page.
 *
 * **Sur la racine et non sur le gabarit**, parce que la fenêtre d'inscription
 * de `/course` est rendue dans un portail, hors du gabarit : une variable posée
 * sur celui-ci ne l'atteindrait pas, et son titre resterait en Fraunces. La
 * règle de `globals.css` vise donc `:root:has([data-police-tunnel])`, et ce
 * composant donne la valeur à `--font-tunnel` au même endroit.
 */
export function PoliceTunnel() {
  return (
    <style>{`:root:has([data-police-tunnel]){--font-tunnel:${policeTunnel.style.fontFamily}}`}</style>
  );
}
