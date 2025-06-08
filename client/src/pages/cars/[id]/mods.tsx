import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  Spinner,
} from "@heroui/react";
import {
  GetCarWithOwnerQuery,
  ModStatus,
  ModsQuery,
  PowerUnit,
  TorqueUnit,
} from "@/gql/graphql";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { addApolloState, buildClient } from "@/apollo-client";

import CarHead from "@/components/car/head";
import { ComponentProps } from "react";
import { DynoSessionChip } from "@/components/performance/dyno-sessions/chip";
import ModCategoryChip from "@/mods/category-chip";
import PublicCarLayout from "@/components/layout/public-car-layout";
import { auth } from "@/auth";
import { getCarWithOwner } from "@/car/queries";
import { getMods } from "@/mods/shared";
import { getQueryParam } from "@/utils/router";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useUnits } from "@/hooks/use-units";

function ModCard({
  mod,
  ...props
}: {
  mod: NonNullable<
    NonNullable<NonNullable<ModsQuery["car"]["mods"]["edges"]>[number]>["node"]
  >;
  powerUnit: PowerUnit;
  torqueUnit: TorqueUnit;
}) {
  return (
    <Card key={mod.id} className="flex flex-col gap-2">
      <CardHeader className="flex justify-between items-start gap-2">
        <div>
          <h2 className="text-xl font-semibold leading-tight">{mod.title}</h2>
          {mod.stage && (
            <p className="text-sm text-muted-foreground">Stage: {mod.stage}</p>
          )}
        </div>
        <ModCategoryChip category={mod.category} />
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground mb-2">{mod.description}</p>

        {mod.buildLogs && mod.buildLogs.length > 0 && (
          <div className="text-sm text-default-500 space-y-1">
            <p className="font-semibold">Recent Build Logs:</p>
            {mod.buildLogs.slice(0, 2).map((log) => (
              <div
                key={log.id}
                className="text-xs border-l-2 pl-2 border-muted"
              >
                <p className="font-medium">{log.title}</p>
                <p className="text-muted-foreground">
                  {new Date(log.logTime).toLocaleDateString()}
                </p>
              </div>
            ))}
            {mod.buildLogs.length > 2 && (
              <p className="text-xs italic">More logs available...</p>
            )}
          </div>
        )}
      </CardBody>
      {mod.dynoSessions && mod.dynoSessions.length > 0 && (
        <CardFooter>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-default-600 font-semibold">
              Dyno Sessions:
            </p>
            {mod.dynoSessions.map((session) => (
              <DynoSessionChip session={session} key={session.id} {...props} />
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Mods({
  data: carData,
  ...props
}: {
  data: GetCarWithOwnerQuery;
  baseUrl: string;
  basePath: string;
}) {
  const router = useRouter();

  const { data, loading, error, fetchMore } = useQuery(getMods, {
    variables: {
      id: getQueryParam(router.query.id) as string,
      first: 10,
      where: { status: ModStatus.Completed },
    },
    skip: !getQueryParam(router.query.id),
  });

  const { powerUnit, torqueUnit } = useUnits(data?.me?.settings);

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.car.mods.pageInfo.hasNextPage && !loading,
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
    <PublicCarLayout>
      <CarHead car={carData.car} page="mods" {...props} />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-10 text-center">Mods Showcase</h1>

        {error && <p>Error loading mods.</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {data?.car.mods?.edges
            ?.map((e) => e?.node)
            .filter((n) => !!n)
            .map((mod) => (
              <ModCard
                mod={mod}
                key={mod.id}
                powerUnit={powerUnit}
                torqueUnit={torqueUnit}
              />
            ))}

          {loading &&
            Array(10)
              .fill(null)
              .map((_, i) => (
                <Card key={i} className="flex flex-col gap-2 p-4 space-y-4">
                  <Skeleton className="rounded-lg w-4/5">
                    <div className="h-5 bg-default-300 rounded-lg" />
                  </Skeleton>
                  <Skeleton className="rounded-lg w-3/5">
                    <div className="h-4 bg-default-200 rounded-lg" />
                  </Skeleton>
                  <Skeleton className="rounded-lg w-full">
                    <div className="h-16 bg-default-100 rounded-lg" />
                  </Skeleton>
                  <div className="space-y-2">
                    <Skeleton className="w-2/3 rounded-lg">
                      <div className="h-3 bg-default-200 rounded-lg" />
                    </Skeleton>
                    <Skeleton className="w-1/2 rounded-lg">
                      <div className="h-3 bg-default-300 rounded-lg" />
                    </Skeleton>
                  </div>
                </Card>
              ))}
        </div>

        {!loading && data?.car.mods.pageInfo.hasNextPage && (
          <div className="flex w-full justify-center mt-10">
            <Spinner ref={loaderRef} color="white" />
          </div>
        )}
      </div>
    </PublicCarLayout>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<ComponentProps<typeof Mods> & { [key: string]: any }>
> {
  const session = await auth(ctx);
  const client = buildClient({ accessToken: session?.accessToken });

  const { data } = await client.query({
    query: getCarWithOwner,
    variables: { id: getQueryParam(ctx.params?.id)! },
  });

  return {
    props: addApolloState(client, {
      data,
      session,
      baseUrl: new URL(
        (
          process.env.COOLIFY_URL ??
          process.env.BASE_URL ??
          "http://localhost:3001"
        ).split(",")[0]
      ).origin,
      basePath: process.env.BASE_PATH ?? "",
    }),
  };
}
