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
import { categoryColors, categoryIcons, categoryLabels } from "@/mods/shared";

import CarLayout from "@/components/layout/car-layout";
import Link from "next/link";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getModIdeas = graphql(`
  query ModIdeas($id: ID!) {
    car(id: $id) {
      id
      modIdeas {
        id
        title
        stage
        category
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

  const { data, loading, error } = useQuery(getModIdeas, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const ideas = data?.car?.modIdeas ?? [];

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
          {error && <p>Error loading mod ideas.</p>}

          <div className="flex flex-col gap-3">
            {ideas.map((idea) => {
              const Icon = categoryIcons[idea.category];

              return (
                <Card
                  key={idea.id}
                  as={Link}
                  isPressable
                  href={`/cars/${router.query.id}/project/mods/${idea.id}`}
                >
                  <CardHeader className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-md font-medium">{idea.title}</div>
                      <div className="text-xs text-default-500">
                        Stage: {idea.stage}
                      </div>
                    </div>
                    <Chip
                      startContent={<Icon className="h-3.5 w-3.5 ml-1" />}
                      color={categoryColors[idea.category]}
                    >
                      {categoryLabels[idea.category]}
                    </Chip>
                  </CardHeader>
                  <CardBody className="flex flex-col gap-1">
                    <div className="text-sm text-content4-foreground">
                      {idea.description}
                    </div>
                    <div className="text-sm text-content4">
                      {idea.productOptions?.length} Options
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
