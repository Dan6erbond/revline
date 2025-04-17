import { ClipboardList, Repeat, Wrench } from "lucide-react";
import { ComponentType, ReactNode } from "react";
import { Tab, Tabs } from "@heroui/react";

import Logs from "./logs";
import { getQueryParam } from "../../../utils/router";
import { useRouter } from "next/router";

const tabs: {
  id: string;
  label: string;
  icon: ReactNode;
  component?: ComponentType;
  disabled?: boolean;
}[] = [
  {
    id: "logs",
    label: "Logs",
    icon: <ClipboardList />,
    component: Logs,
  },
  {
    id: "items",
    label: "Items",
    icon: <Wrench />,
  },
  {
    id: "schedules",
    label: "Schedules",
    icon: <Repeat />,
  },
];

export default function Service() {
  const router = useRouter();

  return (
    <>
      <Tabs
        key={getQueryParam(router.query.id)}
        items={tabs}
        variant="bordered"
        selectedKey={router.query.tab?.[1] ?? tabs[0].id}
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
            href={`/cars/${router.query.id}/maintenance/service/${id}`}
            isDisabled={disabled}
          >
            {Component && <Component />}
          </Tab>
        )}
      </Tabs>
    </>
  );
}
