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
export function MurDepliable({
  children,
  hauteur,
  pas,
}: {
  children: React.ReactNode;
  /** La hauteur du mur avant le premier clic, en pixels. */
  hauteur: number;
  /** Ce que chaque clic découvre en plus, en pixels. */
  pas: number;
}) {
  const [palier, setPalier] = useState(0);
  const [complet, setComplet] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);

  const limite = hauteur + palier * pas;

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;

    const mesurer = () => {
      /* **La fin se mesure sur la mise en page, pas sur le défilement.**
         `scrollHeight` dépassait `clientHeight` de dix pixels exactement, et le
         bouton ne disparaissait jamais : c'est la translation qu'`Apparition`
         applique aux cartes qui ne sont pas encore entrées dans la vue.
         Celle-ci ne change pas la hauteur du bloc mais compte dans le
         défilement, et la dernière carte du mur, par définition jamais vue,
         la portait toujours.

         La hauteur de la plus haute colonne, elle, est celle de la mise en
         page : elle ignore les transformations et ne bouge pas avec
         l'animation. */
      const contenu = Math.max(
        ...[...el.children].map((c) => c.getBoundingClientRect().height),
      );
      const fini = limite >= contenu;
      setComplet(fini);

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
    return () => observateur.disconnect();
  }, [limite]);


  return (
    <div className="relative">
      <div
        ref={cadre}
        className={cn(
          "mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-start",
          !complet && "overflow-hidden",
        )}
        style={
          complet
            ? undefined
            : {
                maxHeight: `${limite}px`,
                /* Le fondu du bas. Il commence aux deux tiers : plus haut, on
                   perdrait des cartes entières ; plus bas, la coupe
                   redeviendrait une ligne. Les deux écritures s'écrivent,
                   Safari n'ayant levé son préfixe qu'en 15.4. */
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 62%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, #000 62%, transparent 100%)",
              }
        }
      >
        {children}
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
