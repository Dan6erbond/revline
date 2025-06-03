import { Button, Input, Link, Textarea } from "@heroui/react";
import { ComponentProps, useEffect } from "react";
import { FragmentType, graphql, useFragment } from "@/gql";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { ModProductOptionDetails } from "./shared";
import { ModProductOptionDetailsFragment } from "@/gql/graphql";
import { getMod } from "..";
import { useMutation } from "@apollo/client";

const createModProductOption = graphql(`
  mutation CreateModProductOption($input: CreateModProductOptionInput!) {
    createModProductOption(input: $input) {
      id
      ...ModProductOptionDetails
    }
  }
`);

const updateModProductOption = graphql(`
  mutation UpdateModProductOption(
    $id: ID!
    $input: UpdateModProductOptionInput!
  ) {
    updateModProductOption(id: $id, input: $input) {
      id
      ...ModProductOptionDetails
    }
  }
`);

type Inputs = {
  vendor?: string;
  name?: string;
  link?: string;
  price?: number | null;
  notes?: string;
  pros: { value: string }[];
  cons: { value: string }[];
  specs: { key: string; value: string }[];
};

export default function ProductOptionForm({
  productOption,
  modId,
  currencyCode,
  onSubmit,
  ...props
}: {
  productOption?: FragmentType<typeof ModProductOptionDetails>;
  modId: string;
  currencyCode: string;
  onSubmit?(
    res:
      | ({
          __typename?: "ModProductOption";
          id: string;
        } & {
          " $fragmentRefs"?: {
            ModProductOptionDetailsFragment: ModProductOptionDetailsFragment;
          };
        })
      | undefined
  ): void;
} & ComponentProps<"form">) {
  const po = useFragment(ModProductOptionDetails, productOption);

  const { register, handleSubmit, control, reset, watch } = useForm<Inputs>({
    defaultValues: {
      pros: [{ value: "" }],
      cons: [{ value: "" }],
      specs: [{ key: "", value: "" }],
    },
  });

  const [link] = watch(["link"]);

  const {
    fields: prosFields,
    append: appendPro,
    remove: removePro,
  } = useFieldArray({ control, name: "pros" });
  const {
    fields: consFields,
    append: appendCon,
    remove: removeCon,
  } = useFieldArray({ control, name: "cons" });
  const {
    fields: specsFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });

  const [create] = useMutation(createModProductOption, {
    update: (cache, { data }) => {
      if (!data?.createModProductOption) return;

      const modData = cache.readQuery({
        query: getMod,
        variables: { id: modId },
      });

      if (!modData) return;

      cache.writeQuery({
        query: getMod,
        variables: { id: modId },
        data: {
          ...modData,
          mod: {
            ...modData.mod,
            productOptions: [
              ...(modData.mod.productOptions ?? []),
              data.createModProductOption,
            ],
          },
        },
      });
    },
  });
  const [update] = useMutation(updateModProductOption);

  useEffect(() => {
    if (!po) return;

    console.log({
      vendor: po.vendor || "",
      name: po.name || "",
      link: po.link || "",
      price: po.price || null,
      notes: po.notes || "",
      pros: ((po.pros as string[]) || []).map((p) => ({ value: p })),
      cons: ((po.cons as string[]) || []).map((c) => ({ value: c })),
      specs: po.specs
        ? Object.entries(po.specs).map(([key, value]) => ({
            key,
            value: value as string,
          }))
        : [],
    });

    reset({
      vendor: po.vendor || "",
      name: po.name || "",
      link: po.link || "",
      price: po.price || null,
      notes: po.notes || "",
      pros: ((po.pros as string[]) || []).map((p) => ({ value: p })),
      cons: ((po.cons as string[]) || []).map((c) => ({ value: c })),
      specs: po.specs
        ? Object.entries(po.specs).map(([key, value]) => ({
            key,
            value: value as string,
          }))
        : [],
    });
  }, [po, reset]);

  const onFormSubmit = async (data: Inputs) => {
    const input = {
      ...data,
      pros: data.pros.map((p) => p.value).filter(Boolean),
      cons: data.cons.map((c) => c.value).filter(Boolean),
      specs: Object.fromEntries(
        data.specs
          .filter(({ key }) => key)
          .map(({ key, value }) => [key, value])
      ),
    };

    let res:
      | ({
          __typename?: "ModProductOption";
          id: string;
        } & {
          " $fragmentRefs"?: {
            ModProductOptionDetailsFragment: ModProductOptionDetailsFragment;
          };
        })
      | undefined;
    if (po?.id) {
      res = (await update({ variables: { id: po.id, input } })).data
        ?.updateModProductOption;
    } else {
      res = (
        await create({
          variables: { input: { ...input, modID: modId } },
        })
      ).data?.createModProductOption;
    }

    onSubmit?.(res);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4"
      {...props}
    >
      <Input label="Name" {...register("name")} />
      <Input label="Vendor" {...register("vendor")} />
      <div className="flex gap-4">
        <Input label="Link" {...register("link")} />
        {link && (
          <Link href={link} isExternal color="secondary" showAnchorIcon />
        )}
      </div>
      <Input
        label="Price"
        endContent={currencyCode}
        {...register("price", { valueAsNumber: true })}
      />
      <Textarea label="Notes" {...register("notes")} />

      <div className="flex flex-col gap-2">
        <label className="font-medium">Pros</label>
        {prosFields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              {...register(`pros.${idx}.value`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  appendPro({ value: "" });
                  e.preventDefault();
                }
              }}
              className="flex-1"
            />
            <Button
              onPress={() => removePro(idx)}
              startContent={<MinusCircle />}
              isIconOnly
              color="danger"
              variant="light"
            />
          </div>
        ))}
        <Button
          variant="light"
          onPress={() => appendPro({ value: "" })}
          className="self-start"
          startContent={<PlusCircle />}
        >
          Add Pro
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Cons</label>
        {consFields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              {...register(`cons.${idx}.value`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  appendCon({ value: "" });
                  e.preventDefault();
                }
              }}
              className="flex-1"
            />
            <Button
              onPress={() => removeCon(idx)}
              startContent={<MinusCircle />}
              isIconOnly
              color="danger"
              variant="light"
            />
          </div>
        ))}
        <Button
          variant="light"
          onPress={() => appendCon({ value: "" })}
          className="self-start"
          startContent={<PlusCircle />}
        >
          Add Con
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Specs</label>
        {specsFields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              placeholder="Key"
              {...register(`specs.${idx}.key`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (
                    (
                      e.currentTarget as HTMLInputElement
                    ).parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children
                      .item(1)
                      ?.children.item(0)
                      ?.children.item(0)
                      ?.children.item(0)
                      ?.children.item(0) as HTMLElement
                  )?.focus();
                  e.preventDefault();
                }
              }}
              className="w-1/2"
            />
            <Input
              placeholder="Value"
              {...register(`specs.${idx}.value`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  appendSpec({ key: "", value: "" });
                  e.preventDefault();
                }
              }}
              className="w-1/2"
            />
            <Button
              onPress={() => removeSpec(idx)}
              startContent={<MinusCircle />}
              isIconOnly
              color="danger"
              variant="light"
            />
          </div>
        ))}
        <Button
          variant="light"
          onPress={() => appendSpec({ key: "", value: "" })}
          className="self-start"
          startContent={<PlusCircle />}
        >
          Add Spec
        </Button>
      </div>
    </form>
  );
}
