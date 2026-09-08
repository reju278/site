"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { identite, liens, menus, navigation } from "@/contenu/site";
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
import { useEffect, useState } from "react";

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

/** Une entrée de navigation : 36 px de haut, rayon 8 px, comme chez eux. */
const ENTREE =
  "flex h-9 items-center gap-1.5 px-3 rounded-[8px] transition-colors text-sm font-semibold bg-transparent";

const ENTREE_SUR_IMAGE =
  "text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-white";

const ENTREE_SUR_PAGE =
  "text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent data-[state=open]:bg-accent data-[state=open]:text-foreground";

export function EnTete() {
  const [ouvert, setOuvert] = useState(false);

  /**
   * `true` dès qu'on a quitté la bande sombre du hero.
   *
   * Le seuil est volontairement plus court que le hero : la bascule doit être
   * faite avant que la capsule ne surplombe le beige, pas au moment où elle le
   * touche. `passive` parce qu'on ne bloque jamais le défilement.
   */
  const [depasse, setDepasse] = useState(false);

  useEffect(() => {
    const surDefilement = () => setDepasse(window.scrollY > 120);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  const capsule = cn(
    CAPSULE_BASE,
    depasse ? CAPSULE_SUR_PAGE : CAPSULE_SUR_IMAGE
  );
  const entree = cn(ENTREE, depasse ? ENTREE_SUR_PAGE : ENTREE_SUR_IMAGE);
  const surImage = !depasse;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        {/* La capsule de gauche. */}
        <div className={capsule}>
          <div className="flex h-9 items-center justify-center px-2">
            <Link
              href="/"
              className={cn(
                "titre text-lg whitespace-nowrap transition-colors duration-300",
                surImage ? "text-white" : "text-foreground"
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
              surImage ? "bg-white/15" : "bg-border"
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
                  <NavigationMenuTrigger className={entree}>
                    {menu.libelle}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-[12px] border border-border bg-popover p-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                    <ul className="w-[420px]">
                      {menu.entrees.map((entree) => (
                        <li key={entree.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={entree.href}
                              target={entree.externe ? "_blank" : undefined}
                              rel={entree.externe ? "noreferrer" : undefined}
                              className="flex flex-col gap-1 rounded-[8px] p-3 transition-colors hover:bg-accent"
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
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {navigation.map((entree) => (
                <NavigationMenuItem key={entree.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={entree.href}
                      target={entree.externe ? "_blank" : undefined}
                      rel={entree.externe ? "noreferrer" : undefined}
                      className={cn(entree, "whitespace-nowrap")}
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

          <a
            href={liens.funnelsClub}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "hidden h-[34px] items-center justify-center gap-2 rounded-[10px] px-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 sm:inline-flex",
              surImage
                ? "bg-white/8 text-white hover:bg-white/15"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Funnels Club
          </a>

          <Sheet open={ouvert} onOpenChange={setOuvert}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Ouvrir le menu"
                className={cn(
                  "flex size-9 items-center justify-center rounded-[8px] transition-colors duration-300 md:hidden",
                  surImage
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-accent"
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
                        target={entree.externe ? "_blank" : undefined}
                        rel={entree.externe ? "noreferrer" : undefined}
                        onClick={() => setOuvert(false)}
                        className="flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-foreground hover:bg-accent"
                      >
                        {entree.libelle}
                        {entree.externe ? (
                          <ArrowUpRight className="size-3.5 opacity-50" />
                        ) : null}
                      </a>
                    ))}
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
                  <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
                    Funnels Club
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
