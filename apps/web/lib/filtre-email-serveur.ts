/**
 * **Le domaine d'une adresse reçoit-il des e-mails ?** La partie du filtre
 * des faux e-mails (`filtre-email.ts`) qui demande le réseau : côté serveur
 * seulement, importée par des fichiers `"use server"`.
 *
 * Un domaine reçoit des e-mails s'il a un serveur de messagerie (MX), ou à
 * défaut une adresse (A ou AAAA, la règle d'Internet quand le MX manque).
 * **Il n'en reçoit pas, à coup sûr,** s'il n'existe pas, s'il n'a ni MX ni
 * adresse, ou s'il le déclare lui-même (le « MX nul » d'un domaine qui ne
 * prend aucun courrier).
 *
 * **Trois sources, et deux doivent dire « non » pour refuser** : le DNS du
 * serveur (`node:dns`), et le DNS de Google et de Cloudflare interrogés en
 * HTTPS (leur API JSON, « DNS over HTTPS »). Le DNS du serveur ne suffit pas
 * seul : il passe par des paquets UDP qu'un environnement peut bloquer
 * (relevé le 27 novembre 2026, le serveur de développement de l'aperçu les
 * perdait tous, quand l'HTTPS passait), et une erreur passagère d'une seule
 * source ne doit jamais refuser une vraie personne. Seul le domaine part,
 * jamais l'adresse.
 *
 * **Tout le reste laisse passer** : une panne, une lenteur, une réponse
 * étrange, deux sources qui se contredisent. Le tout tient en `DELAI_MS`.
 */

import { Resolver } from "node:dns/promises";
import {
  adresseMasquee,
  examinerEmail,
  FILTRE_EMAIL_ACTIF,
  type MotifRefus,
} from "@/lib/filtre-email";

export type Reception = "oui" | "non" | "inconnu";

/** Au-delà, on laisse passer : personne n'attend un DNS. */
const DELAI_MS = 1200;
/** Le plus long qu'une seule source peut prendre. */
const DELAI_SOURCE_MS = 900;

/** Les réponses gardées, le temps que vit le serveur : un domaine ne change
 *  pas d'avis d'une inscription à l'autre. */
const memoire = new Map<string, { reception: Reception; t: number }>();
const DUREE_MEMOIRE_MS = 6 * 60 * 60 * 1000;

const code = (erreur: unknown) =>
  typeof erreur === "object" && erreur && "code" in erreur
    ? String((erreur as { code: unknown }).code)
    : "";

/* ------------------------------------------------------------------ */
/* Le DNS du serveur                                                    */
/* ------------------------------------------------------------------ */

async function parLeServeur(domaine: string): Promise<Reception> {
  const r = new Resolver({ timeout: DELAI_SOURCE_MS, tries: 1 });
  try {
    const mx = await r.resolveMx(domaine);
    if (mx.length > 0) {
      // Le « MX nul » (RFC 7505) : le domaine dit qu'il ne prend aucun courrier.
      return mx.every((m) => m.exchange === "" || m.exchange === ".") ? "non" : "oui";
    }
  } catch (erreur) {
    const c = code(erreur);
    if (c === "ENOTFOUND") return "non"; // le domaine n'existe pas
    if (c !== "ENODATA") return "inconnu"; // panne, délai, refus
  }
  // Pas de MX : une adresse A ou AAAA suffit à recevoir.
  const essai = async (lire: () => Promise<string[]>): Promise<Reception> => {
    try {
      return (await lire()).length > 0 ? "oui" : "non";
    } catch (erreur) {
      const c = code(erreur);
      return c === "ENODATA" || c === "ENOTFOUND" ? "non" : "inconnu";
    }
  };
  const [v4, v6] = await Promise.all([
    essai(() => r.resolve4(domaine)),
    essai(() => r.resolve6(domaine)),
  ]);
  if (v4 === "oui" || v6 === "oui") return "oui";
  return v4 === "non" && v6 === "non" ? "non" : "inconnu";
}

/* ------------------------------------------------------------------ */
/* Le DNS en HTTPS (Google, Cloudflare)                                 */
/* ------------------------------------------------------------------ */

type ReponseJson = {
  /** 0 : réponse ; 3 : le domaine n'existe pas ; le reste : une panne. */
  Status?: number;
  Answer?: { type?: number; data?: string }[];
};

