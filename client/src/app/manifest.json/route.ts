import type { Manifest } from "next/dist/lib/metadata/types/manifest-types";

const basePath = process.env.BASE_PATH ?? "";
export async function GET() {
  return Response.json({
    name: "Revline 1",
    short_name: "Revline 1",
    start_url: basePath,
    icons: [
      {
        src: `${basePath}/web-app-manifest-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${basePath}/web-app-manifest-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#022f2e",
    background_color: "#022f2e",
    display: "standalone",
  } satisfies Manifest);
}
