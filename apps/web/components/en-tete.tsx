"use client";

import { BasculeTheme } from "@/components/bascule-theme";
import { LogoFunnels } from "@/components/logo-funnels";
import { TexteRoulant } from "@/components/texte-roulant";
import { Reseaux } from "@/components/reseaux";
import {
  estExterne,
  identite,
  liens,
  menus,
  navigation,
  podcastMaverick,
} from "@/contenu/site";
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
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  type LucideIcon,
  Menu,
  MessagesSquare,
  Mic,
  Newspaper,
  Radio,
  TrendingUp,
} from "lucide-react";
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
/**
 * Une icône par entrée de menu, rangée par destination.
 *
 * La forme vient de TrendTrack, fournie par Rémy : une tuile carrée à gauche de
 * chaque entrée, à la place de l'illustration qui occupait la colonne de
 * droite. Le gain n'est pas décoratif. L'illustration était un emplacement vide
 * qui donnait sa largeur au panneau ; l'icône, elle, appartient à l'entrée, donc
 * le panneau n'a plus besoin d'une seconde colonne pour tenir debout.
 *
 * **La table est rangée par adresse et non par libellé.** Un libellé se
 * renomme : « Digital Selfmade » est déjà devenu « Blog » une fois. Une adresse
 * qui change est une page qui a bougé, et il faut de toute façon repasser
 * partout. L'entrée sans icône n'est pas une erreur, elle tombe simplement sur
 * `Newspaper`.
 *
 * Les icônes ne disent rien que le libellé ne dise : elles servent à retrouver
 * une ligne dans une liste qu'on a déjà lue, pas à la comprendre la première
 * fois. C'est pour ça qu'elles sont `aria-hidden` et que le lien s'annonce par
 * son seul texte.
 */
const ICONES: Record<string, LucideIcon> = {
  [liens.appel]: GraduationCap,
  [liens.consulting]: MessagesSquare,
  [liens.livre]: BookOpen,
  [podcastMaverick.site]: Radio,
  "/resultats": TrendingUp,
  "/articles": Newspaper,
  "/podcast": Mic,
};

/**
 * Les deux entrées qui portent la marque plutôt qu'un pictogramme.
 *
 * Sur demande de Rémy : dans le menu « Programmes », les deux lignes sont les
 * deux offres de l'accueil, et elles doivent porter la même tuile qu'elles, le
 * `F` de Funnels Club et le `C` du consulting. Un pictogramme générique à cet
 * endroit dirait « une rubrique parmi d'autres » là où la carte, deux écrans
 * plus bas, dit « un produit ».
 *
 * Rangée par adresse pour la même raison que les icônes : un libellé se
 * renomme, une adresse est l'identité de la page.
 */
