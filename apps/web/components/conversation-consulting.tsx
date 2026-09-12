"use client";

import { Bubble, BubbleContent } from "@repo/ui/components/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@repo/ui/components/message";
import { HAUTEUR_ANIMATION } from "@/components/courbe-montante";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * L'échange joué dans la carte du consulting privé.
 *
 * C'est ce que la carte vend, montré plutôt que décrit : quelqu'un pose une
 * question, Rémy répond. Les deux messages n'apparaissent pas d'un coup, ils
 * **s'écrivent**, avec les trois points d'attente avant chacun. C'est ce
 * déroulé qui dit « accès direct », là où une capture figée ne dirait qu'« il y
 * a une messagerie ».
 *
 * `Message` et `Bubble` viennent du registre shadcn, installés et non écrits :
 * ils portent la rangée, l'avatar, l'alignement et la bulle. Ce qui est à nous,
 * c'est la mise en scène, donc le minutage.
 *
 * **Le client est à gauche, Rémy à droite**, sur décision de Rémy. C'est
 * l'inverse de la convention d'une messagerie, où l'on se voit soi-même à
 * droite : ici le lecteur n'est ni l'un ni l'autre, il regarde un échange, et
 * c'est Rémy qu'il vient voir répondre. Le mettre à droite le pose comme celui
 * qui a le dernier mot.
 *
 * **Les deux bulles sont grises**, la variante `muted` du registre. Une bulle
 * bleue et une grise auraient dit « moi » et « l'autre », ce qui n'a pas de sens
 * quand le lecteur n'est aucun des deux. Grises toutes les deux, elles se lisent
 * comme une conversation observée.
 *
 * **Le client n'a pas de visage.** Son côté n'affiche aucun avatar, quand celui
 * de Rémy porte le sien. Ce n'est pas un oubli de symétrie : lui donner un
 * portrait obligerait à en inventer un, et une photo inventée sur un échange
 * présenté comme réel est exactement ce qu'il ne faut pas faire. Son absence
 * dit d'ailleurs la bonne chose, que ce client pourrait être n'importe qui.
 *
 * **Rien ne se joue tant que la carte n'est pas à l'écran**, et l'échange ne se
 * rejoue pas : une conversation qui recommence en boucle sous les yeux de
 * quelqu'un qui lit la carte est une distraction, pas une démonstration.
 */

/* Le minutage, en millisecondes.
 *
 * **L'écriture est longue, et c'est le réglage qui compte.** Elle durait une
 * seconde ; on voyait alors trois points clignoter une fois et le message
 * apparaître, ce qui ressemblait à un chargement plutôt qu'à quelqu'un qui
 * tape. À trois secondes, l'attente devient le sujet : on regarde les points,
 * on attend la réponse, et c'est exactement ce que la carte vend.
 *
 * Les durées restent proportionnées à la longueur des messages, mais bornées :
 * un message long ne doit pas faire attendre dix secondes, ni un court passer
 * si vite qu'on rate l'effet. */
const AVANT_QUESTION = 700;
const AVANT_REPONSE = 1100;
const ECRITURE_MIN = 2400;
const ECRITURE_MAX = 4200;

const duree = (texte: string) =>
  Math.min(ECRITURE_MAX, Math.max(ECRITURE_MIN, texte.length * 90));

type Etape =
  "rien" | "question-ecrit" | "question" | "reponse-ecrit" | "reponse" | "fini";

