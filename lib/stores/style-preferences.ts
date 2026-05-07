"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const STYLE_OPTIONS = [
  "Clean Girl",
  "Old Money",
  "Coquette",
  "Y2K",
  "Minimal",
  "Downtown Girl",
  "Quiet Luxury",
  "Acubi",
] as const;

type StyleOption = (typeof STYLE_OPTIONS)[number];

type StylePreferencesState = {
  selectedStyles: StyleOption[];
  onboardingCompleted: boolean;
  toggleStyle: (style: StyleOption) => void;
  completeOnboarding: () => void;
};

export const useStylePreferencesStore = create<StylePreferencesState>()(
  persist(
    (set) => ({
      selectedStyles: [],
      onboardingCompleted: false,
      toggleStyle: (style) =>
        set((state) => {
          const isSelected = state.selectedStyles.includes(style);

          return {
            selectedStyles: isSelected
              ? state.selectedStyles.filter((item) => item !== style)
              : [...state.selectedStyles, style],
          };
        }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
    }),
    {
      name: "lecturelooks-style-preferences",
    },
  ),
);
