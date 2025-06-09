import { FragmentType, useFragment } from "@/gql";
import { Image, cn } from "@heroui/react";

import { MediaItemFields } from "./shared";

export default function MediaViewer({
  item,
  className,
}: {
  item: FragmentType<typeof MediaItemFields>;
  className?: string;
}) {
  const m = useFragment(MediaItemFields, item);
  const isVideo = m.metadata?.contentType.startsWith("video/");

  return isVideo ? (
    <video className={cn("h-full w-full object-cover", className)}>
      <source src={m.url} type="video/mp4" />
    </video>
  ) : (
    <Image
      src={m.url}
      alt={m.title ?? `Shared media ${m.id}`}
      className={cn("object-cover h-full w-full", className)}
      removeWrapper
    />
  );
}
