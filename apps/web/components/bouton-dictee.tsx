"use client";

import { Mic } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Le bouton micro des zones de texte de `/appel`, sur demande de Rémy : on
 * parle, et ce qu'on dit s'écrit dans le champ, pendant qu'on le dit.
 *
 * **La reconnaissance est celle du navigateur**, l'API Web Speech : rien à
 * installer, aucun service à nous. Safari (iPhone, Mac) et Chrome (Android,
 * ordinateur) la portent ; Firefox non. Chrome envoie la voix à Google pour
 * la transcrire, Safari à Apple.
 *
 * **Le dessin est celui de `VoiceInput`** de 21st.dev, collé par Rémy : une
 * pastille qui s'allonge vers la gauche à l'écoute, un carré, des barres et
 * un minuteur. **Il n'est pas importé, il est repris ici**, parce que deux
 * choses y ont changé à sa demande : ses barres bougeaient au hasard, elles
 * lisent maintenant le niveau réel du micro (`AnalyserNode`), une bande de
 * fréquences de la voix par barre, à plat dans le silence ; et son carré
 * tournait, il reste fixe. Un code de registre ne se modifie pas ; celui-ci
 * est devenu le nôtre.
 *
 * **Le bouton ne s'affiche que s'il peut marcher** : navigateur qui porte
 * l'API, et page sécurisée (`https://` ou `localhost`), seule condition sous
 * laquelle le navigateur ouvre le micro. Il apparaît après le montage, le
 * serveur ne sachant rien du navigateur.
 *
 * Au premier appui, le navigateur demande l'autorisation d'utiliser le micro.
 * On ne peut pas l'éviter, et c'est voulu.
 */
