"use client";

import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { poigneeWistia, type Poignee } from "@/lib/wistia-poignee";
import { useId, useState } from "react";

/**
 * La vitesse de lecture d'une vidéo Wistia, sous le lecteur, sur demande de
 * Rémy pour la vidéo de Course modèle : un choix agit **sur le lecteur de
 * Wistia lui-même**, comme son propre réglage.
 *
 * **Le lecteur est une iframe d'une autre origine**, que la page ne peut pas
 * toucher. Le chemin, relevé et mesuré le 24 novembre 2026 :
 *
 * 1. l'iframe porte `wistia_embed` dès sa création (`LecteurVideo pilotable`) ;
 * 2. la page charge `E-v1.js`, le script de Wistia, qui reconnaît l'iframe
 *    et rend sa poignée (`poigneeWistia`, `lib/wistia-poignee.ts`) ;
 * 3. **la poignée d'une iframe n'a pas de `playbackRate()`**, seulement
 *    `play`, `time`, `volume`… Mais toutes passent par le même canal,
 *    `postMessage(méthode, arguments)`, que le lecteur relaie à sa vidéo :
 *    `postMessage("playbackRate", 2)` la fait avancer de 6,16 s en 3 s.
 *
 * Une poignée de lecteur classique (sans iframe) a sa vraie méthode : elle
 * est préférée quand elle existe.
 *
 * Le groupe de bascules est celui du registre shadcn (`toggle-group`), au
 * dessin du tunnel : angles droits (`[data-genesis]`), bordure à 45 % de
 * noir comme les champs, choix courant sur le bleu du bouton, **texte
 * noir** : le blanc n'y tient que 3,35:1 à cette taille.
 */

const VITESSES = [1, 1.25, 1.5, 2] as const;

/** La vitesse choisie, par vidéo, et les vidéos dont le départ est écouté. */
const choisies = new Map<string, number>();
const ecoutees = new Set<string>();

const regler = (video: Poignee, vitesse: number) => {
  if (typeof video.playbackRate === "function") video.playbackRate(vitesse);
  else video.postMessage?.("playbackRate", vitesse);
};

async function appliquer(id: string, vitesse: number) {
  choisies.set(id, vitesse);
  const video = await poigneeWistia(id);
  regler(video, choisies.get(id) ?? vitesse);
  if (ecoutees.has(id)) return;
  ecoutees.add(id);
  /* **Wistia repart à 1x au lancement** : une vitesse choisie avant de
     lancer la vidéo était perdue, mesuré. Elle est donc reposée à chaque
     départ de la lecture. */
  video.bind?.("play", () => regler(video, choisies.get(id) ?? 1));
}

/** « 1,25x » : la virgule française. */
const libelle = (vitesse: number) => `${String(vitesse).replace(".", ",")}x`;

export function VitesseVideo({
  id,
  intitule = "Vitesse de lecture",
}: {
  /** L'identifiant Wistia de la vidéo, celui du `LecteurVideo pilotable`. */
  id: string;
  intitule?: string;
}) {
  const [vitesse, setVitesse] = useState("1");
  const etiquette = useId();

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
      <span
        id={etiquette}
        className="font-[family-name:var(--font-genesis-bouton)] text-sm font-medium"
      >
        {intitule}
      </span>
      <ToggleGroup
        type="single"
        variant="outline"
        value={vitesse}
        aria-labelledby={etiquette}
        onValueChange={(valeur) => {
          // Un second appui sur le choix courant le désélectionnerait : on le
          // garde, une vitesse est toujours choisie.
          if (!valeur) return;
          setVitesse(valeur);
          void appliquer(id, Number(valeur));
        }}
      >
        {VITESSES.map((choix) => (
          <ToggleGroupItem
            key={choix}
            value={String(choix)}
            aria-label={`Lire à ${libelle(choix)}`}
            className="h-10 min-w-14 border-black/45 bg-white font-[family-name:var(--font-genesis-bouton)] text-sm text-[var(--genesis-encre)] tabular-nums shadow-none hover:bg-black/[0.04] hover:text-[var(--genesis-encre)] data-[state=on]:bg-[var(--genesis-bleu)] data-[state=on]:font-bold data-[state=on]:text-[var(--genesis-encre)]"
          >
            {libelle(choix)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
