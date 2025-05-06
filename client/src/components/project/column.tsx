import { Button, CardHeader, Input, Spinner, cn } from "@heroui/react";
import { FragmentType, graphql } from "@/gql";
import React, { useState } from "react";
import Task, { TaskCard, TaskFields } from "./task";
import { useMutation, useQuery } from "@apollo/client";

import { KanbanCard } from "./card";
import { Plus } from "lucide-react";
import { TaskStatus } from "@/gql/graphql";
import { getQueryParam } from "@/utils/router";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/router";

export const getTasksByRank = graphql(`
  query GetTasksByRank($id: ID!, $where: TaskWhereInput) {
    car(id: $id) {
      id
      tasks(orderBy: [{ field: RANK }], where: $where) {
        edges {
          node {
            id
            rank
            ...TaskFields
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

export const createTask = graphql(`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      rank
      ...TaskFields
    }
  }
`);

export default function Column({
  title,
  status,
  activeTask,
  showSubtasks,
}: {
  title: string;
  status: TaskStatus;
  activeTask: (FragmentType<typeof TaskFields> & { id: string }) | null;
  showSubtasks: boolean;
}) {
  const router = useRouter();

  const { setNodeRef, isOver, over } = useDroppable({ id: status });

  const [isAdding, setIsAdding] = useState(false);

  const { data } = useQuery(getTasksByRank, {
    variables: {
      id: getQueryParam(router.query.id) as string,
      where: { status, hasParent: showSubtasks ? undefined : false },
    },
    skip: !getQueryParam(router.query.id),
  });

  const [mutate, { loading }] = useMutation(createTask, {
    refetchQueries: [
      {
        query: getTasksByRank,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status },
        },
      },
    ],
    update: (cache, res) => {
      if (!data?.car.tasks.edges || !res.data?.createTask) return;

      cache.writeQuery({
        query: getTasksByRank,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status },
        },
        data: {
          ...data,
          car: {
            ...data.car,
            tasks: {
              ...data.car.tasks,
              edges: [
                {
                  node: res.data.createTask,
                  cursor: "",
                },
                ...data.car.tasks.edges,
              ],
            },
          },
        },
      });
    },
  });

  return (
    data?.car.tasks.edges && (
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-xl shadow-inner p-4 flex flex-col gap-4 max-h-screen overflow-y-auto overflow-x-visible",
          isOver ? "bg-content4" : "bg-content2"
        )}
      >
        <div className="flex justify-between w-80">
          <h2 className="text-lg font-semibold text-content2-foreground">
            {title}
          </h2>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            radius="full"
            onPress={() => setIsAdding(true)}
          >
            <Plus size={18} />
          </Button>
        </div>
        {isAdding && (
          <KanbanCard
            as="form"
            onSubmit={(e) => {
              e.preventDefault();

              const target = e.currentTarget as unknown as HTMLFormElement;

              const formData = new FormData(target);
              const { title } = Object.fromEntries(formData.entries());

              let nextRank = 2000;

              if (data?.car.tasks.edges && data?.car.tasks.edges.length > 0) {
                nextRank = data.car.tasks.edges[0]?.node?.rank ?? nextRank;
              }

              mutate({
                variables: {
                  input: {
                    carID: getQueryParam(router.query.id) as string,
                    title: title.toString(),
                    status,
                    rank: nextRank / 2,
                  },
                },
                optimisticResponse: {
                  createTask: {
                    id: "",
                    title: title.toString(),
                    status,
                    rank: nextRank / 2,
                  },
                },
              }).then(() => {
                target.reset();
                setIsAdding(false);
              });
            }}
          >
            <CardHeader>
              <Input
                label="Title"
                name="title"
                endContent={loading && <Spinner />}
                disabled={loading}
              />
            </CardHeader>
          </KanbanCard>
        )}
        {data.car.tasks.edges
          ?.filter((e) => !!e)
          .map(
            ({ node: task }) =>
              task && (
                <React.Fragment key={task.id}>
                  {activeTask &&
                    over?.id === task.id &&
                    over.id !== activeTask.id && (
                      <TaskCard task={activeTask} className="opacity-30" />
                    )}
                  <Task task={task} layoutId={task.id} />
                </React.Fragment>
              )
          )}
        {over?.id === status && activeTask && (
          <TaskCard task={activeTask} className="opacity-30" />
        )}
      </div>
    )
  );
}
