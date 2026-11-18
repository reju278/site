import { BoutonGenesis } from "@/components/bouton-genesis";
import {
  CaseNiveau,
  ChoixNiveau,
  EffacerNiveaux,
  LienOnglet,
  OngletsNiveaux,
  ReponseNiveau,
  SyntheseNiveaux,
  type OngletNiveaux,
} from "@/components/checklist-niveaux-client";
import { LecteurVideo } from "@/components/lecteur-video";
import { TexteMarque, texteNu } from "@/components/texte-marque";
import {
  boutonAppelNiveaux,
  checklistNiveaux as libelles,
  diagnosticNiveaux,
  exerciceNiveaux,
  niveauxBusiness,
  type BlocNiveaux,
  type NiveauBusiness,
} from "@/contenu/niveaux-business";
import { temoignages } from "@/contenu/site";

/**
 * Le bonus de l'espace membre Genesis : la checklist des niveaux de business
 * de Rémy, posée à la place de la vidéo (issue #8).
 *
 * **Le texte et l'ordre sont ceux de sa page Notion**, `docs.funnels.club/
 * niveaux-business`. **Le dessin, lui, est celui de l'espace membre**, sur sa
 * demande : PT Serif, encre noire, angles droits, le bleu pâle et le jaune de
 * l'optin pour les surlignages, la carte blanche à ombre détachée de la liste
 * des modules pour chaque niveau, les pastilles carrées numérotées.
 *
 * **Un onglet par partie**, sur sa demande : le diagnostic, un par niveau, et
 * l'exercice, qui porte la fin de sa page (blocages, peurs, les deux versions
 * de soi, l'appel). Chaque niveau garde ses vidéos YouTube, deux par rangée
 * comme ses colonnes Notion, et reçoit en plus des témoignages du site.
 *
 * **Rendu par le serveur, animé par le client** : ce composant fabrique le
 * contenu de chaque onglet et le passe tout fait à `OngletsNiveaux`. Ainsi
 * `site.ts`, d'où viennent les témoignages, n'entre pas dans le JavaScript
 * de la page. Un onglet fermé est démonté par Radix : une vidéo qu'on quitte
 * s'arrête d'elle-même.
 *
 * **Les témoignages sont servis par le lecteur de Wistia lui-même**, sans
 * l'affiche, le disque et la durée du site par-dessus, sur demande de Rémy.
 * C'est `natif`, et son prix se connaît : une iframe par témoignage visible,
 * créée à l'approche de l'écran. Les onglets le bornent, un seul est monté à
 * la fois : huit lecteurs au plus, ceux du niveau 4.
 */
export function ChecklistNiveaux({ reservation }: { reservation: string }) {
  const onglets: OngletNiveaux[] = [
    {
      ...libelles.diagnostic,
      contenu: (
        <>
          <Blocs blocs={diagnosticNiveaux} reservation={reservation} />
          <Suite actuel={0} />
        </>
      ),
    },
    ...niveauxBusiness.map((n, i) => ({
      cle: `niveau-${n.n}`,
      emoji: n.emoji,
      libelle: libelles.niveau(n.n),
      contenu: (
        <>
          <Niveau niveau={n} />
          <Suite actuel={i + 1} />
        </>
      ),
    })),
    {
      ...libelles.exercice,
      contenu: (
        <>
          <Blocs blocs={exerciceNiveaux} reservation={reservation} />
          <Suite actuel={niveauxBusiness.length + 1} />
          <EffacerNiveaux />
        </>
      ),
    },
  ];
  return <OngletsNiveaux onglets={onglets} />;
}

/** Les onglets dans l'ordre, pour la navigation du bas de page. */
const ORDRE = [
  { cle: libelles.diagnostic.cle, nom: libelles.diagnostic.libelle },
  ...niveauxBusiness.map((n) => ({ cle: `niveau-${n.n}`, nom: `${libelles.niveau(n.n)} : ${n.court}` })),
  { cle: libelles.exercice.cle, nom: libelles.exercice.libelle },
];

