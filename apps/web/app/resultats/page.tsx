import { EnTetePage } from "@/components/en-tete-page";
import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { avisDe } from "@/contenu/avis";
import { temoignages } from "@/contenu/site";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/resultats" },
  title: "Résultats",
  /* **Ni nombre ni nom d'intervieweur**, et les deux pour la même raison :
     une description qui compte les témoignages vieillit au premier ajout, et
     tous les entretiens ne sont pas menés par Rémy. Elle tient la fourchette de
     120 à 160 caractères que le projet demande, ce que l'ancienne, à 78, ne
     faisait pas. */
  description:
    "Les membres de Funnels Club racontent en vidéo ce qu'ils faisaient avant et où ils en sont. Chaque entretien a sa page, avec sa transcription.",
};

/**
 * La carte d'un témoignage : un lien quand son avis existe, un bloc sinon.
 *
 * Le choix se fait ici et non dans la grille pour que le type reste juste des
 * deux côtés : `Link` exige une destination, et lui en passer une facultative
 * ne compile pas. Un lien vers `#` aurait compilé, et c'est précisément ce
 * qu'il ne faut pas : une cible qui ne mène nulle part, que le clavier atteint
 * et que les robots suivent.
 */
function Carte({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Resultats() {
  return (
    <>
      {/* Le bas de l'en-tête est rentré pour cette page seulement, sur
          demande de Rémy. `EnTetePage` porte son rembourrage sur le
          `<section>` intérieur, donc la retouche se fait par `[&>section]`,
          comme `Section` se retouche par `[&>div]`. Les autres pages
          intérieures gardent leur réglage. */}
      <EnTetePage className="[&>section]:pb-10 sm:[&>section]:pb-12">
        {/* Repris de remy-jupille.com, au mot près. */}
        <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
          Résultats de Funnels Club
        </h1>

        {/* **Ce sous-titre est écrit par l'agent, à la demande de Rémy**, comme
            les articles d'avis : « une petite description sous-titre qui
            explique ce qu'ils vont voir sur cette page ». Il dit ce que la page
            contient et rien d'autre, sans promettre de résultat : les chiffres
            sont dans les entretiens, et ce sont ceux des personnes qui les
            annoncent. **À valider par Rémy**, au même titre que les articles.

            **Aucun nombre, sur décision de Rémy.** Il y en avait quinze, puis
            dix-huit, puis vingt-deux. Un compte écrit dans une phrase est juste
            le jour où on l'écrit et faux au suivant, et personne ne pense à le
            corriger en ajoutant un témoignage : c'est la grille qui compte, et
            elle est toujours à jour puisqu'elle est calculée.

            `max-w-2xl` et non la pleine largeur : une ligne de texte courant
            qui fait mille cent pixels de long se relit mal, et le sous-titre
            doit rester plus étroit que le titre qu'il commente. */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
          Les membres racontent, en vidéo, ce qu'ils faisaient avant, ce qu'ils
          ont changé et où ils en sont. Chaque entretien a sa page, avec la
          vidéo, le récit et la transcription complète.
        </p>
      </EnTetePage>

      {/* Le rembourrage haut est rentré, sur demande de Rémy : l'écart entre le
          sous-titre et la première rangée de cartes était trop grand. Il
          s'additionnait de deux endroits, le bas de `EnTetePage` et le haut de
          `Section`, et aucun des deux ne savait que l'autre existait. C'est le
          second qu'on annule entièrement, et le premier est rentré juste
          au-dessus.

          La retouche passe par `[&>div]` et non par un `className` nu : dans
          `Section`, le rembourrage vit sur le bloc intérieur et non sur la
          balise qui reçoit la classe. C'est l'écriture déjà employée sur
          l'accueil et sur la page d'un avis. */}
      <Section className="[&>div]:pt-0">
        {/* La grille des entretiens, **en liens et non en lecteurs**, sur
            décision de Rémy.

            Chaque entretien a désormais sa page, où il est raconté et où la
            vidéo se regarde : cette page-ci est devenue le sommaire qui les
            relie. C'est aussi ce qui la rend lisible par un moteur, qui ne sait
            rien lire d'une vidéo et tout d'un article.

            Le gain est aussi mécanique : un lecteur Wistia, c'est environ 505 Ko
            de JavaScript, donc plusieurs mégaoctets si on les charge tous
            d'avance. Ils ne se chargeaient qu'au clic, mais ils s'assemblaient
            quand même ; ici, il n'y a plus qu'une image par carte.

            L'affiche est servie par nous et non par Wistia : rien ne part
            chez eux tant qu'une vidéo n'est pas lancée. */}
        {/* Deux par ligne et non trois, sur décision de Rémy. Chaque carte
            porte désormais une phrase sous le nom : à trois colonnes, cette
            phrase tombait sur trois lignes et les cartes cessaient d'avoir la
            même hauteur de texte. Une grille se déclare toujours avec son état
            étroit, d'où `grid-cols-1` avant `sm:`.

            **Et elle est plus étroite que la section qui la porte**, resserrée
            au centre sur demande de Rémy : `max-w-4xl` contre les `max-w-6xl`
            de `Section`. Deux cartes sur toute la largeur d'un grand écran font
            des affiches de cinq cent cinquante pixels pour une ligne de texte
            de dix mots, et la grille se lit comme deux colonnes qui s'écartent
            au lieu d'une liste. Le `mx-auto` est ce qui la recentre : sans lui,
            la grille rétrécie se collerait à gauche. */}
        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {temoignages.map((temoignage) => {
            const article = avisDe(temoignage.id);

            return (
              <li key={temoignage.id}>
                {/* La carte entière est cliquable, et c'est un vrai lien : ce
                    qui navigue est un lien, donc le clic du milieu, l'ouverture
                    dans un onglet et l'aperçu de la destination marchent. Le
                    titre porte le nom accessible, pas une image. */}
                {/* Une carte sans article n'est pas un lien mort, c'est une
                    carte. `Link` vers `#` aurait donné une cible qui ne mène
                    nulle part, que le clavier atteint et que les robots
                    suivent ; un `div` dit simplement qu'il n'y a rien à ouvrir
                    pour l'instant. */}
                <Carte
                  href={article ? `/resultats/${article.slug}` : undefined}
                  className="relief-verre group/carte group/roule flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {/* L'affiche est en 16/9 et porte les bandes noires de
                      l'enregistrement : ce sont des appels à deux, et elles
                      sont dans les fichiers. Voir `AGENTS.md`. */}
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
                    {/* La phrase est tirée de l'article de la personne et
                        vient de `site.ts`. Elle n'est plus facultative : une
                        carte qui n'aurait pas sa ligne creuserait un
                        trou dans la grille, et le nom seul ne dit rien de ce
                        qu'on va lire. */}
                    <p className="mt-1 text-sm text-pretty text-muted-foreground">
                      {temoignage.description}
                    </p>

                    {/* Le libellé roule au survol, comme tous les appels du
                        site. Deux groupes sur la même carte et non un seul :
                        `group/carte` porte la flèche qui avance, `group/roule`
                        est le nom que `texte-roule` attend dans `globals.css`.
                        Ils sont posés sur le lien entier, donc l'effet part du
                        survol de la carte et pas des seules lettres.

                        Le libellé reste dans `TexteRoulant` et pas recopié à
                        côté : la seconde ligne est un pseudo-élément, donc le
                        texte du lien reste « Lire son parcours » une seule fois
                        pour un robot. */}
                    {article ? (
                      <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                        <TexteRoulant>Lire son parcours</TexteRoulant>
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform group-hover/carte:translate-x-0.5"
                        />
                      </span>
                    ) : null}
                  </div>
                </Carte>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* **Pas d'appel à l'action en bas de cette page**, retiré sur décision
          de Rémy. Cette page est un sommaire : quelqu'un qui arrive au bout
          n'a pas encore lu un seul témoignage, et lui proposer de réserver un
          appel à cet endroit lui demande de décider avant de savoir. L'appel
          est au bon endroit dans chaque article, au milieu et à la fin, une
          fois le parcours raconté. */
      }
    </>
  );
}
