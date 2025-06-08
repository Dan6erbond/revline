import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [];

if (process.env.S3_URL) {
  const s3Url = new URL("/**", process.env.S3_URL!);
  remotePatterns.push({
    protocol: s3Url.protocol.replace(":", "") as RemotePattern["protocol"],
    hostname: s3Url.hostname,
    port: s3Url.port,
    pathname: s3Url.pathname,
  });
}

if (process.env.SERVER_URL) {
  const apiUrl = new URL("/**", process.env.SERVER_URL!);
  remotePatterns.push({
    protocol: apiUrl.protocol.replace(":", "") as RemotePattern["protocol"],
    hostname: apiUrl.hostname,
    port: apiUrl.port,
    pathname: apiUrl.pathname,
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: process.env.BASE_PATH,
  env: {
    BASE_PATH: process.env.BASE_PATH,
  },
  images: {
    remotePatterns,
  },
  transpilePackages: ["next-auth"],
};

export default nextConfig;
