import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { ClipboardList, Repeat, Wrench } from "lucide-react";
import { ComponentType, ReactNode } from "react";

import Items from "./items";
import Logs from "./logs";
import Schedules from "./schedules";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
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
    component: Items,
  },
  {
    id: "schedules",
    label: "Schedules",
    icon: <Repeat />,
    component: Schedules,
  },
];

const getUpcomingServices = graphql(`
  query GetUpcomingServices($id: ID!) {
    me {
      id
      profile {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      upcomingServices {
        nextDueKm
        nextDueDate
        schedule {
          id
          title
          notes
          items {
            id
            label
            notes
            estimatedDuration
            defaultIntervalKm
            defaultIntervalMonths
            tags
            createdAt
            updatedAt
          }
          repeatEveryKm
          repeatEveryMonths
          startsAtKm
          startsAtDate
          archived
          createdAt
          updatedAt
        }
      }
    }
  }
`);

export default function Service() {
  const router = useRouter();

  const { data } = useQuery(getUpcomingServices, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl mb-2">Upcoming services</h2>
        {data?.car?.upcomingServices.map((us) => (
          <Card key={us.schedule.id}>
            <CardHeader>{us.schedule.title}</CardHeader>
            <CardBody className="flex flex-col gap-2">
              <p>Items</p>
              <ul className="list-disc ml-4">
                {us.schedule.items.map((i) => (
                  <li key={i.id}>
                    <p>{i.label}</p>
                    <p className="text-sm text-default-400">{i.notes}</p>
                  </li>
                ))}
              </ul>
              {us.schedule.notes && (
                <>
                  <p>Notes</p>
                  <p>{us.schedule.notes}</p>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
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
