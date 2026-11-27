/**
 * **Le filtre des faux e-mails des opt-ins**, sur demande de Rémy le 27
 * novembre 2026 : Formation Genesis et Course modèle (Direct Webinar (N)).
 * Des adresses bidon faussaient les chiffres, encombraient la base et
 * abîmaient la délivrabilité (un e-mail envoyé à une adresse morte revient,
 * et chaque retour pèse sur la réputation de l'expéditeur).
 *
 * **La règle qui passe avant tout : on ne refuse que ce qui est faux à coup
 * sûr. Dans le doute, l'adresse passe.** Une vraie personne refusée est le
 * pire résultat possible, pire qu'un faux de plus dans la base.
 *
 * - **Une faute de frappe** sur un grand fournisseur (`gmial.com`,
 *   `hotmail.con`, `gmail.fr`) : on **propose** la correction, on ne refuse
 *   jamais. La personne peut garder son adresse d'un clic.
 * - **Une adresse jetable** (yopmail, mailinator…) : refusée. Ce sont des
 *   boîtes publiques, que n'importe qui lit, créées pour ne rien recevoir.
 *   Les services qui **transfèrent** vers une vraie boîte (Apple « Masquer
 *   mon adresse », Firefox Relay, SimpleLogin) ne sont **pas** jetables et
 *   passent.
 * - **Un domaine d'exemple** (`example.com`, `test.fr`) ou réservé
 *   (`.test`, `.invalid`, `.example`, `.localhost`) : refusé.
 * - **Une adresse d'essai sur un grand fournisseur** (`test@gmail.com`,
 *   `azerty@hotmail.fr`, `aaaaaa@gmail.com`) : refusée. Gmail n'accepte même
 *   pas d'identifiant de moins de six caractères. Seulement sur les grands
 *   fournisseurs : `test@monentreprise.fr` peut être une vraie boîte.
 * - **Un domaine qui ne reçoit pas d'e-mails** : vérifié par le serveur
 *   (`filtre-email-serveur.ts`), seulement pour un domaine qui n'est pas un
 *   grand fournisseur.
 *
 * Ce fichier n'importe rien et ne lit que ses arguments : le navigateur
 * (vérification instantanée, sans attendre le réseau) et le serveur (les
 * mêmes règles, pour qui contournerait la page) lisent les mêmes listes.
 *
 * **L'interrupteur** : `NEXT_PUBLIC_FILTRE_EMAIL=off` sur Vercel, puis
 * redéployer, coupe tout le filtre d'un coup (règles, domaine, piège à
 * robots). Sans la variable, le filtre est actif.
 */

export const FILTRE_EMAIL_ACTIF = process.env.NEXT_PUBLIC_FILTRE_EMAIL !== "off";

/**
 * Les grands fournisseurs, dans l'ordre où l'on préfère les proposer (le
 * `.fr` avant le `.com` pour les familles qui ont les deux). Leurs domaines
 * reçoivent des e-mails, on ne les vérifie pas, et ce sont les seules cibles
 * d'une correction.
 */
const FOURNISSEURS = [
  "gmail.com",
  "googlemail.com",
  "hotmail.fr",
  "hotmail.com",
  "hotmail.be",
  "hotmail.ca",
  "outlook.fr",
  "outlook.com",
  "outlook.be",
  "live.fr",
  "live.com",
  "live.be",
  "live.ca",
  "msn.com",
  "yahoo.fr",
  "yahoo.com",
  "yahoo.be",
  "yahoo.ca",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "neuf.fr",
  "bbox.fr",
  "laposte.net",
  "aol.com",
  "aol.fr",
  "gmx.fr",
  "gmx.com",
  "protonmail.com",
  "protonmail.ch",
  "proton.me",
  "pm.me",
  "mail.com",
  "email.com",
  "skynet.be",
  "bluewin.ch",
  "videotron.ca",
  // Les services qui masquent l'adresse et transfèrent vers une vraie boîte :
  // des adresses réelles, jamais corrigées.
  "privaterelay.appleid.com",
  "mozmail.com",
  "simplelogin.com",
  "aleeas.com",
  "passmail.net",
  "duck.com",
  "anonaddy.me",
  "addy.io",
] as const;

const EST_FOURNISSEUR = new Set<string>(FOURNISSEURS);

/**
 * Les familles qui n'ont qu'un domaine : une faute sur leur nom se corrige
 * vers lui, quelle que soit l'extension tapée (`gmail.fr` → `gmail.com`).
 * Les autres (hotmail, outlook, yahoo, live) existent dans plusieurs pays :
 * on garde l'extension tapée.
 */
const DOMAINE_UNIQUE: Record<string, string> = {
  gmail: "gmail.com",
  googlemail: "googlemail.com",
  icloud: "icloud.com",
  // `laposte.fr` n'a pas de boîtes : celles de La Poste sont en `.net`.
  laposte: "laposte.net",
  // Pas wanadoo (`wanadoo.es` a existé) ni protonmail (`protonmail.ch` est
  // aussi le sien) : on y garde l'extension tapée.
};

