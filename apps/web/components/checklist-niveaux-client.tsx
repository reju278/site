"use client";

import { TexteMarque } from "@/components/texte-marque";
import { checklistNiveaux } from "@/contenu/niveaux-business";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Les morceaux vivants de la checklist des niveaux : les onglets, les cases,
 * les réponses, la synthèse. Le texte, les vidéos et les témoignages sont
 * rendus par le serveur dans `checklist-niveaux.tsx` et passés ici déjà faits.
 *
 * **Les cases et les réponses restent dans le navigateur de la personne**,
 * `localStorage`, et nulle part ailleurs : le site n'a pas de base. Tout est
 * entouré de `try`, sans quoi une navigation privée qui refuse le stockage
 * casserait la page au lieu de l'oublier simplement.
 */
const CLE = "genesis-niveaux-business";
type Etat = {
  cases: Record<string, boolean>;
  reponses: Record<string, string>;
  /** Les réponses cochées dans un champ à choix, par leur texte. */
  choix: Record<string, string[]>;
};
const VIDE: Etat = { cases: {}, reponses: {}, choix: {} };

const Memoire = createContext<{
  etat: Etat;
  cocher: (id: string, oui: boolean) => void;
  repondre: (id: string, texte: string) => void;
  choisir: (id: string, choisis: string[]) => void;
  effacer: () => void;
  ouvrir: (onglet: string) => void;
} | null>(null);

function useMemoire() {
  const m = useContext(Memoire);
  if (!m) throw new Error("Hors de la checklist des niveaux");
  return m;
}

export type OngletNiveaux = { cle: string; emoji: string; libelle: string; contenu: React.ReactNode };

export function OngletsNiveaux({ onglets }: { onglets: OngletNiveaux[] }) {
  const premier = onglets[0]?.cle ?? "";
  const [actif, setActif] = useState(premier);
  /* L'état part vide, comme le HTML du serveur, et se recharge après le
     montage : le lire pendant le rendu ferait diverger l'hydratation. */
  const [etat, setEtat] = useState<Etat>(VIDE);
  const repere = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLDivElement>(null);

  /* Sur un téléphone, la barre défile : l'onglet ouvert y reste visible.
     On fait défiler la barre seule, `scrollIntoView` ferait aussi défiler
     la page. */
  useEffect(() => {
    const l = liste.current;
    const o = l?.querySelector<HTMLElement>("[data-state=active]");
    if (!l || !o) return;
    if (o.offsetLeft < l.scrollLeft || o.offsetLeft + o.offsetWidth > l.scrollLeft + l.clientWidth)
      l.scrollTo({ left: o.offsetLeft - 16 });
  }, [actif]);

  useEffect(() => {
    try {
      const lu = JSON.parse(localStorage.getItem(CLE) ?? "null") as Etat | null;
      if (lu) setEtat({ cases: lu.cases ?? {}, reponses: lu.reponses ?? {}, choix: lu.choix ?? {} });
    } catch {}
    /* L'adresse garde l'onglet : `#niveau-2` ouvre le niveau 2, à
       l'ouverture comme quand l'adresse change sans recharger la page. */
    const lireAdresse = () => {
      const h = location.hash.slice(1);
      if (onglets.some((o) => o.cle === h)) setActif(h);
    };
    lireAdresse();
    window.addEventListener("hashchange", lireAdresse);
    return () => window.removeEventListener("hashchange", lireAdresse);
  }, [onglets]);

  const garder = (suivant: Etat) => {
    setEtat(suivant);
    try {
      localStorage.setItem(CLE, JSON.stringify(suivant));
    } catch {}
  };

  const ouvrir = useCallback((cle: string) => {
    setActif(cle);
    history.replaceState(null, "", `#${cle}`);
    /* Si on a défilé sous la barre des onglets, on remonte à son niveau :
       sinon on arrive au milieu du nouvel onglet. */
    const r = repere.current;
    if (r && r.getBoundingClientRect().top < 0) window.scrollTo({ top: r.offsetTop });
  }, []);

  const valeur = {
    etat,
    cocher: (id: string, oui: boolean) => garder({ ...etat, cases: { ...etat.cases, [id]: oui } }),
    repondre: (id: string, texte: string) => garder({ ...etat, reponses: { ...etat.reponses, [id]: texte } }),
    choisir: (id: string, choisis: string[]) => garder({ ...etat, choix: { ...etat.choix, [id]: choisis } }),
    effacer: () => {
      if (window.confirm(checklistNiveaux.confirmer)) garder(VIDE);
    },
    ouvrir,
  };

  return (
    <Memoire.Provider value={valeur}>
      <div ref={repere} />
      <Tabs value={actif} onValueChange={ouvrir} className="gap-0">
        {/* Les classes d'état portent le même préfixe que celles du registre
            (`group-data-[variant=line]`) : sans lui, `tailwind-merge` les
            garde toutes les deux et c'est celle du registre qui gagne. */}
        {/* Collée en haut de l'écran pendant qu'on lit un onglet, et elle
            défile dans son propre cadre sur un téléphone. Le dessin est celui
            du module ouvert dans la liste de gauche : le bleu pâle, et un
            filet bleu, ici en bas puisque la barre est horizontale. */}
        <TabsList
          ref={liste}
          variant="line"
          className="sticky top-0 z-10 flex h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-black/10 bg-[var(--genesis-fond)] p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {onglets.map((o) => (
            <TabsTrigger
              key={o.cle}
              value={o.cle}
              className="h-11 flex-none gap-2 rounded-none px-3.5 font-[family-name:var(--font-genesis-bouton)] text-xs font-bold tracking-[0.12em] text-[#60606b] uppercase hover:text-[var(--genesis-encre)] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--genesis-encre)] group-data-[variant=line]/tabs-list:data-[state=active]:bg-[var(--genesis-surligne)] data-[state=active]:text-[var(--genesis-encre)] after:bg-[var(--genesis-bleu)] group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:h-[3px]"
            >
              <span aria-hidden>{o.emoji}</span>
              {o.libelle}
            </TabsTrigger>
          ))}
        </TabsList>
        {onglets.map((o) => (
          <TabsContent key={o.cle} value={o.cle} className="pt-8">
            {o.contenu}
          </TabsContent>
        ))}
      </Tabs>
    </Memoire.Provider>
  );
}

