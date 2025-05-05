import {
  Button,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Textarea,
} from "@heroui/react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { useMutation, useSuspenseQuery } from "@apollo/client";

import { EnumSelect } from "../enum-select";
import { TaskFields } from "./task";
import { withNotification } from "@/utils/with-notification";

const getTask = graphql(`
  query GetTask($id: ID!) {
    me {
      id
      profile {
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
};

const updateTask = graphql(`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
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
  const { data } = useSuspenseQuery(getTask, {
    variables: { id },
  });

  const task = useFragment(TaskFields, data.task);

  const [mutate] = useMutation(updateTask);

  const currencyCode = data.me.profile?.currencyCode ?? "USD";

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: { ...task },
  });

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

          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerBody className="flex flex-col gap-6">
              <Input label="Title" isRequired {...register("title")} />

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
            </DrawerBody>

            <DrawerFooter className="flex justify-between">
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save Task
              </Button>
            </DrawerFooter>
          </form>
        </>
      )}
    </DrawerContent>
  );
}
