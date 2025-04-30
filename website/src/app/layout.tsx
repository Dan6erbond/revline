import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "./navbar";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revline 1",
  description:
    "Revline is the ultimate app for car enthusiasts and DIY mechanics—track maintenance, log upgrades, and connect with your ride like never before.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="64bc9887-3516-4a18-b0a9-bfff4281cb0b"
        />
        <meta name="apple-mobile-web-app-title" content="Revline 1" />
      </head>
      <body className={`antialiased ${inter.className} dark`}>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
