import { ArrowLeft, ImageUp, Trash } from "lucide-react";
import { Button, DropdownItem, Progress, Skeleton } from "@heroui/react";
import { Key, useCallback, useState } from "react";
import { ModProductOption, SubscriptionTier } from "@/gql/graphql";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import Dropzone from "@/components/dropzone";
import Link from "next/link";
import MediaItem from "@/components/media/item";
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
      id
      name
      mod {
        id
        title
      }
      media {
        id
        ...MediaItem
      }
      ...ModProductOptionDetails
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
          productOption={data.modProductOption}
          currencyCode={currencyCode}
          modId={getQueryParam(router.query["mod-id"]) as string}
          id="product-option"
          key={data.modProductOption.id}
        />
      )}

      <div className="flex justify-end">
        <Button color="primary" type="submit" form="product-option">
          Save
        </Button>
      </div>

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
    </CarLayout>
  );
}
