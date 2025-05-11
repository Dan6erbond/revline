import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { categoryColors, categoryIcons, categoryLabels } from "@/mods/shared";
import { useMutation, useSuspenseQuery } from "@apollo/client";

import { EnumSelect } from "../components/enum-select";
import { ModCategory } from "@/gql/graphql";
import { Plus } from "lucide-react";
import { ProductOptionCard } from "./product-option/card";
import ProductOptionModal from "./product-option/modal";
import { TaskCard } from "../components/project/task";
import { graphql } from "@/gql";
import { useForm } from "react-hook-form";
import { withNotification } from "../utils/with-notification";

type Inputs = {
  title: string;
  category: ModCategory;
  description?: string | null;
  stage?: string | null;
};

export const getModIdea = graphql(`
  query GetModIdea($id: ID!) {
    me {
      id
      settings {
        id
        currencyCode
      }
    }
    modIdea(id: $id) {
      id
      title
      category
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

const updateModIdea = graphql(`
  mutation UpdateModIdea($id: ID!, $input: UpdateModIdeaInput!) {
    updateModIdea(id: $id, input: $input) {
      id
    }
  }
`);
export default function ModIdea({ id }: { id: string }) {
  const { data } = useSuspenseQuery(getModIdea, { variables: { id } });

  const currencyCode = data?.me?.settings?.currencyCode ?? "USD";

  const [mutate] = useMutation(updateModIdea);

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      title: data.modIdea.title,
      category: data.modIdea.category,
      description: data.modIdea.description ?? "",
      stage: data.modIdea.stage ?? "",
    },
  });

  const onSubmit = withNotification(
    { title: "Saving mod idea..." },
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
      <h1 className="text-2xl">Edit Mod Idea</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
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
        {data.modIdea.productOptions &&
        data.modIdea.productOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.modIdea.productOptions.map((option) => (
              <ProductOptionCard
                key={option.id}
                option={option}
                currencyCode={currencyCode}
                ideaId={id}
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
        {data.modIdea.tasks && data.modIdea.tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.modIdea.tasks.map((task) => (
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
        ideaId={id}
        currencyCode={currencyCode}
      />
    </div>
  );
}