function Suite({ actuel }: { actuel: number }) {
  const avant = ORDRE[actuel - 1];
  const apres = ORDRE[actuel + 1];
  const lien = "inline-flex min-h-10 items-center gap-2 text-base font-bold underline-offset-4 hover:underline";
  return (
    <nav aria-label="Onglets voisins" className="mt-12 flex flex-wrap justify-between gap-4 border-t border-black/10 pt-4">
      {avant ? (
        <LienOnglet onglet={avant.cle} className={`${lien} text-[#60606b]`}>
          ← {avant.nom}
        </LienOnglet>
      ) : (
        <span />
      )}
      {apres ? (
        <LienOnglet onglet={apres.cle} className={`${lien} ml-auto`}>
          {apres.nom} →
        </LienOnglet>
      ) : null}
    </nav>
  );
}

const H2 = "mt-12 mb-3 text-2xl leading-tight font-bold text-pretty first:mt-0 sm:text-[1.75rem]";
const H3 = "mt-10 mb-3 text-xl leading-snug font-bold text-pretty";
const P = "my-2.5 text-[17px] leading-[1.65] text-pretty";

/** Une liste numérotée aux pastilles carrées de la liste des modules. */
function ListeNumerotee({ items }: { items: string[] }) {
  return (
    <ol className="my-3 flex flex-col gap-3">
      {items.map((t, i) => (
        <li key={t} className="flex gap-3 text-[17px] leading-[1.65]">
          <span
            aria-hidden
            className="mt-[1px] flex size-7 shrink-0 items-center justify-center bg-black/[0.06] font-[family-name:var(--font-genesis-bouton)] text-xs font-bold"
          >
            {i + 1}
          </span>
          <span className="min-w-0 text-pretty">
            <TexteMarque texte={t} />
          </span>
        </li>
      ))}
    </ol>
  );
}

