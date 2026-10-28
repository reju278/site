import { optinVsl } from "@/contenu/vsl";

/**
 * La preuve sous le bloc d'inscription de `/course` : trois portraits de
 * membres, cinq étoiles et la note des avis de Funnels.Club.
 *
 * **Les cinq étoiles sont pleines**, sur décision de Rémy, alors que la note
 * est de 4,7. C'est la note écrite à côté qui dit le chiffre exact ; les
 * étoiles ne sont qu'un signe. Elles sont dessinées d'un seul tenant, sans
 * rangée posée dessous : la première version en superposait deux, et la
 * rangée pâle dépassait de la pleine.
 */
const ETOILE =
  "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

function Etoiles() {
  return (
    <span aria-hidden className="flex gap-1 text-[var(--trustpilot)]">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-6 fill-current">
          <path d={ETOILE} />
        </svg>
      ))}
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
        <Etoiles />
        <span className="text-lg font-semibold text-foreground sm:text-xl">
          {preuve.texte}
        </span>
      </p>
    </div>
  );
}
