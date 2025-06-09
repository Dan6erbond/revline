/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { getBlogPosts } from "../utils";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import readingTime from "reading-time";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blogPost = getBlogPosts().find((post) => post.slug === slug);

  if (!blogPost) {
    notFound();
  }

  const stats = readingTime(blogPost.content);
  const minutes = Math.round(stats.minutes);

  const logo = (
    await readFile(join(process.cwd(), "public", "logo.png")).then((buff) =>
      Uint8Array.from(buff)
    )
  ).buffer;

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
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#E5E7EB",
              lineHeight: 1.2,
            }}
          >
            {blogPost.metadata.title}
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 24 }}>
            {blogPost.metadata.summary}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#64748B", display: "flex", fontSize: 20 }}>
            <span>{blogPost.metadata.author ?? "RaviAnand Mohabir"}</span> ·{" "}
            <span>
              {new Date(blogPost.metadata.publishedAt).toLocaleDateString()}
            </span>{" "}
            · <span>{minutes} min read</span>
          </div>
          <img
            src={logo as any}
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
