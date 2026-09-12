import { AppelOffres } from "@/components/appel-offres";
import { EnTetePage } from "@/components/en-tete-page";
import { Section } from "@/components/section";
import { TexteRoulant } from "@/components/texte-roulant";
import { SITE, identite, lettre } from "@/contenu/site";
import {
  articlesPublies,
  formaterDate,
  lireArticles,
  resume,
  type Article,
} from "@/lib/flux";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { insecables } from "@/lib/typographie";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Un article de la lettre, hébergé ici et non plus seulement lié.
 *
 * **Pourquoi la page existe.** Le flux Substack ne porte pas qu'un titre et un
 * lien : il porte le corps entier de l'article, ses images et son auteur. Le
 * site n'en affichait que l'accroche avant d'envoyer le lecteur ailleurs, donc
 * tout le référencement de textes écrits par Rémy allait à Substack. Ici, les
 * mêmes textes travaillent pour son domaine.
 *
 * **Le point qu'aucun code ne règle, et qui se décide.** Le même texte existe
 * maintenant à deux adresses : ici et sur `lettre.funnels.club`, qui se déclare
 * canonique de lui-même. Cette page fait de même, donc les deux revendiquent
 * l'original et Google choisit. Il choisit généralement la page qui porte le
 * plus de signaux, et c'est là que le reste compte : données structurées, fil
 * d'Ariane, maillage interne, mention de source. Mais **la seule réparation
 * complète est chez Substack**, pas ici : soit en y déclarant notre adresse
 * comme canonique, soit en cessant d'y publier. C'est une décision de Rémy.
 *
 * La mention de source en bas de page n'est donc pas une politesse : elle dit à
 * un lecteur, et accessoirement à un robot, d'où vient le texte.
 */

/* Aligné sur `FRAICHEUR` dans `lib/flux.ts` : la page et le flux qu'elle lit
   n'ont aucune raison de vieillir à des rythmes différents. */
export const revalidate = 600;

/**
 * **`true`, et c'est indispensable ici.**
 *
 * `generateStaticParams` ne s'exécute qu'au build : elle fige la liste des
 * adresses connues au moment du déploiement. À `false`, tout ce qui n'y figure
 * pas rend un 404 — donc **chaque nouvel article publié sur Substack aurait une
 * carte sur `/articles`, qui rafraîchit toutes les heures, et une page qui
 * n'existe pas**, jusqu'au prochain déploiement. Le défaut est silencieux : le
 * build passe, la liste se met à jour, et seul un visiteur qui clique le
 * découvre.
 *
 * À `true`, une adresse inconnue est construite à la demande puis mise en
 * cache. Un slug qui ne correspond à aucun article du flux passe quand même par
 * `notFound()`, donc on ne gagne pas de page vide au passage.
 *
 * Le seul reste est une fenêtre : un article publié à l'instant peut rendre un
 * 404 tant que le flux en cache n'a pas expiré, au plus une heure. C'est le
 * même délai que la liste, et il se réduit en baissant `revalidate`.
 */
export const dynamicParams = true;

type Params = { params: Promise<{ article: string }> };

const TOUT = 120;

