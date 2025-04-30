import { NextRequest } from "next/server";
import { handlers } from "@/auth";

const basePath = process.env.BASE_PATH ?? "";

function rewriteRequest(req: NextRequest) {
  const {
    headers,
    nextUrl: { protocol, host, pathname, search },
  } = req;

  const detectedHost = headers.get("x-forwarded-host") ?? host;
  const detectedProtocol = headers.get("x-forwarded-proto") ?? protocol;
  const _protocol = `${detectedProtocol.replace(/:$/, "")}:`;
  const url = new URL(
    _protocol + "//" + detectedHost + basePath + pathname + search
  );

  return new NextRequest(url, req);
}

export const GET = async (req: NextRequest) =>
  await handlers.GET(rewriteRequest(req));
export const POST = async (req: NextRequest) =>
  await handlers.POST(rewriteRequest(req));
