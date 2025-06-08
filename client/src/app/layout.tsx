import "@/styles/globals.css";

import AppNavbar from "./navbar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Umami from "@/components/umami";
import { auth } from "@/auth";

const inter = Inter({
  subsets: ["latin"],
});

const basePath = process.env.BASE_PATH ?? "";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(
      new URL(
        (
          process.env.COOLIFY_URL ??
          process.env.BASE_URL ??
          "http://localhost:3001"
        ).split(",")[0]
      ).origin
    ),
    title: "Revline 1",
    description:
      "Revline is the ultimate app for car enthusiasts and DIY mechanics—track maintenance, log upgrades, and connect with your ride like never before.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="icon"
          type="image/png"
          href={basePath + "/favicon-96x96.png"}
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href={basePath + "/favicon.svg"}
        />
        <link rel="shortcut icon" href={basePath + "/favicon.ico"} />
        <meta name="apple-mobile-web-app-title" content="Revline 1" />
      </head>
      <body className={`antialiased ${inter.className} bg-background`}>
        <Providers
          session={session}
          serverUrl={process.env.SERVER_URL!}
          basePath={process.env.BASE_PATH ?? ""}
        >
          {process.env.NODE_ENV !== "development" && (
            <Umami websiteId="64bc9887-3516-4a18-b0a9-bfff4281cb0b" />
          )}
          <AppNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
