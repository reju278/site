import { MentionsLegales } from "@/components/mentions-legales";
import { PiedImmersion } from "@/components/pied-immersion";
import { PoliceGenesis } from "@/components/police-genesis";
import { legalesVsl } from "@/contenu/vsl";

/**
 * Le cadre des pages du tunnel « Formation Genesis » (issue #8) : l'optin et
 * l'espace membre sous `/formation-genesis`, et la réservation à
 * `/reservation`, qui n'est pas sous la même racine parce que Rémy a donné
 * cette adresse.
 *
 * **Écrit une fois pour les deux gabarits**, qui ne font que le poser : un
 * tunnel dont deux pages divergeraient d'un pied de page ou d'une police se
 * verrait au premier clic.
 *
 * `data-genesis` pose les polices et les jetons, voir `globals.css` et
 * `PoliceGenesis`. Les mentions légales sont celles de `/course`, ouvertes
 * dans un nouvel onglet : une page commerciale européenne sans elles est
 * moins conforme, et elles restent dans un tunnel.
 */
export function GabaritGenesis({
  children,
  pied = true,
}: {
  children: React.ReactNode;
  /**
   * Le pied de page (mentions légales et avertissements). Course modèle le
   * retire de son gabarit et ne le pose que sur son opt-in (`PiedGenesis`),
   * sur demande de Rémy : la vidéo, la prise d'appel et la confirmation
   * s'en passent.
   */
  pied?: boolean;
}) {
  return (
    <div
      data-genesis
      /* La largeur des vidéos et des cartes, celle de `/appel`. */
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 72rem)",
        } as React.CSSProperties
      }
    >
      <PoliceGenesis />
      {children}
      {pied ? (
        <PiedGenesis />
      ) : (
        <div aria-hidden className="h-12 sm:h-16" />
      )}
    </div>
  );
}

/** Le pied des pages au dessin de Genesis : l'air au-dessus, puis les
 *  mentions légales (ouvertes dans un nouvel onglet) et les avertissements. */
export function PiedGenesis() {
  return (
    <>
      <div aria-hidden className="h-16 sm:h-24" />
      <PiedImmersion>
        <MentionsLegales nouvelOnglet liens={legalesVsl} />
      </PiedImmersion>
    </>
  );
}
