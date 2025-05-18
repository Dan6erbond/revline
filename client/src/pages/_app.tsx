import "@/styles/globals.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider, useSession } from "next-auth/react";

import type { AppProps } from "next/app";
import AuthenticatedApolloProvider from "@/apollo-client/provider";
import Head from "next/head";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Session } from "next-auth";
import { pdfjs } from "react-pdf";
import { useEffect } from "react";
import { useHref } from "@/utils/use-href";
import { useRouter } from "next/router";
import usertour from "usertour.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const inter = Inter({ subsets: ["latin"] });

function UserTour() {
  const { data: session } = useSession();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USERTOUR_TOKEN) {
      usertour.init(process.env.NEXT_PUBLIC_USERTOUR_TOKEN);
      const { user } = (session as Session) ?? {};
      if (user) {
        usertour.identify(user.id, {
          ...user,
          signed_up_at: user.createTime,
        });
      }
    }
  }, [session]);

  return null;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const href = useHref();

  return (
    <HeroUIProvider navigate={router.push} useHref={href}>
      <ToastProvider />
      {process.env.NODE_ENV !== "development" && (
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="64bc9887-3516-4a18-b0a9-bfff4281cb0b"
        />
      )}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Head>
        <title>Revline 1</title>
        <meta name="apple-mobile-web-app-title" content="Revline 1" />
        <link
          rel="icon"
          type="image/png"
          href={href("/favicon-96x96.png")}
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href={href("/favicon.svg")} />
        <link rel="shortcut icon" href={href("/favicon.ico")} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={href("/apple-touch-icon.png")}
        />
        <meta name="apple-mobile-web-app-title" content="Revline 1" />
        <link rel="manifest" href={href("/manifest.json")} />
      </Head>
      <SessionProvider
        session={session}
        basePath={router.basePath ? router.basePath + "/api/auth" : undefined}
      >
        <AuthenticatedApolloProvider>
          <UserTour />
          <Component {...pageProps} />
        </AuthenticatedApolloProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}
