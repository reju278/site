"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { TexteRoulant } from "@/components/texte-roulant";
import { Reseaux } from "@/components/reseaux";
import { estExterne, identite, liens, menus, navigation } from "@/contenu/site";
import { Button } from "@repo/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { cn } from "@repo/ui/lib/utils";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * L'en-tête, repris de passionfroot.
 *
 * Ce n'est pas une barre pleine largeur mais **deux capsules qui flottent**,
 * posées à vingt pixels du haut et écartées aux deux bords : la marque et la
 * navigation à gauche, les actions à droite. Entre les deux, le fond de la page
 * passe. C'est ce vide au milieu qui fait tout le caractère.
 *
 * Les valeurs de `CAPSULE` sont celles de leur feuille de style, à l'identique,
 * et non une approximation : dégradé blanc de 10 % à 5 %, flou d'arrière-plan
 * moyen, filet intérieur blanc à 7 %, et une ombre double dont la première
 * moitié est un liseré clair posé à l'intérieur du bord haut. C'est cette
 * dernière qui fait le verre ; sans elle, la capsule redevient un rectangle
 * gris.
 *
 * Deux règles d'`AGENTS.md` sont levées ici, sur décision de Rémy : le rayon
 * vaut 12 px et non 5, et le flou est devant et non derrière. L'exception est
 * consignée dans `AGENTS.md`, et elle ne vaut que pour cet en-tête.
 */
const CAPSULE_BASE =
  "flex items-center gap-2 rounded-[12px] p-1.25 pr-1.5 transition-all duration-300 backdrop-blur-md ring-1 ring-inset";

/**
 * Au-dessus du hero, sur l'image sombre : le verre blanc de passionfroot.
 * C'est le seul endroit où un blanc en dur est justifié, parce que le fond
 * n'est pas un jeton de thème mais une photographie, sombre dans les deux
 * thèmes.
 */
const CAPSULE_SUR_IMAGE =
  "bg-gradient-to-b from-white/10 to-white/5 ring-white/7 shadow-[0_1px_1px_rgba(255,255,255,0.04)_inset,0_2px_8px_rgba(0,0,0,0.10)]";

/**
 * Une fois l'image passée, le fond redevient celui du thème. Le verre blanc y
 * disparaîtrait : la capsule reprend les jetons, et son texte avec.
 */
const CAPSULE_SUR_PAGE =
  "bg-card/85 ring-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

/**
 * La hauteur occupée par l'en-tête flottant, décalage du haut compris.
 *
 * Elle sert à deux choses qui doivent rester d'accord : la zone que l'on
 * observe pour savoir si une bande sombre passe dessous, et le `scroll-mt` des
 * ancres, pour qu'une cible ne finisse pas cachée derrière les capsules.
 */
export const HAUTEUR_ENTETE = 66;

/** Une entrée de navigation : 36 px de haut, comme chez eux. */
const CLASSES_ENTREE =
  "flex h-9 items-center gap-1.5 px-3 rounded-md transition-colors text-sm font-semibold bg-transparent";

/*
 * À l'ouverture, le déclencheur prend les couleurs du panneau qui tombe de lui,
 * dans les deux habillages. C'est d'abord une question de lisibilité : sur
 * l'image, l'état ouvert valait `bg-white/10` avec du texte blanc, soit du
 * blanc sur un blanc à peine posé. C'est aussi ce qui rattache visuellement le
 * bouton au panneau, au lieu de les laisser flotter séparément.
 */
const OUVERT =
  "data-[state=open]:bg-popover data-[state=open]:text-popover-foreground";

const CLASSES_ENTREE_SUR_IMAGE = `text-white/80 hover:bg-white/15 hover:text-white focus:bg-white/15 ${OUVERT}`;

const CLASSES_ENTREE_SUR_PAGE = `text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent ${OUVERT}`;

