import { CircleAlert, KanbanIcon, Lightbulb } from "lucide-react";
import { Drawer, Tab, Tabs, addToast } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import { ErrorBoundary } from "react-error-boundary";
import Kanban from "@/components/project/kanban";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { Suspense } from "react";
import TaskDrawerContent from "@/components/project/drawer-content";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

export default function Task() {
  const router = useRouter();
  const taskId = getQueryParam(router.query["task-id"]);

  const onClose = () =>
    router.push(`/cars/${router.query.id}/project`, undefined, {
      shallow: true,
    });

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-4 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
        maxHeight: "calc(100vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <Tabs variant="underlined" selectedKey="kanban">
        <Tab
          key="kanban"
          title={
            <div className="flex items-center space-x-2">
              <KanbanIcon />
              <span>Kanban</span>
            </div>
          }
          href={`/cars/${router.query.id}/project`}
          className="flex-1 flex flex-col gap-4"
        >
          <Kanban />
        </Tab>
        <Tab
          key="mods"
          title={
            <div className="flex items-center space-x-2">
              <Lightbulb />
              <span>Mods</span>
            </div>
          }
          href={`/cars/${router.query.id}/project/mods`}
        />
      </Tabs>

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
