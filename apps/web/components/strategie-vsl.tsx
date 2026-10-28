"use client";

import { strategieVsl } from "@/contenu/vsl";
import { usePrenomVsl, useReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { Area } from "@repo/ui/components/charts/area";
import { AreaChart } from "@repo/ui/components/charts/area-chart";
import { Grid } from "@repo/ui/components/charts/grid";
import { ChartTooltip } from "@repo/ui/components/charts/tooltip/chart-tooltip";
import { useMemo } from "react";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const mois = new Intl.DateTimeFormat("fr-FR", { month: "long" });

/** Remplace les `{cle}` d'un texte de `strategieVsl`. */
function remplir(texte: string, valeurs: Record<string, string>) {
  return texte.replace(
    /\{(\w+)\}/g,
    (tout, cle: string) => valeurs[cle] ?? tout,
  );
}

/**
 * La stratégie personnalisée de `/video-vsl`, sous le bouton de réservation,
 * à la place du calculateur, sur demande de Rémy : voir `strategieVsl`.
 *
 * **Elle ne lit que ce qu'on sait** : le prénom et les trois réponses de la
 * fenêtre d'inscription, gardés dans le navigateur. Sans réponses, elle ne
 * rend rien, plutôt qu'une stratégie « personnalisée » faite de valeurs par
 * défaut.
 *
 * **La courbe est l'aire de Bklit**, sur douze mois à partir du mois
 * prochain : le chiffre d'affaires cumulé au prix actuel, et, quand la
 * tranche en a une, le même nombre de clients au prix visé. L'écart entre les
 * deux aires est ce que la page veut montrer.
 *
 * **Les témoignages sont choisis par activité**, et rendus par le serveur :
 * la page passe une galerie par activité, et celle-ci n'affiche que la bonne.
 * C'est la galerie d'`/immersion`, avec sa fenêtre et sa vidéo.
 */
export function StrategieVsl({
  galeries,
}: {
  /** Une galerie d'entretiens par activité, clé = le choix exact. */
  galeries: Record<string, React.ReactNode>;
}) {
  const prenom = usePrenomVsl();
  const reponses = useReponsesVsl();

  const tranchePrix = reponses?.prix
    ? strategieVsl.prix[reponses.prix]
    : undefined;
  const objectif = reponses?.objectif
    ? strategieVsl.montants[reponses.objectif]
    : undefined;

  const calcul = useMemo(() => {
    if (!tranchePrix || !objectif) return null;
    const { prix, cible } = tranchePrix;
    const clients = Math.ceil(objectif / prix);
    const debut = new Date();
    const donnees = Array.from({ length: 12 }, (_, k) => ({
      date: new Date(debut.getFullYear(), debut.getMonth() + 1 + k, 1),
      actuel: clients * prix * (k + 1),
      ...(cible ? { cible: clients * cible * (k + 1) } : {}),
    }));
    return {
      prix,
      cible,
      clients,
      clientsCible: cible ? Math.ceil(objectif / cible) : null,
      annee: clients * prix * 12,
      anneeCible: cible ? clients * cible * 12 : null,
      donnees,
    };
  }, [tranchePrix, objectif]);

  if (!reponses || !calcul || !objectif) return null;

  const valeurs = {
    prenom,
    objectif: euros.format(objectif),
    prix: euros.format(calcul.prix),
    cible: calcul.cible ? euros.format(calcul.cible) : "",
    clients: String(calcul.clients),
    clientsCible: String(calcul.clientsCible ?? ""),
    annee: euros.format(calcul.annee),
    anneeCible: calcul.anneeCible ? euros.format(calcul.anneeCible) : "",
  };
  const titre = prenom ? strategieVsl.titreAvecPrenom : strategieVsl.titre;
  const activite = reponses.activite
    ? strategieVsl.activites[reponses.activite]
    : undefined;
  const galerie = reponses.activite ? galeries[reponses.activite] : null;

  return (
    <section
      aria-labelledby="strategie-titre"
      className="mx-auto mt-16 w-full max-w-4xl text-left sm:mt-20"
    >
      <div
        className="relief-verre rounded-[25px] p-5 sm:p-8"
        style={{
          backgroundColor: "color-mix(in srgb, currentColor 4%, transparent)",
        }}
      >
        <h2
          id="strategie-titre"
          className="titre text-center text-2xl text-balance text-foreground sm:text-3xl"
        >
          {insecables(remplir(titre, valeurs))}
        </h2>

        <p className="mt-5 text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
          {insecables(remplir(strategieVsl.phraseObjectif, valeurs))}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-pretty text-foreground/85 sm:text-xl">
          {insecables(
            remplir(
              calcul.cible
                ? strategieVsl.projection
                : strategieVsl.projectionSansCible,
              valeurs,
            ),
          )}
        </p>

        {/* La légende, écrite et non devinée : deux aires de deux couleurs
            ne se lisent pas sans elle. */}
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-3 rounded-sm bg-[var(--muted-foreground)]"
            />
            {strategieVsl.legendeActuel}
          </li>
          {calcul.cible ? (
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-3 rounded-sm bg-primary" />
              {insecables(remplir(strategieVsl.legendeCible, valeurs))}
            </li>
          ) : null}
        </ul>

        <div className="mt-3">
          <AreaChart
            data={calcul.donnees}
            aspectRatio="2 / 1"
            margin={{ top: 16, right: 8, bottom: 8, left: 8 }}
          >
            <Grid horizontal vertical={false} numTicksRows={3} />
            {calcul.cible ? (
              <Area
                dataKey="cible"
                fill="var(--primary)"
                stroke="var(--primary)"
                fillOpacity={0.35}
              />
            ) : null}
            <Area
              dataKey="actuel"
              fill="var(--muted-foreground)"
              stroke="var(--muted-foreground)"
              fillOpacity={0.3}
            />
            <ChartTooltip
              showDatePill={false}
              content={({ point }: { point: Record<string, unknown> }) => (
                <div className="rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md tabular-nums">
                  <span className="block font-semibold capitalize">
                    {mois.format(point.date as Date)}
                  </span>
                  <span className="block text-muted-foreground">
                    {euros.format(Number(point.actuel))}
                  </span>
                  {point.cible !== undefined ? (
                    <span className="block text-primary">
                      {euros.format(Number(point.cible))}
                    </span>
                  ) : null}
                </div>
              )}
            />
          </AreaChart>
        </div>

        {activite ? (
          <>
            <h3 className="titre mt-8 text-xl text-foreground sm:text-2xl">
              {strategieVsl.titreActivite}
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-pretty text-foreground/85">
              {insecables(activite)}
            </p>
          </>
        ) : null}
      </div>

      {galerie ? (
        <div className="mt-14">
          <h3 className="titre text-center text-2xl text-balance text-foreground sm:text-3xl">
            {strategieVsl.titreTemoignages}
          </h3>
          <div className="mt-8">{galerie}</div>
        </div>
      ) : null}
    </section>
  );
}