const LETTRES_MARQUE: Record<string, "F" | "C"> = {
  [liens.appel]: "F",
  [liens.consulting]: "C",
};

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

  /* Le retour, sur les pages qui ont un parent évident.
     
     Il vit dans l'en-tête et non dans la page, sur décision de Rémy : posé
     au-dessus du titre, il ressemblait à un élément de l'article ; ici, il est
     au même endroit sur toutes les pages qui en ont un, et il ne bouge pas.

     La règle est écrite en une ligne et non par page : tout ce qui descend sous
     `/resultats` remonte à `/resultats`. Le jour où une autre famille de pages
     apparaît, c'est une condition de plus ici, et rien à toucher ailleurs. */
  const retour = chemin.startsWith("/resultats/")
    ? { href: "/resultats", libelle: "Tous les résultats" }
    : null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-2 z-50 px-3 lg:top-5 lg:px-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        {/* La capsule de gauche.

            **La racine du menu enveloppe la capsule au lieu d'être rangée
            dedans, et c'est la seule façon d'avoir un panneau flouté.** Un
            `backdrop-filter` ne brouille que ce qui est peint **sous** lui ;
            posé à l'intérieur d'un élément qui en porte déjà un, il n'a plus
            pour arrière-plan que le contenu de cet élément, c'est-à-dire rien.
            Le panneau était donc translucide mais net, et aucune valeur de flou
            n'y changeait quoi que ce soit : ce n'était pas un réglage, c'était
            sa place dans l'arbre.

            La racine sort donc de la capsule, et le panneau part dans le
            `viewport` du composant, que celui-ci rend **à côté** de ses
            enfants. Il n'est plus sous le verre de la capsule, il est à côté :
            son arrière-plan redevient la page, et le flou reprend son travail.

            C'est aussi pourquoi `viewport={false}` a disparu : avec lui, le
            panneau se rend dans son entrée de menu, donc dans la capsule, ce
            qu'on vient précisément de défaire. */}
        <NavigationMenu
          delayDuration={0}
          className="relative max-w-none items-start justify-start"
        >
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

              Le panneau se rend dans le `viewport` de la racine, qui est
              au-dessus, hors de la capsule : voir le commentaire de la capsule
              pour pourquoi il ne peut pas en être autrement. Le `viewport` est
              calé à gauche, comme le déroulé de passionfroot, et son verre est
              écrit dans `globals.css`, le composant de registre ne laissant
              passer aucune classe jusqu'à lui.

              L'ouverture et la fermeture sont animées par les états
              `data-[state]` du composant, pas par une transition écrite à la
              main. */}
          <NavigationMenuList className="hidden gap-1 md:flex">
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
                  {/* Le panneau déroulant, relevé sur TrendTrack.

                      **Les cotes ne sont pas approchées, elles sont lues dans
                      leur feuille de style** : `nav_mega__wrap`, `nav_mega__
                      layout`, `nav_mega__link` et `nav_menu__icon`. Panneau à
                      1,75 em de rayon, grille de deux colonnes à 0,75 em et
                      0,375 em d'écart, rembourrage de 1 em ; entrée à 1 em de
                      rayon, 1 em d'écart, rembourrage de 0,625 em avec 1,75 em
                      à droite ; tuile de 2,75 em à 0,875 em de rayon,
                      rembourrage de 0,625 em. Tout est en `em` chez eux, donc
                      tout est proportionnel au corps du texte : les valeurs en
                      pixels ci-dessous sont ces `em` résolus sur nos 16 px.

                      **Trois choses sont à eux et restent à eux** : le fond de
                      la tuile et son filet, tirés de `currentColor` à 4 % et
                      2 %, et l'ombre de verre `--ombre-verre`. Le
                      `color-mix` sur `currentColor` est ce qui rend la recette
                      transposable : leur site n'a qu'un thème, le nôtre en a
                      deux, et une valeur en blanc dur n'aurait rien donné en
                      clair.

                      **Le verre de l'en-tête est conservé**, sur insistance
                      de Rémy : `card/85` et flou de douze pixels, exactement
                      les capsules. C'est la troisième exception du projet à
                      « le flou va derrière, jamais devant », et elle se tient :
                      ce panneau **sort** d'une capsule en verre, et les deux se
                      lisaient comme deux objets étrangers quand l'un était
                      opaque. Écrite dans `AGENTS.md`.

                      Ce verre n'est pas ici mais dans `globals.css`, sur le
                      `viewport` : c'est lui le cadre visible, et le composant
                      de registre le rend lui-même, sans laisser passer la
                      moindre classe. Ce panneau-ci ne porte plus que son
                      rembourrage et sa grille. */}
                  <NavigationMenuContent className="p-4">
                    {/* La grille.

                        Deux colonnes comme chez eux, et la largeur suit : leur
                        panneau fait 54 em pour deux colonnes, le nôtre 44, nos
                        libellés étant plus courts que les leurs. Le
                        `max-w` borne le panneau à la fenêtre, sinon il déborde
                        à droite sur un portable à 900 px, où le menu existe
                        encore.

                        Une entrée seule sur sa dernière ligne n'est pas un
                        défaut ici : la grille se remplit de gauche à droite, et
                        c'est ce que fait leur menu à onze entrées. */}
                    <ul className="grid w-[44rem] max-w-[calc(100vw-5rem)] grid-cols-2 gap-x-1.5 gap-y-3">
                      {menu.entrees.map((entree) => {
                        const Icone = ICONES[entree.href] ?? Newspaper;
                        const lettre = LETTRES_MARQUE[entree.href];
                        const externe =
                          entree.externe || estExterne(entree.href);

                        return (
                          <li key={entree.href}>
                            <NavigationMenuLink asChild>
                              <a
                                href={entree.href}
                                target={externe ? "_blank" : undefined}
                                rel={externe ? "noreferrer" : undefined}
                                /* `flex-row` est écrit alors qu'il est le
                                   défaut de `flex`, et il le faut : le lien du
                                   registre pose `flex-col`, que `cn()` ne voit
                                   pas comme un conflit avec `flex`. Sans lui,
                                   la tuile se range au-dessus du texte au lieu
                                   d'être à sa gauche.

                                   Le survol est un voile tiré de `currentColor`
                                   et non un jeton : c'est la même mécanique que
                                   la tuile, donc il suit le thème sans qu'on
                                   écrive deux valeurs. */
                                className="group/entree flex flex-row items-center gap-4 rounded-[12px] py-2.5 pr-7 pl-2.5 transition-colors hover:bg-[color-mix(in_srgb,currentColor_5%,transparent)]"
                              >
                                {/* La tuile.

                                    44 px de côté, 14 px de rayon, un fond à
                                    4 % de la couleur du texte, un filet à 2 %
                                    et l'ombre de verre : ce sont leurs quatre
                                    valeurs. Le glyphe est en `--primary`, la
                                    couleur du site, là où le leur est dans leur
                                    vert de marque.

                                    **Leurs icônes sont des dessins, les nôtres
                                    sont des tracés Lucide.** C'est la seule
                                    chose qui ne se relève pas dans une feuille
                                    de style : ils ont fait dessiner onze
                                    pictogrammes pleins. Le relief vient de la
                                    tuile, pas du glyphe, donc l'écart se voit
                                    peu ; le combler demande des dessins, pas du
                                    code. */}
                                {lettre ? (
                                  /* Les deux programmes portent la marque et
                                     non un pictogramme, sur demande de Rémy :
                                     la même tuile que les cartes de l'accueil,
                                     un `F` pour Funnels Club et un `C` pour le
                                     consulting. Elle a son fond et son relief à
                                     elle, donc elle remplace la tuile de verre
                                     au lieu de se poser dedans : deux reliefs
                                     emboîtés ne font pas un objet, ils font une
                                     bordure de trop. */
                                  <LogoFunnels
                                    lettre={lettre}
                                    className="size-11 shrink-0"
                                  />
                                ) : (
                                  <span
                                    aria-hidden
                                    style={{ boxShadow: "var(--ombre-verre)" }}
                                    className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[color-mix(in_srgb,currentColor_4%,transparent)] p-2.5 text-primary outline outline-[color-mix(in_srgb,currentColor_8%,transparent)] -outline-offset-1"
                                  >
                                    <Icone className="size-full" />
                                  </span>
                                )}

                                {/* `min-w-0` : sans lui, un bloc de texte dans
                                    un conteneur en `flex` refuse de descendre
                                    sous la largeur de son plus long mot, et la
                                    coupure à une ligne ne se déclenche jamais. */}
                                <span className="min-w-0">
                                  <span className="flex items-center gap-1.5 text-sm font-medium text-popover-foreground">
                                    {entree.libelle}
                                    {externe ? (
                                      <ArrowUpRight className="size-3.5 shrink-0 opacity-50" />
                                    ) : null}
                                  </span>
                                  {/* Une seule ligne, coupée aux points de
                                      suspension : c'est leur `u-text-clamp-1`,
                                      et ce n'est pas cosmétique. Deux entrées
                                      dont l'une déborde sur deux lignes
                                      décalent toute la colonne voisine, et la
                                      grille perd son peigne. */}
                                  {entree.texte ? (
                                    <span className="line-clamp-1 text-sm text-muted-foreground">
                                      {entree.texte}
                                    </span>
                                  ) : null}

                                  {/* La signature, sous la description.

                                      C'est celle des cartes de l'accueil, en
                                      plus petit et sans son fond : dans une
                                      carte, la pastille grise tient ensemble un
                                      rond et trois mots qui flotteraient
                                      autrement ; ici, la ligne est déjà tenue
                                      par la tuile à sa gauche, et un second
                                      fond gris à l'intérieur d'une entrée
                                      survolable ferait un bouton dans un
                                      bouton.

                                      Le portrait est celui de `site.ts`, servi
                                      par nous. `alt` vide et assumé : le nom de
                                      Rémy est dans le texte juste à côté. */}
                                  {entree.mention ? (
                                    <span className="mt-1 flex items-center gap-1.5">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src="/remy.webp"
                                        alt=""
                                        width={160}
                                        height={160}
                                        loading="lazy"
                                        className="size-4 rounded-full object-cover"
                                      />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        {entree.mention}
                                      </span>
                                    </span>
                                  ) : null}
                                </span>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}

                      {/* Les réseaux, en pied de la seule liste des
                          ressources : ce sont des lieux où l'on suit Rémy, pas
                          des programmes. Ils tiennent les deux colonnes, une
                          rangée de pictogrammes n'ayant pas à se plier au
                          peigne des entrées. */}
                      {menu.libelle === "Ressources" ? (
                        <li className="col-span-2 mt-1 border-t border-border px-2.5 pt-3">
                          <Reseaux />
                        </li>
                      ) : null}
                    </ul>
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
          </div>
        </NavigationMenu>

        {/* La capsule de droite. */}
        <div className={capsule}>
          {/* Le retour au parent, quand la page en a un.

              Le libellé ne s'affiche qu'à partir de `sm` : sur 375 px, la
              capsule porte déjà la bascule de thème et le menu, et « Tous les
              résultats » l'aurait fait déborder. En dessous, l'icône est seule,
              et c'est `aria-label` qui la nomme, comme le veut la règle du
              projet pour toute icône sans texte.

              Le filet qui suit sépare le retour du reste : ce n'est pas une
              action du site, c'est une action sur la navigation. */}
          {retour ? (
            <>
              <Link
                href={retour.href}
                aria-label={retour.libelle}
                className={cn(
                  "group/roule inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 sm:px-3",
                  surImage
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <ArrowLeft aria-hidden className="size-4 shrink-0" />
                <span className="hidden sm:inline">
                  <TexteRoulant>{retour.libelle}</TexteRoulant>
                </span>
              </Link>

              <span
                aria-hidden
                className={cn(
                  "h-5 w-px transition-colors duration-300",
                  surImage ? "bg-white/15" : "bg-border",
                )}
              />
            </>
          ) : null}

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
