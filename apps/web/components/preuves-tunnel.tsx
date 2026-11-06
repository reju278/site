import { MurCommunaute } from "@/components/mur-communaute";
import { PileEntretiens } from "@/components/pile-entretiens";
import { RangeeEquipe } from "@/components/rangee-equipe";
import { TitreRoulant } from "@/components/titre-roulant";
import { entretiensPile } from "@/contenu/entretiens-pile";
import { equipeImmersion } from "@/contenu/immersion";
import { confirmationThanks } from "@/contenu/thanks";

/**
 * La suite de `/thanks` à partir de Roland : les entretiens, le mur de la
 * communauté et l'équipe. Un seul composant, partagé avec `/debuts` et
 * `/stable`, pour que ces pages ne divergent pas.
 */
export function PreuvesTunnel() {
  return (
    <>
      {/* LES ENTRETIENS, la pile de `/form-funnel-thanks`, sur demande de
          Rémy : Roland en grand, avec son titre et sa note au feutre, puis
          les autres derrière « Découvrir 3 autres histoires ». Elle remplace
          la grille de cartes, qui montrait les mêmes vidéos. Sans boutons de
          réservation : l'appel est déjà pris. */}
      <section id="avis" className="scroll-mt-24 px-5 pt-20 sm:pt-24">
        {/* Sans la note au feutre de Roland, retirée ici sur demande de
            Rémy ; `/form-funnel-thanks` la garde. La vidéo reprend donc la
            largeur de celles du dessus. */}
        <PileEntretiens
          entretiens={entretiensPile.map((e) => ({ ...e, note: undefined }))}
          /* Les boutons au rayon du tunnel, 5 px, comme ceux de `/course`,
             `/video-vsl` et `/appel`, sur demande de Rémy. */
          rayonBoutons="var(--radius-md)"
          className="mx-auto w-full max-w-[calc(var(--largeur-video)-2rem)] sm:max-w-[calc(var(--largeur-video)-3rem)]"
        />
      </section>

      {/* LE MUR DE LA COMMUNAUTÉ ET L'ÉQUIPE, ceux de `/form-funnel-thanks`,
          sur demande de Rémy, dans le même ordre : les récits complets,
          puis ce que les membres écrivent au quotidien, puis qui les
          accompagne. Les mêmes composants, pour que les deux confirmations
          ne divergent pas. */}
      <div className="pt-16 sm:pt-20">
        {/* Le mur sans ses portraits flottants ni son en-tête, retirés ici
            sur demande de Rémy, et sous un titre à lui, qu'il a dicté. */}
        <div className="mx-auto max-w-3xl px-5 pb-8 text-center sm:pb-10">
          <TitreRoulant
            as="h2"
            segments={[{ texte: confirmationThanks.titreMur }]}
            className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
          />
        </div>
        <MurCommunaute defilant entete={false} />
      </div>

      <section id="equipe" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:py-12">
          <div className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
            <TitreRoulant
              as="h2"
              segments={[{ texte: equipeImmersion.titre }]}
              className="titre text-[1.625rem] text-balance text-foreground sm:text-4xl"
            />
          </div>

          <RangeeEquipe />
        </div>
      </section>
    </>
  );
}
