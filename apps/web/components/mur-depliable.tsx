"use client";

import { TexteRoulant } from "@/components/texte-roulant";
import { ChevronDown } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useState } from "react";

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
 * **Le fondu ne cache rien d'atteignable.** Les cartes du mur ne contiennent
 * aucun lien ni bouton depuis que Rémy a retiré le renvoi vers Circle : rogner
 * le bas ne piège donc pas le clavier. Le jour où une carte redevient
 * cliquable, ce repli devra redevenir un retrait.
 *
 * **Il ne connaît pas la répartition en colonnes.** Le mur lui passe deux
 * colonnes déjà constituées ; lui ne fait que les poser côte à côte, borner la
 * hauteur et fondre le bas. C'est ce qui lui permet de servir n'importe quelle
 * mise en page qu'on voudrait replier.
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
}: {
  children: React.ReactNode;
  /** La hauteur du mur replié, en classes Tailwind arbitraires. */
  hauteur: string;
}) {
  const [deplie, setDeplie] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-start",
          !deplie && `overflow-hidden ${hauteur}`,
        )}
        style={
          deplie
            ? undefined
            : {
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

      {deplie ? null : (
        /* Le bouton flotte sur le fondu, comme le leur. `inset-x-0` et non une
           translation : un centrage par `left: 50%` puis `translateX(-50%)`
           élargit la boîte de l'élément, et la règle du dépôt veut qu'un bloc
           qui porte une transformation soit coupé. Ici, rien à couper. */
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          {/* Un `button` et non un lien : ça n'emmène nulle part, ça agit sur
              la page. C'est aussi ce qui fait que la barre d'espace l'active. */}
          <button
            type="button"
            onClick={() => setDeplie(true)}
            className="group/roule inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <TexteRoulant>Voir plus de témoignages</TexteRoulant>
            <ChevronDown aria-hidden className="size-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
