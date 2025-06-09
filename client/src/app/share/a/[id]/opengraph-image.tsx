import { ImageResponse } from "next/og";
import { MediaItemFragment } from "@/gql/graphql";
import { getAlbum } from "@/components/album/shared";
import { getClient } from "@/apollo-client/server";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const inter = await readFile(
    join(process.cwd(), "assets/Inter_24pt-Medium.ttf")
  );

  const logo = (
    await readFile(
      join(process.cwd(), "public", "web-app-manifest-192x192.png")
    ).then((buff) => Uint8Array.from(buff))
  ).buffer;

  const client = getClient();

  const { id } = await params;
  const { data } = await client.query({ query: getAlbum, variables: { id } });

  const { title, media, car } = data.album;
  const { name, owner } = car ?? {};
  const { email, profile } = owner ?? {};

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-12 justify-between"
        style={{
          backgroundColor: "#11181C",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div tw="flex items-center justify-between">
          <div tw="flex items-start">
            <img
              src={profile?.pictureUrl ?? undefined}
              width={64}
              height={64}
              tw="rounded-full border border-gray-700"
              alt="avatar"
              style={{ marginRight: 16 }}
            />
            <div tw="flex flex-col -mt-4">
              <p tw="text-xl mb-0 font-semibold text-white">
                {profile?.username}
              </p>
              <p tw="text-sm mb-0 text-gray-400">{email}</p>
            </div>
          </div>
          <p tw="text-lg text-gray-400">Shared on Revline</p>
        </div>

        {/* Album Title */}
        <p tw="text-2xl font-semibold text-white mt-8 truncate">{title}</p>

        {/* Media Grid */}
        <div tw="flex gap-4 mt-8 mb-8 flex-1 rounded-xl overflow-hidden">
          {media?.slice(0, 3).map((item, idx) => {
            return (
              <img
                key={item.id}
                src={(item as MediaItemFragment).url}
                alt={`media-${idx}`}
                tw="flex-1 w-full h-full object-cover border border-gray-700 rounded-lg aspect-square"
              />
            );
          })}
        </div>

        {/* Footer */}
        <div tw="flex justify-between items-center">
          <p tw="text-3xl font-bold text-white">{name}</p>
          <img
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            src={logo as any}
            alt="Revline 1 logo"
            style={{ width: 48, height: 48, objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
