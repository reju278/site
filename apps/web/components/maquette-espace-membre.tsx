import { maquette } from "@/contenu/site";
import { Lock } from "lucide-react";

/**
 * La maquette de l'espace membre de Funnels Club.
 *
 * Elle remplace la photographie d'écran que Rémy n'a pas : une fenêtre
 * d'ordinateur, et un téléphone posé devant. Le but n'est pas de tromper mais
 * de montrer, à l'échelle où on la regarde sur la page, la forme réelle du
 * produit : une plateforme unique, une colonne de modules à gauche, un cursus
 * en cartes au milieu.
 *
 * **Elle est dessinée, pas photographiée**, pour trois raisons : les captures
 * d'origine pèsent lourd, elles montrent des membres identifiables, et elles
 * vieillissent à chaque mise à jour de l'interface. Ici le texte vit dans
 * `site.ts` et se corrige en une ligne.
 *
 * **Tout est décoratif.** L'ensemble porte `aria-hidden` : un lecteur d'écran
 * qui énumérerait « Modèle, État d'esprit, Funnel Alchimie… » ferait croire à
 * une navigation qui n'existe pas. Le texte des piliers, à côté, dit ce que
 * cette image montre.
 *
 * **Les tailles sont en `cqw`**, donc relatives à la largeur du conteneur, pas
 * à celle de l'écran. C'est ce qui fait que la maquette garde exactement les
 * mêmes proportions dans une colonne de 600 px et sur un téléphone de 375, au
 * lieu d'avoir un texte qui gonfle quand le cadre rétrécit.
 */
