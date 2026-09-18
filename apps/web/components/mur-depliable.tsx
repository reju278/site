"use client";

import { TexteRoulant } from "@/components/texte-roulant";
import { ChevronDown } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Le mur, replié sur ses premières cartes, avec son bouton « voir plus ».
 *
 * C'est ce que fait TrendTrack sur son « Wall of love », sur demande de Rémy :
 * on montre quelques témoignages, et le reste s'ouvre au clic.
 *
 * **Les cartes sont rendues côté serveur et passées en `children`.** Ce
 * composant ne connaît pas leur contenu : il ne tient que l'état ouvert ou
 * fermé. C'est ce qui garde les douze posts entiers, une vingtaine de milliers
 * de caractères, hors du paquet JavaScript. Écrit autrement, le mur aurait fait
 * voyager tout son texte deux fois, une fois dans le HTML et une fois dans le
 * script.
 *
 * **Le mur n'est pas coupé, il est fondu**, et c'est ce qui manquait à la
 * première version. Chez eux, les cartes du bas restent à l'écran et
 * s'effacent : on voit des demi-cartes qui se perdent dans le noir, et c'est ça
 * qui donne envie d'ouvrir. Retirer les dernières cartes, comme je le faisais,
 * donnait un mur qui s'arrête net et un bouton posé dans le vide.
 *
 * La hauteur est donc bornée, le débordement masqué, et un `mask-image` éteint
 * le bas de la colonne. Les deux écritures du masque s'écrivent : Safari n'a
 * levé son préfixe qu'en 15.4.
 *
 * **Ce qui est sous la coupe sort du parcours au clavier**, et c'est une
 * correction. Le commentaire d'origine disait que rogner ne piégeait personne,
 * les cartes ne contenant plus rien de cliquable. C'était vrai le jour où il a
 * été écrit et faux le lendemain : les réponses des membres y ont ajouté un
 * dépliant par carte. Mesuré plutôt que supposé, dix-huit `summary` se
 * trouvaient sous la coupe, tous atteignables à la tabulation, et le navigateur
 * faisait défiler le bloc rogné pour aller les chercher. C'est le piège de
 * tabulation classique.
 *
 * Toute carte dont le bas dépasse la ligne reçoit donc `inert`, ce qui la
 * retire du clavier et des lecteurs d'écran sans rien changer à ce qu'on voit.
 * Son texte reste lisible à l'écran ; c'est son dépliant, tout en bas et hors
 * champ, qui cesse d'être atteignable.
 *
 * **La mesure se refait au redimensionnement.** La ligne de coupe dépend de la
 * largeur, puisque les colonnes se réorganisent : une carte sous la coupe en
 * large peut être au-dessus sur un téléphone.
 *
 * **Il ne connaît pas la répartition en colonnes.** Le mur lui passe deux
 * colonnes déjà constituées ; lui ne fait que les poser côte à côte, borner la
 * hauteur et fondre le bas. C'est ce qui lui permet de servir n'importe quelle
 * mise en page qu'on voudrait replier.
 *
 * **Le mur se dévoile par paliers**, sur demande de Rémy : chaque clic découvre
 * quelques posts de plus, et le bouton revient tant qu'il en reste. Tout ouvrir
 * d'un coup donnait une page de dix mille pixels qu'on ne parcourt pas, on la
 * subit. Le fondu et le bouton restent donc en place entre deux clics, et
 * disparaissent ensemble quand le dernier post est visible.
 *
 * **Le palier est une fraction de ce qui reste, et non une hauteur en
 * pixels**, sur demande de Rémy : « appuyez au maximum deux fois ». Un pas en
 * pixels ne peut pas tenir cette promesse, parce que la hauteur du mur dépend
 * de la largeur : la colonne la plus haute fait dix-sept mille pixels sur un
 * écran large et le double sur un téléphone, où les deux colonnes s'empilent.
 * Mille huit cents pixels par clic demandaient donc dix appuis d'un côté et
 * vingt de l'autre. On découvre la moitié de ce qui reste, et `clics` dit
 * combien d'appuis mènent au bout, à toutes les largeurs.
 *
 * **La fin se mesure, elle ne se compte pas.** On compare la hauteur du contenu
 * à celle de la fenêtre de lecture : quand le contenu tient, c'est fini. Compter
 * les cartes obligerait à savoir combien il en reste, donc à connaître leur
 * répartition entre les deux colonnes, qui dépend de la largeur.
 *
 * **Le bouton flotte au-dessus du fondu**, comme le leur : posé après le mur,
 * il aurait laissé une bande vide entre les cartes effacées et lui. Il porte un
 * fond plein, et ce n'est pas décoratif : un bouton translucide posé sur des
 * demi-cartes en devient illisible.
 *
 * **Son rayon reste celui du projet, 5 px.** Le leur est une gélule. Rémy a
 * demandé deux fois de reprendre les boutons du site sans en dessiner d'autres,
 * et c'est cette consigne-là qui l'emporte : ce qui est repris d'eux ici, c'est
 * le fondu et la position, pas la forme du bouton.
 *
 * **Il disparaît une fois ouvert**, et il n'y a pas de « voir moins ». Replier
 * un mur qu'on vient d'ouvrir ne sert personne, et un bouton qui change de
 * libellé au même endroit fait douter de ce qu'on vient de faire.
 */
/**
 * La bande sur laquelle le bas du mur s'éteint.
 *
 * Elle est écrite une fois parce qu'elle part dans deux propriétés, la
 * préfixée et l'autre, et que deux valeurs qui doivent être identiques finissent
 * par diverger.
 */
