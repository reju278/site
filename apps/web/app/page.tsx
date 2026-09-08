import { Section, TitreSection } from "@/components/section";
import { TuileResultat, type Resultat } from "@/components/tuile-resultat";
import {
  chiffres,
  cibles,
  identite,
  liens,
  offres,
  piliers,
  questions,
  resultats,
} from "@/contenu/site";
import { pastille } from "@/lib/teintes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Button } from "@repo/ui/components/button";
import { Frame, FramePanel } from "@repo/ui/components/reui/frame";
import { IconTile } from "@repo/ui/components/reui/icon-tile";
import { ArrowRight, Check, ImageIcon, Target, Users, Zap } from "lucide-react";
import Link from "next/link";

const icones = [Users, Target, Zap];

export default function Accueil() {
  return (
    <>
      {/* ---------------------------------------------------------------
          Le hero.

          Titre en deux tons : la partie qui compte en `text-foreground`, le
          reste en `text-muted-foreground`. C'est le geste d'eden.so, et il ne
          coûte que des jetons sémantiques, donc il tient dans les deux thèmes.
      --------------------------------------------------------------- */}
      <Section className="border-b-0">
        <p className="text-sm text-muted-foreground">
          Une offre qui tranche. Un tunnel qui tient. De la publicité qui
          rentre.
        </p>

        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance text-muted-foreground sm:text-5xl lg:text-6xl">
          Vendre ses{" "}
          <span className="text-foreground">connaissances ou compétences</span>{" "}
          en ligne.
        </h1>

        <div className="mt-10 grid max-w-3xl gap-x-10 gap-y-3 sm:grid-cols-2">
          {piliers.map((pilier) => (
            <div key={pilier} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-foreground">
                {pilier}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
              Découvrir Funnels Club
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/resultats">Voir les résultats</Link>
          </Button>
        </div>

        {/* Le visuel du hero. Tant qu'il n'y a pas de photo, le cadre dit ce
            qu'on attend plutôt que d'afficher une image d'agence. */}
        <Frame className="mt-16" spacing="sm">
          <FramePanel className="flex aspect-16/9 flex-col items-center justify-center gap-3 text-center sm:aspect-21/9">
            <IconTile variant="frame" size="lg">
              <ImageIcon />
            </IconTile>
            <p className="text-sm font-medium text-foreground">
              La photo ou la vidéo du hero
            </p>
            <p className="max-w-md px-6 text-sm text-muted-foreground">
              À déposer dans <code>apps/web/public</code>. Un plan large de face
              caméra, dans l'esprit de la page Wix Learn référencée dans
              l'issue #1.
            </p>
          </FramePanel>
        </Frame>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section>
        <TitreSection
          etiquette="À qui je parle"
          titre="Trois façons d'être coincé au même endroit."
          texte="Le métier change, le mur est le même : ce qui rentre dépend encore entièrement de vous."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {cibles.map((cible, index) => {
            const Icone = icones[index] ?? Users;
            return (
              <div key={cible.titre}>
                <IconTile variant="frame" size="lg">
                  <Icone />
                </IconTile>
                <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                  {cible.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cible.texte}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section>
        <TitreSection
          etiquette="Les programmes"
          titre="Deux étages, selon où vous en êtes."
          texte="Le premier construit la machine. Le second s'adresse à ceux dont la machine tourne déjà."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {offres.map((offre) => (
            <article
              key={offre.id}
              className="flex flex-col rounded-lg border border-border bg-card p-8"
            >
              <span
                style={pastille(offre.teinte)}
                className="inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-medium"
              >
                {offre.promesse}
              </span>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-card-foreground">
                {offre.nom}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {offre.texte}
              </p>

              <p className="mt-6 border-t border-border pt-6 text-sm text-card-foreground">
                <span className="text-muted-foreground">Pour vous si : </span>
                {offre.pour}
              </p>

              <Button asChild className="mt-8 w-fit">
                <a href={offre.href} target="_blank" rel="noreferrer">
                  {offre.action}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section>
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {chiffres.map((chiffre) => (
            <div key={chiffre.libelle}>
              <dt className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {chiffre.valeur}
                <span className="text-2xl sm:text-3xl">{chiffre.unite}</span>
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {chiffre.libelle}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section>
        <TitreSection
          etiquette="La preuve"
          titre="Ce que les membres en ont fait."
          texte="Des chiffres qui appartiennent à des personnes, citées avec leur accord."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.slice(0, 3).map((resultat, index) => (
            <TuileResultat key={index} {...(resultat as Resultat)} />
          ))}
        </div>

        <Button asChild variant="outline" className="mt-8">
          <Link href="/resultats">
            Voir tous les résultats
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <TitreSection
            etiquette="Qui je suis"
            titre={identite.nom}
            texte={identite.resume}
          />

          <div className="flex flex-col items-start gap-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              Je ne vends pas une méthode de croissance générique. Je travaille
              avec des gens qui savent déjà faire quelque chose de précis et qui
              n'ont pas encore le moyen de le vendre deux fois de suite de la
              même manière.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/a-propos">Lire le parcours</Link>
              </Button>
              <Button asChild variant="ghost">
                <a href={liens.youtube} target="_blank" rel="noreferrer">
                  La chaîne YouTube
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={liens.livre} target="_blank" rel="noreferrer">
                  Le livre
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <TitreSection etiquette="Questions" titre="Avant de vous engager." />

          <Accordion type="single" collapsible className="w-full">
            {questions.map((entree) => (
              <AccordionItem key={entree.question} value={entree.question}>
                <AccordionTrigger className="text-left text-base">
                  {entree.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {entree.reponse}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* --------------------------------------------------------------- */}
      <Section className="border-b-0">
        <div className="rounded-lg border border-border bg-card px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-card-foreground sm:text-4xl">
            Votre expertise se vend déjà. Pas encore sans vous.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-muted-foreground">
            {identite.resume}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
                Découvrir Funnels Club
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={liens.mastermind} target="_blank" rel="noreferrer">
                Découvrir le Mastermind
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
