import { auth } from "@/auth";

const basePath = process.env.BASE_PATH ?? "";

export default auth((req) => {
  if (!req.auth) {
    const newUrl = new URL(basePath + "/api/auth/signin", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", basePath + req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)?"],
};
