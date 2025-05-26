import { Button, Chip, Image, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import FileIcon from "@/components/file-icon";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

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

type Inputs = {
  title: string;
  mediaIds: Set<string>;
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

  const { data } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [mutate, { loading }] = useMutation(createAlbum);

  const { register, control, handleSubmit } = useForm<Inputs>({
    defaultValues: { mediaIds: new Set([]) },
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
            render={({ field: { value, onChange, ...field } }) => (
              <Select
                label="Media"
                labelPlacement="outside"
                classNames={{ innerWrapper: "py-4" }}
                variant="bordered"
                items={data?.car?.media ?? []}
                selectionMode="multiple"
                isMultiline
                renderValue={(items) => {
                  return (
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
                  );
                }}
                {...field}
                selectedKeys={value}
                onSelectionChange={onChange}
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
