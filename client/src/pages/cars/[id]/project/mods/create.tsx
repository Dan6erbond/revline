import { Button, Input, Textarea } from "@heroui/react";
import { ModCategory, SubscriptionTier } from "@/gql/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import { categoryColors, categoryIcons, categoryLabels } from "@/mods/shared";

import CarLayout from "@/components/layout/car-layout";
import { EnumSelect } from "@/components/enum-select";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

type Inputs = {
  title: string;
  category: ModCategory;
  description?: string | null;
  stage?: string | null;
};

const NewMod = graphql(`
  fragment NewMod on Mod {
    id
    car {
      id
    }
  }
`);

const createMod = graphql(`
  mutation CreateMod($input: CreateModInput!) {
    createMod(input: $input) {
      id
      ...NewMod
    }
  }
`);

export default function Create() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();

  const carId = getQueryParam(router.query.id);

  const [mutate] = useMutation(createMod, {
    update: (cache, { data }) => {
      if (!data?.createMod) return;

      const newModRef = cache.writeFragment({
        data: data.createMod,
        fragment: NewMod,
        fragmentName: "NewMod",
      });

      cache.modify({
        id: cache.identify(data.createMod.car),
        fields: {
          mods(existingRefs = []) {
            return [...existingRefs, newModRef];
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({
    title,
    category,
    description,
    stage,
  }) => {
    mutate({
      variables: {
        input: { title, category, description, stage, carID: carId as string },
      },
    }).then(({ data }) => {
      if (!data) return;
      router.push(`/cars/${carId}/project/mods/${data.createMod.id}`);
    });
  };

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-2 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <div className="flex flex-col gap-4 p-4 container mx-auto">
        <h1 className="text-2xl">Create Mod</h1>
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
            Create
          </Button>
        </form>
      </div>
    </CarLayout>
  );
}
