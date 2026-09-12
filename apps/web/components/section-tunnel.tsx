import { Section } from "@/components/section";
import { TitreRoulant } from "@/components/titre-roulant";
import { sectionTunnel } from "@/contenu/site";
import { CircleHelp } from "lucide-react";

/**
 * Le cadrage, le blocage, la solution : trois slides du deck, en une section.
 *
 * Elle vient juste sous les deux offres, sur demande de Rémy. Tout son texte
 * est le sien, repris du deck publicitaire au mot près ; voir `sectionTunnel`
 * dans `site.ts`, qui porte le détail de ce qui est repris et de ce qui ne
 * l'est pas.
 *
 * **La section raconte en trois temps, et la mise en page le dit.** Le titre
 * pose le constat, les quatre cartes creusent le blocage, le bloc du bas le
 * résout. C'est le mouvement de la vidéo, et il ne marche que dans cet ordre :
 * quelqu'un qui lit la solution avant de s'être reconnu dans le blocage lit une
 * publicité, pas une réponse.
 *
 * **Les quatre blocages sont en retrait, la solution en avant.** Les cartes du
 * milieu sont sur `muted`, la carte du bas sur `card` : elles n'ont pas le même
 * poids parce qu'elles n'ont pas le même rôle. Quatre cartes pleines juste sous
 * les deux cartes d'offres auraient fait six objets de même valeur à la file,
 * et la section se serait lue comme une suite de boîtes.
 *
 * **Le point d'interrogation n'est pas un ornement.** L'amorce dit « vous ne
 * savez pas : », et chacune des quatre lignes complète cette phrase : le signe
 * répète ce que la grammaire fait déjà, à l'endroit où la grille casse le lien
 * entre l'amorce et sa liste. Il est `aria-hidden`, la phrase se lisant seule.
 *
 * **Le barré de « site internet » est celui de Rémy**, pas un effet : la slide
 * dit que le tunnel remplace le site, elle ne dit pas qu'il s'y ajoute.
 */
export function SectionTunnel() {
  return (
    /* Moins d'air en haut qu'une section ordinaire, sur décision de Rémy.

       `Section` donne `py-20 sm:py-28` ; seul le haut est réduit. La section
       des offres, juste au-dessus, a déjà rentré son bas : les deux
       rembourrages s'additionnent, et à pleine valeur des deux côtés le titre
       se retrouvait à cent soixante pixels de la carte précédente, ce qui le
       détachait de ce qu'il commente. Le bas garde le sien, la section
       suivante étant un autre sujet. */
    <Section className="[&>div]:pt-6 sm:[&>div]:pt-8">
      {/* Le titre, son sous-titre et l'amorce de la liste.

          Trois niveaux et non deux, parce qu'ils ne font pas le même travail :
          le titre affirme, le sous-titre dit à qui la phrase s'adresse,
          l'amorce ouvre la liste et finit par deux points. Les fondre en deux
          reviendrait à faire porter à une seule phrase l'annonce et la
          condition, et c'est ce qui produit les titres qu'on relit deux fois.

          `text-balance` est justifié : le bloc est centré, et c'est le seul cas
          où équilibrer les lignes a un sens. Le sous-titre et l'amorce sont plus
          étroits que le titre, `max-w-2xl` contre `max-w-4xl` : une phrase de
          service se lit sur une mesure courte, et la laisser courir sur toute la
          largeur du titre en ferait un second titre.

          L'amorce est en `foreground` et non en `muted` comme le sous-titre :
          les deux se suivent, et sans cet écart on lirait deux lignes grises de
          même valeur au lieu d'une mise en contexte suivie d'une question. */}
      <div className="mx-auto max-w-4xl text-center">
        <TitreRoulant
          segments={sectionTunnel.titre}
          className="titre text-4xl text-balance text-foreground sm:text-5xl"
        />

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {sectionTunnel.sousTitre}
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-foreground sm:text-lg">
          {sectionTunnel.amorce}
        </p>
      </div>

      {/* Les quatre blocages.

          Une vraie liste, `ul` et `li` : ce sont quatre éléments de même rang,
          et un lecteur d'écran doit les annoncer comme tels et en donner le
          nombre. Quatre `div` diraient la même chose à l'œil et rien à
          l'oreille.

          `grid-cols-1` puis `sm:grid-cols-2` : la grille se déclare toujours
          avec son état étroit. `h-full` sur la carte pour que deux lignes de
          longueur différente ne laissent pas une carte plus courte que sa
          voisine, la grille égalisant déjà la hauteur des cellules. */}
      <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4">
        {sectionTunnel.blocages.map((blocage) => (
          <li
            key={blocage}
            className="flex h-full items-start gap-3 rounded-md border border-border bg-muted/40 p-5"
          >
            <CircleHelp
              aria-hidden
              // Le signe s'aligne sur la première ligne du texte et non sur le
              // bloc : centré verticalement, il flotterait au milieu d'une
              // carte à deux lignes.
              className="mt-0.5 size-5 shrink-0 text-muted-foreground"
            />
            <p className="text-base leading-relaxed text-pretty text-foreground">
              {blocage}
            </p>
          </li>
        ))}
      </ul>

      {/* La solution.

          `as="p"` et non un titre : c'est la chute d'une phrase commencée plus
          haut, pas un nouveau sujet. Lui donner un `h3` l'inscrirait dans le
          plan que les robots lisent, où elle n'a rien à faire. */}
      <div className="mx-auto mt-10 max-w-4xl rounded-md border border-border bg-card p-8 text-center sm:mt-12 sm:p-12">
        <TitreRoulant
          as="p"
          segments={sectionTunnel.solution}
          className="titre text-3xl text-balance text-card-foreground sm:text-4xl"
        />

        <p className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground">
          {sectionTunnel.chute.avant}
          <s>{sectionTunnel.chute.barre}</s>
        </p>
      </div>
    </Section>
  );
}
