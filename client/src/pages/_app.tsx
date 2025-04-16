import "@/styles/globals.css";

import type { AppProps } from "next/app";
import AuthenticatedApolloProvider from "@/apollo-client/provider";
import { HeroUIProvider } from "@heroui/react";
import { Inter } from "next/font/google";
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
