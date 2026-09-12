import { EnTetePage } from "@/components/en-tete-page";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { lettre, liens } from "@/contenu/site";
import { formaterDate, type Article } from "@/lib/flux";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Le blog, en pages de neuf articles.
 *
 * Neuf, sur décision de Rémy, et le nombre n'est pas indifférent : la grille
 * fait trois colonnes à partir de `lg`, donc neuf remplit exactement trois
 * rangées pleines. Dix en laisserait une dépareillée, avec deux trous.
 *
 * **La première page est `/articles`, les suivantes `/articles/page/2`.** Pas
 * de `/articles/page/1` : ce serait une seconde adresse pour la même liste, et
 * Google la traiterait comme un doublon de `/articles`. Le composant le sait et
 * ramène toujours vers `/articles` pour la première.
 *
 * Tout est calculé au build et rafraîchi avec le flux : la pagination ne coûte
 * donc rien à la lecture, et les pages restent servies en statique par le CDN.
 */

/** Neuf par page : trois rangées pleines sur la grille à trois colonnes. */
export const PAR_PAGE = 9;

/** L'adresse d'une page du blog. La première n'en a pas de numérotée. */
export function adressePage(numero: number): string {
  return numero <= 1 ? "/articles" : `/articles/page/${numero}`;
}

export function GrilleArticles({
  articles,
  page,
  total,
}: {
  /** Les articles de cette page-là, déjà découpés. */
  articles: readonly Article[];
  page: number;
  /** Le nombre total de pages. */
  total: number;
}) {
  return (
    <>
      <EnTetePage>
        <h1 className="titre text-5xl text-balance text-foreground sm:text-6xl">
          {lettre.nom}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">{lettre.baseline}</p>
        <div className="mt-8 flex justify-center">
          <BoutonScintillant href={liens.lettre}>
            <TexteRoulant>S&apos;abonner à la lettre</TexteRoulant>
            <ArrowUpRight className="size-4" />
          </BoutonScintillant>
        </div>
      </EnTetePage>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <a
              key={article.lien}
              href={article.lien}
              target="_blank"
              rel="noreferrer"
              className="relief-verre group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-ring"
            >
              {article.image ? (
                // Une image de Substack, servie par leur CDN et de taille
                // inconnue au build : `next/image` n'y gagnerait rien et
                // exigerait de déclarer leur domaine.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="aspect-16/9 w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm text-muted-foreground">
                  {formaterDate(article.date)}
                </p>
                {/* `h2` et non `h3` : le `h1` de la page est son titre, et ces
                    cartes sont les sections de la liste. Aucun niveau n'est
                    sauté. */}
                <h2 className="mt-2 text-lg leading-snug font-semibold text-balance text-card-foreground">
                  {article.titre}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {article.chapeau}
                </p>
              </div>
            </a>
          ))}
        </div>

        {total > 1 ? <Pagination page={page} total={total} /> : null}
      </Section>
    </>
  );
}

/**
 * La pagination.
 *
 * **Ce sont des liens et non des boutons.** Chacun mène à une adresse, donc il
 * se suit, s'ouvre dans un onglet et s'aperçoit au survol. Un bouton qui change
 * de page perd tout cela, et les robots ne le suivent pas : les pages
 * suivantes deviendraient invisibles pour eux.
 *
 * **Le numéro courant n'est pas un lien**, il ne mène nulle part. Il porte
 * `aria-current="page"`, qui est la façon d'annoncer « vous êtes ici ».
 *
 * La fenêtre de numéros est bornée : au-delà de sept pages, on n'affiche que
 * les voisines et les extrémités. Une rangée de trente numéros n'aide personne
 * et déborde sur téléphone.
 */
function Pagination({ page, total }: { page: number; total: number }) {
  const numeros = fenetre(page, total);

  return (
    <nav aria-label="Pages du blog" className="mt-14 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <FlechePage
            vers={page - 1}
            actif={page > 1}
            libelle="Page précédente"
          >
            <ArrowLeft aria-hidden className="size-4" />
          </FlechePage>
        </li>

        {numeros.map((numero, i) =>
          numero === null ? (
            // Les points de suspension ne sont pas une commande : ils ne
            // prennent ni lien ni rôle, et `aria-hidden` évite de les faire
            // annoncer comme du contenu.
            <li
              key={`saut-${i}`}
              aria-hidden
              className="px-1 text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={numero}>
              {numero === page ? (
                <span
                  aria-current="page"
                  className="flex size-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {numero}
                </span>
              ) : (
                <Link
                  href={adressePage(numero)}
                  aria-label={`Page ${numero}`}
                  className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-sm font-semibold text-card-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {numero}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          <FlechePage
            vers={page + 1}
            actif={page < total}
            libelle="Page suivante"
          >
            <ArrowRight aria-hidden className="size-4" />
          </FlechePage>
        </li>
      </ul>
    </nav>
  );
}

/**
 * Une flèche de pagination.
 *
 * Aux extrémités, elle devient un `span` et non un lien désactivé : un lien
 * vers nulle part reste focalisable et s'annonce comme un lien, ce qui est un
 * mensonge. Le `span` disparaît de la navigation au clavier, ce qui est exact.
 */
function FlechePage({
  vers,
  actif,
  libelle,
  children,
}: {
  vers: number;
  actif: boolean;
  libelle: string;
  children: React.ReactNode;
}) {
  const forme =
    "flex size-10 items-center justify-center rounded-md border border-border";

  if (!actif) {
    return (
      <span
        aria-hidden
        className={`${forme} bg-card text-muted-foreground opacity-40`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={adressePage(vers)}
      aria-label={libelle}
      className={`${forme} bg-card text-card-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
    >
      {children}
    </Link>
  );
}

/**
 * Les numéros à afficher : les extrémités, la page courante et ses voisines.
 * `null` marque un saut, rendu en points de suspension.
 */
function fenetre(page: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (unused, i) => i + 1);
  }

  const bornes = new Set([1, total, page, page - 1, page + 1]);
  const gardes = [...bornes]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const sortie: (number | null)[] = [];
  let precedent = 0;

  for (const n of gardes) {
    if (precedent && n - precedent > 1) sortie.push(null);
    sortie.push(n);
    precedent = n;
  }

  return sortie;
}