export function BoutonDictee({
  valeur,
  changer,
  libelle,
}: {
  /** Le texte du champ, tel qu'il est. */
  valeur: string;
  /** Écrit le texte du champ : ce qui y était, puis ce qui se dit. */
  changer: (texte: string) => void;
  /** Le nom de la question, pour le libellé du bouton. */
  libelle: string;
}) {
  const [disponible, setDisponible] = useState(false);
  const [ecoute, setEcoute] = useState(false);
  const [secondes, setSecondes] = useState(0);

  const reconnaissance = useRef<Reconnaissance | null>(null);
  /* Vrai entre l'appui qui démarre et celui qui arrête : le navigateur coupe
     la reconnaissance après un silence, on la relance tant que la personne
     n'a pas appuyé sur stop. */
  const actif = useRef(false);
  /* Le texte du champ au début de la session d'écoute en cours : ce qui se
     dit s'écrit à sa suite, et le provisoire se réécrit par-dessus sans
     jamais toucher à ce qui était là. */
  const base = useRef("");
  const valeurRef = useRef(valeur);
  const changerRef = useRef(changer);

  /* Le niveau sonore : le flux du micro, son analyseur, la boucle qui le lit
     à chaque image et pose la hauteur des barres directement dans le DOM,
     sans passer par un rendu React soixante fois par seconde. */
  const audio = useRef<{
    flux: MediaStream;
    contexte: AudioContext;
    image: number;
  } | null>(null);
  const barres = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    valeurRef.current = valeur;
    changerRef.current = changer;
  }, [valeur, changer]);

  useEffect(() => {
    setDisponible(window.isSecureContext && Boolean(constructeur()));
    return () => {
      actif.current = false;
      reconnaissance.current?.abort();
      couperAudio(audio);
    };
  }, []);

  // Le minuteur de la pastille.
  useEffect(() => {
    if (!ecoute) return;
    setSecondes(0);
    const minuterie = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => clearInterval(minuterie);
  }, [ecoute]);

  if (!disponible) return null;

  /* Le niveau du micro, en parallèle de la reconnaissance. S'il est refusé
     ou indisponible, la dictée marche quand même : les barres restent à
     plat. */
  async function ouvrirAudio() {
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!actif.current) {
        flux.getTracks().forEach((piste) => piste.stop());
        return;
      }
      const contexte = new AudioContext();
      const analyseur = contexte.createAnalyser();
      analyseur.fftSize = 256;
      analyseur.smoothingTimeConstant = 0.6;
      contexte.createMediaStreamSource(flux).connect(analyseur);
      const frequences = new Uint8Array(analyseur.frequencyBinCount);
      /* La voix tient à peu près entre 85 Hz et 4 kHz : les barres se
         partagent cette plage, pas tout le spectre, sinon celles de droite
         ne bougeraient jamais. */
      const pas = contexte.sampleRate / analyseur.fftSize;
      const debut = Math.max(1, Math.floor(85 / pas));
      const fin = Math.min(frequences.length, Math.ceil(4000 / pas));
      const largeur = (fin - debut) / NOMBRE_BARRES;

      const lire = () => {
        analyseur.getByteFrequencyData(frequences);
        for (let i = 0; i < NOMBRE_BARRES; i++) {
          let somme = 0;
          const de = Math.floor(debut + i * largeur);
          const a = Math.max(de + 1, Math.floor(debut + (i + 1) * largeur));
          for (let j = de; j < a; j++) somme += frequences[j] ?? 0;
          const niveau = somme / (a - de) / 255;
          // Un seuil : le bruit de fond d'une pièce ne fait pas bouger.
          const hauteur =
            niveau < 0.12 ? 2 : 2 + Math.min(1, niveau * 1.4) * 14;
          const barre = barres.current[i];
          if (barre) barre.style.height = `${hauteur}px`;
        }
        if (audio.current) audio.current.image = requestAnimationFrame(lire);
      };
      audio.current = { flux, contexte, image: requestAnimationFrame(lire) };
    } catch {
      /* Micro refusé ou indisponible pour l'analyse : barres à plat. */
    }
  }

  function arreter() {
    actif.current = false;
    setEcoute(false);
    reconnaissance.current?.stop();
    couperAudio(audio);
  }

  function demarrer() {
    const Constructeur = constructeur();
    if (!Constructeur) return;
    actif.current = true;
    setEcoute(true);
    const instance = new Constructeur();
    instance.lang = "fr-FR";
    instance.continuous = true;
    /* **Le texte s'écrit pendant qu'on parle**, sur demande de Rémy : le
       navigateur renvoie la phrase en cours, provisoire, qu'il corrige au
       fil des mots puis fige. Chaque envoi réécrit donc toute la session,
       figé et provisoire ensemble, à la suite de `base`. */
    instance.interimResults = true;
    instance.onresult = (evenement) => {
      let dit = "";
      for (let i = 0; i < evenement.results.length; i++)
        dit += evenement.results[i]?.[0]?.transcript ?? "";
      changerRef.current(joindre(base.current, dit.trim()));
    };
    instance.onerror = (evenement) => {
      // Micro refusé : inutile de relancer, le navigateur dira non encore.
      if (
        evenement.error === "not-allowed" ||
        evenement.error === "service-not-allowed"
      )
        arreter();
    };
    instance.onstart = () => {
      base.current = valeurRef.current;
    };
    instance.onend = () => {
      if (actif.current) instance.start();
    };
    reconnaissance.current = instance;
    instance.start();
    void ouvrirAudio();
  }

  return (
    <motion.button
      type="button"
      layout
      transition={{ layout: { duration: 0.4 } }}
      onClick={() => (ecoute ? arreter() : demarrer())}
      aria-pressed={ecoute}
      aria-label={
        ecoute
          ? `Arrêter la dictée : ${libelle}`
          : `Dicter ta réponse : ${libelle}`
      }
      /* Ancré en bas à droite de la zone : il s'allonge vers la gauche.
         Fond de carte pour qu'on ne voie pas le texte dessous. */
      className="absolute right-2 bottom-2 flex items-center justify-center rounded-full border bg-card p-2 text-muted-foreground"
    >
      <span className="flex size-6 items-center justify-center">
        {/* Le carré d'arrêt, fixe, sur demande de Rémy : il tournait. */}
        {ecoute ? (
          <span className="size-4 rounded-sm bg-primary" />
        ) : (
          <Mic aria-hidden />
        )}
      </span>
      <AnimatePresence mode="wait">
        {ecoute ? (
          <motion.span
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 overflow-hidden"
          >
            {/* Les barres, à la hauteur du son. */}
            <span
              aria-hidden
              className="flex h-4 items-center justify-center gap-0.5"
            >
              {Array.from({ length: NOMBRE_BARRES }, (_, i) => (
                <span
                  key={i}
                  ref={(element) => {
                    barres.current[i] = element;
                  }}
                  className="w-0.5 rounded-full bg-primary transition-[height] duration-75"
                  style={{ height: 2 }}
                />
              ))}
            </span>
            <span className="w-10 text-center text-xs text-muted-foreground tabular-nums">
              {minuteur(secondes)}
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

const NOMBRE_BARRES = 12;

/** Coupe le micro et son analyse, s'ils sont ouverts. */
function couperAudio(
  audio: React.RefObject<{
    flux: MediaStream;
    contexte: AudioContext;
    image: number;
  } | null>,
) {
  const courant = audio.current;
  if (!courant) return;
  cancelAnimationFrame(courant.image);
  courant.flux.getTracks().forEach((piste) => piste.stop());
  void courant.contexte.close();
  audio.current = null;
}

const minuteur = (secondes: number) =>
  `${String(Math.floor(secondes / 60)).padStart(2, "0")}:${String(secondes % 60).padStart(2, "0")}`;

/** Ce qui se dit, à la suite de ce qui était écrit, avec une majuscule si
 * c'est le début du champ. */
function joindre(avant: string, dit: string) {
  if (!dit) return avant;
  if (!avant.trim()) return dit.charAt(0).toUpperCase() + dit.slice(1);
  return `${avant.replace(/\s+$/, "")} ${dit}`;
}

/* L'API Web Speech n'est pas dans les types du DOM de TypeScript : le strict
   nécessaire, écrit ici. Safari ne la connaît que préfixée. */
type ResultatReconnaissance = {
  isFinal: boolean;
  [index: number]: { transcript: string } | undefined;
};
type Reconnaissance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult:
    | ((evenement: {
        resultIndex: number;
        results: {
          length: number;
          [index: number]: ResultatReconnaissance | undefined;
        };
      }) => void)
    | null;
  onerror: ((evenement: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function constructeur(): (new () => Reconnaissance) | undefined {
  const fenetre = window as unknown as {
    SpeechRecognition?: new () => Reconnaissance;
    webkitSpeechRecognition?: new () => Reconnaissance;
  };
  return fenetre.SpeechRecognition ?? fenetre.webkitSpeechRecognition;
}
