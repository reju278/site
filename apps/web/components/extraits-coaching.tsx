import { LecteurVideo } from "@/components/lecteur-video";

/**
 * L'extrait de coaching : la vidéo, et le strict habillage d'un enregistrement.
 *
 * **La fenêtre Safari est partie**, sur demande de Rémy, et le lecteur revient au
 * centre, seul. Elle avait un coût que ce fichier documentait déjà : les quatre
 * pourcentages de son écran étaient **recopiés** de son fichier de registre,
 * puisqu'il n'accepte ni enfants ni lecteur, et une copie de géométrie devient
 * fausse en silence le jour où l'original change. Ce risque disparaît avec elle,
 * comme le `rounded-b-[11px]` et le `z-20` qu'elle imposait.
 *
 * **Le lecteur retrouve donc son 16/9 et le rayon du site.** L'écran de Safari
 * était en 12/7, ce qui obligeait à lui retirer son rapport et ses angles.
 *
 * **Le repère d'enregistrement est discret, et c'est le mot de Rémy.** Une
 * pastille qui bat et trois lettres, posées dans le coin haut gauche, sur le
 * verre des gélules du hero : de quoi dire « c'est une séance filmée » sans
 * dessiner une caméra. Il ne recouvre rien d'utile, les coachings commençant sur
 * un partage d'écran.
 *
 * **Le rouge est `--destructive`**, celui du bouton « Fermer » de la fenêtre des
 * entretiens, et non une couleur de plus : c'est le rouge que le site emploie
 * déjà quand il en a besoin.
 *
 * **La pastille bat en CSS et se fige sous mouvement réduit**, par la règle
 * globale. Une pastille immobile reste une pastille : il n'y a rien à cacher,
 * contrairement au dégradé conique des gélules.
 *
 * **Le badge est `aria-hidden` et l'information est écrite.** Trois lettres
 * clignotantes n'apprennent rien à l'oreille ; le titre du lecteur dit déjà ce
 * qu'on regarde.
 */
export function ExtraitsCoaching({
  extrait,
}: {
  extrait: { id: string; titre: string; secondes: number };
}) {
  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl">
      <LecteurVideo
        id={extrait.id}
        titre={extrait.titre}
        secondes={extrait.secondes}
        affiche={`/temoignages/${extrait.id}.jpg`}
        /* Le lecteur de Wistia, servi d'emblée : plus aucune affiche cliquable
           sur cette page. */
        natif
      />

      {/* Posé par-dessus le lecteur, donc `pointer-events-none` : sans ça, il
          prendrait le clic qui revient au bouton de lecture. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur-sm sm:top-4 sm:left-4"
      >
        <span
          className="size-1.5 animate-pulse rounded-full"
          style={{ backgroundColor: "var(--destructive)" }}
        />
        Rec
      </span>
    </div>
  );
}
