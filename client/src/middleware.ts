import { NextResponse } from "next/server";
import { auth } from "@/auth";

const basePath = process.env.BASE_PATH ?? "";

export default auth((req) => {
  if (!req.auth && !req.nextUrl.pathname.startsWith("/auth")) {
    if (req.nextUrl.pathname.startsWith("/auth")) return;
    if (req.nextUrl.pathname.startsWith("/share")) return;
    if (/^\/cars\/[0-9a-zA-Z\-]+$/.test(req.nextUrl.pathname)) return;
    if (/^\/cars\/[0-9a-zA-Z\-]+\/mods$/.test(req.nextUrl.pathname)) return;
    if (/^\/cars\/[0-9a-zA-Z\-]+\/build\-log$/.test(req.nextUrl.pathname)) return;
    if (/^\/cars\/[0-9a-zA-Z\-]+\/gallery$/.test(req.nextUrl.pathname)) return;

    console.log(req.nextUrl.pathname);

    const newUrl = new URL(basePath + "/auth/signin", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", basePath + req.nextUrl.pathname);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|favicon-96x96.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png|manifest.json|apple-touch-icon.png).*)?",
  ],
  unstable_allowDynamic: ["**/node_modules/lodash/*.js"],
};
