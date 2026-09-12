/**
 * La hauteur occupée par l'en-tête flottant, décalage du haut compris.
 *
 * Elle sert à trois choses qui doivent rester d'accord : la zone que l'on
 * observe pour savoir si une bande sombre passe dessous, le `scroll-mt` des
 * ancres, pour qu'une cible ne finisse pas cachée derrière les capsules, et le
 * calage des éléments collants, qui doivent s'arrêter sous lui et non dessous.
 *
 * **Elle vit ici et non dans `en-tete.tsx`, et c'est la réparation d'une panne
 * silencieuse.** Ce fichier-là porte `"use client"`. Or, quand un composant
 * serveur importe quoi que ce soit d'un module client, Next ne lui donne pas la
 * valeur : il lui donne une **référence client**, une fonction qui désigne
 * l'export à travers la frontière. Le nombre 66 arrivait donc dans le composant
 * serveur sous la forme d'une fonction, et `top: fonction + 16` rendait
 * `style="top:function() {…}"`, que le navigateur jette.
 *
 * Rien n'échouait : pas d'erreur de type, pas d'avertissement au build, pas de
 * message dans la console. Simplement, l'élément collant n'avait plus de
 * décalage, donc il ne collait jamais, et l'effet ne se produisait pas. C'est
 * exactement le genre de défaut qu'on cherche pendant des heures dans le CSS.
 *
 * **La règle qui en sort : une valeur partagée entre le serveur et le client
 * n'habite jamais dans un module `"use client"`.** Elle habite dans un module
 * neutre, que les deux importent.
 */
export const HAUTEUR_ENTETE = 66;
