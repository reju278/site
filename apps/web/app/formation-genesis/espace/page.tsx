import { partiesGenesis, RACINE_GENESIS } from "@/contenu/formation-genesis";
import { redirect } from "next/navigation";

/** L'entrée de l'espace membre mène à la première partie. */
export default function EspaceGenesis() {
  redirect(`${RACINE_GENESIS}/espace/${partiesGenesis[0]?.cle ?? "1"}`);
}