/** Un bouton qui ouvre un autre onglet : la synthèse et la navigation. */
export function LienOnglet({
  onglet,
  className,
  children,
}: {
  onglet: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { ouvrir } = useMemoire();
  return (
    <button type="button" onClick={() => ouvrir(onglet)} className={className}>
      {children}
    </button>
  );
}

/** Une case de Notion, au dessin des champs du tunnel : carrée, cerclée à
 *  45 % de noir, bleue une fois cochée, et le texte barré. */
export function CaseNiveau({ id, texte }: { id: string; texte: string }) {
  const { etat, cocher } = useMemoire();
  const oui = !!etat.cases[id];
  return (
    <li className="flex items-start gap-3 py-1.5">
      <Checkbox
        id={id}
        checked={oui}
        onCheckedChange={(v) => cocher(id, v === true)}
        className="mt-[5px] size-[18px] rounded-none border-[1.5px] border-black/45 bg-white shadow-none focus-visible:border-[var(--genesis-encre)] focus-visible:ring-0 data-[state=checked]:border-[var(--genesis-bleu)] data-[state=checked]:bg-[var(--genesis-bleu)] data-[state=checked]:text-white dark:bg-white"
      />
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer text-pretty transition-colors",
          oui && "text-[#76767f] line-through decoration-black/30",
        )}
      >
        <TexteMarque texte={texte} />
      </label>
    </li>
  );
}

/** Un encadré de réponse : le fond jaune de l'étiquette de l'optin, et le
 *  champ du formulaire d'inscription. */
