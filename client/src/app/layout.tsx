import "@/styles/globals.css";

import AppNavbar from "./navbar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    new URL(
      (process.env.COOLIFY_FQDN ?? "http://localhost:3001").split(",")[0]
    ).origin
  ),
  title: "Revline 1",
  description:
    "Revline is the ultimate app for car enthusiasts and DIY mechanics—track maintenance, log upgrades, and connect with your ride like never before.",
};

const basePath = process.env.BASE_PATH ?? "";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="64bc9887-3516-4a18-b0a9-bfff4281cb0b"
        />
        <meta name="apple-mobile-web-app-title" content="Revline 1" />
      </head>
      <body className={`antialiased ${inter.className} bg-background`}>
        <SessionProvider
          session={session}
          basePath={basePath ? basePath + "/api/auth" : undefined}
        >
          <Providers session={session}>
            <AppNavbar />
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
