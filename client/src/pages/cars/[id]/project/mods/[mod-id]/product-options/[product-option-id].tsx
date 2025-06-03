import { ArrowLeft, ImageUp, Trash } from "lucide-react";
import { Button, DropdownItem, Progress, Skeleton } from "@heroui/react";
import { Key, useCallback, useState } from "react";
import MediaItem, { SelectableMediaItem } from "@/components/media/item";
import { ModProductOption, SubscriptionTier } from "@/gql/graphql";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import Dropzone from "@/components/dropzone";
import Image from "next/image";
import Link from "next/link";
import ProductOptionForm from "@/mods/product-option/form";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { uploadFile } from "@/utils/upload-file";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { withNotification } from "@/utils/with-notification";

const getModProductOption = graphql(`
  query GetModProductOption($id: ID!) {
    me {
      id
      settings {
        id
        currencyCode
      }
    }
    modProductOption(id: $id) {
      ...ModProductOptionDetails
      name
      mod {
        id
        title
      }
      media {
        id
        ...MediaItem
      }
    }
  }
`);

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

const updateModProductOption = graphql(`
  mutation UpdateModProductOptionWithMedia(
    $id: ID!
    $input: UpdateModProductOptionInput!
  ) {
    updateModProductOption(id: $id, input: $input) {
      id
      ...ModProductOptionDetails
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

export default function ProductOption() {
  const router = useRouter();
  const id = getQueryParam(router.query["product-option-id"]);

  const client = useApolloClient();

  const { data: session } = useSession();

  const { data, loading } = useQuery(getModProductOption, {
    variables: {
      id: id as string,
    },
    skip: !id,
  });

  const currencyCode = data?.me?.settings?.currencyCode ?? "USD";

  const { data: galleryData } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const [mutate] = useMutation(updateModProductOption);

  const [mutateUploadMedia] = useMutation(uploadMedia);

  const onMediaAction = (mediaId: string) => (key: Key) => {
    switch (key) {
      case "remove":
        if (!id) return;

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
      const res = await mutateUploadMedia({
        variables: {
          input: {
            modProductOptionID: id as string,
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

      client.cache.modify<ModProductOption>({
        id: client.cache.identify({
          __typename: "ModProductOption",
          id,
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
    [mutateUploadMedia, router.query.id, setUploadProgress, session, client]
  );

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-4 md:gap-6 relative container mx-auto"
      style={{
        minHeight: "calc(70vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <div className="flex gap-4 items-center">
        <Button
          as={Link}
          href={`/cars/${getQueryParam(
            router.query.id
          )}/project/mods/${getQueryParam(router.query["mod-id"])}`}
          size="sm"
          isIconOnly
          variant="ghost"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl">Edit Product Option</h1>
      </div>

      {loading && "Loading..."}

      {data?.modProductOption && (
        <ProductOptionForm
          productOption={data?.modProductOption}
          currencyCode={currencyCode}
          modId={getQueryParam(router.query["mod-id"]) as string}
        />
      )}

      <h3 className="font-medium">Media</h3>

      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.modProductOption.media?.map((m) => (
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
                Delete
              </DropdownItem>
            }
          />
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
      </div>

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

      <h3 className="text-2xl font-semibold">Preview</h3>

      <div className="bg-content3 text-content3-foreground border border-primary-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">How It Works</h2>
        <p className="text-sm mb-2">
          Select a photo of your car, and we&apos;ll use AI to generate a
          preview showing it with the{" "}
          <span className="font-medium text-primary">
            {data?.modProductOption.name} {data?.modProductOption.mod.title}
          </span>{" "}
          applied.
        </p>
        <p className="text-xs italic">
          🔒 Your photo stays private and is only used to generate the preview.
        </p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] overflow-x-auto">
        {galleryData?.car?.media?.map((m) => (
          <SelectableMediaItem
            key={m.id}
            item={m}
            selected={selectedId === m.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="border rounded-2xl p-4 bg-content1 shadow">
        <p className="text-sm text-content1-foreground mb-2">
          AI-Generated Preview
        </p>
        <div className="w-full aspect-video relative bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {/* <Skeleton className="w-full h-full" /> */}
          <Image
            src="/ai-wrap-preview.png"
            fill
            className="object-cover"
            alt="AI Preview"
          />
        </div>
      </div>

      <div className="text-center">
        <Button size="lg" className="px-8">
          Generate Preview
        </Button>
      </div>
    </CarLayout>
  );
}
