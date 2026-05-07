"use client";

import Script from "next/script";

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

export function Analytics() {
  if (!umamiWebsiteId || !umamiScriptUrl) {
    return null;
  }

  return (
    <Script
      defer
      src={umamiScriptUrl}
      data-website-id={umamiWebsiteId}
      data-auto-track="true"
      strategy="afterInteractive"
    />
  );
}
