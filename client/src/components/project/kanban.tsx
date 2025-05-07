import Column, { getTasksByRank } from "./column";
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
  GetTasksByRankQueryVariables,
  TaskFieldsFragment,
  TaskStatus,
  UpdateTaskMutation,
} from "@/gql/graphql";
import { TaskCard, TaskFields } from "./task";
import {
  Unmasked,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";

import { DataProxy } from "@apollo/client/cache";
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
    let getEdges: (
      res: Unmasked<UpdateTaskMutation>["updateTask"],
      edges: Required<GetTasksByRankQuery["car"]["tasks"]["edges"]>
    ) => GetTasksByRankQuery["car"]["tasks"]["edges"];

    let queryOptions: DataProxy.Query<
      GetTasksByRankQueryVariables,
      GetTasksByRankQuery
    >;

    if (over.data.current?.task) {
      nextRank = over.data.current.task.rank;
      status = over.data.current.task.status;

      queryOptions = {
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

      const newEdges = data?.car.tasks.edges?.filter((e) =>
        e?.node?.id === active.id
          ? e?.node?.rank !== active.data.current?.task.rank
          : true
      );

      const overTaskIdx =
        data?.car.tasks.edges?.findIndex((e) => e?.node?.id === over.id) ?? -1;

      if (data?.car.tasks.edges && overTaskIdx !== -1 && overTaskIdx > 0) {
        prevRank =
          data.car.tasks.edges[overTaskIdx - 1]?.node?.rank ?? prevRank;
      }

      getEdges = (res) =>
        newEdges?.toSpliced(overTaskIdx, 0, {
          node: res,
          cursor: "",
        });
    } else if (over.id !== active.data.current?.task.status) {
      status = over.id as TaskStatus;

      queryOptions = {
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

      getEdges = (res, edges) => [
        ...(edges ?? []),
        {
          node: res,
          cursor: "",
        },
      ];
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
      update: (proxy, res) => {
        if (!data?.car.tasks.edges || !res.data?.updateTask) return;

        proxy.writeQuery({
          ...queryOptions,
          data: {
            car: {
              ...data.car,
              tasks: {
                ...data.car.tasks,
                edges: getEdges(res.data.updateTask, data.car.tasks.edges),
              },
            },
          },
        });
      },
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