const FONDU = "linear-gradient(to bottom, #000 calc(100% - 240px), transparent 100%)";

export function MurDepliable({
  children,
  hauteur,
  clics = 2,
}: {
  children: React.ReactNode;
  /** La hauteur du mur avant le premier clic, en pixels. */
  hauteur: number;
  /** Le nombre d'appuis qui mènent au mur entier. */
  clics?: number;
}) {
  const [palier, setPalier] = useState(0);
  const [contenu, setContenu] = useState(0);
  const cadre = useRef<HTMLDivElement>(null);
  const flux = useRef<HTMLDivElement>(null);

  /* Chaque palier découvre la même fraction de ce qui restait à voir au
     premier chargement : au dernier, la limite vaut exactement la hauteur du
     contenu. Tant qu'on n'a pas mesuré, on s'en tient à la hauteur repliée,
     qui est ce que le serveur a rendu. */
  const limite =
    contenu > 0
      ? hauteur + (palier * (contenu - hauteur)) / clics
      : hauteur;
  /* Le pixel de tolérance n'est pas une précaution de style : les hauteurs
     relevées sont fractionnaires, et `hauteur + clics * (contenu - hauteur) /
     clics` ne retombe pas toujours au bit près sur `contenu`. Sans lui, le
     dernier appui laisse le bouton en place devant un mur pourtant entier. */
  const complet = contenu > 0 && limite >= contenu - 1;

  useEffect(() => {
    const el = cadre.current;
    const dedans = flux.current;
    if (!el || !dedans) return;

    const mesurer = () => {
      /* **La fin se mesure sur la mise en page, pas sur le défilement.**
         `scrollHeight` dépassait `clientHeight` de dix pixels exactement, et le
         bouton ne disparaissait jamais : c'est la translation qu'`Apparition`
         applique aux cartes qui ne sont pas encore entrées dans la vue.
         Celle-ci ne change pas la hauteur du bloc mais compte dans le
         défilement, et la dernière carte du mur, par définition jamais vue,
         la portait toujours.

         **C'est le bloc intérieur qu'on mesure, et c'est pour ça qu'il
         existe.** On prenait la plus haute des colonnes, ce qui est juste tant
         qu'elles sont côte à côte et faux dès qu'elles s'empilent : sur
         téléphone, le mur fait la somme des deux, quarante et un mille pixels,
         et on en annonçait vingt mille. Le dernier palier découvrait alors le
         double de ce qu'il promettait. La boîte du bloc intérieur, elle, dit la
         hauteur du flux dans les deux sens, et comme c'est sa boîte de bordure,
         elle ignore les translations de ses enfants. */
      const mesure = dedans.getBoundingClientRect().height;
      setContenu(mesure);
      const fini = limite >= mesure - 1;

      for (const carte of el.querySelectorAll<HTMLElement>("[data-carte]")) {
        const rognee =
          !fini && carte.getBoundingClientRect().bottom > el.getBoundingClientRect().bottom;
        carte.toggleAttribute("inert", rognee);
      }
    };

    mesurer();

    /* La ligne de coupe bouge avec la largeur : les colonnes se réorganisent,
       et une carte sous la coupe en large peut être au-dessus sur un
       téléphone. */
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    observateur.observe(dedans);
    return () => observateur.disconnect();
  }, [limite]);


  return (
    <div className="relative">
      <div
        ref={cadre}
        className={cn("mx-auto max-w-4xl", !complet && "overflow-hidden")}
        style={
          complet
            ? undefined
            : {
                maxHeight: `${limite}px`,
                /* Le fondu du bas, **en pixels et non en pourcentage**, et
                   c'est une correction. Écrit `62%`, il s'étirait avec la
                   fenêtre de lecture : à sept cent soixante pixels il effaçait
                   les trois cents derniers, et au premier palier il en effaçait
                   trois mille, c'est-à-dire une dizaine de posts rendus
                   illisibles par le geste censé les découvrir. Plus on ouvrait,
                   plus on masquait.

                   Une bande fixe fait ce qu'on attend d'elle à toutes les
                   hauteurs : elle laisse la coupe se perdre sur la fin d'une
                   carte, et tout ce qui est au-dessus se lit en entier. Sa
                   valeur vaut à peu près une demi-carte.

                   Les deux écritures s'écrivent, Safari n'ayant levé son
                   préfixe qu'en 15.4. */
                WebkitMaskImage: FONDU,
                maskImage: FONDU,
              }
        }
      >
        {/* Le flux lui-même. Il est distinct du cadre parce que le cadre porte
            une hauteur bornée : un bloc rogné ne peut pas dire la hauteur qu'il
            aurait sans l'être. */}
        <div
          ref={flux}
          className="flex flex-col gap-4 sm:flex-row sm:items-start"
        >
          {children}
        </div>
      </div>

      {complet ? null : (
        /* Le bouton flotte sur le fondu, comme le leur. `inset-x-0` et non une
           translation : un centrage par `left: 50%` puis `translateX(-50%)`
           élargit la boîte de l'élément, et la règle du dépôt veut qu'un bloc
           qui porte une transformation soit coupé. Ici, rien à couper. */
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          {/* Un `button` et non un lien : ça n'emmène nulle part, ça agit sur
              la page. C'est aussi ce qui fait que la barre d'espace l'active. */}
          <button
            type="button"
            onClick={() => setPalier((p) => p + 1)}
            className="group/roule inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <TexteRoulant>Voir plus de posts de la communauté</TexteRoulant>
            <ChevronDown aria-hidden className="size-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
