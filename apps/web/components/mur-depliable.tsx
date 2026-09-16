"use client";

import { TexteRoulant } from "@/components/texte-roulant";
import { ChevronDown } from "lucide-react";
import { Children, useState } from "react";

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
 * **Le repli coupe la liste des enfants, il ne la cache pas en CSS.** La
 * première version posait `display: none` sur `:nth-child(n + var(--mur-premieres))`.
 * Elle ne marchait pas, et elle ne le disait pas : `nth-child` n'accepte pas de
 * `var()`, le sélecteur est donc invalide et le navigateur le jette en silence.
 * Le mur s'affichait entier avec un bouton qui ne servait à rien, et rien dans
 * la console ne l'aurait signalé. C'est exactement la panne muette que
 * `AGENTS.md` décrit pour le rayon de flou écrit en variable.
 *
 * Couper les enfants évite au passage le vrai piège de cette mise en page : les
 * cartes coulent en `columns` et doivent rester enfants directs du conteneur.
 * Sorties dans un second bloc, les dernières auraient formé un deuxième mur
 * sous le premier, avec sa propre répartition et une couture au milieu.
 *
 * Une carte repliée n'est donc pas rendue du tout : ni atteignable au clavier,
 * ni lue par un lecteur d'écran.
 *
 * **Le bouton disparaît une fois ouvert**, et il n'y a pas de « voir moins ».
 * Replier un mur qu'on vient d'ouvrir ne sert personne, et un bouton qui change
 * de libellé au même endroit fait douter de ce qu'on vient de faire.
 */
export function MurDepliable({
  children,
  premieres,
}: {
  children: React.ReactNode;
  /** Le nombre de cartes visibles avant le clic. */
  premieres: number;
}) {
  const [deplie, setDeplie] = useState(false);

  /* Les cartes sont rendues par le serveur : les découper ici ne les rend pas
     une seconde fois, ça choisit lesquelles poser dans l'arbre. */
  const cartes = Children.toArray(children);
  const visibles = deplie ? cartes : cartes.slice(0, premieres);

  return (
    <>
      <div className="mx-auto mt-12 max-w-4xl columns-1 gap-4 sm:columns-2">
        {visibles}
      </div>

      {deplie || cartes.length <= premieres ? null : (
        <div className="mt-8 flex justify-center">
          {/* Un `button` et non un lien : ça n'emmène nulle part, ça agit sur
              la page. C'est la règle du projet, et c'est aussi ce qui fait que
              le clavier l'active à la barre d'espace. */}
          <button
            type="button"
            onClick={() => setDeplie(true)}
            className="group/roule inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-current px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <TexteRoulant>Voir plus de témoignages</TexteRoulant>
            <ChevronDown aria-hidden className="size-4 shrink-0" />
          </button>
        </div>
      )}
    </>
  );
}
