import { Drawer, Switch } from "@heroui/react";
import { Suspense, useState } from "react";

import CarLayout from "@/components/layout/car-layout";
import Kanban from "@/components/project/kanban";
import TaskDrawerContent from "@/components/project/drawer-content";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

export default function Project() {
  const router = useRouter();
  const taskId = getQueryParam(router.query["task-id"]);

  const onClose = () =>
    router.push(`/cars/${router.query.id}/project`, undefined, {
      shallow: true,
    });

  const [showSubtasks, setShowSubtasks] = useState(false);

  return (
    <CarLayout className="p-4 md:p-8 flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Project</h1>

        <Switch
          size="sm"
          isSelected={showSubtasks}
          onValueChange={setShowSubtasks}
        >
          Show subtasks
        </Switch>
      </div>

      <Kanban showSubtasks={showSubtasks} />

      <Drawer isOpen={taskId != null} onClose={onClose}>
        <Suspense fallback="Loading...">
          {taskId && (
            <TaskDrawerContent id={taskId} onClose={onClose} key={taskId} />
          )}
        </Suspense>
      </Drawer>
    </CarLayout>
  );
}
