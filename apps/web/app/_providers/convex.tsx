"use client";

import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {/* Le cache garde les abonnements en vie au démontage : sans lui, une
          navigation aller-retour refait toutes les requêtes. */}
      <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
    </ConvexProvider>
  );
}
