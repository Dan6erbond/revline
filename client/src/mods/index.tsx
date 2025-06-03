import { ArrowLeft, Plus } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { ModCategory, ModStatus } from "@/gql/graphql";
import {
  categoryColors,
  categoryIcons,
  categoryLabels,
  statusColors,
  statusIcons,
  statusLabels,
} from "@/mods/shared";
import { useMutation, useSuspenseQuery } from "@apollo/client";

import { EnumSelect } from "@/components/enum-select";
import Link from "next/link";
import MediaItem from "@/components/media/item";
import { ProductOptionCard } from "./product-option/card";
import ProductOptionModal from "./product-option/modal";
import { TaskCard } from "@/components/project/task";
import { createExtensions } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { generateHTML } from "@tiptap/react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

type Inputs = {
  title: string;
  category: ModCategory;
  status: ModStatus;
  description?: string | null;
  stage?: string | null;
};

export const getMod = graphql(`
  query GetMod($id: ID!) {
    me {
      id
      settings {
        id
        currencyCode
      }
    }
    mod(id: $id) {
      id
      title
      category
      status
      description
      stage
      productOptions {
        id
        ...ModProductOptionDetails
      }
      tasks {
        id
        ...TaskFields
      }
      buildLogs {
        id
        title
        notes
        media {
          id
          ...MediaItem
        }
        logTime
      }
    }
  }
`);

const updateMod = graphql(`
  mutation UpdateMod($id: ID!, $input: UpdateModInput!) {
    updateMod(id: $id, input: $input) {
      id
      title
      category
      status
      description
      stage
    }
  }
`);

export default function Mod({ id }: { id: string }) {
  const router = useRouter();

  const { data } = useSuspenseQuery(getMod, { variables: { id } });

  const currencyCode = data?.me?.settings?.currencyCode ?? "USD";

  const [mutate] = useMutation(updateMod);

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      title: data.mod.title,
      category: data.mod.category,
      status: data.mod.status,
      description: data.mod.description ?? "",
      stage: data.mod.stage ?? "",
    },
  });

  const onSubmit = withNotification(
    { title: "Saving mod ..." },
    (values: Inputs) =>
      mutate({
        variables: {
          id,
          input: values,
        },
      })
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-4 p-4 container mx-auto">
      <div className="flex gap-4 items-center">
        <Button
          as={Link}
          href={`/cars/${getQueryParam(router.query.id)}/project/mods`}
          size="sm"
          isIconOnly
          variant="ghost"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl">Edit Mod</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Title" variant="bordered" {...register("title")} />

        <EnumSelect
          label="Category"
          enumValues={ModCategory}
          labels={categoryLabels}
          icons={categoryIcons}
          chipColor={(c) => categoryColors[c]}
          variant="bordered"
          {...register("category", { required: true })}
        />

        <EnumSelect
          label="Status"
          enumValues={ModStatus}
          labels={statusLabels}
          icons={statusIcons}
          chipColor={(s) => statusColors[s]}
          variant="bordered"
          {...register("status", { required: true })}
        />

        <Textarea
          label="Description"
          variant="bordered"
          minRows={3}
          {...register("description")}
        />

        <Input label="Stage" variant="bordered" {...register("stage")} />

        <Button className="self-end" type="submit">
          Save Changes
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-2">Product Options</h2>
          <Button startContent={<Plus />} onPress={onOpen}>
            Add
          </Button>
        </div>
        {data.mod.productOptions && data.mod.productOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.mod.productOptions.map((option) => (
              <ProductOptionCard
                key={option.id}
                option={option}
                currencyCode={currencyCode}
                modId={id}
              />
            ))}
          </div>
        ) : (
          <p>No product options associated.</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        </div>
        {data.mod.tasks && data.mod.tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.mod.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p>No tasks associated.</p>
        )}
      </div>

      <section className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between">
          <h1 className="mb-10 text-xl font-semibold">Build Log</h1>

          {/* TODO: Implement add for mod */}
          {/* <Button
            startContent={<Plus />}
            onPress={onOpen}
            color="primary"
            variant="flat"
          >
            Add
          </Button> */}
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Divider
            orientation="vertical"
            className="absolute top-4 left-2 bg-content4"
          />
          {data?.mod?.buildLogs?.map((log) => (
            <div key={log.id} className="relative mb-10 pl-8">
              <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-foreground" />

              <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
                {log.title}
              </h4>

              <h5 className="text-md top-3 -left-34 rounded-xl tracking-tight text-muted-foreground xl:absolute">
                {log.logTime ? new Date(log.logTime).toLocaleDateString() : ""}
              </h5>

              <Card className="my-5 border-none shadow-none">
                <CardBody className="flex flex-col gap-4">
                  <div
                    className="prose text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: generateHTML(log.notes, createExtensions("")),
                    }}
                  />

                  {log.media && log.media.length > 0 && (
                    <div className="flex flex-nowrap gap-4 overflow-x-auto p-2">
                      {log.media?.map((m) => (
                        <MediaItem
                          item={m}
                          key={m.id}
                          className="aspect-square shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <ProductOptionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modId={id}
        currencyCode={currencyCode}
      />
    </div>
  );
}
