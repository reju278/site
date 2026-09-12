import { BoutonScintillant } from "@/components/bouton-scintillant";
import { EnTetePage } from "@/components/en-tete-page";
import { Section } from "@/components/section";
import { avisDe } from "@/contenu/avis";
import { liens, temoignages } from "@/contenu/site";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/resultats" },
  title: "Résultats",
  description:
    "Les témoignages vidéo des membres de Funnels Club, en entretien avec Rémy Jupille.",
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
      <EnTetePage>
        {/* Repris de remy-jupille.com, au mot près. */}
        <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
          Résultats de Funnels Club
        </h1>
      </EnTetePage>

      <Section>
        {/* La grille des entretiens, **en liens et non en lecteurs**, sur
            décision de Rémy.

            Chaque entretien a désormais sa page, où il est raconté et où la
            vidéo se regarde : cette page-ci est devenue le sommaire qui les
            relie. C'est aussi ce qui la rend lisible par un moteur, qui ne sait
            rien lire d'une vidéo et tout d'un article.

            Le gain est aussi mécanique : quinze lecteurs Wistia, c'est environ
            505 Ko de JavaScript chacun, donc sept mégaoctets si on les charge
            d'avance. Ils ne se chargeaient qu'au clic, mais ils s'assemblaient
            quand même ; ici, il n'y a plus qu'une image par carte.

            L'affiche est servie par nous et non par Wistia : rien ne part
            chez eux tant qu'une vidéo n'est pas lancée. */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="relief-verre group/carte flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
                    {temoignage.resultat ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {temoignage.resultat}
                      </p>
                    ) : null}

                    {article ? (
                      <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                        Lire son parcours
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

      <Section>
        <div className="flex justify-center">
          {/* Repris de remy-jupille.com, au mot près. */}
          <BoutonScintillant href={liens.appel}>
            Appel découverte gratuit
            <ArrowRight className="size-4" />
          </BoutonScintillant>
        </div>
      </Section>
    </>
  );
}
