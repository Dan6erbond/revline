import { ArrowLeft, Plus } from "lucide-react";
import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
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
import { ProductOptionCard } from "./product-option/card";
import ProductOptionModal from "./product-option/modal";
import { TaskCard } from "@/components/project/task";
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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

      <ProductOptionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modId={id}
        currencyCode={currencyCode}
      />
    </div>
  );
}
