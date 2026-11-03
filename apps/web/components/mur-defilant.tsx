import { Marquee } from "@repo/ui/components/marquee";
import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import { extraitsChiffres, murCommunaute } from "@/contenu/communaute";
import { anonymiser } from "@/lib/anonymat";
import { insecables } from "@/lib/typographie";
import { prenom } from "@/lib/prenom";
import { surligner } from "@/lib/surligner";

/**
 * Le mur de la communauté **qui défile**, pour `/form-funnel-thanks`, sur
 * demande de Rémy : des colonnes verticales qui montent en continu, d'un pas
 * différent chacune, fondues en haut et en bas.
 *
 * **Des extraits et non des posts entiers** : quelques lignes par carte,
 * celles où la personne donne un chiffre (`extraitsChiffres`). Le passage
 * chiffré est surligné.
 *
 * **Le défilement est la `Marquee` de MagicUI**, et non le `InfiniteSlider`
 * du modèle fourni : celui-ci tire `react-use-measure`, que le dépôt n'a pas,
 * alors que la `Marquee` est du CSS seul et fait la même chose en vertical.
 * Elle s'arrête au survol, pour qu'on puisse lire.
 *
 * Trois colonnes sur grand écran, deux sur tablette, une sur téléphone :
 * chaque largeur a sa répartition, pour qu'aucun extrait ne disparaisse avec
 * une colonne masquée.
 */

type Carte = {
  cle: string;
  nom: string;
  niche: string | null;
  portrait: string | null;
  extrait: string;
  chiffre: string;
};

const cartes: Carte[] = extraitsChiffres.flatMap((e) => {
  const post = murCommunaute.find((m) => m.titre === e.titre);
  /* Un extrait qui ne se retrouve pas mot pour mot dans son post n'est pas
     montré : ce sont les mots de quelqu'un d'autre. */
  if (!post || !post.paragraphes.some((p) => p.includes(e.extrait))) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Extrait introuvable dans son post : ${e.extrait}`);
    }
    return [];
  }
  return [
    {
      cle: e.titre,
      nom: post.nom,
      niche: post.niche,
      portrait: post.portrait,
      extrait: e.extrait,
      chiffre: e.chiffre,
    },
  ];
});

/** Les cartes réparties en `n` colonnes, une sur `n`. */
const enColonnes = (n: number) =>
  Array.from({ length: n }, (_, i) => cartes.filter((_, j) => j % n === i));

/** Une durée par colonne : des pas différents, comme le modèle. */
const DUREES = ["55s", "75s", "62s"];

/** Le fond de carte du mur, rendu aux deux thèmes. */
const FOND = "color-mix(in srgb, currentColor 4%, transparent)";

export function MurDefilant() {
  return (
    <div className="mx-auto mt-12 max-w-6xl">
      <Colonnes n={1} className="md:hidden" />
      <Colonnes n={2} className="hidden md:flex lg:hidden" />
      <Colonnes n={3} className="hidden lg:flex" />
    </div>
  );
}

function Colonnes({ n, className }: { n: number; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[640px] justify-center gap-4 overflow-hidden",
        "[mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]",
        className,
      )}
    >
      {enColonnes(n).map((colonne, i) => (
        <Marquee
          key={i}
          vertical
          pauseOnHover
          repeat={3}
          className="w-full max-w-sm p-0 [--gap:1rem]"
          style={{ ["--duration" as string]: DUREES[i % DUREES.length] }}
        >
          {colonne.map((carte) => (
            <CarteChiffre key={carte.cle} carte={carte} />
          ))}
        </Marquee>
      ))}
    </div>
  );
}

function CarteChiffre({ carte }: { carte: Carte }) {
  return (
    <figure
      style={{ backgroundColor: FOND }}
      className="relief-verre flex flex-col gap-3 rounded-[25px] px-5 py-5"
    >
      <blockquote className="text-[0.95rem] leading-relaxed text-pretty text-foreground/90">
        {/* Les guillemets français, posés ici et non dans la donnée, comme
            sur le mur des posts ; `insecables` les garde collés au texte. */}
        {surligner(anonymiser(insecables(`« ${carte.extrait} »`)), [
          insecables(carte.chiffre),
        ])}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {carte.portrait ? (
          <Image
            src={carte.portrait}
            alt={`Portrait de ${prenom(carte.nom)}`}
            width={80}
            height={80}
            loading="lazy"
            className="size-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-muted-foreground"
          >
            {prenom(carte.nom).slice(0, 1)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">
            {prenom(carte.nom)}
          </span>
          {carte.niche ? (
            <span className="line-clamp-1 text-sm text-muted-foreground">
              {insecables(carte.niche)}
            </span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
