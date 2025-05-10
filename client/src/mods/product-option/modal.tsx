import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Textarea,
} from "@heroui/react";
import { FragmentType, graphql, useFragment } from "@/gql";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { getModIdea } from "..";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";

export const ModProductOptionDetails = graphql(`
  fragment ModProductOptionDetails on ModProductOption {
    id
    vendor
    name
    link
    price
    notes
    pros
    cons
    specs
  }
`);

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

export default function ProductOptionModal({
  productOption,
  ideaId,
  onOpenChange,
  currencyCode,
  ...props
}: {
  productOption?: FragmentType<typeof ModProductOptionDetails>;
  ideaId: string;
  currencyCode: string;
} & Omit<ModalProps, "children">) {
  const po = useFragment(ModProductOptionDetails, productOption);

  const { register, handleSubmit, control, reset } = useForm<Inputs>({
    defaultValues: {
      pros: [{ value: "" }],
      cons: [{ value: "" }],
      specs: [{ key: "", value: "" }],
    },
  });

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

      const modIdeaData = cache.readQuery({
        query: getModIdea,
        variables: { id: ideaId },
      });

      if (!modIdeaData) return;

      cache.writeQuery({
        query: getModIdea,
        variables: { id: ideaId },
        data: {
          ...modIdeaData,
          modIdea: {
            ...modIdeaData.modIdea,
            productOptions: [
              ...(modIdeaData.modIdea.productOptions ?? []),
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

  const onSubmit = async (data: Inputs) => {
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

    if (po?.id) {
      await update({ variables: { id: po.id, input } });
    } else {
      await create({ variables: { input: { ...input, ideaID: ideaId } } });
    }

    onOpenChange?.(false);
  };

  return (
    <Modal
      scrollBehavior="inside"
      size="2xl"
      {...props}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {productOption ? "Edit product option" : "Add product option"}
            </ModalHeader>
            <ModalBody>
              <form
                id="product-option"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Input label="Vendor" {...register("vendor")} />
                <Input label="Name" {...register("name")} />
                <Input label="Link" {...register("link")} />
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" form="product-option">
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
