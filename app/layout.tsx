import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Analytics } from "@/components/analytics";
import { AppShell } from "@/components/app-shell";
import { InstallPrompt } from "@/components/install-prompt";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LectureLooks",
    template: "%s | LectureLooks",
  },
  description: "Stylish lecture outfit feed with elegant saved inspirations.",
  applicationName: "LectureLooks",
  manifest: "/manifest.json",
  themeColor: "#020617",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LectureLooks",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <a href="#main-content" className="skip-link">
          Przejdz do tresci
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={["dark", "light", "soft-pink"]}>
          <WebVitalsReporter />
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-center" />
          <Analytics />
          <InstallPrompt />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
