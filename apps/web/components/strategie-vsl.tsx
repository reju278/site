"use client";

import { BoutonScintillant } from "@/components/bouton-scintillant";
import { TexteRoulant } from "@/components/texte-roulant";
import { jaune } from "@/components/titre-video-vsl";
import { strategieVsl } from "@/contenu/vsl";
import { usePrenomVsl, useReponsesVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { Check, X } from "lucide-react";
import { Fragment, useMemo } from "react";

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

/** Le signe d'une case qualitative : une croix rouge, sur demande de Rémy,
 * celle des erreurs de la lettre (`--erreur-texte`), et une coche verte. */
function Signe({ oui }: { oui: boolean }) {
  return oui ? (
    <Check
      aria-hidden
      className="mt-0.5 size-4 shrink-0 text-[var(--icone-resultats)]"
      strokeWidth={3}
    />
  ) : (
    <X
      aria-hidden
      className="mt-0.5 size-4 shrink-0 text-[var(--erreur-texte)]"
      strokeWidth={3}
    />
  );
}

/** Une ligne d'un tableau comparatif : chiffrée (surlignée) ou qualitative
 * (croix et coche). */
type Ligne = {
  critere: string;
  avant: string;
  apres: string;
  chiffre?: boolean;
};

/**
 * Un tableau comparatif, comme ceux qui comparent deux logiciels, sur demande
 * de Rémy : la colonne de gauche est ce qu'on quitte, celle de droite, teintée,
 * ce que Funnels Club propose. La stratégie en pose deux.
 */
function TableauComparatif({
  colonneAvant,
  colonneApres,
  lignes,
}: {
  colonneAvant: string;
  colonneApres: string;
  lignes: Ligne[];
}) {
  return (
    <>
      {/* Le tableau. Un vrai `table` : un lecteur d'écran annonce chaque
            case avec sa ligne et sa colonne. Trois colonnes courtes tiennent
            sur 335 px, d'où des libellés de quelques mots. La colonne
            « Avec Funnels Club » est teintée : c'est celle qu'on lit. */}
      <table className="mt-4 w-full border-separate border-spacing-0 text-left text-sm sm:table-fixed sm:text-base">
        <thead>
          <tr>
            {/* Sur téléphone, la colonne des critères disparaît : chaque
                  critère passe sur sa propre ligne, au-dessus de ses deux
                  valeurs, et le tableau n'a plus que deux colonnes. Trois
                  dans 300 px donnaient des cases de quatre mots par ligne. */}
            <td className="hidden sm:table-cell sm:w-[34%]" />
            {/* **Les deux en-têtes restent en haut de l'écran** tant qu'on
                  est dans le tableau, sur demande de Rémy : sur téléphone, le
                  tableau fait plus d'un écran, et on ne savait plus quelle
                  colonne on lisait. Fonds opaques, sinon les lignes défilent
                  au travers. Même rembourrage des deux côtés, pour que les
                  deux libellés soient sur la même ligne. */}
            <th
              scope="col"
              className="sticky top-0 z-10 bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] px-2 py-3 align-middle text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:static sm:bg-transparent sm:px-4 sm:text-sm"
            >
              {colonneAvant}
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 rounded-t-md bg-[color-mix(in_srgb,var(--primary)_10%,color-mix(in_srgb,var(--foreground)_4%,var(--background)))] px-2 py-3 align-middle text-xs font-semibold tracking-wide text-primary uppercase sm:static sm:px-4 sm:text-sm"
            >
              {colonneApres}
            </th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, rang, toutes) => {
            const derniere = rang === toutes.length - 1;
            return (
              <Fragment key={ligne.critere}>
                <tr className="sm:hidden">
                  <th
                    colSpan={2}
                    className="border-t border-foreground/10 pt-3 pb-1 text-sm font-semibold text-foreground"
                  >
                    {insecables(ligne.critere)}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="hidden border-t border-foreground/10 py-3 pr-4 align-top text-base font-semibold text-foreground sm:table-cell"
                  >
                    {insecables(ligne.critere)}
                  </th>
                  <td className="w-1/2 px-2 pt-1 pb-3 align-top text-muted-foreground sm:border-t sm:border-foreground/10 sm:px-4 sm:py-3">
                    {ligne.chiffre ? (
                      <span className="titre text-lg text-foreground/70 tabular-nums sm:text-xl">
                        {insecables(ligne.avant)}
                      </span>
                    ) : (
                      <span className="flex gap-1.5">
                        <Signe oui={false} />
                        <span>{insecables(ligne.avant)}</span>
                      </span>
                    )}
                  </td>
                  <td
                    className={`w-1/2 bg-primary/10 px-2 pt-1 pb-3 align-top text-foreground sm:border-t sm:border-primary/15 sm:px-4 sm:py-3 ${derniere ? "rounded-b-md" : ""}`}
                  >
                    {ligne.chiffre ? (
                      <mark
                        className="surlignage titre text-lg tabular-nums sm:text-xl"
                        style={jaune}
                      >
                        {insecables(ligne.apres)}
                      </mark>
                    ) : (
                      <span className="flex gap-1.5">
                        <Signe oui />
                        <span>{insecables(ligne.apres)}</span>
                      </span>
                    )}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </>
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
 * **Deux tableaux comparatifs**, sur demande de Rémy : « Comment atteindre
 * {objectif} par mois » (le prix indiqué dans le formulaire face à une offre
 * à 2 000 € minimum, les clients qu'il faut, puis les arguments de sa vidéo
 * sur les prix ; sans prix visé ni « vendre plus cher », qui faisaient
 * naître l'objection), et « Site internet ou tunnel de vente »
 * (les arguments de la VSL). Une courbe Bklit, un avant/après puis un tableau
 * unique ont été essayés avant.
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
    if (!tranchePrix || !objectif || !reponses?.prix) return null;
    const { prixMinimum, prixBas } = strategieVsl;
    const sien = {
      entete: strategieVsl.tonPrix.replace("{tranche}", reponses.prix),
      prix: tranchePrix,
      clients: Math.ceil(objectif / tranchePrix),
    };
    /* Sous 2 000 €, son prix est à gauche, face à une offre à 2 000 €
       minimum ; à partir de 2 000 €, il est à droite, face à une offre à
       petit prix. La colonne de droite est toujours celle qui marche. */
    return tranchePrix < prixMinimum
      ? {
          avant: sien,
          apres: {
            entete: strategieVsl.offreMinimum,
            prix: prixMinimum,
            clients: Math.ceil(objectif / prixMinimum),
          },
        }
      : {
          avant: {
            entete: strategieVsl.offreBasse,
            prix: prixBas,
            clients: Math.ceil(objectif / prixBas),
          },
          apres: sien,
        };
  }, [tranchePrix, objectif, reponses?.prix]);

  if (!reponses || !calcul || !objectif) return null;

  const valeurs = { prenom };
  /* La gamme de la personne : sous 500 €, entre 500 € et 2 000 €, à partir
     de 2 000 €. Elle choisit les lignes du tableau. */
  const gamme: "bas" | "moyen" | "haut" = !tranchePrix
    ? "bas"
    : tranchePrix >= strategieVsl.prixMinimum
      ? "haut"
      : tranchePrix >= 1000
        ? "moyen"
        : "bas";
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
      {/* Le titre hors du bloc, sur demande de Rémy : c'est le titre de la
          section, le bloc n'en est que le contenu. */}
      <h2
        id="strategie-titre"
        className="titre text-center text-3xl text-balance text-foreground sm:text-4xl"
      >
        {insecables(remplir(titre, valeurs))}
      </h2>

      <div
        className="relief-verre mx-auto mt-8 max-w-4xl rounded-[25px] p-5 sm:p-8"
        style={{
          backgroundColor: "color-mix(in srgb, currentColor 4%, transparent)",
        }}
      >
        <h3 className="titre text-xl text-balance text-foreground sm:text-2xl">
          {insecables(
            strategieVsl.titrePrix.replace(
              "{objectif}",
              euros.format(objectif),
            ),
          )}
        </h3>
        <TableauComparatif
          colonneAvant={calcul.avant.entete}
          colonneApres={calcul.apres.entete}
          lignes={[
            {
              critere: strategieVsl.critereClients,
              avant: `${calcul.avant.clients} ${strategieVsl.clients} à ${euros.format(calcul.avant.prix)}`,
              apres: `${calcul.apres.clients} ${strategieVsl.clients} à ${euros.format(calcul.apres.prix)}`,
              chiffre: true,
            },
            ...strategieVsl.lignesPrix[gamme],
          ]}
        />
        {/* L'encadré qui va dans le sens de la personne, sur demande de
            Rémy : une accroche en gras, une phrase avec son objectif. */}
        {(() => {
          const encadre =
            gamme === "haut"
              ? strategieVsl.rassurancePrixHaut
              : strategieVsl.rassurancePrix;
          return (
            /* Au dessin de l'encadré d'appel des entretiens, sur demande
               de Rémy : une carte blanche, un titre, une phrase, sans
               icône. */
            <div className="relief-verre mt-6 rounded-md border border-border bg-background p-6 sm:p-8">
              <p className="titre text-2xl text-balance text-card-foreground sm:text-3xl">
                {insecables(encadre.accroche)}
              </p>
              <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {/* L'objectif et le nombre de clients au surligneur jaune,
                    comme les chiffres du reste de la page. */}
                {insecables(encadre.texte)
                  .split(/(\{\w+\})/)
                  .map((morceau, i) => {
                    const valeur =
                      morceau === "{objectif}"
                        ? `${euros.format(objectif)} par mois`
                        : morceau === "{clients}"
                          ? `${calcul.apres.clients} clients`
                          : null;
                    return valeur ? (
                      <mark key={i} className="surlignage" style={jaune}>
                        {insecables(valeur)}
                      </mark>
                    ) : (
                      morceau
                    );
                  })}
              </p>
            </div>
          );
        })()}

        <h3 className="titre mt-10 text-xl text-balance text-foreground sm:text-2xl">
          {strategieVsl.titreTunnel}
        </h3>
        <TableauComparatif
          colonneAvant={strategieVsl.colonneSite}
          colonneApres={strategieVsl.colonneTunnel}
          lignes={[...strategieVsl.lignesTunnel]}
        />

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
