import CarLayout from "@/components/layout/car-layout";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

const AlbumView = dynamic(() => import("@/components/album"), { ssr: false });

export default function Album() {
  const router = useRouter();

  return (
    <CarLayout>
      {getQueryParam(router.query["album-id"]) && (
        <Suspense fallback="Loading...">
          <AlbumView id={getQueryParam(router.query["album-id"])!} />
        </Suspense>
      )}
    </CarLayout>
  );
}
