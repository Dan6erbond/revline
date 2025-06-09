import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { KanbanIcon, Lightbulb, Plus, WrenchIcon } from "lucide-react";

import CarLayout from "@/components/layout/car-layout";
import Link from "next/link";
import ModCategoryChip from "@/mods/category-chip";
import ModStatusChip from "@/mods/status-chip";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { getMods } from "@/mods/shared";
import { getQueryParam } from "@/utils/router";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export default function Mods() {
  const router = useRouter();

  const { data, loading, error, fetchMore } = useQuery(getMods, {
    variables: { id: getQueryParam(router.query.id) as string, first: 10 },
    skip: !getQueryParam(router.query.id),
  });

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.car.mods.pageInfo.hasNextPage,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.car.mods.edges &&
      fetchMore({
        variables: {
          after: data.car.mods.edges[data.car.mods.edges.length - 1]?.cursor,
        },
      }),
  });

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

          <div className="flex flex-col gap-4 md:gap-6">
            {data?.car?.mods.edges
              ?.map((e) => e?.node)
              .filter((n) => !!n)
              .map((mod) => (
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
                      <ModCategoryChip category={mod.category} />
                      <ModStatusChip status={mod.status} />
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
              ))}

            {data?.car.mods.pageInfo.hasNextPage && (
              <div className="flex w-full justify-center">
                <Spinner ref={loaderRef} color="white" />
              </div>
            )}
          </div>
        </Tab>
        <Tab
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
