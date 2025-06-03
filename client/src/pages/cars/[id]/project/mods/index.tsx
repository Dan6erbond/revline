import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tab,
  Tabs,
} from "@heroui/react";
import { KanbanIcon, Lightbulb, Plus } from "lucide-react";
import {
  categoryColors,
  categoryIcons,
  categoryLabels,
  statusColors,
  statusIcons,
  statusLabels,
} from "@/mods/shared";

import CarLayout from "@/components/layout/car-layout";
import Link from "next/link";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getMods = graphql(`
  query Mods($id: ID!) {
    car(id: $id) {
      id
      mods {
        id
        title
        stage
        category
        status
        description
        productOptions {
          id
        }
      }
    }
  }
`);

export default function Mods() {
  const router = useRouter();

  const { data, loading, error } = useQuery(getMods, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const mods = data?.car?.mods ?? [];

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-2 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <Tabs variant="underlined" selectedKey="mods">
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
        />
        <Tab
          key="mods"
          title={
            <div className="flex items-center space-x-2">
              <Lightbulb />
              <span>Mods</span>
            </div>
          }
          href={`/cars/${router.query.id}/project/mods`}
          className="flex flex-col gap-4 container mx-auto"
        >
          <div className="flex justify-between">
            <h1 className="text-2xl">Mods</h1>

            <Button
              as={Link}
              startContent={<Plus />}
              href={`/cars/${router.query.id}/project/mods/create`}
            >
              Add
            </Button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p>Error loading mods.</p>}

          <div className="flex flex-col gap-3">
            {mods.map((mod) => {
              const CategoryIcon = categoryIcons[mod.category];
              const StatusIcon = statusIcons[mod.status];

              return (
                <Card
                  key={mod.id}
                  as={Link}
                  isPressable
                  href={`/cars/${router.query.id}/project/mods/${mod.id}`}
                >
                  <CardHeader className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-md font-medium">{mod.title}</div>
                      <div className="text-xs text-default-500">
                        Stage: {mod.stage}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Chip
                        startContent={
                          <CategoryIcon className="h-3.5 w-3.5 ml-1" />
                        }
                        color={categoryColors[mod.category]}
                      >
                        {categoryLabels[mod.category]}
                      </Chip>
                      <Chip
                        startContent={
                          <StatusIcon className="h-3.5 w-3.5 ml-1" />
                        }
                        color={statusColors[mod.status]}
                      >
                        {statusLabels[mod.status]}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="flex flex-col gap-1">
                    <div className="text-sm text-content4-foreground">
                      {mod.description}
                    </div>
                    <div className="text-sm text-content4">
                      {mod.productOptions?.length} Options
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Tab>
      </Tabs>
    </CarLayout>
  );
}
