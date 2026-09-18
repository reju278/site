import { LogoFunnels } from "@/components/logo-funnels";

/**
 * Le bas de la page d'immersion : la marque, et rien d'autre.
 *
 * **Il ne reste plus de pied de page**, sur décision de Rémy, et c'est
 * l'aboutissement d'une suite de retraits plutôt qu'un changement isolé. Il
 * avait d'abord fait enlever tous les liens sortants de la page, puis les trois
 * liens légaux, puis l'avertissement sur les témoignages et le copyright. Ce
 * qui restait était une grande carte portant l'appel, la liste des
 * vingt-deux entretiens et le fond du deck : beaucoup de dessin pour une page
 * dont on ne sort plus. Elle laisse la place à la marque, centrée.
 *
 * **Ce qui est parti avec elle**, pour que personne n'ait à le chercher : le
 * fond du deck et son grain, la carte de verre et son ombre, le libellé de
 * l'appel repris du hub, et la liste des entretiens. Cette liste-là était une
 * vraie navigation, la seule façon d'atteindre un témoignage sans faire défiler
 * la page ; les fenêtres s'ouvrent maintenant depuis les cartes et depuis les
 * flèches de la fenêtre elle-même, donc rien ne devient inatteignable.
 *
 * **La marque n'est plus un lien.** Elle menait à `#haut`, ce qui n'était pas
 * une sortie mais un raccourci ; seule au centre d'un bas de page, elle se lit
 * comme une signature, et une signature ne se clique pas. `LogoFunnels` porte
 * déjà son `aria-hidden`, le nom écrit à côté suffit.
 *
 * **Elle est petite, atténuée et collée au bas de la page**, sur sa demande :
 * « plus petit, vraiment tout en bas, discret, légèrement opaque ». Le
 * rembourrage bas tombe donc à quelques pixels, là où un pied de page en
 * réserve d'ordinaire plusieurs dizaines.
 *
 * **Le contraste est en dessous du seuil du texte courant, et c'est dit.**
 * `--muted-foreground` à 75 % d'opacité donne #8c847f sur la page claire, soit
 * **3,55:1**, là où ce dépôt demande 4,5:1 pour du texte courant. Mesuré, pas
 * supposé. Ce n'est pas un oubli : Rémy a demandé la discrétion, le nom qu'on
 * y lit est écrit en toutes lettres dans l'en-tête de la même page, et rien ne
 * s'y clique ni ne s'y comprend. Si la marque doit redevenir lisible, c'est
 * l'opacité qu'on retire, pas la taille.
 *
 * Le composant ne prend plus rien : il ne connaît plus les entretiens.
 */
export function PiedImmersion() {
  return (
    /* **L'essentiel du rembourrage haut est passé dans le gabarit**, juste
       avant la barre des tâches, pour que celle-ci s'arrête au ras de la marque
       et non au-dessus de l'équipe. Voir `layout.tsx`. Ce qui reste ici est
       l'écart entre la barre posée et la marque : sans lui, les deux se
       touchent. */
    <footer className="px-5 pt-3 pb-4 sm:pt-4 sm:pb-5">
      {/* Petite, atténuée et posée tout en bas, sur demande de Rémy : une
          signature, pas un titre. */}
      <p className="titre flex items-center justify-center gap-2 text-sm tracking-tight text-muted-foreground opacity-75 sm:text-base">
        <LogoFunnels className="size-[1.05em]" />
        Funnels.Club
      </p>
    </footer>
  );
}
