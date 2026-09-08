import { mutation, query } from "./_generated/server";

// Ce site est public : il n'a pas d'écran protégé, donc pas de notion de
// visiteur connecté. Les fonctions passent par ces enveloppes malgré tout, pour
// que le jour où une partie privée arrive, le verrou se pose ici et nulle part
// ailleurs.
//
// Tant qu'il n'y a pas d'authentification, **rien de sensible ne descend dans
// Convex** : une fonction Convex est publique par nature, qui connaît l'URL du
// déploiement peut l'appeler.
export const publicQuery = query;
export const publicMutation = mutation;
