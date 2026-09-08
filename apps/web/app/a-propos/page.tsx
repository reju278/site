import { Section, TitreSection } from "@/components/section";
import { identite, liens, parcours } from "@/contenu/site";
import { Button } from "@repo/ui/components/button";
import { Frame, FramePanel } from "@repo/ui/components/reui/frame";
import { IconTile } from "@repo/ui/components/reui/icon-tile";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@repo/ui/components/reui/timeline";
import { ArrowRight, ImageIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: `Le parcours de ${identite.nom}, ce qu'il fait et pour qui.`,
};

export default function APropos() {
  return (
    <>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-20">
          <div>
            <TitreSection
              etiquette="À propos"
              titre={identite.nom}
              texte={identite.resume}
            />

            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                À remplacer par la biographie réelle. Ce qui marche ici n'est
                pas la liste des accomplissements, c'est la raison pour laquelle
                vous faites ça et pour qui. Trois ou quatre paragraphes
                suffisent.
              </p>
              <p>
                Un paragraphe qui dit d'où vous venez, un qui dit ce que vous
                avez raté avant que ça marche, un qui dit ce que vous faites
                aujourd'hui et pour qui. Le lecteur cherche à savoir s'il vous
                ressemble assez pour vous croire.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={liens.youtube} target="_blank" rel="noreferrer">
                  La chaîne YouTube
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={liens.livre} target="_blank" rel="noreferrer">
                  Le livre
                </a>
              </Button>
            </div>
          </div>

          <Frame spacing="sm">
            <FramePanel className="flex aspect-4/5 flex-col items-center justify-center gap-3 text-center">
              <IconTile variant="frame" size="lg">
                <ImageIcon />
              </IconTile>
              <p className="text-sm font-medium text-foreground">Le portrait</p>
              <p className="max-w-xs px-6 text-sm text-muted-foreground">
                Format vertical, cadrage poitrine, fond neutre. À déposer dans{" "}
                <code>apps/web/public</code>.
              </p>
            </FramePanel>
          </Frame>
        </div>
      </Section>

      <Section>
        <TitreSection
          etiquette="Le parcours"
          titre="Comment on en arrive là."
          texte="Les étapes qui expliquent la méthode, pas celles qui font joli sur un CV."
        />

        {/* `defaultValue` au nombre d'étapes : tout le parcours est derrière
            nous, donc tout est marqué franchi. */}
        <Timeline
          defaultValue={parcours.length}
          orientation="vertical"
          className="mt-12 max-w-2xl"
        >
          {parcours.map((etape, index) => (
            <TimelineItem key={etape.titre} step={index + 1}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineDate>{etape.annee}</TimelineDate>
                <TimelineTitle className="text-base">
                  {etape.titre}
                </TimelineTitle>
                <TimelineIndicator />
              </TimelineHeader>
              <TimelineContent className="text-sm leading-relaxed text-muted-foreground">
                {etape.texte}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      <Section className="border-b-0">
        <div className="rounded-lg border border-border bg-card px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-card-foreground sm:text-4xl">
            On en parle ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-muted-foreground">
            Funnels Club pour construire la machine, le Mastermind pour la faire
            tourner sans vous.
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
