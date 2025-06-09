import { powerUnitsShort, torqueUnitsShort } from "@/literals";

import { ImageResponse } from "next/og";
import { buildClient } from "@/apollo-client";
import { getPower } from "@/utils/power";
import { getTorque } from "@/utils/torque";
import { graphql } from "@/gql";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { useUnits } from "@/hooks/use-units";

export const size = {
  width: 1200,
  height: 630,
};

const getCarOverviewForOpenGraph = graphql(`
  query GetCarOverviewForOpenGraph($id: ID!) {
    car(id: $id) {
      id
      name
      make
      model
      trim
      year
      powerKw
      torqueNm
      bannerImage {
        id
        url
      }
      owner {
        id
        email
        profile {
          id
          username
          pictureUrl
        }
      }
    }
  }
`);

export const contentType = "image/png";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const inter = await readFile(
    join(process.cwd(), "assets/Inter_24pt-Medium.ttf")
  );

  const logo = (
    await readFile(
      join(process.cwd(), "public", "web-app-manifest-192x192.png")
    ).then((buff) => Uint8Array.from(buff))
  ).buffer;

  const client = buildClient({});

  const { id } = await params;
  const { data } = await client.query({
    query: getCarOverviewForOpenGraph,
    variables: { id },
  });

  const { powerUnit, torqueUnit } = useUnits();

  const { car } = data;
  const { name, owner, bannerImage } = car ?? {};
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
              style={{ marginRight: 16, objectFit: "cover" }}
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

        <div tw="flex flex-1 mt-8 mb-8 rounded-xl overflow-hidden border border-gray-700">
          {bannerImage?.url && (
            <img
              src={bannerImage.url}
              alt="media"
              tw="w-full h-full"
              style={{ objectFit: "cover" }}
            />
          )}

          {/* Overlay Stats */}
          <div
            tw="absolute bottom-0 right-0 m-4 p-4 bg-black/70 rounded-lg text-white text-sm flex"
            style={{ gap: 12 }}
          >
            {car.powerKw && (
              <div tw="flex items-center" style={{ gap: 4 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
                <span>
                  {getPower(car.powerKw, powerUnit).toLocaleString()}{" "}
                  {powerUnitsShort[powerUnit]}
                </span>
              </div>
            )}
            {car.torqueNm && (
              <div tw="flex items-center" style={{ gap: 4 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m12 14 4-4" />
                  <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                </svg>
                <span>
                  {getTorque(car.torqueNm, torqueUnit).toLocaleString()}{" "}
                  {torqueUnitsShort[torqueUnit]}
                </span>
              </div>
            )}
            {/* <div tw="flex items-center" style={{ gap: 4 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="10" x2="14" y1="2" y2="2" />
                <line x1="12" x2="15" y1="14" y2="11" />
                <circle cx="12" cy="14" r="8" />
              </svg>
              <span>0-60: 4.2s</span>
            </div> */}
            {/* <div tw="flex items-center" style={{ gap: 4 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 22H4a2 2 0 0 1-2-2V6" />
                <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
                <circle cx="12" cy="8" r="2" />
                <rect width="16" height="16" x="6" y="2" rx="2" />
              </svg>
              <span>12 images</span>
            </div> */}
            {/* <div tw="flex items-center" style={{ gap: 4 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <span>5 mods</span>
            </div> */}
            {/* <div tw="flex items-center" style={{ gap: 4 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12h.01" />
                <path d="M3 18h.01" />
                <path d="M3 6h.01" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <path d="M8 6h13" />
              </svg>
              <span>3 log entries</span>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div tw="flex justify-between items-center">
          <p tw="text-3xl font-bold text-white">{name}</p>
          <img
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
