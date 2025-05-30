/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";

export default async function OGImage() {
  // Load your logo as a buffer and convert to array buffer for ImageResponse
  const logoBuffer = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = Uint8Array.from(logoBuffer).buffer;

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          backgroundColor: "#11181C",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#E5E7EB",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            Run Your Own Revline Server
          </h1>
          <p
            style={{
              color: "#94A3B8",
              fontSize: 28,
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            Take full control of your data and privacy by self-hosting Revline
            1. Customize, secure, and manage your own instance — perfect for
            enthusiasts and DIY mechanics.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Revline 1 · Self-Hosted Guide
          </div>
          <img
            src={logoSrc as any}
            alt="Revline 1 logo"
            style={{ width: 96, height: 96, objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
