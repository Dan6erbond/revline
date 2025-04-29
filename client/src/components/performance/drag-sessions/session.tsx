import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useSuspenseQuery } from "@apollo/client";

import { DragResultUnit } from "@/gql/graphql";
import { Plus } from "lucide-react";
import { graphql } from "@/gql";
import { useRouter } from "next/router";

const getDragSession = graphql(`
  query GetDragSession($id: ID!) {
    dragSession(id: $id) {
      id
      title
      notes
      results {
        id
        unit
        value
        result
      }
    }
  }
`);

type Inputs = {
  unit: DragResultUnit;
  value: number;
  result: number;
  notes?: string;
};

const createDragResult = graphql(`
  mutation CreateDragResult($input: CreateDragResultInput!) {
    createDragResult(input: $input) {
      id
      unit
      value
      result
    }
  }
`);

const MILE_TO_KM = 1.60934;

const commonTypes = [
  {
    unit: DragResultUnit.Km,
    value: MILE_TO_KM * 0.25,
    label: "¼ mile",
  },
  {
    unit: DragResultUnit.Km,
    value: MILE_TO_KM * 0.125,
    label: "⅛ mile",
  },
  {
    unit: DragResultUnit.Km,
    value: MILE_TO_KM * 0.5,
    label: "½ mile",
  },
  {
    unit: DragResultUnit.Kph,
    value: MILE_TO_KM * 60,
    label: "0-60mph",
  },
  {
    unit: DragResultUnit.Kph,
    value: MILE_TO_KM * 100,
    label: "0-100mph",
  },
  {
    unit: DragResultUnit.Kph,
    value: MILE_TO_KM * 120,
    label: "0-120mph",
  },
] as const;

function resolveDragResultType(unit: DragResultUnit, value: number) {
  return commonTypes.find((t) => t.unit === unit && t.value === value)?.label;
}

export default function Session() {
  const router = useRouter();

  const { data } = useSuspenseQuery(getDragSession, {
    variables: {
      id: router.query.tab![1],
    },
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, watch, setValue } = useForm<Inputs>({
    defaultValues: {},
  });

  const [unit, value] = watch(["unit", "value"]);

  const [mutate] = useMutation(createDragResult, {
    update(cache, res) {
      if (!res.data?.createDragResult || !data.dragSession) return;

      cache.writeQuery({
        query: getDragSession,
        variables: {
          id: router.query.tab![1],
        },
        data: {
          ...data,
          dragSession: {
            ...data.dragSession,
            results: [
              ...(data.dragSession.results ?? []),
              res.data.createDragResult,
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ unit, value, result }) => {
    mutate({
      variables: {
        input: {
          sessionID: router.query.tab![1],
          unit,
          value,
          result,
        },
      },
    }).then(() => {
      onClose();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">{data?.dragSession?.title}</h2>
      <form>
        <Textarea
          label="Notes"
          defaultValue={data.dragSession?.notes ?? undefined}
          isDisabled
          variant="bordered"
        />
      </form>
      <div className="flex justify-between">
        <h3 className="text-xl">Results</h3>
        <Button isIconOnly variant="bordered" radius="full" onPress={onOpen}>
          <Plus />
        </Button>
      </div>
      {data.dragSession?.results?.map((r) => (
        <Card key={r.id}>
          <CardHeader>
            {resolveDragResultType(r.unit, r.value) ?? `0-${r.value} ${r.unit}`}
          </CardHeader>
          <CardFooter>{r.result}s</CardFooter>
        </Card>
      ))}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Enter result</ModalHeader>
              <ModalBody>
                <form
                  id="result-form"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {commonTypes.map((t) => (
                      <Chip
                        key={t.label}
                        as={
                          t.unit === unit && t.value === value
                            ? undefined
                            : Button
                        }
                        color="primary"
                        variant={
                          t.unit === unit && t.value === value
                            ? "solid"
                            : "faded"
                        }
                        onPress={
                          t.unit === unit && t.value === value
                            ? undefined
                            : () => {
                                setValue("unit", t.unit);
                                setValue("value", t.value);
                              }
                        }
                        onClose={
                          t.unit === unit && t.value === value
                            ? () => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                setValue("unit", null as any);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                setValue("value", null as any);
                              }
                            : undefined
                        }
                      >
                        {t.label}
                      </Chip>
                    ))}
                  </div>
                  {resolveDragResultType(unit, value) ? null : (
                    <>
                      <Controller
                        control={control}
                        name="unit"
                        render={({ field: { value, ...field } }) => (
                          <Select
                            label="Unit"
                            selectedKeys={[value]}
                            {...field}
                            variant="bordered"
                          >
                            <SelectItem key={DragResultUnit.Km}>
                              Distance
                            </SelectItem>
                            <SelectItem key={DragResultUnit.Kph}>
                              Speed
                            </SelectItem>
                          </Select>
                        )}
                      />
                      <Controller
                        control={control}
                        name="value"
                        render={({ field: { onChange, ...field } }) => (
                          <NumberInput
                            label="Value"
                            endContent={unit}
                            {...field}
                            onValueChange={onChange}
                            variant="bordered"
                          />
                        )}
                      />
                    </>
                  )}
                  <Controller
                    control={control}
                    name="result"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Result"
                        endContent={"s"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="result-form">
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
