import { optinVsl } from "@/contenu/vsl";

/**
 * La preuve sous le bloc d'inscription de `/course` : trois portraits de
 * membres, les étoiles et la note Trustpilot de Funnels.Club.
 *
 * **Le remplissage des étoiles est calculé depuis la note**, comme pour celle
 * du livre : la rangée pleine est coupée à `note / 5` au-dessus d'une rangée
 * vide. Le dessin ne peut donc pas dire autre chose que le texte le jour où
 * la note change. Et la note est écrite en toutes lettres : c'est elle qui
 * porte l'information, les étoiles vertes ne tenant pas seules le contraste
 * d'un graphique sur la page claire.
 */
function Etoiles({ note }: { note: number }) {
  const rangee = (
    <span className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-6 fill-current">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
  return (
    <span aria-hidden className="relative inline-block">
      <span className="text-[var(--trustpilot)] opacity-25">{rangee}</span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-[var(--trustpilot)]"
        style={{ width: `${(note / 5) * 100}%` }}
      >
        {rangee}
      </span>
    </span>
  );
}

export function PreuveTrustpilot() {
  const { preuve } = optinVsl;
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Portraits décoratifs : `alt` vide, le texte dit ce qu'il y a à dire. */}
      <div className="flex">
        {preuve.portraits.map((portrait, rang) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={portrait}
            src={portrait}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className={`size-14 rounded-full border-[3px] border-background object-cover ${
              rang > 0 ? "-ml-3" : ""
            }`}
          />
        ))}
      </div>
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <Etoiles note={preuve.note} />
        <span className="text-lg font-semibold text-foreground sm:text-xl">
          {preuve.texte}
        </span>
      </p>
    </div>
  );
}
