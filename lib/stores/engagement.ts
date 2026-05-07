"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type EngagementState = {
  viewedLookIds: string[];
  totalEstimatedSavingsPln: number;
  registerView: (lookId: string, estimatedSavingsPln: number) => void;
};

export const useEngagementStore = create<EngagementState>()(
  persist(
    (set, get) => ({
      viewedLookIds: [],
      totalEstimatedSavingsPln: 0,
      registerView: (lookId, estimatedSavingsPln) => {
        if (get().viewedLookIds.includes(lookId)) {
          return;
        }

        set((state) => ({
          viewedLookIds: [...state.viewedLookIds, lookId],
          totalEstimatedSavingsPln: state.totalEstimatedSavingsPln + estimatedSavingsPln,
        }));
      },
    }),
    {
      name: "lecturelooks-engagement",
    },
  ),
);
