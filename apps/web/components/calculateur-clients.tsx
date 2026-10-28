"use client";

import { calculateurVsl, departCalculateurVsl } from "@/contenu/vsl";
import { useReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { Area } from "@repo/ui/components/charts/area";
import { AreaChart } from "@repo/ui/components/charts/area-chart";
import { Grid } from "@repo/ui/components/charts/grid";
import { ChartTooltip } from "@repo/ui/components/charts/tooltip/chart-tooltip";
import { Slider } from "@repo/ui/components/slider";
import { useEffect, useId, useMemo, useState } from "react";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/**
 * Le calculateur de `/video-vsl`, sous le bouton de réservation, sur demande
 * de Rémy : combien de clients par mois pour atteindre un objectif, selon le
 * prix de l'offre.
 *
 * **Un curseur et deux nombres, rien d'autre**, parce que Rémy le voulait
 * « extrêmement fluide et simple ». Le calcul est instantané : aucun bouton
 * « calculer », le résultat suit le doigt.
 *
 * **La courbe est l'aire de Bklit**, le registre des graphiques du projet.
 * Elle porte le chiffre d'affaires mois par mois selon le nombre de clients,
 * et va un peu au-delà de l'objectif, sur demande de Rémy, pour qu'on voie la
 * ligne franchie. L'objectif est la ligne surlignée de la grille.
 *
 * **L'axe horizontal de Bklit est un axe de dates**, et il n'y a rien à dater
 * ici : chaque point reçoit une date fictive, un jour par client, qui ne
 * s'affiche nulle part (ni axe, ni pastille de date dans l'infobulle).
 */
export function CalculateurClients() {
  const [prix, setPrix] = useState<number>(calculateurVsl.prixDepart);
  const [objectif, setObjectif] = useState<number>(
    calculateurVsl.objectifDepart,
  );
  /* Les réponses au questionnaire règlent le point de départ, sur demande
     de Rémy : le calculateur s'ouvre sur sa tranche de prix et d'objectif.
     Ensuite, c'est le curseur qui décide. */
  const reponses = useReponsesVsl();
  useEffect(() => {
    const prixRepondu =
      reponses?.prix && departCalculateurVsl.prix[reponses.prix];
    const objectifRepondu =
      reponses?.objectif && departCalculateurVsl.objectif[reponses.objectif];
    if (prixRepondu) setPrix(prixRepondu);
    if (objectifRepondu) setObjectif(objectifRepondu);
  }, [reponses]);
  const idPrix = useId();
  const idObjectif = useId();

  const clients = Math.max(1, Math.ceil(objectif / Math.max(prix, 1)));

  /* Un peu au-delà de l'objectif : un quart de clients en plus, deux au
     moins, pour que la courbe dépasse visiblement la ligne. */
  const donnees = useMemo(() => {
    const fin = clients + Math.max(2, Math.ceil(clients / 4));
    return Array.from({ length: fin + 1 }, (_, n) => ({
      date: new Date(2026, 0, 1 + n),
      clients: n,
      chiffre: n * prix,
    }));
  }, [clients, prix]);

  return (
    <section
      aria-labelledby={`${idPrix}-titre`}
      className="relief-verre mx-auto mt-16 w-full max-w-3xl rounded-[25px] p-5 text-left sm:mt-20 sm:p-8"
      style={{
        backgroundColor: "color-mix(in srgb, currentColor 4%, transparent)",
      }}
    >
      <h2
        id={`${idPrix}-titre`}
        className="titre text-center text-2xl text-balance text-foreground sm:text-3xl"
      >
        {insecables(
          `${calculateurVsl.titreAvant}${euros.format(objectif)}${calculateurVsl.titreApres}`,
        )}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label
            htmlFor={idPrix}
            className="block text-sm font-medium text-muted-foreground"
          >
            {calculateurVsl.libellePrix}
          </label>
          <p className="titre mt-1 text-3xl text-foreground tabular-nums">
            {euros.format(prix)}
          </p>
          {/* `[role=slider]` n'est pas dans la règle globale du curseur de
              désignation : la poignée se tire, elle le dit ici. */}
          <Slider
            id={idPrix}
            aria-label={calculateurVsl.libellePrix}
            min={calculateurVsl.prixMin}
            max={calculateurVsl.prixMax}
            step={calculateurVsl.pasPrix}
            value={[prix]}
            onValueChange={([valeur]) => setPrix(valeur ?? prix)}
            className="mt-4 py-2 [&_[role=slider]]:size-6 [&_[role=slider]]:cursor-grab active:[&_[role=slider]]:cursor-grabbing"
          />
        </div>

        <div>
          <label
            htmlFor={idObjectif}
            className="block text-sm font-medium text-muted-foreground"
          >
            {calculateurVsl.libelleObjectif}
          </label>
          {/* Un champ et non un curseur : l'objectif se tape, il ne se
              cherche pas. `inputMode` ouvre le pavé numérique sur téléphone,
              et 16 px de texte évitent le zoom automatique de Safari. */}
          <div className="mt-1 flex items-baseline gap-2">
            <input
              id={idObjectif}
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              value={objectif || ""}
              onChange={(e) => setObjectif(Math.max(0, Number(e.target.value)))}
              className="titre w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-3xl text-foreground tabular-nums focus-visible:outline-2 focus-visible:outline-ring"
            />
            <span className="shrink-0 text-base text-muted-foreground">
              {calculateurVsl.parMois}
            </span>
          </div>
        </div>
      </div>

      {/* Le résultat, en gros : c'est la réponse à la question du titre.
          `aria-live` le fait annoncer quand il change. */}
      <p
        aria-live="polite"
        className="mt-7 text-center text-lg text-pretty text-foreground sm:text-xl"
      >
        <span className="titre block text-5xl text-primary tabular-nums sm:text-6xl">
          {clients}
        </span>
        {insecables(
          `${clients > 1 ? calculateurVsl.clientsPluriel : calculateurVsl.clientsSingulier} à ${euros.format(prix)}, soit ${euros.format(clients * prix)} par mois.`,
        )}
      </p>

      <div className="mt-4">
        <AreaChart
          data={donnees}
          aspectRatio="2 / 1"
          margin={{ top: 16, right: 8, bottom: 8, left: 8 }}
          animationDuration={600}
        >
          <Grid
            horizontal
            vertical={false}
            numTicksRows={3}
            highlightRowValues={[objectif]}
            highlightRowStroke="var(--primary)"
            highlightRowStrokeOpacity={0.8}
            highlightRowStrokeDasharray="6,4"
          />
          <Area
            dataKey="chiffre"
            fill="var(--primary)"
            stroke="var(--primary)"
            fillOpacity={0.35}
          />
          <ChartTooltip
            showDatePill={false}
            content={({ point }: { point: Record<string, unknown> }) => (
              <div className="rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md tabular-nums">
                <span className="block font-semibold">
                  {euros.format(Number(point.chiffre))}
                </span>
                <span className="block text-muted-foreground">
                  {Number(point.clients)}{" "}
                  {Number(point.clients) > 1
                    ? calculateurVsl.clientsPluriel
                    : calculateurVsl.clientsSingulier}
                </span>
              </div>
            )}
          />
        </AreaChart>
      </div>
    </section>
  );
}
