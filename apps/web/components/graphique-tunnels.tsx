"use client";

import {
  Background,
  ChartTooltip,
  curveCatmullRom,
  Line,
  LineChart,
} from "@repo/ui/components/graphique-flux";
import { sectionTunnel } from "@/contenu/site";
import { cn } from "@repo/ui/lib/utils";

/**
 * Les deux courbes : le site internet qui stagne, le tunnel qui décolle.
 *
 * C'est le `LineChart` du registre Bklit, installé et non réécrit, demandé par
 * Rémy avec les composants qu'il a fournis. Ce qui est à nous : les deux
 * séries, l'axe des mois et le contenu de l'infobulle.
 *
 * **Aucun nombre n'est affiché nulle part, et c'est une condition, pas un
 * choix de style.** Pas d'axe des ordonnées, pas de valeur dans l'infobulle,
 * pas d'étiquette au bout des courbes. Sur un site de formation, un chiffre
 * affiché est une allégation commerciale : dire « 50 000 € au mois 12 » serait
 * une promesse de revenus, et il faudrait pouvoir la prouver. Une **forme** ne
 * promet rien, elle compare deux trajectoires. Les valeurs des deux séries ne
 * sont donc que des hauteurs relatives, elles ne représentent ni des euros, ni
 * des visiteurs, ni des clients.
 *
 * C'est aussi pourquoi l'infobulle ne porte que les deux noms et leurs
 * couleurs, demandé par Rémy : on survole pour savoir **quelle courbe est
 * laquelle**, pas pour lire une valeur. Une infobulle sans chiffre est
 * inhabituelle ; ici elle est la seule qui soit honnête.
 *
 * **Pas de grille.** Des lignes horizontales derrière deux courbes disent qu'il
 * y a une échelle à lire, et invitent à mesurer ce qui n'est pas mesurable. Le
 * fond à pois du registre ne dit rien de tel : il texture, il ne gradue pas.
 *
 * **Le fond à pois et l'estompage des bords sont ceux du registre**, demandés
 * tels quels par Rémy sur l'exemple « Line Chart, Trio with Brush » : le motif
 * s'efface à gauche et à droite, et les tracés avec lui. Ils avaient été coupés
 * dans une première version, au motif qu'effacer la fin de la courbe verte
 * revient à effacer la conclusion ; l'objection reste vraie, mais le rendu du
 * registre est ce qui a été demandé, et l'estompage y est assez court pour que
 * la pente finale se lise.
 *
 * **Ce que le registre ne donne pas : le sélecteur du bas.** `ChartBrush` et
 * `ChartBrushLayout` sont nommés dans l'exemple, mais ils ne sont publiés dans
 * aucun des cinquante-six éléments du registre Bklit : le code cité les
 * référence sans les livrer. Les écrire à la main est possible, `LineChart`
 * acceptant déjà un `xDomain`, mais c'est un composant entier et non un
 * réglage, et il faudrait décider s'il gagne sa place : un sélecteur de plage
 * sert à explorer des valeurs, et il n'y en a aucune ici.
 *
 * L'axe des abscisses est à nous, et il le fallait : celui du registre formate
 * ses étiquettes avec un `Intl.DateTimeFormat` anglais écrit en dur dans son
 * fichier, qui rendrait « Jan 1, Feb 1 ». On ne corrige pas le code d'un
 * registre, donc on ne s'en sert pas : douze libellés posés en pourcentage sous
 * le tracé font le même travail et disent « Mois 1 » en français.
 */

/* Les deux trajectoires, en unités sans nom. Douze points, un par mois.
 *
 * **Les deux partent du même point**, et c'est une correction de Rémy : une
 * version les séparait dès le mois un, ce qui donnait deux mondes distincts au
 * lieu d'un même départ. L'écart doit se creuser sous les yeux, pas exister
 * avant que l'histoire ne commence.
 *
 * **La rouge est plate, avec de petits sursauts**, réglage de Rémy lui aussi.
 * Une version intermédiaire lui avait donné de grandes oscillations : on y
 * lisait de l'activité, presque une saisonnalité, alors que ce qu'elle doit
 * dire est « on s'agite un peu et on n'arrive à rien ». Elle ne descend pas non
 * plus : une chute dirait que les sites font perdre de l'argent, ce que
 * personne n'affirme.
 *
 * **La verte monte sans être lisse.** Elle a ses replats, aux mois 3 et 7 : une
 * exponentielle parfaite ressemble à un argumentaire, une progression qui
 * hésite ressemble à un travail. La pente finale, elle, ne se discute pas. */
const MOIS = [
  { sites: 100, tunnels: 100 },
  { sites: 108, tunnels: 106 },
  { sites: 96, tunnels: 116 },
  { sites: 116, tunnels: 126 },
  { sites: 98, tunnels: 141 },
  { sites: 112, tunnels: 158 },
  { sites: 94, tunnels: 172 },
  { sites: 118, tunnels: 210 },
  { sites: 97, tunnels: 262 },
  { sites: 114, tunnels: 332 },
  { sites: 96, tunnels: 436 },
  { sites: 104, tunnels: 565 },
];

/* Le registre range ses points sur une échelle de temps : il lui faut des
   dates, et il en faut de vraies. Elles ne sont jamais affichées, l'axe du
   registre étant remplacé par le nôtre ; elles ne servent qu'à espacer les
   points régulièrement. Le premier janvier d'une année quelconque fait
   l'affaire, et un mois par point garde l'écart constant. */