/**
 * Les noms qu'une faute de frappe vise vraiment, avec l'écart toléré. Pas
 * les noms courts (free, sfr, live, msn), ni ceux qui sont des mots
 * (orange : `grange.fr` est un vrai domaine) : une correction proposée à
 * tort coûte un clic à une vraie personne.
 */
const NOMS_CORRIGES: Record<string, number> = {
  // Une lettre d'écart (une inversion compte pour une) : à deux, `mozmail`
  // (Firefox Relay, une vraie boîte) devenait `hotmail`.
  gmail: 1,
  googlemail: 2,
  hotmail: 1,
  outlook: 1,
  yahoo: 1,
  icloud: 1,
  wanadoo: 1,
  laposte: 1,
  protonmail: 2,
};

/** Les extensions mal tapées qui n'existent pas, et la bonne. */
const EXTENSIONS_FAUTIVES: Record<string, string> = {
  con: "com",
  cmo: "com",
  cpm: "com",
  vom: "com",
  xom: "com",
  comm: "com",
  coom: "com",
  ocm: "com",
  clm: "com",
  frr: "fr",
  fe: "fr",
  ft: "fr",
  rf: "fr",
  ff: "fr",
  nett: "net",
  ner: "net",
  ogr: "org",
  orgg: "org",
};

/**
 * Les boîtes jetables les plus courantes, celles de yopmail comprises (ses
 * domaines de rechange : `cool.fr.nf`, `jetable.fr.nf`…). Une liste courte
 * et sûre plutôt qu'une liste de milliers de domaines : chacun ici est une
 * boîte publique, jamais l'adresse de quelqu'un.
 */
const JETABLES = new Set([
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "cool.fr.nf",
  "jetable.fr.nf",
  "courriel.fr.nf",
  "moncourrier.fr.nf",
  "monemail.fr.nf",
  "monmail.fr.nf",
  "nospam.ze.tc",
  "nomail.xl.cx",
  "mega.zik.dj",
  "speed.1s.fr",
  "mailinator.com",
  "mailinator.net",
  "mailinator2.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "pokemail.net",
  "spam4.me",
  "10minutemail.com",
  "10minutemail.net",
  "20minutemail.com",
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.net",
  "tempmailo.com",
  "tempail.com",
  "tempr.email",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.net",
  "trashmail.de",
  "trash-mail.com",
  "mytrashmail.com",
  "getnada.com",
  "maildrop.cc",
  "mailnesia.com",
  "mohmal.com",
  "dispostable.com",
  "fakeinbox.com",
  "mailcatch.com",
  "emailondeck.com",
  "mintemail.com",
  "jetable.org",
  "jetable.net",
  "jetable.com",
  "mail-temporaire.fr",
  "mail-temporaire.com",
  "ephemail.net",
  "discard.email",
  "discardmail.com",
  "mailpoof.com",
  "inboxkitten.com",
  "harakirimail.com",
  "yepmail.net",
  "crazymailing.com",
  "emailfake.com",
  "fakemail.net",
  "tmail.ws",
  "tmpmail.org",
  "tmpmail.net",
  "byom.de",
  "spambog.com",
  "spamfree24.org",
  "mailforspam.com",
]);

/** Les domaines d'exemple, et les extensions réservées à l'essai. */
const EXEMPLES = new Set([
  "example.com",
  "example.org",
  "example.net",
  "example.fr",
  "exemple.com",
  "exemple.fr",
  "exemple.org",
  "test.com",
  "test.fr",
  "test.net",
  "test.org",
  "domain.com",
  "domaine.com",
  "domaine.fr",
]);
const EXTENSIONS_RESERVEES = new Set(["test", "invalid", "example", "localhost", "local"]);

/**
 * Les identifiants d'essai : refusés **sur les grands fournisseurs
 * seulement**. Les lignes du clavier (`azerty…`, `qwerty…`, `qsdfgh…`), une
 * même lettre répétée (`aaaaaa`), et une courte liste de mots.
 */
const IDENTIFIANTS_ESSAI = new Set([
  "test",
  "tests",
  "testtest",
  "essai",
  "toto",
  "tata",
  "titi",
  "abc",
  "abcd",
  "abcdef",
  "abc123",
  "123",
  "1234",
  "12345",
  "123456",
  "nom",
  "prenom",
  "email",
  "mail",
  "monmail",
  "monemail",
  "exemple",
  "example",
  "fake",
  "faux",
  "noreply",
  "no-reply",
  "nepasrepondre",
  "spam",
  "xxx",
  "aze",
  "azer",
  "qsd",
  "wxc",
  "asd",
]);
const CLAVIER = /^(azerty|qwerty|qsdfgh|asdfgh|wxcvbn|zxcvbn)/;
const LETTRE_REPETEE = /^(.)\1+$/;

/** Ce que le filtre dit d'une adresse, sans le réseau. */
export type Verdict =
  | { etat: "ok"; verifierDomaine: boolean }
  | { etat: "refus"; motif: "jetable" | "exemple" | "essai" }
  | { etat: "suggestion"; adresse: string };

export type MotifRefus = "jetable" | "exemple" | "essai" | "domaine" | "robot";

