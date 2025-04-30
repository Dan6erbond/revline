import { ChartLine, Flag, TimerReset } from "lucide-react";
import { ComponentType, ReactNode } from "react";
import { Tab, Tabs } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import DragSessions from "@/components/performance/drag-sessions";
import DynoSessions from "@/components/performance/dyno-sessions";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

const tabs: {
  id: string;
  label: string;
  icon: ReactNode;
  component?: ComponentType;
}[] = [
  {
    id: "track-days",
    label: "Track days",
    icon: <Flag />,
  },
  {
    id: "drag-sessions",
    label: "Drag sessions",
    icon: <TimerReset />,
    component: DragSessions,
  },
  {
    id: "dyno-sessions",
    label: "Dyno",
    icon: <ChartLine />,
    component: DynoSessions,
  },
];

export default function Performance() {
  const router = useRouter();

  return (
    <CarLayout>
      <Tabs
        key={getQueryParam(router.query.id)}
        items={tabs}
        variant="underlined"
        selectedKey={getQueryParam(router.query.tab) ?? tabs[0].id}
        className="mt-2"
      >
        {({ id, icon, label, component: Component }) => (
          <Tab
            key={id}
            title={
              <div className="flex items-center space-x-2">
                {icon}
                <span>{label}</span>
              </div>
            }
            href={`/cars/${router.query.id}/performance/${id}`}
            isDisabled={Component == null}
          >
            <div className="p-4 md:p-8">{Component && <Component />}</div>
          </Tab>
        )}
      </Tabs>
    </CarLayout>
  );
}
