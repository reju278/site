import { BanniereGenesis } from "@/components/banniere-genesis";
import { BoutonGenesis } from "@/components/bouton-genesis";
import { LecteurVideo } from "@/components/lecteur-video";
import { Emplacement } from "@/components/section";
import {
  espaceGenesis,
  partiesGenesis,
  RACINE_GENESIS,
} from "@/contenu/formation-genesis";
import { cn } from "@repo/ui/lib/utils";
import { ArrowRight, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * L'espace membre de la Formation Genesis, une partie par adresse :
 * `go.funnels.club/formation-genesis/espace/<partie>` (issue #8).
 *
 * **Une adresse par partie**, parce que chaque e-mail de la séquence en
 * envoie une : le lien du jour 3 ouvre la partie 3, pas la première.
 *
 * **La structure vient d'une page de cours relevée par Rémy** : le titre de
 * la partie en tête, la liste des parties à gauche (les bonus en dessous,
 * marqués d'une étoile), la vidéo au centre suivie d'un lien vers la partie
 * suivante, et une carte d'appel à droite. Sur téléphone, tout s'empile : la
 * vidéo d'abord, puis la carte, puis la liste.
 *
 * **Le dessin est celui de l'optin**, sur demande de Rémy : la même bannière,
 * le titre en PT Serif gras ferré à gauche, la partie en cours surlignée en
 * bleu pâle, et le bouton bleu à angles droits dans une carte à l'ombre de la
 * fenêtre d'inscription.
 *
 * **Aucune protection** : le site n'a pas d'authentification, et c'est la
 * règle du dépôt. L'espace n'est qu'une adresse non indexée qu'on reçoit
 * après l'optin. Le jour où il faut le fermer vraiment, c'est l'auth de
 * `MONTER-LA-STACK.md`, pas un mot de passe écrit ici.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return partiesGenesis.map((p) => ({ partie: p.cle }));
}

type Props = { params: Promise<{ partie: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partie } = await params;
  const p = partiesGenesis.find((x) => x.cle === partie);
  return {
    title: {
      absolute: `${p?.titre ?? p?.etiquette ?? ""} · ${espaceGenesis.titrePage}`,
    },
  };
}

export default async function PartieGenesis({ params }: Props) {
  const { partie } = await params;
  const rang = partiesGenesis.findIndex((x) => x.cle === partie);
  const courante = partiesGenesis[rang];
  if (!courante) notFound();
  const suivante = partiesGenesis[rang + 1];
  const { carte } = espaceGenesis;

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      <BanniereGenesis />

      {/* L'en-tête de la partie, ferré à gauche sur la colonne de la
          bannière, comme l'optin. */}
      <header className="mx-auto max-w-[960px] px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
        {espaceGenesis.surtitre ? (
          <p className="text-sm font-bold tracking-wide uppercase">
            {espaceGenesis.surtitre}
          </p>
        ) : (
          <Emplacement
            attendu="le sur-titre de l'espace membre"
            className="mb-3 min-h-0 py-3"
          />
        )}
        <h1 className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-balance">
          {courante.titre ?? courante.etiquette}
        </h1>
        {courante.description ? (
          <p className="mt-2 text-lg leading-[1.6] tracking-[0.02em] text-pretty sm:text-2xl">
            <span className="bg-[var(--genesis-surligne)] box-decoration-clone">
              {courante.description}
            </span>
          </p>
        ) : (
          <Emplacement
            attendu={`le titre et la description de « ${courante.etiquette} »`}
            className="mt-3 min-h-0 py-3"
          />
        )}
      </header>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-[14rem_minmax(0,1fr)_18rem] lg:gap-8">
        {/* La vidéo et le lien vers la suite. */}
        <section aria-label="Vidéo" className="flex flex-col gap-4 lg:order-2">
          {courante.video ? (
            <LecteurVideo
              id={courante.video.id}
              titre={courante.titre ?? courante.etiquette}
              secondes={courante.video.secondes}
              affiche={`/temoignages/${courante.video.id}.jpg`}
              afficheAlt={courante.titre ?? courante.etiquette}
              natif
            />
          ) : (
            <Emplacement
              attendu={`la vidéo Wistia de « ${courante.etiquette} »`}
              className="aspect-video min-h-0"
            />
          )}
          {suivante ? (
            <Link
              href={`${RACINE_GENESIS}/espace/${suivante.cle}`}
              className="inline-flex min-h-10 items-center gap-2 self-end text-base font-bold underline-offset-4 hover:underline"
            >
              {espaceGenesis.suivante} : {suivante.titre ?? suivante.etiquette}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          ) : null}
        </section>

        {/* La carte d'appel : l'unique sortie de l'espace. */}
        <aside
          aria-label="Réserver un appel"
          className="flex h-fit flex-col gap-3 rounded-[5px] bg-[var(--genesis-fond)] p-[15px] shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] lg:order-3"
        >
          {carte.surtitre ? (
            <p className="text-sm font-bold tracking-wide uppercase">
              {carte.surtitre}
            </p>
          ) : null}
          {carte.titre ? (
            <h2 className="text-xl leading-snug font-bold">
              {carte.titre}
            </h2>
          ) : null}
          {carte.texte ? (
            <p className="text-base leading-[1.5] text-pretty">
              {carte.texte}
            </p>
          ) : null}
          {!carte.titre || !carte.texte ? (
            <Emplacement
              attendu="le sur-titre, le titre et le texte de la carte d'appel, et une photo"
              className="min-h-28 px-4 py-6"
            />
          ) : null}
          <BoutonGenesis href={`${RACINE_GENESIS}/appel`}>
            {carte.bouton}
          </BoutonGenesis>
        </aside>

        {/* La liste des parties, puis les bonus. */}
        <nav aria-label={espaceGenesis.titreListe} className="lg:order-1">
          <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">
            {espaceGenesis.titreListe}
          </h2>
          <ol className="flex flex-col gap-1">
            {partiesGenesis.map((p, i) => {
              const active = p.cle === courante.cle;
              return (
                <li key={p.cle}>
                  <Link
                    href={`${RACINE_GENESIS}/espace/${p.cle}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-[5px] px-3 py-2 text-base transition-colors",
                      active
                        ? "bg-[var(--genesis-surligne)] font-bold"
                        : "hover:bg-[var(--genesis-surligne)]/60",
                      p.bonus && "mt-3",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-[var(--genesis-encre)] font-[family-name:var(--font-genesis-bouton)] text-xs font-bold text-white",
                      )}
                    >
                      {p.bonus ? <Star className="size-3.5" /> : i + 1}
                    </span>
                    <span className="min-w-0">{p.titre ?? p.etiquette}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </main>
  );
}
