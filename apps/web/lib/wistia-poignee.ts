"use client";

/**
 * La poignée d'un lecteur Wistia en iframe, pour agir dessus depuis la page
 * (vitesse de lecture, `VitesseVideo`) ou l'écouter (où la vidéo s'est
 * arrêtée, `SuiviArretVideo`).
 *
 * **Le lecteur est une iframe d'une autre origine**, que la page ne peut pas
 * toucher. Le chemin, relevé et mesuré le 24 novembre 2026 : l'iframe porte
 * `wistia_embed` dès sa création (`LecteurVideo pilotable`), la page charge
 * `E-v1.js`, le script de Wistia, qui reconnaît l'iframe et rend sa poignée
 * (`_wq`, `onReady`). Une iframe marquée après le chargement du script n'est
 * jamais reconnue.
 *
 * La poignée d'une iframe n'a pas toutes les méthodes d'un lecteur classique
 * (pas de `playbackRate()`), mais toutes passent par le même canal,
 * `postMessage(méthode, arguments)`, que le lecteur relaie à sa vidéo.
 */

export type Poignee = {
  playbackRate?: (vitesse: number) => void;
  postMessage?: (methode: string, ...args: unknown[]) => void;
  bind?: (evenement: string, rappel: (...args: unknown[]) => void) => void;
  time?: () => number;
};

type FenetreWistia = Window & {
  _wq?: { id: string; onReady: (video: Poignee) => void }[];
};

/** Le script de Wistia, chargé une fois pour toute la page. */
let script: Promise<void> | null = null;
const chargerWistia = () =>
  (script ??= new Promise<void>((fin) => {
    const balise = document.createElement("script");
    balise.src = "https://fast.wistia.net/assets/external/E-v1.js";
    balise.async = true;
    balise.onload = () => fin();
    balise.onerror = () => {
      /* Wistia injoignable : on retentera au prochain appel. */
      script = null;
      fin();
    };
    document.head.appendChild(balise);
  }));

/** Une promesse de poignée par vidéo : demandée deux fois, rendue une fois. */
const poignees = new Map<string, Promise<Poignee>>();

/** La poignée du lecteur d'une vidéo, quand Wistia l'a reconnu. */
export function poigneeWistia(id: string): Promise<Poignee> {
  const connue = poignees.get(id);
  if (connue) return connue;
  const promesse = chargerWistia().then(
    () =>
      new Promise<Poignee>((rendre) => {
        const fenetre = window as FenetreWistia;
        fenetre._wq = fenetre._wq || [];
        fenetre._wq.push({ id, onReady: rendre });
      }),
  );
  poignees.set(id, promesse);
  return promesse;
}
