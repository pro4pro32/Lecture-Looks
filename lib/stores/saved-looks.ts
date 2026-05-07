"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createClient } from "@/lib/supabase/client";

type SavedLooksState = {
  savedLookIds: string[];
  pendingLookIds: string[];
  hydrated: boolean;
  setHydrated: () => void;
  toggleSavedLook: (lookId: string) => Promise<void>;
  isSaved: (lookId: string) => boolean;
  syncFromSupabase: () => Promise<void>;
};

const getDeviceId = () => {
  if (typeof window === "undefined") return "server";

  const key = "lecturelooks-device-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  window.localStorage.setItem(key, generated);
  return generated;
};

export const useSavedLooksStore = create<SavedLooksState>()(
  persist(
    (set, get) => ({
      savedLookIds: [],
      pendingLookIds: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      isSaved: (lookId) => get().savedLookIds.includes(lookId),
      toggleSavedLook: async (lookId) => {
        const wasSaved = get().savedLookIds.includes(lookId);
        const previousIds = get().savedLookIds;
        const nextIds = wasSaved
          ? get().savedLookIds.filter((id) => id !== lookId)
          : [...get().savedLookIds, lookId];

        set((state) => ({ savedLookIds: nextIds, pendingLookIds: [...state.pendingLookIds, lookId] }));

        const supabase = createClient();
        const deviceId = getDeviceId();

        try {
          if (wasSaved) {
            const { error } = await supabase.from("saved_looks").delete().eq("device_id", deviceId).eq("look_id", lookId);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("saved_looks").upsert(
              {
                device_id: deviceId,
                look_id: lookId,
              },
              { onConflict: "device_id,look_id" },
            );
            if (error) throw error;
          }
        } catch (error) {
          set({ savedLookIds: previousIds });
          throw error;
        } finally {
          set((state) => ({ pendingLookIds: state.pendingLookIds.filter((id) => id !== lookId) }));
        }
      },
      syncFromSupabase: async () => {
        const supabase = createClient();
        const deviceId = getDeviceId();
        const { data, error } = await supabase
          .from("saved_looks")
          .select("look_id")
          .eq("device_id", deviceId)
          .order("created_at", { ascending: false });

        if (error || !data) {
          return;
        }

        set({ savedLookIds: data.map((row) => row.look_id) });
      },
    }),
    {
      name: "lecturelooks-saved-looks",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