export function EnTete() {
  const [ouvert, setOuvert] = useState(false);

  const chemin = usePathname();

  /**
   * `true` seulement quand une bande sombre passe réellement sous l'en-tête.
   *
   * La première version comparait `scrollY` à 120 px. C'était faux : le seuil
   * décrit le hero de l'accueil et rien d'autre, si bien qu'en haut des cinq
   * autres pages, qui n'ont pas de bande sombre, l'en-tête restait blanc sur
   * beige. Soit un rapport de contraste de 1,17:1, illisible.
   *
   * L'état est donc devenu une propriété de la page : le hero marque sa bande
   * d'un `data-bande-sombre`, et on observe cet élément. Une page qui n'en
   * déclare pas démarre et reste en habillage de page, ce qui est le défaut
   * sûr. La marge négative en haut réduit la zone d'observation à ce qui passe
   * sous l'en-tête : la bascule se fait quand la bande cesse de le recouvrir,
   * pas quand elle sort de l'écran.
   *
   * `useLayoutEffect` et non `useEffect` : la mesure a lieu avant la peinture,
   * donc sans un éclair d'habillage clair sur l'image au chargement.
   */
  const [surImage, setSurImage] = useState(false);

  useLayoutEffect(() => {
    const bande = document.querySelector("[data-bande-sombre]");
    if (!bande) {
      setSurImage(false);
      return;
    }

    const observateur = new IntersectionObserver(
      ([entree]) => setSurImage(entree?.isIntersecting ?? false),
      { rootMargin: `-${HAUTEUR_ENTETE}px 0px 0px 0px`, threshold: 0 },
    );
    observateur.observe(bande);
    return () => observateur.disconnect();
  }, [chemin]);

  const capsule = cn(
    CAPSULE_BASE,
    surImage ? CAPSULE_SUR_IMAGE : CAPSULE_SUR_PAGE,
  );
  // Ce nom ne doit surtout pas être `entree` : c'est celui des variables de
  // boucle plus bas, et l'avoir réutilisé ici faisait passer l'objet de
  // navigation à `cn`, qui en tirait des classes `libelle` et `href`. Le lien
  // ne recevait alors aucun style et retombait sur ceux du composant de
  // registre, en encre sombre sur l'image.
  const classesEntree = cn(
    CLASSES_ENTREE,
    surImage ? CLASSES_ENTREE_SUR_IMAGE : CLASSES_ENTREE_SUR_PAGE,
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        {/* La capsule de gauche. */}
        <div className={capsule}>
          <div className="flex h-9 items-center justify-center px-2">
            <Link
              href="/"
              // Le logo est le mot « expertise » du hero : même serif en
              // italique, `titre` portant la fonte comme le `h1` le fait
              // là-bas.
              //
              // **Il n'a plus l'effet lettre à lettre au survol**, retiré sur
              // décision de Rémy. `KineticText` reste en place partout
              // ailleurs, dans le hero et dans la signature du pied de page :
              // ce qui est retiré, c'est l'effet **ici**. Un logo d'en-tête est
              // survolé à chaque visite, au passage vers les menus voisins,
              // donc un effet qui se justifie sur un mot qu'on rencontre une
              // fois devient un tressautement permanent.
              //
              // `tracking-tight` reste : il rattrapait le crénage que le
              // découpage lettre à lettre supprimait, et il fait maintenant
              // partie du dessin du logo. `whitespace-nowrap` aussi : le nom
              // fait deux mots, et le `flex-nowrap` qui les tenait sur une
              // ligne appartenait au composant qu'on vient de retirer. Sans
              // lui, la capsule casserait le nom en deux sur un écran étroit.
              className={cn(
                "titre titre-fort text-lg whitespace-nowrap tracking-tight transition-colors duration-300",
                surImage ? "text-white" : "text-foreground",
              )}
            >
              {identite.nom}
            </Link>
          </div>

          {/* Le filet vertical qui sépare la marque de la navigation. */}
          <span
            aria-hidden
            className={cn(
              "hidden h-5 w-px transition-colors duration-300 md:block",
              surImage ? "bg-white/15" : "bg-border",
            )}
          />

          {/* Les menus déroulants.
              `viewport={false}` colle le panneau sous son propre déclencheur au
              lieu de le centrer sous la barre : c'est ce qui donne le
              déroulé aligné à gauche de passionfroot. L'ouverture et la
              fermeture sont animées par les états `data-[state]` du composant,
              pas par une transition écrite à la main. */}
          <NavigationMenu
            viewport={false}
            className="hidden md:flex"
            delayDuration={0}
          >
            <NavigationMenuList className="gap-1">
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.libelle}>
                  {/* `group/roule` est posé ici et non dans `classesEntree` :
                      cette chaîne sert aussi à des entrées qui ne roulent pas,
                      et un groupe déclaré sans personne pour l'écouter ne fait
                      rien de mal mais ment sur ce que fait l'élément. */}
                  <NavigationMenuTrigger
                    className={cn("group/roule", classesEntree)}
                  >
                    <TexteRoulant>{menu.libelle}</TexteRoulant>
                  </NavigationMenuTrigger>
                  {/* Le panneau en deux colonnes : la liste à gauche, une
                      illustration à droite, comme chez le modèle. La colonne
                      de droite est un cadre vide pour l'instant ; c'est elle
                      qui donne au panneau sa largeur et son assise, et la
                      retirer ferait retomber le menu sur une simple liste. */}
                  <NavigationMenuContent className="rounded-md border border-border bg-popover p-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                    <div className="flex gap-2">
                      <ul className="w-[380px] shrink-0">
                        {menu.entrees.map((entree) => (
                          <li key={entree.href}>
                            <NavigationMenuLink asChild>
                              <a
                                href={entree.href}
                                target={
                                  entree.externe || estExterne(entree.href)
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  entree.externe || estExterne(entree.href)
                                    ? "noreferrer"
                                    : undefined
                                }
                                className="flex flex-col gap-1 rounded-md p-3 transition-colors hover:bg-accent"
                              >
                                <span className="flex items-center gap-1.5 text-sm font-semibold text-popover-foreground">
                                  {entree.libelle}
                                  {entree.externe ? (
                                    <ArrowUpRight className="size-3.5 opacity-50" />
                                  ) : null}
                                </span>
                                {entree.texte ? (
                                  <span className="text-sm leading-snug text-muted-foreground">
                                    {entree.texte}
                                  </span>
                                ) : null}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                        {/* Les réseaux, en pied de la seule liste des
                            ressources : ce sont des lieux où l'on suit Rémy,
                            pas des programmes. Le filet les sépare du reste
                            comme la section « resources » du modèle. */}
                        {menu.libelle === "Ressources" ? (
                          <li className="mt-2 border-t border-border px-1 pt-2">
                            <Reseaux />
                          </li>
                        ) : null}
                      </ul>

                      <div
                        aria-hidden
                        className="flex w-[300px] shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/40 p-6 text-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Emplacement :{" "}
                          </span>
                          l&apos;illustration de ce menu
                        </span>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {navigation.map((entree) => (
                <NavigationMenuItem key={entree.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={entree.href}
                      target={
                        entree.externe || estExterne(entree.href)
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        entree.externe || estExterne(entree.href)
                          ? "noreferrer"
                          : undefined
                      }
                      className={cn(classesEntree, "whitespace-nowrap")}
                    >
                      {entree.libelle}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* La capsule de droite. */}
        <div className={capsule}>
          <BasculeTheme surImage={surImage} />

          {/* L'accès à l'espace membre, à côté de la bascule de thème. Il est
              discret par rapport à l'appel principal : celui qui a déjà un
              compte sait le chercher, celui qui n'en a pas ne doit pas le
              confondre avec l'inscription. */}
          <a
            href={liens.espaceMembre}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "group/roule hidden h-9 items-center rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors duration-300 sm:inline-flex",
              surImage
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <TexteRoulant>Connexion</TexteRoulant>
          </a>

          <a
            href={liens.decouvrir}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "group/roule hidden h-[34px] items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 sm:inline-flex",
              // Sur l'image, le fond passe de 8 % à 20 % : à 8 %, le bouton ne
              // se distinguait pas de la capsule qui le porte.
              surImage
                ? "bg-white/20 text-white ring-1 ring-white/45 ring-inset hover:bg-white/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <TexteRoulant>Découvrir</TexteRoulant>
          </a>

          <Sheet open={ouvert} onOpenChange={setOuvert}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Ouvrir le menu"
                className={cn(
                  "flex size-9 items-center justify-center rounded-md transition-colors duration-300 md:hidden",
                  surImage
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="titre text-left text-xl">
                  {identite.nom}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
                {menus.map((menu) => (
                  <div key={menu.libelle} className="mb-3">
                    <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {menu.libelle}
                    </p>
                    {menu.entrees.map((entree) => (
                      <a
                        key={entree.href}
                        href={entree.href}
                        target={
                          entree.externe || estExterne(entree.href)
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          entree.externe || estExterne(entree.href)
                            ? "noreferrer"
                            : undefined
                        }
                        onClick={() => setOuvert(false)}
                        className="flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-foreground hover:bg-accent"
                      >
                        {entree.libelle}
                        {entree.externe ? (
                          <ArrowUpRight className="size-3.5 opacity-50" />
                        ) : null}
                      </a>
                    ))}
                    {menu.libelle === "Ressources" ? (
                      <Reseaux className="mt-2 border-t border-border px-1 pt-3" />
                    ) : null}
                  </div>
                ))}

                {navigation.map((entree) => (
                  <Link
                    key={entree.href}
                    href={entree.href}
                    onClick={() => setOuvert(false)}
                    className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-foreground hover:bg-accent"
                  >
                    {entree.libelle}
                  </Link>
                ))}

                <Button asChild className="mt-3 h-10 font-semibold">
                  <a href={liens.decouvrir} target="_blank" rel="noreferrer">
                    Découvrir
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
