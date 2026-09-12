import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";

/**
 * Le bandeau au-dessus du nom d'une offre : le portrait de Rémy, puis ses mots.
 *
 * L'`Avatar` vient du registre shadcn, et il est employé ici pour ce qu'il sait
 * faire de plus que la balise `img` : afficher des initiales tant que l'image
 * ne répond pas, sans vignette cassée ni saut de page.
 *
 * Le rond est la seule exception au rayon de 5 px que la règle du projet
 * autorise, et c'est exactement son cas : une photo de profil.
 *
 * `alt` vide et assumé : le nom de Rémy est déjà dans le texte juste à côté, et
 * le répéter le ferait annoncer deux fois.
 */
export function SurtitreOffre({
  texte,
  portrait,
}: {
  texte: string;
  portrait?: string;
}) {
  return (
    /* La pastille, sur décision de Rémy.

       Le portrait et les mots étaient posés à même la carte, et flottaient : un
       petit rond suivi de trois mots, sans rien pour les tenir ensemble, se
       lisent comme deux objets voisins plutôt que comme une signature.

       Le fond gris et le rayon les réunissent. `w-fit` est ce qui en fait une
       pastille et non un bandeau : sans lui, le conteneur prendrait toute la
       largeur de la carte et le gris s'étendrait jusqu'au bord.

       Le rembourrage est plus serré à gauche qu'à droite, `pl-1` contre `pr-3` :
       le portrait est rond, donc son bord s'éloigne déjà du bord de la pastille
       par sa propre courbure, alors que le texte, lui, s'arrête net. Un
       rembourrage égal aurait fait paraître l'image décollée. */
    <div className="mb-4 flex w-fit items-center gap-2 rounded-md bg-muted py-1 pr-3 pl-1">
      <Avatar className="size-6">
        {portrait && <AvatarImage src={portrait} alt="" />}
        <AvatarFallback className="text-[0.625rem] font-semibold">
          RJ
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-semibold text-foreground">{texte}</span>
    </div>
  );
}
