import { EnTetePage } from "@/components/en-tete-page";
import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * La page servie quand une adresse ne mène nulle part.
 *
 * **Le projet n'en avait pas**, donc Next servait la sienne : « 404 · This page
 * could not be found. », en anglais, dans sa typographie par défaut, au milieu
 * de l'en-tête et du pied de page du site. Sur un site entièrement en français,
 * c'est la seule page qui parlait anglais.
 *
 * **Le vrai défaut n'était pas là.** La page d'erreur héritait des
 * métadonnées de l'accueil, `canonical` compris : toute adresse morte du site se
 * déclarait donc comme étant l'accueil. Le code HTTP 404 disait l'inverse, et
 * deux signaux qui se contredisent valent moins que rien. D'où le `canonical`
 * retiré ici, et `robots: { index: false }` par-dessus : une page d'erreur n'a
 * aucune raison d'être indexée, comme les pages légales.
 *
 * **Le texte est écrit par l'agent**, ce que le projet interdit partout
 * ailleurs, et il est donc **à valider par Rémy**. Ce qui le justifie : sans
 * page, la seule phrase affichée était celle de Next, en anglais. Une phrase
 * provisoire en français vaut mieux, mais elle reste provisoire.
 *
 * **Les liens sont les quatre pages publiques du site**, et pas un seul retour
 * à l'accueil. Quelqu'un qui arrive ici venait chercher quelque chose : lui
 * proposer les endroits où ça peut se trouver vaut mieux que de le renvoyer au
 * début. Leur libellé dit où ils mènent, jamais « cliquez ici ».
 */
export const metadata: Metadata = {
  title: "Page introuvable",
  description:
    "Cette adresse ne correspond à aucune page du site. Les résultats des membres, le blog et le podcast restent accessibles depuis ici.",
  robots: { index: false },
  /* `canonical: null` et non un `canonical` absent : `layout.tsx` en déclare un
     vers l'accueil, et il est hérité par toute page qui n'en pose pas. Sans
     cette ligne, une adresse morte se déclarait donc **être** l'accueil tout en
     répondant 404. Le signal est retiré, pas remplacé : une page d'erreur n'a
     pas d'adresse de référence, puisqu'elle n'a pas de contenu à elle. */
  alternates: { canonical: null },
};

const PISTES = [
  {
    href: "/resultats",
    titre: "Les résultats",
    texte: "Les membres racontent leur parcours en vidéo, un entretien par page.",
  },
  {
    href: "/articles",
    titre: "Le blog",
    texte: "Les articles de Rémy sur le tunnel de vente et la formation en ligne.",
  },
  {
    href: "/podcast",
    titre: "Le podcast",
    texte: "Les épisodes, à écouter sur la plateforme où vous êtes déjà abonné.",
  },
  {
    href: "/",
    titre: "L'accueil",
    texte: "Les deux programmes, le livre, et par où commencer.",
  },
] as const;

export default function Introuvable() {
  return (
    <>
      <EnTetePage>
        <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
          Cette page n&apos;existe pas
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
          Le lien que vous avez suivi est peut-être ancien, ou l&apos;adresse
          comporte une faute. Voici où se trouve le reste du site.
        </p>
      </EnTetePage>

      <Section>
        {/* Même grille que la page des résultats : deux par ligne, resserrée
            au centre. Les deux pages font le même travail, montrer où aller. */}
        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {PISTES.map((piste) => (
            <li key={piste.href}>
              <Link
                href={piste.href}
                className="relief-verre group/carte group/roule flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="titre block text-2xl text-card-foreground">
                  {piste.titre}
                </span>

                <span className="mt-2 block text-base leading-relaxed text-pretty text-muted-foreground">
                  {piste.texte}
                </span>

                <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-primary">
                  <TexteRoulant>Y aller</TexteRoulant>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-hover/carte:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
