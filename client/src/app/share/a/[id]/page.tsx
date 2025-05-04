import { PreloadQuery, query } from "@/apollo-client/server";

import Album from "./album";
import { Metadata } from "next";
import { Suspense } from "react";
import { getAlbum } from "@/components/album/shared";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data } = await query({ query: getAlbum, variables: { id } });

  const { car, title } = data.album;
  const { name, owner } = car ?? {};
  const { profile } = owner ?? {};
  const { username } = profile ?? {};

  return {
    title: `Album "${title}" by ${username} | Revline 1`,
    description: `Check out this album created by ${username} showcasing their ${name}. Shared via Revline 1 - the community for car lovers and DIY enthusiasts.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PreloadQuery query={getAlbum} variables={{ id }}>
      <Suspense fallback="Loading...">
        <Album id={id} />
      </Suspense>
    </PreloadQuery>
  );
}