async function trouver(slug: string): Promise<Article | null> {
  const articles = articlesPublies(await lireArticles(TOUT));
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const articles = articlesPublies(await lireArticles(TOUT));
  return articles.map((a) => ({ article: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { article: slug } = await params;
  const article = await trouver(slug);
  if (!article) return {};

  const description = resume(article);

  return {
    /* `absolute` et non le gabarit du site : celui-ci ajoute « · Rémy Jupille »,
       soit quinze caractères pris sur les soixante que montre une page de
       résultats. Les titres de la lettre sont écrits par Rémy et ne se
       raccourcissent pas ici : un titre est du contenu, pas de la mise en
       forme. Ceux qui dépassent seront coupés par Google à l'affichage, ce qui
       ne coûte rien tant que les mots du sujet sont au début. */
    title: { absolute: article.titre },
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.titre,
      description,
      url: `${SITE}/articles/${article.slug}`,
      publishedTime: article.date || undefined,
      authors: [article.auteur ?? identite.nom],
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function PageArticle({ params }: Params) {
  const { article: slug } = await params;
  const tous = articlesPublies(await lireArticles(TOUT));
  const article = tous.find((a) => a.slug === slug);
  if (!article) notFound();

  const description = resume(article);

  /* Les voisins se prennent à la suite dans la liste, en bouclant : chaque
     article en cite trois, et chacun est cité autant de fois. Un tirage au
     hasard fait des orphelins, un tri par date laisse les plus anciens sans
     personne pour les pointer. C'est la règle du maillage d'`AGENTS.md`. */
  const depart = tous.findIndex((a) => a.slug === article.slug);
  const voisins = Array.from(
    { length: Math.min(3, tous.length - 1) },
    (unused, i) => tous[(depart + i + 1) % tous.length],
  ).filter((a): a is Article => Boolean(a));

  return (
    <>
      {/* **`BlogPosting` et non `Article`** : le second est le type générique,
          le premier dit à quoi on a affaire. `dateModified` vaut
          `datePublished` parce que le flux ne porte aucune date de révision, et
          **une date inventée est pire qu'une date absente**.

          `mainEntityOfPage` rattache le balisage à cette adresse précise, et
          `author` pointe vers la `Person` que l'accueil déclare déjà, par son
          identifiant : sans ça, Google voit un nom, pas une personne. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.titre,
            description,
            url: `${SITE}/articles/${article.slug}`,
            mainEntityOfPage: `${SITE}/articles/${article.slug}`,
            datePublished: article.date || undefined,
            dateModified: article.date || undefined,
            inLanguage: "fr-FR",
            image: article.image ?? undefined,
            author: { "@id": `${SITE}/#personne`, name: identite.nom },
            publisher: { "@id": `${SITE}/#personne`, name: identite.nom },
            isPartOf: {
              "@type": "Blog",
              name: lettre.nom,
              url: `${SITE}/articles`,
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Blog",
                item: `${SITE}/articles`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: article.titre,
                item: `${SITE}/articles/${article.slug}`,
              },
            ],
          }),
        }}
      />

      <EnTetePage>
        {/* Le fil d'Ariane visible double celui des données structurées : c'est
            lui qui rend la remontée possible au clavier et à la main, là où le
            balisage ne parle qu'aux robots. */}
        <nav
          aria-label="Fil d'Ariane"
          className="mb-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link
            href="/articles"
            className="transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <ChevronRight aria-hidden className="size-3.5 opacity-60" />
          <span className="max-w-[22ch] truncate sm:max-w-none">
            {article.titre}
          </span>
        </nav>

        {/* `insecables` : les titres viennent de Substack et portent volontiers
            un point d'interrogation précédé d'une espace, qui se retrouverait
            seul en début de ligne. Voir `lib/typographie.ts`. */}
        <h1 className="titre mx-auto max-w-4xl text-4xl text-balance text-foreground sm:text-5xl">
          {insecables(article.titre)}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {article.chapeau}
        </p>

        {article.date ? (
          <p className="mt-5 text-sm text-muted-foreground">
            <time dateTime={new Date(article.date).toISOString()}>
              {formaterDate(article.date)}
            </time>
            {article.auteur ? ` · ${article.auteur}` : null}
          </p>
        ) : null}
      </EnTetePage>

      <Section>
        <article className="mx-auto max-w-3xl">
          {/* La couverture est l'image que Google chronomètre : pas de
              `loading="lazy"`, et `fetchPriority="high"`. Ses cotes viennent du
              nom du fichier, relues dans `flux.ts`. */}
          {article.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt=""
              width={article.imageLargeur ?? undefined}
              height={article.imageHauteur ?? undefined}
              fetchPriority="high"
              className="mb-10 w-full rounded-md border border-border"
            />
          ) : null}

          {/* Le corps est injecté parce qu'il n'est pas écrit ici : il vient du
              flux, et il a été **reconstruit balise par balise** par
              `assainir()`, qui n'émet que ce qu'il a explicitement autorisé.
              C'est ce qui rend l'injection acceptable ; sans cette
              reconstruction, elle ne le serait pas. */}
          <div
            className="corps-article"
            dangerouslySetInnerHTML={{ __html: article.contenu }}
          />

          {/* La mention de source. Elle dit d'où vient le texte, ce qui est
              honnête pour un lecteur, et elle donne à Substack le lien entrant
              qu'une reprise de contenu lui doit. */}
          <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
            Cet article a d&apos;abord paru dans {lettre.nom},{" "}
            <a
              href={article.lien}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            >
              la lettre de Rémy Jupille
            </a>
            .
          </p>
        </article>
      </Section>

      {voisins.length > 0 ? (
        <Section className="[&>div]:pt-0">
          <div className="mx-auto max-w-3xl">
            <h2 className="titre text-2xl text-foreground sm:text-3xl">
              À lire ensuite
            </h2>

            <ul className="mt-6 space-y-3">
              {voisins.map((voisin) => (
                <li key={voisin.slug}>
                  <Link
                    href={`/articles/${voisin.slug}`}
                    className="relief-verre group/carte flex items-center gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-pretty text-card-foreground">
                        {voisin.titre}
                      </span>
                      <span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">
                        {voisin.chapeau}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 shrink-0 text-primary transition-transform group-hover/carte:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-center">
              <Link
                href="/articles"
                className="group/roule inline-flex h-11 items-center gap-2 rounded-md border border-current px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <TexteRoulant>Tous les articles du blog</TexteRoulant>
                <ArrowUpRight aria-hidden className="size-4 shrink-0" />
              </Link>
            </div>
          </div>
        </Section>
      ) : null}

      <AppelOffres />
    </>
  );
}
