import Script from "next/script";

/**
 * Le SDK de ClickFunnels, qui compte la visite dans l'étape du tunnel.
 *
 * **Seulement en production.** Le jeton de page (`cf-page-token`) est lié au
 * domaine déclaré chez ClickFunnels : servi depuis `localhost`, le SDK
 * répond 403 et Next affiche « [CF SDK] Init failed » par-dessus la page.
 * Une visite de développement n'a de toute façon rien à compter.
 *
 * `afterInteractive`, comme GTM : rien ne doit retarder le rendu.
 */
export function SdkClickFunnels() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <Script
      src="https://sdk.myclickfunnels.com/sdk.js"
      strategy="afterInteractive"
    />
  );
}
