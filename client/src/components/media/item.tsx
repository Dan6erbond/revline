import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  addToast,
} from "@heroui/react";
import { Copy, MoreHorizontal } from "lucide-react";
import { FragmentType, graphql, useFragment } from "@/gql";

import { Key } from "react";
import { useRouter } from "next/router";

const MediaItemFields = graphql(`
  fragment MediaItem on Media {
    id
    url
  }
`);

export default function MediaItem({
  item,
}: {
  item: FragmentType<typeof MediaItemFields>;
}) {
  const router = useRouter();

  const m = useFragment(MediaItemFields, item);

  const onAction = (key: Key) => {
    switch (key) {
      case "copy":
        const shareUrl = new URL(
          `${router.basePath}/share/m/${m.id}`,
          window.location.origin
        );

        navigator.clipboard.writeText(shareUrl.toString()).then(() => {
          addToast({
            title: "Link copied",
            description: "The share link is now in your clipboard.",
            color: "success",
          });
        });

        break;
    }
  };

  return (
    <div className="relative p-4 h-[400px]" key={m.id}>
      <div className="absolute top-6 right-6 z-20">
        <Dropdown>
          <DropdownTrigger asChild>
            <Button
              size="sm"
              isIconOnly
              className="text-content-3-foreground hover:text-primary"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu className="w-48" onAction={onAction}>
            <DropdownItem key="copy" startContent={<Copy />}>
              Copy Share Link
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Image
        src={m.url}
        alt={`Shared media ${m.id}`}
        className="object-cover h-full w-full"
        removeWrapper
      />
    </div>
  );
}
