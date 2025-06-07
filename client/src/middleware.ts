import { auth } from "@/auth";

export default auth(() => {});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|favicon-96x96.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png|manifest.json|apple-touch-icon.png).*)?",
  ],
};
