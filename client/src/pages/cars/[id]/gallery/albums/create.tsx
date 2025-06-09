import { Button, Input, Skeleton, Spinner } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import { SelectableMediaItem } from "../../../../../components/media/item";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

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
  title: string;
  mediaIds: string[];
};

const createAlbum = graphql(`
  mutation CreateAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
      id
    }
  }
`);

export default function Create() {
  const router = useRouter();

  const {
    data,
    loading: loadingGallery,
    fetchMore,
  } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.car.media.pageInfo.hasNextPage && !loadingGallery,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.car.media.edges &&
      fetchMore({
        variables: {
          after: data.car.media.edges[data.car.media.edges.length - 1]?.cursor,
        },
      }),
  });

  const [mutate, { loading }] = useMutation(createAlbum);

  const { register, control, handleSubmit } = useForm<Inputs>({
    defaultValues: { mediaIds: [] },
  });

  const onSubmit = withNotification(
    { title: "Creating album..." },
    async ({ title, mediaIds }: Inputs) => {
      mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            title,
            mediumIDs: [...mediaIds],
          },
        },
      }).then(({ data }) => {
        if (!data) {
          router.push(`/cars/${router.query.id}/gallery/albums`);
        } else {
          router.push(
            `/cars/${router.query.id}/gallery/albums/${data.createAlbum.id}`
          );
        }
      });
    }
  );

  return (
    <CarLayout>
      <div className="p-4 flex flex-col gap-4 container mx-auto">
        <h1 className="text-3xl">Create Album</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            variant="bordered"
            isRequired
            {...register("title")}
          />
          <Controller
            control={control}
            name="mediaIds"
            render={({ field: { value, onChange } }) => (
              <fieldset className="space-y-2">
                <legend>Media</legend>
                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {data?.car.media?.edges?.map((e) => (
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
                {!loadingGallery && data?.car.media.pageInfo.hasNextPage && (
                  <div className="flex w-full justify-center mt-10">
                    <Spinner ref={loaderRef} color="white" />
                  </div>
                )}
              </fieldset>
            )}
          />
          <Button type="submit" className="self-end" isLoading={loading}>
            Create
          </Button>
        </form>
      </div>
    </CarLayout>
  );
}
