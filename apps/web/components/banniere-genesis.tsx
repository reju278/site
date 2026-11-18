import { LogoFunnels } from "@/components/logo-funnels";

/**
 * Le haut des pages du tunnel Formation Genesis, relevé sur l'optin
 * ClickFunnels de référence, `funnels.club/course-2027-fb-2`, sur demande de
 * Rémy : une barre blanche de 42 px portant la marque, une bannière de
 * paysage de 200 px sur toute la largeur, et la tuile du logo posée à cheval
 * sur son bord bas, alignée sur la colonne de texte.
 *
 * **Le paysage est celui du site**, `fond-hero`, et c'est le même tableau que
 * celui de la référence : elle en montre le bas, le chemin et le village, et
 * c'est ce que donne `object-bottom`. Pas de copie de leur fichier. Le haut de
 * l'image est transparent, mais il n'entre jamais dans le cadre : la bannière
 * ne montre que le bas.
 *
 * L'image est décorative, `alt=""` : la page n'en dit rien, elle sert de
 * bandeau. Elle est en haut de page, donc `fetchPriority="high"` et pas de
 * chargement différé.
 *
 * Le nom dans la barre est celui de Rémy, « Funnels.club : Formation
 * gratuite », comme sur la référence. **Dans l'espace membre, il suit la
 * page**, sur sa demande : « Funnels.club : Leçon 1 », d'où `libelle`.
 */
export function BanniereGenesis({
  libelle = "Formation gratuite",
}: {
  libelle?: string;
}) {
  return (
    <div>
      <div className="bg-[var(--genesis-fond)]">
        <p className="mx-auto flex h-[42px] max-w-[960px] items-center gap-1.5 px-5 font-[family-name:var(--font-genesis-bouton)] text-[13px] text-[var(--genesis-encre)] sm:px-8">
          <LogoFunnels className="size-[18px]" />
          Funnels.club&nbsp;: {libelle}
        </p>
      </div>
      <div className="relative h-[120px] overflow-hidden bg-[var(--fond-hero)] sm:h-[200px]">
        <picture>
          <source media="(min-width: 768px)" srcSet="/fond-hero.jpg" />
          <img
            src="/fond-hero-mobile.jpg"
            alt=""
            width={960}
            height={548}
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-bottom"
          />
        </picture>
      </div>
      {/* La tuile, à cheval sur le bas de la bannière : 40 px dedans, le
          reste dessous, comme sur la référence. */}
      <div className="mx-auto max-w-[960px] px-5 sm:px-8">
        <LogoFunnels className="-mt-7 size-14 sm:-mt-10 sm:size-[72px]" />
      </div>
    </div>
  );
}
