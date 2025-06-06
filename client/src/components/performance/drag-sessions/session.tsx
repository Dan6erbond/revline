import {
  Button,
  Card,
  CardBody,
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
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Gauge, Plus, Timer } from "lucide-react";
import {
  commonDragResultCombinations,
  resolveDragResultType,
} from "@/utils/drag-session";
import { useMutation, useSuspenseQuery } from "@apollo/client";

import { DragResultUnit } from "@/gql/graphql";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
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

const updateDragSession = graphql(`
  mutation UpdateDragSession($id: ID!, $input: UpdateDragSessionInput!) {
    updateDragSession(id: $id, input: $input) {
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

  const [mutate, { loading }] = useMutation(updateDragSession);

  const [mutateCreate] = useMutation(createDragResult, {
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
    mutateCreate({
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
    <div className="flex flex-col gap-4 container mx-auto">
      <h2 className="text-2xl">{data?.dragSession?.title}</h2>
      <MinimalTiptapEditor
        placeholder="Notes"
        throttleDelay={750}
        value={data.dragSession.notes}
        onChange={(c) => {
          mutate({
            variables: {
              id: router.query.tab![1],
              input: { notes: c },
            },
          });
        }}
        toolbarOptions={{
          endContent: (
            <div className="ml-auto">{loading && <Spinner size="sm" />}</div>
          ),
        }}
      />
      <div className="flex justify-between">
        <h3 className="text-xl">Results</h3>
        <Button isIconOnly variant="bordered" radius="full" onPress={onOpen}>
          <Plus />
        </Button>
      </div>
      {data.dragSession?.results
        ?.toSorted((a, b) => a.result - b.result)
        .map((r, index) => {
          const label =
            resolveDragResultType(r.unit, r.value) ?? `0-${r.value} ${r.unit}`;

          return (
            <Card
              key={r.id}
              className="bg-primary-50/5 border border-primary-100 rounded-xl shadow hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-primary-500" />
                    <span>{label}</span>
                  </div>
                  <span className="text-xs">#{index + 1}</span>
                </div>
              </CardHeader>

              <CardBody className="flex items-center justify-center py-6">
                <div className="text-3xl font-semibold text-primary-700 flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  {r.result.toFixed(2)}s
                </div>
              </CardBody>

              <CardFooter className="text-xs text-muted-foreground text-right pt-0">
                Run ID: {r.id.slice(0, 8)}
              </CardFooter>
            </Card>
          );
        })}

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
                    {commonDragResultCombinations.map((t) => (
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
