import Column, { getTasksByRank } from "./column";
import {
  DefaultContext,
  MutationUpdaterFunction,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FragmentType, graphql } from "@/gql";
import {
  GetTasksByRankQuery,
  TaskFieldsFragment,
  TaskStatus,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/gql/graphql";
import { TaskCard, TaskFields } from "./task";

import { ApolloCache } from "@apollo/client/cache";
import { Switch } from "@heroui/react";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";
import { useState } from "react";

const updateTask = graphql(`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
    }
  }
`);

const getCarShowSubtasks = graphql(`
  query GetCarShowSubtasks($id: ID!) {
    car(id: $id) {
      id
      showSubtasks @client
    }
  }
`);

export default function Kanban() {
  const router = useRouter();

  const { data } = useQuery(getCarShowSubtasks, {
    variables: {
      id: getQueryParam(router.query.id) as string,
    },
  });
  const showSubtasks = data?.car.showSubtasks ?? false;

  const client = useApolloClient();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor)
  );

  const [activeTask, setActiveTask] = useState<
    (FragmentType<typeof TaskFields> & { id: string }) | null
  >(null);

  const [mutate] = useMutation(updateTask, {
    refetchQueries: [getTasksByRank],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    let [prevRank, nextRank] = [0, 0];
    let status: TaskStatus;
    let data: GetTasksByRankQuery | null;
    let update: MutationUpdaterFunction<
      UpdateTaskMutation,
      UpdateTaskMutationVariables,
      DefaultContext,
      ApolloCache<object>
    >;

    if (over.data.current?.task) {
      nextRank = over.data.current.task.rank;
      status = over.data.current.task.status;
      const oldStatus = active.data.current?.task.status as TaskStatus;

      const queryOptions = {
        query: getTasksByRank,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: {
            status,
            hasParent: showSubtasks ? undefined : false,
          },
        },
      };
      data = client.readQuery(queryOptions);

      const newEdges = data?.car.tasks.edges?.filter(
        (e) => e?.node?.id !== active.id
      );

      const overTaskIdx =
        newEdges?.findIndex((e) => e?.node?.id === over.id) ?? -1;

      if (newEdges && overTaskIdx > 0) {
        prevRank = newEdges[overTaskIdx - 1]?.node?.rank ?? prevRank;
      }

      update = (proxy, res) => {
        if (!data?.car.tasks || !newEdges || !res.data?.updateTask) return;

        if (status !== active.data.current?.task.status) {
          const oldStatusQueryOptions = {
            ...queryOptions,
            variables: {
              ...queryOptions.variables,
              where: { ...queryOptions.variables.where, status: oldStatus },
            },
          };

          const oldStatusData = proxy.readQuery(oldStatusQueryOptions);

          if (oldStatusData) {
            proxy.writeQuery({
              ...oldStatusQueryOptions,
              data: {
                ...oldStatusData,
                car: {
                  ...oldStatusData.car,
                  tasks: {
                    ...oldStatusData.car.tasks,
                    edges: (oldStatusData.car.tasks.edges ?? []).filter(
                      (e) => e?.node?.id !== res.data?.updateTask.id
                    ),
                  },
                },
              },
            });
          }
        }

        proxy.writeQuery({
          ...queryOptions,
          data: {
            car: {
              ...data.car,
              tasks: {
                ...data.car.tasks,
                edges: newEdges?.toSpliced(overTaskIdx, 0, {
                  __typename: "TaskEdge",
                  node: res.data.updateTask,
                  cursor: "",
                }),
              },
            },
          },
        });
      };
    } else if (Object.values(TaskStatus).includes(over.id as TaskStatus)) {
      status = over.id as TaskStatus;
      const oldStatus = active.data.current?.task.status as TaskStatus;

      const queryOptions = {
        query: getTasksByRank,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status, hasParent: showSubtasks ? undefined : false },
        },
      };
      data = client.readQuery(queryOptions);

      if (data?.car.tasks.edges && data.car.tasks.edges.length > 0) {
        prevRank =
          data?.car.tasks.edges[data.car.tasks.edges.length - 1]?.node?.rank ??
          prevRank;
      }

      nextRank = prevRank + 2000;

      update = (proxy, res) => {
        if (!data?.car.tasks.edges || !res.data?.updateTask) return;

        if (oldStatus !== status) {
          const oldStatusQueryOptions = {
            ...queryOptions,
            variables: {
              ...queryOptions.variables,
              where: { ...queryOptions.variables.where, status: oldStatus },
            },
          };

          const oldStatusData = proxy.readQuery(oldStatusQueryOptions);

          if (oldStatusData) {
            proxy.writeQuery({
              ...oldStatusQueryOptions,
              data: {
                ...oldStatusData,
                car: {
                  ...oldStatusData.car,
                  tasks: {
                    ...oldStatusData.car.tasks,
                    edges: (oldStatusData.car.tasks.edges ?? []).filter(
                      (e) => e?.node?.id !== res.data?.updateTask.id
                    ),
                  },
                },
              },
            });
          }
        }

        proxy.writeQuery({
          ...queryOptions,
          data: {
            car: {
              ...data.car,
              tasks: {
                ...data.car.tasks,
                edges: [
                  ...(data.car.tasks.edges ?? []).filter(
                    (e) => e?.node?.id !== res.data?.updateTask.id
                  ),
                  {
                    __typename: "TaskEdge",
                    node: res.data.updateTask,
                    cursor: "",
                  },
                ],
              },
            },
          },
        });
      };
    } else {
      console.log("Unknown drop object:", event.over);
      return;
    }

    if (!data) {
      console.warn("No data found", status);
    }

    const rank = (prevRank + nextRank) / 2;

    mutate({
      variables: {
        id: active.id.toString(),
        input: {
          status,
          rank,
        },
      },
      optimisticResponse: {
        updateTask: {
          ...(active.data.current?.task as TaskFieldsFragment),
          status,
          rank,
        },
      },
      update,
    });

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      /* collisionDetection={closestCorners} */
      onDragStart={({ active }) => {
        setActiveTask(active.data.current?.task || null);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveTask(null);
      }}
    >
      <div className="flex justify-between">
        <h1 className="text-2xl">Kanban</h1>

        <Switch
          size="sm"
          isSelected={showSubtasks}
          onValueChange={(val) => {
            client.writeQuery({
              query: getCarShowSubtasks,
              variables: {
                id: getQueryParam(router.query.id) as string,
              },
              data: {
                ...data,
                car: {
                  ...data?.car,
                  showSubtasks: val,
                },
              },
            });
          }}
        >
          Show subtasks
        </Switch>
      </div>

      <div className="w-full overflow-x-auto flex-1 flex items-stretch flex-nowrap pb-4">
        <div className="inline-flex gap-4 md:gap-8 min-w-full min-h-full justify-center shrink-0">
          {[
            TaskStatus.Backlog,
            TaskStatus.Blocked,
            TaskStatus.Todo,
            TaskStatus.InProgress,
            TaskStatus.Completed,
          ].map((status) => (
            <Column
              status={status}
              key={status}
              activeTask={activeTask}
              showSubtasks={showSubtasks}
            />
          ))}
        </div>
      </div>

      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
}