export function MaquetteEspaceMembre() {
  return (
    <div aria-hidden className="@container relative w-full">
      {/* La fenêtre d'ordinateur. */}
      <div
        className="overflow-hidden rounded-md border shadow-[0_20px_50px_-20px_rgb(0_0_0/0.45)]"
        style={{
          background: "var(--maquette-fond)",
          borderColor: "var(--maquette-filet)",
          color: "var(--maquette-texte)",
        }}
      >
        {/* La barre du haut. */}
        <div
          className="flex items-center gap-[2cqw] border-b px-[2.5cqw] py-[1.8cqw]"
          style={{ borderColor: "var(--maquette-filet)" }}
        >
          <div
            className="grid size-[3.4cqw] place-items-center rounded-[0.6cqw] text-[2cqw] font-black"
            style={{
              background: "var(--maquette-texte)",
              color: "var(--maquette-fond)",
            }}
          >
            F
          </div>
          <span className="text-[2.2cqw] font-black tracking-tight">
            {maquette.nom}
          </span>

          <div className="ml-auto flex items-center gap-[1.4cqw]">
            {maquette.navigation.map((entree, rang) => (
              <span
                key={entree}
                className="rounded-[0.6cqw] px-[1.4cqw] py-[0.7cqw] text-[1.7cqw] whitespace-nowrap"
                style={
                  rang === 1
                    ? {
                        background: "var(--maquette-surface-haute)",
                        color: "var(--maquette-texte)",
                      }
                    : { color: "var(--maquette-texte-attenue)" }
                }
              >
                {entree}
              </span>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* La colonne de gauche. */}
          <div
            className="w-[26%] shrink-0 border-r px-[2cqw] py-[2cqw]"
            style={{ borderColor: "var(--maquette-filet)" }}
          >
            {maquette.rubriques.map((rubrique) => (
              <div key={rubrique.titre} className="mb-[2cqw]">
                <p
                  className="mb-[0.9cqw] text-[1.5cqw] font-semibold"
                  style={{ color: "var(--maquette-texte-attenue)" }}
                >
                  {rubrique.titre}
                </p>
                {rubrique.entrees.map((entree) => (
                  <p
                    key={entree}
                    className="flex items-center gap-[1cqw] py-[0.5cqw] text-[1.6cqw]"
                  >
                    <span className="size-[1.1cqw] shrink-0 rounded-[0.2cqw] bg-primary" />
                    <span className="truncate">{entree}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Le corps. */}
          <div className="min-w-0 flex-1 p-[2.5cqw]">
            {/* La carte de tête. */}
            <div
              className="flex overflow-hidden rounded-[1cqw]"
              style={{ background: "var(--maquette-surface)" }}
            >
              <div className="min-w-0 flex-1 p-[2.2cqw]">
                <p className="text-[2.6cqw] font-black tracking-tight">
                  {maquette.nom}
                </p>
                <p
                  className="mt-[1cqw] text-[1.6cqw] leading-relaxed"
                  style={{ color: "var(--maquette-texte-attenue)" }}
                >
                  {maquette.presentation}
                </p>
                <span
                  className="mt-[1.8cqw] inline-block rounded-full px-[2cqw] py-[0.9cqw] text-[1.6cqw] font-semibold"
                  style={{
                    background: "var(--maquette-texte)",
                    color: "var(--maquette-fond)",
                  }}
                >
                  {maquette.action}
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fond-hero.jpg"
                alt=""
                width={1920}
                height={1097}
                loading="lazy"
                decoding="async"
                className="w-[38%] shrink-0 object-cover"
              />
            </div>

            {/* Le cursus. */}
            <div className="mt-[2.2cqw] grid grid-cols-3 gap-[1.6cqw]">
              {maquette.modules.map((module, rang) => (
                <div key={module}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {/* Deux images seulement, et des cadrages très écartés.
                      Six fichiers pour une maquette ne se justifient pas, mais
                      six fois la même vignette au même endroit se voit tout de
                      suite et sonne faux. */}
                  <img
                    src={
                      rang % 3 === 1 ? "/affiche-video.jpg" : "/fond-hero.jpg"
                    }
                    alt=""
                    width={1920}
                    height={1097}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full rounded-[0.8cqw] object-cover"
                    style={{
                      objectPosition: `${[10, 50, 85, 30, 70, 15][rang]}% ${[25, 50, 70, 80, 20, 45][rang]}%`,
                      filter: `saturate(${[1, 1, 0.85, 1.1, 0.9, 1][rang]})`,
                    }}
                  />
                  <p
                    className="mt-[0.9cqw] flex items-center gap-[0.6cqw] text-[1.4cqw]"
                    style={{ color: "var(--maquette-texte-attenue)" }}
                  >
                    <Lock className="size-[1.4cqw]" />
                    {maquette.etiquette}
                  </p>
                  <p className="mt-[0.3cqw] truncate text-[1.7cqw] font-semibold">
                    {module}
                  </p>
                  <p
                    className="text-[1.4cqw]"
                    style={{ color: "var(--maquette-texte-attenue)" }}
                  >
                    {maquette.categorie}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Le téléphone, posé devant.

          Il n'est pas un ornement : c'est ce que dit la vidéo de présentation,
          la plateforme se tient aussi bien sur un téléphone que sur un
          ordinateur. Il déborde du cadre en bas à gauche, ce qui donne la
          profondeur ; `-bottom` et `-left` négatifs sortent du conteneur, donc
          la section qui l'accueille doit lui laisser la place. */}
      <div
        className="absolute -bottom-[9%] -left-[5%] w-[23%] overflow-hidden rounded-[2cqw] border-[0.6cqw] shadow-[0_18px_45px_-10px_rgb(0_0_0/0.6)]"
        style={{
          background: "var(--maquette-fond)",
          borderColor: "#000",
          color: "var(--maquette-texte)",
        }}
      >
        <div className="px-[1.4cqw] pt-[1.6cqw] pb-[1.4cqw]">
          {/* L'encoche. */}
          <div className="mx-auto mb-[1.2cqw] h-[0.7cqw] w-[35%] rounded-full bg-black" />

          <div className="flex items-center gap-[0.8cqw]">
            <div
              className="grid size-[2cqw] place-items-center rounded-[0.4cqw] text-[1.2cqw] font-black"
              style={{
                background: "var(--maquette-texte)",
                color: "var(--maquette-fond)",
              }}
            >
              F
            </div>
            <span className="text-[1.3cqw] font-black">{maquette.nom}</span>
          </div>

          <div className="mt-[1.2cqw] flex gap-[0.6cqw]">
            {maquette.navigation.slice(0, 2).map((entree, rang) => (
              <span
                key={entree}
                className="rounded-full px-[1cqw] py-[0.4cqw] text-[1.1cqw] whitespace-nowrap"
                style={
                  rang === 0
                    ? {
                        background: "var(--maquette-texte)",
                        color: "var(--maquette-fond)",
                      }
                    : {
                        background: "var(--maquette-surface-haute)",
                        color: "var(--maquette-texte-attenue)",
                      }
                }
              >
                {entree}
              </span>
            ))}
          </div>

          <div className="mt-[1.2cqw] space-y-[1.2cqw]">
            {maquette.modules.slice(0, 2).map((module, rang) => (
              <div key={module}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fond-hero.jpg"
                  alt=""
                  width={1920}
                  height={1097}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full rounded-[0.6cqw] object-cover"
                  style={{ objectPosition: `${20 + rang * 30}% 40%` }}
                />
                <p className="mt-[0.5cqw] truncate text-[1.2cqw] font-semibold">
                  {module}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
