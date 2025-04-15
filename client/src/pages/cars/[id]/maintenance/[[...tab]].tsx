import { Fuel, NotebookPen } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";

import CarNavbar from "../../../../components/layout/car-navbar";
import FuelUps from "../../../../components/maintenance/fuelups";
import { getQueryParam } from "../../../../utils/router";
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
  },
];

export default function Car() {
  const router = useRouter();

  return (
    <>
      <CarNavbar />
      <main className="p-4 md:p-8">
        <Tabs
          key={getQueryParam(router.query.id)}
          items={tabs}
          variant="bordered"
          selectedKey={getQueryParam(router.query.tab) ?? tabs[0].id}
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
              href={`/cars/${router.query.id}/maintenance/${id}`}
            >
              {Component && <Component />}
            </Tab>
          )}
        </Tabs>
      </main>
    </>
  );
}
