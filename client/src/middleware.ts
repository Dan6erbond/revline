import { NextResponse } from "next/server";
import { auth } from "@/auth";

const basePath = process.env.BASE_PATH ?? "";

export default auth((req) => {
  if (
    !req.auth &&
    !req.nextUrl.pathname.startsWith("/share") &&
    !req.nextUrl.pathname.startsWith("/auth")
  ) {
    const newUrl = new URL(basePath + "/auth/signin", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", basePath + req.nextUrl.pathname);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|favicon-96x96.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png|manifest.json|apple-touch-icon.png).*)?",
  ],
};