export function ConversationConsulting({
  question,
  reponse,
  fin,
  portrait,
  className,
}: {
  question: string | null;
  reponse: string | null;
  /** Le dernier mot du client, un pouce. Facultatif. */
  fin?: string | null;
  /** Le portrait de Rémy, celui de la carte. */
  portrait: string;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const [etape, setEtape] = useState<Etape>("rien");

  /* Rien à jouer tant que Rémy n'a pas écrit les deux lignes. La carte
     s'affiche alors comme avant, sans trou ni emplacement : un cadre pointillé
     à l'intérieur d'une carte d'offre se lirait comme un défaut, pas comme une
     réserve. Voir le commentaire de `conversation` dans `site.ts`. */
  const prete = Boolean(question && reponse);

  useEffect(() => {
    if (!prete) return;
    const el = cadre.current;
    if (!el) return;

    const jouer = () => {
      /* Sous mouvement réduit, l'échange est posé d'emblée. On ne perd que la
         mise en scène : les deux messages disent la même chose. */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setEtape("fini");
        return [] as ReturnType<typeof setTimeout>[];
      }

      const minuteurs: ReturnType<typeof setTimeout>[] = [];
      const a = (ms: number, faire: () => void) =>
        minuteurs.push(setTimeout(faire, ms));

      let t = AVANT_QUESTION;
      a(t, () => setEtape("question-ecrit"));

      t += duree(question!);
      a(t, () => setEtape("question"));

      t += AVANT_REPONSE;
      a(t, () => setEtape("reponse-ecrit"));

      t += duree(reponse!);
      a(t, () => setEtape("reponse"));

      /* Le pouce arrive après un temps court : c'est un accusé de réception, pas
         un message qu'on rédige. Lui donner les trois points d'attente aurait
         été plus long à écrire qu'à envoyer. */
      if (fin) {
        t += 900;
        a(t, () => setEtape("fini"));
      }

      return minuteurs;
    };

    let minuteurs: ReturnType<typeof setTimeout>[] = [];

    if (typeof IntersectionObserver === "undefined") {
      minuteurs = jouer();
      return () => minuteurs.forEach(clearTimeout);
    }

    const guetteur = new IntersectionObserver(
      (entrees) => {
        if (!entrees[0]?.isIntersecting) return;
        minuteurs = jouer();
        /* Une seule fois : l'échange ne se rejoue pas à chaque passage. */
        guetteur.disconnect();
      },
      { threshold: 0.4 },
    );

    guetteur.observe(el);

    return () => {
      guetteur.disconnect();
      minuteurs.forEach(clearTimeout);
    };
  }, [prete, question, reponse, fin]);

  if (!prete) return null;

  const questionVisible = etape !== "rien" && etape !== "question-ecrit";
  const reponseVisible = etape === "reponse" || etape === "fini";
  const finVisible = Boolean(fin) && etape === "fini";

  return (
    /* Le cadre.

       **La hauteur est celle de la courbe de l'autre carte**, partagée par
       `HAUTEUR_ANIMATION` : les deux cartes se suivent dans la même grille, et
       si leurs blocs n'ont pas la même hauteur, leurs descriptions ne démarrent
       pas à la même ligne. Deux paragraphes décalés de trente pixels se voient
       immédiatement, même sans savoir dire pourquoi.

       Elle réserve aussi la place des deux messages dès le premier rendu : sans
       elle, la carte grandirait à chaque étape, pousserait son bouton vers le
       bas et ferait sauter la carte voisine.

       Le filet et le fond disent que c'est une zone de conversation, sur
       décision de Rémy. Sans eux, deux bulles grises flottaient au milieu de la
       carte sans qu'on sache ce qu'elles étaient.

       `justify-end` empile les messages **par le bas** : ils arrivent l'un après
       l'autre, et partir du haut les ferait descendre à chaque ajout, ce qui
       donne l'impression que le bloc tombe. */
    <div
      ref={cadre}
      className={cn(
        "flex flex-col justify-end gap-2 overflow-hidden rounded-md border border-border bg-muted/30 p-3",
        HAUTEUR_ANIMATION,
        className,
      )}
    >
      {etape === "question-ecrit" ? (
        <Message>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                <PointsDAttente />
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ) : null}

      {questionVisible ? (
        <Message>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent className="text-sm">{question}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ) : null}

      {etape === "reponse-ecrit" ? (
        <Message align="end">
          <MessageAvatar>
            <PortraitRemy src={portrait} />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                <PointsDAttente />
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ) : null}

      {reponseVisible ? (
        <Message align="end">
          <MessageAvatar>
            <PortraitRemy src={portrait} />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent className="text-sm">{reponse}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ) : null}

      {/* Le dernier mot du client. Il revient à gauche, de son côté, et clôt
          l'échange : c'est ce qui fait que la conversation finit au lieu de
          s'arrêter. */}
      {finVisible ? (
        <Message>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent className="text-base leading-none">
                {fin}
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ) : null}
    </div>
  );
}

/**
 * Les trois points d'attente.
 *
 * `role="status"` et un texte caché : un lecteur d'écran annonce « écrit… »
 * plutôt que de décrire trois cercles, ou de ne rien dire du tout. Les
 * animations sont celles du thème, donc `globals.css` les neutralise déjà sous
 * `prefers-reduced-motion` ; de toute façon, cet état n'y est jamais atteint,
 * l'échange y étant posé d'emblée.
 */
function PointsDAttente() {
  return (
    <span role="status" className="flex items-center gap-1 py-0.5">
      <span className="sr-only">écrit…</span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
          style={{ animationDelay: `${i * 140}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * Le portrait de Rémy, celui qui sert déjà de surtitre à la carte.
 *
 * `alt=""` assumé : la bulle est déjà de son côté et la carte porte son nom en
 * toutes lettres. L'annoncer ici ferait dire « Rémy Jupille » deux fois par
 * message.
 */
function PortraitRemy({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={160}
      height={160}
      loading="lazy"
      className="size-7 rounded-full object-cover"
    />
  );
}
