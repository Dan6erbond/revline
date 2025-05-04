import AlbumView from "../../../../../components/album";
import CarLayout from "@/components/layout/car-layout";
import { Suspense } from "react";
import { getQueryParam } from "../../../../../utils/router";
import { useRouter } from "next/router";

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
