"use client";

import {
  CLE_BIENVENUE_GENESIS,
  espaceGenesis,
} from "@/contenu/formation-genesis";
import { lireContactVsl } from "@/lib/prenom-vsl";
import { insecables } from "@/lib/typographie";
import { MailCheck, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const ID = "bienvenue-genesis";

/**
 * La notification de l'e-mail envoyé, à l'arrivée dans l'espace juste après
 * l'inscription, sur demande de Rémy : en bas, au milieu. Elle dit à quelle
 * adresse est parti l'e-mail, qu'il peut tomber dans les spams ou l'onglet
 * Promotions, et que c'est par lui qu'on retrouve la formation.
 *
 * **Une fois, et seulement à cette arrivée.** L'inscription pose une marque
 * dans `sessionStorage` avant d'ouvrir l'espace ; on l'efface au moment
 * d'afficher, pas avant : en développement, React monte l'effet deux fois, et
 * une marque effacée au premier montage ne laissait rien au second.
 *
 * **Elle reste jusqu'à ce qu'on la ferme**, comme la consigne vidéo de
 * `/preparation` : un message qui dit où retrouver la formation ne doit pas
 * filer pendant qu'on regarde la vidéo. Le dessin est celui du tunnel :
 * carte blanche à ombre détachée, angles droits, PT Serif hérité de la page.
 */
export function BienvenueGenesis() {
  useEffect(() => {
    const minuteur = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(CLE_BIENVENUE_GENESIS) !== "1") return;
        sessionStorage.removeItem(CLE_BIENVENUE_GENESIS);
      } catch {
        return;
      }
      const contact = lireContactVsl();
      const email = typeof contact?.email === "string" ? contact.email : "";
      toast.custom((id) => <Carte id={id} email={email} />, {
        id: ID,
        position: "bottom-center",
        duration: Infinity,
        /* La classe que vise `globals.css` pour élargir la pile de Sonner sur
           ordinateur, pour elle seule. */
        className: "bienvenue-genesis",
      });
      /* Le temps que la page se pose : arrivée avec le premier affichage, on
         ne la remarquerait pas. */
    }, 900);
    return () => window.clearTimeout(minuteur);
  }, []);

  return null;
}

function Carte({ id, email }: { id: string | number; email: string }) {
  const { bienvenue } = espaceGenesis;
  return (
    /* La police s'écrit ici : Sonner pose la sienne, sans empattement, sur
       sa pile, et la carte ne reçoit pas le PT Serif de la page. */
    <div className="flex w-full items-start gap-3 border border-black/10 bg-white p-4 font-[family-name:var(--font-genesis),Georgia,serif] text-[var(--genesis-encre)] shadow-[0_0_39px_-8px_rgba(0,0,0,0.3)] sm:gap-4 sm:px-5 sm:py-4">
      {/* L'encre et non le bleu du tunnel sur la tuile : le bleu n'y tient
          pas les 3:1 d'un signe. */}
      {/* Pas de tuile au téléphone : la colonne de texte y gagne 52 px, et
          le titre une ligne. */}
      <span
        aria-hidden
        className="hidden size-10 shrink-0 items-center justify-center bg-[var(--genesis-surligne)] sm:flex"
      >
        <MailCheck className="size-5" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        {/* Au téléphone, l'adresse passe sur sa ligne : collée au titre,
            elle laissait « envoyé à » seul sur la ligne d'avant. Le titre est
            équilibré sur ses deux lignes. `overflow-wrap: anywhere` : une
            adresse longue n'a pas d'espace où se couper. */}
        <p className="text-[15px] leading-snug font-bold text-balance sm:text-base">
          {insecables(email ? bienvenue.titre : bienvenue.titreSansAdresse)}
          {email ? (
            <>
              {" "}
              <span className="block [overflow-wrap:anywhere] sm:inline">
                {email}
              </span>
            </>
          ) : null}
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-pretty sm:text-[15px]">
          {insecables(bienvenue.texte)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        aria-label={bienvenue.fermer}
        className="-mt-2 -mr-2 flex size-10 shrink-0 items-center justify-center text-black/60 transition-colors hover:text-black"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
