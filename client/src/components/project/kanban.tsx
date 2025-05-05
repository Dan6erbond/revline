import Column, { getTasks } from "./column";
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
import { TaskCard, TaskFields } from "./task";
import { TaskFieldsFragment, TaskStatus } from "@/gql/graphql";
import { useApolloClient, useMutation } from "@apollo/client";

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

export default function Kanban() {
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
    refetchQueries: [getTasks],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (over.data.current?.task) {
      const data = client.readQuery({
        query: getTasks,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status: over.data.current.task.status },
        },
      });

      const overTaskIdx =
        data?.car.tasks.edges?.findIndex((e) => e?.node?.id === over.id) ?? -1;

      let prevRank = 0;

      if (data?.car.tasks.edges && overTaskIdx !== -1 && overTaskIdx > 0) {
        prevRank =
          data.car.tasks.edges[overTaskIdx - 1]?.node?.rank ?? prevRank;
      }

      const status = over.data.current.task.status;
      const rank = (prevRank + over.data.current.task.rank) / 2;

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
            ...(active.data.current as TaskFieldsFragment),
            status,
            rank,
          },
        },
        update: (proxy, res) => {
          if (!data?.car.tasks.edges || !res.data?.updateTask) return;

          proxy.writeQuery({
            query: getTasks,
            variables: {
              id: getQueryParam(router.query.id) as string,
              where: { status: over.data.current?.task.status },
            },
            data: {
              car: {
                ...data.car,
                tasks: {
                  ...data.car.tasks,
                  edges: data.car.tasks.edges
                    .toSpliced(overTaskIdx, 0, {
                      node: res.data.updateTask,
                      cursor: "",
                    })
                    .filter((e) =>
                      e?.node?.id === res.data?.updateTask.id
                        ? e?.node?.rank !== active.data.current?.task.rank
                        : true
                    ),
                },
              },
            },
          });
        },
      });
    } else if (over.id !== active.data.current?.task.status) {
      const data = client.readQuery({
        query: getTasks,
        variables: {
          id: getQueryParam(router.query.id) as string,
          where: { status: over.id as TaskStatus },
        },
      });

      let prevRank = 0;

      if (data?.car.tasks.edges && data.car.tasks.edges.length > 0) {
        prevRank =
          data?.car.tasks.edges[data.car.tasks.edges.length - 1]?.node?.rank ??
          prevRank;
      }

      const status = over.id as TaskStatus;
      const rank = prevRank + 1000;

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
            ...(active.data.current as TaskFieldsFragment),
            status,
            rank,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
        update: (proxy, res) => {
          if (!data?.car.tasks.edges || !res.data?.updateTask) return;

          proxy.writeQuery({
            query: getTasks,
            variables: {
              id: getQueryParam(router.query.id) as string,
              where: { status: over.data.current?.task.status },
            },
            data: {
              car: {
                ...data.car,
                tasks: {
                  ...data.car.tasks,
                  edges: [
                    ...data.car.tasks.edges,
                    {
                      node: res.data.updateTask,
                      cursor: "",
                    },
                  ],
                },
              },
            },
          });
        },
      });
    }

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
      <div className="w-full overflow-x-auto">
        <div
          className="inline-flex gap-4 md:gap-8 p-4 md:p-8"
          style={{ minHeight: "calc(70vh - 5rem" }}
        >
          {Object.entries(TaskStatus).map(([title, status]) => (
            <Column
              title={title}
              status={status}
              key={status}
              activeTask={activeTask}
            />
          ))}
        </div>
      </div>

      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
}
