import { ConversationConsulting } from "@/components/conversation-consulting";
import { CourbeMontante } from "@/components/courbe-montante";
import { CourbeVivante } from "@/components/courbe-vivante";
import { FondResultats } from "@/components/fond-resultats";
import { BoutonScintillant } from "@/components/bouton-scintillant";
import { CarrouselTemoignages } from "@/components/carrousel-temoignages";
import { LecteurVideo } from "@/components/lecteur-video";
import { LogoFunnels } from "@/components/logo-funnels";
import { MessageRemy } from "@/components/message-remy";
import { SectionLivre } from "@/components/section-livre";
import { SectionTunnel } from "@/components/section-tunnel";
import { SurtitreOffre } from "@/components/surtitre-offre";
import { TexteRoulant } from "@/components/texte-roulant";
import { TitreRoulant } from "@/components/titre-roulant";
import { KineticText } from "@repo/ui/components/kinetic-text";
import { ParticulesHero } from "@/components/particules-hero";
import { Section } from "@/components/section";
import {
  SITE,
  identite,
  liens,
  pastilleHero,
  offres,
  sousTitreOffres,
  titreOffres,
  titreResultats,
  video,
} from "@/contenu/site";
import { ArrowRight } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

/**
 * Les données structurées de la page d'accueil.
 *
 * `sameAs` est la partie qui compte : c'est elle qui dit à Google que le site,
 * la chaîne YouTube, l'Instagram et le LinkedIn appartiennent à la même
 * personne. Sans elle, chaque profil vit de son côté et le nom ne consolide
 * rien.
 *
 * Le bloc est écrit avec `dangerouslySetInnerHTML` parce que c'est la seule
 * façon de poser du JSON-LD dans React : un `<script>` avec des enfants JSX
 * serait échappé et deviendrait illisible pour les robots.
 */
const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "Person",
  /* **L'identifiant est ce qui rend cette personne citable.** Les pages
     d'articles déclarent leur auteur par `{"@id": SITE + "/#personne"}` plutôt
     que de recopier son nom : sans cet ancrage ici, elles pointeraient vers
     rien, et Google verrait une chaîne de caractères au lieu de l'entité qu'il
     connaît déjà par cette page. */
  "@id": `${SITE}/#personne`,
  name: identite.nom,
  url: SITE,
  jobTitle: "Formateur et consultant en acquisition",
  worksFor: { "@type": "Organization", name: identite.societe },
  sameAs: [
    /* Les trois chaînes, et la principale en tête : `sameAs` sert à rattacher
       le site aux profils d'une même personne, donc en oublier une revient à
       laisser Google la traiter comme celle de quelqu'un d'autre. */
    liens.youtubeRemy,
    liens.youtube,
    liens.youtubeFunnels,
    liens.instagram,
    liens.tiktok,
    liens.linkedin,
    liens.facebook,
  ],
};

