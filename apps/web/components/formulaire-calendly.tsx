import { CadreCalendly } from "@/components/cadre-calendly";
import { RelaisCalendly } from "@/components/relais-calendly";
import { adresseCalendly } from "@/lib/adresse-calendly";
import { cn } from "@repo/ui/lib/utils";
import { LoaderCircle } from "lucide-react";

/** Une seule iframe par page : l'identifiant peut être fixe. Recopié dans
 *  `RelaisCalendly`, qui ne peut pas importer ce fichier qui l'importe. */
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
  telephone = null,
  reponsesVsl = true,
  clair = false,
  className,
}: {
  url: string;
  /** Voir `hauteurMin` dans `contenu/appel.ts`. */
  hauteurMin: number;
  /** Le titre de l'iframe, pour les lecteurs d'écran. */
  titre: string;
  /** La question de l'événement qui reçoit le téléphone de l'opt-in, `a1`
   *  par exemple. Sans elle, le numéro n'est pas transmis. */
  telephone?: string | null;
  /** Reverser les réponses du questionnaire de `/video-vsl`. Vrai par
   *  défaut, pour l'événement du VSL ; faux pour tout autre. */
  reponsesVsl?: boolean;
  /** Posé sur un fond clair, et non sur la photographie d'`/appel` : le
   *  cercle de chargement passe en gris à toutes les largeurs, et la carte
   *  qu'on rend à Calendly sur téléphone est carrée, bordée d'un filet et
   *  à l'ombre douce du tunnel Formation Genesis. */
  clair?: boolean;
  className?: string;
}) {
  /* L'adresse sans ce que seul le navigateur connaît : elle sert si le script
     ne tourne pas, par exemple après une navigation côté client, où React
     pose ce HTML sans en exécuter les scripts. **`RelaisCalendly` la
     remplace alors par la bonne**, balises et préremplissage compris : sans
     lui, un clic sur un lien Next vers la page (le bouton d'un module de
     la Formation Genesis, par exemple) ouvrait Calendly vide et sans
     `utm_*`. Relevé le 18 novembre 2026. */
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
    `<script>document.getElementById(${JSON.stringify(ID)}).src=(${adresseCalendly.toString()})(${JSON.stringify(url)},${JSON.stringify({ telephone, reponsesVsl })});</script>`;

  return (
    <CadreCalendly hauteurMin={hauteurMin} className={className}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-20 @max-3xl:bg-white",
          !clair && "@max-3xl:rounded-[var(--rayon-jonction)]",
        )}
      />
      <LoaderCircle
        aria-hidden
        className={cn(
          "absolute top-28 left-1/2 -z-10 size-6 -translate-x-1/2 animate-spin @max-3xl:text-black/30",
          clair ? "text-black/30" : "text-white/70",
        )}
      />
      <RelaisCalendly
        url={url}
        options={{ telephone, reponsesVsl }}
      />
      <div
        className={cn(
          "size-full @max-3xl:overflow-hidden",
          clair
            ? "@max-3xl:shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] @max-3xl:ring-1 @max-3xl:ring-black/10"
            : "@max-3xl:rounded-[var(--rayon-jonction)] @max-3xl:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] @max-3xl:ring-1 @max-3xl:ring-border",
        )}
        /* Le script change l'adresse de l'iframe avant l'hydratation : le
           HTML que React retrouve n'est donc plus celui qu'il a envoyé, et
           c'est voulu. */
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CadreCalendly>
  );
}
