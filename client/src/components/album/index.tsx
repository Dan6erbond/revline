import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Select,
  SelectItem,
  Spinner,
  addToast,
} from "@heroui/react";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { Key, useState } from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@apollo/client";

import FileIcon from "@/components/file-icon";
import MediaItem from "@/components/media/item";
import { getAlbum } from "@/components/album/shared";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import useDebounce from "@/hooks/use-debounce";
import { useHref } from "@/utils/use-href";
import { useRouter } from "next/router";

const updateAlbum = graphql(`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
      media {
        id
        ...MediaItem
      }
    }
  }
`);

const getGallery = graphql(`
  query GetCarMedia($id: ID!) {
    car(id: $id) {
      id
      media {
        id
        url
        createTime
        metadata {
          contentType
        }
      }
    }
  }
`);

export default function AlbumView({ id }: { id: string }) {
  const router = useRouter();
  const href = useHref();

  const { data } = useSuspenseQuery(getAlbum, {
    variables: { id },
    skip: !id,
  });

  const { data: galleryData } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [mutate, { loading }] = useMutation(updateAlbum);

  const [title, setTitle] = useState(data?.album.title);

  const handleTitleChange = useDebounce({
    handle: (val: string) => {
      mutate({
        variables: {
          id,
          input: { title: val },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateAlbum: {
            id,
            title: val,
          },
        },
      });
    },
    immediateHandler: (val: string) => setTitle(val),
  });

  const onAction = (key: Key) => {
    switch (key) {
      case "copy":
        const shareUrl = new URL(
          href(`/share/a/${data?.album.id}`),
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

  const onMediaAction = (mediaId: string) => (key: Key) => {
    switch (key) {
      case "remove":
        mutate({
          variables: {
            id,
            input: {
              removeMediumIDs: [mediaId],
            },
          },
        });
        break;
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 md:gap-6 container mx-auto">
      <div className="flex items-end justify-between gap-10">
        <Input
          label="Title"
          variant="underlined"
          className="border-b"
          value={title}
          onValueChange={handleTitleChange}
          size="lg"
          endContent={loading && <Spinner />}
        />
        <Dropdown onClick={(e) => e.stopPropagation()}>
          <DropdownTrigger asChild>
            <Button
              size="sm"
              isIconOnly
              className="text-content-3-foreground hover:text-primary"
              variant="ghost"
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
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.album.media?.map((m) => (
          <MediaItem
            item={m}
            key={m.id}
            onAction={onMediaAction(m.id)}
            dropdownMenuChildren={
              <DropdownItem
                key="remove"
                startContent={<Trash />}
                className="text-danger"
                color="danger"
              >
                Remove from album
              </DropdownItem>
            }
          />
        ))}
      </div>
      <Select
        label="Add media"
        labelPlacement="outside"
        classNames={{ innerWrapper: "py-4" }}
        variant="bordered"
        items={
          galleryData?.car?.media?.filter(
            (m) => data?.album.media?.findIndex((_m) => _m.id === m.id) === -1
          ) ?? []
        }
        onSelectionChange={(value) => {
          if (!value.currentKey) return;

          mutate({
            variables: {
              id,
              input: {
                addMediumIDs: [value.currentKey],
              },
            },
          });
        }}
      >
        {({ id, url, createTime, metadata }) => (
          <SelectItem textValue={id}>
            <div className="flex gap-2 items-center">
              {metadata?.contentType.startsWith("image/") ? (
                <Image
                  alt={id}
                  className="flex-shrink-0 object-cover"
                  height={50}
                  width={50}
                  src={url}
                />
              ) : (
                <FileIcon
                  className="size-12"
                  contentType={metadata?.contentType}
                />
              )}
              <div className="flex flex-col">
                <span className="text-small">{id}</span>
                <span className="text-tiny text-default-400">
                  {new Date(createTime).toLocaleString()}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