export function ReponseNiveau({ id, question }: { id: string; question: string | null }) {
  const { etat, repondre } = useMemoire();
  return (
    <div className="my-4 grid gap-3 bg-[var(--genesis-jaune)] p-5">
      {question ? (
        <label htmlFor={id} className="text-pretty">
          <TexteMarque texte={question} />
        </label>
      ) : null}
      <Textarea
        id={id}
        value={etat.reponses[id] ?? ""}
        onChange={(e) => repondre(id, e.target.value)}
        placeholder={checklistNiveaux.reponse}
        aria-label={question ? undefined : checklistNiveaux.reponse}
        rows={question ? 3 : 1}
        className="min-h-12 rounded-none border-black/45 bg-white px-4 py-3 text-[17px] leading-[1.6] text-[var(--genesis-encre)] shadow-none placeholder:text-[var(--genesis-gris)] placeholder:italic focus-visible:border-[var(--genesis-encre)] focus-visible:shadow-[0_0_0_1px_var(--genesis-encre)] focus-visible:ring-0 md:text-[17px] dark:bg-white"
      />
    </div>
  );
}

/** La synthèse du diagnostic : une ligne par niveau, comme une entrée de la
 *  liste des modules, avec le compte des cases cochées dans son onglet, et
 *  « Ton niveau » au-delà du seuil de Rémy. */
