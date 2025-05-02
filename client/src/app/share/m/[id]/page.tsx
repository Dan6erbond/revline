import Media from "./media";
import { PreloadQuery } from "@/apollo-client/server";
import { Suspense } from "react";
import { getMedia } from "./query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PreloadQuery query={getMedia} variables={{ id }}>
      <Suspense fallback="Loading...">
        <Media id={id} />
      </Suspense>
    </PreloadQuery>
  );
}
