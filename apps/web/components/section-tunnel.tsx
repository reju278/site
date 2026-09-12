import { GraphiqueTunnels } from "@/components/graphique-tunnels";
import { TitreRoulant } from "@/components/titre-roulant";
import { sectionTunnel } from "@/contenu/site";

/**
 * Le constat, à qui il s'adresse, et sa démonstration.
 *
 * Elle vient juste sous les deux offres, sur demande de Rémy. Le titre et le
 * sous-titre sont de lui ; voir `sectionTunnel` dans `site.ts`.
 *
 * **La section ne fait plus que deux choses : elle affirme, puis elle montre.**
 * Elle a porté un temps quatre cartes de blocage et un bloc de conclusion, tous
 * repris du deck ; le graphique les remplace, sur décision de Rémy. Il dit la
 * même chose en la montrant, et les garder ensemble faisait dire trois fois la
 * même chose à la même section.
 *
 * **Le graphique tient la largeur d'un bloc et non celle de l'écran**, sur
 * décision de Rémy : celle de la carte du livre et du pied de page, donc
 * `max-w-6xl` et `px-5`, la mesure de toutes les sections. Il a été essayé
 * pleine largeur, ce qui étirait la comparaison d'un bord à l'autre ; la règle
 * posée par Rémy est que tout élément intégré à la page prenne cette mesure-là.
 */
export function SectionTunnel() {
  return (
    /* Moins d'air en haut qu'une section ordinaire, sur décision de Rémy. La
       section des offres, juste au-dessus, a déjà rentré son bas : les deux
       rembourrages s'additionnent, et à pleine valeur des deux côtés le titre
       se retrouvait à cent soixante pixels de la carte précédente, ce qui le
       détachait de ce qu'il commente.

       Le bas garde le sien, `py-20 sm:py-28` étant le rythme de toutes les
       sections : ce qui suit est un autre sujet. */
    <section className="pt-6 pb-20 sm:pt-8 sm:pb-28">
      {/* Le titre et son sous-titre.

          `text-balance` est justifié : le bloc est centré, et c'est le seul cas
          où équilibrer les lignes a un sens. Le sous-titre est plus étroit que
          le titre, `max-w-2xl` contre `max-w-4xl` : une phrase de service se lit
          sur une mesure courte, et la laisser courir sur toute la largeur du
          titre en ferait un second titre. */}
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-4xl text-center">
          <TitreRoulant
            segments={sectionTunnel.titre}
            className="titre text-4xl text-balance text-foreground sm:text-5xl"
          />

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {sectionTunnel.sousTitre}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <GraphiqueTunnels className="mt-12 sm:mt-16" />
      </div>
    </section>
  );
}
