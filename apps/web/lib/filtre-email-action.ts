"use server";

import { EMAIL } from "@/lib/clickfunnels";
import { domaineRecoit, type Reception } from "@/lib/filtre-email-serveur";

/**
 * La question que la page pose au serveur à l'étape de l'e-mail, **pour un
 * domaine qui n'est pas un grand fournisseur seulement** (`verifierDomaine`
 * de `examinerEmail`) : reçoit-il des e-mails ? La page attend au plus une
 * seconde et demie, puis laisse passer. Seul « non » fait refuser.
 */
export async function verifierDomaineEmail(adresse: string): Promise<Reception> {
  const propre = adresse.trim().slice(0, 254);
  if (!EMAIL.test(propre)) return "inconnu";
  return domaineRecoit(propre);
}
