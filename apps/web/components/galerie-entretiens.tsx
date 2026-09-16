import { ArticleAvis } from "@/components/article-avis";
import { LecteurVideo } from "@/components/lecteur-video";
import { ModaleAvis } from "@/components/modale-avis";
import { TexteRoulant } from "@/components/texte-roulant";
import { avis, avisDe } from "@/contenu/avis";
import { AppelHubArticle } from "@/components/appel-hub";
import { ancreEntretien, entretiensImmersion } from "@/contenu/immersion";
import { temoignages } from "@/contenu/site";
import { sansNoms } from "@/lib/anonymat";
import { prenom } from "@/lib/prenom";
import { versImmersion } from "@/lib/tunnel-liens";
import { insecables } from "@/lib/typographie";
import { ArrowRight, Play } from "lucide-react";

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
 * La durée d'un entretien, en minutes et secondes.
 *
 * Elle répond à la question qu'on se pose avant de cliquer : combien de temps
 * ça prend. Reprise du sommaire du hub.
 */
function dureeLisible(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

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

        /* L'autre entretien de la même personne, s'il est lui aussi sur cette
           page. `avis.ts` en compte vingt-deux, la page en montre vingt-deux :
           le test reste, parce qu'une liste plus courte le rendrait nécessaire
           du jour au lendemain, et sans lui on pointerait vers une ancre qui
           n'existe pas. */
        const autre = article.autreEntretien
          ? avis.find(
              (a) =>
                a.slug === article.autreEntretien!.slug &&
                (entretiensImmersion as readonly string[]).includes(a.id),
            )
          : undefined;

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
                  /* **Au survol, la carte se soulève, elle ne se cerne pas.**
                     Le motif du site colore la bordure en `ring` ; Rémy ne veut
                     pas de ce cadre coloré ici. Une ombre portée et deux pixels
                     de montée disent la même chose sans dessiner de trait : la
                     carte répond au clic qu'on s'apprête à faire.

                     L'ombre est de la famille de celles du projet, très diffuse
                     et décalée vers le bas, donc lue comme de la profondeur et
                     non comme un contour. Elle est **portée** et ne se dispute
                     pas la place du relief de verre, qui est intérieur.

                     La translation est verticale : elle n'élargit pas la boîte,
                     donc rien à couper, contrairement à ce que la règle du
                     dépôt impose aux rotations.

                     **La propriété animée est `translate` et non `transform`.**
                     Tailwind v4 pose les translations sur la propriété
                     `translate` du CSS, pas sur `transform` : écrite
                     `transition-[transform,…]`, la montée se produisait d'un
                     coup, sans transition, et `getComputedStyle` rendait
                     `transform: none`. Mesuré, pas supposé.

                     On n'anime pas tout : au survol, la couleur de fond de la
                     pilule change aussi, et `transition-all` ferait traîner ce
                     qui doit être net. */
                  className="relief-verre group/carte group/roule flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-card text-left transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {/* L'affiche, **recadrée sur la bande d'image réelle**.

                      Les entretiens sont des appels à deux, et l'enregistrement
                      porte ses propres bandes noires : en 16/9, la moitié de la
                      vignette était du noir, et la carte avait l'air cassée
                      plutôt que sobre. C'est le défaut que Rémy a signalé, et
                      c'est la même réparation que sur le sommaire du hub.

                      **Le rapport est mesuré, pas choisi.** Les affiches ont été
                      relevées en lisant leur luminance ligne par ligne : le
                      contenu occupe les lignes 90 à 269 d'une image de 360,
                      c'est-à-dire la moitié centrale au pixel près. 640 sur 180
                      donne 32/9, seule valeur qui les découvre sans laisser de
                      noir.

                      L'image avance légèrement au survol de la carte : c'est ce
                      qui la fait répondre au clic qu'on s'apprête à faire. */}
                  <span className="relative block aspect-32/9 overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/temoignages/${id}.jpg`}
                      alt=""
                      width={1280}
                      height={720}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover/carte:scale-[1.03]"
                    />

                    {/* La durée, en bas à droite.

                        **Elle dit que c'est une vidéo**, ce que la carte ne
                        disait nulle part, et surtout combien de temps ça prend,
                        qui est la question qu'on se pose avant de cliquer.

                        Fond noir à 70 % et non un jeton de thème : il se pose
                        sur une photographie, dont on ne sait pas si elle est
                        claire ou sombre à cet endroit. Au pire cas, image
                        entièrement blanche dessous, le blanc y tient 8,6:1. */}
                    <span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-white tabular-nums">
                      <Play aria-hidden className="size-2.5 fill-current" />
                      {dureeLisible(temoignage.secondes)}
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-5">
                    <span className="block text-base font-semibold text-card-foreground">
                      {nom}
                    </span>
                    <span className="mt-1 block text-sm text-pretty text-muted-foreground">
                      {insecables(temoignage.description)}
                    </span>

                    {/* L'action, **en pilule**, sur demande de Rémy : le libellé
                        bleu d'avant ne se distinguait pas d'une phrase et ne
                        mettait rien en valeur.

                        Elle ne prend pas toute la largeur, contrairement à la
                        barre du hub : une pilule se lit comme un objet posé là,
                        une barre pleine comme un second bouton, et la carte
                        entière est déjà cliquable.

                        `rounded-full` est ici légitime : la règle des 5 px parle
                        d'angles arrondis, et une pilule n'a pas d'angle. C'est
                        la forme des gélules du hero, déjà dans la page.

                        **L'espace au-dessus est un `pt-5` et non un `mt-*`** :
                        `mt-auto` pousse le bloc au bas de la carte, et une marge
                        haute entrerait en conflit avec lui.

                        `min-h-9` et non `h-9` : un libellé qui passerait à deux
                        lignes serait rogné par une hauteur fixe. */}
                    <span className="mt-auto pt-5">
                      <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-foreground transition-colors group-hover/carte:bg-primary group-hover/carte:text-primary-foreground">
                        <TexteRoulant>Voir son entretien</TexteRoulant>
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 transition-transform group-hover/carte:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </span>
                </button>
              }
            >
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

                  <div className="mx-auto max-w-3xl text-center">
                    {/* `p` et non un `h1` : la fenêtre s'ouvre par-dessus une
                        page qui a déjà le sien, et deux `h1` dans un document
                        cassent le plan. Le nom accessible de la fenêtre est
                        porté par `DialogTitle`, en `sr-only`. */}
                    <p className="titre text-2xl text-balance text-foreground sm:text-3xl">
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

                    **Le rayon est celui du projet, 5 px, et non
                    `--rayon-jonction`.** L'exception d'échelle vise une bande
                    qui fait toute la largeur de l'écran, où 5 px sur 1400 ne se
                    verraient pas. Ici la jonction fait 896 px, dans une fenêtre
                    dont les angles sont eux-mêmes à 5 px : un arc de 40 px y
                    devenait le premier objet qu'on voyait, et il ne
                    correspondait à aucun autre angle de la fenêtre. C'est
                    exactement la correction déjà faite sur le panneau des menus
                    de l'en-tête, dont les rayons ont été rentrés pour la même
                    raison. Mesuré : la fenêtre et les cartes sont à 5 px, la
                    jonction était à 40. */}
                <div className="relative -mt-20 rounded-t-md border-t border-border bg-background px-5 pt-10 pb-10 sm:-mt-24 sm:px-8 sm:pt-12">
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
            </ModaleAvis>
          </li>
        );
      })}
    </ul>
  );
}
