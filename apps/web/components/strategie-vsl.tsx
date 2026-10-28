"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { jaune } from "@/components/titre-video-vsl";
import { strategieVsl } from "@/contenu/vsl";
import { usePrenomVsl, useReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { Area } from "@repo/ui/components/charts/area";
import { AreaChart } from "@repo/ui/components/charts/area-chart";
import { Grid } from "@repo/ui/components/charts/grid";
import { useChartStable } from "@repo/ui/components/charts/chart-context";
import { ChartTooltip } from "@repo/ui/components/charts/tooltip/chart-tooltip";
import { useEffect, useMemo, useState } from "react";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** Remplace les `{cle}` d'un texte de `strategieVsl`. */
function remplir(texte: string, valeurs: Record<string, string>) {
  return texte.replace(
    /\{(\w+)\}/g,
    (tout, cle: string) => valeurs[cle] ?? tout,
  );
}

/**
 * Comme `remplir`, mais chaque valeur chiffrée passe au surligneur jaune,
 * celui de la lettre de `/course`, sur demande de Rémy : ce sont les points
 * clés de la phrase. Le prénom, lui, reste nu.
 */
function remplirSurligne(texte: string, valeurs: Record<string, string>) {
  return insecables(texte)
    .split(/(\{\w+\})/)
    .map((morceau, i) => {
      const cle = /^\{(\w+)\}$/.exec(morceau)?.[1];
      if (!cle || !(cle in valeurs)) return morceau;
      if (cle === "prenom") return valeurs[cle];
      return (
        <mark key={i} className="surlignage" style={jaune}>
          {insecables(valeurs[cle]!)}
        </mark>
      );
    });
}

const eurosCourts = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * Les valeurs de l'axe vertical, à gauche de la courbe, sur demande de Rémy :
 * zéro, l'objectif et le haut de l'échelle.
 *
 * **Son nom d'affichage est `YAxis`**, et c'est fonctionnel : Bklit range
 * sous le masque d'apparition tout ce qu'il ne reconnaît pas, masque qui
 * s'arrête au bord de la zone tracée et couperait ces étiquettes, posées dans
 * la marge. Il laisse dehors les composants qui portent ce nom.
 */
function EtiquettesY({ valeurs }: { valeurs: number[] }) {
  const { yScale } = useChartStable();
  return (
    <g aria-hidden className="fill-muted-foreground text-[11px] tabular-nums">
      {valeurs.map((v) => (
        <text key={v} x={-8} y={yScale(v)} dy="0.32em" textAnchor="end">
          {`${eurosCourts.format(v)} €`}
        </text>
      ))}
    </g>
  );
}
EtiquettesY.displayName = "YAxis";

/** Les nombres de clients sous la courbe. Même raison pour le nom. */
function EtiquettesX({
  points,
}: {
  points: { date: Date; clients: number }[];
}) {
  const { xScale, innerHeight } = useChartStable();
  return (
    <g aria-hidden className="fill-muted-foreground text-[11px] tabular-nums">
      {points.map((p) => (
        <text
          key={p.clients}
          x={xScale(p.date)}
          y={innerHeight + 18}
          textAnchor="middle"
        >
          {p.clients}
        </text>
      ))}
    </g>
  );
}
EtiquettesX.displayName = "XAxis";

/**
 * Une étiquette en pastille, en SVG : un fond arrondi sous un texte court.
 * La largeur est estimée sur le nombre de caractères, ce qui suffit à des
 * libellés de quelques mots en 12 px.
 */
function Pastille({
  x,
  y,
  texte,
  fond,
  encre = "#fff",
  ancre = "middle",
}: {
  x: number;
  y: number;
  texte: string;
  fond: string;
  encre?: string;
  ancre?: "start" | "middle" | "end";
}) {
  const largeur = texte.length * 6.8 + 16;
  const gauche =
    ancre === "start" ? x : ancre === "end" ? x - largeur : x - largeur / 2;
  return (
    <g>
      <rect
        x={gauche}
        y={y - 11}
        width={largeur}
        height={22}
        rx={11}
        style={{ fill: fond }}
      />
      <text
        x={gauche + largeur / 2}
        y={y}
        dy="0.35em"
        textAnchor="middle"
        style={{ fill: encre }}
      >
        {texte}
      </text>
    </g>
  );
}

/**
 * Les repères qui rendent la courbe lisible sans la toucher, sur demande de
 * Rémy : sur téléphone, il n'y a pas de survol, donc rien de ce que dit
 * l'infobulle ne se voit.
 *
 * - **Chaque courbe porte son nom à son extrémité**, « Ton prix actuel » et
 *   « Offre à … », au lieu d'une légende à part qu'il faut faire correspondre.
 * - **La ligne de l'objectif porte son montant**, en pastille.
 * - **Là où chaque courbe atteint l'objectif**, un point, une ligne jusqu'à
 *   l'axe et le nombre de clients en pastille de sa couleur.
 *
 * Même nom d'affichage que l'axe, pour la même raison : rester hors du
 * masque d'apparition, qui couperait les libellés posés près des bords.
 */
function ReperesObjectif({
  objectif,
  libelleObjectif,
  reperes,
  courbes,
}: {
  objectif: number;
  libelleObjectif: string;
  reperes: { date: Date; libelle: string; couleur: string }[];
  courbes: { date: Date; valeur: number; libelle: string; couleur: string }[];
}) {
  const { xScale, yScale, innerWidth, innerHeight } = useChartStable();
  const y = yScale(objectif);
  return (
    <g aria-hidden className="text-[12px] font-semibold tabular-nums">
      <line
        x1={0}
        x2={innerWidth}
        y1={y}
        y2={y}
        stroke="var(--foreground)"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeDasharray="6,4"
      />
      {reperes.map((repere) => {
        const x = xScale(repere.date);
        return (
          <g key={repere.libelle + repere.couleur}>
            <line
              x1={x}
              x2={x}
              y1={y}
              y2={innerHeight}
              stroke={repere.couleur}
              strokeOpacity={0.7}
              strokeDasharray="3,3"
            />
            <circle
              cx={x}
              cy={y}
              r={6}
              style={{ fill: repere.couleur }}
              stroke="var(--background)"
              strokeWidth={2.5}
            />
            <Pastille
              x={x}
              y={innerHeight - 14}
              texte={repere.libelle}
              fond={repere.couleur}
              ancre={x > innerWidth * 0.85 ? "end" : "middle"}
            />
          </g>
        );
      })}
      {/* L'objectif, à gauche au-dessus de sa ligne : à gauche, les deux
          courbes sont encore sous l'objectif, la place est libre. */}
      <Pastille
        x={4}
        y={y - 18}
        texte={libelleObjectif}
        fond="var(--foreground)"
        encre="var(--background)"
        ancre="start"
      />
      {courbes.map((courbe) => (
        <Pastille
          key={courbe.libelle}
          x={xScale(courbe.date) - 2}
          y={yScale(courbe.valeur) - 18}
          texte={courbe.libelle}
          fond={courbe.couleur}
          ancre="end"
        />
      ))}
    </g>
  );
}
ReperesObjectif.displayName = "XAxis";

/**
 * La stratégie personnalisée de `/video-vsl`, sous le bouton de réservation,
 * à la place du calculateur, sur demande de Rémy : voir `strategieVsl`.
 *
 * **Elle ne lit que ce qu'on sait** : le prénom et les trois réponses de la
 * fenêtre d'inscription, gardés dans le navigateur. Sans réponses, elle ne
 * rend rien, plutôt qu'une stratégie « personnalisée » faite de valeurs par
 * défaut.
 *
 * **La courbe est l'aire de Bklit** : le chiffre d'affaires mensuel selon le
 * nombre de clients, au prix actuel et, quand la tranche en a une, au prix
 * visé. La ligne pointillée est l'objectif : là où chaque aire la franchit,
 * c'est le nombre de clients qu'il faut.
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

  /* **Plus haute sur téléphone.** À 2/1 dans 300 px de large, la courbe
     faisait 150 px de haut, et ses repères se marchaient dessus. Elle passe
     au carré en dessous de 640 px. */
  const [etroit, setEtroit] = useState(false);
  useEffect(() => {
    const requete = window.matchMedia("(max-width: 639px)");
    const suivre = () => setEtroit(requete.matches);
    suivre();
    requete.addEventListener("change", suivre);
    return () => requete.removeEventListener("change", suivre);
  }, []);

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
    /* En abscisse le nombre de clients par mois, en ordonnée le chiffre
       d'affaires mensuel, sur demande de Rémy. L'axe de Bklit est un axe de
       dates : chaque nombre de clients reçoit une date fictive, un jour par
       client, qui ne s'affiche nulle part. On va un peu au-delà du nombre
       nécessaire pour qu'on voie la ligne de l'objectif franchie. */
    const fin = clients + Math.max(2, Math.ceil(clients / 4));
    const donnees = Array.from({ length: fin + 1 }, (_, k) => ({
      date: new Date(2026, 0, 1 + k),
      clients: k,
      actuel: k * prix,
      ...(cible ? { cible: k * cible } : {}),
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
      className="mx-auto mt-16 w-full max-w-6xl text-left sm:mt-20"
    >
      <div
        className="relief-verre mx-auto max-w-4xl rounded-[25px] p-5 sm:p-8"
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
          {remplirSurligne(strategieVsl.phraseObjectif, valeurs)}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-pretty text-foreground/85 sm:text-xl">
          {remplirSurligne(
            calcul.cible
              ? strategieVsl.projection
              : strategieVsl.projectionSansCible,
            valeurs,
          )}
        </p>

        <div className="mt-3">
          <AreaChart
            data={calcul.donnees}
            aspectRatio={etroit ? "1 / 1" : "2 / 1"}
            margin={{ top: 36, right: 12, bottom: 28, left: 52 }}
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
            <EtiquettesY
              valeurs={[
                0,
                Number(
                  calcul.donnees.at(-1)?.cible ??
                    calcul.donnees.at(-1)?.actuel ??
                    0,
                ),
              ]}
            />
            <EtiquettesX
              points={[calcul.donnees[0]!, calcul.donnees.at(-1)!]}
            />
            <ReperesObjectif
              courbes={[
                {
                  date: calcul.donnees.at(-1)!.date,
                  valeur: calcul.donnees.at(-1)!.actuel,
                  libelle: remplir(strategieVsl.legendeActuel, valeurs),
                  couleur: "var(--muted-foreground)",
                },
                ...(calcul.cible
                  ? [
                      {
                        date: calcul.donnees.at(-1)!.date,
                        valeur: Number(calcul.donnees.at(-1)!.cible),
                        libelle: remplir(strategieVsl.legendeCible, valeurs),
                        couleur: "var(--primary)",
                      },
                    ]
                  : []),
              ]}
              objectif={objectif}
              libelleObjectif={`Objectif : ${euros.format(objectif)}`}
              reperes={[
                {
                  date: calcul.donnees[calcul.clients]!.date,
                  libelle: `${calcul.clients} clients`,
                  couleur: "var(--muted-foreground)",
                },
                ...(calcul.clientsCible
                  ? [
                      {
                        date: calcul.donnees[calcul.clientsCible]!.date,
                        libelle: `${calcul.clientsCible} clients`,
                        couleur: "var(--primary)",
                      },
                    ]
                  : []),
              ]}
            />
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
                  <span className="block font-semibold">
                    {Number(point.clients)}{" "}
                    {Number(point.clients) > 1 ? "clients" : "client"}
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
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {strategieVsl.axeClients}
          </p>
        </div>

        {/* « Comment y arriver » : le paragraphe propre à l'activité, puis
            les quatre étapes de la VSL, numérotées, puis l'appel. Sur demande
            de Rémy, qui voulait un bloc plus parlant qu'un paragraphe. */}
        <h3 className="titre mt-10 text-xl text-balance text-foreground sm:text-2xl">
          {strategieVsl.titreActivite}
        </h3>
        {activite ? (
          <p className="mt-3 text-lg leading-relaxed text-pretty text-foreground/85">
            {insecables(activite)}
          </p>
        ) : null}
        <h3 className="titre mt-10 text-xl text-balance text-foreground sm:text-2xl">
          {strategieVsl.introEtapes}
        </h3>
        <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {strategieVsl.etapes.map((etape, rang) => (
            <li
              key={etape.titre}
              className="flex gap-4 rounded-md border border-foreground/10 bg-background/60 p-4 sm:p-5"
            >
              <span
                aria-hidden
                className="titre flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-base text-primary-foreground"
              >
                {rang + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">
                  {etape.titre}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                  {insecables(etape.texte)}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center">
          <BoutonScintillant
            href={strategieVsl.appel.ancre}
            className="min-h-16 w-full px-10 text-lg sm:w-auto sm:text-xl"
          >
            <TexteRoulant>{strategieVsl.appel.libelle}</TexteRoulant>
          </BoutonScintillant>
        </div>
      </div>

      {galerie ? (
        <div className="mt-14">
          <h3 className="titre text-center text-2xl text-balance text-foreground sm:text-3xl">
            {strategieVsl.titreTemoignages}
          </h3>
          {reponses.activite &&
          strategieVsl.introTemoignages[reponses.activite] ? (
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-pretty text-muted-foreground sm:text-lg">
              {insecables(strategieVsl.introTemoignages[reponses.activite]!)}
            </p>
          ) : null}
          <div className="mt-8">{galerie}</div>
        </div>
      ) : null}
    </section>
  );
}
