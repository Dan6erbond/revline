import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Spinner,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { Copy, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Key, useEffect, useState } from "react";
import MediaItem, { SelectableMediaItem } from "@/components/media/item";
import { useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import { getAlbum } from "@/components/album/shared";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import useDebounce from "@/hooks/use-debounce";
import { useHref } from "@/utils/use-href";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

const updateAlbum = graphql(`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
      media {
        edges {
          node {
            id
            ...MediaItem
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`);

const getGallery = graphql(`
  query GetCarMedia(
    $id: ID!
    $where: MediaWhereInput
    $first: Int
    $after: Cursor
    $orderBy: [MediaOrder!]
  ) {
    car(id: $id) {
      id
      media(where: $where, first: $first, after: $after, orderBy: $orderBy) {
        edges {
          node {
            id
            url
            createTime
            metadata {
              contentType
            }
            ...MediaItem
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`);

type Inputs = {
  mediaIds: string[];
};

export default function Album() {
  const router = useRouter();
  const href = useHref();

  const id = getQueryParam(router.query["album-id"]);
  const carId = getQueryParam(router.query.id);

  const { data, loading, fetchMore } = useQuery(getAlbum, {
    variables: { id: id as string, first: 10 },
    skip: !id,
  });

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.album.media.pageInfo.hasNextPage && !loading,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.album.media.edges &&
      fetchMore({
        variables: {
          after:
            data.album.media.edges[data.album.media.edges.length - 1]?.cursor,
        },
      }),
  });

  const {
    data: galleryData,
    loading: loadingGallery,
    fetchMore: fetchMoreMedia,
  } = useQuery(getGallery, {
    variables: {
      id: carId as string,
      first: 10,
      where: {
        idNotIn: data?.album.media.edges
          ?.filter((e) => !!e)
          .map((e) => e.node)
          .filter((n) => !!n)
          .map((n) => n.id),
      },
    },
    skip: !carId,
  });

  const [mediaLoaderRef] = useIntersectionObserver({
    isEnabled: galleryData?.car.media.pageInfo.hasNextPage && !loadingGallery,
    onChange: (isIntersecting) =>
      isIntersecting &&
      galleryData?.car.media.edges &&
      fetchMoreMedia({
        variables: {
          after:
            galleryData.car.media.edges[galleryData.car.media.edges.length - 1]
              ?.cursor,
        },
      }),
  });

  const { handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      mediaIds: [],
    },
  });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [mutate, { loading: isUpdating }] = useMutation(updateAlbum, {
    refetchQueries: [getAlbum],
  });

  const onSubmit = withNotification(
    { title: "Adding media..." },
    ({ mediaIds }: Inputs) =>
      mutate({
        variables: {
          id: id as string,
          input: { addMediumIDs: mediaIds },
        },
      }).then(onClose)
  );

  const [title, setTitle] = useState(data?.album.title);

  useEffect(() => setTitle(data?.album.title), [data]);

  const handleTitleChange = useDebounce({
    handle: (val: string) => {
      mutate({
        variables: {
          id: id as string,
          input: { title: val },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateAlbum: {
            ...data?.album,
            id,
            title: val,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
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
            id: id as string,
            input: {
              removeMediumIDs: [mediaId],
            },
          },
        });
        break;
    }
  };

  return (
    <CarLayout>
      <div className="p-4 flex flex-col gap-4 md:gap-6 container mx-auto">
        <div className="flex items-end justify-between gap-10">
          <Input
            label="Title"
            variant="underlined"
            className="border-b"
            value={title}
            onValueChange={handleTitleChange}
            size="lg"
            endContent={isUpdating && <Spinner />}
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
        <Button
          variant="bordered"
          startContent={<Plus />}
          className="self-start"
          onPress={onOpen}
        >
          Add media
        </Button>
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.album.media?.edges?.map((e) => (
            <MediaItem
              item={e!.node!}
              key={e!.node!.id}
              onAction={onMediaAction(e!.node!.id)}
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
          {loading &&
            Array(10)
              .fill(null)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  className="rounded-xl h-[150px] md:h-[200px] lg:h-[250px]"
                />
              ))}
        </div>
        {!loading && data?.album.media.pageInfo.hasNextPage && (
          <div className="flex w-full justify-center mt-10">
            <Spinner ref={loaderRef} color="white" />
          </div>
        )}
      </div>

      <Modal
        scrollBehavior="inside"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add media</ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                  id="media-picker"
                >
                  <Controller
                    control={control}
                    name="mediaIds"
                    render={({ field: { value, onChange } }) => (
                      <fieldset className="space-y-2">
                        <legend>Media</legend>
                        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                          {galleryData?.car.media?.edges?.map((e) => (
                            <SelectableMediaItem
                              item={e!.node!}
                              key={e!.node!.id}
                              selected={value.includes(e!.node!.id)}
                              onSelect={() => onChange([...value, e!.node!.id])}
                            />
                          ))}
                          {loadingGallery &&
                            Array(10)
                              .fill(null)
                              .map((_, i) => (
                                <Skeleton
                                  key={i}
                                  className="rounded-xl h-[150px] md:h-[200px] lg:h-[250px]"
                                />
                              ))}
                        </div>
                        {!loadingGallery &&
                          galleryData?.car.media.pageInfo.hasNextPage && (
                            <div className="flex w-full justify-center mt-10">
                              <Spinner ref={mediaLoaderRef} color="white" />
                            </div>
                          )}
                      </fieldset>
                    )}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  form="media-picker"
                  isLoading={isUpdating}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </CarLayout>
  );
}