export default function Accueil() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(donneesStructurees),
        }}
      />

      {/* ---------------------------------------------------------------
          Le hero.

          Titre, sous-titre, deux boutons, la vidéo. Rien d'autre : pas de
          fond animé, pas de cartes qui flottent. Ce qui doit retenir le
          regard ici, c'est la vidéo, et un décor qui bouge lui volerait la
          place.

          L'en-tête est flottant et fixe : le `pt-40` le dégage et pose le
          titre vers le milieu de l'image.
      --------------------------------------------------------------- */}
      <section
        className="relative isolate px-5 pt-40 sm:pt-52"
        // La hauteur exacte du cadre vidéo, en 16/9 : la largeur disponible
        // (l'écran moins les marges, plafonnée à la largeur du cadre) multipliée
        // par 9/16. Le fond s'arrête à la moitié de cette valeur, ce qui coupe
        // la vidéo en deux quelle que soit la taille de l'écran. Une hauteur
        // écrite en dur produisait un cadre qui n'était plus en 16/9, et Wistia
        // y ajoutait des bandes noires sur les côtés.
        style={
          {
            "--video-h": "calc(min(100vw - 2.5rem, 48rem) * 9 / 16)",
          } as React.CSSProperties
        }
      >
        {/* Le fond.

            Deux fichiers, un par largeur : 960 px pour le téléphone, 1920 px
            au-delà. Servir 1920 px à un écran de 375 fait payer six fois le
            poids pour rien.

            L'image ne descend pas jusqu'au bas de la section : elle s'arrête à
            la moitié de `--video-h`, déclarée sur la section. C'est ce décalage
            qui fait chevaucher la vidéo sur la limite entre l'image et la page,
            sans marge négative ni décalage de transformation, donc sans que la
            section suivante ait à réserver de la place.

            Le voile assombri garantit le contraste du texte quel que soit le
            thème : cette bande reste sombre dans les deux, sinon le verre de
            l'en-tête n'aurait rien à mordre. */}
        <div
          // Le repère que l'en-tête observe pour savoir s'il surplombe une
          // bande sombre. Sans lui, il s'habille pour un fond de page, ce qui
          // est le défaut sûr : c'est cette absence qui le rendait blanc sur
          // beige en haut des pages sans hero.
          data-bande-sombre
          className="absolute inset-x-0 top-0 bottom-[calc(var(--video-h)/2)] -z-10 overflow-hidden"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* `alt=""` assumé : cette image est décorative, elle ne porte
                aucune information que le texte ne dise déjà. Les dimensions
                sont déclarées pour que le navigateur réserve la place et que
                la page ne saute pas au chargement, et `fetchPriority` la
                signale comme l'image que Google chronomètre. */}
            <img
              src="/fond-hero-mobile.jpg"
              alt=""
              width={1920}
              height={1097}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </picture>
          <div aria-hidden className="absolute inset-0 bg-black/55" />

          {/* Les particules passent après le voile, donc au-dessus de lui, mais
              restent dans la bande en `-z-10` : elles dérivent derrière le
              titre sans jamais le recouvrir. */}
          <ParticulesHero />
        </div>

        {/* Le raccord entre l'image et la page.

            C'était un dégradé, qui fondait l'image vers la couleur de page.
            C'est une **lèvre** : un bandeau de la couleur de la page, posé sur
            le bas de l'image, aux deux angles hauts arrondis. La page ne
            s'efface plus dans l'image, elle monte par-dessus, et la vidéo
            chevauche la limite.

            **Elle est en dehors du conteneur de l'image, et c'est la
            réparation d'un vrai défaut.** Elle était dedans, calée sur son bord
            bas. Or ce conteneur est rogné, et son bord tombe sur un pixel
            fractionnaire : `--video-h` vaut `min(100vw - 2.5rem, 48rem) × 9/16`,
            qui n'est presque jamais un entier. Le navigateur lissait donc cette
            arête, et ce lissage dessinait un trait clair sur toute la largeur de
            l'écran, juste sous la vidéo.

            Dehors, la lèvre n'est plus rognée et descend huit pixels plus bas
            que le conteneur : elle **couvre** l'arête au lieu de s'aligner
            dessus, et son propre bord bas se pose sur la couleur de page, donc
            sur la même couleur qu'elle. Un bord qui sépare deux fois la même
            couleur ne se voit pas, quel que soit le lissage.

            Le bandeau doit être plus haut que son rayon, sinon les deux angles
            se rejoignent et l'arrondi se coupe au milieu.

            `bg-background` et rien d'autre : aucune couleur n'est écrite, la
            lèvre suit le thème. */}
        <div
          aria-hidden
          className="absolute inset-x-0 -z-10 h-24 rounded-t-[var(--rayon-jonction)] bg-background"
          style={{ bottom: "calc(var(--video-h) / 2 - 8px)" }}
        />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            {/* La pastille de preuve, au-dessus du titre.

                La forme est celle du hero de TrendTrack, fournie par Rémy :
                une gélule en verre, une file de portraits qui se chevauchent,
                une phrase. Le verre est celui des capsules de l'en-tête, et
                pour la même raison : elle flotte sur la photo, qui est sombre
                dans les deux thèmes, donc le blanc translucide y est chez lui
                et un jeton de thème n'aurait rien à suivre.

                **Les visages sont ceux de vrais clients**, pris dans les
                affiches de leurs témoignages, déjà publiques sur `/resultats`.
                Le cadrage est relevé image par image : ce sont des appels à
                deux, et le client n'est pas toujours du même côté. Voir
                `pastilleHero` dans `site.ts`.

                Les portraits sont `aria-hidden` et la phrase se lit seule :
                quatre images sans nom n'apportent rien à l'oreille, et les
                annoncer une par une découperait la phrase en cinq morceaux. */}
            <div className="mb-6 flex justify-center sm:mb-8">
              <div
                /* La gélule est un cran plus petite que le relevé, sur
                   décision de Rémy : elle ne doit pas dépasser la largeur du
                   titre qu'elle annonce. Une mention plus large que le titre
                   cesse d'être une mention, elle devient le premier objet de
                   la page. Le corps descend d'un cran sur téléphone, où le
                   titre est lui-même plus court. */
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/6 py-1.5 pr-4 pl-1.5 backdrop-blur-md"
              >
                <span aria-hidden className="flex">
                  {pastilleHero.portraits.map((portrait, i) => (
                    /* Le rond est le conteneur, l'image est dedans et
                       **agrandie**, sur correction de Rémy.

                       Les affiches portent les bandes noires de
                       l'enregistrement, treize pour cent de la hauteur en haut
                       comme en bas. Un `object-cover` dans un carré cale la
                       hauteur de l'image sur celle du cadre : les bandes
                       tombaient donc pile dans le rond, et chaque portrait
                       avait un trait noir au-dessus et en dessous.

                       Un facteur de 1,5 ne laisse voir que les deux tiers du
                       milieu, donc uniquement l'image. C'est la même idée que
                       le recadrage en 2,4/1 du carrousel, écrite dans
                       `AGENTS.md` : ces bandes sont dans les fichiers et ne
                       s'enlèvent qu'en rognant. */
                    <span
                      key={portrait.fichier}
                      className={cn(
                        "block size-7 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15",
                        // Le chevauchement se fait par une marge négative et
                        // non par un décalage : une marge retire de la place,
                        // donc la file se resserre vraiment au lieu de se
                        // superposer en laissant un trou à la fin.
                        i > 0 && "-ml-2.5",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/temoignages/${portrait.fichier}.jpg`}
                        alt=""
                        width={1280}
                        height={720}
                        // L'image du haut de page ne prend pas `lazy` : c'est
                        // celle que Google chronomètre. Celles-ci sont dans le
                        // hero, donc visibles d'emblée.
                        fetchPriority="high"
                        className="size-full scale-150 object-cover"
                        style={{ objectPosition: portrait.cadrage }}
                      />
                    </span>
                  ))}
                </span>

                <span className="text-xs font-medium text-white sm:text-sm">
                  {pastilleHero.texte}
                </span>
              </div>
            </div>

            <h1 className="titre text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              Vivez de votre{" "}
              {/* `as="span"` et `inline-flex` : le composant pose un
                  conteneur flex, qui serait de niveau bloc et casserait la
                  ligne s'il gardait son affichage par défaut. */}
              <KineticText
                as="span"
                text="expertise"
                // Deux corrections au composant, passées par ses propres
                // variables plutôt qu'en retouchant le fichier de registre.
                //
                // `--hover-padding` valait `1em/12`, soit près de cinq pixels
                // par lettre à ce corps : le mot s'étirait visiblement au
                // survol. Divisé par quarante, l'épaississement se voit encore
                // mais le mot ne bouge plus.
                //
                // `tracking-tight` rattrape le crénage : le composant place
                // chaque lettre dans un élément flex, ce qui supprime les
                // paires crénées de la fonte et fait respirer les lettres plus
                // que dans le reste du titre.
                style={
                  { "--hover-padding": "calc(1em / 40)" } as React.CSSProperties
                }
                // `font-[700]` n'est pas décoratif : `KineticText` pose `font-[300]`
                // sur son conteneur, et `cn()` ne le voit pas comme un conflit
                // puisque `titre-fort` n'est pas une classe de graisse. Sans
                // lui, le mot accentué rendait en 300 au milieu d'un titre en
                // 700, donc visiblement plus maigre que ce qui l'entoure.
                className="titre-fort inline-flex font-[600] tracking-tight"
              />{" "}
              en ligne.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-white/85 sm:text-xl">
              {identite.resume}
            </p>

            {/* L'appel à l'action, sous le sous-titre et au-dessus de la
                vidéo. Il est donc sur l'image, où le voile assombri garantit
                déjà le contraste, et non sur la couleur de page.

                **Deux boutons et non un**, sur demande de Rémy, et c'est la
                paire du projet : un plein, un creux, même hauteur et même rayon.
                Ils mènent à deux moments différents, la formation gratuite puis
                l'appel, exactement comme l'encart posé au milieu des articles
                d'avis. Un lien souligné à côté d'un bouton de 56 px se lirait
                comme une note de bas de page, et prendre rendez-vous n'en est
                pas une.

                **Le plein mène désormais à la formation gratuite** et non plus
                à la page d'accueil de Funnels Club, sur décision de Rémy.

                `flex-col` puis `sm:flex-row` : deux boutons de 56 px côte à côte
                sur 375 px coupent leurs libellés en trois lignes. */}
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <BoutonScintillant href={liens.formation}>
                <TexteRoulant>Découvrir Funnels Club</TexteRoulant>
              </BoutonScintillant>

              {/* Le creux.

                  **Le blanc est en dur, et c'est le même cas que les capsules
                  de l'en-tête** : ce bouton ne se pose pas sur une couleur de
                  thème mais sur une photographie, sombre dans les deux thèmes,
                  et déjà voilée. Un jeton de texte y serait noir en thème clair.

                  Sa bordure est en `currentColor`, donc elle ne peut pas
                  diverger de son texte, et elle tient d'office ses 3:1 puisque
                  le blanc sur le voile en tient bien plus. */}
              <a
                href={liens.appel}
                target="_blank"
                rel="noreferrer"
                className="group/roule inline-flex h-14 items-center justify-center gap-2 rounded-md border border-current px-8 text-base font-semibold whitespace-nowrap text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <TexteRoulant>Réserver un appel</TexteRoulant>
              </a>
            </div>
          </div>

          {/* Le rapport 16/9 est porté par `LecteurVideo` : c'est lui qui fait
              remplir le cadre exactement, sans bande noire. */}
          <div
            id="video"
            className="mx-auto mt-8 max-w-3xl scroll-mt-[66px] sm:mt-10"
          >
            <LecteurVideo
              id={video.id}
              titre={video.titre}
              secondes={video.secondes}
              affiche="/affiche-video.jpg"
              afficheMobile="/affiche-video-mobile.jpg"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Les deux programmes, côte à côte.

          Une carte par offre, et rien de plus : le design de cette section
          n'est pas arrêté, et une carte sobre se remplace sans rien casser.

          `h-full` sur la carte et `mt-auto` sur l'action : c'est ce couple qui
          aligne les boutons entre eux. Sans lui, chaque bouton suit son propre
          texte, et deux descriptions de longueur différente produisent deux
          boutons décalés de dix pixels, ce que l'œil voit immédiatement.
      --------------------------------------------------------------- */}
      {/* `pb-12` : la section des offres se termine plus près de ses cartes,
          sur décision de Rémy. Le rembourrage par défaut de `Section` vaut
          `py-20 sm:py-28` ; seul le bas est réduit, le haut garde le sien. */}
      <Section className="[&>div]:pb-12 sm:[&>div]:pb-16">
        {/* Le titre de la section, centré et coupé à la main.

            Chaque ligne est un `block` : la césure est donc garantie, à toutes
            les largeurs, au lieu de dépendre de ce que le moteur veut bien
            produire. Voir le commentaire de `titreOffres` pour la raison.

            Pas de `text-balance` : il n'a plus rien à équilibrer puisque les
            lignes sont posées. `text-pretty` reste utile sur l'écran étroit,
            où la seconde ligne se recoupe d'elle-même : il empêche qu'un mot
            s'y retrouve seul. */}
        {/* Le titre et son sous-titre.

            Le titre roule mot à mot à l'entrée dans la vue, comme les autres
            titres de section. Il n'est plus coupé à la main : le texte est assez
            court pour que le moteur le coupe correctement, voir `titreOffres`.

            `text-balance` est justifié ici : le titre est centré, et c'est le
            seul cas où équilibrer les lignes a un sens. */}
        <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          <TitreRoulant
            segments={[{ texte: titreOffres }]}
            className="titre text-4xl text-balance text-foreground sm:text-5xl"
          />

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {sousTitreOffres}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {offres.map((offre) => (
            <article
              key={offre.id}
              className="relief-verre flex h-full flex-col rounded-md border border-border bg-card p-8"
            >
              {"surtitre" in offre && offre.surtitre && (
                <SurtitreOffre
                  texte={offre.surtitre.texte}
                  portrait={offre.surtitre.portrait}
                />
              )}

              {/* La marque est **dans** le titre, et dimensionnée en `em`.

                  C'est ce qui la rend proportionnelle : `em` se résout sur la
                  taille du texte qui la porte, donc la tuile suit le titre à
                  chaque point de rupture au lieu d'être figée à une valeur qui
                  ne vaut qu'à une seule largeur d'écran.

                  Elle est `aria-hidden`, donc le nom accessible du titre reste
                  « Funnels Club » et non « image, Funnels Club ».

                  **Les deux offres en portent une**, sur décision de Rémy : la
                  même tuile, avec un C pour le consulting. Le consulting n'en
                  avait pas, au motif que ce n'est pas un produit distinct mais
                  Rémy en direct, et qu'une tuile inventée fabriquerait une
                  identité qui n'existe pas. Ce n'est plus une tuile inventée :
                  c'est la marque de la maison déclinée, tracé pour tracé, et
                  les deux cartes se lisent comme une paire au lieu d'une carte
                  signée et d'une carte nue. */}
              {/* `h3` et non `h2` : le titre de la section occupe désormais
                  le `h2`, et deux niveaux ne peuvent pas cohabiter sur le même
                  rang sans casser le plan que les robots lisent. */}
              <h3 className="titre text-3xl text-balance text-card-foreground">
                <LogoFunnels
                  lettre={offre.id === "funnels-club" ? "F" : "C"}
                  // L'alignement passe par `vertical-align` et non par une
                  // translation. Une translation déplace le dessin sans
                  // rien dire à la ligne, donc le réglage se refait à
                  // chaque changement de corps. `vertical-align` s'exprime
                  // en `em` par rapport à la ligne de base : la tuile est
                  // centrée sur la hauteur de capitale et y reste à
                  // n'importe quelle taille.
                  className="mr-[0.28em] inline-grid size-[0.95em] align-[-0.13em]"
                />
                {offre.nom}
              </h3>

              {/* La courbe, entre le titre et la description, sur demande de
                  Rémy. Elle n'est posée que sur l'offre qui l'a déclarée : voir
                  le commentaire de `courbe` dans `site.ts` pour pourquoi le
                  consulting n'en a pas. */}
              {"courbe" in offre && offre.courbe ? (
                <CourbeMontante className="mt-5" />
              ) : null}

              {/* L'échange du consulting, à la même place que la courbe de
                  l'autre carte : chaque offre montre ce qu'elle est plutôt que
                  de le décrire. Il ne s'affiche que si Rémy a écrit les deux
                  messages, voir `conversation` dans `site.ts`. */}
              {"conversation" in offre && offre.conversation ? (
                <ConversationConsulting
                  question={offre.conversation.question}
                  reponse={offre.conversation.reponse}
                  fin={offre.conversation.fin}
                  portrait={offre.surtitre.portrait}
                  className="mt-5"
                />
              ) : null}

              <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
                {offre.texte}
              </p>

              {/* **Le bouton du consulting est doré et non bleu**, sur
                  décision de Rémy : c'est ce qui distingue les deux offres au
                  premier coup d'œil, et c'est déjà la teinte de sa carte dans
                  le pied de page. Les deux endroits partagent le même jeton,
                  `--or`, donc ils ne peuvent pas diverger.

                  L'encre se passe **avec** le fond et n'est pas laissée au
                  défaut : le blanc ne tient que 2,38:1 sur ce doré, contre
                  7,32:1 pour `--or-encre`. Voir `BoutonScintillant`.

                  Le test porte sur l'identifiant de l'offre, comme celui de la
                  lettre de la tuile juste au-dessus : une offre de plus se
                  déciderait ici, et pas dans deux endroits différents. */}
              <div className="mt-auto pt-8">
                <BoutonScintillant
                  href={offre.href}
                  fond={
                    offre.id === "funnels-club"
                      ? "var(--primary)"
                      : "var(--or)"
                  }
                  encre={
                    offre.id === "funnels-club"
                      ? "var(--primary-foreground)"
                      : "var(--or-encre)"
                  }
                >
                  <TexteRoulant>{offre.action}</TexteRoulant>
                  <ArrowRight className="size-4" />
                </BoutonScintillant>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          Le cadrage, le blocage, la solution.

          Trois slides du deck publicitaire, reprises dans leur ordre, sur
          demande de Rémy. Elle vient **après** les offres et pas avant : le
          deck s'adresse à quelqu'un qui ne sait pas encore ce qu'on vend, la
          page à quelqu'un qui vient de le lire. Ici, la section ne présente
          plus l'offre, elle dit pourquoi elle existe.
      --------------------------------------------------------------- */}
      <SectionTunnel />

      {/* ---------------------------------------------------------------
          Le message de Rémy.

          Il suit le graphique et non l'inverse : la démonstration d'abord, la
          voix ensuite. Quelqu'un qui vient de voir les deux courbes sait de quoi
          on parle, et la lettre lui explique pourquoi.

          C'est le seul bloc de la page à la mesure d'un texte et non d'une
          carte, sur décision de Rémy. Voir `MessageRemy`.
      --------------------------------------------------------------- */}
      <MessageRemy />

      {/* ---------------------------------------------------------------
          Ce qui attend votre texte.
      --------------------------------------------------------------- */}
      {/* La bande des résultats.

          Elle ne porte plus que son titre et le lien vers la page. Les
          emplacements qui s'y trouvaient sont redescendus sous la bande : ils
          n'ont rien à voir avec les résultats, et un cadre pointillé posé sur
          une texture se lit comme un défaut d'affichage, pas comme une
          réserve. */}
      {/* ---------------------------------------------------------------
          Les résultats, puis le livre, sur le fond du deck.

          Les deux sections partagent un seul fond, et c'est ce qui fait la
          transition plutôt qu'une frontière : le fond s'éteint derrière la
          carte du livre, donc il n'y a aucun endroit où l'on puisse dire qu'il
          s'arrête.

          L'ordre compte aussi : quelqu'un qui vient de regarder des gens
          raconter ce qu'ils ont obtenu n'est pas au même endroit qu'en haut de
          page, et le livre est la marche la moins chère du site.
      --------------------------------------------------------------- */}
      <FondResultats>
        {/* `pt-36` : le titre a besoin de plus que le rembourrage ordinaire,
            parce que la lèvre lui mange ses quatre-vingts premiers pixels. Avec
            le `py-20` par défaut, il ne lui restait presque rien entre le bord
            de la lèvre et la première lettre. */}
        <Section className="[&>div]:pt-36 [&>div]:pb-10 sm:[&>div]:pt-44 sm:[&>div]:pb-12">
          {/* Le titre. Ses mots montent de dessous quand la section entre dans
              la vue : c'est l'effet des titres du deck, repris ici. Le second
              membre porte l'accent, comme dans la référence.

              `text-balance` est justifié ici : le titre est centré, et c'est le
              seul cas où équilibrer les lignes a un sens. */}
          <TitreRoulant
            segments={titreResultats}
            className="titre mx-auto max-w-3xl text-center text-4xl text-balance text-foreground sm:text-5xl"
          />

          {/* La courbe passe derrière la vidéo, et son voile flouté l'en
              dégage. C'est la slide 1 du deck, où la même courbe passait
              derrière la phrase d'accroche. */}
          <CourbeVivante className="mt-14 sm:mt-16">
            <CarrouselTemoignages />
          </CourbeVivante>

          {/* Pas de bouton vers la page « Résultats » ici.

              Il y en avait un ; Rémy l'a retiré. La page reste atteignable par
              le menu « Ressources », qui la porte déjà : un second chemin au
              même endroit n'ajoutait rien et allongeait la section d'un cran.
              Si elle doit se retrouver ici, c'est un lien et pas un bouton, et
              son texte dira où il mène. */}
        </Section>

        {/* `pt-4` : la carte du livre remonte, sur décision de Rémy. Les deux
            sections se suivent dans le même fond, donc leurs rembourrages
            s'additionnaient : le bas de la section des résultats plus le haut
            de celle du livre faisaient près de deux cents pixels de vide entre
            la vidéo et la couverture. Le bas des résultats est réduit en même
            temps, sinon on ne fait que déplacer l'écart. */}
        <Section className="[&>div]:pt-4 sm:[&>div]:pt-6">
          <SectionLivre />
        </Section>
      </FondResultats>

      {/* Rien entre le livre et le pied de page.

          Il y avait là deux emplacements en attente, « qui vous êtes » et la
          phrase de clôture. Rémy les a retirés : la page se termine sur le
          livre. Les textes attendus restent décrits dans `sections` de
          `site.ts`, donc le jour où ils existent, la section se remonte sans
          avoir à retrouver ce qu'elle devait dire. */}
    </>
  );
}