const SOURCES_HTTPS = {
  google: (domaine: string, type: string) =>
    `https://dns.google/resolve?name=${encodeURIComponent(domaine)}&type=${type}`,
  cloudflare: (domaine: string, type: string) =>
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domaine)}&type=${type}`,
};

async function parHttps(
  source: keyof typeof SOURCES_HTTPS,
  domaine: string,
): Promise<Reception> {
  const lire = async (type: "MX" | "A" | "AAAA", numero: number) => {
    const reponse = await fetch(SOURCES_HTTPS[source](domaine, type), {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(DELAI_SOURCE_MS),
      cache: "no-store",
    });
    if (!reponse.ok) return null;
    const json = (await reponse.json()) as ReponseJson;
    return {
      statut: json.Status,
      donnees: (json.Answer ?? [])
        .filter((a) => a.type === numero)
        .map((a) => (a.data ?? "").trim()),
    };
  };
  try {
    const mx = await lire("MX", 15);
    if (!mx) return "inconnu";
    if (mx.statut === 3) return "non";
    if (mx.statut !== 0) return "inconnu";
    if (mx.donnees.length > 0) {
      // « 0 . » : le MX nul.
      return mx.donnees.every((d) => /^\d+\s+\.?$/.test(d)) ? "non" : "oui";
    }
    const [a, aaaa] = await Promise.all([lire("A", 1), lire("AAAA", 28)]);
    if (!a || !aaaa || a.statut !== 0 || aaaa.statut !== 0) return "inconnu";
    return a.donnees.length > 0 || aaaa.donnees.length > 0 ? "oui" : "non";
  } catch {
    return "inconnu";
  }
}

/* ------------------------------------------------------------------ */
/* Le verdict                                                           */
/* ------------------------------------------------------------------ */

const sansJeter = (travail: Promise<Reception>) =>
  travail.catch((): Reception => "inconnu");

/**
 * Les trois sources en même temps, et la première conclusion l'emporte :
 * **un seul « oui » laisse passer aussitôt, il faut deux « non » pour
 * refuser**. Une source lente ne retient donc jamais un domaine qui reçoit
 * (un premier appel à Google a pris 2,8 s depuis le poste de Rémy).
 */
function verdict(domaine: string): Promise<Reception> {
  const sources = [
    sansJeter(parLeServeur(domaine)),
    sansJeter(parHttps("google", domaine)),
    sansJeter(parHttps("cloudflare", domaine)),
  ];
  return new Promise((fin) => {
    let non = 0;
    let restantes = sources.length;
    for (const source of sources) {
      void source.then((reponse) => {
        if (reponse === "oui") fin("oui");
        else if (reponse === "non" && ++non >= 2) fin("non");
        restantes -= 1;
        if (restantes === 0) fin("inconnu");
      });
    }
  });
}

/** Le verdict du domaine d'une adresse : seul « non » fait refuser. */
export async function domaineRecoit(adresseEmail: string): Promise<Reception> {
  if (!FILTRE_EMAIL_ACTIF) return "inconnu";
  const domaine = adresseEmail
    .slice(adresseEmail.lastIndexOf("@") + 1)
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
  if (!domaine || domaine.length > 253) return "inconnu";
  const gardee = memoire.get(domaine);
  if (gardee && Date.now() - gardee.t < DUREE_MEMOIRE_MS) return gardee.reception;

  const reception = await Promise.race([
    sansJeter(verdict(domaine)),
    new Promise<Reception>((fin) => setTimeout(() => fin("inconnu"), DELAI_MS)),
  ]);
  // Un « inconnu » ne se garde pas : la prochaine fois, on redemande.
  if (reception !== "inconnu") memoire.set(domaine, { reception, t: Date.now() });
  return reception;
}

/**
 * **Le filtre entier, côté serveur**, posé dans les inscriptions
 * (`inscrireGenesis`, `inscrireCourseModele`) avant tout appel à
 * ClickFunnels : les mêmes règles que la page, pour qui la contournerait.
 * Rend le motif du refus, ou `null` si l'adresse passe. Une correction
 * proposée et refusée par la personne passe : c'est son choix.
 *
 * Un refus ici ne devrait jamais arriver par la page, qui a déjà tout
 * vérifié : il s'écrit dans le journal de Vercel, sans l'adresse entière.
 */
export async function refusEmail(
  adresseEmail: string,
  tunnel: string,
): Promise<MotifRefus | null> {
  const verdict = examinerEmail(adresseEmail);
  let motif: MotifRefus | null = null;
  if (verdict.etat === "refus") motif = verdict.motif;
  else if (
    // Une adresse dont la correction a été refusée (`jean@monsite.con`)
    // passe encore par son domaine, comme tout domaine inconnu.
    (verdict.etat === "suggestion" ||
      (verdict.etat === "ok" && verdict.verifierDomaine)) &&
    (await domaineRecoit(adresseEmail)) === "non"
  ) {
    motif = "domaine";
  }
  if (motif) {
    const { domaine, masque } = adresseMasquee(adresseEmail);
    console.warn(`${tunnel} : adresse refusée par le filtre (${motif}, ${masque}@${domaine})`);
  }
  return motif;
}
