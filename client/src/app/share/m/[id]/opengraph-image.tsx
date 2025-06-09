import { ImageResponse } from "next/og";
import { getClient } from "@/apollo-client/server";
import { getMedia } from "./query";
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
  const { data } = await client.query({ query: getMedia, variables: { id } });

  const { url, car } = data.media;
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
          <p tw="text-lg text-gray-400">Shared on Revline 1</p>
        </div>

        {/* Media */}
        <div tw="flex flex-1 mt-8 mb-8 rounded-xl overflow-hidden border border-gray-700">
          <img
            src={url}
            alt="media"
            tw="w-full h-full"
            style={{ objectFit: "cover" }}
          />
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