function Blocs({ blocs, reservation }: { blocs: BlocNiveaux[]; reservation: string }) {
  /* Un champ à choix sans question se nomme par le titre qui le précède,
     pour un lecteur d'écran. */
  let titre = "";
  return (
    <>
      {blocs.map((b, i) => {
        if (b.type === "h2") titre = texteNu(b.texte);
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className={H2}>
                <TexteMarque texte={b.texte} />
              </h2>
            );
          case "p":
            return (
              <p key={i} className={P}>
                <TexteMarque texte={b.texte} />
              </p>
            );
          case "liste":
            return <ListeNumerotee key={i} items={b.items} />;
          case "encadre":
            /* L'encadré gris de Notion devient le gris de la zone d'appel de
               l'espace sur téléphone, #f8f8f8. */
            return (
              <div key={i} className="my-6 bg-[#f8f8f8] p-5 sm:p-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
                <Blocs blocs={b.blocs} reservation={reservation} />
              </div>
            );
          case "bouton":
            return (
              <BoutonGenesis key={i} href={reservation} className="my-5 sm:w-auto sm:px-8 sm:whitespace-nowrap">
                {boutonAppelNiveaux}
              </BoutonGenesis>
            );
          case "synthese":
            return (
              <SyntheseNiveaux
                key={i}
                niveaux={niveauxBusiness.map((n) => ({ n: n.n, titre: n.titre, total: n.cases.length }))}
              />
            );
          case "cases":
            return (
              <ul key={i} className="my-3 text-[17px] leading-[1.6]">
                {b.items.map((t, j) => (
                  <CaseNiveau key={t} id={`${b.groupe}-${j}`} texte={t} />
                ))}
              </ul>
            );
          case "choix":
            return (
              <ChoixNiveau
                key={i}
                id={b.id}
                nom={b.question ? texteNu(b.question) : titre}
                question={b.question}
                options={b.options}
                unique={b.unique}
                autre={b.autre}
              />
            );
          case "reponse":
            return <ReponseNiveau key={i} id={b.id} question={b.question} />;
          case "tableau":
            return (
              <div key={i} className="my-5 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-[15px] leading-[1.5]">
                  <tbody>
                    {b.lignes.map((ligne, j) => (
                      <tr key={j} className={j === 0 ? "bg-[#f8f8f8]" : undefined}>
                        {ligne.map((c, k) => {
                          const Cellule = j === 0 || k === 0 ? "th" : "td";
                          return (
                            <Cellule
                              key={k}
                              scope={j === 0 ? "col" : k === 0 ? "row" : undefined}
                              className="border border-black/10 px-3 py-2.5 text-left align-top font-normal"
                            >
                              <TexteMarque texte={c} />
                            </Cellule>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "citation":
            return (
              <blockquote key={i} className="mt-8 border-l-[3px] border-[var(--genesis-encre)] pl-5 text-xl leading-snug text-pretty">
                <TexteMarque texte={b.texte} />
              </blockquote>
            );
        }
      })}
    </>
  );
}

/** Un niveau : la carte blanche de la liste des modules, avec ses cases, ses
 *  recommandations, ses vidéos et ses témoignages. */
function Niveau({ niveau: n }: { niveau: NiveauBusiness }) {
  const videos = n.videos;
  const temoins = n.temoignages.map((id) => {
    const t = temoignages.find((x) => x.id === id);
    if (!t) throw new Error(`Témoignage absent de site.ts : ${id}`);
    return t;
  });
  /* Deux par rangée : un nombre impair laisse une case vide en large, ce que
     Rémy ne veut pas. La règle jette au build plutôt que de compter sur une
     relecture. */
  if (temoins.length % 2)
    throw new Error(`Niveau ${n.n} : ${temoins.length} témoignages, il en faut un nombre pair`);
  return (
    <section aria-labelledby={`titre-niveau-${n.n}`} className="bg-white p-5 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] sm:p-8">
      <h2 id={`titre-niveau-${n.n}`} className="flex items-start gap-3 text-2xl leading-tight font-bold text-pretty sm:text-[1.75rem]">
        <span aria-hidden className="shrink-0">
          {n.emoji}
        </span>
        <span>
          <TexteMarque texte={n.titre} />
        </span>
      </h2>
      <ul className="mt-5 text-[17px] leading-[1.6]">
        {n.cases.map((t, j) => (
          <CaseNiveau key={t} id={`n${n.n}-${j}`} texte={t} />
        ))}
      </ul>
      <p className={`${P} mt-4`}>
        <TexteMarque texte={`<mb><b>${libelles.verdict(n.n)}</b></mb>`} />
      </p>

      <h3 className={H3}>
        <TexteMarque texte={n.recoTitre} />
      </h3>
      <ListeNumerotee items={n.recos} />

      <h3 className={H3}>{libelles.titreVideos(n.n)}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {videos.map((v) => (
          <iframe
            key={v.id}
            src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
            title={texteNu(v.titre)}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video w-full border-0 bg-black"
          />
        ))}
      </div>

      {temoins.length ? (
        <>
          <h3 className={H3}>{libelles.titreTemoignages(n.n)}</h3>
          <ul className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {temoins.map((t) => (
              <li key={t.id}>
                <LecteurVideo
                  id={t.id}
                  titre={`Témoignage de ${t.nom}`}
                  secondes={t.secondes}
                  affiche={`/temoignages/${t.id}.jpg`}
                  afficheAlt={`${t.nom}, en entretien`}
                  natif
                  carre
                />
                <p className="mt-2.5 font-[family-name:var(--font-genesis-bouton)] text-[15px] font-bold">{t.nom}</p>
                <p className="mt-0.5 text-[15px] leading-snug text-pretty text-[#60606b]">{t.description}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