/**
 * La distance entre deux mots, transpositions comprises (`gmial` et `gmail`
 * sont à une lettre l'un de l'autre).
 */
function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i]![j] = Math.min(
        d[i - 1]![j]! + 1,
        d[i]![j - 1]! + 1,
        d[i - 1]![j - 1]! + cout,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i]![j] = Math.min(d[i]![j]!, d[i - 2]![j - 2]! + 1);
      }
    }
  }
  return d[a.length]![b.length]!;
}

/** Le nom de domaine corrigé, ou `null` s'il n'y a rien à proposer. */
function domaineCorrige(domaine: string): string | null {
  if (EST_FOURNISSEUR.has(domaine)) return null;
  const morceaux = domaine.split(".");

  // `jean@gmail`, sans extension : le domaine d'un grand fournisseur.
  if (morceaux.length === 1) {
    const nom = morceaux[0]!;
    return (
      DOMAINE_UNIQUE[nom] ??
      FOURNISSEURS.find((f) => f.split(".")[0] === nom) ??
      null
    );
  }

  // Une extension qui n'existe pas : `.con`, `.frr`.
  const extension = morceaux.at(-1)!;
  const bonneExtension = EXTENSIONS_FAUTIVES[extension];
  if (bonneExtension) {
    const corrige = [...morceaux.slice(0, -1), bonneExtension].join(".");
    // Le nom peut être mal tapé lui aussi : `gmial.con`.
    return domaineCorrige(corrige) ?? corrige;
  }

  // Le nom d'un grand fournisseur mal tapé, sur un domaine à deux morceaux
  // seulement (`hotmail.co.uk` n'est pas une faute).
  if (morceaux.length !== 2) return null;
  const nom = morceaux[0]!;
  let meilleur: { nom: string; ecart: number } | null = null;
  for (const [cible, tolerance] of Object.entries(NOMS_CORRIGES)) {
    const ecart = distance(nom, cible);
    if (ecart > tolerance) continue;
    if (!meilleur || ecart < meilleur.ecart) meilleur = { nom: cible, ecart };
  }
  if (!meilleur) return null;
  const unique = DOMAINE_UNIQUE[meilleur.nom];
  if (unique) return unique === domaine ? null : unique;
  const avecExtension = `${meilleur.nom}.${extension}`;
  // `hotmial.it` → `hotmail.it`. Une famille sans ce pays dans la liste
  // garde quand même l'extension tapée : on corrige le nom, pas le pays.
  return avecExtension === domaine ? null : avecExtension;
}

/**
 * Le verdict d'une adresse, sans le réseau. L'adresse est supposée déjà
 * passée par la vérification de forme du formulaire (`EMAIL`).
 */
export function examinerEmail(brute: string): Verdict {
  if (!FILTRE_EMAIL_ACTIF) return { etat: "ok", verifierDomaine: false };
  const adresse = brute.trim();
  const arobase = adresse.lastIndexOf("@");
  if (arobase < 1) return { etat: "ok", verifierDomaine: false };
  const identifiant = adresse.slice(0, arobase).toLowerCase();
  const domaine = adresse.slice(arobase + 1).toLowerCase().replace(/\.$/, "");
  const extension = domaine.split(".").at(-1) ?? "";

  if (JETABLES.has(domaine)) return { etat: "refus", motif: "jetable" };
  if (EXEMPLES.has(domaine) || EXTENSIONS_RESERVEES.has(extension)) {
    return { etat: "refus", motif: "exemple" };
  }

  const corrige = domaineCorrige(domaine);
  if (corrige) {
    return { etat: "suggestion", adresse: `${adresse.slice(0, arobase)}@${corrige}` };
  }

  if (EST_FOURNISSEUR.has(domaine)) {
    // Ce qui suit un `+` est une étiquette, partout. Gmail ignore aussi les
    // points (`t.e.s.t@gmail.com` est `test@gmail.com`) ; ailleurs, un point
    // fait une autre boîte (`e.mail@hotmail.fr` n'est pas `email@`).
    const sansEtiquette = identifiant.split("+")[0]!;
    const nu = domaine === "gmail.com" || domaine === "googlemail.com"
      ? sansEtiquette.replace(/\./g, "")
      : sansEtiquette;
    if (
      IDENTIFIANTS_ESSAI.has(nu) ||
      CLAVIER.test(nu) ||
      (nu.length > 1 && LETTRE_REPETEE.test(nu))
    ) {
      return { etat: "refus", motif: "essai" };
    }
    return { etat: "ok", verifierDomaine: false };
  }

  return { etat: "ok", verifierDomaine: true };
}

/**
 * Le domaine d'une adresse et le début de son identifiant (`je…`), pour le
 * relevé des refus : de quoi juger un refus sans garder l'adresse entière.
 */
export function adresseMasquee(adresse: string) {
  const arobase = adresse.lastIndexOf("@");
  return {
    domaine: adresse.slice(arobase + 1).trim().toLowerCase().slice(0, 120),
    masque: `${adresse.slice(0, Math.min(2, Math.max(arobase, 0))).toLowerCase()}…`,
  };
}
