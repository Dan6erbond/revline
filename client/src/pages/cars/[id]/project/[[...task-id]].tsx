import CarLayout from "@/components/layout/car-layout";
import { Drawer } from "@heroui/react";
import Kanban from "@/components/project/kanban";
import { Suspense } from "react";
import TaskDrawerContent from "@/components/project/drawer-content";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

export default function Project() {
  const router = useRouter();
  const taskId = getQueryParam(router.query["task-id"]);

  return (
    <CarLayout>
      <Kanban />

      <Drawer
        isOpen={taskId != null}
        onClose={() => router.push(`/cars/${router.query.id}/project`)}
      >
        <Suspense fallback="Loading...">
          {taskId && (
            <TaskDrawerContent
              id={taskId}
              onClose={() => router.push(`/cars/${router.query.id}/project`)}
            />
          )}
        </Suspense>
      </Drawer>
    </CarLayout>
  );
}
