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
  TaskFieldsFragment,
  TaskStatus,
  UpdateTaskMutation,
} from "@/gql/graphql";
import { TaskCard, TaskFields } from "./task";
import { Unmasked, useApolloClient, useMutation } from "@apollo/client";

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

export default function Kanban({ showSubtasks }: { showSubtasks: boolean }) {
  const router = useRouter();

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

    if (over.data.current?.task) {
      nextRank = over.data.current.task.rank;
      status = over.data.current.task.status;

      data = client.readQuery({
        query: getTasksByRank,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status, hasParent: showSubtasks ? undefined : false },
        },
      });

      const overTaskIdx =
        data?.car.tasks.edges?.findIndex((e) => e?.node?.id === over.id) ?? -1;

      if (data?.car.tasks.edges && overTaskIdx !== -1 && overTaskIdx > 0) {
        prevRank =
          data.car.tasks.edges[overTaskIdx - 1]?.node?.rank ?? prevRank;
      }

      getEdges = (res, edges) =>
        edges
          ?.toSpliced(overTaskIdx, 0, {
            node: res,
            cursor: "",
          })
          .filter((e) =>
            e?.node?.id === res.id
              ? e?.node?.rank !== active.data.current?.task.rank
              : true
          );
    } else if (over.id !== active.data.current?.task.status) {
      status = over.id as TaskStatus;

      data = client.readQuery({
        query: getTasksByRank,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status, hasParent: showSubtasks ? undefined : false },
        },
      });

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
          query: getTasksByRank,
          variables: {
            id: getQueryParam(router.query.id) as string,
            where: { status, hasParent: showSubtasks ? undefined : false },
          },
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
