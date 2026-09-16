import { ArticleAvis } from "@/components/article-avis";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { LecteurVideo } from "@/components/lecteur-video";
import { ModaleAvis } from "@/components/modale-avis";
import { TexteRoulant } from "@/components/texte-roulant";
import { avisDe } from "@/contenu/avis";
import { AppelHubArticle } from "@/components/appel-hub";
import { appelHub } from "@/contenu/hub";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { SORTIE } from "@/lib/hub";
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
 * l'intérieur d'un libellé de lien aurait changé le texte que
 * `versImmersion` compare.
 *
 * **`sansAdresses` n'est pas appliquée ici**, et c'est délibéré : elle
 * effacerait les adresses des liens qui ont le droit de rester, à commencer par
 * celle de l'appel. Les liens des articles sont traités par `versImmersion`,
 * qui liste ce qui reste.
 */
const pourLeTunnel = (t: string) => sansNoms(versImmersion(t));

/**
 * La galerie des entretiens : les cartes de `/resultats`, mais qui ouvrent
 * l'entretien dans une fenêtre au lieu de mener à une page.
 *
 * **C'est la demande de Rémy, mot pour mot : « exactement la même chose que ce
 * qu'on avait fait, mais adapté avec cette vue pop-up ».** La carte est celle du
 * sommaire des résultats, au détail près : affiche en 16/9, prénom, accroche, et
 * un libellé qui roule au survol. Ce qui change est ce qu'elle fait.
 *
 * **Le corps de l'article n'est pas réécrit**, il vient d'`ArticleAvis`, le même
 * composant que sert `/resultats/<nom>`. Les surlignages, les citations et les
 * liens en contexte sont donc les mêmes objets, pas des copies.
 *
 * **Les liens de l'article passent par `versImmersion`.** Un article qui renvoie
 * à l'entretien d'une autre personne présente sur la page renvoie à l'ancre de
 * son lecteur ; tout le reste est déshabillé. On n'ouvre pas une porte de sortie
 * au milieu d'un tunnel.
 *
 * **Pas de transcription dans la fenêtre**, et c'est un choix. Sur une page
 * interdite d'index, mille mots de parole non relue n'apportent aucun
 * référencement ; quatorze transcriptions pèsent trois cent vingt-huit
 * kilooctets dans `avis.ts`, qui partiraient toutes dans la charge utile pour
 * être lues par presque personne. C'est déjà la règle du hub, dans `AGENTS.md`.
 * Elles restent sur `/resultats/<nom>`, où elles font leur travail.
 *
 * **Un seul lecteur Wistia peut exister à la fois** : Radix ne monte le contenu
 * d'une fenêtre que lorsqu'elle est ouverte, et le démonte à la fermeture, ce
 * qui coupe le son au passage. La page source chargeait ses dix-neuf lecteurs
 * d'avance.
 */
export function GalerieEntretiens() {
  return (
    <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
      {entretiensImmersion.map((id) => {
        /* Le prénom, l'accroche, la durée et l'affiche sont lus dans
           `temoignages` et `avis.ts`, jamais réécrits ici. Un entretien retiré
           de là disparaît d'ici sans laisser de carte vide. */
        const temoignage = temoignages.find((t) => t.id === id);
        const article = avisDe(id);
        if (!temoignage || !article) return null;

        const nom = prenom(temoignage.nom);

        return (
          <li key={id} id={ancreEntretien(id)} className="scroll-mt-24">
            <ModaleAvis
              titre={`Entretien avec ${nom}`}
              description={sansNoms(article.chapo)}
              declencheur={
                /* Un `button` et non un lien : ça n'emmène nulle part, ça ouvre
                   une fenêtre. C'est la règle du projet, et c'est aussi ce qui
                   donne le bon rôle à un lecteur d'écran. `text-left` parce
                   qu'un bouton centre son texte par défaut. */
                <button
                  type="button"
                  className="relief-verre group/carte group/roule flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-card text-left transition-colors hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {/* L'affiche porte les bandes noires de l'enregistrement : ce
                      sont des appels à deux. Voir `AGENTS.md`. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/temoignages/${id}.jpg`}
                    alt=""
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />

                  <div className="flex flex-1 flex-col p-5">
                    <span className="block text-base font-semibold text-card-foreground">
                      {nom}
                    </span>
                    <span className="mt-1 block text-sm text-pretty text-muted-foreground">
                      {insecables(temoignage.description)}
                    </span>
                    <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                      <TexteRoulant>Voir son entretien</TexteRoulant>
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover/carte:translate-x-0.5"
                      />
                    </span>
                  </div>
                </button>
              }
            >
              {/* Le contenu de la fenêtre, rendu par le serveur. */}
              <div className="px-5 pt-10 pb-8 sm:px-8 sm:pt-12">
                {/* Le titre de l'article, celui de `/resultats/<nom>`.

                    `p` et non un `h1` : la fenêtre s'ouvre par-dessus une page
                    qui a déjà le sien, et deux `h1` dans un document cassent le
                    plan. Le nom accessible de la fenêtre est porté par
                    `DialogTitle`, en `sr-only`. */}
                <p className="titre text-2xl text-balance text-foreground sm:text-3xl">
                  {insecables(sansNoms(article.titre))}
                </p>

                <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
                  {sansNoms(article.chapo)}
                </p>

                {/* La vidéo, au centre, comme sur la page. Le lecteur n'appelle
                    Wistia qu'au clic, et il est démonté à la fermeture de la
                    fenêtre, ce qui coupe le son. */}
                <div className="mt-8">
                  <LecteurVideo
                    id={temoignage.id}
                    titre={`Entretien avec ${nom}`}
                    secondes={temoignage.secondes}
                    affiche={`/temoignages/${id}.jpg`}
                    afficheAlt={sansNoms(article.afficheAlt)}
                  />
                </div>

                {/* L'appel, juste sous l'entretien : quelqu'un qui vient de voir
                    un membre raconter ses résultats est exactement là où la
                    question se pose. C'est la place qu'il a sur la page. */}
                <div className="mt-6 flex justify-center">
                  <BoutonScintillant href={SORTIE}>
                    {appelHub.libelle}
                    <ArrowRight aria-hidden className="size-4 shrink-0" />
                  </BoutonScintillant>
                </div>

                {/* L'article.

                    **Il porte l'appel du milieu**, comme la page : sa place
                    n'est pas décorative, c'est le moment où quelqu'un qui a lu
                    la moitié du parcours se demande ce que ça donnerait pour
                    lui. `AppelHubArticle` est celui du tunnel, qui ne propose
                    que l'appel : celui du site propose aussi la formation
                    gratuite, qui vit sur un autre domaine et serait une sortie.

                    La fenêtre borne déjà la mesure du texte, donc pas de
                    `max-w-*` ici. */}
                <article className="mt-12">
                  <ArticleAvis
                    article={article}
                    texte={pourLeTunnel}
                    appel={<AppelHubArticle />}
                  />
                </article>
              </div>
            </ModaleAvis>
          </li>
        );
      })}
    </ul>
  );
}
