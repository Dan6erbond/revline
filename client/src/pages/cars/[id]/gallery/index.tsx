import { Album, ImageUp, Images } from "lucide-react";
import { Progress, Skeleton, Spinner, Tab, Tabs } from "@heroui/react";
import { useCallback, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import Dropzone from "@/components/dropzone";
import Link from "next/link";
import MediaItem from "@/components/media/item";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { uploadFile } from "@/utils/upload-file";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

const getGallery = graphql(`
  query GetGallery(
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

const uploadMedia = graphql(`
  mutation UploadMedia($input: CreateMediaInput!) {
    uploadMedia(input: $input) {
      media {
        id
        url
      }
      uploadUrl
    }
  }
`);

export default function Gallery() {
  const router = useRouter();

  const { data, loading, refetch, fetchMore } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string, first: 10 },
    skip: !getQueryParam(router.query.id),
  });

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.car.media.pageInfo.hasNextPage && !loading,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.car.media.edges &&
      fetchMore({
        variables: {
          after: data.car.media.edges[data.car.media.edges.length - 1]?.cursor,
        },
      }),
  });

  const [mutate] = useMutation(uploadMedia);

  const [uploadProgress, setUploadProgress] = useState<
    {
      id: string;
      progress: number;
      completed: boolean;
      error?: string;
    }[]
  >([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFileUpload = useCallback(
    withNotification({ title: "Uploading media..." }, async (file: File) => {
      const res = await mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id) as string,
          },
        },
      });

      if (!res.data?.uploadMedia) return;

      setUploadProgress((prev) => [
        ...prev,
        { id: res.data!.uploadMedia.media.id, completed: false, progress: 0 },
      ]);

      await uploadFile(
        file,
        res.data.uploadMedia.uploadUrl,
        "PUT",
        (progress) => {
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.id === res.data!.uploadMedia.media.id ? { ...p, progress } : p
            )
          );
        }
      );

      setUploadProgress((prev) =>
        prev.filter((p) => p.id !== res.data!.uploadMedia.media.id)
      );

      refetch();
    }),
    [mutate, router.query.id, refetch]
  );

  return (
    <CarLayout
      className="relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <div className="flex flex-col gap-4 container mx-auto p-4">
        <h1 className="text-3xl">Gallery</h1>
        <Tabs
          variant="underlined"
          selectedKey={
            router.pathname.includes("/albums") ? "albums" : "pictures"
          }
        >
          <Tab
            key="pictures"
            title={
              <div className="flex items-center space-x-2">
                <Images />
                <span>Pictures</span>
              </div>
            }
            href={`/cars/${router.query.id}/gallery`}
            as={Link}
          >
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data?.car?.media?.edges?.map((e) => (
                <MediaItem item={e!.node!} key={e!.node!.id} />
              ))}
              {uploadProgress.map((m) => (
                <div
                  className="p-4 h-[150px] md:h-[200px] lg:h-[250px] flex flex-col gap-2"
                  key={m.id}
                >
                  <Progress value={m.progress} />
                  <Skeleton className="rounded-xl h-full w-full" />
                </div>
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
            {!loading && data?.car.media.pageInfo.hasNextPage && (
              <div className="flex w-full justify-center mt-10">
                <Spinner ref={loaderRef} color="white" />
              </div>
            )}
          </Tab>
          <Tab
            key="albums"
            title={
              <div className="flex items-center space-x-2">
                <Album />
                <span>Albums</span>
              </div>
            }
            href={`/cars/${router.query.id}/gallery/albums`}
            as={Link}
          />
        </Tabs>

        <Dropzone
          multiple
          accept="image/*,video/*"
          icon={<ImageUp className="size-4 opacity-60" />}
          label="Drop your image here or click to browse"
          value={[]}
          onChange={(files) => {
            files.forEach(handleFileUpload);
          }}
        />
      </div>
    </CarLayout>
  );
}