export function SyntheseNiveaux({
  niveaux,
}: {
  niveaux: { n: number; titre: string; total: number }[];
}) {
  const { etat, ouvrir } = useMemoire();
  return (
    <ol className="my-4 flex flex-col gap-1 bg-white p-3 shadow-[0_0_39px_-8px_rgba(0,0,0,0.15)]">
      {niveaux.map((n) => {
        const coches = Array.from({ length: n.total }, (_, i) => etat.cases[`n${n.n}-${i}`]).filter(Boolean).length;
        const atteint = coches > checklistNiveaux.seuil;
        return (
          <li key={n.n}>
            <button
              type="button"
              onClick={() => ouvrir(`niveau-${n.n}`)}
              className={cn(
                "relative flex min-h-12 w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-black/[0.04]",
                atteint &&
                  "bg-[var(--genesis-surligne)] font-bold before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:bg-[var(--genesis-bleu)] hover:bg-[var(--genesis-surligne)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center font-[family-name:var(--font-genesis-bouton)] text-xs font-bold",
                  atteint ? "bg-[var(--genesis-encre)] text-white" : "bg-black/[0.06]",
                )}
              >
                {n.n}
              </span>
              <span className="min-w-0 flex-1 text-pretty">
                <TexteMarque texte={n.titre} />
              </span>
              {atteint ? (
                <span className="shrink-0 bg-[var(--genesis-encre)] px-2 py-0.5 font-[family-name:var(--font-genesis-bouton)] text-[11px] font-bold tracking-[0.1em] text-white uppercase">
                  {checklistNiveaux.badge}
                </span>
              ) : null}
              <span className="shrink-0 font-[family-name:var(--font-genesis-bouton)] text-xs font-bold text-[#60606b] tabular-nums">
                {coches}/{n.total}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Un champ qui ouvre une liste de réponses à cocher, sur demande de Rémy : on
 * clique, le menu s'ouvre, on coche ce dans quoi on se reconnaît. Le champ
 * montre ensuite les réponses cochées, sur le bleu pâle des surlignages.
 *
 * C'est le `DropdownMenu` du registre, déjà installé, repeint au dessin du
 * tunnel : angles droits, cases carrées bleues une fois cochées, PT Serif. Le
 * menu reste ouvert entre deux cases quand on peut en cocher plusieurs, et se
 * ferme au choix quand il n'en faut qu'un (`unique`). Il n'est pas modal :
 * la page ne se fige pas pendant qu'il est ouvert.
 */
export function ChoixNiveau({
  id,
  nom,
  question,
  options,
  unique,
  autre,
}: {
  id: string;
  /** Le nom du champ pour un lecteur d'écran : la question, ou le titre au
   *  dessus quand le champ n'a pas de question à lui. */
  nom: string;
  question: string | null;
  options: string[];
  unique?: boolean;
  autre?: boolean;
}) {
  const { etat, choisir, repondre } = useMemoire();
  const choisis = etat.choix[id] ?? [];
  const basculer = (o: string) =>
    choisir(
      id,
      unique
        ? choisis.includes(o) ? [] : [o]
        : choisis.includes(o) ? choisis.filter((x) => x !== o) : [...choisis, o],
    );
  return (
    <div className="my-4 grid gap-3 bg-[var(--genesis-jaune)] p-5">
      {question ? (
        <p className="text-pretty">
          <TexteMarque texte={question} />
        </p>
      ) : null}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={nom}
            className="flex min-h-14 w-full items-center gap-3 border border-black/45 bg-white px-4 py-3 text-left text-[17px] leading-snug text-[var(--genesis-encre)] outline-none focus-visible:border-[var(--genesis-encre)] focus-visible:shadow-[0_0_0_1px_var(--genesis-encre)] data-[state=open]:border-[var(--genesis-encre)] data-[state=open]:shadow-[0_0_0_1px_var(--genesis-encre)] [&[data-state=open]>svg]:rotate-180"
          >
            <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {choisis.length ? (
                choisis.map((o) => (
                  <span key={o} className="bg-[var(--genesis-surligne)] px-2 py-0.5 text-[15px] leading-snug">
                    <TexteMarque texte={o} />
                  </span>
                ))
              ) : (
                <span className="text-[var(--genesis-gris)] italic">
                  {unique ? checklistNiveaux.choisir : checklistNiveaux.choisirPlusieurs}
                </span>
              )}
            </span>
            <ChevronDown aria-hidden className="size-5 shrink-0 transition-transform duration-200" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-[min(26rem,var(--radix-dropdown-menu-content-available-height))] w-(--radix-dropdown-menu-trigger-width) rounded-none border-black/10 bg-white p-1 text-[var(--genesis-encre)] shadow-[0_0_39px_-8px_rgba(0,0,0,0.3)]"
        >
          {options.map((o) => (
            <DropdownMenuCheckboxItem
              key={o}
              checked={choisis.includes(o)}
              onCheckedChange={() => basculer(o)}
              onSelect={unique ? undefined : (e) => e.preventDefault()}
              className="cursor-pointer items-start rounded-none py-2.5 pr-3 pl-10 text-[16px] leading-snug text-[var(--genesis-encre)] focus:bg-[var(--genesis-surligne)] focus:text-[var(--genesis-encre)] [&>span:first-child]:top-[11px] [&>span:first-child]:left-3 [&>span:first-child]:size-[18px] [&>span:first-child]:border-[1.5px] [&>span:first-child]:border-black/45 [&>span:first-child]:bg-white data-[state=checked]:[&>span:first-child]:border-[var(--genesis-bleu)] data-[state=checked]:[&>span:first-child]:bg-[var(--genesis-bleu)] [&>span:first-child_svg]:size-3.5 [&>span:first-child_svg]:text-white"
            >
              <span className="text-pretty">
                <TexteMarque texte={o} />
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {autre ? (
        <Textarea
          id={`${id}-autre`}
          value={etat.reponses[`${id}-autre`] ?? ""}
          onChange={(e) => repondre(`${id}-autre`, e.target.value)}
          placeholder={checklistNiveaux.autre}
          aria-label={`${nom} : ${checklistNiveaux.autre}`}
          rows={1}
          className="min-h-12 rounded-none border-black/45 bg-white px-4 py-3 text-[16px] leading-[1.5] text-[var(--genesis-encre)] shadow-none placeholder:text-[var(--genesis-gris)] placeholder:italic focus-visible:border-[var(--genesis-encre)] focus-visible:shadow-[0_0_0_1px_var(--genesis-encre)] focus-visible:ring-0 md:text-[16px] dark:bg-white"
        />
      ) : null}
    </div>
  );
}

export function EffacerNiveaux() {
  const { effacer } = useMemoire();
  return (
    <p className="mt-10 font-[family-name:var(--font-genesis-bouton)] text-xs text-[#60606b]">
      {checklistNiveaux.memoire}{" "}
      <button type="button" onClick={effacer} className="underline underline-offset-2 hover:text-[var(--genesis-encre)]">
        {checklistNiveaux.effacer}
      </button>
    </p>
  );
}
