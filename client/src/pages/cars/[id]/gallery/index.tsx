import { Album, ImageUp, Images } from "lucide-react";
import { Car, SubscriptionTier } from "@/gql/graphql";
import { Progress, Skeleton, Tab, Tabs } from "@heroui/react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";

import CarLayout from "@/components/layout/car-layout";
import Dropzone from "@/components/dropzone";
import MediaItem from "@/components/media/item";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { uploadFile } from "@/utils/upload-file";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

const getGallery = graphql(`
  query GetGallery($id: ID!) {
    car(id: $id) {
      id
      media {
        id
        ...MediaItem
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

  const client = useApolloClient();

  const { data } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
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

      client.cache.modify<Car>({
        id: client.cache.identify({
          __typename: "Car",
          id: getQueryParam(router.query.id),
        }),
        fields: {
          media(existingMediaRefs, { toReference }) {
            return [
              ...(existingMediaRefs ?? []),
              toReference(res.data!.uploadMedia.media),
            ];
          },
        },
      });
    }),
    [mutate, router.query.id, client]
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
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.car?.media?.map((m) => (
                <MediaItem item={m} key={m.id} />
              ))}
              {uploadProgress.map((m) => (
                <div className="p-4 h-[400px] flex flex-col gap-2" key={m.id}>
                  <Progress value={m.progress} />
                  <Skeleton className="rounded-xl h-full w-full" />
                </div>
              ))}
            </div>
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
