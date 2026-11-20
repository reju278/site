/**
 * Le contact qu'un lien d'e-mail ClickFunnels porte vers une page du site :
 * `go.funnels.club/appel?prenom={{contact.first_name | url_encode}}&email={{contact.email_address | url_encode}}`,
 * et l'espace et la réservation de la Formation Genesis, qui reçoivent aussi
 * le nom et le téléphone (`nom={{contact.last_name | url_encode}}`,
 * `telephone={{contact.phone_number | url_encode}}`).
 *
 * **Ce sont des données personnelles dans une adresse, et le site charge
 * GTM** : même précaution que `reservation-capture.ts`. Le script les relève
 * pendant la lecture du HTML, avant l'hydratation donc avant GTM, et les
 * retire de l'adresse. `el` et les `utm_*` restent pour Hyros et pour la
 * réservation.
 *
 * **L'e-mail reste dans l'adresse de l'espace Genesis**, sur décision de
 * Rémy : c'est par lui qu'Hyros reconnaît la personne, comme sur les pages
 * vidéo envoyées par e-mail (`BoutonAppelRelaye`). `/appel` le retire.
 *
 * **Ils sont rangés là où l'opt-in de `/course` range les siens**, avec une
 * date, pour que tout ce qui lit déjà ce contact en profite sans changer :
 * c'est ce qui ouvre la réservation préremplie, même sur un autre appareil
 * que celui de l'inscription. Le lien remplace le contact précédent, c'est la
 * donnée la plus récente et un navigateur peut être partagé ; **sauf s'il
 * porte le même e-mail**, auquel cas ce que le contact savait déjà (le
 * téléphone de l'opt-in Genesis) est gardé.
 *
 * **Ce fichier n'importe pas React**, comme `reservation-capture.ts` : la page,
 * rendue par le serveur, en lit le script.
 */

import { CLE_CONTACT_VSL } from "@/contenu/vsl";

/**
 * Le relevé, exécuté **dans le HTML** et non par React. Il est recopié par
 * `toString()`, donc il ne lit rien hors de ses arguments, de `location`, de
 * `history` et de `localStorage`. `garder` liste les paramètres relevés qui
 * restent dans l'adresse.
 */
function capturer(cle: string, garder: string[]) {
  try {
    const adresse = new URL(location.href);
    const champs = ["prenom", "nom", "email", "telephone"];
    if (!champs.some((champ) => adresse.searchParams.has(champ))) return;

    const lue = (nom: string, longueur: number) => {
      const valeur = (adresse.searchParams.get(nom) || "").trim();
      /* `{{` : une variable que ClickFunnels n'a pas remplacée, dans un
         aperçu par exemple. Ce n'est le prénom de personne. */
      return valeur.indexOf("{{") < 0 && valeur.length <= longueur ? valeur : "";
    };

    const prenom = lue("prenom", 60);
    const nom = lue("nom", 60);
    /* Un `+` non encodé arrive en espace, et une adresse n'en contient
       jamais : `jean+pro@gmail.com` retrouve le sien. */
    const email = lue("email", 200).replace(/ /g, "+");
    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    /* Le téléphone, au format international que Calendly attend dans sa
       question de téléphone (`+33612345678`), comme celui de l'opt-in. Le `+`
       de l'indicatif arrive en espace s'il n'est pas encodé : il est rendu.
       Un numéro français écrit à la française (0 et neuf chiffres) prend
       +33 ; tout autre numéro sans indicatif est ignoré, la personne le
       tapera. */
    const brut = adresse.searchParams.get("telephone") || "";
    let telephone =
      brut.indexOf("{{") < 0
        ? brut.replace(/^\s/, "+").replace(/[\s.\-()]/g, "")
        : "";
    if (telephone.indexOf("00") === 0) telephone = "+" + telephone.slice(2);
    if (/^0\d{9}$/.test(telephone)) telephone = "+33" + telephone.slice(1);
    if (!/^\+\d{8,15}$/.test(telephone)) telephone = "";

    if (prenom || nom || emailValide || telephone) {
      try {
        let ancien: Record<string, unknown> | null = null;
        try {
          ancien = JSON.parse(localStorage.getItem(cle) || "null");
        } catch {
          ancien = null;
        }
        const meme =
          emailValide &&
          ancien !== null &&
          typeof ancien.email === "string" &&
          ancien.email.toLowerCase() === email.toLowerCase();
        const contact: Record<string, unknown> = meme ? { ...ancien } : {};
        contact.t = Date.now();
        if (prenom) contact.prenom = prenom;
        if (nom) contact.nom = nom;
        if (emailValide) contact.email = email;
        if (telephone) contact.telephone = telephone;
        localStorage.setItem(cle, JSON.stringify(contact));
      } catch {
        /* Stockage bloqué : la personne remplira le formulaire elle-même. */
      }
    }

    let retire = false;
    for (const champ of champs) {
      if (garder.indexOf(champ) < 0 && adresse.searchParams.has(champ)) {
        adresse.searchParams.delete(champ);
        retire = true;
      }
    }
    if (retire)
      history.replaceState(
        history.state,
        "",
        adresse.pathname + adresse.search + adresse.hash,
      );
  } catch {
    /* Un navigateur trop ancien pour `URL` : le formulaire reste vide. */
  }
}

/** Le script à poser en tête de `/appel` : tout ce qu'il relève sort de l'adresse. */
export const scriptContactLien = `(${capturer.toString()})(${JSON.stringify(CLE_CONTACT_VSL)},[]);`;

/**
 * Le script à poser en tête de l'espace et de la réservation Genesis : le
 * prénom, le nom et le téléphone sortent de l'adresse, l'e-mail y reste pour
 * Hyros. Sur la réservation, il doit précéder le formulaire Calendly, dont
 * l'adresse se construit pendant la lecture du HTML.
 */
export const scriptContactEspace = `(${capturer.toString()})(${JSON.stringify(CLE_CONTACT_VSL)},["email"]);`;
