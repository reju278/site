import { AppelHubArticle } from "@/components/appel-hub";
import { ArticleAvis } from "@/components/article-avis";
import { LecteurVideo } from "@/components/lecteur-video";
import { avis, avisDe } from "@/contenu/avis";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { sansNoms } from "@/lib/anonymat";
import { prenom } from "@/lib/prenom";
import { versImmersion } from "@/lib/tunnel-liens";
import { insecables } from "@/lib/typographie";
import { ArrowRight } from "lucide-react";

/**
 * Le texte d'un article, prêt pour le tunnel.
 *
 * **L'ordre des deux passes compte.** `versImmersion` d'abord, qui lit la
 * syntaxe `[libellé](adresse)` ; `sansNoms` ensuite, qui ne touche qu'aux noms.
 * Dans l'autre sens, rien ne casserait visiblement, mais un nom coupé à
 * l'intérieur d'un libellé de lien aurait changé le texte que `versImmersion`
 * compare.
 *
 * **`sansAdresses` n'est pas appliquée ici**, et c'est délibéré : elle
 * effacerait les adresses des liens qui ont le droit de rester, à commencer par
 * celle de l'appel. Les liens des articles sont traités par `versImmersion`,
 * qui liste ce qui reste.
 */
const pourLeTunnel = (t: string) => sansNoms(versImmersion(t));

/**
 * Ce qu'une fenêtre d'entretien contient.
 *
 * **Il vit à part parce qu'il est ouvert depuis deux endroits** : la galerie des
 * entretiens, et les trois cartes de témoignage du hero, sur demande de Rémy.
 * Écrit deux fois, il aurait divergé à la première correction, et c'est le texte
 * de vraies personnes.
 *
 * Il ne connaît pas la fenêtre qui le porte : il rend un en-tête, une vidéo et
 * un article, et c'est `ModaleAvis` qui les encadre.
 */
