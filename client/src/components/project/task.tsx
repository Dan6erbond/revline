import { CardBody, CardHeader, CardProps, Spinner, cn } from "@heroui/react";
import { FragmentType, graphql, useFragment } from "@/gql";
import { HTMLMotionProps, motion } from "framer-motion";
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
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { EnumChip } from "../enum-select";
import { KanbanCard } from "./card";
import Link from "next/link";
import { forwardRef } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useUnits } from "@/hooks/use-units";

export const TaskFields = graphql(`
  fragment TaskFields on Task {
    id
    status
    title
    description
    rank
    effort
    estimate
    difficulty
    category
    priority
    partsNeeded
    budget
    parent {
      id
      status
      title
      description
      rank
      effort
      estimate
      difficulty
      category
      priority
      partsNeeded
      budget
    }
    subtasks {
      id
      status
      title
      description
      rank
      effort
      estimate
      difficulty
      category
      priority
      partsNeeded
      budget
    }
    mods {
      id
      title
      stage
      category
      description
      productOptions {
        id
      }
    }
  }
`);

const getSettings = graphql(`
  query GetSettings {
    me {
      id
      settings {
        id
        currencyCode
        fuelVolumeUnit
        distanceUnit
        fuelConsumptionUnit
        temperatureUnit
        powerUnit
        torqueUnit
      }
    }
  }
`);

export const TaskCard = forwardRef<
  HTMLDivElement,
  {
    task: FragmentType<typeof TaskFields>;
  } & CardProps
>(({ task, className, ...props }, ref) => {
  const router = useRouter();

  const { data } = useQuery(getSettings);

  const t = useFragment(TaskFields, task);

  const { currencyCode } = useUnits(data?.me?.settings);

  return (
    <KanbanCard
      ref={ref}
      as={Link}
      href={`/cars/${router.query.id}/project/${t.id}`}
      shallow
      className={cn("relative", className)}
      onClick={(e) => {
        e.preventDefault();
      }}
      onPress={() =>
        router.push(`/cars/${router.query.id}/project/${t.id}`, undefined, {
          shallow: true,
        })
      }
      {...props}
    >
      {t.id === "" && (
        <div className="absolute top-0 left-0 w-full h-full bg-background/20 backdrop-blur-xs z-20 rounded-xl flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <CardHeader className="flex flex-col gap-1 pb-0">
        <p className="text-base font-medium">{t.title}</p>
      </CardHeader>

      <CardBody className="text-xs text-muted-foreground flex flex-col gap-1">
        {t.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {t.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 my-1">
          {t.category && (
            <EnumChip
              size="sm"
              item={t.category}
              icons={categoryIcons}
              labels={categoryLabels}
              chipColor={(c) => categoryColors[c]}
              variant="flat"
            />
          )}
          {t.effort && (
            <EnumChip
              size="sm"
              item={t.effort}
              icons={effortIcons}
              labels={effortLabels}
              chipColor={(e) => effortColors[e]}
              variant="flat"
            />
          )}
          {t.difficulty && (
            <EnumChip
              size="sm"
              item={t.difficulty}
              icons={difficultyIcons}
              labels={difficultyLabels}
              chipColor={(d) => difficultyColors[d]}
              variant="flat"
            />
          )}
          {t.priority && (
            <EnumChip
              size="sm"
              item={t.priority}
              icons={priorityIcons}
              labels={priorityLabels}
              chipColor={(p) => priorityColors[p]}
              variant="flat"
            />
          )}
        </div>

        {t.estimate && (
          <div>
            <span className="font-medium">Estimate:</span> {t.estimate}h
          </div>
        )}
        {t.partsNeeded && (
          <div>
            <span className="font-medium">Parts:</span> {t.partsNeeded}
          </div>
        )}
        {t.budget && (
          <div>
            <span className="font-medium">Budget:</span>{" "}
            {t.budget.toLocaleString()} {currencyCode}
          </div>
        )}

        {t.parent && (
          <div className="pt-2 border-t border-border mt-2 flex gap-2 items-center">
            <p className="font-medium text-muted-foreground">Parent:</p>
            <p>{t.parent.title}</p>
          </div>
        )}

        {t.subtasks && t.subtasks.length > 0 && (
          <div className="pt-2 border-t border-border mt-2 flex flex-col gap-1">
            <p className="font-medium text-muted-foreground">Subtasks:</p>
            <ul className="list-disc list-inside">
              {t.subtasks.map((subtask) => (
                <li key={subtask.id}>{subtask.title}</li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </KanbanCard>
  );
});

TaskCard.displayName = "TaskCard";

const MotionTaskCard = motion(TaskCard);

export default function Task({
  task,
  ...props
}: {
  task: FragmentType<typeof TaskFields>;
} & HTMLMotionProps<"button"> & {
    task: FragmentType<typeof TaskFields>;
  }) {
  const t = useFragment(TaskFields, task);

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
    <MotionTaskCard
      task={task}
      ref={
        ((node: HTMLButtonElement) => {
          setNodeRef(node);
          setDropRef(node);
        }) as any
      }
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      {...listeners}
      {...attributes}
      className={cn(isDragging && "invisible pointer-events-none")}
      isPressable
      {...(props as any)}
    />
  );
}