const SERIE = MOIS.map((point, i) => ({
  date: new Date(2024, i, 1),
  /* Le numéro du mois voyage **avec la donnée** et non avec le rang du point.

     L'infobulle du registre expose bien un `index`, mais il ne désigne pas le
     point sous le curseur : à l'usage, il retarde d'un rang, et la boîte
     annonçait « Mois 7 » pendant que le repère se posait sur le huitième point.
     Ce genre d'écart ne se voit pas en lisant le code, seulement en survolant.
     Lire le champ du point supprime la question. */
  mois: i + 1,
  ...point,
}));

const ROUGE = "var(--courbe-morte)";
const VERT = "var(--courbe)";

export function GraphiqueTunnels({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      {/* La légende, au-dessus et non dans l'infobulle seule.

          L'infobulle porte la sienne, mais elle demande un survol : sur un
          téléphone, il n'y en a pas. Sans cette ligne, la moitié des visiteurs
          verraient deux courbes de couleur sans jamais savoir laquelle est
          laquelle. */}
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {[
          { nom: sectionTunnel.courbes.sites, couleur: ROUGE },
          { nom: sectionTunnel.courbes.tunnels, couleur: VERT },
        ].map((serie) => (
          <li
            key={serie.nom}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: serie.couleur }}
            />
            {serie.nom}
          </li>
        ))}
      </ul>

      {/* Le tracé.

          La hauteur est déclarée et non déduite d'un rapport : le rapport de
          deux pour un du registre donnerait cinq cents pixels de haut sur la
          mesure d'un bloc, et la courbe ne tiendrait plus dans l'écran avec son
          titre. */}
      <div className="mt-6 h-[260px] w-full sm:mt-8 sm:h-[360px]">
        <LineChart
          data={SERIE}
          xDataKey="date"
          /* Des marges minces : les axes du registre ne sont pas là, il n'y a
             rien à loger autour du tracé. Il reste de quoi ne pas couper les
             points du haut et du bas, qu'un trait de deux pixels déborderait. */
          margin={{ top: 24, right: 24, bottom: 16, left: 24 }}
          animationDuration={1600}
          className="h-full"
        >
          {/* Le fond à pois, et son estompage sur les deux bords.

              C'est lui qui donne au bloc son ombré à gauche et à droite : le
              motif ne s'arrête pas, il s'éteint, donc le tracé n'a pas de
              frontière visible. Les valeurs sont celles de l'exemple du
              registre, fournies par Rémy. */}
          <Background pattern="dots" opacity={0.85} />

          {/* L'ordre compte : la verte est déclarée en second, donc tracée
              par-dessus. Aux mois où les deux se croisent, c'est elle qu'on doit
              voir passer. */}
          <Line
            dataKey="sites"
            stroke={ROUGE}
            strokeWidth={2}
            curve={curveCatmullRom}
          />
          <Line
            dataKey="tunnels"
            stroke={VERT}
            strokeWidth={2.5}
            curve={curveCatmullRom}
          />

          {/* L'infobulle : deux noms, deux couleurs, aucun nombre.

              `showDatePill={false}` retire la pastille du registre, qui
              afficherait la date technique des points, en anglais et sans aucun
              sens ici. Le mois est repris dans l'en-tête de la boîte.

              Les couleurs du texte sont écrites en toutes lettres : la boîte du
              registre pose son propre fond sombre dans les deux thèmes, donc un
              jeton sémantique n'aurait rien à suivre. C'est la même raison
              qu'en `CourbeMontante`. */}
          <ChartTooltip
            showDatePill={false}
            indicatorColor="var(--chart-crosshair)"
            content={({ point }) => (
              <div className="px-3 py-2">
                <p className="text-xs text-white/70">Mois {String(point.mois)}</p>

                <ul className="mt-1.5 space-y-1">
                  {[
                    { nom: sectionTunnel.courbes.sites, couleur: ROUGE },
                    { nom: sectionTunnel.courbes.tunnels, couleur: VERT },
                  ].map((serie) => (
                    <li
                      key={serie.nom}
                      className="flex items-center gap-2 text-sm text-white"
                    >
                      <span
                        aria-hidden
                        className="size-2 shrink-0 rounded-full"
                        style={{ background: serie.couleur }}
                      />
                      {serie.nom}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          />
        </LineChart>
      </div>

      {/* L'axe des mois.

          Chaque libellé est posé en pourcentage de la largeur, et non réparti
          par une grille : l'échelle du graphique place le premier point sur le
          bord gauche et le dernier sur le bord droit, donc une grille de douze
          colonnes les centrerait tous d'un demi-pas à côté.

          Les deux libellés des bouts sont recalés vers l'intérieur, sinon ils
          débordent de la moitié de leur largeur.

          Sur écran étroit, un mois sur trois : douze libellés sur 375 px se
          chevaucheraient. Ils sont **cachés et non retirés**, donc les autres ne
          bougent pas d'un pixel d'une largeur à l'autre. */}
      <div
        aria-hidden
        className="relative mt-3 h-5"
        style={{ paddingLeft: 24, paddingRight: 24 }}
      >
        <div className="relative h-full">
          {MOIS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "absolute top-0 text-xs whitespace-nowrap text-muted-foreground",
                i % 3 === 0 ? "block" : "hidden sm:block",
              )}
              style={{
                left: `${(i / (MOIS.length - 1)) * 100}%`,
                transform:
                  i === 0
                    ? "none"
                    : i === MOIS.length - 1
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
              }}
            >
              Mois {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
