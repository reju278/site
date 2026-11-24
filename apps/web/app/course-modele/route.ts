import {
  CHEMINS_COURSE_MODELE,
  COOKIE_VERSION_OPTIN,
} from "@/contenu/course-modele";
import { NextResponse, type NextRequest } from "next/server";

/**
 * **L'adresse du test A/B de l'opt-in**, `go.funnels.club/course-modele`, sur
 * demande de Rémy le 24 novembre 2026 : elle envoie la moitié des visiteurs
 * sur la version A (`/course-modele/o5dfv`), l'autre sur la version B
 * (`/course-modele/zvb5y`). C'est elle que portent les publicités et les
 * liens : les deux versions ne s'annoncent nulle part.
 *
 * - **Un visiteur garde sa version** (cookie de trente jours) : il revoit la
 *   même page s'il revient, et un test ne vaut que s'il ne passe pas de l'une
 *   à l'autre.
 * - **L'adresse garde ses paramètres** (`utm_*`, `fbclid`, ceux de Hyros) :
 *   la version les reçoit tels quels, et les mesures n'y perdent rien.
 * - **Rien n'est mis en cache** : chaque visite tire son sort. Une
 *   redirection temporaire (307), jamais permanente.
 *
 * Le CRM compte les visites et les inscriptions de chaque version (étapes
 * `optin-a` et `optin-b` du tunnel, en plus de `optin`).
 */
export function GET(request: NextRequest) {
  const gardee = request.cookies.get(COOKIE_VERSION_OPTIN)?.value;
  const version =
    gardee === "a" || gardee === "b" ? gardee : Math.random() < 0.5 ? "a" : "b";
  const cible = request.nextUrl.clone();
  cible.pathname =
    version === "a" ? CHEMINS_COURSE_MODELE.optinA : CHEMINS_COURSE_MODELE.optinB;
  const reponse = NextResponse.redirect(cible, 307);
  reponse.headers.set("Cache-Control", "no-store");
  if (gardee !== version) {
    reponse.cookies.set(COOKIE_VERSION_OPTIN, version, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }
  return reponse;
}
