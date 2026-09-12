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
    <div className="mb-4 flex items-center gap-2.5">
      <Avatar className="size-7">
        {portrait && <AvatarImage src={portrait} alt="" />}
        <AvatarFallback className="text-[0.625rem] font-semibold">
          RJ
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold text-foreground">{texte}</span>
    </div>
  );
}
