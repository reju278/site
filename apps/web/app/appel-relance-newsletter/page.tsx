import { LecteurVideo } from "@/components/lecteur-video";
import { ReservationAppel } from "@/components/reservation-appel";
import { relanceNewsletter, type Morceau } from "@/contenu/appel";
import { scriptContactLien } from "@/lib/contact-lien";
import { partageTunnel } from "@/lib/partage";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";

/**
 * `/appel` avec, au-dessus du formulaire, la vidéo et les textes de
 * `funnels.club/appel-relance-newsletter`, sur demande de Rémy.
 *
 * **Le formulaire est celui d'`/appel`**, donc la même réservation et le même
 * préremplissage par lien d'e-mail. Le titre de la page étant ici le `h1`,
 * celui du formulaire descend en `h2`.
 */
export const metadata: Metadata = {
  title: { absolute: relanceNewsletter.titrePage },
  description: relanceNewsletter.description,
  ...partageTunnel({
    titre: relanceNewsletter.titrePage,
    description: relanceNewsletter.description,
    image: "appel",
    alt: "Réserve ton appel avec l'équipe Funnels Club",
  }),
};

function Morceaux({ morceaux }: { morceaux: readonly Morceau[] }) {
  return morceaux.map(({ texte, ton }, rang) => (
    <span
      key={rang}
      className={cn(
        ton === "vert" && "font-bold text-[color-mix(in_srgb,var(--icone-resultats)_78%,black)]",
        ton === "bleu" && "font-bold text-primary",
      )}
    >
      {texte}
    </span>
  ));
}

function Etape({ numero, texte }: { numero: string; texte: string }) {
  return (
    <p className="max-w-2xl text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
      <strong className="underline underline-offset-4">{numero}</strong>
      {" : "}
      {texte}
    </p>
  );
}

export default function AppelRelanceNewsletter() {
  const { accroche, titre, etape1, etape2, video } = relanceNewsletter;

  return (
    <main id="reservation" className="px-5 pt-8 sm:pt-12">
      {/* Le relevé du lien d'e-mail, en HTML brut : voir `lib/contact-lien.ts`. */}
      <div
        hidden
        dangerouslySetInnerHTML={{
          __html: `<script>${scriptContactLien}</script>`,
        }}
      />
      <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-6 text-center sm:mb-16">
        <p className="max-w-3xl text-sm leading-relaxed text-foreground sm:text-base">
          <Morceaux morceaux={accroche} />
        </p>
        <h1 className="titre max-w-3xl text-3xl text-balance text-foreground sm:text-5xl">
          <Morceaux morceaux={titre} />
        </h1>
        <Etape numero={etape1.numero} texte={etape1.texte} />
        <LecteurVideo
          id={video.id}
          titre={video.titre}
          secondes={video.secondes}
          affiche={video.affiche}
          afficheMobile={video.afficheMobile}
          afficheAlt={video.titre}
          natif
          prioritaire
          className="w-full shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)]"
        />
        <Etape numero={etape2.numero} texte={etape2.texte} />
      </div>
      <ReservationAppel niveauTitre="h2" />
    </main>
  );
}
