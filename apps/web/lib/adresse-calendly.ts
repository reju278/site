/* Aucun import, et c'est la règle de ce fichier : voir plus bas. */

/**
 * L'adresse du formulaire, avec les balises de campagne de la page.
 *
 * **Elle se construit avant React, dans un script posé juste après l'iframe**,
 * et c'est tout le gain de vitesse : l'iframe part pendant la lecture du HTML,
 * sans attendre que la page s'hydrate ni que le `widget.js` de Calendly se
 * télécharge. Mesuré en local, elle partait à 205 ms ; sur un téléphone,
 * l'hydratation coûte une à deux secondes de plus.
 *
 * **La fonction est donc recopiée telle quelle dans ce script**, par
 * `toString()` : elle ne doit rien importer ni rien lire hors de ses arguments,
 * de `location` et de `localStorage`. Elle vit dans ce module neutre parce que
 * `RelaisCalendly`, côté client, l'appelle aussi : voir `FormulaireCalendly`.
 *
 * Les balises `utm_*` de la page sont transmises pour que la réservation soit
 * attribuée à la bonne source, comme le faisait `widget.js`. `embed_domain` et
 * `embed_type` sont ceux qu'il posait aussi.
 *
 * **Les options passent en second argument, en JSON**, pour la même raison :
 * le script ne connaît que ce qu'on lui écrit. `telephone` est la question de
 * l'événement qui reçoit le numéro (`a1` pour « Téléphone / WhatsApp » de la
 * Formation Genesis) ; `reponsesVsl` reverse les réponses du questionnaire de
 * `/video-vsl` dans les questions de son événement à lui, et doit rester
 * faux ailleurs : sur un autre événement, `a5` n'est pas la même question.
 */
export function adresseCalendly(
  base: string,
  options: { telephone: string | null; reponsesVsl: boolean },
): string {
  const adresse = new URL(base);
  adresse.searchParams.set("embed_domain", location.host);
  adresse.searchParams.set("embed_type", "Inline");
  adresse.searchParams.set("hide_gdpr_banner", "1");

  new URLSearchParams(location.search).forEach((valeur, cle) => {
    if (cle.indexOf("utm_") === 0) adresse.searchParams.set(cle, valeur);
  });

  /* Le contact laissé par un opt-in, pour que Calendly s'ouvre déjà rempli :
     le prénom et l'e-mail de `/course`, et en plus le nom et le téléphone de
     la Formation Genesis. Gardés dans le navigateur, jamais dans l'adresse de
     la page. Littéral recopié de `CLE_CONTACT_VSL` : la fonction ne doit rien
     importer. `name` sert aux événements à un seul champ de nom,
     `first_name` et `last_name` à ceux qui en ont deux ; poser les trois ne
     gêne aucun des deux. */
  try {
    const contact = JSON.parse(localStorage.getItem("vsl-contact") || "null");
    /* Sept jours, recopié de `DUREE_CONTACT_VSL`. */
    const frais =
      contact && Date.now() - (contact.t || 0) < 7 * 24 * 60 * 60 * 1000;
    if (frais && typeof contact.email === "string") {
      adresse.searchParams.set("email", contact.email);
      const prenom = typeof contact.prenom === "string" ? contact.prenom : "";
      const nom = typeof contact.nom === "string" ? contact.nom : "";
      if (prenom || nom)
        adresse.searchParams.set("name", (prenom + " " + nom).trim());
      if (prenom) adresse.searchParams.set("first_name", prenom);
      if (nom) adresse.searchParams.set("last_name", nom);
      /* Le numéro est gardé au format international, `+33…`, celui que
         Calendly attend dans une question de type téléphone. */
      if (options.telephone && typeof contact.telephone === "string")
        adresse.searchParams.set(options.telephone, contact.telephone);
    }
    /* Les réponses au questionnaire de `/video-vsl`, aux questions de
       Calendly qu'elles reprennent mot pour mot. Les numéros sont ceux de
       `questionnaireVsl`, recopiés : la fonction ne doit rien importer. */
    const reponses = JSON.parse(localStorage.getItem("vsl-reponses") || "null");
    if (
      options.reponsesVsl &&
      frais &&
      reponses &&
      Date.now() - (reponses.t || 0) < 7 * 24 * 60 * 60 * 1000
    ) {
      if (typeof reponses.activite === "string")
        adresse.searchParams.set("a2", reponses.activite);
      if (typeof reponses.objectif === "string")
        adresse.searchParams.set("a3", reponses.objectif);
      if (typeof reponses.prix === "string")
        adresse.searchParams.set("a5", reponses.prix);
    }
  } catch (e) {
    /* Stockage bloqué : le formulaire reste vide. */
  }

  return adresse.toString();
}

