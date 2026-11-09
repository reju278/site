/** @type {import("next").NextConfig} */
export default {
  transpilePackages: ["@repo/ui"],

  /* Le dossier de sortie se déplace par variable d'environnement.
   *
   * `next dev` et `next build` écrivent tous les deux dans `.next`. Lancer un
   * build de vérification pendant que le serveur de développement tourne lui
   * remplace ses morceaux sous les pieds : il se met à servir des fragments
   * périmés, les images et des bouts de page cassent, et **rien ne le signale**
   * puisque les deux commandes réussissent. C'est arrivé, et ça s'est cherché
   * longtemps ailleurs.
   *
   * `NEXT_DIST_DIR=.next-verif pnpm build` construit donc à côté, sans toucher
   * à ce que sert le serveur de Rémy. La valeur par défaut ne change rien pour
   * Vercel, qui ne pose pas cette variable.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /* Le serveur de développement ouvert depuis l'iPhone de Rémy, sur le même
   * réseau. Next 16 bloque par défaut les ressources de développement
   * demandées depuis une autre origine que `localhost` : la page s'affichait,
   * mais son JavaScript ne chargeait pas et aucun bouton ne répondait. Les
   * adresses privées des réseaux domestiques et du partage de connexion de
   * l'iPhone (`172.20.10.x`). Sans effet en production.
   */
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*", "10.*.*.*"],

  /* La politique de confidentialité vit à `/confidentialites`, au pluriel.
   *
   * Ce n'est pas une préférence de style : **c'est l'adresse que Rémy a déjà
   * posée dans ses tunnels**, et une adresse qu'on a distribuée ne se corrige
   * plus, elle se sert. Le singulier reste donc vivant, redirigé en 308, parce
   * que c'est lui que sert le site actuel et qu'il traîne forcément ailleurs.
   *
   * Une redirection permanente et non temporaire : la page a bougé pour de bon,
   * et c'est ce que `permanent: true` dit aux moteurs comme aux navigateurs.
   * Les deux adresses ne peuvent pas diverger, puisqu'il n'y a qu'une page.
   */
  /* Le quiz vit dans l'application du CRM (dépôt Funnels-Club) et s'ouvre sous
   * go.funnels.club/quizz : ce site relaie l'adresse et les fichiers de
   * l'application, rangés sous `/crm-zone` pour ne pas croiser ses `/_next`.
   * `ZONE_CRM` pointe vers le CRM local en développement.
   */
  async rewrites() {
    const zone = process.env.ZONE_CRM || "https://form.funnels.club";
    return [
      { source: "/quizz", destination: `${zone}/quizz` },
      { source: "/crm-zone/:chemin+", destination: `${zone}/crm-zone/:chemin+` },
    ];
  },

  /* Les affiches relayées depuis Wistia (`app/affiches`) : sans durée de vie
   * pour le navigateur, la réponse ISR (`s-maxage` seul) ne se gardait pas, et
   * chaque affiche était téléchargée deux fois par page, mesuré. Dix minutes,
   * comme la revalidation de la route.
   */
  async headers() {
    return [
      {
        source: "/affiches/:fichier",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=600, s-maxage=600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/confidentialite",
        destination: "/confidentialites",
        permanent: true,
      },
      /* La VSL du VSL Funnel a quitté `/video` pour `/video-vsl`, sur demande
         de Rémy : l'adresse dit de quel tunnel elle est. L'ancienne a été
         l'étape du tunnel ClickFunnels et a pu partir dans des e-mails ; la
         requête (prénom, e-mail pour Calendly) suit la redirection. */
      {
        source: "/video",
        destination: "/video-vsl",
        permanent: true,
      },
    ];
  },
};
