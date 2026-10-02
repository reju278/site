import { CadreCalendly } from "@/components/cadre-calendly";
import { LoaderCircle } from "lucide-react";

/**
 * L'adresse du formulaire, avec les balises de campagne de la page.
 *
 * **Elle se construit avant React, dans un script posé juste après l'iframe**,
 * et c'est tout le gain de vitesse : l'iframe part pendant la lecture du HTML,
 * sans attendre que la page s'hydrate ni que le `widget.js` de Calendly se
 * télécharge. Mesuré en local, elle partait à 205 ms ; sur un téléphone,
 * l'hydratation coûte une à deux secondes de plus.
 *
 * **La fonction est donc recopiée telle quelle dans ce script**, par
 * `toString()` : elle ne doit rien importer ni rien lire hors de son argument
 * et de `location`.
 *
 * Les balises `utm_*` de la page sont transmises pour que la réservation soit
 * attribuée à la bonne source, comme le faisait `widget.js`. `embed_domain` et
 * `embed_type` sont ceux qu'il posait aussi.
 */
function adresseCalendly(base: string): string {
  const adresse = new URL(base);
  adresse.searchParams.set("embed_domain", location.host);
  adresse.searchParams.set("embed_type", "Inline");
  adresse.searchParams.set("hide_gdpr_banner", "1");

  new URLSearchParams(location.search).forEach((valeur, cle) => {
    if (cle.indexOf("utm_") === 0) adresse.searchParams.set(cle, valeur);
  });

  return adresse.toString();
}

/** Une seule iframe par page : l'identifiant peut être fixe. */
const ID = "formulaire-calendly";

/**
 * Le formulaire de réservation de Calendly.
 *
 * **Une iframe écrite à la main, et non le `widget.js` de Calendly** : le
 * widget ne monte l'iframe qu'une fois lui-même téléchargé et exécuté, après
 * l'hydratation. Il n'apportait rien d'autre ici que l'adresse, que
 * `adresseCalendly` construit.
 *
 * **Le formulaire reste blanc dans les deux thèmes**, sur décision de Rémy :
 * il a été repeint aux couleurs du thème sombre, puis ramené au blanc de
 * Calendly.
 *
 * **L'iframe se déclare `color-scheme: light`, dans les deux thèmes.** Une
 * iframe dont le schéma diffère de celui de la page reçoit un fond opaque :
 * en thème sombre, le navigateur peignait un grand rectangle blanc autour de
 * la carte de Calendly. Déclarée claire comme son contenu, elle redevient
 * transparente et seule la carte se voit.
 *
 * **Le cercle de chargement est derrière l'iframe**, à hauteur de la carte de
 * Calendly : il se voit à travers l'iframe tant qu'elle est vide, et la carte
 * le recouvre en arrivant. Aucun état à suivre, aucun événement à écouter. En
 * grand, il est blanc parce qu'il tombe sur la photographie du hero, sombre
 * dans les deux thèmes.
 *
 * **Sous 768 px, la carte est blanche dès le chargement**, sur demande de
 * Rémy : un fond posé derrière l'iframe, au rayon de l'habillage, au lieu de
 * la photographie vue à travers un cadre vide. Le cercle y passe en gris. Les
 * deux sont en dur et non en jetons : ils imitent le blanc de Calendly, qui ne
 * suit pas le thème. En grand, le fond reste transparent, parce que Calendly
 * y entoure sa carte d'un vide : un fond blanc dessinerait un rectangle plus
 * large qu'elle.
 *
 * La hauteur suit celle que Calendly annonce : voir `CadreCalendly`.
 *
 * **En dessous de 768 px de large, le formulaire est habillé par nous**, sur
 * demande de Rémy. Calendly y change de mise en page : il quitte sa carte
 * bordée et remplit toute l'iframe, d'un blanc à angles droits et sans
 * ombre, posé à plat sur la photographie. On lui rend donc une carte : le
 * rayon de la lèvre juste derrière lui, `--rayon-jonction`, l'ombre de la
 * vidéo de `/preparation` et un liseré. Au-dessus, Calendly dessine sa propre
 * carte entourée de vide transparent, et un habillage tomberait sur ce vide.
 *
 * **La bascule se lit sur la largeur de l'iframe et non sur celle de
 * l'écran**, par une requête de conteneur : c'est elle que Calendly mesure.
 * Relevé : pleine largeur à 760 px, carte à 780 px ; `@3xl` vaut 48 rem,
 * soit 768 px, entre les deux.
 */
export function FormulaireCalendly({
  url,
  titre,
  hauteurMin,
  className,
}: {
  url: string;
  /** Voir `hauteurMin` dans `contenu/appel.ts`. */
  hauteurMin: number;
  /** Le titre de l'iframe, pour les lecteurs d'écran. */
  titre: string;
  className?: string;
}) {
  /* L'adresse sans ce que seul le navigateur connaît : elle sert si le script
     ne tourne pas, par exemple après une navigation côté client, où React
     pose ce HTML sans en exécuter les scripts. Le formulaire marche alors,
     sans les balises de campagne. */
  const parDefaut = new URL(url);
  parDefaut.searchParams.set("embed_type", "Inline");
  parDefaut.searchParams.set("hide_gdpr_banner", "1");

  /* **L'iframe et son script sont écrits en HTML brut**, et non en JSX.
     React 19 signale toute balise `<script>` qu'il rencontre en hydratant,
     même rendue côté serveur ; le contenu d'un `dangerouslySetInnerHTML`, il
     ne le lit pas. Le navigateur, lui, exécute le script pendant la lecture
     du HTML, juste après l'iframe. Le titre et l'adresse sont échappés pour
     leurs attributs. */
  const html =
    `<iframe id="${ID}" title="${titre.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" src="${parDefaut.toString().replace(/&/g, "&amp;")}" class="block size-full [color-scheme:light]"></iframe>` +
    `<script>document.getElementById(${JSON.stringify(ID)}).src=(${adresseCalendly.toString()})(${JSON.stringify(url)});</script>`;

  return (
    <CadreCalendly hauteurMin={hauteurMin} className={className}>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 @max-3xl:rounded-[var(--rayon-jonction)] @max-3xl:bg-white"
      />
      <LoaderCircle
        aria-hidden
        className="absolute top-28 left-1/2 -z-10 size-6 -translate-x-1/2 animate-spin text-white/70 @max-3xl:text-black/30"
      />
      <div
        className="size-full @max-3xl:overflow-hidden @max-3xl:rounded-[var(--rayon-jonction)] @max-3xl:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] @max-3xl:ring-1 @max-3xl:ring-border"
        /* Le script change l'adresse de l'iframe avant l'hydratation : le
           HTML que React retrouve n'est donc plus celui qu'il a envoyé, et
           c'est voulu. */
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CadreCalendly>
  );
}
