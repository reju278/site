import { Apparition } from "@/components/apparition";
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
          <Apparition className="flex items-center gap-4">
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
          </Apparition>

          {/* La lettre.

              `space-y-*` plutôt qu'une marge sur chaque paragraphe : l'espace
              entre deux blocs de texte appartient à la suite, pas à l'un des
              deux, et un `mt` sur le premier enfant décollerait tout le bloc de
              son titre. */}
          {/* Le corps de la lettre est en `foreground` et non en
              `muted-foreground`, sur décision de Rémy, et c'est le bon réglage :
              `muted` est fait pour du texte de service, une légende, un
              sous-titre, quelque chose qu'on lit en second. Ici le texte **est**
              le contenu, et quinze paragraphes en gris demandent un effort qui
              n'a aucune raison d'être.

              **À 85 % et non à plein**, second réglage de Rémy. Un blanc pur sur
              un fond presque noir éblouit : les lettres bavent sur le fond, et
              une page entière devient fatigante avant d'être illisible. Ce
              quinzième de fond mêlé à l'encre calme le trait sans rien coûter au
              contraste, qui reste à plus de dix pour un dans les deux thèmes,
              très au-dessus du seuil. */}
          <div className="mt-10 space-y-6 text-base leading-relaxed text-pretty text-foreground/85 sm:mt-12 sm:text-lg">
            <Apparition>
              <p>{messageRemy.amorceVoies}</p>
            </Apparition>

            {/* Les trois voies, numérotées.

                `list-decimal` et non des numéros écrits dans le texte : c'est
                une vraie liste ordonnée, donc un lecteur d'écran l'annonce comme
                telle et en donne le nombre. `marker:` colore le numéro sans
                toucher au texte. */}
            {/* La liste entière est un seul bloc d'apparition, et non un par
                entrée : découper un `ol` en trois conteneurs animés casserait
                la liste, qu'un lecteur d'écran n'annoncerait plus comme telle
                ni avec son nombre d'éléments. */}
            <Apparition>
              <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-foreground">
                {messageRemy.voies.map((voie) => (
                  <li key={voie.titre}>
                    {/* Surlignées en jaune, comme les erreurs le sont en
                        rouge, sur décision de Rémy. Les deux couleurs disent
                        deux choses opposées, ce qu'on peut faire et ce qu'il ne
                        faut pas faire, et c'est le seul endroit du site où elles
                        se répondent. */}
                    <mark
                      className="surlignage"
                      style={
                        {
                          "--surlignage-fond":
                            "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)",
                        } as React.CSSProperties
                      }
                    >
                      {voie.titre}
                    </mark>{" "}
                    {voie.texte}
                  </li>
                ))}
              </ol>
            </Apparition>

            <Apparition>
              <p>{messageRemy.amorceErreurs}</p>
            </Apparition>

            {/* Les trois erreurs.

                Chacune est un paragraphe à part entière et non un élément de
                liste : elles font deux ou trois phrases, et une puce devant un
                paragraphe de trois lignes donne un document administratif. Le
                rang est dans la phrase, ce qui suffit à les tenir ensemble.

                **L'amorce est surlignée en rouge**, sur décision de Rémy. Elle
                a d'abord été écrite en rouge ; le surlignage marque plus fort
                sans toucher à la lisibilité du texte, qui reste en
                `foreground`.

                `mark` et non un `span` : c'est l'élément du surlignage, et
                c'est le seul qui dise à un lecteur d'écran que ce passage est
                mis en avant. Sa couleur par défaut est réécrite, le navigateur
                posant un jaune et une encre noire qui ne suivent aucun thème.

                `box-decoration-clone` n'est pas un détail : sur une amorce qui
                passe à la ligne, sans lui le fond ne prend son rembourrage qu'au
                tout début et à la toute fin, et la deuxième ligne se retrouve
                collée au bord de sa surbrillance.

                Le fond est tiré de `--erreur-texte` par `color-mix`, à 28 % :
                assez pour qu'on lise « rouge » et pas « brun », assez peu pour
                que le texte garde son contraste, qui reste celui de
                `foreground` sur la page. La valeur est montée depuis 18 %, où la
                teinte se perdait sur le fond sombre. */}
            {messageRemy.erreurs.map((erreur) => (
              <Apparition key={erreur.titre}>
                <p>
                  <mark
                    className="surlignage"
                    style={
                      {
                        "--surlignage-fond":
                          "color-mix(in srgb, var(--erreur-texte) 28%, transparent)",
                      } as React.CSSProperties
                    }
                  >
                    {erreur.titre}
                  </mark>{" "}
                  {erreur.texte}
                </p>
              </Apparition>
            ))}

            <Apparition>
              <p>{messageRemy.logique}</p>
            </Apparition>

            {/* Le paragraphe d'expérience, et ses deux marques.

                Les guillemets du « tunnel de vente » sont ceux du deck et du
                titre de la section, repris ici pour que l'expression soit la
                même partout.

                Le surlignage des quatre métiers est vert, sur décision de Rémy,
                et il reprend `--courbe`, le vert du graphique. C'est voulu :
                là-haut il dit « ça monte », ici il dit « ce qui marche », et
                introduire un quatrième vert pour la même idée n'aurait servi
                qu'à en avoir deux qui divergent. */}
            <Apparition>
              <p>
                {messageRemy.experience.avant}
                <span className="font-semibold">
                  {messageRemy.experience.tunnel}
                </span>
                {messageRemy.experience.milieu}
                {messageRemy.experience.metiers.map((metier) => (
                  <span key={metier.mot}>
                    {metier.avant}
                    <mark
                      className="surlignage"
                      style={
                        {
                          "--surlignage-fond":
                            "color-mix(in srgb, var(--courbe) 28%, transparent)",
                        } as React.CSSProperties
                      }
                    >
                      {metier.mot}
                    </mark>
                  </span>
                ))}
                {messageRemy.experience.apres}
              </p>
            </Apparition>

            {/* Les valeurs, avec leurs trois mots soulignés.

                Le soulignement est épais et décollé du texte : un trait d'un
                pixel collé aux lettres se confond avec un lien, et il y en a
                deux dans ce même bloc. */}
            <Apparition>
              <p>
                {messageRemy.valeurs.avant}
                <span className="underline decoration-2 underline-offset-4">
                  {messageRemy.valeurs.souligne}
                </span>
                {messageRemy.valeurs.milieu}
                <span className="underline decoration-2 underline-offset-4">
                  {messageRemy.valeurs.souligneBis}
                </span>
                {messageRemy.valeurs.liaison}
                <span className="underline decoration-2 underline-offset-4">
                  {messageRemy.valeurs.souligneTer}
                </span>
                {messageRemy.valeurs.apres}
              </p>
            </Apparition>

            <Apparition>
              <p>
                {messageRemy.deploiement.avant}
                <span className="underline decoration-2 underline-offset-4">
                  {messageRemy.deploiement.souligne}
                </span>
                {messageRemy.deploiement.milieu}
                {messageRemy.deploiement.thematiques.map((thematique, i) => (
                  <span key={thematique}>
                    {i > 0 ? ", " : null}
                    <mark
                      className="surlignage"
                      style={
                        {
                          "--surlignage-fond":
                            "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)",
                        } as React.CSSProperties
                      }
                    >
                      {thematique}
                    </mark>
                  </span>
                ))}
                {messageRemy.deploiement.apres}
              </p>
            </Apparition>

            {messageRemy.suite.map((paragraphe) => (
              <Apparition key={paragraphe}>
                <p>{paragraphe}</p>
              </Apparition>
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
            <Apparition>
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
            </Apparition>
          </div>

          {/* La signature, en bas à droite et de biais.

              **Elle quitte l'axe du texte**, sur décision de Rémy : posée sous
              le dernier paragraphe et ferrée à gauche comme lui, elle se lisait
              comme une ligne de plus. À droite et penchée, elle se lit comme un
              geste posé sur la page après coup, ce qu'une signature est.

              L'inclinaison est faible, trois degrés : au-delà, l'œil la lit
              comme une image mal posée plutôt que comme une main qui va vite.

              Elle pivote depuis son coin bas droit et non depuis son centre,
              pour que son extrémité droite reste à la même place quelle que
              soit la longueur du nom. `pr-2` lui garde de la marge : une
              anglaise finit en délié, et un délié qui touche le bord du bloc a
              l'air coupé.

              Elle est plus grande que le texte et non plus petite : une
              signature est un geste, pas une mention. */}
          <Apparition className="mt-10 sm:mt-12">
            {/* La salutation reste dans l'axe du texte, sur décision de Rémy :
                c'est la dernière ligne de la lettre, elle appartient au corps.
                Seule la signature en sort. */}
            <p className="text-base text-foreground sm:text-lg">
              {messageRemy.salutation}
            </p>
            <div className="flex justify-end">
              <p className="signature mt-2 origin-bottom-right -rotate-3 pr-2 text-5xl text-foreground sm:text-6xl">
                {messageRemy.signature}
              </p>
            </div>
          </Apparition>
        </div>
      </div>
    </section>
  );
}
