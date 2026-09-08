"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { identite, liens, navigation } from "@/contenu/site";
import { Button } from "@repo/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Logo() {
  return (
    <Link
      href="/"
      className="text-sm font-semibold tracking-tight text-foreground uppercase"
    >
      {identite.nom}
    </Link>
  );
}

export function EnTete() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);

  return (
    // Fond plein, pas de flou : le flou est réservé aux voiles qui passent
    // derrière une fenêtre.
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((entree) => {
            const actif = !entree.externe && chemin === entree.href;
            return (
              <Link
                key={entree.href}
                href={entree.href}
                target={entree.externe ? "_blank" : undefined}
                rel={entree.externe ? "noreferrer" : undefined}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  actif ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {entree.libelle}
                {entree.externe ? (
                  <ArrowUpRight className="size-3 opacity-60" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <BasculeTheme />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
              Découvrir Funnels Club
            </a>
          </Button>

          <Sheet open={ouvert} onOpenChange={setOuvert}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 md:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left uppercase">
                  {identite.nom}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navigation.map((entree) => (
                  <Link
                    key={entree.href}
                    href={entree.href}
                    target={entree.externe ? "_blank" : undefined}
                    rel={entree.externe ? "noreferrer" : undefined}
                    onClick={() => setOuvert(false)}
                    className="inline-flex items-center gap-1 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-accent"
                  >
                    {entree.libelle}
                    {entree.externe ? (
                      <ArrowUpRight className="size-3 opacity-60" />
                    ) : null}
                  </Link>
                ))}
                <Button asChild className="mt-3">
                  <a href={liens.funnelsClub} target="_blank" rel="noreferrer">
                    Découvrir Funnels Club
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
