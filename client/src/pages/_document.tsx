import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="64bc9887-3516-4a18-b0a9-bfff4281cb0b"
        ></script>
      </Head>
      <body className="antialiased bg-background">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
