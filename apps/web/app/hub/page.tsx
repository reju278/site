import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { sommaireHub } from "@/contenu/hub";
import { temoignages } from "@/contenu/site";
import { HUB, avisServis, controlerLeHub } from "@/lib/hub";
import { titresHub } from "@/contenu/hub";
import { insecables } from "@/lib/typographie";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Le sommaire du hub : la grille des entretiens, sans un montant dessus.
 *
 * C'est la page `/resultats` au dessin près, et volontairement : Rémy a demandé
 * que tout reste exactement identique. Trois choses seulement changent, et
 * toutes les trois pour la même raison, la conformité aux règles publicitaires
 * de Meta et le fait qu'on ne sorte pas du hub :
 *
 * - le titre, le chapô et la ligne de chaque carte viennent de `contenu/hub.ts`
 *   et non de `site.ts`, où ils annoncent des montants ;
 * - les cartes mènent à `/hub/<nom>` et non à `/resultats/<nom>` ;
 * - un avertissement ferme la page, posé par le cadre du hub.
 *
 * **Pas de `Carte` facultative ici**, contrairement à `/resultats`. Le hub ne
 * liste que les entretiens qui ont leur article **et** leur version de hub :
 * une carte qui ne mène nulle part est un cul-de-sac sur une page payante.
 */

export const metadata: Metadata = {
  title: sommaireHub.titre,
  description: sommaireHub.description,
};

export default function SommaireHub() {
  /* Les entretiens que le hub sert. L'ordre est celui de `temoignages`, qui
     est celui de la page Résultats : le hub en est le même sommaire, il n'a
     aucune raison de les ranger autrement. `avisServis` décide seul de qui
     entre, affiche comprise. */
  const entrees = temoignages.flatMap((temoignage) => {
    const article = avisServis.find((a) => a.id === temoignage.id);
    const entetes = article ? titresHub[article.slug] : undefined;
    if (!article || !entetes) return [];
    return [{ temoignage, slug: article.slug, entetes }];
  });

  /* Le contrôle, avant le rendu et non après.
     Il relit tout ce que cette page s'apprête à écrire, y compris les lignes
     des cartes : elles viennent de `contenu/hub.ts`, mais c'est précisément le
     genre d'endroit qu'on oublie de nettoyer, puisqu'il est ailleurs que dans
     le fichier des articles. Voir `lib/hub.ts`. */
  controlerLeHub(
    [
      sommaireHub.titre,
      sommaireHub.chapo,
      sommaireHub.description,
      ...entrees.map((e) => e.entetes.carte),
      ...entrees.map((e) => e.temoignage.nom),
    ],
    "le sommaire du hub",
  );

  return (
    <>
      {/* Les cotes sont celles d'`EnTetePage`, reprises telles quelles : le hub
          doit démarrer exactement comme une page intérieure du site. Le
          composant lui-même n'est pas employé, parce que son `data-entete-page`
          déclenche dans `globals.css` une règle d'espacement qui vise la
          première `section` voisine, et que la grille du hub n'est pas montée
          de la même façon. */}
      <section className="px-5 pt-32 pb-10 sm:pt-40 sm:pb-12">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="titre text-4xl text-balance text-foreground sm:text-5xl lg:text-6xl">
            {insecables(sommaireHub.titre)}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
            {insecables(sommaireHub.chapo)}
          </p>
        </div>
      </section>

      <Section className="[&>div]:pt-0">
        {/* Deux par ligne, grille resserrée en `max-w-4xl` et recentrée : c'est
            la grille de `/resultats` à l'identique. */}
        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {entrees.map(({ temoignage, slug, entetes }) => (
            <li key={temoignage.id}>
              <Link
                href={`${HUB}/${slug}`}
                className="relief-verre group/carte group/roule flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/temoignages/${temoignage.id}.jpg`}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-base font-semibold text-card-foreground">
                    {temoignage.nom}
                  </p>
                  <p className="mt-1 text-sm text-pretty text-muted-foreground">
                    {insecables(entetes.carte)}
                  </p>

                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                    <TexteRoulant>Lire son parcours</TexteRoulant>
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover/carte:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
