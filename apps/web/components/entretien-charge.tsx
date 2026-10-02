"use client";

import { ContenuEntretien } from "@/components/contenu-entretien";
import type { AppelGalerie } from "@/components/bouton-appel";
import type { Entretien } from "@/lib/entretien";
import { useEffect, useState } from "react";

/**
 * Le contenu d'un entretien, chargé au moment où on le demande.
 *
 * **Il existe pour vider la charge utile de la page.** Les vingt-deux articles
 * étaient rendus par le serveur et passés à la fenêtre : ils partaient donc dans
 * le HTML de tout le monde, qu'on en ouvre un ou aucun. Mesuré, 766 Ko sur une
 * page de 1 Mo. Ils sont maintenant servis un par un par
 * `/immersion/entretien/<id>`, figé au build.
 *
 * **Le cache est un module et non un état**, volontairement : il survit à la
 * fermeture de la fenêtre, donc rouvrir un entretien déjà lu est instantané, et
 * il est partagé entre les trois cartes du hero et les vingt-deux de la galerie,
 * qui ne se connaissent pas. Les promesses en vol y sont rangées aussi : deux
 * demandes du même entretien n'en font qu'une.
 *
 * **Le préchargement au survol est ce qui rend le clic instantané.** Une fenêtre
 * qui attend le réseau au moment du clic est exactement le « ça lague » qu'on
 * vient de corriger ailleurs. Au survol d'une carte, ou au premier contact du
 * doigt, la demande part ; le temps d'amener le pointeur jusqu'au clic, la
 * réponse est là. Le squelette ne se voit donc que sur un réseau très lent, ou
 * au clavier.
 *
 * **Une demande qui échoue ne casse rien** : on garde le squelette et on
 * réessaiera au prochain clic. Il n'y a pas de message d'erreur à écrire, parce
 * qu'il n'y a rien que le visiteur puisse faire, et parce que ce dépôt
 * n'autorise pas l'agent à écrire du texte affiché.
 */

const cache = new Map<string, Entretien>();
const enVol = new Map<string, Promise<Entretien | null>>();

async function demander(id: string): Promise<Entretien | null> {
  const dejaLa = cache.get(id);
  if (dejaLa) return dejaLa;

  const enCours = enVol.get(id);
  if (enCours) return enCours;

  const promesse = fetch(`/immersion/entretien/${id}`)
    .then((r) => (r.ok ? (r.json() as Promise<Entretien>) : null))
    .then((article) => {
      if (article) cache.set(id, article);
      return article;
    })
    .catch(() => null)
    .finally(() => enVol.delete(id));

  enVol.set(id, promesse);
  return promesse;
}

/** À appeler au survol d'une carte : la réponse arrive avant le clic. */
export function prechargerEntretien(id: string) {
  void demander(id);
}

export function EntretienCharge({
  id,
  appel,
}: {
  id: string;
  /** Voir `appel` dans `GalerieFenetre`. */
  appel?: AppelGalerie;
}) {
  const [article, setArticle] = useState<Entretien | null>(
    () => cache.get(id) ?? null,
  );

  useEffect(() => {
    let vivant = true;
    /* Le cache d'abord, sans passer par un état intermédiaire : rouvrir un
       entretien déjà lu ne doit pas faire clignoter un squelette. */
    const dejaLa = cache.get(id);
    if (dejaLa) {
      setArticle(dejaLa);
      return;
    }

    setArticle(null);
    void demander(id).then((recu) => {
      if (vivant) setArticle(recu);
    });

    return () => {
      vivant = false;
    };
  }, [id]);

  if (!article) return <SqueletteEntretien />;
  return <ContenuEntretien article={article} appel={appel} />;
}

/**
 * Ce qu'on voit le temps que l'entretien arrive.
 *
 * **Il a la forme de ce qu'il remplace** : l'en-tête coloré, un titre, un chapô,
 * un cadre de vidéo, puis le bloc blanc qui remonte par-dessus. Un rectangle
 * gris de la bonne taille évite que la fenêtre saute quand le texte arrive.
 *
 * **`aria-busy` et non un texte d'attente** : c'est ce qui dit à un lecteur
 * d'écran que la zone se remplit, sans inventer une phrase.
 */
function SqueletteEntretien() {
  return (
    <div aria-busy className="relative">
      <div className="relative isolate px-5 pt-10 pb-28 sm:px-8 sm:pt-12 sm:pb-32">
        <div
          aria-hidden
          className="fond-resultats grain-resultats pointer-events-none absolute inset-0 -z-10"
        />

        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-4/5 animate-pulse rounded-md bg-foreground/10 sm:h-9" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-foreground/8" />
            <div className="h-4 w-11/12 animate-pulse rounded-md bg-foreground/8" />
            <div className="h-4 w-9/12 animate-pulse rounded-md bg-foreground/8" />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <div className="aspect-16/9 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>
      </div>

      <div className="relative -mt-20 rounded-t-[var(--rayon-jonction)] border-t border-border bg-background px-5 pt-10 pb-10 sm:-mt-24 sm:px-8 sm:pt-12">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-foreground/10" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded-md bg-foreground/8"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
