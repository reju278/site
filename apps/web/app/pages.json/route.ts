import { TUNNELS } from "@/lib/tunnels";

/**
 * Les pages de go.funnels.club, pour le CRM : l'onglet Funnels lit cette liste
 * toutes les six heures et y ajoute d'elle-même une page nouvelle. Une page de
 * tunnel se déclare déjà dans `lib/tunnels.ts` : rien de plus à écrire.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json({ pages: TUNNELS });
}
