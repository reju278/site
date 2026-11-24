"use client";

import { cleNom, hoteConnu, nomPropre } from "@/components/rendez-vous";
import { confirmationCourseModele } from "@/contenu/course-modele";
import { equipeImmersion } from "@/contenu/immersion";
import { usePrenomVsl } from "@/lib/prenom-vsl";
import {
  dateLisible,
  heureLisible,
  jourLisible,
  useReservation,
} from "@/lib/reservation";
import { insecables } from "@/lib/typographie";

/**
 * **Le mot sous la vidéo de confirmation de Course modèle**, en texte
 * suivi, sur demande de Rémy : avec qui l'on a rendez-vous (sa photo, puis
 * son nom, le jour et l'heure surlignés en bleu), le message qu'il enverra sur
 * WhatsApp et par e-mail, et la réponse attendue (surlignés en vert), et
 * qu'il est une vraie personne. Pour finir, « cliquant ici » ouvre WhatsApp
 * vers lui (son numéro est dans `whatsappHotes`, Calendly ne le transmet
 * pas), le message de confirmation prêt. Il remplace, sur cette page
 * seulement, les consignes en cartes de `/thanks` (`ConsignesRendezVous`),
 * jugées trop chargées.
 *
 * Le closeur est l'hôte que Calendly transmet (`assigned_to`, relevé par
 * `useReservation`), sa photo celle de la rangée de l'équipe
 * (`equipeImmersion`) : un closeur ajouté à l'équipe a sa photo ici sans
 * rien de plus ; **son numéro, lui, s'ajoute à `whatsappHotes`**, sans quoi
 * la dernière phrase ne paraît pas. Pas de prénom de la personne à la fin
 * du texte, sur demande de Rémy (le message WhatsApp, lui, le porte).
 * Au rendu serveur, et sans réservation lue, la version sans nom.
 *
 * Les surlignages sont ceux des tirets de l'opt-in : un fond plein qui suit
 * la ligne (`box-decoration-clone`), sans rayon.
 */
export function RendezVousCloseur() {
  const r = useReservation();
  const textes = confirmationCourseModele.rendezVous;

  const membre = r?.hote
    ? equipeImmersion.membres.find((m) => cleNom(m.nom) === cleNom(r.hote!))
    : undefined;
  const nomHote = membre?.nom ?? (r?.hote ? nomPropre(r.hote) : undefined);
  const prenomHote = nomHote?.split(/\s+/)[0];
  const quand = dateLisible(r?.debut);
  const prenomOptin = usePrenomVsl();

  // Le lien « cliquant ici » : WhatsApp vers le closeur, le message prêt.
  const numero = hoteConnu(r?.hote)?.numero;
  const whatsapp = numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(
        textes.messageWhatsapp({
          hote: prenomHote,
          prenom: r?.prenom ?? (prenomOptin || undefined),
          jour: jourLisible(r?.debut),
          heure: heureLisible(r?.debut),
        }),
      )}`
    : null;

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-6 text-left text-[17px] leading-[1.6] text-[var(--genesis-encre)] sm:mt-8 sm:gap-5 sm:pt-8 sm:text-xl">
      {nomHote ? (
        <div className="flex items-center gap-3.5 sm:gap-4">
          {membre?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-rond
              src={membre.photo}
              alt=""
              width={112}
              height={112}
              className="size-12 shrink-0 rounded-full object-cover sm:size-14"
            />
          ) : null}
          <p className="text-pretty">
            {textes.avec}{" "}
            {/* Le nom aussi en bleu, comme la date, sur demande de Rémy. */}
            <span className="bg-[var(--genesis-surligne-bleu)] px-1 font-semibold box-decoration-clone">
              {nomHote}
            </span>
            {quand ? (
              <>
                {" "}
                {textes.le}{" "}
                <span className="bg-[var(--genesis-surligne-bleu)] px-1 font-semibold box-decoration-clone">
                  {insecables(quand)}
                </span>
              </>
            ) : null}
            .
          </p>
        </div>
      ) : null}

      <p className="text-pretty">
        {nomHote ? textes.message.avant : textes.sansHote}{" "}
        <span className="bg-[var(--genesis-surligne-vert)] px-1 font-semibold box-decoration-clone">
          {textes.message.whatsapp}
        </span>{" "}
        {textes.message.apres}{" "}
        <span className="bg-[var(--genesis-surligne-vert)] px-1 font-semibold box-decoration-clone">
          {textes.message.reponds}
        </span>{" "}
        {textes.message.valider}
      </p>

      <p className="text-pretty">
        {textes.personne.qui(prenomHote)}{" "}
        <strong>{textes.personne.vraie}</strong> {textes.personne.suite}.
      </p>

      {whatsapp ? (
        <p className="text-pretty">
          {textes.devants.avant}{" "}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--genesis-bleu)] underline underline-offset-[3px] hover:no-underline"
          >
            {textes.devants.lien}
          </a>{" "}
          {textes.devants.apres}
        </p>
      ) : null}
    </div>
  );
}
