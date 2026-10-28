"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { jaune } from "@/components/titre-video-vsl";
import { strategieVsl } from "@/contenu/vsl";
import { usePrenomVsl, useReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { useMemo } from "react";

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
 * Une rangée de points, un par client : on voit d'un coup d'œil qu'il en
 * faut beaucoup d'un côté et peu de l'autre, sans rien lire. Au-delà de
 * quarante, la rangée s'arrête sur « + », pour ne pas devenir une texture.
 */
function PointsClients({
  nombre,
  couleur,
}: {
  nombre: number;
  couleur: string;
}) {
  const affiches = Math.min(nombre, 40);
  return (
    <span aria-hidden className="mt-4 flex flex-wrap gap-1.5">
      {Array.from({ length: affiches }, (_, i) => (
        <span
          key={i}
          className="size-3 rounded-full"
          style={{ backgroundColor: couleur }}
        />
      ))}
      {nombre > affiches ? (
        <span
          className="text-xs leading-3 font-semibold"
          style={{ color: couleur }}
        >
          +
        </span>
      ) : null}
    </span>
  );
}

/** Une colonne de l'avant/après : le prix, le nombre de clients, les points. */
function Colonne({
  etiquette,
  prix,
  clients,
  mise,
}: {
  etiquette: string;
  prix: string;
  clients: number;
  /** La colonne d'après, en bleu et cernée. */
  mise?: boolean;
}) {
  const couleur = mise ? "var(--primary)" : "var(--muted-foreground)";
  return (
    <div
      className={
        mise
          ? "rounded-md border-2 border-primary bg-background p-5"
          : "rounded-md border border-foreground/10 bg-background/60 p-5"
      }
    >
      <p
        className="text-sm font-semibold tracking-wide uppercase"
        style={{ color: couleur }}
      >
        {etiquette}
      </p>
      <p className="mt-2 text-base text-muted-foreground">{insecables(prix)}</p>
      <p className="titre mt-1 text-4xl text-foreground tabular-nums sm:text-5xl">
        {clients}
        <span className="ml-2 text-base font-normal text-muted-foreground">
          clients / mois
        </span>
      </p>
      <PointsClients nombre={clients} couleur={couleur} />
    </div>
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
 * **Un avant/après et non une courbe**, sur demande de Rémy, qui trouvait le
 * graphique et ses phrases trop compliqués : une ligne pour l'objectif, puis
 * deux colonnes, le prix actuel et le prix visé, chacune avec le nombre de
 * clients qu'il faut et un point par client. La courbe Bklit a été essayée
 * avant, avec ses repères ; elle demandait trop de lecture sur téléphone.
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
    return {
      prix,
      cible,
      clients: Math.ceil(objectif / prix),
      clientsCible: cible ? Math.ceil(objectif / cible) : null,
    };
  }, [tranchePrix, objectif]);

  if (!reponses || !calcul || !objectif) return null;

  const valeurs = { prenom };
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

        {/* Une ligne, et l'objectif surligné : c'est tout le texte. */}
        <p className="mt-4 text-center text-lg text-foreground sm:text-xl">
          {insecables(strategieVsl.pourAtteindre)}{" "}
          <mark className="surlignage" style={jaune}>
            {insecables(euros.format(objectif))}
          </mark>{" "}
          {strategieVsl.parMois}
        </p>

        <div
          className={
            calcul.cible
              ? "mt-6 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]"
              : "mx-auto mt-6 max-w-sm"
          }
        >
          <Colonne
            etiquette={calcul.cible ? strategieVsl.avant : strategieVsl.seul}
            prix={`${strategieVsl.offreA} ${euros.format(calcul.prix)}`}
            clients={calcul.clients}
            mise={!calcul.cible}
          />
          {calcul.cible && calcul.clientsCible ? (
            <>
              <span
                aria-hidden
                className="flex items-center justify-center text-2xl text-primary sm:text-3xl"
              >
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
              <Colonne
                etiquette={strategieVsl.apres}
                prix={`${strategieVsl.offreA} ${euros.format(calcul.cible)}`}
                clients={calcul.clientsCible}
                mise
              />
            </>
          ) : null}
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
            <TexteRoulant>{strategieVsl.boutonEtapes}</TexteRoulant>
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