export function ContenuEntretien({ id }: { id: string }) {
  const temoignage = temoignages.find((t) => t.id === id);
  const article = avisDe(id);
  if (!temoignage || !article) return null;

  const nom = prenom(temoignage.nom);

  /* L'autre entretien de la même personne, s'il est lui aussi sur cette page.
     Sans ce test, on pointerait vers une ancre qui n'existe pas. */
  const autre = article.autreEntretien
    ? avis.find(
        (a) =>
          a.slug === article.autreEntretien!.slug &&
          (entretiensImmersion as readonly string[]).includes(a.id),
      )
    : undefined;

  return (
    <>
            {/* Le contenu de la fenêtre, rendu par le serveur.

                **Il reprend la forme d'une page d'avis**, sur demande de
                Rémy : un en-tête coloré qui porte le titre et la vidéo, puis
                le bloc du texte qui remonte par-dessus avec sa jonction
                arrondie. C'est ce que fait `/resultats/<nom>`, et c'est cette
                séparation qui donne à la fenêtre l'air d'une page plutôt que
                d'une boîte. */}
            <div className="relative">
              {/* L'en-tête, sur le fond du deck : le même que les en-têtes de
                  pages du site, ses trois halos et son grain. Il n'a pas de
                  fondu par le bas, contrairement à `EnTetePage` : ici c'est
                  le bloc de l'article qui vient mordre dedans, et un fondu
                  sous une arête dessinée ne servirait à rien. */}
              <div className="relative isolate px-5 pt-10 pb-28 sm:px-8 sm:pt-12 sm:pb-32">
                <div
                  aria-hidden
                  className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10"
                />

                {/* **Ferré à gauche et non centré**, sur demande de Rémy. Un titre
                court s'annonce bien au centre ; ceux-ci font deux lignes et
                leur chapô quatre, et un bloc de texte centré sur quatre lignes
                oblige l'œil à retrouver le début de chaque ligne. La règle du
                dépôt le dit déjà : `text-balance` ne s'emploie que sur du texte
                centré, et sur un texte ferré à gauche le bord est déjà l'axe. */}
            <div className="mx-auto max-w-3xl">
                  {/* `p` et non un `h1` : la fenêtre s'ouvre par-dessus une
                      page qui a déjà le sien, et deux `h1` dans un document
                      cassent le plan. Le nom accessible de la fenêtre est
                      porté par `DialogTitle`, en `sr-only`. */}
                  <p className="titre text-2xl text-pretty text-foreground sm:text-3xl">
                    {insecables(sansNoms(article.titre))}
                  </p>

                  <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
                    {sansNoms(article.chapo)}
                  </p>
                </div>

                {/* La vidéo, dans l'en-tête et plus large que le texte : une
                    vidéo se regarde, un texte se lit, et les deux n'ont pas
                    la même bonne mesure. C'est ce que fait la page. */}
                <div className="mx-auto mt-8 max-w-3xl">
                  <LecteurVideo
                    id={temoignage.id}
                    titre={`Entretien avec ${nom}`}
                    secondes={temoignage.secondes}
                    affiche={`/temoignages/${id}.jpg`}
                    afficheAlt={sansNoms(article.afficheAlt)}
                  />
                </div>
              </div>

              {/* Le bloc de l'article, qui remonte sur l'en-tête.

                  **L'arrondi et le filet sont portés par le bloc lui-même** et
                  non par une lèvre posée par-dessus : posés sur une lèvre, la
                  courbe se dessine mais le panneau opaque derrière garde ses
                  angles droits et vient remplir l'encoche. C'est le défaut
                  que la page d'avis a déjà connu, et il est écrit là-bas.

                  **Le rayon est `--rayon-jonction`, celui de l'accueil**, sur
                  décision de Rémy. J'avais d'abord ramené cette jonction à
                  5 px pour l'accorder aux angles de la fenêtre ; il a tranché
                  dans l'autre sens, et c'est la fenêtre qui prend le grand
                  rayon. La cohérence se fait donc par le haut : la fenêtre,
                  sa jonction et la bande de l'accueil portent la même
                  courbe. */}
              <div className="relative -mt-20 rounded-t-[var(--rayon-jonction)] border-t border-border bg-background px-5 pt-10 pb-10 sm:-mt-24 sm:px-8 sm:pt-12">
                {/* Le bandeau vers l'autre entretien de la même personne.

                    Trois membres ont témoigné deux fois, à un an et demi
                    d'écart, et les deux récits sont sur la page. Quelqu'un
                    qui ouvre l'un doit voir l'autre sans le chercher : c'est
                    la règle de `/resultats`.

                    Il mène à l'ancre du lecteur de l'autre entretien, et le
                    clic ferme la fenêtre avant de sauter : voir `ModaleAvis`.
                    Il ne s'affiche que si cet autre entretien est bien sur la
                    page, sinon ce serait une cible qui ne mène nulle part. */}
                {autre ? (
                  <a
                    href={`#${ancreEntretien(autre.id)}`}
                    /* Même traitement que la carte : une ombre plutôt qu'un
                       cadre coloré. Les deux vivent dans la même page, et
                       deux façons de répondre au survol s'y liraient comme
                       deux familles d'objets. */
                    className="relief-verre group/roule mx-auto mb-10 flex max-w-3xl items-center gap-4 rounded-md border border-border bg-card p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        L&apos;autre entretien
                      </span>
                      <span className="mt-1 block text-base text-pretty text-card-foreground">
                        {sansNoms(article.autreEntretien!.libelle)}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 shrink-0 text-primary"
                    />
                  </a>
                ) : null}

                {/* L'article.

                    `max-w-3xl` : une ligne de texte courant se lit entre
                    soixante et quatre-vingts caractères, et la fenêtre est
                    plus large que ça depuis qu'elle a été élargie.

                    **Il porte l'appel du milieu**, et lui seul. Celui qui
                    était sous la vidéo a été retiré sur demande de Rémy : à
                    cet endroit, il coupait l'en-tête du texte sans qu'on ait
                    rien lu. Ici, le lecteur a parcouru la moitié du récit. */}
                <article className="mx-auto max-w-3xl">
                  <ArticleAvis
                    article={article}
                    texte={pourLeTunnel}
                    appel={<AppelHubArticle />}
                  />
                </article>
              </div>
            </div>
    </>
  );
}
