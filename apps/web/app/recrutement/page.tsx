import { Apparition } from "@/components/apparition";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { EnTetePage } from "@/components/en-tete-page";
import { Emplacement, Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { recrutement } from "@/contenu/recrutement";
import { surligner } from "@/lib/surligner";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * La page de recrutement : l'annonce du poste de représentant des ventes.
 *
 * **Elle se lit comme la lettre de l'accueil**, sur demande de Rémy : même
 * mesure de texte, même corps, mêmes surlignages. Le jaune marque ce que
 * l'équipe offre, le vert ce que le candidat cherche, le rouge ce qui est
 * exigé : ce sont les trois teintes de la lettre, et elles y disent déjà
 * « ce qu'on peut faire », « ce qui marche » et « ce qu'il ne faut pas ».
 *
 * L'ordre est celui de l'annonce, puis le bouton pour postuler, puis le
 * témoignage de Geoffrey : on lit, on décide, et quelqu'un de l'équipe raconte
 * ce que le poste donne pour qui hésite encore.
 */

export const metadata: Metadata = {
  title: recrutement.titrePage,
  description: recrutement.description,
  alternates: { canonical: "/recrutement" },
};

/* Les trois teintes de la lettre de l'accueil, reprises telles quelles. */
const JAUNE = "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)";
const VERT = "color-mix(in srgb, var(--courbe) 28%, transparent)";
const ROUGE = "color-mix(in srgb, var(--erreur-texte) 28%, transparent)";

const TITRE_SECTION = "titre text-3xl text-balance text-foreground sm:text-4xl";

export default function Recrutement() {
  return (
    <>
      <EnTetePage>
        <p className="text-sm font-semibold text-muted-foreground">
          {recrutement.surtitre}
        </p>
        <h1 className="titre mt-3 text-5xl text-balance text-foreground sm:text-6xl">
          {recrutement.titre}
        </h1>
      </EnTetePage>

      <Section>
        {/* La mesure d'un texte et non celle d'un bloc, comme la lettre : une
            ligne de texte courant se lit entre soixante et quatre-vingts
            caractères. */}
        <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-pretty text-foreground/85 sm:text-lg">
          {recrutement.introduction.map((paragraphe) => (
            <Apparition key={paragraphe.texte}>
              <p>{surligner(paragraphe.texte, paragraphe.surligne, JAUNE)}</p>
            </Apparition>
          ))}

          {/* Le lien vers les résultats s'ouvre dans un nouvel onglet, sur
              demande de Rémy : un candidat qui le suit ne doit pas perdre
              l'annonce qu'il était en train de lire. */}
          <Apparition>
            <p>
              {insecables(recrutement.mission.avant)}
              <Link
                href={recrutement.mission.href}
                target="_blank"
                className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {recrutement.mission.lien}
              </Link>
              {insecables(recrutement.mission.apres)}
            </p>
          </Apparition>

          <Apparition>
            <p>{insecables(recrutement.invitation)}</p>
          </Apparition>

          {/* Ce que l'équipe offre, en jaune.

              Une liste à puces et non numérotée : ce ne sont pas des options
              entre lesquelles on choisit, comme les trois voies de la lettre,
              mais des choses qui vont ensemble. */}
          <Apparition className="pt-6 sm:pt-8">
            <h2 className={TITRE_SECTION}>{recrutement.offre.titre}</h2>
          </Apparition>
          <Apparition>
            <ul className="list-disc space-y-3 pl-5 marker:text-foreground">
              {recrutement.offre.points.map((point) => (
                <li key={point.texte}>
                  {surligner(point.texte, [point.surligne], JAUNE)}
                </li>
              ))}
            </ul>
          </Apparition>

          {/* À qui s'adresse le poste, en vert : ce qui marche. */}
          <Apparition className="pt-6 sm:pt-8">
            <h2 className={TITRE_SECTION}>{recrutement.profil.titre}</h2>
          </Apparition>
          <Apparition>
            <ul className="list-disc space-y-3 pl-5 marker:text-foreground">
              {recrutement.profil.points.map((point) => (
                <li key={point.texte}>
                  {surligner(point.texte, [point.surligne], VERT)}
                </li>
              ))}
            </ul>
          </Apparition>

          {/* Les exigences, au patron des erreurs de la lettre : la première
              phrase en rouge, sa suite au corps du texte. Des paragraphes et
              non une liste, pour la même raison que là-bas : plusieurs font
              deux phrases, et une puce devant un paragraphe donne un document
              administratif. */}
          <Apparition className="pt-6 sm:pt-8">
            <h2 className={TITRE_SECTION}>{recrutement.exigences.titre}</h2>
          </Apparition>
          {recrutement.exigences.points.map((point) => (
            <Apparition key={point.titre}>
              <p>
                {surligner(point.titre, [point.titre], ROUGE)}
                {point.texte ? ` ${insecables(point.texte)}` : null}
              </p>
            </Apparition>
          ))}

          <Apparition className="pt-6 sm:pt-8">
            <h2 className={TITRE_SECTION}>{recrutement.salaire.titre}</h2>
          </Apparition>
          <Apparition>
            <p>{insecables(recrutement.salaire.texte)}</p>
          </Apparition>

          {/* Le bouton pour postuler, en bas de l'annonce comme Rémy l'a
              demandé. C'est l'appel principal de la page, donc le bouton
              scintillant du site, à sa taille d'appel. */}
          <Apparition className="flex justify-center pt-8 sm:pt-10">
            <BoutonScintillant
              href={recrutement.postuler.href}
              className="w-full sm:w-auto"
            >
              <TexteRoulant>{recrutement.postuler.libelle}</TexteRoulant>
            </BoutonScintillant>
          </Apparition>
        </div>
      </Section>

      {/* Le témoignage de Geoffrey, sous le bouton.

          Pas une `Section` : son rembourrage haut s'ajouterait au bas de
          l'annonce, et le témoignage se détacherait du bouton qu'il
          accompagne. */}
      <section className="px-5 pb-20 sm:pb-28">
        <div className="mx-auto max-w-4xl">
          <h2 className={`${TITRE_SECTION} text-center`}>
            {recrutement.temoignage.titre}
          </h2>
          <Emplacement
            className="mt-8 aspect-video min-h-0"
            attendu={recrutement.temoignage.attendu}
          />
        </div>
      </section>
    </>
  );
}
