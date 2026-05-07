"use client";

import { useEffect } from "react";

const SERVICE_WORKER_PATH = "/service-worker.js";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register(SERVICE_WORKER_PATH).catch(() => {
      // Keep the app functional even if service worker registration fails.
    });
  }, []);

  return null;
}
