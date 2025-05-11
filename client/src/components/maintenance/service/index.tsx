import {
  Briefcase,
  CalendarDays,
  Car,
  CheckCircle,
  ClipboardList,
  FileText,
  Gauge,
  ListChecks,
  Repeat,
  Wrench,
} from "lucide-react";
import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
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
      settings {
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
            estimatedMinutes
            defaultIntervalKm
            defaultIntervalMonths
            tags
          }
          repeatEveryKm
          repeatEveryMonths
          startsAtKm
          startsAtMonths
          archived
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
    <div className="container mx-auto">
      <div className="flex flex-col gap-6 mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />{" "}
          {/* Or other relevant icon */}
          <h2 className="text-2xl font-semibold text-content1-foreground">
            Upcoming Services
          </h2>
        </div>

        {(!data?.car.upcomingServices ||
          data?.car.upcomingServices.length === 0) && (
          <div className="bg-content1 p-6 rounded-lg text-center">
            <Car className="w-12 h-12 mx-auto mb-4 text-default-500" />
            <p className="text-lg font-medium text-content1-foreground">
              No upcoming services.
            </p>
            <p className="text-sm text-default-400">
              Your vehicle is all set for now!
            </p>
          </div>
        )}

        {data?.car.upcomingServices?.map((us) => (
          <div
            key={us.schedule.id}
            className="bg-content1 rounded-xl shadow-lg overflow-hidden border border-content2"
          >
            {/* Using a custom header structure for more flexibility than a simple CardHeader */}
            <div className="bg-content2 p-4 sm:p-5 border-b border-content3">
              <h3 className="text-lg font-semibold text-primary">
                {us.schedule.title}
              </h3>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm">
                {us.nextDueDate && (
                  <div className="flex items-center gap-1.5 text-content1-foreground">
                    <CalendarDays className="w-4 h-4 text-secondary" />
                    <span>
                      Due:{" "}
                      <span className="font-medium">
                        {new Date(us.nextDueDate).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                )}
                {us.nextDueKm && (
                  <div className="flex items-center gap-1.5 text-content1-foreground">
                    <Gauge className="w-4 h-4 text-secondary" />
                    <span>
                      At:{" "}
                      <span className="font-medium">
                        {us.nextDueKm.toLocaleString()} km
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Using div instead of CardBody for custom layout */}
              {us.schedule.items && us.schedule.items.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-default-500 mb-2 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Service Items
                  </h4>
                  <ul className="space-y-2.5">
                    {us.schedule.items.map((i) => (
                      <li key={i.id} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-content1-foreground">{i.label}</p>
                          {i.notes && (
                            <p className="text-xs text-default-400 italic mt-0.5">
                              {i.notes}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {us.schedule.notes && (
                <div>
                  <h4 className="text-sm font-medium text-default-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </h4>
                  <p className="text-sm text-content1-foreground bg-content2 p-3 rounded-md border border-content3">
                    {us.schedule.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Tabs
        key={getQueryParam(router.query.id)}
        items={tabs}
        variant="bordered"
        selectedKey={
          router.query.tab?.[1] ?? tabs.filter((tab) => tab.component)[0].id
        }
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
    </div>
  );
}
