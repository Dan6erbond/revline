import { MetadataRoute } from "next";

const basePath = process.env.BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
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
  };
}
