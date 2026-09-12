import { liens, messageRemy } from "@/contenu/site";
import { TitreRoulant } from "@/components/titre-roulant";

/**
 * Le message de Rémy, sous le graphique des tunnels.
 *
 * La forme est celle de sa présentation sur `digital-selfmade.com`, sur sa
 * demande : un portrait, un titre, une lettre, une signature. Ce n'est pas une
 * section de site, c'est une lettre, et tout ce qui suit découle de là.
 *
 * **La mesure est celle d'un texte, pas celle d'un bloc**, sur décision de
 * Rémy : `max-w-2xl`, la largeur des sous-titres du site, et non les `6xl` des
 * cartes. Ce n'est pas un réglage de goût. Une ligne de texte courant se lit
 * confortablement entre soixante et quatre-vingts caractères ; à la largeur
 * d'une carte, elle en porterait le double, et l'œil perd le début de la ligne
 * suivante à chaque retour.
 *
 * **Il n'y a pas de carte autour.** Le texte est posé sur la page, comme dans sa
 * référence : l'enfermer dans un cadre en ferait un encart, c'est-à-dire quelque
 * chose qu'on saute. Une lettre se lit parce qu'elle a l'air d'avoir été
 * écrite, pas encadrée.
 *
 * **Les deux listes ne sont pas décorées de la même façon, et c'est voulu.** Les
 * trois voies sont numérotées, parce que Rémy les numérote et qu'elles sont
 * trois options équivalentes entre lesquelles on choisit. Les trois erreurs ne
 * le sont pas : elles portent déjà leur rang dans leur propre phrase, « la
 * première », « la deuxième », « la troisième », et un numéro en plus le dirait
 * deux fois.
 *
 * **La signature est une vraie fonte manuscrite**, demandée par Rémy. Elle ne
 * sert qu'ici ; voir l'utilitaire `signature` dans `globals.css`.
 */
export function MessageRemy() {
  return (
    <section className="pb-20 sm:pb-28">
      {/* La mesure du texte est plus étroite que celle de la page, mais le
          conteneur extérieur garde `max-w-6xl` et `px-5` : c'est lui qui aligne
          le bloc sur le reste du site, et le `max-w-2xl` intérieur qui donne sa
          longueur de ligne. Les deux ne font pas le même travail. */}
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl">
          {/* Le portrait et le titre, sur la même ligne.

              **Le portrait est à gauche du titre et non au-dessus**, sur
              décision de Rémy. Au-dessus et centré, il ouvrait la section comme
              une affiche ; à gauche, il tient la place d'un en-tête de lettre,
              et c'est ce que le bloc est. Le reste du texte est ferré à gauche :
              un titre centré au-dessus d'un corps ferré à gauche donne deux axes
              de lecture pour un seul bloc.

              Le portrait est plus grand que partout ailleurs sur le site,
              64 px contre 24 dans les pastilles : ici il ne signe pas une ligne,
              il ouvre un texte.

              `alt` vide et assumé : le nom de Rémy est dans le titre juste à
              côté, et le répéter le ferait annoncer deux fois. */}
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={messageRemy.portrait}
              alt=""
              width={160}
              height={160}
              loading="lazy"
              className="size-16 shrink-0 rounded-full object-cover ring-1 ring-border sm:size-20"
            />

            <TitreRoulant
              segments={[{ texte: messageRemy.titre }]}
              className="titre text-3xl text-balance text-foreground sm:text-4xl"
            />
          </div>

          {/* La lettre.

              `space-y-*` plutôt qu'une marge sur chaque paragraphe : l'espace
              entre deux blocs de texte appartient à la suite, pas à l'un des
              deux, et un `mt` sur le premier enfant décollerait tout le bloc de
              son titre. */}
          <div className="mt-10 space-y-6 text-base leading-relaxed text-pretty text-muted-foreground sm:mt-12 sm:text-lg">
            <p className="text-foreground">{messageRemy.intro}</p>

            <p>{messageRemy.amorceVoies}</p>

            {/* Les trois voies, numérotées.

                `list-decimal` et non des numéros écrits dans le texte : c'est
                une vraie liste ordonnée, donc un lecteur d'écran l'annonce comme
                telle et en donne le nombre. `marker:` colore le numéro sans
                toucher au texte. */}
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-foreground">
              {messageRemy.voies.map((voie) => (
                <li key={voie.titre}>
                  <span className="font-semibold text-foreground">
                    {voie.titre} :
                  </span>{" "}
                  {voie.texte}
                </li>
              ))}
            </ol>

            <p>{messageRemy.amorceErreurs}</p>

            {/* Les trois erreurs.

                Chacune est un paragraphe à part entière et non un élément de
                liste : elles font deux ou trois phrases, et une puce devant un
                paragraphe de trois lignes donne un document administratif. Le
                rang est dans la phrase, ce qui suffit à les tenir ensemble. */}
            {messageRemy.erreurs.map((erreur) => (
              <p key={erreur.titre}>
                <span className="font-semibold text-foreground">
                  {erreur.titre}
                </span>{" "}
                {erreur.texte}
              </p>
            ))}

            {messageRemy.suite.map((paragraphe) => (
              <p key={paragraphe}>{paragraphe}</p>
            ))}

            {/* La conclusion et ses deux liens.

                **Le premier ne quitte pas la page.** La vidéo de formation dont
                Rémy parle est celle du haut de l'accueil : le lien y remonte
                par son ancre plutôt que d'ouvrir un site. `scroll-mt` est déjà
                posé là-bas pour que l'en-tête flottant ne la recouvre pas.

                **Le soulignement n'apparaît qu'au survol**, sur demande de
                Rémy. Le lien reste reconnaissable au repos parce qu'il change de
                couleur et de graisse, ce qui est le minimum : un lien qui ne se
                distingue que par un survol n'existe pas pour qui lit au doigt.

                Le second sort du site et porte donc sa balise de provenance,
                qui est déjà dans `liens.appel`, et son `rel="noreferrer"`. */}
            <p>
              {messageRemy.conclusion.avant}
              <a
                href="#video"
                className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {messageRemy.conclusion.lienVideo}
              </a>
              {messageRemy.conclusion.milieu}
              <a
                href={liens.appel}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {messageRemy.conclusion.lienAppel}
              </a>
              {messageRemy.conclusion.apres}
            </p>
          </div>

          {/* La signature.

              Elle est plus grande que le texte et non plus petite : une
              signature est un geste, pas une mention. Le `pt` la décolle du
              dernier paragraphe plus que les paragraphes ne le sont entre eux,
              parce qu'elle n'appartient plus au corps de la lettre. */}
          <div className="mt-10 sm:mt-12">
            <p className="text-base text-muted-foreground sm:text-lg">
              {messageRemy.salutation}
            </p>
            <p className="signature mt-1 text-4xl text-foreground sm:text-5xl">
              {messageRemy.signature}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
