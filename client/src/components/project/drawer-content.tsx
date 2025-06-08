import {
  Button,
  Chip,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { ChevronRight, X } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  TaskCategory,
  TaskDifficulty,
  TaskEffort,
  TaskPriority,
  TaskStatus,
} from "@/gql/graphql";
import {
  categoryColors,
  categoryIcons,
  categoryLabels,
  difficultyColors,
  difficultyIcons,
  difficultyLabels,
  effortColors,
  effortIcons,
  effortLabels,
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "./shared";
import { graphql, useFragment } from "@/gql";
import { useMutation, useQuery, useSuspenseQuery } from "@apollo/client";

import { EnumSelect } from "../enum-select";
import { Key } from "react";
import Link from "next/link";
import ModsPicker from "@/mods/picker";
import { TaskFields } from "./task";
import { getQueryParam } from "@/utils/router";
import { getTasksByRank } from "./column";
import { useRouter } from "next/router";
import { useUnits } from "@/hooks/use-units";
import { withNotification } from "@/utils/with-notification";

const getTask = graphql(`
  query GetTask($id: ID!) {
    me {
      id
      settings {
        id
        currencyCode
      }
    }
    task(id: $id) {
      ...TaskFields
    }
  }
`);

type Inputs = {
  title: string;
  status: TaskStatus;
  description: string | null;
  partsNeeded: string | null;
  estimate: number | null;
  budget: number | null;
  effort: TaskEffort | null;
  difficulty: TaskDifficulty | null;
  category: TaskCategory | null;
  priority: TaskPriority | null;
  parentId?: string | null;
  subTaskIds?: string[] | null;
  modIds: string[];
};

const updateTaskDetails = graphql(`
  mutation UpdateTaskDetails($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
    }
  }
`);

export const getTasks = graphql(`
  query GetTasks($id: ID!, $where: TaskWhereInput) {
    car(id: $id) {
      id
      tasks(where: $where) {
        edges {
          node {
            id
            title
            category
            budget
            estimate
            parent {
              id
              title
              category
              budget
              estimate
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`);

export default function TaskDrawerContent({
  id,
  onClose,
}: {
  id: string;
  onClose(): void;
}) {
  const router = useRouter();

  const { data } = useSuspenseQuery(getTask, {
    variables: { id },
  });

  const { data: tasksData } = useQuery(getTasks, {
    variables: {
      id: getQueryParam(router.query.id) as string,
      where: {
        or: [{ hasParent: false }, { hasParentWith: [{ id }] }],
        idNEQ: id,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: !getQueryParam(router.query.id),
  });

  const task = useFragment(TaskFields, data.task);

  const [mutate] = useMutation(updateTaskDetails, {
    refetchQueries: [getTasks, getTasksByRank],
  });

  const { currencyCode } = useUnits(data.me?.settings);

  const { register, handleSubmit, watch, control, setValue } = useForm<Inputs>({
    defaultValues: {
      ...task,
      parentId: task.parent?.id,
      subTaskIds: task.subtasks?.map((st) => st.id) ?? [],
      modIds: task.mods?.map((mi) => mi.id) ?? [],
    },
  });

  const [parentId, subTaskIds] = watch(["parentId", "subTaskIds"]);

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    {},
    async ({
      title,
      description,
      status,
      estimate,
      category,
      budget,
      priority,
      effort,
      difficulty,
      partsNeeded,
      parentId,
      subTaskIds,
      modIds,
    }: Inputs) => {
      mutate({
        variables: {
          id,
          input: {
            title,
            description,
            status,
            estimate,
            category,
            budget,
            priority,
            effort,
            difficulty,
            partsNeeded,
            parentID: parentId ? parentId : null,
            clearParent: parentId === null,
            addSubtaskIDs: subTaskIds?.filter(
              (id) => task.subtasks?.findIndex((st) => st.id === id) === -1
            ),
            removeSubtaskIDs: task.subtasks
              ?.filter((st) => !subTaskIds?.includes(st.id))
              .map((st) => st.id),
            addModIDs: modIds?.filter(
              (id) => task.mods?.findIndex((mi) => mi.id === id) === -1
            ),
            removeModIDs: task.mods
              ?.filter((mi) => !modIds?.includes(mi.id))
              .map((st) => st.id),
          },
        },
      }).then(onClose);
    },
    {}
  );

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Edit Task</h2>
            <span className="text-sm text-muted-foreground">
              Update details below
            </span>
          </DrawerHeader>

          <DrawerBody>
            <form
              id="task"
              className="flex-1 flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input label="Title" isRequired {...register("title")} />

              <div className="flex gap-2 items-end">
                <Select
                  label="Parent"
                  labelPlacement="outside"
                  classNames={{ innerWrapper: "py-4" }}
                  items={
                    tasksData?.car.tasks.edges
                      ?.filter(
                        (e) => e?.node && !subTaskIds?.includes(e.node.id)
                      )
                      .map((e) => e!.node!) ?? []
                  }
                  renderValue={(items) => (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const Icon =
                          item.data?.category &&
                          categoryIcons[item.data.category];
                        return (
                          <Chip
                            key={item.key}
                            startContent={
                              Icon ? (
                                <Icon className="w-3.5 h-3.5" />
                              ) : undefined
                            }
                          >
                            {item.data?.title}
                          </Chip>
                        );
                      })}
                    </div>
                  )}
                  selectedKeys={parentId ? [parentId] : []}
                  {...register("parentId")}
                >
                  {({ id, title, category, estimate, budget }) => (
                    <SelectItem key={id} textValue={title}>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{title}</span>
                        <div className="text-xs text-default-500 flex flex-wrap gap-3">
                          {category && <span>Category: {category}</span>}
                          {estimate && <span>Est.: {estimate}</span>}
                          {budget && (
                            <span>
                              Budget: {budget.toLocaleString()} {currencyCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>

                {parentId && (
                  <>
                    <Button
                      isIconOnly
                      as={Link}
                      href={`/cars/${router.query.id}/project/${parentId}`}
                      shallow
                      variant="light"
                    >
                      <ChevronRight size={16} />
                    </Button>

                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => setValue("parentId", null)}
                    >
                      <X size={16} />
                    </Button>
                  </>
                )}
              </div>

              <Textarea
                label="Description"
                minRows={3}
                {...register("description")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Time Estimate"
                  placeholder="e.g. 1.5 hours"
                  type="number"
                  step="0.1"
                  endContent="h"
                  {...register("estimate", { valueAsNumber: true })}
                />

                <EnumSelect
                  label="Category"
                  enumValues={TaskCategory}
                  labels={categoryLabels}
                  icons={categoryIcons}
                  chipColor={(c) => categoryColors[c]}
                  {...register("category")}
                />

                <EnumSelect
                  label="Priority"
                  enumValues={TaskPriority}
                  labels={priorityLabels}
                  icons={priorityIcons}
                  chipColor={(p) => priorityColors[p]}
                  {...register("priority")}
                />

                <EnumSelect
                  label="Effort"
                  enumValues={TaskEffort}
                  labels={effortLabels}
                  icons={effortIcons}
                  chipColor={(e) => effortColors[e]}
                  {...register("effort")}
                />

                <EnumSelect
                  label="Difficulty"
                  enumValues={TaskDifficulty}
                  labels={difficultyLabels}
                  icons={difficultyIcons}
                  chipColor={(d) => difficultyColors[d]}
                  {...register("difficulty")}
                />

                <Input
                  label="Budget"
                  type="number"
                  step="10"
                  endContent={currencyCode}
                  {...register("budget", { valueAsNumber: true })}
                />
              </div>

              <Textarea
                label="Parts Needed"
                placeholder="List parts needed for this task"
                minRows={2}
                {...register("partsNeeded")}
              />

              <Controller
                control={control}
                name="subTaskIds"
                render={({ field: { value, onChange } }) => {
                  const availableTasks =
                    tasksData?.car.tasks.edges
                      ?.filter(
                        (e) =>
                          e?.node &&
                          e.node.id !== parentId &&
                          (e.node.parent?.id === task.id ||
                            e.node.parent == null) &&
                          !value?.includes(e.node.id) // prevent re-selecting
                      )
                      .map((e) => e!.node!) ?? [];

                  const handleSelect = (key: Key) => {
                    if (!value?.includes(key.toString())) {
                      onChange([...(value ?? []), key]);
                    }
                  };

                  const handleRemove = (idToRemove: string) => {
                    onChange(value?.filter((id) => id !== idToRemove));
                  };

                  return (
                    <div className="flex flex-col gap-4">
                      <p>Subtasks</p>

                      {value && value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {value.map((subtaskId) => {
                            const st = tasksData?.car.tasks.edges?.find(
                              (e) => e?.node?.id === subtaskId
                            )?.node;
                            if (!st) return null;

                            const Icon =
                              st.category && categoryIcons[st.category];

                            return (
                              <Chip
                                key={st.id}
                                startContent={
                                  Icon ? (
                                    <Icon className="w-3.5 h-3.5" />
                                  ) : undefined
                                }
                                endContent={
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                    onPress={() => handleRemove(st.id)}
                                    isIconOnly
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                    radius="full"
                                    className="h-6"
                                  >
                                    <X size={12} />
                                  </Button>
                                }
                                as={Link}
                                href={`/cars/${router.query.id}/project/${st.id}`}
                              >
                                {st.title}
                              </Chip>
                            );
                          })}
                        </div>
                      )}

                      <Select
                        placeholder="Add"
                        classNames={{ innerWrapper: "py-4" }}
                        items={availableTasks}
                        selectedKeys={new Set()}
                        onSelectionChange={(keys) => {
                          const key = Array.from(keys)[0];
                          if (key) handleSelect(key);
                        }}
                      >
                        {({ id, title, category, estimate, budget }) => (
                          <SelectItem key={id} textValue={title}>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium">
                                {title}
                              </span>
                              <div className="text-xs text-default-500 flex flex-wrap gap-3">
                                {category && <span>Category: {category}</span>}
                                {estimate && <span>Est.: {estimate}</span>}
                                {budget && (
                                  <span>
                                    Budget: {budget.toLocaleString()}{" "}
                                    {currencyCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  );
                }}
              />

              <Controller
                control={control}
                name="modIds"
                render={({ field: { value, onChange } }) => (
                  <fieldset className="space-y-4">
                    <legend>Mods</legend>

                    <ModsPicker value={value} onChange={onChange} />
                  </fieldset>
                )}
              />
            </form>
          </DrawerBody>

          <DrawerFooter className="flex justify-between">
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" form="task">
              Save Task
            </Button>
          </DrawerFooter>
        </>
      )}
    </DrawerContent>
  );
}
