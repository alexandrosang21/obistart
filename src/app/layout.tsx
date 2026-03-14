import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://obistart.vercel.app"
const siteName = "Obistart"
const siteDescription =
  "A minimal, distraction-free browser start page. Focus on what matters with a daily planner, Pomodoro timer, ambient sounds, and curated tech news — all in one beautiful new tab."

export const metadata: Metadata = {
  title: {
    default: "Obistart — Your Mindful Browser Start Page",
    template: "%s | Obistart",
  },
  description: siteDescription,
  keywords: [
    "new tab page",
    "start page",
    "browser homepage",
    "productivity",
    "focus",
    "pomodoro timer",
    "daily planner",
    "ambient sounds",
    "distraction free",
    "minimal dashboard",
  ],
  authors: [{ name: "Alexandros Angelov" }],
  creator: "Alexandros Angelov",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "Obistart — Your Mindful Browser Start Page",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Obistart — Your Mindful Browser Start Page",
    description: siteDescription,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
