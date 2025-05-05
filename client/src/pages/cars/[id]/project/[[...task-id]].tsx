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

  const onClose = () =>
    router.push(`/cars/${router.query.id}/project`, undefined, {
      shallow: true,
    });

  return (
    <CarLayout>
      <Kanban />

      <Drawer isOpen={taskId != null} onClose={onClose}>
        <Suspense fallback="Loading...">
          {taskId && <TaskDrawerContent id={taskId} onClose={onClose} />}
        </Suspense>
      </Drawer>
    </CarLayout>
  );
}
