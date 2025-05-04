import { CardBody, CardHeader, CardProps, Spinner, cn } from "@heroui/react";
import { FragmentType, graphql, useFragment } from "@/gql";
import { HTMLMotionProps, motion } from "framer-motion";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "./card";
import { forwardRef } from "react";

export const TaskFieldsFragment = graphql(`
  fragment TaskFields on Task {
    id
    status
    title
    rank
  }
`);

export const TaskCard = forwardRef<
  HTMLDivElement,
  {
    task: FragmentType<typeof TaskFieldsFragment>;
  } & CardProps
>(({ task, className, ...props }, ref) => {
  const t = useFragment(TaskFieldsFragment, task);

  return (
    <KanbanCard ref={ref} className={cn("relative", className)} {...props}>
      {t.id === "" && (
        <div className="absolute top-0 left-0 w-full h-full bg-background/20 backdrop-blur-xs z-20 rounded-xl flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <CardHeader>
        <p className="text-base">{t.title}</p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-500">Rank: {t.rank}</p>
      </CardBody>
    </KanbanCard>
  );
});

TaskCard.displayName = "TaskCard";

export default function Task({
  task,
  ...props
}: {
  task: FragmentType<typeof TaskFieldsFragment>;
} & HTMLMotionProps<"div"> & {
    task: FragmentType<typeof TaskFieldsFragment>;
  }) {
  const t = useFragment(TaskFieldsFragment, task);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: t.id,
      data: { task },
    });

  const { setNodeRef: setDropRef } = useDroppable({
    id: t.id,
    data: { task },
  });

  return (
    <motion.div {...props}>
      <TaskCard
        task={task}
        ref={(node) => {
          setNodeRef(node);
          setDropRef(node);
        }}
        style={{
          transform: CSS.Translate.toString(transform),
        }}
        {...listeners}
        {...attributes}
        className={cn(isDragging && "opacity-0 pointer-events-none")}
        isPressable
      />
    </motion.div>
  );
}
