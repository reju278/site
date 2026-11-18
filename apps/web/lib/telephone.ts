/**
 * Le numéro de téléphone, tel qu'on le demande sur le site : un pays au
 * drapeau, puis le numéro comme on l'écrit chez soi. Partagé par la
 * réservation d'`/appel` et l'optin de la Formation Genesis, pour qu'une
 * correction de la liste ou de la règle vaille aux deux endroits.
 */

/**
 * Les pays du menu, la France en tête : les pays francophones d'abord, les
 * départements d'outre-mer, puis les voisins. Un numéro d'un pays absent se
 * tape avec son indicatif, `+…`, qui l'emporte sur le menu.
 */
export const PAYS = [
  { code: "FR", nom: "France", indicatif: "+33", drapeau: "🇫🇷", exemple: "06 12 34 56 78" },
  { code: "BE", nom: "Belgique", indicatif: "+32", drapeau: "🇧🇪", exemple: "0470 12 34 56" },
  { code: "CH", nom: "Suisse", indicatif: "+41", drapeau: "🇨🇭", exemple: "078 123 45 67" },
  { code: "LU", nom: "Luxembourg", indicatif: "+352", drapeau: "🇱🇺", exemple: "621 123 456" },
  { code: "MC", nom: "Monaco", indicatif: "+377", drapeau: "🇲🇨", exemple: "06 12 34 56 78" },
  { code: "CA", nom: "Canada", indicatif: "+1", drapeau: "🇨🇦", exemple: "514 123 4567" },
  { code: "RE", nom: "La Réunion", indicatif: "+262", drapeau: "🇷🇪", exemple: "0692 12 34 56" },
  { code: "GP", nom: "Guadeloupe", indicatif: "+590", drapeau: "🇬🇵", exemple: "0690 12 34 56" },
  { code: "MQ", nom: "Martinique", indicatif: "+596", drapeau: "🇲🇶", exemple: "0696 12 34 56" },
  { code: "GF", nom: "Guyane", indicatif: "+594", drapeau: "🇬🇫", exemple: "0694 12 34 56" },
  { code: "PF", nom: "Polynésie française", indicatif: "+689", drapeau: "🇵🇫", exemple: "87 12 34 56" },
  { code: "NC", nom: "Nouvelle-Calédonie", indicatif: "+687", drapeau: "🇳🇨", exemple: "75 12 34" },
  { code: "MU", nom: "Maurice", indicatif: "+230", drapeau: "🇲🇺", exemple: "5251 2345" },
  { code: "MA", nom: "Maroc", indicatif: "+212", drapeau: "🇲🇦", exemple: "0612 345678" },
  { code: "DZ", nom: "Algérie", indicatif: "+213", drapeau: "🇩🇿", exemple: "0551 23 45 67" },
  { code: "TN", nom: "Tunisie", indicatif: "+216", drapeau: "🇹🇳", exemple: "20 123 456" },
  { code: "SN", nom: "Sénégal", indicatif: "+221", drapeau: "🇸🇳", exemple: "70 123 45 67" },
  { code: "CI", nom: "Côte d'Ivoire", indicatif: "+225", drapeau: "🇨🇮", exemple: "01 23 45 67 89" },
  { code: "CM", nom: "Cameroun", indicatif: "+237", drapeau: "🇨🇲", exemple: "6 71 23 45 67" },
  { code: "MG", nom: "Madagascar", indicatif: "+261", drapeau: "🇲🇬", exemple: "032 12 345 67" },
  { code: "ES", nom: "Espagne", indicatif: "+34", drapeau: "🇪🇸", exemple: "612 34 56 78" },
  { code: "PT", nom: "Portugal", indicatif: "+351", drapeau: "🇵🇹", exemple: "912 345 678" },
  { code: "IT", nom: "Italie", indicatif: "+39", drapeau: "🇮🇹", exemple: "312 345 6789" },
  { code: "DE", nom: "Allemagne", indicatif: "+49", drapeau: "🇩🇪", exemple: "01512 3456789" },
  { code: "GB", nom: "Royaume-Uni", indicatif: "+44", drapeau: "🇬🇧", exemple: "07400 123456" },
  { code: "US", nom: "États-Unis", indicatif: "+1", drapeau: "🇺🇸", exemple: "201 555 0123" },
  { code: "AE", nom: "Émirats arabes unis", indicatif: "+971", drapeau: "🇦🇪", exemple: "050 123 4567" },
  { code: "IL", nom: "Israël", indicatif: "+972", drapeau: "🇮🇱", exemple: "050 123 4567" },
] as const;

/** Un numéro international complet : `+`, puis de 8 à 15 chiffres. */
export const NUMERO_INTERNATIONAL = /^\+\d{8,15}$/;

/**
 * Le numéro au format international que Calendly et ClickFunnels attendent,
 * ou `null`. Écrit comme on l'écrit chez soi : le 0 en tête tombe et
 * l'indicatif du pays choisi le remplace. Un numéro tapé avec son `+` ou son
 * `00` garde le sien. L'Italie garde son 0, qui fait partie du numéro chez
 * elle.
 */
export function numeroInternational(
  pays: string,
  saisie: string,
): string | null {
  let numero = saisie.replace(/[\s.\-()]/g, "");
  if (numero.startsWith("00")) numero = `+${numero.slice(2)}`;
  if (!numero.startsWith("+")) {
    const choisi = PAYS.find((p) => p.code === pays) ?? PAYS[0];
    if (choisi.code !== "IT") numero = numero.replace(/^0/, "");
    numero = `${choisi.indicatif}${numero}`;
  }
  return NUMERO_INTERNATIONAL.test(numero) ? numero : null;
}
