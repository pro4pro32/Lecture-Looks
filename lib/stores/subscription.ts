"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlanTier = "free" | "premium";

type SubscriptionState = {
  tier: PlanTier;
  setTier: (tier: PlanTier) => void;
  isPremium: () => boolean;
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      tier: "free",
      setTier: (tier) => set({ tier }),
      isPremium: () => get().tier === "premium",
    }),
    {
      name: "lecturelooks-subscription",
    },
  ),
);
