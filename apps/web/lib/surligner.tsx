import { insecables } from "@/lib/typographie";

/**
 * Le trait de surligneur, comme sur les articles d'avis.
 *
 * **Il enveloppe, il ne réécrit pas.** Chaque passage est une sous-chaîne exacte
 * du texte : la fonction la retrouve et pose un `mark` autour, sans toucher à un
 * seul caractère. Un passage qui ne se retrouverait pas laisse simplement le
 * texte intact, plutôt que d'en perdre un bout. C'est ce qui rend le surlignage
 * sûr sur la parole de vraies personnes : on ne peut pas mettre en avant une
 * phrase que quelqu'un n'a pas dite.
 *
 * `mark` et non un `span` : c'est l'élément du surlignage, et c'est lui qui dit
 * à un lecteur d'écran que ce passage est mis en avant.
 *
 * Le jaune est `--surlignage-jaune` à 32 %, la même teinte et la même densité
 * que les voies du message de Rémy. Ce n'est pas une couleur de plus : c'est
 * celle que le site emploie déjà pour « regardez ça ».
 *
 * L'animation, elle, vit dans `globals.css` : le fond est une image tirée de
 * gauche à droite quand le bloc entre dans la vue, et elle a besoin d'un ancêtre
 * `data-apparition`. **Sans cet ancêtre, le surlignage est simplement plein**,
 * ce qui est son état par défaut : c'est le cas dans le menu des tâches, qui
 * s'ouvre au clic et non au défilement.
 *
 * **Elle vit dans `lib` et non dans le mur.** Elle y est née, puis le menu des
 * tâches en a eu besoin : deux copies du même découpage auraient divergé à la
 * première correction, et celle-ci en a déjà connu une, le fond jaune par défaut
 * de `mark` qu'il a fallu éteindre.
 */
export function surligner(
  texte: string,
  passages: readonly string[],
  /**
   * La teinte du trait, quand celle par défaut ne convient pas au fond.
   *
   * **Elle existe pour que le surlignage ne disparaisse jamais**, seulement
   * qu'il change de couleur : le retirer ferait perdre au texte les douze
   * pixels de rembourrage du `mark`, donc décaler tout ce qui suit. C'est ce
   * que Rémy a vu en cochant une tâche.
   */
  fond = "color-mix(in srgb, var(--surlignage-jaune) 32%, transparent)",
) {
  /* On coupe sur chaque passage, dans l'ordre où il apparaît. `reduce` sur les
     morceaux et non une expression rationnelle : les passages portent des
     apostrophes, des accents et des chiffres, et les échapper un par un pour
     construire un motif serait une occasion de plus de se tromper. */
  let morceaux: (string | { marque: string })[] = [texte];

  for (const passage of passages) {
    morceaux = morceaux.flatMap((m) => {
      if (typeof m !== "string") return [m];
      const i = m.indexOf(passage);
      if (i === -1) return [m];
      return [m.slice(0, i), { marque: passage }, m.slice(i + passage.length)];
    });
  }

  return morceaux.map((m, i) =>
    typeof m === "string" ? (
      <span key={i}>{insecables(m)}</span>
    ) : (
      <mark
        key={i}
        className="surlignage"
        style={
          {
            "--surlignage-fond": fond,
          } as React.CSSProperties
        }
      >
        {insecables(m.marque)}
      </mark>
    ),
  );
}
