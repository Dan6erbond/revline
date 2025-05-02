import { PreloadQuery, query } from "@/apollo-client/server";

import Media from "./media";
import { Metadata } from "next";
import { Suspense } from "react";
import { getMedia } from "./query";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data } = await query({ query: getMedia, variables: { id } });

  const { car, metadata } = data.media;
  const { name, owner } = car ?? {};
  const { profile } = owner ?? {};
  const { username } = profile ?? {};

  let type = "Media";

  if (metadata?.contentType.startsWith("image/")) {
    type = "Image";
  } else if (metadata?.contentType.startsWith("video/")) {
    type = "Video";
  }

  return {
    title: `${type} of ${name} by ${username} | Revline 1`,
    description: `Check out this ${type.toLowerCase()} uploaded by ${username} showcasing their ${name}. Shared via Revline 1 - the community for car lovers and DIY enthusiasts.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PreloadQuery query={getMedia} variables={{ id }}>
      <Suspense fallback="Loading...">
        <Media id={id} />
      </Suspense>
    </PreloadQuery>
  );
}
