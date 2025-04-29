import "@/styles/globals.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import type { AppProps } from "next/app";
import AuthenticatedApolloProvider from "@/apollo-client/provider";
import { HeroUIProvider } from "@heroui/react";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { pdfjs } from "react-pdf";
import { useRouter } from "next/router";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
