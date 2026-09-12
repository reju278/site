import { cn } from "@repo/ui/lib/utils";

/**
 * La marque de Funnels Club.
 *
 * **Rien n'est dessiné ici, tout est repris de `labo/logo-funnels.html`**, le
 * banc d'essai du dépôt : le tracé de la lettre, le dégradé de la tuile, celui
 * de la lettre, son ombre portée et le rayon de 22 %.
 *
 * Ce qui n'est **pas** repris, et à dessein : l'inclinaison au survol, l'anneau
 * lumineux qui suit la souris et la tache de lumière. Le commit « Retirer le
 * logo du hero » les a écartés parce qu'ils ne convainquent pas à petite
 * taille, et c'est précisément la taille dont il s'agit ici.
 *
 * La tuile reste sombre dans les deux thèmes, comme dans le banc d'essai :
 * c'est une marque, pas une surface du site, et une marque ne change pas de
 * couleur avec le fond.
 *
 * `aria-hidden` : le nom « Funnels Club » est écrit juste à côté, le faire
 * annoncer par la marque le répéterait.
 */
export function LogoFunnels({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative grid shrink-0 place-items-center", className)}
      style={{
        // `--rayon: 22%` et le dégradé de la tuile, repris du banc d'essai.
        //
        // L'ombre portée du banc n'est **pas** reprise, sur décision de Rémy.
        // Elle y sert à décoller un logo de 260 px posé seul au milieu d'une
        // page ; à 29 px dans une ligne de titre, elle ne décolle rien et
        // salit le bord.
        borderRadius: "22%",
        background: "linear-gradient(180deg, #17171a 0%, #08080a 100%)",
      }}
    >
      {/* 100 % de la tuile, comme dans le banc d'essai. Ce n'est pas la
          lettre qui fait 100 % : le tracé va de 231 à 779 dans un repère de
          1000, donc il porte sa propre marge et occupe 55 % de la tuile. La
          rapetisser en plus l'aurait noyée. */}
      <svg viewBox="0 0 1000 1000" className="size-full">
        <defs>
          <linearGradient
            id="logo-funnels-lumiere"
            x1="0.15"
            y1="0"
            x2="0.85"
            y2="1"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f2f2f4" />
            <stop offset="100%" stopColor="#c9c9d2" />
          </linearGradient>
        </defs>
        <path
          d="M231 240 H779 V404 H424 V458 H731 V629 H424 V760 H231 Z"
          fill="url(#logo-funnels-lumiere)"
        />
      </svg>
    </span>
  );
}
