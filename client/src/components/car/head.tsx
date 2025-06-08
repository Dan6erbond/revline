import Head from "next/head";
import React from "react";

export default function CarHead({
  car,
  baseUrl,
  basePath,
}: {
  car: {
    __typename?: "Car";
    id: string;
    name: string;
    make?: string | null;
    model?: string | null;
    trim?: string | null;
    year?: number | null;
    bannerImage?: {
      __typename?: "Media";
      id: string;
      url: string;
    } | null;
    owner?: {
      __typename?: "User";
      id: string;
      email: string;
      profile?: {
        __typename?: "Profile";
        id: string;
        username?: string | null;
      } | null;
    } | null;
  };
  baseUrl: string;
  basePath: string;
}) {
  const { name, make, model, trim, year, bannerImage, owner, id } = car;
  const fallbackTitleParts = [year, make, model, trim].filter(Boolean);

  const title = name
    ? `${name} | Revline 1`
    : `${fallbackTitleParts.join(" ")} | Revline 1`;

  const description = name
    ? `Explore ${name}, a custom car shared by ${
        owner?.profile?.username || "a Revline 1 user"
      }.`
    : `Check out this ${fallbackTitleParts.join(" ")} owned by ${
        owner?.profile?.username || "a Revline 1 user"
      } on Revline 1.`;

  const imageUrl =
    bannerImage?.url ||
    new URL(basePath + "/placeholder.png", baseUrl).toString();
  const canonicalUrl = new URL(basePath + `/cars/${id}`, baseUrl).toString();

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Revline" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
