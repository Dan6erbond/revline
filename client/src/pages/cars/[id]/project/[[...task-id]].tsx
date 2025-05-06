import { Drawer, Switch, addToast } from "@heroui/react";
import { Suspense, useState } from "react";

import CarLayout from "@/components/layout/car-layout";
import { CircleAlert } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import Kanban from "@/components/project/kanban";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
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
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-4 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
        maxHeight: "calc(100vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

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
        <ErrorBoundary
          fallback="Error"
          onError={(error: Error) => {
            addToast({
              title: "An error occurred!",
              icon: <CircleAlert color="hsl(var(--heroui-danger-200))" />,
              description: error.message,
              color: "danger",
            });
            onClose();
          }}
        >
          <Suspense fallback="Loading...">
            {taskId && (
              <TaskDrawerContent id={taskId} onClose={onClose} key={taskId} />
            )}
          </Suspense>
        </ErrorBoundary>
      </Drawer>
    </CarLayout>
  );
}
