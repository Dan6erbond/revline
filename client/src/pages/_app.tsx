import "@/styles/globals.css";

import type { AppProps } from "next/app";
import AuthenticatedApolloProvider from "@/apollo-client/provider";
import { HeroUIProvider } from "@heroui/react";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="64bc9887-3516-4a18-b0a9-bfff4281cb0b"
      />
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <AuthenticatedApolloProvider>
          <Component {...pageProps} />
        </AuthenticatedApolloProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}
