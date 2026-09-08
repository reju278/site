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
import { useState } from "react";

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
const CAPSULE =
  "flex items-center gap-2 rounded-[12px] p-1.25 pr-1.5 transition-all duration-300 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md ring-1 ring-white/7 ring-inset shadow-[0_1px_1px_rgba(255,255,255,0.04)_inset,0_2px_8px_rgba(0,0,0,0.10)]";

/** Une entrée de navigation : 36 px de haut, rayon 8 px, comme chez eux. */
const ENTREE =
  "flex h-9 items-center gap-1.5 px-3 rounded-[8px] transition-colors text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white bg-transparent focus:bg-white/10";

export function EnTete() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        {/* La capsule de gauche. */}
        <div className={CAPSULE}>
          <div className="flex h-9 items-center justify-center px-2">
            <Link
              href="/"
              className="titre text-lg whitespace-nowrap text-white"
            >
              {identite.nom}
            </Link>
          </div>

          {/* Le filet vertical qui sépare la marque de la navigation. */}
          <span aria-hidden className="hidden h-5 w-px bg-white/15 md:block" />

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
                  <NavigationMenuTrigger className={ENTREE}>
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
                      className={cn(ENTREE, "whitespace-nowrap")}
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
        <div className={CAPSULE}>
          <BasculeTheme />

          <a
            href={liens.funnelsClub}
            target="_blank"
            rel="noreferrer"
            className="hidden h-[34px] items-center justify-center gap-2 rounded-[10px] bg-white/8 px-3.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-white/15 sm:inline-flex"
          >
            Funnels Club
          </a>

          <Sheet open={ouvert} onOpenChange={setOuvert}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Ouvrir le menu"
                className="flex size-9 items-center justify-center rounded-[8px] text-white transition-colors hover:bg-white/10 md:hidden"
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
