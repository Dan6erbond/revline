import { KanbanIcon, Lightbulb, WrenchIcon } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import Kanban from "@/components/project/kanban";
import Link from "next/link";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { useRouter } from "next/router";

export default function Project() {
  const router = useRouter();

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-2 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
        maxHeight: "calc(100vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <Tabs variant="underlined" selectedKey="kanban">
        <Tab
          as={Link}
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
          as={Link}
          key="mods"
          title={
            <div className="flex items-center space-x-2">
              <Lightbulb />
              <span>Mods</span>
            </div>
          }
          href={`/cars/${router.query.id}/project/mods`}
        />
        <Tab
          as={Link}
          key="build-log"
          title={
            <div className="flex items-center space-x-2">
              <WrenchIcon />
              <span>Build Log</span>
            </div>
          }
          href={`/cars/${router.query.id}/project/build-log`}
          className="flex-1 flex flex-col gap-4"
        />
      </Tabs>
    </CarLayout>
  );
}
