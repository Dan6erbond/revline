import { Fuel, Gauge, NotebookPen } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import FuelUps from "@/components/maintenance/fuelups";
import Odometer from "@/components/maintenance/odometer";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

const tabs = [
  {
    id: "fuelups",
    label: "Fuel-ups",
    icon: <Fuel />,
    component: FuelUps,
  },
  {
    id: "service-logs",
    label: "Service logs",
    icon: <NotebookPen />,
    disabled: true,
  },
  {
    id: "odometer",
    label: "Odometer",
    icon: <Gauge />,
    component: Odometer,
  },
];

export default function Car() {
  const router = useRouter();

  return (
    <CarLayout>
      <Tabs
        key={getQueryParam(router.query.id)}
        items={tabs}
        variant="bordered"
        selectedKey={getQueryParam(router.query.tab) ?? tabs[0].id}
      >
        {({ id, icon, label, disabled, component: Component }) => (
          <Tab
            key={id}
            title={
              <div className="flex items-center space-x-2">
                {icon}
                <span>{label}</span>
              </div>
            }
            href={`/cars/${router.query.id}/maintenance/${id}`}
            isDisabled={disabled}
          >
            {Component && <Component />}
          </Tab>
        )}
      </Tabs>
    </CarLayout>
  );
}
