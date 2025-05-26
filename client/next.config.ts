import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const s3Url = new URL("/**", process.env.S3_URL!);
const apiUrl = new URL("/**", process.env.NEXT_PUBLIC_GRAPHQL_URL!);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: process.env.BASE_PATH,
  env: {
    BASE_PATH: process.env.BASE_PATH,
  },
  images: {
    remotePatterns: [
      {
        protocol: s3Url.protocol.replace(":", "") as RemotePattern["protocol"],
        hostname: s3Url.hostname,
        port: s3Url.port,
        pathname: s3Url.pathname,
      },
      {
        protocol: apiUrl.protocol.replace(":", "") as RemotePattern["protocol"],
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: apiUrl.pathname,
      },
    ],
  },
};

export default nextConfig;
