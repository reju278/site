/** @type {import("next").NextConfig} */
export default {
  transpilePackages: ["@repo/ui"],

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
