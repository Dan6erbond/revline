import {
  Chip,
  DropdownItem,
  Image,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { Key, useState } from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@apollo/client";

import MediaItem from "@/components/media/item";
import { Trash } from "lucide-react";
import { getAlbum } from "@/components/album/shared";
import { getQueryParam } from "../../utils/router";
import { graphql } from "@/gql";
import useDebounce from "@/hooks/use-debounce";
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
      }
    }
  }
`);

export default function AlbumView({ id }: { id: string }) {
  const router = useRouter();

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

      setTitle(val);
    },
  });

  const onAction = (mediaId: string) => (key: Key) => {
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
    <div className="p-4 flex flex-col gap-4 container mx-auto">
      <Input
        label="Title"
        variant="underlined"
        className="border-b mr-10"
        value={title}
        onValueChange={handleTitleChange}
        size="lg"
        endContent={loading && <Spinner />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.album.media?.map((m) => (
          <MediaItem
            item={m}
            key={m.id}
            onAction={onAction(m.id)}
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
        renderValue={(items) => (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip
                key={item.key}
                startContent={
                  <Image
                    alt={item.data?.id}
                    className="flex-shrink-0 object-cover"
                    height={25}
                    width={25}
                    src={item.data?.url}
                  />
                }
              >
                {item.data?.id}
              </Chip>
            ))}
          </div>
        )}
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
        {({ id, url, createTime }) => (
          <SelectItem textValue={id}>
            <div className="flex gap-2 items-center">
              <Image
                alt={id}
                className="flex-shrink-0 object-cover"
                height={50}
                width={50}
                src={url}
              />
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
