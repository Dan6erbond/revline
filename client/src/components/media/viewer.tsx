import { FragmentType, useFragment } from "@/gql";

import { Image } from "@heroui/react";
import { MediaItemFields } from "./shared";

export default function MediaViewer({
  item,
}: {
  item: FragmentType<typeof MediaItemFields>;
}) {
  const m = useFragment(MediaItemFields, item);
  const isVideo = m.metadata?.contentType.startsWith("video/");

  return isVideo ? (
    <video className="h-full w-full object-cover">
      <source src={m.url} type="video/mp4" />
    </video>
  ) : (
    <Image
      src={m.url}
      alt={m.title ?? `Shared media ${m.id}`}
      className="object-cover h-full w-full"
      removeWrapper
    />
  );
}
