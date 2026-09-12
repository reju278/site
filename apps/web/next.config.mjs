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
  async redirects() {
    return [
      {
        source: "/confidentialite",
        destination: "/confidentialites",
        permanent: true,
      },
    ];
  },
};
