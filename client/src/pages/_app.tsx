import "@/styles/globals.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import type { AppContext, AppInitialProps, AppProps } from "next/app";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import Script, { ScriptProps } from "next/script";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import App from "next/app";
import AuthenticatedApolloProvider from "@/apollo-client/provider";
import ConfigProvider from "@/contexts/config";
import Head from "next/head";
import { Inter } from "next/font/google";
import { getQueryParam } from "../utils/router";
import { pdfjs } from "react-pdf";
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

      if (session?.user) {
        const {
          user: { id, ...user },
        } = session;

        usertour.identify(id, {
          ...user,
          signed_up_at: user.createTime,
        });
      }
    }
  }, [session]);

  return null;
}

function Umami({ ...props }: ScriptProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      const {
        user: { id, ...user },
      } = session;
      umami.identify(id, user);
    }
  }, [session?.user?.id]);

  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id="64bc9887-3516-4a18-b0a9-bfff4281cb0b"
      {...props}
    />
  );
}

type CustomAppProps = {
  serverUrl: string;
};

export default function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
  serverUrl,
}: CustomAppProps & AppProps) {
  const router = useRouter();
  const href = useHref();

  const [url] = useState(serverUrl);

  useEffect(() => {
    if (getQueryParam(router.query.affiliate)) {
      document.cookie = `affiliate=${router.query.affiliate}`;
    }
  }, [router.query]);

  return (
    <HeroUIProvider navigate={router.push} useHref={href}>
      <ToastProvider />
      {process.env.NODE_ENV !== "development" && <Umami />}
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
        <ConfigProvider basePath={router.basePath} serverUrl={url}>
          <AuthenticatedApolloProvider url={url} pageProps={pageProps}>
            <UserTour />
            <Component {...pageProps} />
          </AuthenticatedApolloProvider>
        </ConfigProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}

CustomApp.getInitialProps = async (
  context: AppContext
): Promise<CustomAppProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  return {
    ...ctx,
    serverUrl: process.env.SERVER_URL!,
  };
};
