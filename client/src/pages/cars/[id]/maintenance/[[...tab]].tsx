import { ComponentType, ReactNode } from "react";
import { Gauge, NotebookPen } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import Link from "next/link";
import Odometer from "@/components/maintenance/odometer";
import Service from "@/components/maintenance/service";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

const tabs: {
  id: string;
  label: string;
  icon: ReactNode;
  component?: ComponentType;
}[] = [
  {
    id: "service",
    label: "Service",
    icon: <NotebookPen />,
    component: Service,
  },
  {
    id: "odometer",
    label: "Odometer",
    icon: <Gauge />,
    component: Odometer,
  },
];

export default function Maintenance() {
  const router = useRouter();

  return (
    <CarLayout>
      <Tabs
        key={getQueryParam(router.query.id)}
        items={tabs}
        variant="underlined"
        selectedKey={
          getQueryParam(router.query.tab) ??
          tabs.filter((tab) => tab.component)[0].id
        }
        className="mt-2"
      >
        {({ id, icon, label, component: Component }) => (
          <Tab
            as={Link}
            key={id}
            title={
              <div className="flex items-center space-x-2">
                {icon}
                <span>{label}</span>
              </div>
            }
            href={`/cars/${router.query.id}/maintenance/${id}`}
            isDisabled={Component == null}
          >
            <div className="p-4 md:p-8">{Component && <Component />}</div>
          </Tab>
        )}
      </Tabs>
    </CarLayout>
  );
}
