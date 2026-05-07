"use client";

import { useReportWebVitals } from "next/web-vitals";

const BUDGETS: Record<string, number> = {
  LCP: 2500,
  CLS: 0.1,
  INP: 200,
  FCP: 1800,
  TTFB: 800,
};

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[web-vitals]", metric.name, Math.round(metric.value));
    }

    const budget = BUDGETS[metric.name];
    if (budget !== undefined && metric.value > budget) {
      console.warn(`[web-vitals-budget] ${metric.name}=${Math.round(metric.value)} (budget ${budget})`);
    }
  });

  return null;
}
