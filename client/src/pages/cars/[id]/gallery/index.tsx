import { Album, ImageUp, Images } from "lucide-react";
import { Car, SubscriptionTier } from "@/gql/graphql";
import { ChangeEvent, DragEvent, useCallback, useRef, useState } from "react";
import { Progress, Skeleton, Tab, Tabs } from "@heroui/react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
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

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<
    {
      id: string;
      progress: number;
      completed: boolean;
      error?: string;
    }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

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

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        [...e.dataTransfer.files].forEach(handleFileUpload);
      }
    },
    [handleFileUpload]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        [...e.target.files].forEach(handleFileUpload);
      }
    },
    [handleFileUpload]
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

        <div className="flex flex-col gap-2">
          <div className="relative">
            {/* Drop area */}
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="cursor-pointer border-input hover:bg-secondary/20 data-[dragging=true]:bg-secondary/20 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                multiple
                className="sr-only"
                aria-label="Upload file"
                ref={inputRef}
              />
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageUp className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">
                  Drop your image here or click to browse
                </p>
              </div>
            </div>
          </div>

          {/* {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircle className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )} */}
        </div>
      </div>
    </CarLayout>
  );
}
