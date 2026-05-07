"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useStylePreferencesStore } from "@/lib/stores/style-preferences";

export default function Home() {
  const router = useRouter();
  const onboardingCompleted = useStylePreferencesStore((state) => state.onboardingCompleted);

  useEffect(() => {
    router.replace(onboardingCompleted ? "/feed" : "/onboarding");
  }, [onboardingCompleted, router]);

  return null;
}
