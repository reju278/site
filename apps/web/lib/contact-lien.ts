/**
 * Le prénom et l'e-mail qu'un lien d'e-mail ClickFunnels porte vers `/appel` :
 * `go.funnels.club/appel?prenom={{contact.first_name}}&email={{contact.email_address}}`.
 *
 * **Ce sont des données personnelles dans une adresse, et le site charge
 * GTM** : même précaution que `reservation-capture.ts`. Le script les relève
 * pendant la lecture du HTML, avant l'hydratation donc avant GTM, et les
 * retire de l'adresse. Seuls ces deux paramètres partent : `el` et les `utm_*`
 * restent pour Hyros et pour la réservation.
 *
 * **Ils sont rangés là où l'opt-in de `/course` range les siens**, avec une
 * date, pour que tout ce qui lit déjà ce contact en profite sans changer. Le
 * lien remplace le contact précédent : c'est la donnée la plus récente, et un
 * navigateur peut être partagé.
 *
 * **Ce fichier n'importe pas React**, comme `reservation-capture.ts` : la page,
 * rendue par le serveur, en lit `scriptContactLien`.
 */

import { CLE_CONTACT_VSL } from "@/contenu/vsl";

/**
 * Le relevé, exécuté **dans le HTML** et non par React. Il est recopié par
 * `toString()`, donc il ne lit rien hors de ses arguments, de `location`, de
 * `history` et de `localStorage`.
 */
function capturer(cle: string) {
  try {
    const adresse = new URL(location.href);
    const lue = (nom: string, longueur: number) => {
      const valeur = (adresse.searchParams.get(nom) || "").trim();
      /* `{{` : une variable que ClickFunnels n'a pas remplacée, dans un
         aperçu par exemple. Ce n'est le prénom de personne. */
      return valeur.indexOf("{{") < 0 && valeur.length <= longueur ? valeur : "";
    };

    const prenom = lue("prenom", 60);
    /* Un `+` non encodé arrive en espace, et une adresse n'en contient
       jamais : `jean+pro@gmail.com` retrouve le sien. */
    const email = lue("email", 200).replace(/ /g, "+");
    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!adresse.searchParams.has("prenom") && !adresse.searchParams.has("email"))
      return;

    if (prenom || emailValide) {
      try {
        const contact: { prenom?: string; email?: string; t: number } = {
          t: Date.now(),
        };
        if (prenom) contact.prenom = prenom;
        if (emailValide) contact.email = email;
        localStorage.setItem(cle, JSON.stringify(contact));
      } catch {
        /* Stockage bloqué : la personne remplira le formulaire elle-même. */
      }
    }

    adresse.searchParams.delete("prenom");
    adresse.searchParams.delete("email");
    history.replaceState(
      history.state,
      "",
      adresse.pathname + adresse.search + adresse.hash,
    );
  } catch {
    /* Un navigateur trop ancien pour `URL` : le formulaire reste vide. */
  }
}

/** Le script à poser en tête de `/appel`. */
export const scriptContactLien = `(${capturer.toString()})(${JSON.stringify(CLE_CONTACT_VSL)});`;
