import { PoliceTunnel } from "@/components/police-tunnel";

/**
 * Le cadre de `PageVideo` : celui de `/thanks`, sans le SDK de ClickFunnels,
 * qui compterait la visite dans l'étape de confirmation du tunnel.
 */
export function CadrePageVideo({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-police-tunnel
      style={
        {
          "--largeur-video": "min(100vw - 2.5rem, 56rem)",
        } as React.CSSProperties
      }
    >
      <PoliceTunnel />
      {children}
      <div aria-hidden className="h-16 sm:h-24" />
    </div>
  );
}
