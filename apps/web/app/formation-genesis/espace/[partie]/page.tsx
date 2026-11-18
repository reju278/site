import { BanniereGenesis } from "@/components/banniere-genesis";
import { BoutonGenesis } from "@/components/bouton-genesis";
import { LecteurVideo } from "@/components/lecteur-video";
import { LogoFunnels } from "@/components/logo-funnels";
import { Emplacement } from "@/components/section";
import {
  espaceGenesis,
  lienReservation,
  partiesGenesis,
  RACINE_GENESIS,
  type PartieGenesis as Partie,
} from "@/contenu/formation-genesis";
import { insecables } from "@/lib/typographie";
import { cn } from "@repo/ui/lib/utils";
import { ArrowRight, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

/**
 * L'espace membre de la Formation Genesis, un module par adresse :
 * `go.funnels.club/formation-genesis/espace/<cle>` (issue #8).
 *
 * **Une adresse par module**, parce que chaque e-mail de la séquence en
 * envoie une : le lien du jour 3 ouvre le module 3, pas le premier.
 *
 * **La structure vient d'une page de cours relevée par Rémy** : le titre du
 * module en tête, la liste des modules à gauche (les bonus en dessous,
 * marqués d'une étoile), la vidéo au centre suivie d'un lien vers le module
 * suivant, et une carte d'appel à droite. Sur téléphone, tout s'empile : la
 * vidéo d'abord, puis la carte, puis la liste.
 *
 * **Le haut est réduit au titre**, sur demande de Rémy : ni sur-titre ni
 * description, « Module #1 : Positionnement » et rien d'autre. La barre de
 * la bannière, elle, suit la page : « Funnels.club : Leçon 1 ».
 *
 * **La liste est une carte qui ressort**, sur une référence de Rémy : fond
 * blanc et ombre détachée, comme le formulaire de l'optin, les titres de
 * groupe en capitales espacées, un numéro par module dans sa pastille, le
 * module ouvert surligné en bleu pâle avec un filet bleu à gauche. Les
 * pastilles de la référence sont rondes ; les nôtres gardent 5 px, les
 * commandes rondes du site étant une famille fermée (voir `AGENTS.md`). Sa
 * couleur d'accent, un violet, devient le bleu du tunnel, et le numéro du
 * module ouvert passe en noir : le blanc sur ce bleu ne tient que 3,35:1,
 * trop peu pour un chiffre de 12 px.
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

/** « Module #1 : Positionnement », ou le rang seul tant qu'il n'a pas de
 *  titre. */
const titreComplet = (p: Partie) =>
  p.titre && !p.bonus ? `${p.etiquette} : ${p.titre}` : (p.titre ?? p.etiquette);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partie } = await params;
  const p = partiesGenesis.find((x) => x.cle === partie);
  return {
    title: {
      absolute: `${p ? titreComplet(p) : ""} · ${espaceGenesis.titrePage}`,
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
  const modules = partiesGenesis.filter((p) => !p.bonus);
  const bonus = partiesGenesis.filter((p) => p.bonus);
  const barre = courante.bonus
    ? courante.etiquette
    : espaceGenesis.barre(modules.indexOf(courante) + 1);
  const titre = titreComplet(courante);

  return (
    <main className="bg-[var(--genesis-fond)] text-[var(--genesis-encre)]">
      <BanniereGenesis libelle={barre} />

      {/* Le titre du module, ferré à gauche sur la colonne de la bannière,
          comme l'optin. */}
      <header className="mx-auto max-w-[960px] px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
        <h1 className="text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.1] font-bold tracking-[0.02em] text-pretty">
          {insecables(titre)}
        </h1>
        {courante.description ? (
          <p className="mt-2 text-lg leading-[1.6] tracking-[0.02em] text-pretty sm:text-2xl">
            <span className="bg-[var(--genesis-surligne)] box-decoration-clone">
              {courante.description}
            </span>
          </p>
        ) : null}
      </header>

      {/* Deux colonnes en large, sur demande de Rémy : la liste des modules
          à gauche, et à droite la vidéo, plus large qu'avant, avec la carte
          d'appel en dessous. La carte était une troisième colonne, qui
          rétrécissait la vidéo. Sur téléphone : la vidéo, la carte, puis la
          liste. */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
        {/* La vidéo, le lien vers la suite et la carte d'appel. */}
        <section aria-label="Vidéo" className="flex flex-col gap-4 lg:order-2">
          {courante.video ? (
            <LecteurVideo
              id={courante.video.id}
              titre={titre}
              secondes={courante.video.secondes}
              affiche={`/temoignages/${courante.video.id}.jpg`}
              afficheAlt={titre}
              natif
              carre
            />
          ) : (
            <Emplacement
              attendu={`la vidéo Wistia de « ${titre} »`}
              className="aspect-video min-h-0"
            />
          )}
          {suivante ? (
            <Link
              href={`${RACINE_GENESIS}/espace/${suivante.cle}`}
              className="inline-flex min-h-10 items-center gap-2 self-end text-base font-bold underline-offset-4 hover:underline"
            >
              {insecables(
                `${espaceGenesis.suivante} : ${suivante.titre ?? suivante.etiquette}`,
              )}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          ) : null}

          {/* L'appel : l'unique sortie de l'espace, sous la vidéo.
              **Discret et petit, comme un passage d'un document Notion**, sur
              demande de Rémy, après deux cartes qu'il trouvait trop grosses :
              une ligne légère le sépare du lien vers le module suivant, puis
              tout est ferré à gauche, sans cadre ni fond, la petite photo
              comprise, et le bouton vient en dessous du texte. Une version aux
              polices et aux encres de Notion a été essayée ; Rémy a validé
              celle-ci, dans le PT Serif du tunnel.
              Ses textes ne sont pas des titres : un bloc d'appel n'entre pas
              dans le plan de la page (voir `AGENTS.md`). */}
          {/* Deux groupes et non une pile : en tête, une ligne d'auteur (les
              deux avatars et le sur-titre côte à côte) ; puis, après un vrai
              blanc, le contenu (titre, texte, bouton). Empilés à espacement
              presque égal, Rémy les trouvait « pas harmonieux » : rien ne
              disait où commençait le propos. */}
          {/* **Sur téléphone, un fond gris très clair**, #f8f8f8, d'un bord
              à l'autre de l'écran, sur demande de Rémy : la zone d'appel y
              suit la vidéo et précède la liste des modules, et le filet seul
              ne la détachait pas assez. Le fond remplace le filet, et le
              liseré des avatars prend sa couleur. */}
          <aside
            aria-label="Réserver un appel"
            className="mt-2 flex flex-col items-start border-t border-black/10 pt-8 max-sm:-mx-5 max-sm:border-t-0 max-sm:bg-[#f8f8f8] max-sm:px-5 max-sm:pb-8"
          >
            <div className="flex items-center gap-3">
              {/* La photo de Rémy devant le logo de Funnels Club, tous deux
                  ronds, comme un groupe d'avatars, sur sa demande. Ce sont
                  deux photos de profil, la personne et sa maison : la seule
                  famille qui a droit au rond sans exception. Le logo est la
                  tuile de `LogoFunnels` réduite à 80 % dans un cercle de son
                  noir : à pleine taille, la photo qui la chevauche cachait la
                  moitié du F. Un liseré de la couleur de page détache la
                  photo du logo. */}
              <div className="flex shrink-0 items-center">
                <span
                  data-rond
                  className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#101013] ring-2 ring-[var(--genesis-fond)] max-sm:ring-[#f8f8f8]">
                  <LogoFunnels className="size-[80%]" />
                </span>
                <img
                  src={carte.photo.src}
                  alt={carte.photo.alt}
                  width={256}
                  height={256}
                  loading="lazy"
                  className="relative z-10 -ml-3 size-10 rounded-full object-cover ring-2 ring-[var(--genesis-fond)] max-sm:ring-[#f8f8f8]"
                />
              </div>
              {carte.surtitre ? (
                <p className="font-[family-name:var(--font-genesis-bouton)] text-[11px] leading-snug font-bold tracking-[0.1em] text-[#60606b] uppercase">
                  {carte.surtitre}
                </p>
              ) : null}
            </div>
            {carte.titre ? (
              /* Une ligne par entrée de `carte.titre`, à partir de `sm` :
                 la coupure est celle de Rémy. Sur téléphone, la première
                 ligne est trop longue pour tenir seule ; le texte coule. */
              <p className="mt-6 text-xl leading-snug font-bold text-pretty">
                {carte.titre.map((ligne, i) => (
                  <Fragment key={ligne}>
                    {i > 0 ? " " : null}
                    <span className="sm:block">{insecables(ligne)}</span>
                  </Fragment>
                ))}
              </p>
            ) : null}
            {carte.texte ? (
              <p className="mt-2 text-base leading-relaxed text-pretty text-[#60606b]">
                {carte.texte}
              </p>
            ) : null}
            {!carte.titre || !carte.texte ? (
              <Emplacement
                attendu="le sur-titre, le titre et le texte de la carte d'appel"
                className="mt-3 min-h-24 w-full px-4 py-5"
              />
            ) : null}
            <BoutonGenesis
              href={lienReservation(courante)}
              /* Dans un nouvel onglet, sur demande de Rémy : le module reste
                 ouvert derrière la réservation. */
              nouvelOnglet
              className="mt-6 sm:w-auto sm:px-8"
            >
              {carte.bouton}
            </BoutonGenesis>
          </aside>
        </section>

        {/* La liste des modules, puis les bonus, dans une carte. */}
        <nav
          aria-label={espaceGenesis.titreListe}
          className="h-fit bg-white p-4 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)] lg:order-1"
        >
          <TitreGroupe>{espaceGenesis.titreListe}</TitreGroupe>
          <ol className="flex flex-col gap-1">
            {modules.map((p, i) => (
              <li key={p.cle}>
                <EntreeModule partie={p} numero={i + 1} courante={courante} />
              </li>
            ))}
          </ol>
          {bonus.length ? (
            <>
              <TitreGroupe className="mt-6">{espaceGenesis.titreBonus}</TitreGroupe>
              <ul className="flex flex-col gap-1">
                {bonus.map((p) => (
                  <li key={p.cle}>
                    <EntreeModule partie={p} courante={courante} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </nav>
      </div>
    </main>
  );
}

/** « MODULES », « BONUS » : capitales espacées en Roboto, comme les
 *  boutons du tunnel. */
function TitreGroupe({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={cn(
        "mb-2 px-3 font-[family-name:var(--font-genesis-bouton)] text-xs font-bold tracking-[0.18em] uppercase",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function EntreeModule({
  partie,
  numero,
  courante,
}: {
  partie: Partie;
  numero?: number;
  courante: Partie;
}) {
  const active = partie.cle === courante.cle;
  return (
    <Link
      href={`${RACINE_GENESIS}/espace/${partie.cle}`}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-12 items-center gap-3 px-3 py-2 text-base transition-colors",
        active
          ? "bg-[var(--genesis-surligne)] font-bold before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:bg-[var(--genesis-bleu)]"
          : "hover:bg-black/[0.04]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center font-[family-name:var(--font-genesis-bouton)] text-xs font-bold",
          active
            ? "bg-[var(--genesis-encre)] text-white"
            : "bg-black/[0.06] text-[var(--genesis-encre)]",
        )}
      >
        {partie.bonus ? <Star className="size-3.5" /> : numero}
      </span>
      <span className="min-w-0 text-pretty">{partie.titre ?? partie.etiquette}</span>
    </Link>
  );
}
